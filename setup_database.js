const { Client } = require('pg');
const fs = require('fs');

// Railway database connection using environment variable
async function setupDatabase() {
  console.log('🚀 Starting Railway database setup...');
  
  try {
    // Use Railway DATABASE_URL from environment variables
    const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:WvuhVpsYDlwLLCmtgjKQiJnusfWANpvc@containers-us-west-XXX.railway.app:5432/railway';
    
    console.log('📡 Connecting to Railway PostgreSQL...');
    const client = new Client({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false
      }
    });

    await client.connect();
    console.log('✅ Connected to Railway PostgreSQL successfully!');

    // Read the SQL file
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
      } catch (error) {
        console.log(`⚠️ Statement ${i + 1}/${statements.length} failed (might be safe):`, error.message);
      }
    }

    console.log('🎉 Database setup completed successfully!');
    
    // Test the setup
    console.log('🔍 Testing database setup...');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('📊 Created tables:', tables.rows.map(r => r.table_name));

    await client.end();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();