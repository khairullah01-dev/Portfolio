import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { uploadsPath } from './middleware/uploadMiddleware.js';
import connectDB from './config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const port = Number(process.env.PORT) || 5000;
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');

// 1. Explicit CORS configuration
const allowedOrigins = [
  'https://portfolio-nine-sepia-91.vercel.app',
  'http://localhost:3000',
  'http://localhost:5174'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Or set to callback(new Error('Not allowed by CORS')) to block others
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Explicitly answer preflight OPTIONS requests across all routes
app.options('*', cors());

// 2. Body parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(uploadsPath));

// 3. Database connection middleware (MUST BE BEFORE ROUTES)
app.use(async (req, _res, next) => {
  if (req.path.startsWith('/api')) {
    try {
      await connectDB();
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// 4. API Routes
app.get('/api/health', (_request, response) => response.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/contact', contactRoutes);

// 5. Frontend static assets (if serving frontend from the same server)
app.use(express.static(frontendDist));
app.get('*', (req, response, next) => {
  // Pass API calls through to 404 handler if they didn't match an API route
  if (req.path.startsWith('/api')) {
    return next();
  }
  response.sendFile(path.join(frontendDist, 'index.html'));
});

// 6. Error handling
app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(port, () => console.log(`Portfolio API listening at http://localhost:${port}`));
}

export default app;