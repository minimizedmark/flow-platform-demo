import Stripe from 'stripe'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const stripeSecret = process.env.STRIPE_SECRET_KEY
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
const resendKey = process.env.RESEND_API_KEY
const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY

// If Stripe webhook secret or stripe key is missing, respond 204 to avoid errors
if (!stripeSecret || !webhookSecret) {
  console.warn('Stripe webhook disabled: missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET')
}

const stripe = stripeSecret ? new Stripe(stripeSecret) : (null as any)
const resend = resendKey ? new Resend(resendKey) : (null as any)
const supabase = hasSupabase
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  : (null as any)

export async function POST(req: Request) {
  if (!stripe || !webhookSecret) {
    // Webhooks not configured — respond OK so Stripe doesn't repeatedly retry in misconfigured deployments
    return new Response('Webhooks not configured', { status: 204 })
  }

  // In Next.js App Router, req.text() gives us the raw body as a string
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature failed:', err?.message)
    return new Response(`Webhook Error: ${err?.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const email = session.customer_details?.email!
    const subscriptionId = session.subscription as string

    // If supabase or resend isn't configured, we can log and skip heavy work.
    if (!supabase) {
      console.warn('Supabase not configured — skipping slot claim. Email:', email)
      return new Response('Supabase not configured — webhook ignored', { status: 200 })
    }

    // Existing RPC mentioned in project (claim_founding_slot) — guard the call
    try {
      const { data: slot, error } = await supabase.rpc('claim_founding_slot', {
        p_email: email,
        p_stripe_sub_id: subscriptionId,
      })

      if (error || slot === -1) {
        // Sold out → refund immediately
        const paymentIntent = session.payment_intent as string
        await stripe.refunds.create({ payment_intent: paymentIntent })
        console.log(`Refunded sold-out purchase for ${email}`)
        return new Response('Sold out – refunded', { status: 200 })
      }

      // Send welcome email if Resend configured
      if (resend) {
        await resend.emails.send({
          from: 'Founding Member <founding@hvacflowpro.com>',
          to: email,
          subject: `You're Founding Member #${slot}! 🚀`,
          html: `<h1>Welcome — Founding Member #${slot}</h1>`,
        })
      } else {
        console.log('Resend not configured — email not sent for', email)
      }
    } catch (err) {
      console.error('Error handling checkout.session.completed', err)
    }
  }

  return new Response('OK', { status: 200 })
}
