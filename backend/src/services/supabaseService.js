import { supabaseAdmin } from '../config/supabase.js';

// ── Gallery ────────────────────────────────────────────────────────────────

export async function getGalleryImages({ category, page = 1, limit = 12 } = {}) {
  const offset = (page - 1) * limit;
  let query = supabaseAdmin
    .from('gallery_images')
    .select('*', { count: 'exact' })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { images: data, total: count };
}

export async function createGalleryImage(payload) {
  const { data, error } = await supabaseAdmin
    .from('gallery_images')
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateGalleryImage(id, payload) {
  const { data, error } = await supabaseAdmin
    .from('gallery_images')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteGalleryImage(id) {
  const { data, error } = await supabaseAdmin
    .from('gallery_images')
    .delete()
    .eq('id', id)
    .select('storage_path, thumb_path')
    .single();
  if (error) throw error;
  return data;
}

// ── Programs ───────────────────────────────────────────────────────────────

export async function getAllPrograms() {
  const { data, error } = await supabaseAdmin
    .from('weekly_programs')
    .select('*, activities(*)')
    .order('week_start', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getCurrentProgram() {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabaseAdmin
    .from('weekly_programs')
    .select('*, activities(*)')
    .eq('is_published', true)
    .lte('week_start', today)
    .gte('week_end', today)
    .order('week_start', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;

  // Fallback: most recent published if no exact match
  if (!data) {
    const { data: fallback, error: fe } = await supabaseAdmin
      .from('weekly_programs')
      .select('*, activities(*)')
      .eq('is_published', true)
      .order('week_start', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (fe) throw fe;
    return fallback;
  }

  return data;
}

export async function createProgram(payload) {
  const { data, error } = await supabaseAdmin
    .from('weekly_programs')
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProgram(id, payload) {
  const { data, error } = await supabaseAdmin
    .from('weekly_programs')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProgram(id) {
  const { error } = await supabaseAdmin.from('weekly_programs').delete().eq('id', id);
  if (error) throw error;
}

// ── Activities ─────────────────────────────────────────────────────────────

export async function createActivity(payload) {
  const { data, error } = await supabaseAdmin
    .from('activities')
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateActivity(id, payload) {
  const { data, error } = await supabaseAdmin
    .from('activities')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteActivity(id) {
  const { error } = await supabaseAdmin.from('activities').delete().eq('id', id);
  if (error) throw error;
}

// ── Contact Messages ───────────────────────────────────────────────────────

export async function saveContactMessage(payload) {
  const { data, error } = await supabaseAdmin
    .from('contact_messages')
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getContactMessages() {
  const { data, error } = await supabaseAdmin
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function markTelegramSent(id) {
  const { error } = await supabaseAdmin
    .from('contact_messages')
    .update({ telegram_sent: true })
    .eq('id', id);
  if (error) console.error('Failed to mark telegram_sent:', error.message);
}

// ── Site Settings ──────────────────────────────────────────────────────────

export async function getSettings() {
  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .select('*')
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertSettings(payload) {
  const existing = await getSettings();

  if (existing) {
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

// ── Dashboard Stats ────────────────────────────────────────────────────────

export async function getDashboardStats() {
  const [photos, programs, messages] = await Promise.all([
    supabaseAdmin.from('gallery_images').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('weekly_programs').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabaseAdmin.from('contact_messages').select('*', { count: 'exact', head: true }),
  ]);

  return {
    photos: photos.count || 0,
    programs: programs.count || 0,
    messages: messages.count || 0,
  };
}
