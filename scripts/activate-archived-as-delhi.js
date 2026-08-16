const API_URL = 'https://iwkl-backend-lg6t-production.up.railway.app/api';

async function activateArchivedAsDelhi() {
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

    // Get the archived team
    console.log('\nStep 2: Getting archived team...');
    const teamsResponse = await fetch(`${API_URL}/teams`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const teamsData = await teamsResponse.json();
    const archivedTeam = teamsData.data.find(t => !t.isActive);
    
    if (!archivedTeam) {
      console.log('✗ No archived team found');
      return;
    }

    console.log(`✓ Found archived team: ${archivedTeam.name} (ID: ${archivedTeam.id})`);

    // Activate and rename to Delhi Warriors
    console.log('\nStep 3: Activating and renaming to Delhi Warriors...');
    
    const updateData = {
      name: 'Delhi Warriors',
      shortName: 'DEL',
      city: 'Delhi',
      foundedYear: 2024,
      coach: 'TBA',
      jerseyColor: '#FF0000',
      logo: '/team-logos/Delhi_Warriors.jpeg',
      banner: null,
      stadiumId: null,
      seasonId: archivedTeam.seasonId,
      description: 'Delhi Warriors - The Pride of the Capital',
      socialMedia: {
        twitter: 'https://twitter.com/delhiwarriors',
        facebook: 'https://facebook.com/delhiwarriors',
        instagram: 'https://instagram.com/delhiwarriors'
      },
      isActive: true
    };

    const updateResponse = await fetch(`${API_URL}/teams/${archivedTeam.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    console.log('Update response status:', updateResponse.status);
    const updateText = await updateResponse.text();
    console.log('Update response:', updateText);

    if (updateResponse.status === 200) {
      const updatedTeam = JSON.parse(updateText);
      console.log('✓ Delhi Warriors created successfully!');
      console.log(`  - ID: ${updatedTeam.id}`);
      console.log(`  - Name: ${updatedTeam.name}`);
      console.log(`  - Short Name: ${updatedTeam.shortName}`);
      console.log(`  - isActive: ${updatedTeam.isActive}`);
    } else {
      console.log('✗ Failed to update team');
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

activateArchivedAsDelhi();
