const API_URL = 'https://iwkl-backend-lg6t-production.up.railway.app/api';

async function checkDelhiWarriors() {
  try {
    console.log('Step 1: Logging in as admin...');
    
    const loginResponse = await fetch(`${API_URL}/auth/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@iwkl.com',
        password: 'Admin@123'
      })
    });

    const loginData = await loginResponse.json();
    const token = loginData.accessToken;
    console.log('✓ Login successful');

    // Get all teams
    console.log('\nStep 2: Fetching all teams...');
    const teamsResponse = await fetch(`${API_URL}/teams`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const teamsData = await teamsResponse.json();
    const teams = teamsData.data;
    console.log(`✓ Found ${teams.length} teams`);

    // Check for Delhi Warriors
    console.log('\nStep 3: Searching for Delhi Warriors...');
    const delhiWarriors = teams.filter(t => 
      t.name.toLowerCase().includes('delhi') || 
      t.shortName?.toLowerCase().includes('delhi') ||
      t.name.toLowerCase().includes('warriors')
    );

    if (delhiWarriors.length > 0) {
      console.log('✓ Found Delhi Warriors teams:');
      delhiWarriors.forEach(team => {
        console.log(`  - ID: ${team.id}`);
        console.log(`    Name: ${team.name}`);
        console.log(`    Short Name: ${team.shortName}`);
        console.log(`    isActive: ${team.isActive}`);
        console.log(`    Logo: ${team.logo}`);
        console.log(`    City: ${team.city}`);
        console.log('---');
      });
    } else {
      console.log('✗ Delhi Warriors not found in database');
    }

    // List all teams
    console.log('\nStep 4: All teams in database:');
    teams.forEach(team => {
      console.log(`  - ${team.name} (isActive: ${team.isActive})`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkDelhiWarriors();
