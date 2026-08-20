'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

interface News {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  category?: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
}

export default function NewsPage() {
  const router = useRouter();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    category: '',
    isPublished: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchNews();
  }, [router]);

  const fetchNews = async () => {
    try {
      const response = await api.get('/news');
      setNews(response.data);
    } catch (error) {
      console.error('Failed to fetch news');
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/news', formData);
      toast.success('News created successfully');
      setShowCreateModal(false);
      setFormData({
        title: '',
        content: '',
        imageUrl: '',
        category: '',
        isPublished: true,
      });
      fetchNews();
    } catch (error) {
      toast.error('Failed to create news');
    }
  };

  const handleTogglePublish = async (newsId: string, isPublished: boolean) => {
    try {
      await api.patch(`/news/${newsId}`, { isPublished });
      toast.success('News status updated');
      fetchNews();
    } catch (error) {
      toast.error('Failed to update news status');
    }
  };

  const handleDeleteNews = async (newsId: string) => {
    if (!confirm('Are you sure you want to delete this news?')) return;
    try {
      await api.delete(`/news/${newsId}`);
      toast.success('News deleted successfully');
      fetchNews();
    } catch (error) {
      toast.error('Failed to delete news');
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
              <h1 className="text-2xl font-bold text-white">News Management</h1>
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
          <h2 className="text-3xl font-bold text-white">Latest News</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create News
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <div key={item.id} className="bg-card rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-48 bg-background">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Upload className="w-12 h-12 text-gray-500" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleTogglePublish(item.id, !item.isPublished)}
                    className={`p-2 rounded-full ${
                      item.isPublished ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    {item.isPublished ? <Eye className="w-4 h-4 text-white" /> : <EyeOff className="w-4 h-4 text-white" />}
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                {item.category && (
                  <p className="text-gray-400 text-sm mb-2">{item.category}</p>
                )}
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{item.content}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteNews(item.id)}
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
            <h3 className="text-2xl font-bold text-white mb-6">Create News</h3>
            <form onSubmit={handleCreateNews} className="space-y-4">
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                  rows={4}
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isPublished" className="text-gray-300">Published</label>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg"
                >
                  Create News
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