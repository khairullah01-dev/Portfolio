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

app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(uploadsPath));

app.get('/api/health', (_request, response) => response.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/contact', contactRoutes);

// Single origin for the entire portfolio: public site at / and admin at /admin.
app.use(express.static(frontendDist));
app.get('*', (_request, response) => response.sendFile(path.join(frontendDist, 'index.html')));

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => console.log(`Portfolio API listening at http://localhost:${port}`));
  } catch (error) {
    console.error(`Unable to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
