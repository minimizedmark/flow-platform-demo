'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

/**
 * Safe runtime checks:
 * - NEXT_PUBLIC_* env vars are inlined during build. If they're missing,
 *   we create safe mocks so the UI can still render and you can deploy.
 */

// Supabase: only create real client if env vars are present. Otherwise use a tiny mock.
const hasSupabase =
  typeof process !== 'undefined' &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase: any = hasSupabase
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  : {
      // minimal mock surface used by this page
      from: () => ({
        select: async (_: string, __?: any) => {
          return { count: 0 }
        },
      }),
      channel: () => ({
        on: () => ({
          subscribe: () => ({}),
        }),
      }),
      removeChannel: () => {},
    }

export default function Home() {
  const [spotsLeft, setSpotsLeft] = useState<number>(50)
  const [loading, setLoading] = useState(true)
  const [checkoutAvailable, setCheckoutAvailable] = useState<boolean>(true)

  const fetchCount = async () => {
    try {
      // If supabase is mocked, it returns a count of 0 so spots left stays at 50
      const { count } = await supabase
        .from('founding_members')
        .select('*', { count: 'exact', head: true })

      const left = 50 - (count || 0)
      setSpotsLeft(left)
    } catch (err) {
      // Safe fallback: assume all slots available when Supabase is not configured
      setSpotsLeft(50)
      console.warn('Supabase unavailable or query failed', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCount()

    // Only subscribe to real Supabase channels if we have a real client
    if (hasSupabase) {
      const channel = supabase
        .channel('founding-count')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'founding_members' }, fetchCount)
        .subscribe()

      return () => { supabase.removeChannel(channel) }
    }
  }, [])

  const handleCheckout = async () => {
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })

      if (!res.ok) {
        // API responds with 503 + JSON when Stripe not configured
        const body = await res.json().catch(() => ({}))
        const message = body?.message || 'Checkout is not available right now.'
        alert(message)
        setCheckoutAvailable(false)
        return
      }

      const { url } = await res.json()

      if (!url) {
        // Stripe publishable key missing — fallback UX
        alert('Stripe is not configured in this deployment. You will be able to checkout once Stripe is connected.')
        return
      }

      window.location.href = url
    } catch (err) {
      console.error('Checkout failed', err)
      alert('Checkout failed. Try again later.')
    }
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
        {!soldOut && checkoutAvailable && (
          <button
            onClick={handleCheckout}
            className="w-full max-w-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-3xl py-8 rounded-2xl transition shadow-2xl"
          >
            Claim My Founding Spot Now
          </button>
        )}

        {!checkoutAvailable && (
          <div className="w-full max-w-2xl bg-gray-200 text-gray-800 font-bold text-2xl py-6 rounded-2xl">
            Checkout is disabled in this deployment. Connect Stripe to enable it.
          </div>
        )}

        <p className="text-lg text-gray-600 mt-16">
          First 50 only. Never available again at this price.
        </p>
      </div>
    </main>
  )
}
