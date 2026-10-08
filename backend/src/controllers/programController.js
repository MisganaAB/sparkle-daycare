import {
  getAllPrograms,
  getCurrentProgram,
  createProgram,
  updateProgram,
  deleteProgram,
  createActivity,
  updateActivity,
  deleteActivity,
} from '../services/supabaseService.js';
import { validateProgram, validateActivity } from '../validators/programValidator.js';

// Public: GET /api/programs
export async function listPrograms(req, res, next) {
  try {
    const data = await getAllPrograms();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// Public: GET /api/programs/current
export async function currentProgram(req, res, next) {
  try {
    const data = await getCurrentProgram();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// Admin: POST /api/admin/programs
export async function addProgram(req, res, next) {
  try {
    const errors = validateProgram(req.body);
    if (errors.length) return res.status(400).json({ success: false, message: errors.join(' ') });

    const record = await createProgram(req.body);
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
}

// Admin: PATCH /api/admin/programs/:id
export async function editProgram(req, res, next) {
  try {
    const { id } = req.params;
    const record = await updateProgram(id, req.body);
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
}

// Admin: DELETE /api/admin/programs/:id
export async function removeProgram(req, res, next) {
  try {
    const { id } = req.params;
    await deleteProgram(id);
    res.json({ success: true, message: 'Program deleted.' });
  } catch (err) {
    next(err);
  }
}

// Admin: POST /api/admin/activities
export async function addActivity(req, res, next) {
  try {
    const errors = validateActivity(req.body);
    if (errors.length) return res.status(400).json({ success: false, message: errors.join(' ') });

    const record = await createActivity(req.body);
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
}

// Admin: PATCH /api/admin/activities/:id
export async function editActivity(req, res, next) {
  try {
    const { id } = req.params;
    const record = await updateActivity(id, req.body);
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
}

// Admin: DELETE /api/admin/activities/:id
export async function removeActivity(req, res, next) {
  try {
    const { id } = req.params;
    await deleteActivity(id);
    res.json({ success: true, message: 'Activity deleted.' });
  } catch (err) {
    next(err);
  }
}
