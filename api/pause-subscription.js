// Pause or resume a membership -- the "seasonal rider" feature. Someone who
// stops training over winter can stop being billed without losing their
// account, history, or training plan.
//
// WHY cancel_at_period_end AND NOT pause_collection:
// The obvious tool looks like Stripe's `pause_collection`, but it's wrong
// for this. With pause_collection the subscription stays alive forever:
// Stripe keeps rolling the billing period over and voiding each invoice, so
// the "paid through" date keeps moving, access never legitimately lapses,
// and resuming months later charges nothing until the next rollover -- a
// rider could pause an annual plan and come back to nearly a free year.
// It also leaves zombie subscriptions on the account for anyone who never
// returns.
//
// cancel_at_period_end does exactly what we actually promise the rider:
// billing stops immediately, they keep riding until the period they've
// already paid for runs out, and then it ends cleanly. Nothing is charged
// in between, there's no rollover to leak access through, and Stripe tidies
// up on its own if they never come back.
//
// The useful consequence: a rider can only be in the "paused" state while
// they still have access. Pause and access always end at the same moment,
// so there's no window where someone is paused but locked out.
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit } from './_rateLimit.js';
import { verifyUser } from './_auth.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const SUPABASE_URL = 'https://wxwdqqjzfrfddqcgkrfv.supabase.co';
const supabaseAdmin = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Stripe moved current_period_end onto subscription items in newer API
// versions; accept either shape rather than assuming one.
export function periodEndIso(subscription) {
  const seconds =
    subscription?.current_period_end ??
    subscription?.items?.data?.[0]?.current_period_end ??
    null;
  return seconds ? new Date(seconds * 1000).toISOString() : null;
}

// Statuses meaning "this subscription is over" -- nothing left to resume.
const DEAD_STATUSES = ['canceled', 'incomplete_expired'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const ok = await checkRateLimit(supabaseAdmin, req, res, 'pause-subscription', {
    limit: 10,
    windowSeconds: 3600,
  });
  if (!ok) return;

  const verifiedUser = await verifyUser(supabaseAdmin, req);
  if (!verifiedUser) {
    res.status(401).json({ error: 'Please sign in again and retry.' });
    return;
  }

  const { action } = req.body || {};
  if (action !== 'pause' && action !== 'resume') {
    res.status(400).json({ error: 'Unknown action.' });
    return;
  }

  try {
    // The subscription id comes from the rider's own profile row, never from
    // the request body -- nobody can pause somebody else's membership.
    const { data: profile, error: profErr } = await supabaseAdmin
      .from('profiles')
      .select('stripe_subscription_id')
      .eq('id', verifiedUser.id)
      .maybeSingle();

    if (profErr) throw profErr;

    if (!profile?.stripe_subscription_id) {
      // Nothing to pause or resume. If they were somehow flagged as paused,
      // clear it so the app stops offering a resume that can't work.
      await supabaseAdmin
        .from('profiles')
        .update({ subscription_paused: false })
        .eq('id', verifiedUser.id);
      res.status(404).json({ error: 'No membership found on this account.', requiresCheckout: true });
      return;
    }

    // Read the live subscription before touching it. If it's already gone,
    // no amount of updating will bring it back -- reset our own flags and
    // send the rider to checkout instead of failing with a Stripe error.
    let existing;
    try {
      existing = await stripe.subscriptions.retrieve(profile.stripe_subscription_id);
    } catch (retrieveErr) {
      console.error('Subscription could not be retrieved:', retrieveErr?.message);
      await supabaseAdmin
        .from('profiles')
        .update({ subscription_paused: false, subscribed: false })
        .eq('id', verifiedUser.id);
      res.status(409).json({
        error: 'That membership has closed. You can start a new one any time.',
        requiresCheckout: true,
      });
      return;
    }

    if (DEAD_STATUSES.includes(existing.status)) {
      await supabaseAdmin
        .from('profiles')
        .update({ subscription_paused: false, subscribed: false })
        .eq('id', verifiedUser.id);
      res.status(409).json({
        error: 'That membership has ended. You can start a new one any time.',
        requiresCheckout: true,
      });
      return;
    }

    const pausing = action === 'pause';
    const subscription = await stripe.subscriptions.update(profile.stripe_subscription_id, {
      cancel_at_period_end: pausing,
    });

    // The webhook writes these too, but writing here means the rider sees
    // the change immediately rather than waiting on Stripe's round trip.
    const paidThrough = periodEndIso(subscription);
    const update = { subscription_paused: pausing };
    if (paidThrough) update.subscription_paid_through = paidThrough;

    await supabaseAdmin.from('profiles').update(update).eq('id', verifiedUser.id);

    res.status(200).json({ paused: pausing, paidThrough, resumed: !pausing });
  } catch (err) {
    console.error(`Error trying to ${action} subscription:`, err);
    res.status(500).json({ error: `Could not ${action} your membership. Please try again.` });
  }
}
