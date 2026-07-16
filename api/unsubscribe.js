// One click, no login -- sets email_opt_out on that person's profile and
// every future sequence email checks that flag before sending anything.
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit } from './_rateLimit.js';
import { verify, unsubPayload } from './_emailLink.js';
import { pageShell, pageH1, pageP } from './_emailTemplates.js';

const SUPABASE_URL = 'https://wxwdqqjzfrfddqcgkrfv.supabase.co';
const supabaseAdmin = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const ok = await checkRateLimit(supabaseAdmin, req, res, 'unsubscribe', { limit: 20, windowSeconds: 3600 });
  if (!ok) return;

  const { uid, sig } = req.query || {};
  res.setHeader('Content-Type', 'text/html');

  if (!uid || !verify(unsubPayload(uid), sig)) {
    res.status(403).send(pageShell(pageH1('Hmm.') + pageP('That link looks like it\u2019s been altered.')));
    return;
  }

  const { error } = await supabaseAdmin.from('profiles').update({ email_opt_out: true }).eq('id', uid);
  if (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).send(pageShell(pageH1('Something went wrong') + pageP('Please try again in a bit.')));
    return;
  }

  res.status(200).send(pageShell(pageH1('You\u2019re unsubscribed') + pageP('You won\u2019t get any more emails from this sequence. You can still use Trbo as normal.')));
}
