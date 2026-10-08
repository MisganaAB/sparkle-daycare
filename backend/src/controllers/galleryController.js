import {
  getGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from '../services/supabaseService.js';
import { validateImage, processImage, uploadToStorage, deleteFromStorage } from '../services/imageService.js';
import { validateGalleryCreate, validateGalleryUpdate } from '../validators/galleryValidator.js';

// Public: GET /api/gallery
export async function listGallery(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 12));
    const category = req.query.category || null;

    const { images, total } = await getGalleryImages({ category, page, limit });

    res.json({
      success: true,
      data: images,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
}

// Admin: POST /api/admin/gallery
export async function uploadGalleryImage(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No image file provided.' });

    const { category = 'other', title = '', description = '', is_featured = false } = req.body;

    const errors = validateGalleryCreate({ category, title });
    if (errors.length) return res.status(400).json({ success: false, message: errors.join(' ') });

    validateImage(req.file);

    const folder = `gallery/${category.replace('_', '-')}`;
    const { mainBuffer, thumbBuffer } = await processImage(req.file.buffer);
    const { imageUrl, thumbUrl, storagePath, thumbPath } = await uploadToStorage(mainBuffer, thumbBuffer, folder);

    const record = await createGalleryImage({
      title: title || null,
      description: description || null,
      image_url: imageUrl,
      thumb_url: thumbUrl,
      storage_path: storagePath,
      thumb_path: thumbPath,
      category,
      is_featured: is_featured === 'true' || is_featured === true,
      sort_order: 0,
    });

    res.status(201).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
}

// Admin: PATCH /api/admin/gallery/:id
export async function editGalleryImage(req, res, next) {
  try {
    const { id } = req.params;
    const errors = validateGalleryUpdate(req.body);
    if (errors.length) return res.status(400).json({ success: false, message: errors.join(' ') });

    const record = await updateGalleryImage(id, req.body);
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
}

// Admin: DELETE /api/admin/gallery/:id
export async function removeGalleryImage(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteGalleryImage(id);

    if (deleted?.storage_path) {
      await deleteFromStorage(deleted.storage_path, deleted.thumb_path);
    }

    res.json({ success: true, message: 'Image deleted.' });
  } catch (err) {
    next(err);
  }
}
