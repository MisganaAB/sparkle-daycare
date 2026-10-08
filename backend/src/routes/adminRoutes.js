import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import {
  uploadGalleryImage,
  editGalleryImage,
  removeGalleryImage,
} from '../controllers/galleryController.js';
import {
  addProgram,
  editProgram,
  removeProgram,
  addActivity,
  editActivity,
  removeActivity,
} from '../controllers/programController.js';
import {
  editSettings,
  uploadSettingsImage,
  fetchDashboardStats,
  fetchMessages,
} from '../controllers/settingsController.js';

const router = Router();

// All admin routes require auth
router.use(requireAuth);

// Dashboard
router.get('/dashboard', fetchDashboardStats);
router.get('/messages', fetchMessages);

// Gallery
router.post('/gallery', upload.single('image'), uploadGalleryImage);
router.patch('/gallery/:id', editGalleryImage);
router.delete('/gallery/:id', removeGalleryImage);

// Programs
router.post('/programs', addProgram);
router.patch('/programs/:id', editProgram);
router.delete('/programs/:id', removeProgram);

// Activities
router.post('/activities', addActivity);
router.patch('/activities/:id', editActivity);
router.delete('/activities/:id', removeActivity);

// Settings
router.patch('/settings', editSettings);
router.post('/settings/upload-image', upload.single('image'), uploadSettingsImage);

export default router;
