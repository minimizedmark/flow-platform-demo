import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST() {
  // Guard: ensure STRIPE server keys are present before attempting to create a session
  const stripeSecret = process.env.STRIPE_SECRET_KEY
  const priceId = process.env.STRIPE_FOUNDING_PRICE_ID
  const baseUrl = process.env.NEXTAUTH_URL || 'https://yourdomain.com'

  if (!stripeSecret || !priceId) {
    return NextResponse.json(
      { error: 'Stripe not configured', message: 'Checkout unavailable: Stripe keys missing', disabled: true },
      { status: 503 }
    )
  }

  const stripe = new Stripe(stripeSecret)

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}`,
      metadata: {
        type: 'founding_member',
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (err: any) {
    console.error('Stripe checkout creation failed', err)
    return NextResponse.json({ error: 'Stripe error', message: err?.message || 'Unknown error' }, { status: 500 })
  }
}
