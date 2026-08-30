'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Users, Calendar, Video, Newspaper, Radio, Bell, Trophy } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMatches: 0,
    totalVideos: 0,
    totalNews: 0,
    liveMatches: 0,
    unreadNotifications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      console.log('Dashboard stats response:', response.data);
      
      // Ensure response data is properly formatted
      const statsData = {
        totalUsers: response.data?.totalUsers || 0,
        totalMatches: response.data?.totalMatches || 0,
        totalVideos: response.data?.totalVideos || 0,
        totalNews: response.data?.totalNews || 0,
        liveMatches: response.data?.liveMatches || 0,
        unreadNotifications: response.data?.unreadNotifications || 0,
      };
      
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Set default values on error
      setStats({
        totalUsers: 0,
        totalMatches: 0,
        totalVideos: 0,
        totalNews: 0,
        liveMatches: 0,
        unreadNotifications: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Commented out for now - auth to be re-enabled later
    // localStorage.removeItem('token');
    // localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">IWKL Admin</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white px-4 py-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-white mb-8">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<Users className="w-8 h-8" />}
            color="bg-blue-600"
          />
          <StatCard
            title="Total Matches"
            value={stats.totalMatches}
            icon={<Calendar className="w-8 h-8" />}
            color="bg-green-600"
          />
          <StatCard
            title="Total Videos"
            value={stats.totalVideos}
            icon={<Video className="w-8 h-8" />}
            color="bg-purple-600"
          />
          <StatCard
            title="Total News"
            value={stats.totalNews}
            icon={<Newspaper className="w-8 h-8" />}
            color="bg-orange-600"
          />
          <StatCard
            title="Live Matches"
            value={stats.liveMatches}
            icon={<Radio className="w-8 h-8" />}
            color="bg-red-600"
          />
          <StatCard
            title="Unread Notifications"
            value={stats.unreadNotifications}
            icon={<Bell className="w-8 h-8" />}
            color="bg-yellow-600"
          />
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickActions />
          <RecentActivity />
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-bold text-white mb-6">Management Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ManagementModule
              title="Matches"
              description="Manage live and upcoming matches"
              icon={<Calendar className="w-6 h-6" />}
              path="/dashboard/matches"
              color="bg-green-600"
            />
            <ManagementModule
              title="Stories"
              description="Manage app stories"
              icon={<Radio className="w-6 h-6" />}
              path="/dashboard/stories"
              color="bg-purple-600"
            />
            <ManagementModule
              title="Banners"
              description="Manage home banners"
              icon={<Newspaper className="w-6 h-6" />}
              path="/dashboard/banners"
              color="bg-blue-600"
            />
            <ManagementModule
              title="Videos"
              description="Manage OTT and top videos"
              icon={<Video className="w-6 h-6" />}
              path="/dashboard/videos"
              color="bg-red-600"
            />
            <ManagementModule
              title="Points Table"
              description="Manage league standings"
              icon={<Trophy className="w-6 h-6" />}
              path="/dashboard/points-table"
              color="bg-yellow-600"
            />
            <ManagementModule
              title="News"
              description="Manage latest news"
              icon={<Newspaper className="w-6 h-6" />}
              path="/dashboard/news"
              color="bg-orange-600"
            />
            <ManagementModule
              title="Gallery"
              description="Manage gallery images"
              icon={<Users className="w-6 h-6" />}
              path="/dashboard/gallery"
              color="bg-pink-600"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-card rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <div className="text-white">{icon}</div>
        </div>
      </div>
    </div>
  );
}

function QuickActions() {
  return (
    <div className="bg-card rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg transition-colors">
          Create Match
        </button>
        <button className="bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg transition-colors">
          Upload Video
        </button>
        <button className="bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg transition-colors">
          Add News
        </button>
        <button className="bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg transition-colors">
          Send Notification
        </button>
      </div>
    </div>
  );
}

function RecentActivity() {
  return (
    <div className="bg-card rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <p className="text-gray-300">New match created</p>
          <span className="text-gray-500 text-sm ml-auto">2 min ago</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <p className="text-gray-300">Video uploaded</p>
          <span className="text-gray-500 text-sm ml-auto">15 min ago</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <p className="text-gray-300">News published</p>
          <span className="text-gray-500 text-sm ml-auto">1 hour ago</span>
        </div>
      </div>
    </div>
  );
}

function ManagementModule({ title, description, icon, path, color }: { title: string; description: string; icon: React.ReactNode; path: string; color: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(path)}
      className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-left"
    >
      <div className="flex items-start gap-4">
        <div className={`${color} p-3 rounded-lg`}>
          <div className="text-white">{icon}</div>
        </div>
        <div className="flex-1">
          <h4 className="text-white font-semibold mb-1">{title}</h4>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>
    </button>
  );
}
