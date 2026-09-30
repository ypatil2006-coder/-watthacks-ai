import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import { isGeminiConfigured } from './services/geminiService.js';
import { connectDB, isDBConnected } from './config/db.js';

dotenv.config({ override: true });

// Process safety: Prevent any unhandled async error from terminating the backend server
process.on('uncaughtException', (err) => {
  console.warn('⚠️ Prevented Server Crash (Uncaught Exception):', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.warn('⚠️ Prevented Server Crash (Unhandled Rejection):', reason?.message || reason);
});

// Initialize MongoDB Atlas connection
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Request logging in development
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Primary API Router
app.use('/api', apiRoutes);

// Health Check & System Status
app.get('/', (req, res) => {
  const geminiReady = isGeminiConfigured();
  const dbReady = isDBConnected();
  res.json({
    status: 'online',
    service: 'WattHacks AI Backend API',
    version: '2.0.0',
    theme: 'AI for Sustainability (MSEDCL TOD Arbitrage & Western Grid Decarbonization)',
    targetGrid: 'Western Regional Grid (IN-WE)',
    discom: 'MSEDCL (Maharashtra State Electricity Distribution Company Limited)',
    ceaEmissionBaseline: '0.716 kg CO2/kWh',
    geminiApiConfigured: geminiReady,
    database: dbReady ? 'Connected (MongoDB Atlas)' : 'Offline / Standalone Mode',
    apiDocsUrl: '/api',
    timestamp: new Date().toISOString()
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.originalUrl} not found. Explore available endpoints at GET /api.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start Server
if (process.env.VERCEL !== '1') {
  app.listen(PORT, async () => {
    const geminiReady = isGeminiConfigured();
    if (!isDBConnected()) {
      await new Promise(r => setTimeout(r, 400));
    }
    const dbReady = isDBConnected();
    console.log('====================================================');
    console.log(`⚡ WattHacks AI Backend Server Running on Port ${PORT}`);
    console.log(`📍 Regional Target: Pune, Maharashtra (MSEDCL TOD Tariff Schedule)`);
    console.log(`🍃 Database: ${dbReady ? '✅ CONNECTED (Official MongoDB Atlas Cluster0)' : '⚠️ STANDALONE SESSION MODE'}`);
    console.log(`🌿 Carbon Engine: Govt of India CEA Baseline (0.716 kg CO2/kWh)`);
    console.log(`🤖 Google Gemini 1.5/2.5 API: ${geminiReady ? '✅ CONFIGURED (Live Multimodal OCR Enabled)' : '⚠️ NOT CONFIGURED (Set GEMINI_API_KEY in backend/.env)'}`);
    console.log(`📖 API Catalog & Route Explorer: http://localhost:${PORT}/api`);
    console.log('====================================================');
  });
}

export default app;
