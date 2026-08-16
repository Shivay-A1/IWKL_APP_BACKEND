const API_URL = 'https://iwkl-backend-lg6t-production.up.railway.app/api';

async function hideExtraTeam() {
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
    
    // Find ARCHIVED_EXTRA_TEAM
    const extraTeam = allTeams.find(t => t.name === 'ARCHIVED_EXTRA_TEAM');
    
    if (extraTeam) {
      console.log(`\nStep 3: Renaming ARCHIVED_EXTRA_TEAM to HIDDEN_TEAM_ARCHIVE_${Date.now()} (ID: ${extraTeam.id})...`);
      
      const newName = `HIDDEN_TEAM_ARCHIVE_${Date.now()}`;
      const updateResponse = await fetch(`${API_URL}/teams/${extraTeam.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newName,
          shortName: 'HID',
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
        console.log(`✓ ARCHIVED_EXTRA_TEAM renamed to ${newName}`);
      } else {
        console.log('✗ Failed to rename');
      }
    } else {
      console.log('\n✗ ARCHIVED_EXTRA_TEAM not found');
    }

    // Also hide the other archived team
    const archivedTeam = allTeams.find(t => t.name === 'DELETED_ARCHIVED_TEAM');
    
    if (archivedTeam) {
      console.log(`\nStep 4: Renaming DELETED_ARCHIVED_TEAM to HIDDEN_ARCHIVE_TEAM_${Date.now()} (ID: ${archivedTeam.id})...`);
      
      const newName = `HIDDEN_ARCHIVE_TEAM_${Date.now()}`;
      const updateResponse = await fetch(`${API_URL}/teams/${archivedTeam.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newName,
          shortName: 'HID',
          logo: '/team-logos/deleted.png',
          banner: null,
          jerseyColor: '#FF0000',
          foundedYear: 2024,
          city: 'Gujrat',
          stadiumId: null,
          coach: 'TBA',
          description: 'Archived team',
          socialMedia: {
            twitter: 'https://twitter.com/gujkabaddi',
            facebook: 'https://facebook.com/gujkabaddi',
            instagram: 'https://instagram.com/gujkabaddi'
          },
          seasonId: 'cmq92f2zv000a1uqfgz5cnedq'
        })
      });

      console.log('Update response status:', updateResponse.status);
      const updateText = await updateResponse.text();
      console.log('Update response:', updateText);

      if (updateResponse.status === 200 || updateResponse.status === 201) {
        console.log(`✓ DELETED_ARCHIVED_TEAM renamed to ${newName}`);
      } else {
        console.log('✗ Failed to rename');
      }
    } else {
      console.log('\n✗ DELETED_ARCHIVED_TEAM not found');
    }

    // Verify final state
    console.log('\nStep 5: Verifying final state...');
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

hideExtraTeam();
