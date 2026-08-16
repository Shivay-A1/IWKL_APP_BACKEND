const API_URL = 'https://iwkl-backend-lg6t-production.up.railway.app/api';

async function searchDelhiByName() {
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

    // Get all teams including inactive
    console.log('\nStep 2: Fetching all teams (including inactive)...');
    const teamsResponse = await fetch(`${API_URL}/teams`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const teamsData = await teamsResponse.json();
    const teams = teamsData.data;
    console.log(`✓ Found ${teams.length} teams`);

    // Search for Delhi Warriors
    console.log('\nStep 3: Searching for "Delhi Warriors" in any form...');
    const delhiTeams = teams.filter(t => 
      t.name.toLowerCase().includes('delhi') || 
      t.name.toLowerCase().includes('warriors') ||
      t.shortName?.toLowerCase().includes('del') ||
      t.shortName?.toLowerCase().includes('war')
    );

    if (delhiTeams.length > 0) {
      console.log('✓ Found teams matching Delhi:');
      delhiTeams.forEach(team => {
        console.log(`  - Name: ${team.name}`);
        console.log(`    ID: ${team.id}`);
        console.log(`    Short Name: ${team.shortName}`);
        console.log(`    isActive: ${team.isActive}`);
        console.log(`    City: ${team.city}`);
        console.log('---');
      });
      
      // Activate the first Delhi team found
      if (delhiTeams.length > 0) {
        const delhiTeam = delhiTeams[0];
        if (!delhiTeam.isActive) {
          console.log(`\nStep 4: Activating ${delhiTeam.name}...`);
          
          const updateResponse = await fetch(`${API_URL}/teams/${delhiTeam.id}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ...delhiTeam,
              name: 'Delhi Warriors',
              shortName: 'DEL',
              city: 'Delhi',
              logo: '/team-logos/Delhi_Warriors.jpeg',
              jerseyColor: '#FF0000',
              isActive: true,
              description: 'Delhi Warriors - The Pride of the Capital'
            })
          });

          console.log('Update response status:', updateResponse.status);
          const updateText = await updateResponse.text();
          console.log('Update response:', updateText);

          if (updateResponse.status === 200) {
            console.log('✓ Delhi Warriors activated successfully!');
          }
        } else {
          console.log('✓ Delhi Warriors is already active!');
        }
      }
    } else {
      console.log('✗ No Delhi/Warriors team found');
      console.log('\nAll team names:');
      teams.forEach(t => console.log(`  - ${t.name}`));
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

searchDelhiByName();
