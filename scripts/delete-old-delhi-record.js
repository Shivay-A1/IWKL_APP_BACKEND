const API_URL = 'https://iwkl-backend-lg6t-production.up.railway.app/api';

async function deleteOldDelhiRecord() {
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

    // Delete the Delhi Warriors IWKL team
    console.log('\nStep 3: Deleting Delhi Warriors IWKL...');
    const delhiTeam = teams.find(t => t.name.includes('Delhi'));
    
    if (delhiTeam) {
      const deleteResponse = await fetch(`${API_URL}/teams/${delhiTeam.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Delete response status:', deleteResponse.status);
      const deleteText = await deleteResponse.text();
      console.log('Delete response:', deleteText);

      if (deleteResponse.status === 200) {
        console.log('✓ Team deleted successfully');
        
        // Now create Delhi Warriors with correct name
        console.log('\nStep 4: Creating Delhi Warriors with correct name...');
        
        const teamData = {
          name: 'Delhi Warriors',
          shortName: 'DEL',
          city: 'Delhi',
          foundedYear: 2024,
          coach: 'TBA',
          jerseyColor: '#FF0000',
          logo: '/team-logos/Delhi_Warriors.jpeg',
          banner: null,
          stadiumId: null,
          seasonId: delhiTeam.seasonId,
          description: 'Delhi Warriors - The Pride of the Capital',
          socialMedia: {
            twitter: 'https://twitter.com/delhiwarriors',
            facebook: 'https://facebook.com/delhiwarriors',
            instagram: 'https://instagram.com/delhiwarriors'
          },
          isActive: true
        };

        const createResponse = await fetch(`${API_URL}/teams`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(teamData)
        });

        console.log('Create response status:', createResponse.status);
        const createText = await createResponse.text();
        console.log('Create response:', createText);

        if (createResponse.status === 200 || createResponse.status === 201) {
          const createdTeam = JSON.parse(createText);
          console.log('✓ Delhi Warriors created successfully!');
          console.log(`  - Name: ${createdTeam.name}`);
          console.log(`  - Short Name: ${createdTeam.shortName}`);
          console.log(`  - isActive: ${createdTeam.isActive}`);
        }
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

deleteOldDelhiRecord();
