import { getSettings, upsertSettings, getDashboardStats } from '../services/supabaseService.js';
import { validateImage, processImage, uploadToStorage } from '../services/imageService.js';

// Public: GET /api/settings
export async function fetchSettings(req, res, next) {
  try {
    const data = await getSettings();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// Admin: PATCH /api/admin/settings
export async function editSettings(req, res, next) {
  try {
    const data = await upsertSettings(req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// Admin: POST /api/admin/settings/upload-image
export async function uploadSettingsImage(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No image provided.' });
    const { field } = req.body; // e.g. 'hero_image_url' | 'logo_url'

    validateImage(req.file);
    const { mainBuffer, thumbBuffer } = await processImage(req.file.buffer, { width: 1920 });
    const { imageUrl, thumbUrl, storagePath, thumbPath } = await uploadToStorage(
      mainBuffer,
      thumbBuffer,
      'homepage'
    );

    const payload = { [field]: imageUrl };
    const data = await upsertSettings(payload);
    res.json({ success: true, data, imageUrl, thumbUrl });
  } catch (err) {
    next(err);
  }
}

// Admin: GET /api/admin/dashboard
export async function fetchDashboardStats(req, res, next) {
  try {
    const stats = await getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

// Admin: GET /api/admin/messages
export async function fetchMessages(req, res, next) {
  try {
    const { getContactMessages } = await import('../services/supabaseService.js');
    const data = await getContactMessages();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
