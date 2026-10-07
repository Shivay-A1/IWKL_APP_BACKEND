'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Heart, ArrowLeft, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface FanClubMember {
  id: string;
  fullName: string;
  mobile: string;
  email?: string;
  state: string;
  city: string;
  supportedTeam: string;
  createdAt: string;
}

export default function FanClubPage() {
  const router = useRouter();
  const [members, setMembers] = useState<FanClubMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await api.get('/fan-club');
      console.log('Fan club response:', response.data);
      const membersData = response.data?.data || response.data || [];
      const formattedMembers = Array.isArray(membersData) ? membersData.map((item: any) => ({
        id: item.id,
        fullName: item.fullName,
        mobile: item.mobileNumber,
        email: item.email || '-',
        state: item.state,
        city: item.city,
        supportedTeam: item.favoriteTeam?.name || item.supportedTeam || 'N/A',
        createdAt: item.createdAt,
      })) : [];
      setMembers(formattedMembers);
    } catch (error) {
      console.error('Failed to fetch fan club members:', error);
      toast.error('Failed to load fan club members');
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
      await api.delete(`/fan-club/${id}`);
      toast.success('Member deleted successfully');
      fetchMembers();
    } catch (error) {
      toast.error('Failed to delete member');
    }
  };

  const filteredMembers = members.filter(member => {
    const query = searchQuery.toLowerCase();
    return (
      member.fullName.toLowerCase().includes(query) ||
      member.mobile.includes(query) ||
      (member.email && member.email.toLowerCase().includes(query)) ||
      member.city.toLowerCase().includes(query) ||
      member.state.toLowerCase().includes(query) ||
      member.supportedTeam.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-300 hover:text-white mr-4"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-white">Fan Club Management</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-red-500" />
          <h2 className="text-3xl font-bold text-white">Fan Club Members</h2>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, mobile, email, city, state, or team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {searchQuery && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                {filteredMembers.length} / {members.length}
              </div>
            )}
          </div>
        </div>

        {members.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No fan club members yet</p>
          </div>
        ) : (
          <div className="bg-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Mobile</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">City</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">State</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Team</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Joined</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="px-6 py-4 text-white">{member.fullName}</td>
                      <td className="px-6 py-4 text-gray-300">{member.mobile}</td>
                      <td className="px-6 py-4 text-gray-300">{member.email || '-'}</td>
                      <td className="px-6 py-4 text-gray-300">{member.city}</td>
                      <td className="px-6 py-4 text-gray-300">{member.state}</td>
                      <td className="px-6 py-4 text-gray-300">{member.supportedTeam}</td>
                      <td className="px-6 py-4 text-gray-300">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          className="text-red-500 hover:text-red-400 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
