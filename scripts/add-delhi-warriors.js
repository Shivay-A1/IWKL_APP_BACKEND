const API_URL = 'https://iwkl-backend-lg6t-production.up.railway.app/api';

async function addDelhiWarriors() {
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

    // Create Delhi Warriors
    console.log('\nStep 3: Creating Delhi Warriors team...');
    
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
      console.log('✗ Failed to create team');
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

addDelhiWarriors();
