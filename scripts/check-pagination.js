const API_URL = 'https://iwkl-backend-lg6t-production.up.railway.app/api';

async function checkPagination() {
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

    // Get all teams with different limits
    console.log('\nStep 2: Checking pagination...');
    
    for (const limit of [10, 20, 50, 100]) {
      console.log(`\nFetching teams with limit=${limit}...`);
      const response = await fetch(`${API_URL}/teams?limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log(`  Status: ${response.status}`);
      console.log(`  Total teams: ${data.pagination?.total || data.data?.length || 0}`);
      console.log(`  Page: ${data.pagination?.page || 1}`);
      console.log(`  Total pages: ${data.pagination?.totalPages || 1}`);
      
      if (data.data) {
        console.log(`  Teams on this page: ${data.data.length}`);
        data.data.forEach((team, index) => {
          console.log(`    ${index + 1}. ${team.name} (ID: ${team.id}, isActive: ${team.isActive})`);
        });
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkPagination();
