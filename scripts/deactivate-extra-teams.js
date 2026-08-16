const API_URL = 'https://iwkl-backend-lg6t-production.up.railway.app/api';

async function deactivateExtraTeams() {
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
    console.log('\nStep 2: Finding extra teams...');
    const teamsResponse = await fetch(`${API_URL}/teams?limit=100`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const teamsData = await teamsResponse.json();
    const allTeams = teamsData.data;
    
    console.log(`Total teams: ${allTeams.length}`);
    
    // Find all Delhi Warriors
    const delhiTeams = allTeams.filter(t => t.name.toLowerCase().includes('delhi'));
    console.log(`\nFound ${delhiTeams.length} Delhi Warriors teams:`);
    delhiTeams.forEach((team, index) => {
      console.log(`  ${index + 1}. ${team.name} (ID: ${team.id}, isActive: ${team.isActive})`);
    });

    // Find archived team
    const archivedTeam = allTeams.find(t => t.name.includes('ARCHIVED'));
    if (archivedTeam) {
      console.log(`\nFound archived team: ${archivedTeam.name} (ID: ${archivedTeam.id})`);
    }

    // Deactivate the extra Delhi Warriors (keep only Delhi Warriors Team)
    const extraDelhi = delhiTeams.find(t => t.id === 'cmq92orz90001cgk4edd9vex7');
    
    if (extraDelhi) {
      console.log(`\nStep 3: Deactivating extra Delhi Warriors (ID: ${extraDelhi.id})...`);
      
      const updateResponse = await fetch(`${API_URL}/teams/${extraDelhi.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...extraDelhi,
          isActive: false,
          name: 'DELETED_EXTRA_DELHI_WARRIORS'
        })
      });

      console.log('Update response status:', updateResponse.status);
      const updateText = await updateResponse.text();
      console.log('Update response:', updateText);

      if (updateResponse.status === 200 || updateResponse.status === 201) {
        console.log('✓ Extra Delhi Warriors deactivated and renamed');
      } else {
        console.log('✗ Failed to deactivate');
      }
    } else {
      console.log('\n✗ Extra Delhi Warriors not found');
    }

    // Rename and deactivate archived team
    if (archivedTeam) {
      console.log(`\nStep 4: Deactivating archived team (ID: ${archivedTeam.id})...`);
      
      const updateResponse = await fetch(`${API_URL}/teams/${archivedTeam.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...archivedTeam,
          isActive: false,
          name: 'DELETED_ARCHIVED_TEAM'
        })
      });

      console.log('Update response status:', updateResponse.status);
      const updateText = await updateResponse.text();
      console.log('Update response:', updateText);

      if (updateResponse.status === 200 || updateResponse.status === 201) {
        console.log('✓ Archived team deactivated and renamed');
      } else {
        console.log('✗ Failed to deactivate archived team');
      }
    } else {
      console.log('\n✗ Archived team not found');
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

deactivateExtraTeams();
