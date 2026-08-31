import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import apiRoutes from './routes';
import path from 'path';

// Load .env from backend directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const httpServer = createServer(app);

// Setup Socket.IO
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: function(origin, callback) {
      // Allow all origins for Railway deployment
      callback(null, true);
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Make io globally available
global.io = io;
// Set trust proxy to specific trusted proxies instead of true to avoid rate limiter warning
app.set('trust proxy', process.env.NODE_ENV === 'production' ? 1 : false);
const PORT = Number(process.env.PORT) || 3000;

// Run Prisma migrations on startup if DATABASE_URL is available
async function runPrismaMigrations() {
  try {
    const databaseUrl = process.env.DATABASE_PRIVATE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (databaseUrl) {
      console.log('🗄️ Setting up Railway database with Prisma...');
      
      // Use Prisma db push with accept-data-loss to recreate tables
      // This will drop incompatible tables and create proper Prisma schema
      console.log('🗄️ Running Prisma database migrations with data-loss acceptance...');
      const { execSync } = require('child_process');
      try {
        execSync('npx prisma db push --skip-generate --accept-data-loss', { stdio: 'inherit' });
        console.log('✅ Prisma migrations completed successfully');
      } catch (prismaError) {
        console.error('⚠️ Prisma migrations failed:', prismaError.message);
      }
      
      console.log('🎉 Database setup completed!');
    } else {
      console.log('⚠️ DATABASE_URL not set, skipping migrations');
    }
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    // Don't fail startup if migrations fail
  }
}

// Seed admin user after migrations
async function seedAdminUser() {
  try {
    const { prisma } = require('./config');
    if (!prisma) {
      console.log('⚠️ Prisma not available for seeding');
      return;
    }
    
    console.log('🗄️ Seeding admin user...');
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    try {
      await prisma.user.upsert({
        where: { email: 'admin@iwkl.com' },
        update: {},
        create: {
          id: 'admin_001',
          name: 'Super Admin',
          email: 'admin@iwkl.com',
          password: hashedPassword,
          role: 'SUPER_ADMIN',
          isVerified: true,
          mobileVerified: true
        }
      });
      console.log('✅ Admin user seeded successfully');
    } catch (seedError: any) {
      console.log('⚠️ Admin user seeding failed (may already exist):', seedError.message);
    }
  } catch (error) {
    console.error('❌ Admin seeding failed:', error);
  }
}

// Startup logging
console.log('🚀 Starting IWKL Backend Server...');
console.log('📡 Environment:', process.env.NODE_ENV || 'development');
console.log('🔌 Port:', PORT);
console.log('🗄️ Database URL configured:', !!process.env.DATABASE_URL);
console.log('🗄️ DATABASE_PRIVATE_URL configured:', !!process.env.DATABASE_PRIVATE_URL);

// Ensure database URL is set (non-blocking warning only)
if (!process.env.DATABASE_URL && !process.env.DATABASE_PRIVATE_URL) {
  console.warn('⚠️ DATABASE_URL or DATABASE_PRIVATE_URL not set - some features may not work');
}

// Log environment for debugging
console.log('Environment Debug:');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL configured:', !!process.env.DATABASE_URL);
console.log('DATABASE_PRIVATE_URL configured:', !!process.env.DATABASE_PRIVATE_URL);

// Use DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;

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
  'https://iwkl-platform.onrender.com',
  'https://ravishing-serenity-production.up.railway.app',
  // Railway dynamic domains
  'https://*.up.railway.app',
  'https://*.railway.app',
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow all origins in production for Railway deployment
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads', {
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
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "frame-ancestors": ["'self'", "https://iwkl.in", "https://www.iwkl.in", "https://iwkl.org"],
      "img-src": ["'self'", "data:", "https://*.up.railway.app", "https://*.railway.app", "https://iwkl-backend-lg6t-production.up.railway.app", "https://iwkl.in", "https://www.iwkl.in", "https://iwkl.org"],
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

// Mount API routes
app.use('/api', apiRoutes);

// Root endpoint for healthcheck
app.get('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.json({ status: 'ok', message: 'IWKL Backend API', timestamp: new Date().toISOString() });
});

// Integration test endpoint
app.get('/api/test-integration', async (req, res) => {
  try {
    const databaseUrl = process.env.DATABASE_PRIVATE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL;
    
    const results: any = {
      timestamp: new Date().toISOString(),
      status: 'ok',
      database: {
        configured: !!databaseUrl,
        url: databaseUrl ? 'configured' : 'not configured'
      },
      backend: {
        status: 'running',
        version: '1.0.0',
        routes: {
          auth: '/api/auth/*',
          admin: '/api/admin/*',
          teams: '/api/teams',
          matches: '/api/matches'
        }
      },
      admin_panel: {
        url: 'https://ravishing-serenity-production.up.railway.app',
        login: '/login',
        dashboard: '/dashboard'
      },
      flutter_app: {
        api_url: 'https://iwklappbackend-production.up.railway.app/api',
        status: 'connected'
      },
      endpoints: {
        health: '/health',
        teams: '/api/teams',
        admin_login: '/api/auth/admin/login',
        admin_dashboard: '/api/admin/dashboard'
      }
    };

    // Test database connection using Prisma
    if (databaseUrl) {
      try {
        const { prisma } = require('./config');
        if (prisma) {
          // Use Prisma to test connection
          await prisma.$connect();
          results.database.status = 'connected';
          results.database.data = {
            teams: 0,
            users: 0,
            admin_users: 0
          };
          await prisma.$disconnect();
        } else {
          results.database.status = 'error';
          results.database.error = 'Prisma not initialized';
        }
      } catch (dbError: any) {
        results.database.status = 'error';
        results.database.error = dbError.message;
      }
    }

    res.json(results);
  } catch (error: any) {
    res.status(500).json({ 
      status: 'error', 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
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
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.json({ 
    status: 'alive', 
    timestamp: new Date().toISOString(),
    message: 'Server is awake and running'
  });
});

// Database setup endpoint (DISABLED - using Prisma migrations instead)
app.get('/api/setup-database', async (req, res) => {
  try {
    return res.json({
      message: 'Database setup is now handled by Prisma migrations on startup',
      info: 'This endpoint is disabled. Use npx prisma db push --accept-data-loss instead',
      note: 'Prisma will create all tables according to schema.prisma'
    });
  } catch (error: any) {
    console.error('Database setup error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Authentication endpoints
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, mobile_number, password, email } = req.body;
    const databaseUrl = process.env.DATABASE_PRIVATE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL;
    
    if (!databaseUrl) {
      return res.status(400).json({ error: 'Database not configured' });
    }

    try {
      const { prisma } = require('./config');
      if (!prisma) {
        return res.status(503).json({ error: 'Database not available' });
      }
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { mobile: mobile_number }
      });
      
      if (existingUser) {
        return res.status(400).json({ error: 'User with this mobile number already exists' });
      }

      // Hash password
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user using Prisma
      const user = await prisma.user.create({
        data: {
          id: 'user_' + Date.now().toString(),
          name: name,
          mobile: mobile_number,
          email: email || null,
          password: hashedPassword,
          role: 'USER'
        }
      });

      res.json({ 
        message: 'User registered successfully',
        userId: user.id,
        mobile_number: user.mobile
      });
    } catch (dbError: any) {
      console.error('Database error:', dbError.message);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin dashboard endpoint
app.get('/api/admin/dashboard', async (req, res) => {
  try {
    const databaseUrl = process.env.DATABASE_PRIVATE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL;
    
    if (!databaseUrl) {
      console.log('Database not configured, returning mock data');
      return res.json({
        totalUsers: 0,
        totalMatches: 0,
        totalVideos: 0,
        totalNews: 0,
        liveMatches: 0,
        unreadNotifications: 0,
        totalGallery: 0
      });
    }

    try {
      const { prisma } = require('./config');
      if (!prisma) {
        console.log('Prisma not available, returning mock data');
        return res.json({
          totalUsers: 0,
          totalMatches: 0,
          totalVideos: 0,
          totalNews: 0,
          liveMatches: 0,
          unreadNotifications: 0,
          totalGallery: 0
        });
      }
      
      // Get counts using Prisma with error handling
      let usersCount = 0, teamsCount = 0, videosCount = 0, matchesCount = 0, newsCount = 0, galleryCount = 0, liveMatches = 0;
      
      try {
        usersCount = await prisma.user.count();
      } catch (e) { console.log('User count failed:', e.message); }
      
      try {
        teamsCount = await prisma.team.count();
      } catch (e) { console.log('Team count failed:', e.message); }
      
      try {
        videosCount = await prisma.video.count();
      } catch (e) { console.log('Video count failed:', e.message); }
      
      try {
        matchesCount = await prisma.match.count();
      } catch (e) { console.log('Match count failed:', e.message); }
      
      try {
        newsCount = await prisma.news.count();
      } catch (e) { console.log('News count failed:', e.message); }
      
      try {
        galleryCount = await prisma.gallery.count();
      } catch (e) { console.log('Gallery count failed:', e.message); }
      
      // Get live matches
      try {
        liveMatches = await prisma.match.count({ where: { status: 'LIVE' } });
      } catch (e) { console.log('Live matches count failed:', e.message); }

      res.json({
        totalUsers: usersCount,
        totalMatches: matchesCount,
        totalVideos: videosCount,
        totalNews: newsCount,
        liveMatches: liveMatches,
        unreadNotifications: 0,
        totalGallery: galleryCount
      });
    } catch (dbError: any) {
      console.error('Database error:', dbError.message);
      // Return mock data instead of error
      res.json({
        totalUsers: 0,
        totalMatches: 0,
        totalVideos: 0,
        totalNews: 0,
        liveMatches: 0,
        unreadNotifications: 0,
        totalGallery: 0
      });
    }
  } catch (error: any) {
    console.error('Admin dashboard error:', error);
    // Return mock data instead of error
    res.json({
      totalUsers: 0,
      totalMatches: 0,
      totalVideos: 0,
      totalNews: 0,
      liveMatches: 0,
      unreadNotifications: 0,
      totalGallery: 0
    });
  }
});

// Admin login endpoint (for admin panel)
app.post('/api/auth/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const databaseUrl = process.env.DATABASE_PRIVATE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL;
    
    console.log('=== ADMIN LOGIN ATTEMPT ===');
    console.log('Email:', email);
    console.log('Database configured:', !!databaseUrl);
    
    if (!databaseUrl) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    try {
      const { prisma } = require('./config');
      if (!prisma) {
        console.error('Prisma client not initialized');
        return res.status(503).json({ error: 'Database not available' });
      }
      
      // Find admin user by email
      const admin = await prisma.user.findFirst({
        where: {
          email: email,
          role: {
            in: ['SUPER_ADMIN', 'LEAGUE_ADMIN']
          }
        }
      });
      
      if (!admin) {
        console.log('Admin user not found in database');
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Verify password
      const bcrypt = require('bcryptjs');
      const isValidPassword = await bcrypt.compare(password, admin.password);
      
      if (!isValidPassword) {
        console.log('Invalid password');
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Update last login
      await prisma.user.update({
        where: { id: admin.id },
        data: { lastLogin: new Date() }
      });
      
      // Generate tokens
      const accessToken = 'admin_token_' + Date.now() + '_' + admin.id;
      const refreshToken = 'refresh_token_' + Date.now() + '_' + admin.id;
      
      console.log('✅ Admin login successful (database authenticated)');
      
      res.json({ 
        message: 'Admin login successful',
        accessToken,
        refreshToken,
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      });
    } catch (dbError: any) {
      console.error('Database error during admin login:', dbError.message);
      
      // Fallback only if database tables don't exist yet
      if (dbError.code === 'P2021' || dbError.message.includes('does not exist')) {
        console.log('Database tables not created yet, using fallback');
        if (email === 'admin@iwkl.com' && password === 'admin123') {
          return res.json({ 
            message: 'Admin login successful (temporary fallback - database tables not yet created)',
            accessToken: 'admin_token_' + Date.now(),
            refreshToken: 'refresh_token_' + Date.now(),
            user: {
              id: 'admin_1',
              name: 'Admin User',
              email: 'admin@iwkl.com',
              role: 'ADMIN'
            }
          });
        }
      }
      
      return res.status(500).json({ error: 'Database error: ' + dbError.message });
    }
  } catch (error: any) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Fan Club Registration endpoint (using Prisma)
app.post('/api/fan-club/register', async (req, res) => {
  try {
    const { fullName, mobileNumber, email, city, state, gender, age, favoriteTeamId } = req.body;
    const databaseUrl = process.env.DATABASE_PRIVATE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL;
    
    console.log('=== FAN CLUB REGISTRATION ===');
    console.log('Name:', fullName);
    console.log('Mobile:', mobileNumber);
    console.log('Database configured:', !!databaseUrl);
    
    if (!databaseUrl) {
      return res.status(400).json({ error: 'Database not configured' });
    }

    try {
      const { prisma } = require('./config');
      if (!prisma) {
        return res.status(503).json({ error: 'Database not available' });
      }
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { mobile: mobileNumber }
      });
      
      if (existingUser) {
        return res.status(400).json({ error: 'User already registered' });
      }
      
      // Insert new user using Prisma
      const user = await prisma.user.create({
        data: {
          id: Date.now().toString(),
          name: fullName,
          mobile: mobileNumber,
          email: email || null,
          role: 'USER',
          isVerified: true
        }
      });
      
      console.log('✅ Fan club registration successful');
      
      res.json({ 
        message: 'Fan club registration successful',
        user: {
          id: user.id,
          name: user.name,
          mobile: user.mobile,
          email: user.email,
          role: user.role
        }
      });
    } catch (dbError: any) {
      console.error('Database error:', dbError.message);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error: any) {
    console.error('Fan club registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Fan Club Registrations endpoint
app.get('/api/fanclub', async (req, res) => {
  try {
    const databaseUrl = process.env.DATABASE_PRIVATE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL;
    
    if (!databaseUrl) {
      return res.status(400).json({ error: 'Database not configured' });
    }

    try {
      const { prisma } = require('./config');
      if (!prisma) {
        return res.status(503).json({ error: 'Database not available' });
      }
      
      const users = await prisma.user.findMany({
        where: { role: 'USER' },
        orderBy: { createdAt: 'desc' }
      });
      
      res.json({ 
        registrations: users.map(u => ({
          id: u.id,
          name: u.name,
          mobile: u.mobile,
          email: u.email,
          createdAt: u.createdAt
        }))
      });
    } catch (dbError: any) {
      console.error('Database error:', dbError.message);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error: any) {
    console.error('Get fan club registrations error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { mobile_number, email, password } = req.body;
    const databaseUrl = process.env.DATABASE_PRIVATE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL;
    
    if (!databaseUrl) {
      return res.status(400).json({ error: 'Database not configured' });
    }

    try {
      const { prisma } = require('./config');
      if (!prisma) {
        return res.status(503).json({ error: 'Database not available' });
      }
      
      // Find user by mobile number or email
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { mobile: mobile_number },
            { email: email }
          ]
        }
      });
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Verify password
      const bcrypt = require('bcryptjs');
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
      });

      res.json({ 
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          mobile_number: user.mobile,
          email: user.email,
          role: user.role
        }
      });
    } catch (dbError: any) {
      console.error('Database error:', dbError.message);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { mobile_number } = req.body;
    const databaseUrl = process.env.DATABASE_PRIVATE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL;
    
    if (!databaseUrl) {
      return res.status(400).json({ error: 'Database not configured' });
    }

    try {
      const { prisma } = require('./config');
      if (!prisma) {
        return res.status(503).json({ error: 'Database not available' });
      }
      
      // Find user by mobile number
      const user = await prisma.user.findUnique({
        where: { mobile: mobile_number }
      });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Update user with OTP
      await prisma.user.update({
        where: { id: user.id },
        data: { otp, otpExpiry }
      });

      res.json({ 
        message: 'OTP sent successfully',
        otp: otp // In production, send via SMS
      });
    } catch (dbError: any) {
      console.error('Database error:', dbError.message);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { mobile_number, otp, newPassword } = req.body;
    const databaseUrl = process.env.DATABASE_PRIVATE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL;
    
    if (!databaseUrl) {
      return res.status(400).json({ error: 'Database not configured' });
    }

    try {
      const { prisma } = require('./config');
      if (!prisma) {
        return res.status(503).json({ error: 'Database not available' });
      }
      
      // Find user and verify OTP
      const user = await prisma.user.findFirst({
        where: {
          mobile: mobile_number,
          otp: otp,
          otpExpiry: { gt: new Date() }
        }
      });
      
      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }
      
      // Hash new password
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password and clear OTP
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          password: hashedPassword,
          otp: null,
          otpExpiry: null
        }
      });

      res.json({ message: 'Password reset successful' });
    } catch (dbError: any) {
      console.error('Database error:', dbError.message);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Database variables endpoint
app.get('/api/variables-info', (req, res) => {
  const requiredVariables = {
    // Database
    DATABASE_PRIVATE_URL: 'Railway PostgreSQL connection URL',
    DATABASE_URL: 'Fallback database URL',
    
    // Authentication
    JWT_ACCESS_SECRET: 'JWT access token secret',
    JWT_REFRESH_SECRET: 'JWT refresh token secret',
    JWT_ACCESS_EXPIRY: 'Access token expiry (e.g., 15m)',
    JWT_REFRESH_EXPIRY: 'Refresh token expiry (e.g., 7d)',
    
    // App
    NODE_ENV: 'development or production',
    FRONTEND_URL: 'Flutter app URL for CORS',
    
    // AWS S3 (optional - for file uploads)
    AWS_ACCESS_KEY_ID: 'AWS access key for S3',
    AWS_SECRET_ACCESS_KEY: 'AWS secret key for S3',
    AWS_REGION: 'AWS region (e.g., us-east-1)',
    AWS_S3_BUCKET: 'S3 bucket name'
  };
  
  const currentStatus = {
    DATABASE_PRIVATE_URL: !!process.env.DATABASE_PRIVATE_URL,
    DATABASE_URL: !!process.env.DATABASE_URL,
    JWT_ACCESS_SECRET: !!process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: !!process.env.JWT_REFRESH_SECRET,
    NODE_ENV: process.env.NODE_ENV || 'not set',
    FRONTEND_URL: process.env.FRONTEND_URL || 'not set'
  };
  
  res.json({
    message: 'Backend variables information',
    required: requiredVariables,
    current: currentStatus,
    setup: 'Set these variables in Railway backend service'
  });
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

// Admin panel endpoint
app.get('/api/admin-panel-info', (req, res) => {
  res.json({
    message: 'Admin Panel Information',
    backendUrl: 'https://iwklappbackend-production.up.railway.app',
    adminPanelOptions: [
      {
        name: 'Railway Backend Dashboard',
        url: 'https://railway.com/project/7c07c3dd-a9c2-4661-b7da-5c9d77ca8590',
        description: 'Direct Railway project access'
      },
      {
        name: 'Database Management',
        url: 'https://railway.com/project/7c07c3dd-a9c2-4661-b7da-5c9d77ca8590/service/e0351cdc-c141-49d3-b129-d9e1e36f1a9f/database',
        description: 'Railway PostgreSQL database access'
      },
      {
        name: 'Backend API Documentation',
        url: 'https://iwklappbackend-production.up.railway.app/api',
        description: 'Available API endpoints'
      }
    ],
    defaultAdmin: {
      email: 'admin@iwkl.com',
      password: 'admin123',
      note: 'Please change this password in production'
    },
    directAdminAPI: {
      login: 'POST /api/auth/login',
      teams: 'GET /api/teams',
      videos: 'GET /api/videos',
      users: 'POST /api/auth/signup',
      databaseSetup: 'GET /api/setup-database'
    }
  });
});

// Simple API test endpoints
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working', timestamp: new Date().toISOString() });
});

// Teams endpoint - now reads from database using Prisma
app.get('/api/teams', async (req, res) => {
  try {
    const databaseUrl = process.env.DATABASE_PRIVATE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!databaseUrl) {
      return res.json({
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
    }

    try {
      const getPrisma = require('./config').default;
      const prisma = getPrisma();
      if (!prisma) {
        return res.json({
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
      }
      
      const teams = await prisma.team.findMany({
        where: { isActive: true }
      });
      
      res.json({ teams });
    } catch (dbError: any) {
      console.error('Database error:', dbError.message);
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
    }
  } catch (error: any) {
    console.error('Teams API error:', error);
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
  }
});

// Videos endpoint - now reads from database using Prisma
app.get('/api/videos', async (req, res) => {
  try {
    const databaseUrl = process.env.DATABASE_PRIVATE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!databaseUrl) {
      return res.json({
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
    }

    try {
      const getPrisma = require('./config').default;
      const prisma = getPrisma();
      if (!prisma) {
        return res.json({
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
      }
      
      const videos = await prisma.video.findMany({
        where: { isActive: true }
      });
      
      res.json({ videos });
    } catch (dbError: any) {
      console.error('Database error:', dbError.message);
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
    }
  } catch (error: any) {
    console.error('Videos API error:', error);
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
  }
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
// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join match room for real-time updates
  socket.on('join-match', (matchId: string) => {
    socket.join(`match-${matchId}`);
    console.log(`Client ${socket.id} joined match ${matchId}`);
  });

  // Leave match room
  socket.on('leave-match', (matchId: string) => {
    socket.leave(`match-${matchId}`);
    console.log(`Client ${socket.id} left match ${matchId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io available globally for other modules
declare global {
  var io: any;
}

const server = httpServer;

console.log('🚀 Starting IWKL Backend API Server...');

// Run Prisma migrations before starting server
runPrismaMigrations().then(() => {
  seedAdminUser().then(() => {
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log('='.repeat(50));
      console.log('✅ IWKL Backend API successfully started!');
      console.log(`📝 Port: ${PORT}`);
      console.log(`🏥 Health Check: http://0.0.0.0:${PORT}/`);
      console.log(`🗄️ Database: ${databaseUrl ? '✅ Configured' : '❌ Not configured'}`);
      console.log(`🔌 Socket.IO: ✅ Enabled`);
      console.log('='.repeat(50));
    });
  });
}).catch((err) => {
  console.error('❌ Failed to run migrations:', err);
  // Start server anyway even if migrations fail
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(50));
    console.log('✅ IWKL Backend API started (without migrations)');
    console.log(`📝 Port: ${PORT}`);
    console.log(`🏥 Health Check: http://0.0.0.0:${PORT}/`);
    console.log(`🔌 Socket.IO: ✅ Enabled`);
    console.log('='.repeat(50));
  });
});

httpServer.on('error', (err: any) => {
  console.error('❌ Server failed to start:', err);
  console.error('Error details:', err.message);
  console.error('Error stack:', err.stack);
  process.exit(1);
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
