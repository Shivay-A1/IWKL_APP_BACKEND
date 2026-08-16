const API_URL = 'https://iwkl-backend-lg6t-production.up.railway.app/api';

async function checkAllTeamsDetailed() {
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

    // List all teams with full details
    console.log('\nStep 3: All teams with full details:');
    teams.forEach((team, index) => {
      console.log(`\n${index + 1}. ${team.name}`);
      console.log(`   ID: ${team.id}`);
      console.log(`   Short Name: ${team.shortName}`);
      console.log(`   City: ${team.city}`);
      console.log(`   isActive: ${team.isActive}`);
      console.log(`   Logo: ${team.logo}`);
      console.log(`   Coach: ${team.coach}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkAllTeamsDetailed();
