import { Router } from 'express';
import { listGallery } from '../controllers/galleryController.js';

const router = Router();

// Public
router.get('/', listGallery);

export default router;
