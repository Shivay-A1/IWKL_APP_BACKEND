const { Client } = require('pg');
const fs = require('fs');

// Railway database connection using Railway public domain
async function setupDatabase() {
  console.log('🚀 Starting Railway database setup...');
  
  try {
    // Railway public connection string using the correct public domain
    const railwayUrl = 'postgresql://postgres:WvuhVpsYDlwLLCmtgjKQiJnusfWANpvc@postgres-production-4fb6.up.railway.app:5432/railway';
    
    console.log('📡 Connecting to Railway PostgreSQL...');
    console.log('🔗 Connection string:', railwayUrl.substring(0, 50) + '...');
    
    const client = new Client({
      connectionString: railwayUrl,
      ssl: {
        rejectUnauthorized: false
      }
    });

    await client.connect();
    console.log('✅ Connected to Railway PostgreSQL successfully!');

    // Read the SQL file
    const sqlContent = fs.readFileSync('./database_setup.sql', 'utf8');
    console.log('📄 SQL file loaded successfully');

    // Execute the complete SQL file as one transaction
    console.log('🔧 Executing SQL setup script...');
    await client.query(sqlContent);
    console.log('✅ SQL setup script executed successfully');

    console.log('🎉 Database setup completed successfully!');
    
    // Test the setup
    console.log('🔍 Testing database setup...');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('📊 Created tables:', tables.rows.map(r => r.table_name));

    // Check admin user
    const adminUsers = await client.query('SELECT * FROM admin_users');
    console.log('👤 Admin users:', adminUsers.rows.map(r => ({ email: r.email, role: r.role })));

    // Check teams
    const teams = await client.query('SELECT * FROM teams');
    console.log('🏆 Teams:', teams.rows.map(r => ({ name: r.name, shortName: r.shortName })));

    await client.end();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();