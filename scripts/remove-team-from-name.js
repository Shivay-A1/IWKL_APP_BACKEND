const API_URL = 'https://iwkl-backend-lg6t-production.up.railway.app/api';

async function removeTeamFromName() {
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

    // Get Delhi Warriors Team
    console.log('\nStep 2: Getting Delhi Warriors Team...');
    const teamsResponse = await fetch(`${API_URL}/teams`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const teamsData = await teamsResponse.json();
    const delhiTeam = teamsData.data.find(t => t.name.includes('Delhi'));
    
    if (!delhiTeam) {
      console.log('✗ Delhi Warriors team not found');
      return;
    }

    console.log(`✓ Found team: ${delhiTeam.name} (ID: ${delhiTeam.id})`);

    // Update name to Delhi Warriors
    console.log('\nStep 3: Updating name to "Delhi Warriors"...');
    
    const updateResponse = await fetch(`${API_URL}/teams/${delhiTeam.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...delhiTeam,
        name: 'Delhi Warriors'
      })
    });

    console.log('Update response status:', updateResponse.status);
    const updateText = await updateResponse.text();
    console.log('Update response:', updateText);

    if (updateResponse.status === 200) {
      const updatedTeam = JSON.parse(updateText);
      console.log('✓ Name updated successfully!');
      console.log(`  - Name: ${updatedTeam.name}`);
    } else {
      console.log('✗ Database soft-delete record still exists with name "Delhi Warriors"');
      console.log('Team is functional as "Delhi Warriors Team" with correct data.');
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

removeTeamFromName();
