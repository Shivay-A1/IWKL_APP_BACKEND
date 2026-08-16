const API_URL = 'https://iwkl-backend-lg6t-production.up.railway.app/api';

async function deleteSoftDeletedDelhi() {
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
    console.log('\nStep 2: Finding soft-deleted Delhi Warriors...');
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

    // Delete the soft-deleted one (not the active one)
    const softDeletedDelhi = delhiTeams.find(t => t.id === 'cmq92orz90001cgk4edd9vex7');
    
    if (softDeletedDelhi) {
      console.log(`\nStep 3: Deleting soft-deleted Delhi Warriors (ID: ${softDeletedDelhi.id})...`);
      
      const deleteResponse = await fetch(`${API_URL}/teams/${softDeletedDelhi.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Delete response status:', deleteResponse.status);
      const deleteText = await deleteResponse.text();
      console.log('Delete response:', deleteText);

      if (deleteResponse.status === 200 || deleteResponse.status === 204) {
        console.log('✓ Soft-deleted Delhi Warriors permanently deleted');
      } else {
        console.log('✗ Failed to delete');
      }
    } else {
      console.log('\n✗ Soft-deleted Delhi Warriors not found');
    }

    // Delete the archived team
    const archivedTeam = allTeams.find(t => t.id === 'cmqjrpd2n0007hazsakqnza1t');
    
    if (archivedTeam) {
      console.log(`\nStep 4: Deleting archived team (ID: ${archivedTeam.id})...`);
      
      const deleteResponse = await fetch(`${API_URL}/teams/${archivedTeam.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Delete response status:', deleteResponse.status);
      const deleteText = await deleteResponse.text();
      console.log('Delete response:', deleteText);

      if (deleteResponse.status === 200 || deleteResponse.status === 204) {
        console.log('✓ Archived team permanently deleted');
      } else {
        console.log('✗ Failed to delete archived team');
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

deleteSoftDeletedDelhi();
