'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Plus, Edit, Trash2, Eye, EyeOff, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

interface Story {
  id: string;
  title: string;
  imageUrl: string;
  videoUrl?: string;
  isVideo: boolean;
  caption?: string;
  link?: string;
  username?: string;
  userImage?: string;
  expiryTime?: string;
  order: number;
  enabled: boolean;
}

export default function StoriesPage() {
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    videoUrl: '',
    isVideo: false,
    caption: '',
    link: '',
    username: 'IWKL',
    userImage: '',
    expiryTime: '',
    order: 0,
    enabled: true,
  });

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await api.get('/stories');
      console.log('Stories response:', response.data);
      setStories(response.data || []);
    } catch (error) {
      console.error('Failed to fetch stories:', error);
      toast.error('Failed to load stories');
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/stories', formData);
      toast.success('Story created successfully');
      setShowCreateModal(false);
      setFormData({
        title: '',
        imageUrl: '',
        videoUrl: '',
        isVideo: false,
        caption: '',
        link: '',
        username: 'IWKL',
        userImage: '',
        expiryTime: '',
        order: 0,
        enabled: true,
      });
      fetchStories();
    } catch (error) {
      toast.error('Failed to create story');
    }
  };

  const handleToggleStory = async (storyId: string) => {
    try {
      await api.patch(`/stories/${storyId}/toggle`);
      toast.success('Story status updated');
      fetchStories();
    } catch (error) {
      console.error('Failed to toggle story:', error);
      toast.error('Failed to update story status');
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return;
    try {
      await api.delete(`/stories/${storyId}`);
      toast.success('Story deleted successfully');
      fetchStories();
    } catch (error) {
      toast.error('Failed to delete story');
    }
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
              <h1 className="text-2xl font-bold text-white">Stories Management</h1>
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
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Stories</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Story
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div key={story.id} className="bg-card rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-48 bg-background">
                {story.isVideo && story.videoUrl ? (
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    <span className="text-white text-sm">Video Story</span>
                  </div>
                ) : story.imageUrl ? (
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Upload className="w-12 h-12 text-gray-500" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleToggleStory(story.id)}
                    className={`p-2 rounded-full ${
                      story.enabled ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    {story.enabled ? <Eye className="w-4 h-4 text-white" /> : <EyeOff className="w-4 h-4 text-white" />}
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold mb-2">{story.title}</h3>
                {story.caption && (
                  <p className="text-gray-400 text-sm mb-2">{story.caption}</p>
                )}
                {story.link && (
                  <a href={story.link} target="_blank" className="text-blue-400 text-sm mb-2 block">
                    Link
                  </a>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Order: {story.order}</span>
                  <button
                    onClick={() => handleDeleteStory(story.id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-6">Create Story</h3>
            <form onSubmit={handleCreateStory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Video URL (optional)</label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Caption (optional)</label>
                <input
                  type="text"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Link (optional)</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">User Image URL (optional)</label>
                <input
                  type="url"
                  value={formData.userImage}
                  onChange={(e) => setFormData({ ...formData, userImage: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Expiry Time (optional)</label>
                <input
                  type="datetime-local"
                  value={formData.expiryTime}
                  onChange={(e) => setFormData({ ...formData, expiryTime: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isVideo"
                  checked={formData.isVideo}
                  onChange={(e) => setFormData({ ...formData, isVideo: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isVideo" className="text-gray-300">Is Video</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="enabled" className="text-gray-300">Enabled</label>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg"
                >
                  Create Story
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}