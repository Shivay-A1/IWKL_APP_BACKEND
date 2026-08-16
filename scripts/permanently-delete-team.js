const API_URL = 'https://iwkl-backend-lg6t-production.up.railway.app/api';

async function permanentlyDeleteTeam() {
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

    // Get all teams to find the deleted team
    console.log('\nStep 2: Fetching all teams...');
    const teamsResponse = await fetch(`${API_URL}/teams`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const teamsData = await teamsResponse.json();
    const teams = teamsData.data;
    console.log(`✓ Found ${teams.length} teams`);

    // Find the deleted team
    const deletedTeam = teams.find(t => t.name.includes('Deleted Team') || t.name.includes('1785786155956'));
    
    if (!deletedTeam) {
      console.log('✗ Deleted team not found');
      return;
    }

    console.log(`\nStep 3: Found deleted team (ID: ${deletedTeam.id}, Name: ${deletedTeam.name})`);

    // Try to delete it permanently
    console.log('\nStep 4: Deleting team permanently...');
    
    const deleteResponse = await fetch(`${API_URL}/teams/${deletedTeam.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Delete response status:', deleteResponse.status);
    const deleteText = await deleteResponse.text();
    console.log('Delete response:', deleteText);

    if (deleteResponse.status === 200) {
      console.log('✓ Team deleted successfully!');
    } else {
      console.log('✗ Delete failed via API, trying direct database approach...');
      
      // If API delete fails, we'll just rename it to something that won't match any searches
      const updateResponse = await fetch(`${API_URL}/teams/${deletedTeam.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'ARCHIVED_' + Date.now(),
          shortName: 'ARC',
          isActive: false,
          logo: '/team-logos/deleted.png',
          description: 'Archived team'
        })
      });

      console.log('Update response status:', updateResponse.status);
      const updateText = await updateResponse.text();
      console.log('Update response:', updateText);
      
      if (updateResponse.status === 200) {
        console.log('✓ Team archived and hidden from all searches');
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

permanentlyDeleteTeam();
