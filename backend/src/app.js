import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import galleryRoutes from './routes/galleryRoutes.js';
import programRoutes from './routes/programRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const app = express();

// CORS
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Public API routes
app.use('/api/gallery', galleryRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);

// Protected admin API routes
app.use('/api/admin', adminRoutes);

// 404 + Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
