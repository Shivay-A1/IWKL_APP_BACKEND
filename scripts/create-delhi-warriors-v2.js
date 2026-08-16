const API_URL = 'https://iwkl-backend-lg6t-production.up.railway.app/api';

async function createDelhiWarriorsV2() {
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

    // Get current season
    console.log('\nStep 2: Getting current season...');
    const seasonsResponse = await fetch(`${API_URL}/seasons`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const seasonsData = await seasonsResponse.json();
    const currentSeason = seasonsData.data?.find(s => s.isActive) || seasonsData.data?.[0];
    console.log(`✓ Using season: ${currentSeason?.name || 'N/A'} (ID: ${currentSeason?.id || 'N/A'})`);

    // Create Delhi Warriors with minimal data first
    console.log('\nStep 3: Creating Delhi Warriors team (minimal data)...');
    
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
      seasonId: currentSeason?.id,
      description: 'Delhi Warriors - The Pride of the Capital',
      socialMedia: {
        twitter: 'https://twitter.com/delhiwarriors',
        facebook: 'https://facebook.com/delhiwarriors',
        instagram: 'https://instagram.com/delhiwarriors'
      },
      isActive: true
    };

    console.log('Sending team data:', JSON.stringify(teamData, null, 2));

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
      console.log(`  - ID: ${createdTeam.id}`);
      console.log(`  - Name: ${createdTeam.name}`);
      console.log(`  - Short Name: ${createdTeam.shortName}`);
      console.log(`  - isActive: ${createdTeam.isActive}`);
    } else {
      console.log('✗ Failed to create team with status:', createResponse.status);
      
      // Try alternative approach - update an existing team
      console.log('\nStep 4: Trying to activate any archived team as Delhi Warriors...');
      const archivedTeam = await fetch(`${API_URL}/teams`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(r => r.json()).then(d => d.data.find(t => !t.isActive));

      if (archivedTeam) {
        console.log(`Found archived team: ${archivedTeam.name} (ID: ${archivedTeam.id})`);
        
        const updateResponse = await fetch(`${API_URL}/teams/${archivedTeam.id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...archivedTeam,
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
          console.log('✓ Successfully converted archived team to Delhi Warriors!');
        }
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

createDelhiWarriorsV2();
