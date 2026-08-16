const API_URL = 'https://iwkl-backend-lg6t-production.up.railway.app/api';

async function findDeletedAyodhya() {
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

    // Try to find Ayodhya Shakti by name with different variations
    console.log('\nStep 2: Searching for Ayodhya Shakti...');
    
    const searchTerms = ['Ayodhya Shakti', 'ayodhya shakti', 'AYODHYA SHAKTI', 'Ayodhya', 'ayodhya'];
    
    for (const term of searchTerms) {
      console.log(`\nSearching for: "${term}"`);
      
      try {
        const searchResponse = await fetch(`${API_URL}/teams?search=${encodeURIComponent(term)}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const searchData = await searchResponse.json();
        console.log(`Status: ${searchResponse.status}`);
        console.log(`Response: ${JSON.stringify(searchData, null, 2)}`);
        
        if (searchData.data && searchData.data.length > 0) {
          console.log(`\n✓ Found ${searchData.data.length} team(s) matching "${term}":`);
          searchData.data.forEach((team, index) => {
            console.log(`  ${index + 1}. ${team.name} (ID: ${team.id}, isActive: ${team.isActive})`);
          });
        }
      } catch (error) {
        console.log(`Error searching for "${term}": ${error.message}`);
      }
    }

    // Try to get all teams including deleted ones
    console.log('\n\nStep 3: Trying to get all teams...');
    const allTeamsResponse = await fetch(`${API_URL}/teams`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const allTeamsData = await allTeamsResponse.json();
    console.log(`Total teams: ${allTeamsData.data?.length || 0}`);
    
    if (allTeamsData.data) {
      allTeamsData.data.forEach((team, index) => {
        console.log(`${index + 1}. ${team.name} (ID: ${team.id}, isActive: ${team.isActive})`);
      });
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

findDeletedAyodhya();
