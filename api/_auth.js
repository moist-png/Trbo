// Confirms who's *really* calling one of these functions, instead of just
// trusting a plain "userId" field in the request body -- which is just
// text anyone could type in, including someone else's account id.
//
// When a person is signed in, their browser holds a signed token (a JWT)
// that Supabase issued at login and that only Supabase can verify. The
// three functions that use this now require that same token to be sent
// along with the request (as a standard "Authorization: Bearer <token>"
// header), and check it against Supabase before doing anything -- so the
// account acted on is always the one that's actually signed in, never one
// picked by whoever sent the request.
//
// Pass in the same supabaseAdmin client each file already creates -- no
// need for a second one.
export async function verifyUser(supabaseAdmin, req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user; // real, verified account: { id, email, ... }
}
