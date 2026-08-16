const API_URL = 'https://iwkl-backend-lg6t-production.up.railway.app/api';

async function checkPointsTable() {
  try {
    console.log('Step 1: Getting points table...');
    
    const pointsResponse = await fetch(`${API_URL}/points-table`);
    console.log('Points response status:', pointsResponse.status);
    const pointsData = await pointsResponse.json();
    console.log('Points response:', JSON.stringify(pointsData, null, 2));

    // Get all teams
    console.log('\nStep 2: Getting all teams...');
    const teamsResponse = await fetch(`${API_URL}/teams?limit=100`);
    console.log('Teams response status:', teamsResponse.status);
    const teamsData = await teamsResponse.json();
    console.log('Teams count:', teamsData.data?.length || 0);
    
    const activeTeams = teamsData.data?.filter(t => t.isActive) || [];
    console.log('Active teams:');
    activeTeams.forEach((team, index) => {
      console.log(`  ${index + 1}. ${team.name} (ID: ${team.id})`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkPointsTable();
