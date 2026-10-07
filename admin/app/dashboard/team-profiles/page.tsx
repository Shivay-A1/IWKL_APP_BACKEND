'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  banner?: string;
  jerseyColor?: string;
  foundedYear?: number;
  city?: string;
  coach?: string;
  captain?: string;
  homeGround?: string;
  description?: string;
  socialMedia?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
  isActive: boolean;
}

export default function TeamProfilesPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState<Partial<Team>>({});

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await api.get('/teams');
      console.log('Teams response:', response.data);
      const teamsData = response.data?.data || response.data || [];
      setTeams(Array.isArray(teamsData) ? teamsData : []);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      toast.error('Failed to load teams');
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setFormData({ ...team });
  };

  const handleSave = async () => {
    if (!editingTeam) return;

    try {
      await api.put(`/teams/${editingTeam.id}`, formData);
      toast.success('Team updated successfully');
      setEditingTeam(null);
      setFormData({});
      fetchTeams();
    } catch (error) {
      console.error('Failed to update team:', error);
      toast.error('Failed to update team');
    }
  };

  const handleCancel = () => {
    setEditingTeam(null);
    setFormData({});
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData({
      ...formData,
      socialMedia: {
        ...formData.socialMedia,
        [platform]: value,
      },
    });
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
              <h1 className="text-2xl font-bold text-white">Team Profiles</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-300 hover:text-white px-4 py-2"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">All Team Profiles</h2>
          <p className="text-gray-400">Manage all team information from one place</p>
        </div>

        {editingTeam ? (
          <div className="bg-card rounded-xl p-8 border border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Edit: {editingTeam.name}</h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Basic Information</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Team Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Short Name</label>
                  <input
                    type="text"
                    value={formData.shortName || ''}
                    onChange={(e) => handleInputChange('shortName', e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Logo URL</label>
                  <input
                    type="url"
                    value={formData.logo || ''}
                    onChange={(e) => handleInputChange('logo', e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Banner URL</label>
                  <input
                    type="url"
                    value={formData.banner || ''}
                    onChange={(e) => handleInputChange('banner', e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Jersey Color</label>
                  <input
                    type="text"
                    value={formData.jerseyColor || ''}
                    onChange={(e) => handleInputChange('jerseyColor', e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                    placeholder="#FF0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Founded Year</label>
                  <input
                    type="number"
                    value={formData.foundedYear || ''}
                    onChange={(e) => handleInputChange('foundedYear', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Team Details */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Team Details</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Coach</label>
                  <input
                    type="text"
                    value={formData.coach || ''}
                    onChange={(e) => handleInputChange('coach', e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Captain</label>
                  <input
                    type="text"
                    value={formData.captain || ''}
                    onChange={(e) => handleInputChange('captain', e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Home Ground</label>
                  <input
                    type="text"
                    value={formData.homeGround || ''}
                    onChange={(e) => handleInputChange('homeGround', e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                    rows={4}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive ?? false}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isActive" className="text-gray-300">Active</label>
                </div>
              </div>

              {/* Social Media */}
              <div className="space-y-4 md:col-span-2">
                <h4 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Social Media</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Twitter</label>
                    <input
                      type="url"
                      value={formData.socialMedia?.twitter || ''}
                      onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Instagram</label>
                    <input
                      type="url"
                      value={formData.socialMedia?.instagram || ''}
                      onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Facebook</label>
                    <input
                      type="url"
                      value={formData.socialMedia?.facebook || ''}
                      onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">YouTube</label>
                    <input
                      type="url"
                      value={formData.socialMedia?.youtube || ''}
                      onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={handleSave}
                className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div key={team.id} className="bg-card rounded-xl overflow-hidden shadow-lg border border-gray-800">
                <div className="relative h-32 bg-gradient-to-br from-purple-900 to-blue-900">
                  {team.banner ? (
                    <img
                      src={team.banner}
                      alt={team.name}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                  <div className="absolute -bottom-12 left-6">
                    <div className="w-24 h-24 rounded-full border-4 border-background overflow-hidden bg-background">
                      {team.logo ? (
                        <img
                          src={team.logo}
                          alt={team.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-700">
                          <span className="text-2xl font-bold text-white">{team.shortName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="pt-14 px-6 pb-6">
                  <h3 className="text-xl font-bold text-white mb-1">{team.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{team.city || 'Unknown City'}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Coach:</span>
                      <span className="text-white">{team.coach || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Captain:</span>
                      <span className="text-white">{team.captain || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Home Ground:</span>
                      <span className="text-white">{team.homeGround || 'N/A'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleEdit(team)}
                    className="w-full mt-4 bg-primary hover:bg-primary/90 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
