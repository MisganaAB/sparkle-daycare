import { supabaseAdmin } from '../config/supabase.js';

/**
 * Verify the Supabase JWT from the Authorization header.
 * Populates req.user on success.
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized.' });
  }

  const token = authHeader.split(' ')[1];

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session.' });
  }

  req.user = user;
  next();
}
