import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import { isGeminiConfigured } from './services/geminiService.js';

dotenv.config({ override: true });

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
  res.json({
    status: 'online',
    service: 'WattHacks AI Backend API',
    version: '2.0.0',
    theme: 'AI for Sustainability (MSEDCL TOD Arbitrage & Western Grid Decarbonization)',
    targetGrid: 'Western Regional Grid (IN-WE)',
    discom: 'MSEDCL (Maharashtra State Electricity Distribution Company Limited)',
    ceaEmissionBaseline: '0.716 kg CO2/kWh',
    geminiApiConfigured: geminiReady,
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
app.listen(PORT, () => {
  const geminiReady = isGeminiConfigured();
  console.log('====================================================');
  console.log(`⚡ WattHacks AI Backend Server Running on Port ${PORT}`);
  console.log(`📍 Regional Target: Pune, Maharashtra (MSEDCL TOD Tariff Schedule)`);
  console.log(`🌿 Carbon Engine: Govt of India CEA Baseline (0.716 kg CO2/kWh)`);
  console.log(`🤖 Google Gemini 1.5/2.5 API: ${geminiReady ? '✅ CONFIGURED (Live Multimodal OCR Enabled)' : '⚠️ NOT CONFIGURED (Set GEMINI_API_KEY in backend/.env)'}`);
  console.log(`📖 API Catalog & Route Explorer: http://localhost:${PORT}/api`);
  console.log('====================================================');
});

export default app;
