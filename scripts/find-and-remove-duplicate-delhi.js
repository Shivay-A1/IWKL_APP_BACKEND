const API_URL = 'https://iwkl-backend-lg6t-production.up.railway.app/api';

async function findAndRemoveDuplicateDelhi() {
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
    console.log('\nStep 2: Getting all teams...');
    const teamsResponse = await fetch(`${API_URL}/teams`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const teamsData = await teamsResponse.json();
    const teams = teamsData.data;
    console.log(`✓ Found ${teams.length} teams`);

    // Find any team with Delhi in name
    console.log('\nStep 3: Finding teams with "Delhi" in name...');
    const delhiTeams = teams.filter(t => t.name.toLowerCase().includes('delhi'));
    
    if (delhiTeams.length > 0) {
      console.log('✓ Found Delhi teams:');
      delhiTeams.forEach(team => {
        console.log(`  - ${team.name} (ID: ${team.id}, isActive: ${team.isActive})`);
      });

      // Update the IWKL one to Delhi Warriors
      const iwklTeam = delhiTeams.find(t => t.name.includes('IWKL'));
      if (iwklTeam) {
        console.log('\nStep 4: Updating Delhi Warriors IWKL to Delhi Warriors...');
        
        const updateResponse = await fetch(`${API_URL}/teams/${iwklTeam.id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...iwklTeam,
            name: 'Delhi Warriors',
            shortName: 'DEL'
          })
        });

        console.log('Update response status:', updateResponse.status);
        const updateText = await updateResponse.text();
        console.log('Update response:', updateText);

        if (updateResponse.status === 200) {
          const updatedTeam = JSON.parse(updateText);
          console.log('✓ Name updated successfully!');
          console.log(`  - Name: ${updatedTeam.name}`);
          console.log(`  - Short Name: ${updatedTeam.shortName}`);
        } else {
          console.log('✗ Still getting unique constraint error. Team is functional with current name.');
          console.log('Database likely has a deleted record with name "Delhi Warriors".');
        }
      }
    } else {
      console.log('✗ No Delhi teams found');
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

findAndRemoveDuplicateDelhi();
