"use client"

export const dynamic = 'force-dynamic'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Users, Trophy, Calendar, PlayCircle, Newspaper, Image as ImageIcon, Layout, LogOut, Settings, Shield, UserCheck, Building2, Instagram } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { apiService } from '@/lib/api'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    teams: 0,
    matches: 0,
    news: 0,
    gallery: 0,
    users: 0,
    players: 0
  })
  const [loading, setLoading] = useState(true)
  const [adminUser, setAdminUser] = useState<any>(null)

  useEffect(() => {
    // Clear any potentially corrupted data on page load
    const adminToken = localStorage.getItem('adminToken')
    const adminUserStr = localStorage.getItem('adminUser')
    
    console.log('=== DASHBOARD LOAD ===')
    console.log('adminToken:', adminToken ? 'exists' : 'missing')
    console.log('adminUserStr:', adminUserStr)
    
    if (!adminToken) {
      console.log('No adminToken, redirecting to login')
      window.location.href = '/admin/login'
      return
    }

    // Validate adminUserStr before parsing
    if (!adminUserStr) {
      console.log('No adminUserStr, redirecting to login')
      localStorage.removeItem('adminToken')
      window.location.href = '/admin/login'
      return
    }

    // Check if adminUserStr looks like JSON (starts with {)
    if (!adminUserStr.trim().startsWith('{')) {
      console.error('adminUserStr is not valid JSON format:', adminUserStr)
      console.error('Clearing corrupted data and redirecting to login')
      localStorage.removeItem('adminUser')
      localStorage.removeItem('adminToken')
      window.location.href = '/admin/login'
      return
    }

    try {
      console.log('Attempting to parse adminUserStr:', adminUserStr)
      const parsedUser = JSON.parse(adminUserStr)
      console.log('Successfully parsed adminUser:', parsedUser)
      setAdminUser(parsedUser)
    } catch (err) {
      console.error('Failed to parse admin user:', err)
      console.error('adminUserStr value:', adminUserStr)
      // Clear corrupted data
      localStorage.removeItem('adminUser')
      localStorage.removeItem('adminToken')
      window.location.href = '/admin/login'
      return
    }

    // Fetch dashboard stats
    fetchStats()
    console.log('=== DASHBOARD LOAD END ===')
  }, [router])

  const fetchStats = async () => {
    try {
      // Use Firestore for player registrations count
      const { getAllRegistrations } = await import('@/lib/registration-firebase')
      const registrations = await getAllRegistrations()
      
      console.log('Stats from Firestore:', {
        players: registrations.length
      })

      setStats({
        teams: 0, // TODO: Implement Firestore teams collection
        matches: 0, // TODO: Implement Firestore matches collection
        news: 0, // TODO: Implement Firestore news collection
        gallery: 0, // TODO: Implement Firestore gallery collection
        users: 0, // TODO: Implement Firestore users collection
        players: registrations.length
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    window.location.href = '/admin/login'
  }

  const quickActions = [
    { name: 'Dashboard', icon: Layout, href: '/admin/dashboard', color: 'bg-blue-500' },
    { name: 'Teams', icon: Users, href: '/admin/teams', color: 'bg-green-500' },
    { name: 'Stadiums', icon: Building2, href: '/admin/stadiums', color: 'bg-purple-500' },
    { name: 'Matches', icon: Calendar, href: '/admin/matches', color: 'bg-orange-500' },
    { name: 'News', icon: Newspaper, href: '/admin/news', color: 'bg-pink-500' },
    { name: 'Gallery', icon: ImageIcon, href: '/admin/gallery', color: 'bg-indigo-500' },
    { name: 'Banners', icon: Layout, href: '/admin/banners', color: 'bg-teal-500' },
    { name: 'Instagram Story', icon: Instagram, href: 'https://www.instagram.com/reel/Da3FshUSfX0/igsh=bGpkOGI0ZG1lamNr', color: 'bg-gradient-to-r from-purple-500 to-pink-500', external: true },
    { name: 'Settings', icon: Settings, href: '/admin/settings', color: 'bg-gray-500' },
  ]

  const statsData = [
    { name: 'Total Teams', value: loading ? '...' : stats.teams, icon: Users, color: 'bg-blue-500' },
    { name: 'Total Matches', value: loading ? '...' : stats.matches, icon: Calendar, color: 'bg-green-500' },
    { name: 'Total News', value: loading ? '...' : stats.news, icon: Newspaper, color: 'bg-purple-500' },
    { name: 'Gallery Images', value: loading ? '...' : stats.gallery, icon: ImageIcon, color: 'bg-orange-500' },
    { name: 'Total Users', value: loading ? '...' : stats.users, icon: UserCheck, color: 'bg-pink-500' },
    { name: 'Total Players', value: loading ? '...' : stats.players, icon: Trophy, color: 'bg-indigo-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome to the admin control panel</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/admin/settings">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              variant="destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Admin Menu</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              action.external ? (
                <a key={action.name} href={action.href} target="_blank" rel="noopener noreferrer">
                  <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 text-center block">{action.name}</span>
                  </div>
                </a>
              ) : (
                <Link key={action.name} href={action.href}>
                  <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 text-center block">{action.name}</span>
                  </div>
                </Link>
              )
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'Admin login successful', time: 'Just now', type: 'auth' },
              { action: 'Dashboard accessed', time: 'Just now', type: 'dashboard' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">{activity.action}</p>
                    <p className="text-gray-600 text-sm">{activity.time}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {activity.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
