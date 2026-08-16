const API_URL = 'https://iwkl-backend-lg6t-production.up.railway.app/api';

async function renameExtraTeam() {
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
    console.log('\nStep 2: Finding extra team...');
    const teamsResponse = await fetch(`${API_URL}/teams?limit=100`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const teamsData = await teamsResponse.json();
    const allTeams = teamsData.data;
    
    // Find DELETED_EXTRA_DELHI_WARRIORS
    const extraDelhi = allTeams.find(t => t.name === 'DELETED_EXTRA_DELHI_WARRIORS');
    
    if (extraDelhi) {
      console.log(`\nStep 3: Renaming DELETED_EXTRA_DELHI_WARRIORS to ARCHIVED_EXTRA_TEAM (ID: ${extraDelhi.id})...`);
      
      const updateResponse = await fetch(`${API_URL}/teams/${extraDelhi.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'ARCHIVED_EXTRA_TEAM',
          shortName: 'ARC',
          logo: '/delhi-warriors.png',
          banner: null,
          jerseyColor: null,
          foundedYear: null,
          city: null,
          stadiumId: null,
          coach: null,
          description: null,
          socialMedia: null,
          seasonId: 'cmq92f2zv000a1uqfgz5cnedq'
        })
      });

      console.log('Update response status:', updateResponse.status);
      const updateText = await updateResponse.text();
      console.log('Update response:', updateText);

      if (updateResponse.status === 200 || updateResponse.status === 201) {
        console.log('✓ DELETED_EXTRA_DELHI_WARRIORS renamed to ARCHIVED_EXTRA_TEAM');
      } else {
        console.log('✗ Failed to rename');
      }
    } else {
      console.log('\n✗ DELETED_EXTRA_DELHI_WARRIORS not found');
    }

    // Verify final state
    console.log('\nStep 4: Verifying final state...');
    const finalResponse = await fetch(`${API_URL}/teams?limit=100`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const finalData = await finalResponse.json();
    console.log(`\nFinal team count: ${finalData.data.length}`);
    console.log('Active teams:');
    finalData.data.filter(t => t.isActive).forEach((team, index) => {
      console.log(`  ${index + 1}. ${team.name} (ID: ${team.id})`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

renameExtraTeam();
