import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer } from 'http';
import routes from './routes';
import { errorHandler, notFound, generalLimiter } from './middleware';
import { prisma } from './config';
import { initializeSocket } from './config/socket';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// CORS - must be before helmet to avoid conflicts
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  process.env.FRONTEND_URL,
  'https://iwkl-frontend.onrender.com',
  'https://iwkl-frontend-production.up.railway.app',
  'https://iwkl.in',
  'https://www.iwkl.in',
  'https://iwkl.org',
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "frame-ancestors": ["'self'", "https://iwkl.in", "https://www.iwkl.in", "https://iwkl.org"],
      "img-src": ["'self'", "data:", "https://*.up.railway.app", "https://*.railway.app", "https://iwkl-backend-lg6t-production.up.railway.app"],
    },
  } : false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static('public/uploads', {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Cache-Control', 'public, max-age=86400');
  }
}));

// Compression with better settings
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false
    }
    return compression.filter(req, res)
  },
  threshold: 1024,
  level: 6
}));

// Rate limiting
app.use('/api/', generalLimiter);

// Root endpoint for healthcheck
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'IWKL Backend API', timestamp: new Date().toISOString() });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Keep-alive endpoint for external pinging services
app.get('/keep-alive', (req, res) => {
  res.json({ 
    status: 'alive', 
    timestamp: new Date().toISOString(),
    message: 'Server is awake and running'
  });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Create HTTP server first
    const httpServer = createServer(app);

    // Start listening immediately on all interfaces (0.0.0.0) for Railway
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API URL: http://0.0.0.0:${PORT}/api`);
      console.log(`🔌 WebSocket URL: ws://0.0.0.0:${PORT}`);
    });

    // Initialize Socket.IO
    initializeSocket(httpServer);
    console.log('✅ Socket.IO initialized');

    // Test database connection (non-blocking)
    prisma.$connect()
      .then(() => {
        console.log('✅ Database connected successfully');
      })
      .catch((error) => {
        console.error('⚠️ Database connection error (server still running):', error.message);
      });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
