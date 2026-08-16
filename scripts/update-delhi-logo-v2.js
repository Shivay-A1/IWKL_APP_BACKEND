const API_URL = 'https://iwkl-backend-lg6t-production.up.railway.app/api';
const fs = require('fs');
const path = require('path');

async function updateDelhiLogo() {
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

    // Find Delhi Warriors Team
    console.log('\nStep 2: Finding Delhi Warriors Team...');
    const teamsResponse = await fetch(`${API_URL}/teams`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const teamsData = await teamsResponse.json();
    const delhiTeam = teamsData.data.find(t => t.name.includes('Delhi'));
    
    if (!delhiTeam) {
      console.log('✗ Delhi Warriors Team not found');
      return;
    }

    console.log(`✓ Found Delhi Warriors Team (ID: ${delhiTeam.id})`);

    // Update team with new logo
    console.log('\nStep 3: Updating Delhi Warriors logo...');
    
    const updateResponse = await fetch(`${API_URL}/teams/${delhiTeam.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        logo: '/team-logos/Delhi_warriors.jpeg'
      })
    });

    console.log('Update response status:', updateResponse.status);
    const updateText = await updateResponse.text();
    console.log('Update response:', updateText);

    if (updateResponse.status === 200 || updateResponse.status === 201) {
      const updatedTeam = JSON.parse(updateText);
      console.log('✓ Delhi Warriors logo updated successfully!');
      console.log(`  - New logo: ${updatedTeam.logo}`);
    } else {
      console.log('✗ Failed to update logo');
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

updateDelhiLogo();
