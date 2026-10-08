import { Router } from 'express';
import { listPrograms, currentProgram } from '../controllers/programController.js';

const router = Router();

router.get('/', listPrograms);
router.get('/current', currentProgram);

export default router;
