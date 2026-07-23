// A working way to get a specific person into Trbo while public signups
// stay paused (see supabase-setup.sql / the GDPR Article 27 note).
//
// This has to go through admin.inviteUserByEmail(), not admin.createUser().
// Both dodge Supabase's own "Allow new users to sign up" dashboard switch,
// but there's a second, stricter gate underneath: the handle_new_user()
// trigger in supabase-setup.sql rejects any new row in auth.users unless
// it's an approved invite. That trigger originally checked invited_at
// alone, but invited_at turns out not to be reliably set on auth.users at
// the moment the row is inserted -- even for genuine Supabase invites --
// so real invites were getting rejected too. The trigger now also accepts
// an admin_invited flag carried in raw_user_meta_data, which (unlike
// invited_at) is guaranteed present at insert time since it's literal data
// handed to this very call. That's the `data` field below.
//
// inviteUserByEmail() does also ask Supabase to send its own invite email,
// which may or may not arrive (default SMTP is unreliable for addresses
// outside this account). That's fine -- we ignore it and still generate
// our own sign-in link below to hand to the person directly.
//
// If comp_access is requested, it's set directly here rather than trusted
// from the browser, matching how it's protected everywhere else in the
// app (see supabase-setup.sql -- comp_access can't be written by a client
// with just the anon key).
import { timingSafeEqual } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit } from './_rateLimit.js';

const SUPABASE_URL = 'https://wxwdqqjzfrfddqcgkrfv.supabase.co';
const SITE_URL = 'https://trbo.bike';
const supabaseAdmin = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Constant-time compare -- an ordinary === leaks how many leading
// characters matched via response timing, which is what makes a secret
// guessable byte by byte. Length check first: timingSafeEqual requires
// equal-length buffers, and length isn't a secret.
function secretsMatch(candidate, secret) {
  if (typeof candidate !== 'string' || !candidate) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function authorized(req) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const authHeader = req.headers.authorization || '';
  const headerOk = authHeader.startsWith('Bearer ') && secretsMatch(authHeader.slice(7), secret);
  // The body channel stays -- public/admin-invite.html depends on it and
  // both channels travel over HTTPS.
  const bodyOk = secretsMatch(req.body?.secret, secret);
  return headerOk || bodyOk;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!authorized(req)) {
    res.status(401).json({ error: 'Not authorized.' });
    return;
  }

  // This is a single-operator tool, not a public endpoint -- the limit
  // just stops a leaked/guessed secret from being hammered into a mass
  // account-creation script, not everyday use.
  const ok = await checkRateLimit(supabaseAdmin, req, res, 'admin-invite', {
    limit: 20,
    windowSeconds: 3600,
    // Admin endpoint: if the limiter itself is broken, block rather than
    // let requests through unlimited (see _rateLimit.js).
    failClosed: true,
  });
  if (!ok) return;

  const email = (req.body?.email || '').trim().toLowerCase();
  const compAccess = !!req.body?.compAccess;

  if (!email || !email.includes('@')) {
    res.status(400).json({ error: "That doesn't look like a valid email address." });
    return;
  }

  const { data: created, error: createError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    redirectTo: SITE_URL,
    data: { admin_invited: true },
  });

  if (createError) {
    const alreadyExists = createError.status === 422 || /already/i.test(createError.message || '');
    res.status(alreadyExists ? 409 : 500).json({
      error: createError.message || 'Could not create the account (no further detail from Supabase).',
    });
    return;
  }

  if (compAccess) {
    const { error: compError } = await supabaseAdmin
      .from('profiles')
      .update({ comp_access: true })
      .eq('id', created.user.id);
    if (compError) {
      console.error('Created user but failed to set comp_access:', compError);
    }
  }

  const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo: SITE_URL },
  });

  if (linkError || !linkData?.properties?.action_link) {
    // Don't leave a confirmed, unreachable account behind -- roll it back
    // so a retry doesn't hit "already registered".
    await supabaseAdmin.auth.admin.deleteUser(created.user.id);
    console.error('Created user but failed to generate sign-in link:', linkError);
    res.status(500).json({
      error: 'Created the account but could not build a sign-in link, so it was rolled back. Try again.',
    });
    return;
  }

  res.status(200).json({
    email,
    compAccess,
    loginLink: linkData.properties.action_link,
  });
}
