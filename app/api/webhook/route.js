import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;

  try {
    if (!endpointSecret) {
      console.warn("STRIPE_WEBHOOK_SECRET is not set. Skipping signature verification (Not for production).");
      event = JSON.parse(body);
    } else {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    }
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const { createClient } = await import('@supabase/supabase-js');
  const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
  );

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const userId = session.client_reference_id;
      
      if (userId) {
        console.log('✅ FULFILLING: Upgrading user:', userId);
        const { error } = await supabaseAdmin
          .from('profiles')
          .upsert({
            user_id: userId,
            plan: 'pro',
            sop_limit: 500,
            log_limit: 500,
            subscription_status: 'active',
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });

        if (error) console.error('❌ FULFILLMENT ERROR:', error.message);
        else console.log('🚀 FULFILLMENT SUCCESS: User upgraded to 500 limit.');
      }
      break;

    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      console.log('💳 Recurring payment succeeded:', invoice.id);
      break;

    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      console.log('❌ Subscription cancelled:', subscription.id);
      // Revoke access in database
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
