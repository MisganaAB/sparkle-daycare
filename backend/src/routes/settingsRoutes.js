import { Router } from 'express';
import { fetchSettings } from '../controllers/settingsController.js';

const router = Router();

router.get('/', fetchSettings);

export default router;
