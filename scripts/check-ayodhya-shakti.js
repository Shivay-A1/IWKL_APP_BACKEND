const API_URL = 'https://iwkl-backend-lg6t-production.up.railway.app/api';

async function checkAyodhyaShakti() {
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

    // Check for Ayodhya Shakti
    console.log('\nStep 3: Checking for Ayodhya Shakti...');
    const ayodhyaTeam = teams.find(t => t.name.toLowerCase().includes('ayodhya'));
    
    if (ayodhyaTeam) {
      console.log('✓ Ayodhya Shakti found:');
      console.log(`  - ID: ${ayodhyaTeam.id}`);
      console.log(`  - Name: ${ayodhyaTeam.name}`);
      console.log(`  - isActive: ${ayodhyaTeam.isActive}`);
      console.log(`  - Logo: ${ayodhyaTeam.logo}`);
    } else {
      console.log('✗ Ayodhya Shakti not found');
    }

    // List all teams
    console.log('\nStep 4: All teams in database:');
    teams.forEach((team, index) => {
      console.log(`${index + 1}. ${team.name} (isActive: ${team.isActive})`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkAyodhyaShakti();
