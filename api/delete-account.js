// Self-serve account deletion -- the erasure ("right to be forgotten") half of
// the GDPR/UK GDPR rights. A signed-in rider can wipe their account and all
// their training data themselves, turning what would otherwise be a one-month
// legal clock plus a manual database job into a single button.
//
// Identity is proved by the signed-in session token via verifyUser, never by
// a user id in the request body -- so this can only ever delete the account
// that is actually calling.
//
// Two deliberate, disclosed retentions survive deletion:
//   1. Stripe billing records (customer + invoices) -- tax and accounting law
//      requires keeping invoice records, and GDPR expressly permits retention
//      for a legal obligation. The live subscription is cancelled so billing
//      stops; the historical records stay in Stripe.
//   2. trial_history -- a normalised email with no other data attached and no
//      foreign key to the account, kept purely to stop "delete account, sign
//      up again" from minting endless free trials (fraud prevention). It is
//      never touched here, so it survives the cascade automatically.
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit } from './_rateLimit.js';
import { verifyUser } from './_auth.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const SUPABASE_URL = 'https://wxwdqqjzfrfddqcgkrfv.supabase.co';
const supabaseAdmin = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Best-effort revocation of Trbo's Strava access on Strava's own side. Dropping
// the tokens from our database (via the cascade below) stops us holding them,
// but only deauthorising also tears down the grant on Strava, so nothing is
// left dangling. Any failure here is swallowed -- it must never block deletion.
async function revokeStrava(prof) {
  if (!prof || !prof.strava_refresh_token) return;
  try {
    let accessToken = prof.strava_access_token;
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (!prof.strava_token_expires_at || prof.strava_token_expires_at <= nowSeconds + 60) {
      const r = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.STRAVA_CLIENT_ID,
          client_secret: process.env.STRAVA_CLIENT_SECRET,
          grant_type: 'refresh_token',
          refresh_token: prof.strava_refresh_token,
        }),
      });
      const d = await r.json();
      if (r.ok && d.access_token) accessToken = d.access_token;
    }
    if (accessToken) {
      await fetch('https://www.strava.com/oauth/deauthorize', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    }
  } catch (e) {
    console.error('delete-account: Strava deauthorize failed (continuing):', e?.message);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const ok = await checkRateLimit(supabaseAdmin, req, res, 'delete-account', {
    limit: 5,
    windowSeconds: 3600,
  });
  if (!ok) return;

  const user = await verifyUser(supabaseAdmin, req);
  if (!user) {
    res.status(401).json({ error: 'Please sign in again and retry.' });
    return;
  }
  const uid = user.id;

  try {
    // Read the two things we need before anything cascades away: the live
    // Stripe subscription to cancel, and the feedback photos to clear from
    // storage (storage objects are not covered by the row cascade below).
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_subscription_id, strava_access_token, strava_refresh_token, strava_token_expires_at')
      .eq('id', uid)
      .maybeSingle();

    const { data: feedbackRows } = await supabaseAdmin
      .from('feedback_items')
      .select('photo_paths')
      .eq('user_id', uid);

    // Stop billing now. Cancelling (not deleting) leaves the customer object
    // and past invoices in Stripe for the legal retention above.
    if (profile?.stripe_subscription_id) {
      try {
        await stripe.subscriptions.cancel(profile.stripe_subscription_id);
      } catch (e) {
        // Already-cancelled or missing subscriptions shouldn't block deletion.
        console.error('delete-account: subscription cancel failed (continuing):', e?.message);
      }
    }

    // Revoke Trbo's Strava access on Strava's side (best-effort).
    await revokeStrava(profile);

    // Remove feedback photos from the private bucket. Paths are stored on each
    // feedback row as an array under the rider's own uid folder.
    const photoPaths = (feedbackRows || [])
      .flatMap(r => (Array.isArray(r.photo_paths) ? r.photo_paths : []))
      .filter(Boolean);
    if (photoPaths.length) {
      try {
        await supabaseAdmin.storage.from('feedback-photos').remove(photoPaths);
      } catch (e) {
        console.error('delete-account: photo cleanup failed (continuing):', e?.message);
      }
    }

    // Delete the auth user. Every public table keyed to the account is declared
    // ON DELETE CASCADE, so this single step removes the profile, current and
    // archived plans, ride and FTP history, custom workouts, stars, queue,
    // saved queues, feedback posts and votes, device registrations, email
    // sequence log and trial survey response. trial_history is intentionally
    // left untouched (see file header).
    const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(uid);
    if (delErr) throw delErr;

    res.status(200).json({ deleted: true });
  } catch (err) {
    console.error('delete-account error:', err);
    res.status(500).json({ error: 'Could not delete your account. Please try again, or email support if it keeps failing.' });
  }
}
