import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { priceId, isCustom, userId } = body;

    // Determine the origin for success/cancel URLs
    const origin = req.headers.get('origin') || 'http://localhost:8080';

    if (isCustom) {
      // Custom plans could be handled differently
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        client_reference_id: userId,
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'NEURAL SECTOR (Custom Plan)',
                description: 'Enterprise-grade structural integrity for major institutions.',
              },
              unit_amount: 50000, // Default $500 for custom intent
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/cancel`,
      });
      return NextResponse.json({ url: session.url });
    }

    if (!priceId) {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 });
    }

    // Create Checkout Sessions for subscriptions
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      client_reference_id: userId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      metadata: {
        priceId: priceId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
