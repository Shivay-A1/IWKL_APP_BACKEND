import axios from 'axios'

async function testFrontendApiCall() {
  console.log('=== Testing Frontend API Call ===\n')

  try {
    // Simulate the exact API call the frontend makes
    const API_URL = 'http://localhost:5000/api'
    const response = await axios.get(`${API_URL}/teams`, {
      params: { isActive: 'true' }
    })

    console.log('✓ API Call Successful')
    console.log('Status:', response.status)
    console.log('Data Type:', typeof response.data)
    console.log('Has data property:', 'data' in response.data)
    
    if (response.data.data) {
      console.log('\n--- Teams in API Response ---')
      console.log(`Total teams: ${response.data.data.length}`)
      
      response.data.data.forEach((team: any, index: number) => {
        console.log(`${index + 1}. ${team.name} (${team.shortName})`)
      })
      
      // Check for Delhi Warriors
      const delhiWarriors = response.data.data.find((t: any) => t.name === 'Delhi Warriors')
      console.log('\n--- Delhi Warriors Check ---')
      if (delhiWarriors) {
        console.log('✓ Delhi Warriors IS in API response')
        console.log('   This means the issue is in FRONTEND processing')
      } else {
        console.log('❌ Delhi Warriors is NOT in API response')
        console.log('   This means the issue is still in BACKEND')
      }
    } else {
      console.log('\n❌ No data property in response')
      console.log('Response structure:', JSON.stringify(response.data, null, 2))
    }

  } catch (error: any) {
    console.error('❌ API Call Failed')
    console.error('Error:', error.message)
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Data:', error.response.data)
    }
  }
}

testFrontendApiCall()
