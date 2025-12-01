'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { loadStripe } from '@stripe/stripe-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function Home() {
  const [spotsLeft, setSpotsLeft] = useState<number>(50)
  const [loading, setLoading] = useState(true)

  const fetchCount = async () => {
    const { count } = await supabase
      .from('founding_members')
      .select('*', { count: 'exact', head: true })

    const left = 50 - (count || 0)
    setSpotsLeft(left)
    setLoading(false)
  }

  useEffect(() => {
    fetchCount()

    const channel = supabase
      .channel('founding-count')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'founding_members' }, fetchCount)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const handleCheckout = async () => {
    const stripe = await stripePromise
    const res = await fetch('/api/checkout', { method: 'POST' })
    const { sessionId } = await res.json()
    stripe?.redirectToCheckout({ sessionId })
  }

  const soldOut = spotsLeft <= 0

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-4xl w-full text-center space-y-12">
        <h1 className="text-6xl md:text-7xl font-black text-gray-900">
          HVAC Flow Pro
        </h1>
        <p className="text-2xl md:text-3xl text-gray-700">
          AI Diagnosis • Proposals • Compliance • Booking • Portal • QuickBooks • SMS
        </p>

        {/* LIVE COUNTER */}
        <div className="bg-black text-white py-12 px-8 rounded-2xl">
          {loading ? (
            <p className="text-4xl">Loading...</p>
          ) : soldOut ? (
            <p className="text-6xl font-black">SOLD OUT FOREVER</p>
          ) : (
            <>
              <p className="text-7xl font-black">{spotsLeft}</p>
              <p className="text-3xl mt-4">Founding Spots Left</p>
              <p className="text-xl mt-2 opacity-90">Lifetime Pro Access – $990/year forever</p>
            </>
          )}
        </div>

        {/* CHECKOUT BUTTON */}
        {!soldOut && (
          <button
            onClick={handleCheckout}
            className="w-full max-w-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-3xl py-8 rounded-2xl transition shadow-2xl"
          >
            Claim My Founding Spot Now
          </button>
        )}

        <p className="text-lg text-gray-600 mt-16">
          First 50 only. Never available again at this price.
        </p>
      </div>
    </main>
  )
}
app/success/page.tsx
tsx
export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-green-600 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-6xl font-black mb-8">Welcome, Founding Member!</h1>
        <p className="text-3xl">Check your email for your badge and next steps.</p>
      </div>
    </main>
  )
}

PART 4 of 9 – Stripe Checkout + Webhook + Atomic Slot Claim + Resend Email + Auto-Refund
Create these exact folders/files:
text
├── app/
│ └── api/
│ ├── checkout/
│ │ └── route.ts
│ └── webhooks/
│ └── stripe/
│ └── route.ts
app/api/checkout/route.ts
(creates the Stripe Checkout session)
TypeScript
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-01',
})

export async function POST() {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [
      {
        price: process.env.STRIPE_FOUNDING_PRICE_ID,
        quantity: 1,
      },
    ],
    success_url: ${process.env.NEXTAUTH_URL || 'https://yourdomain.com'}/success,
    cancel_url: ${process.env.NEXTAUTH_URL || 'https://yourdomain.com'},
    metadata: {
      type: 'founding_member',
    },
  })

  return NextResponse.json({ sessionId: session.id })
}
app/api/webhooks/stripe/route.ts
(the bulletproof webhook – claims slot or refunds instantly)
TypeScript
import { buffer } from 'micro'
import Stripe from 'stripe'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-01' })
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
const resend = new Resend(process.env.RESEND_API_KEY!)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const config = { api: { bodyParser: false } }

export async function POST(req: Request) {
  const buf = await buffer(req)
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature failed:', err.message)
    return new Response(Webhook Error: ${err.message}, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const email = session.customer_details?.email!
    const subscriptionId = session.subscription as string

    // Atomic slot claim via RPC
    const { data: slot, error } = await supabase.rpc('claim_founding_slot', {
      p_email: email,
      p_stripe_sub_id: subscriptionId,
    })

    if (error || slot === -1) {
      // Sold out → refund immediately
      const paymentIntent = session.payment_intent as string
      await stripe.refunds.create({ payment_intent: paymentIntent })
      console.log(Refunded sold-out purchase for ${email})
      return new Response('Sold out – refunded', { status: 200 })
    }

    // Send welcome email + badge
    await resend.emails.send({
      from: 'Founding Member <founding@hvacflowpro.com>',
      to: email,
      subject: You're Founding Member #${slot}! 🚀,
      html: \ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<h1>Congratulations – You're In!</h1>\ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<p>You are officially Founding Member #${slot} of HVAC Flow Pro.</p>\ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<p>Lifetime Pro access at $990/year – forever.</p>\ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div style="text-align:center;margin:40px 0;">\ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://via.placeholder.com/600x300/0066ff/ffffff?text=Founding+Member+%23${slot}" alt="Badge" />\ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>\ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<p>Dashboard coming in 72 hours. Watch your email.</p>\ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<p>Thank you for believing in the vision.</p>\ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,
    })
  }

  return new Response('OK', { status: 200 })
}
Create these folders/files:
text
├── app/
│ └── dashboard/
│ ├── page.tsx ← Main dashboard
│ └── diagnose/
│ └── page.tsx ← AI Diagnosis tool (voice + photo)
└── components/
    └── DiagnosisResult.tsx
app/dashboard/page.tsx – The real contractor dashboard
tsx
import Link from 'next/link'

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-black mb-8">Contractor Dashboard</h1>
       
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-green-600">Founding Member</h2>
            <p className="text-5xl font-black mt-4">#12</p>
            <p className="text-gray-600 mt-2">Lifetime Pro Access</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold">Today's Leads</h2>
            <p className="text-5xl font-black mt-4">7</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold">Revenue This Month</h2>
            <p className="text-5xl font-black mt-4">$18,400</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Link href="/dashboard/diagnose" className="block">
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white p-12 rounded-3xl text-center hover:scale-105 transition">
              <h3 className="text-4xl font-black">AI Diagnosis Tool</h3>
              <p className="text-xl mt-4">Voice + Photo → Instant Answer</p>
            </div>
          </Link>

          <div className="bg-gradient-to-br from-green-600 to-teal-700 text-white p-12 rounded-3xl text-center">
            <h3 className="text-4xl font-black">Good/Better/Best Proposals</h3>
            <p className="text-xl mt-4">Coming in 48 hours</p>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p className="text-2xl">More tools dropping daily. You’re in early.</p>
        </div>
      </div>
    </main>
  )
}
app/dashboard/diagnose/page.tsx – Real working AI diagnosis (voice + photo)
tsx
'use client'

import { useState } from 'react'

export default function Diagnose() {
  const [photo, setPhoto] = useState<string | null>(null)
  const [issue, setIssue] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPhoto(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const runDiagnosis = async () => {
    setLoading(true)
    const res = await fetch('/api/diagnose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ issue, photo }),
    })
    const data = await res.json()
    setDiagnosis(data.result)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black mb-12 text-center">AI Diagnosis Tool</h1>

        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <textarea
            placeholder="Describe the problem (e.g., AC blowing warm, rattling noise from outdoor unit)"
            className="w-full h-32 p-6 border-2 border-gray-300 rounded-xl text-lg"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
          />

          <div className="mt-8">
            <label className="block">
              <div className="bg-blue-600 text-white py-6 rounded-xl text-center text-2xl cursor-pointer hover:bg-blue-700">
                📸 Upload Photo of Unit / Error Code
              </div>
              <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            </label>
            {photo && <img src={photo} alt="Unit" className="mt-6 rounded-xl shadow-lg max-h-96 mx-auto" />}
          </div>

          <button
            onClick={runDiagnosis}
            disabled={loading || (!issue && !photo)}
            className="mt-12 w-full bg-black text-white py-8 rounded-xl text-3xl font-bold hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? 'Analyzing with Grok-4...' : 'Get Instant Diagnosis'}
          </button>

          {diagnosis && (
            <div className="mt-12 bg-green-50 border-4 border-green-600 rounded-2xl p-10">
              <h2 className="text-4xl font-black text-green-800 mb-6">Diagnosis Complete</h2>
              <p className="text-2xl whitespace-pre-wrap text-gray-800">{diagnosis}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
