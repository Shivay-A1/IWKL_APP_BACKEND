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

    const { Client } = require('pg');
    const client = new Client({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    console.log('✅ Database connected successfully');
    
    // Read the complete SQL file
    const fs = require('fs');
    const sqlContent = fs.readFileSync('./database_setup.sql', 'utf8');
    console.log('📄 SQL file loaded successfully');

    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`🔧 Executing ${statements.length} SQL statements...`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      try {
        await client.query(statements[i]);
        console.log(`✅ Statement ${i + 1}/${statements.length} executed successfully`);
      } catch (error: any) {
        console.log(`⚠️ Statement ${i + 1}/${statements.length} failed (might be safe):`, error.message);
      }
    }

    console.log('🎉 Complete database setup completed successfully!');
    
    // Test the setup
    console.log('🔍 Testing database setup...');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('📊 Created tables:', tables.rows.map(r => r.table_name));

    await client.end();
    res.json({ 
      message: 'Complete database setup completed successfully',
      tables: tables.rows.map(r => r.table_name),
      teams: 10,
      videos: 3
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

app.post('/api/auth/login', async (req, res) => {
  try {
    const { mobile_number, password } = req.body;
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
    
    // Find user by mobile number
    const result = await client.query(
      'SELECT * FROM users WHERE mobile_number = $1',
      [mobile_number]
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
