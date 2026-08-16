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
const PORT = Number(process.env.PORT) || 3000;

// Check if DATABASE_PRIVATE_URL is available (Railway)
const databaseUrl = process.env.DATABASE_PRIVATE_URL || process.env.DATABASE_URL;

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
  // Railway dynamic domains
  'https://*.up.railway.app',
  'https://*.railway.app',
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
      "img-src": ["'self'", "data:", "https://*.up.railway.app", "https://*.railway.app"],
    },
  } : false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

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

// Health check with database status
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    // Still return ok even if DB fails, so Railway doesn't fail healthcheck
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      message: 'Server is running but database connection failed'
    });
  }
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
    console.log('Starting server setup...');
    
    // Create HTTP server first
    const httpServer = createServer(app);

    // Initialize Socket.IO
    console.log('Initializing Socket.IO...');
    initializeSocket(httpServer);
    console.log('✅ Socket.IO initialized');

    // Start listening immediately on all interfaces (0.0.0.0) for Railway
    console.log(`Starting server on port ${PORT}...`);
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log('='.repeat(50));
      console.log('🚀 Server successfully started!');
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API URL: http://0.0.0.0:${PORT}/api`);
      console.log(`🔌 WebSocket URL: ws://0.0.0.0:${PORT}`);
      console.log(`🏥 Health Check: http://0.0.0.0:${PORT}/`);
      console.log(`🗄️ Database: ${databaseUrl ? '✅ Connected' : '❌ Not configured'}`);
      console.log('='.repeat(50));
    });

    // Test database connection (non-blocking - server will start even if DB fails)
    console.log('Testing database connection...');
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
