const API_URL = 'https://iwkl-backend-lg6t-production.up.railway.app/api';

async function forceActivateFalse() {
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
    console.log('\nStep 2: Finding HIDDEN_TEAM_ARCHIVE...');
    const teamsResponse = await fetch(`${API_URL}/teams?limit=100`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const teamsData = await teamsResponse.json();
    const allTeams = teamsData.data;
    
    // Find HIDDEN_TEAM_ARCHIVE
    const hiddenTeam = allTeams.find(t => t.name.includes('HIDDEN_TEAM_ARCHIVE_1785794055040'));
    
    if (hiddenTeam) {
      console.log(`\nStep 3: Force setting isActive=false for HIDDEN_TEAM_ARCHIVE (ID: ${hiddenTeam.id})...`);
      
      const updateResponse = await fetch(`${API_URL}/teams/${hiddenTeam.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: hiddenTeam.name,
          shortName: hiddenTeam.shortName,
          logo: hiddenTeam.logo,
          banner: hiddenTeam.banner,
          jerseyColor: hiddenTeam.jerseyColor,
          foundedYear: hiddenTeam.foundedYear,
          city: hiddenTeam.city,
          stadiumId: hiddenTeam.stadiumId,
          coach: hiddenTeam.coach,
          description: hiddenTeam.description,
          socialMedia: hiddenTeam.socialMedia,
          seasonId: hiddenTeam.seasonId,
          isActive: false
        })
      });

      console.log('Update response status:', updateResponse.status);
      const updateText = await updateResponse.text();
      console.log('Update response:', updateText);

      if (updateResponse.status === 200 || updateResponse.status === 201) {
        console.log('✓ HIDDEN_TEAM_ARCHIVE force deactivated');
      } else {
        console.log('✗ Failed to force deactivate');
      }
    } else {
      console.log('\n✗ HIDDEN_TEAM_ARCHIVE not found');
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

forceActivateFalse();
