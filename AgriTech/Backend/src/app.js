import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import farmRoutes from './routes/farmRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import cropInformationRoutes from './routes/cropInformationRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { articleRouter, discussionRouter, weatherRouter } from './routes/miscRoutes.js';
import { errorHandler, notFound, requireAjaxHeader } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();
  const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim()).filter(Boolean);

  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(
    cors({
      origin(origin, cb) {
        // Izinkan permintaan tanpa Origin (curl, server-to-server) dan origin yang terdaftar
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        return cb(null, false);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'X-Requested-With', 'Authorization'],
    })
  );
  app.use(express.json({ limit: '200kb' }));
  app.use(cookieParser());
  app.use('/api', requireAjaxHeader);

  app.get('/api/health', (req, res) => res.json({ success: true, data: { status: 'ok', time: new Date().toISOString() } }));

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/farms', farmRoutes);
  app.use('/api/crops', cropRoutes);
  app.use('/api/crop-information', cropInformationRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/discussions', discussionRouter);
  app.use('/api/articles', articleRouter);
  app.use('/api/weather', weatherRouter);
  app.use('/api/admin', adminRoutes);

  app.use('/api', notFound);
  app.use(errorHandler);
  return app;
}

