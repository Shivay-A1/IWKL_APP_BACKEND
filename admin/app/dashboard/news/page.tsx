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
  featuredImage?: string;
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
    featuredImage: '',
    category: '',
    isPublished: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await api.get('/news');
      console.log('News response:', response.data);
      // Handle both direct array and paginated response
      const newsData = response.data?.data || response.data || [];
      setNews(Array.isArray(newsData) ? newsData : []);
    } catch (error) {
      console.error('Failed to fetch news:', error);
      toast.error('Failed to load news');
      setNews([]);
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
        featuredImage: '',
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

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      return data.url;
    } catch (error) {
      toast.error('Failed to upload image');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await handleImageUpload(file);
      setFormData({ ...formData, featuredImage: imageUrl });
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
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
              <h1 className="text-xl sm:text-2xl font-bold text-white">News Management</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-300 hover:text-white px-3 sm:px-4 py-2 text-sm sm:text-base"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Latest News</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center gap-2 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Create News
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {news.map((item) => (
            <div key={item.id} className="bg-card rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-40 sm:h-48 bg-background">
                {item.featuredImage ? (
                  <img
                    src={item.featuredImage}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500" />
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
              <div className="p-3 sm:p-4">
                <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">{item.title}</h3>
                {item.category && (
                  <p className="text-gray-400 text-xs sm:text-sm mb-2">{item.category}</p>
                )}
                <p className="text-gray-300 text-xs sm:text-sm mb-4 line-clamp-3">{item.content}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">Create News</h3>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Featured Image</label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="flex-1 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white hover:file:bg-primary/90"
                      disabled={uploading}
                    />
                  </div>
                  <div className="text-center text-gray-400 text-sm">OR</div>
                  <input
                    type="url"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                  />
                </div>
                {uploading && (
                  <div className="text-center text-primary text-sm mt-2">Uploading image...</div>
                )}
                {formData.featuredImage && (
                  <div className="mt-2">
                    <img
                      src={formData.featuredImage}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
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
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg"
                  disabled={uploading}
                >
                  Create News
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({
                      title: '',
                      content: '',
                      featuredImage: '',
                      category: '',
                      isPublished: true,
                    });
                    setImageFile(null);
                  }}
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