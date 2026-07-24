// Self-serve data export -- the "download everything we hold on you" half of
// the GDPR/UK GDPR access + portability rights. A signed-in rider gets one
// JSON file containing every row tied to their account, plus (client-side) a
// CSV of their ride history.
//
// Identity is proved by the signed-in session token via verifyUser, never by
// a user id in the request body -- so this can only ever export the account
// that is actually calling. Runs with the service-role key so it can read
// across the rider's own tables in one pass.
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit } from './_rateLimit.js';
import { verifyUser } from './_auth.js';

const SUPABASE_URL = 'https://wxwdqqjzfrfddqcgkrfv.supabase.co';
const supabaseAdmin = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const ok = await checkRateLimit(supabaseAdmin, req, res, 'export-data', {
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
    const [profile, ftpHistory, workoutHistory, customWorkouts, archivedPlans, starred, queued, savedQueues, feedback, survey] = await Promise.all([
      supabaseAdmin.from('profiles').select('*').eq('id', uid).maybeSingle(),
      supabaseAdmin.from('ftp_history').select('*').eq('user_id', uid).order('date', { ascending: true }),
      supabaseAdmin.from('workout_history').select('*').eq('user_id', uid).order('date', { ascending: true }),
      supabaseAdmin.from('custom_workouts').select('*').eq('user_id', uid),
      supabaseAdmin.from('archived_plans').select('*').eq('user_id', uid),
      supabaseAdmin.from('starred_workouts').select('*').eq('user_id', uid),
      supabaseAdmin.from('queued_workouts').select('*').eq('user_id', uid).order('position', { ascending: true }),
      supabaseAdmin.from('saved_queues').select('*').eq('user_id', uid),
      supabaseAdmin.from('feedback_items').select('id, body, status, upvote_count, created_at').eq('user_id', uid),
      supabaseAdmin.from('trial_survey_responses').select('*').eq('user_id', uid),
    ]);

    const p = profile.data || {};

    // Curated account view: the personal data we actually hold, minus the
    // internal credentials that are meaningless to the rider and unsafe to
    // hand out (Strava access/refresh tokens, Stripe object ids).
    const account = {
      email: user.email,
      name: p.name || null,
      ftp: p.ftp ?? null,
      created_at: p.created_at || null,
      email_opt_out: !!p.email_opt_out,
      app_settings: p.settings || {},
      current_training_plan: p.training_plan || null,
    };

    const subscription = {
      status: p.subscribed ? 'active' : 'inactive',
      paused: !!p.subscription_paused,
      paid_through: p.subscription_paid_through || null,
      complimentary_access: !!p.comp_access,
      complimentary_expires_at: p.comp_expires_at || null,
      trial_start: p.trial_start || null,
      // Billing invoices themselves are held by Stripe and retained there for
      // tax/accounting law; they are not part of this app-database export.
    };

    const strava = {
      connected: !!p.strava_athlete_id,
      athlete_id: p.strava_athlete_id || null,
    };

    const payload = {
      export_generated_at: new Date().toISOString(),
      account,
      subscription,
      strava,
      ftp_history: ftpHistory.data || [],
      ride_history: workoutHistory.data || [],
      custom_workouts: customWorkouts.data || [],
      archived_plans: archivedPlans.data || [],
      starred_workouts: starred.data || [],
      queued_workouts: queued.data || [],
      saved_queues: savedQueues.data || [],
      feedback_posts: feedback.data || [],
      trial_survey_responses: survey.data || [],
    };

    res.status(200).json(payload);
  } catch (err) {
    console.error('export-data error:', err);
    res.status(500).json({ error: 'Could not export your data. Please try again.' });
  }
}
