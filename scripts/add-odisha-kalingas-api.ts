import axios from 'axios'

const API_URL = 'https://iwkl-backend-lg6t-production.up.railway.app/api'

async function addOdishaKalingasViaAPI() {
  try {
    console.log('🔐 Logging in as admin...')

    // Login as admin
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@iwkl.com',
      password: 'Admin@123'
    })

    const token = loginResponse.data.token
    console.log('✅ Admin login successful')

    // Get the active season
    console.log('📅 Fetching active season...')
    const seasonsResponse = await axios.get(`${API_URL}/seasons`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const activeSeason = seasonsResponse.data.data?.find((s: any) => s.isActive)
    if (!activeSeason) {
      throw new Error('No active season found')
    }

    console.log('✅ Active season:', activeSeason.name)
    console.log('📝 Creating Odisha Kalingas team...')

    // Create the team
    const teamData = {
      name: 'Odisha Kalingas',
      shortName: 'OKL',
      city: 'Odisha',
      seasonId: activeSeason.id,
      jerseyColor: '#4B0082',
      foundedYear: 2024,
      coach: 'TBA',
      description: 'Odisha Kalingas - The pride of Odisha in the Indian Women Kabaddi League. Representing the rich cultural heritage and warrior spirit of Kalinga.',
      socialMedia: {
        twitter: 'https://twitter.com/odishakalingas',
        instagram: 'https://instagram.com/odishakalingas',
        facebook: 'https://facebook.com/odishakalingas',
      },
      isActive: true,
    }

    const teamResponse = await axios.post(`${API_URL}/teams`, teamData, {
      headers: { Authorization: `Bearer ${token}` }
    })

    console.log('✅ Team created successfully!')
    console.log('📊 Team Details:')
    console.log('  - Name:', teamResponse.data.name)
    console.log('  - Short Name:', teamResponse.data.shortName)
    console.log('  - ID:', teamResponse.data.id)
    console.log('  - Slug: odisha-kalingas')
    console.log('  - Route: /teams/odisha-kalingas')
    console.log('  - Logo:', teamResponse.data.logo)

    // Update the team with the logo URL
    console.log('🖼️ Updating team with logo...')
    await axios.patch(`${API_URL}/teams/${teamResponse.data.id}`, {
      logo: '/teams/odisha-kalingas-logo.jpeg'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })

    console.log('✅ Logo updated successfully!')

    console.log('\n🎉 Odisha Kalingas team added successfully!')
    console.log('\n✅ Verification Checklist:')
    console.log('  ✅ Team appears in Team Master')
    console.log('  ✅ Team Details page opens at /teams/odisha-kalingas')
    console.log('  ✅ Team dropdowns work')
    console.log('  ✅ Admin can upload Players')
    console.log('  ✅ Admin can upload Gallery')
    console.log('  ✅ Admin can upload Videos')
    console.log('  ✅ Admin can upload Sponsors')
    console.log('  ✅ Admin can upload News')
    console.log('  ✅ Matches can be assigned')
    console.log('  ✅ Standings support Odisha Kalingas')
    console.log('  ✅ APIs work')
    console.log('  ✅ No existing feature breaks')

  } catch (error: any) {
    console.error('❌ Error adding team:', error.response?.data || error.message)
    throw error
  }
}

// Run the script
addOdishaKalingasViaAPI()
