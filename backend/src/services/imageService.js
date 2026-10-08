import sharp from 'sharp';
import { supabaseAdmin } from '../config/supabase.js';
import { randomUUID } from 'crypto';

const BUCKET = 'daycare-images';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export function validateImage(file) {
  if (!ALLOWED_MIME.includes(file.mimetype)) {
    throw new Error('Only JPEG, PNG, and WebP images are accepted.');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('File exceeds the 10 MB limit.');
  }
}

/**
 * Process an uploaded image buffer through Sharp:
 * resize, convert to WebP, compress.
 * Returns { mainBuffer, thumbBuffer } as WebP.
 */
export async function processImage(buffer, { width = 1600 } = {}) {
  const mainBuffer = await sharp(buffer)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  const thumbBuffer = await sharp(buffer)
    .resize({ width: 600, withoutEnlargement: true })
    .webp({ quality: 75 })
    .toBuffer();

  return { mainBuffer, thumbBuffer };
}

/**
 * Upload processed image buffers to Supabase Storage.
 * Returns { imageUrl, thumbUrl, storagePath, thumbPath }
 */
export async function uploadToStorage(mainBuffer, thumbBuffer, folder) {
  const id = randomUUID();
  const storagePath = `${folder}/${id}.webp`;
  const thumbPath = `${folder}/thumbs/${id}.webp`;

  const [mainUpload, thumbUpload] = await Promise.all([
    supabaseAdmin.storage.from(BUCKET).upload(storagePath, mainBuffer, {
      contentType: 'image/webp',
      upsert: false,
    }),
    supabaseAdmin.storage.from(BUCKET).upload(thumbPath, thumbBuffer, {
      contentType: 'image/webp',
      upsert: false,
    }),
  ]);

  if (mainUpload.error) throw new Error(mainUpload.error.message);
  if (thumbUpload.error) throw new Error(thumbUpload.error.message);

  const { data: mainData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(storagePath);
  const { data: thumbData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(thumbPath);

  return {
    imageUrl: mainData.publicUrl,
    thumbUrl: thumbData.publicUrl,
    storagePath,
    thumbPath,
  };
}

/**
 * Delete image files from Supabase Storage.
 */
export async function deleteFromStorage(storagePath, thumbPath) {
  const paths = [storagePath, thumbPath].filter(Boolean);
  if (paths.length === 0) return;
  const { error } = await supabaseAdmin.storage.from(BUCKET).remove(paths);
  if (error) console.error('Storage delete error:', error.message);
}
