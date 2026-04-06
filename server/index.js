const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { initCosmos } = require('./db/cosmosClient');
const candidateRoutes = require('./routes/candidates');
const interviewRoutes = require('./routes/interviews');
const aiRoutes = require('./routes/ai');
const platformRoutes = require('./routes/platform');
const vectorsRouter = require('./routes/vectors');
const errorHandler = require('./middleware/errorHandler');
// Note: authMiddleware is applied within each route file for org-scoped isolation

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'RATE_LIMITED', message: 'Too many requests, please try again later.' },
  },
});
app.use('/api/', limiter);

// AI-specific rate limiter (stricter)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: { code: 'RATE_LIMITED', message: 'AI analysis rate limit exceeded.' },
  },
});

// Health checks
app.get('/health/live', (req, res) => {
  res.status(200).json({ status: 'ok', app: 'Interview9.ai', version: '1.0.0' });
});

app.get('/health/ready', (req, res) => {
  const { isCosmosAvailable } = require('./db/cosmosClient');
  res.status(200).json({
    status: 'ready',
    app: 'Interview9.ai',
    cosmos: isCosmosAvailable() ? 'connected' : 'in-memory-fallback',
    ai: process.env.ANTHROPIC_API_KEY ? 'configured' : 'unavailable',
  });
});

// API Routes
app.use('/api/v1/candidates', candidateRoutes);
app.use('/api/v1/interviews', interviewRoutes);
app.use('/api/v1/ai', aiLimiter, aiRoutes);
app.use('/api/v1/platform', platformRoutes);
app.use('/api/vectors', vectorsRouter);

// Error handler
app.use(errorHandler);

// Start server with Cosmos initialization
async function start() {
  try {
    await initCosmos();
  } catch (err) {
    console.warn('[Interview9] Cosmos init warning (continuing with in-memory):', err.message);
  }

  app.listen(PORT, () => {
    console.log(`Interview9.ai API running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health/live`);
  });
}

start();

module.exports = app;
