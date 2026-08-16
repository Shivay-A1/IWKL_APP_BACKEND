import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer } from 'http';

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
  contentSecurityPolicy: false, // Disabled for Railway deployment
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression
app.use(compression());

// Root endpoint for healthcheck
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'IWKL Backend API', timestamp: new Date().toISOString() });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: databaseUrl ? 'configured' : 'not configured'
  });
});

// Keep-alive endpoint
app.get('/keep-alive', (req, res) => {
  res.json({ 
    status: 'alive', 
    timestamp: new Date().toISOString(),
    message: 'Server is awake and running'
  });
});

// Database setup endpoint (for Railway deployment)
app.get('/api/setup-database', async (req, res) => {
  try {
    // Check all possible database environment variables
    const databaseUrl = process.env.DATABASE_PRIVATE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL;
    
    // Debug environment variables
    const envCheck = {
      DATABASE_PRIVATE_URL: !!process.env.DATABASE_PRIVATE_URL,
      DATABASE_URL: !!process.env.DATABASE_URL,
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      availableVars: Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('POSTGRES'))
    };

    if (!databaseUrl) {
      return res.status(400).json({ 
        error: 'Database URL not configured',
        debug: envCheck,
        message: 'Please set DATABASE_PRIVATE_URL environment variable in Railway'
      });
    }

    // Simple table creation for testing
    const { Client } = require('pg');
    const client = new Client({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    console.log('✅ Database connected successfully');
    
    // Create simple teams table
    await client.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        logoUrl VARCHAR(500),
        abbreviation VARCHAR(10),
        color VARCHAR(20),
        isActive BOOLEAN DEFAULT true
      )
    `);
    console.log('✅ Teams table created');

    // Create simple videos table
    await client.query(`
      CREATE TABLE IF NOT EXISTS videos (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        videoUrl VARCHAR(500) NOT NULL,
        thumbnailUrl VARCHAR(500),
        category VARCHAR(100),
        isActive BOOLEAN DEFAULT true
      )
    `);
    console.log('✅ Videos table created');

    await client.end();
    res.json({ message: 'Database setup completed successfully' });
  } catch (error: any) {
    console.error('Database setup error:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// Environment debug endpoint
app.get('/api/debug-env', (req, res) => {
  const envDebug = {
    hasDatabasePrivateUrl: !!process.env.DATABASE_PRIVATE_URL,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasPostgresUrl: !!process.env.POSTGRES_URL,
    databaseRelatedVars: Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('POSTGRES')),
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT
  };
  res.json(envDebug);
});

// Simple API test endpoints
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working', timestamp: new Date().toISOString() });
});

app.get('/api/teams', (req, res) => {
  res.json({
    teams: [
      {
        id: '1',
        name: 'Garvi Gujarat',
        logoUrl: 'assets/teams/garvi_gujarat.png',
        abbreviation: 'GG',
        color: '#FF6B35'
      },
      {
        id: '2',
        name: 'Mumbai Strikers',
        logoUrl: 'assets/teams/mumbai_strikers.jpeg',
        abbreviation: 'MS',
        color: '#1E3A8A'
      }
    ]
  });
});

app.get('/api/videos', (req, res) => {
  res.json({
    videos: [
      {
        id: '1',
        title: 'IWKL Kabaddi Highlight 1',
        videoUrl: 'https://youtube.com/shorts/E8YS-cPPdZY?si=JgGJfcXqrXCRqWK9',
        thumbnailUrl: 'https://img.youtube.com/vi/E8YS-cPPdZY/hqdefault.jpg',
        category: 'Highlights',
        duration: 30,
        isPremium: false,
        viewCount: 0
      },
      {
        id: '2',
        title: 'IWKL Kabaddi Highlight 2',
        videoUrl: 'https://youtube.com/shorts/YZjFff0rfqE?si=9YAFEtAKNtyH_IQP',
        thumbnailUrl: 'https://img.youtube.com/vi/YZjFff0rfqE/hqdefault.jpg',
        category: 'Highlights',
        duration: 30,
        isPremium: false,
        viewCount: 0
      },
      {
        id: '3',
        title: 'IWKL Kabaddi Highlight 3',
        videoUrl: 'https://youtube.com/shorts/KMIeFlYcPg0?si=n45a687cXbkcnQb6',
        thumbnailUrl: 'https://img.youtube.com/vi/KMIeFlYcPg0/hqdefault.jpg',
        category: 'Highlights',
        duration: 30,
        isPremium: false,
        viewCount: 0
      }
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
  });
});

// Start server
const server = createServer(app);

server.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(50));
  console.log('🚀 IWKL Backend API successfully started!');
  console.log(`📝 Port: ${PORT}`);
  console.log(`🏥 Health Check: http://0.0.0.0:${PORT}/`);
  console.log(`🗄️ Database: ${databaseUrl ? '✅ Configured' : '❌ Not configured'}`);
  console.log('='.repeat(50));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
