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
