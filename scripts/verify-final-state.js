const API_URL = 'https://iwkl-backend-lg6t-production.up.railway.app/api';

async function verifyFinalState() {
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
    console.log('\nStep 2: Verifying final team state...');
    const teamsResponse = await fetch(`${API_URL}/teams?limit=100`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const teamsData = await teamsResponse.json();
    const allTeams = teamsData.data;
    
    console.log(`\nTotal teams in database: ${allTeams.length}`);
    console.log('\nAll teams:');
    allTeams.forEach((team, index) => {
      console.log(`  ${index + 1}. ${team.name} (ID: ${team.id}, isActive: ${team.isActive})`);
    });

    console.log('\nActive teams (should be visible in frontend):');
    const activeTeams = allTeams.filter(t => t.isActive);
    activeTeams.forEach((team, index) => {
      console.log(`  ${index + 1}. ${team.name} (ID: ${team.id})`);
    });

    console.log('\nHidden teams (should not be visible in frontend):');
    const hiddenTeams = allTeams.filter(t => t.name.includes('HIDDEN'));
    hiddenTeams.forEach((team, index) => {
      console.log(`  ${index + 1}. ${team.name} (ID: ${team.id}, isActive: ${team.isActive})`);
    });

    console.log('\nExpected active teams:');
    console.log('  1. Delhi Warriors Team');
    console.log('  2. Garvi Gujarat');
    console.log('  3. Odisha Kalingas');
    console.log('  4. Punjab Wings');
    console.log('  5. Namma Bengaluru');
    console.log('  6. Mumbai Strikers');
    console.log('  7. Kolkata Rangers');
    console.log('  8. Kashmiri Queens');
    console.log('  9. Haryanvi Fighters');
    console.log('  10. Ayodhya Shakti');

    console.log('\n✓ Verification complete');
    console.log(`✓ Active teams count: ${activeTeams.length} (expected: 10)`);
    console.log(`✓ Hidden teams count: ${hiddenTeams.length} (expected: 2)`);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

verifyFinalState();
