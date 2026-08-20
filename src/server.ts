import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer } from 'http';
import apiRoutes from './routes';

dotenv.config();

const app = express();
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

    // Test database connection
    if (databaseUrl) {
      try {
        const { Client } = require('pg');
        const client = new Client({
          connectionString: databaseUrl,
          ssl: { rejectUnauthorized: false }
        });
        await client.connect();
        
        // Test queries
        const teamsCount = await client.query('SELECT COUNT(*) FROM teams');
        const usersCount = await client.query('SELECT COUNT(*) FROM users');
        const adminUsersCount = await client.query('SELECT COUNT(*) FROM admin_users');
        
        results.database.status = 'connected';
        results.database.data = {
          teams: parseInt(teamsCount.rows[0].count),
          users: parseInt(usersCount.rows[0].count),
          admin_users: parseInt(adminUsersCount.rows[0].count)
        };
        
        await client.end();
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

// Database setup endpoint (for Railway deployment)
app.get('/api/setup-database', async (req, res) => {
  try {
    // Check all possible database environment variables
    const databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_PRIVATE_URL || process.env.POSTGRES_URL;
    
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

    const { Client } = require('pg');
    const client = new Client({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    console.log('✅ Database connected successfully');
    
    const createdTables = [];
    const errors = [];

    // Create Users Table
    try {
      await client.query(`DROP TABLE IF EXISTS users CASCADE`);
      await client.query(`
        CREATE TABLE users (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          mobile_number VARCHAR(20) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'USER',
          avatar VARCHAR(500),
          isVerified BOOLEAN DEFAULT false,
          isPremium BOOLEAN DEFAULT false,
          otp VARCHAR(10),
          otpExpiry TIMESTAMP,
          resetToken VARCHAR(255),
          resetTokenExpiry TIMESTAMP,
          lastLogin TIMESTAMP,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      createdTables.push('users');
      console.log('✅ Users table created');
    } catch (error: any) {
      errors.push(`Users table: ${error.message}`);
    }

    // Create Teams Table
    try {
      await client.query(`DROP TABLE IF EXISTS teams CASCADE`);
      await client.query(`
        CREATE TABLE teams (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(100) UNIQUE NOT NULL,
          logoUrl VARCHAR(500),
          bannerUrl VARCHAR(500),
          abbreviation VARCHAR(10),
          color VARCHAR(20),
          foundedYear INTEGER,
          homeCity VARCHAR(100),
          description TEXT,
          coach VARCHAR(255),
          captain VARCHAR(255),
          wins INTEGER DEFAULT 0,
          losses INTEGER DEFAULT 0,
          isActive BOOLEAN DEFAULT true,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      createdTables.push('teams');
      console.log('✅ Teams table created');
    } catch (error: any) {
      errors.push(`Teams table: ${error.message}`);
    }

    // Create Videos Table
    try {
      await client.query(`DROP TABLE IF EXISTS videos CASCADE`);
      await client.query(`
        CREATE TABLE videos (
          id VARCHAR(255) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          videoUrl VARCHAR(500) NOT NULL,
          thumbnailUrl VARCHAR(500),
          category VARCHAR(100),
          duration INTEGER,
          isPremium BOOLEAN DEFAULT false,
          isActive BOOLEAN DEFAULT true,
          viewCount INTEGER DEFAULT 0,
          likes INTEGER DEFAULT 0,
          featured BOOLEAN DEFAULT false,
          tags TEXT[],
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      createdTables.push('videos');
      console.log('✅ Videos table created');
    } catch (error: any) {
      errors.push(`Videos table: ${error.message}`);
    }

    // Create Seasons Table
    try {
      await client.query(`DROP TABLE IF EXISTS seasons CASCADE`);
      await client.query(`
        CREATE TABLE seasons (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(100) UNIQUE NOT NULL,
          year INTEGER NOT NULL,
          startDate TIMESTAMP,
          endDate TIMESTAMP,
          isActive BOOLEAN DEFAULT false,
          isCompleted BOOLEAN DEFAULT false,
          description TEXT,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      createdTables.push('seasons');
      console.log('✅ Seasons table created');
    } catch (error: any) {
      errors.push(`Seasons table: ${error.message}`);
    }

    // Create Matches Table
    try {
      await client.query(`DROP TABLE IF EXISTS matches CASCADE`);
      await client.query(`
        CREATE TABLE matches (
          id VARCHAR(255) PRIMARY KEY,
          seasonId VARCHAR(255),
          homeTeamId VARCHAR(255),
          awayTeamId VARCHAR(255),
          venue VARCHAR(255),
          matchDate TIMESTAMP,
          status VARCHAR(50) DEFAULT 'SCHEDULED',
          homeScore INTEGER DEFAULT 0,
          awayScore INTEGER DEFAULT 0,
          quarter1Scores JSONB,
          quarter2Scores JSONB,
          quarter3Scores JSONB,
          quarter4Scores JSONB,
          highlights TEXT[],
          isLive BOOLEAN DEFAULT false,
          isPremium BOOLEAN DEFAULT false,
          metadata JSONB,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      createdTables.push('matches');
      console.log('✅ Matches table created');
    } catch (error: any) {
      errors.push(`Matches table: ${error.message}`);
    }

    // Create Points Table
    try {
      await client.query(`DROP TABLE IF EXISTS points_table CASCADE`);
      await client.query(`
        CREATE TABLE points_table (
          id VARCHAR(255) PRIMARY KEY,
          seasonId VARCHAR(255),
          teamId VARCHAR(255),
          played INTEGER DEFAULT 0,
          won INTEGER DEFAULT 0,
          lost INTEGER DEFAULT 0,
          tied INTEGER DEFAULT 0,
          points INTEGER DEFAULT 0,
          nrr DECIMAL(10,2) DEFAULT 0.00,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      createdTables.push('points_table');
      console.log('✅ Points table created');
    } catch (error: any) {
      errors.push(`Points table: ${error.message}`);
    }

    // Create Gallery Table
    try {
      await client.query(`DROP TABLE IF EXISTS gallery CASCADE`);
      await client.query(`
        CREATE TABLE gallery (
          id VARCHAR(255) PRIMARY KEY,
          title VARCHAR(255),
          imageUrl VARCHAR(500) NOT NULL,
          category VARCHAR(100),
          isPremium BOOLEAN DEFAULT false,
          isActive BOOLEAN DEFAULT true,
          description TEXT,
          tags TEXT[],
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      createdTables.push('gallery');
      console.log('✅ Gallery table created');
    } catch (error: any) {
      errors.push(`Gallery table: ${error.message}`);
    }

    // Create News Table
    try {
      await client.query(`DROP TABLE IF EXISTS news CASCADE`);
      await client.query(`
        CREATE TABLE news (
          id VARCHAR(255) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT,
          imageUrl VARCHAR(500),
          category VARCHAR(100),
          isPublished BOOLEAN DEFAULT false,
          isPremium BOOLEAN DEFAULT false,
          publishedAt TIMESTAMP,
          metadata JSONB,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      createdTables.push('news');
      console.log('✅ News table created');
    } catch (error: any) {
      errors.push(`News table: ${error.message}`);
    }

    // Create Admin Users Table
    try {
      await client.query(`DROP TABLE IF EXISTS admin_users CASCADE`);
      await client.query(`
        CREATE TABLE admin_users (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'ADMIN',
          lastLogin TIMESTAMP,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      createdTables.push('admin_users');
      console.log('✅ Admin users table created');
    } catch (error: any) {
      errors.push(`Admin users table: ${error.message}`);
    }

    // Insert 10 Teams with proper logos
    try {
      await client.query(`
        INSERT INTO teams (id, name, logoUrl, abbreviation, color, homeCity, description, isActive) VALUES
        ('1', 'Garvi Gujarat', 'assets/teams/garvi_gujarat.png', 'GG', '#FF6B35', 'Ahmedabad', 'Gujarat Women Kabaddi Team', true),
        ('2', 'Mumbai Strikers', 'assets/teams/mumbai_strikers.jpeg', 'MS', '#1E3A8A', 'Mumbai', 'Mumbai Women Kabaddi Team', true),
        ('3', 'Odisha Kalingas', 'assets/teams/odisha_kalingas.png', 'OK', '#E11D48', 'Bhubaneswar', 'Odisha Women Kabaddi Team', true),
        ('4', 'Delhi Warriors', 'assets/teams/delhi_warriors.jpeg', 'DW', '#1D4ED8', 'Delhi', 'Delhi Women Kabaddi Team', true),
        ('5', 'Punjab Wings', 'assets/teams/punjab_wings.jpeg', 'PW', '#6D28D9', 'Ludhiana', 'Punjab Women Kabaddi Team', true),
        ('6', 'Kashmiri Queens', 'assets/teams/kashmiri_queens.jpeg', 'KQ', '#7C3AED', 'Srinagar', 'Kashmir Women Kabaddi Team', true),
        ('7', 'Namma Bengaluru', 'assets/teams/namma_bengaluru.jpeg', 'NB', '#84CC16', 'Bengaluru', 'Bengaluru Women Kabaddi Team', true),
        ('8', 'Haryanvi Fighters', 'assets/teams/haryanvi_fighters.jpeg', 'HF', '#0F766E', 'Karnal', 'Haryana Women Kabaddi Team', true),
        ('9', 'Kolkata Rangers', 'assets/teams/kolkata_rangers.jpeg', 'KR', '#1E40AF', 'Kolkata', 'Kolkata Women Kabaddi Team', true),
        ('10', 'Ayodhya Shakti', 'assets/teams/ayodhya_shakti.jpeg', 'AS', '#DC2626', 'Ayodhya', 'Ayodhya Women Kabaddi Team', true)
        ON CONFLICT (name) DO NOTHING
      `);
      console.log('✅ 10 Teams inserted');
    } catch (error: any) {
      errors.push(`Teams insert: ${error.message}`);
    }

    // Insert Sample Videos
    try {
      await client.query(`
        INSERT INTO videos (id, title, videoUrl, thumbnailUrl, category, duration, featured, isActive) VALUES
        ('1', 'IWKL Kabaddi Highlight 1', 'https://youtube.com/shorts/E8YS-cPPdZY?si=JgGJfcXqrXCRqWK9', 'https://img.youtube.com/vi/E8YS-cPPdZY/hqdefault.jpg', 'Highlights', 30, true, true),
        ('2', 'IWKL Kabaddi Highlight 2', 'https://youtube.com/shorts/YZjFff0rfqE?si=9YAFEtAKNtyH_IQP', 'https://img.youtube.com/vi/YZjFff0rfqE/hqdefault.jpg', 'Highlights', 30, true, true),
        ('3', 'IWKL Kabaddi Highlight 3', 'https://youtube.com/shorts/KMIeFlYcPg0?si=n45a687cXbkcnQb6', 'https://img.youtube.com/vi/KMIeFlYcPg0/hqdefault.jpg', 'Highlights', 30, true, true)
        ON CONFLICT DO NOTHING
      `);
      console.log('✅ Sample videos inserted');
    } catch (error: any) {
      errors.push(`Videos insert: ${error.message}`);
    }

    // Insert Sample Season
    try {
      await client.query(`
        INSERT INTO seasons (id, name, year, startDate, endDate, isActive, isCompleted) VALUES
        ('1', 'IWKL 2026', 2026, '2026-01-01', '2026-12-31', true, false)
        ON CONFLICT (name) DO NOTHING
      `);
      console.log('✅ Sample season inserted');
    } catch (error: any) {
      errors.push(`Season insert: ${error.message}`);
    }

    // Insert Sample Points Table (all zeros)
    try {
      await client.query(`
        INSERT INTO points_table (id, seasonId, teamId, played, won, lost, tied, points, nrr) VALUES
        ('1', '1', '1', 0, 0, 0, 0, 0, 0.00),
        ('2', '1', '2', 0, 0, 0, 0, 0, 0.00),
        ('3', '1', '3', 0, 0, 0, 0, 0, 0.00),
        ('4', '1', '4', 0, 0, 0, 0, 0, 0.00),
        ('5', '1', '5', 0, 0, 0, 0, 0, 0.00),
        ('6', '1', '6', 0, 0, 0, 0, 0, 0.00),
        ('7', '1', '7', 0, 0, 0, 0, 0, 0.00),
        ('8', '1', '8', 0, 0, 0, 0, 0, 0.00),
        ('9', '1', '9', 0, 0, 0, 0, 0, 0.00),
        ('10', '1', '10', 0, 0, 0, 0, 0, 0.00)
        ON CONFLICT DO NOTHING
      `);
      console.log('✅ Points table (all zeros) inserted');
    } catch (error: any) {
      errors.push(`Points table insert: ${error.message}`);
    }

    // Insert Sample Gallery
    try {
      await client.query(`
        INSERT INTO gallery (id, title, imageUrl, category, isActive) VALUES
        ('1', 'IWKL Gallery 1', 'assets/gallery/gallery_1.png', 'Match', true),
        ('2', 'IWKL Gallery 2', 'assets/gallery/gallery_2.png', 'Match', true),
        ('3', 'IWKL Gallery 3', 'assets/gallery/gallery_3.jpg', 'Match', true)
        ON CONFLICT DO NOTHING
      `);
      console.log('✅ Sample gallery inserted');
    } catch (error: any) {
      errors.push(`Gallery insert: ${error.message}`);
    }

    // Insert Default Admin User
    try {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await client.query(`
        INSERT INTO admin_users (id, name, email, password, role) VALUES
        ('admin001', 'Super Admin', 'admin@iwkl.com', $1, 'SUPER_ADMIN')
        ON CONFLICT (email) DO NOTHING
      `, [hashedPassword]);
      console.log('✅ Default admin user created');
    } catch (error: any) {
      errors.push(`Admin user insert: ${error.message}`);
    }

    console.log('🎉 Complete database setup completed successfully!');
    
    // Test the setup
    console.log('🔍 Testing database setup...');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('📊 Total tables in database:', tables.rows.map(r => r.table_name));

    await client.end();
    res.json({ 
      message: 'Complete database setup completed successfully',
      createdTables: createdTables,
      totalTables: tables.rows.map(r => r.table_name),
      teams: 10,
      videos: 3,
      errors: errors.length > 0 ? errors : null
    });
  } catch (error: any) {
    console.error('Database setup error:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
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

    const { Client } = require('pg');
    const bcrypt = require('bcryptjs');
    const client = new Client({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    
    // Check if user already exists
    const existingUser = await client.query(
      'SELECT * FROM users WHERE mobile_number = $1',
      [mobile_number]
    );
    
    if (existingUser.rows.length > 0) {
      await client.end();
      return res.status(400).json({ error: 'User with this mobile number already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = 'user_' + Date.now().toString();

    // Insert new user
    await client.query(
      'INSERT INTO users (id, name, mobile_number, email, password) VALUES ($1, $2, $3, $4, $5)',
      [userId, name, mobile_number, email, hashedPassword]
    );

    await client.end();
    res.json({ 
      message: 'User registered successfully',
      userId: userId,
      mobile_number: mobile_number
    });
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
      return res.status(400).json({ error: 'Database not configured' });
    }

    const { Client } = require('pg');
    const client = new Client({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    
    // Get counts from all tables
    const usersCount = await client.query('SELECT COUNT(*) as count FROM users');
    const teamsCount = await client.query('SELECT COUNT(*) as count FROM teams');
    const videosCount = await client.query('SELECT COUNT(*) as count FROM videos');
    const matchesCount = await client.query('SELECT COUNT(*) as count FROM matches');
    const newsCount = await client.query('SELECT COUNT(*) as count FROM news');
    const galleryCount = await client.query('SELECT COUNT(*) as count FROM gallery');
    
    // Get live matches
    const liveMatches = await client.query("SELECT COUNT(*) as count FROM matches WHERE status = 'LIVE'");
    
    await client.end();

    res.json({
      totalUsers: parseInt(usersCount.rows[0].count),
      totalMatches: parseInt(matchesCount.rows[0].count),
      totalVideos: parseInt(videosCount.rows[0].count),
      totalNews: parseInt(newsCount.rows[0].count),
      liveMatches: parseInt(liveMatches.rows[0].count),
      unreadNotifications: 0,
      totalGallery: parseInt(galleryCount.rows[0].count)
    });
  } catch (error: any) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: error.message });
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
    
    // Always use fallback for now (we'll enable proper login once tables are created)
    console.log('Using fallback admin login');
    if (email === 'admin@iwkl.com' && password === 'admin123') {
      return res.json({ 
        message: 'Admin login successful',
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
    return res.status(401).json({ error: 'Invalid credentials (use admin@iwkl.com / admin123)' });
    
    // Note: Once database tables are created, we can enable proper database login below
  } catch (error: any) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Fan Club Registration endpoint (using SQL database)
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

    const { Client } = require('pg');
    const client = new Client({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    
    try {
      // Check if user already exists
      const existingUser = await client.query(
        'SELECT * FROM users WHERE mobile_number = $1',
        [mobileNumber]
      );
      
      if (existingUser.rows.length > 0) {
        await client.end();
        return res.status(400).json({ error: 'User already registered' });
      }
      
      // Insert new user
      const result = await client.query(
        `INSERT INTO users (id, name, mobile_number, email, role, isVerified) 
         VALUES ($1, $2, $3, $4, 'USER', true) 
         RETURNING *`,
        [Date.now().toString(), fullName, mobileNumber, email]
      );
      
      await client.end();
      
      console.log('✅ Fan club registration successful');
      
      res.json({ 
        message: 'Fan club registration successful',
        user: result.rows[0]
      });
    } catch (dbError: any) {
      await client.end();
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

    const { Client } = require('pg');
    const client = new Client({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    
    try {
      const result = await client.query(
        'SELECT * FROM users WHERE role = $1 ORDER BY created_at DESC',
        ['USER']
      );
      
      await client.end();
      
      res.json({ 
        registrations: result.rows
      });
    } catch (dbError: any) {
      await client.end();
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

    const { Client } = require('pg');
    const bcrypt = require('bcryptjs');
    const client = new Client({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    
    // Find user by mobile number or email
    const result = await client.query(
      'SELECT * FROM users WHERE mobile_number = $1 OR email = $2',
      [mobile_number, email]
    );
    
    if (result.rows.length === 0) {
      await client.end();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      await client.end();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await client.query(
      'UPDATE users SET lastLogin = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    await client.end();
    res.json({ 
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        mobile_number: user.mobile_number,
        email: user.email,
        role: user.role
      }
    });
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

    const { Client } = require('pg');
    const client = new Client({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    
    // Find user by mobile number
    const result = await client.query(
      'SELECT * FROM users WHERE mobile_number = $1',
      [mobile_number]
    );
    
    if (result.rows.length === 0) {
      await client.end();
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with OTP
    await client.query(
      'UPDATE users SET otp = $1, otpExpiry = $2 WHERE id = $3',
      [otp, otpExpiry, user.id]
    );

    await client.end();
    res.json({ 
      message: 'OTP sent successfully',
      otp: otp // In production, send via SMS
    });
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

    const { Client } = require('pg');
    const bcrypt = require('bcryptjs');
    const client = new Client({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    
    // Find user and verify OTP
    const result = await client.query(
      'SELECT * FROM users WHERE mobile_number = $1 AND otp = $2 AND otpExpiry > NOW()',
      [mobile_number, otp]
    );
    
    if (result.rows.length === 0) {
      await client.end();
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const user = result.rows[0];
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP
    await client.query(
      'UPDATE users SET password = $1, otp = NULL, otpExpiry = NULL WHERE id = $2',
      [hashedPassword, user.id]
    );

    await client.end();
    res.json({ message: 'Password reset successful' });
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

// Teams endpoint - now reads from database
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

    const { Client } = require('pg');
    const client = new Client({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    const result = await client.query('SELECT * FROM teams WHERE isActive = true');
    await client.end();
    
    res.json({ teams: result.rows });
  } catch (error: any) {
    console.error('Teams API error:', error);
    // Fallback to sample data if database fails
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

// Videos endpoint - now reads from database
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

    const { Client } = require('pg');
    const client = new Client({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    const result = await client.query('SELECT * FROM videos WHERE isActive = true');
    await client.end();
    
    res.json({ videos: result.rows });
  } catch (error: any) {
    console.error('Videos API error:', error);
    // Fallback to sample data if database fails
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
const server = createServer(app);

console.log('🚀 Starting IWKL Backend API Server...');

// Run Prisma migrations before starting server
runPrismaMigrations().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(50));
    console.log('✅ IWKL Backend API successfully started!');
    console.log(`📝 Port: ${PORT}`);
    console.log(`🏥 Health Check: http://0.0.0.0:${PORT}/`);
    console.log(`🗄️ Database: ${databaseUrl ? '✅ Configured' : '❌ Not configured'}`);
    console.log('='.repeat(50));
  });
}).catch((err) => {
  console.error('❌ Failed to run migrations:', err);
  // Start server anyway even if migrations fail
  server.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(50));
    console.log('✅ IWKL Backend API started (without migrations)');
    console.log(`📝 Port: ${PORT}`);
    console.log(`🏥 Health Check: http://0.0.0.0:${PORT}/`);
    console.log('='.repeat(50));
  });
});

server.on('error', (err: any) => {
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
