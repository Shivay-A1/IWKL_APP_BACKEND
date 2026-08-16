import express from 'express';
import { createServer } from 'http';

// Check if DATABASE_PRIVATE_URL is available (Railway)
const databaseUrl = process.env.DATABASE_PRIVATE_URL || process.env.DATABASE_URL;

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Basic middleware
app.use(express.json());

// Root endpoint for healthcheck
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'IWKL Backend API', timestamp: new Date().toISOString() });
});

// Health check with database status
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: databaseUrl ? 'configured' : 'not configured'
  });
});

// Database test endpoint
app.get('/api/db-test', (req, res) => {
  if (databaseUrl) {
    res.json({ 
      message: 'Database configured', 
      timestamp: new Date().toISOString(),
      database_type: 'Railway PostgreSQL'
    });
  } else {
    res.status(400).json({ 
      message: 'Database not configured', 
      timestamp: new Date().toISOString()
    });
  }
});

// Simple API test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working', timestamp: new Date().toISOString() });
});

// Start server
const server = createServer(app);

server.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(50));
  console.log('🚀 IWKL Backend API successfully started!');
  console.log(`📝 Port: ${PORT}`);
  console.log(`🏥 Health Check: http://0.0.0.0:${PORT}/`);
  console.log(`🗄️ Database: ${databaseUrl ? '✅ Connected' : '❌ Not configured'}`);
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

export default app;
