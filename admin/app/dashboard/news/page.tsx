'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, Calendar, Image as ImageIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface News {
  id: string;
  title: string;
  content: string;
  featuredImage?: string;
  link?: string;
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
  const [useFileUpload, setUseFileUpload] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    featuredImage: '',
    link: '',
    category: '',
    isPublished: true,
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await api.get('/news');
      console.log('News response:', response.data);
      // Handle both direct array and wrapped response
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

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (): Promise<string> => {
    if (!imageFile) return '';
    
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('fileType', 'news-image');
    
    try {
      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Image uploaded successfully');
      return response.data.url;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let featuredImage = formData.featuredImage;
      
      if (useFileUpload && imageFile) {
        try {
          featuredImage = await handleImageUpload();
        } catch (error) {
          toast.error('Failed to upload image');
          setUploading(false);
          return;
        }
      }
      
      await api.post('/news', { ...formData, featuredImage });
      toast.success('News created successfully');
      setShowCreateModal(false);
      setFormData({
        title: '',
        content: '',
        featuredImage: '',
        link: '',
        category: '',
        isPublished: true,
      });
      setImageFile(null);
      setImagePreview('');
      setUseFileUpload(false);
      fetchNews();
    } catch (error) {
      toast.error('Failed to create news');
    } finally {
      setUploading(false);
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-white">News Management</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-300 hover:text-white px-3 py-2 sm:px-4 text-sm sm:text-base"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Latest News</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Create News
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {news.map((item) => (
            <div key={item.id} className="bg-card rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-48 bg-background">
                {item.featuredImage ? (
                  <img
                    src={item.featuredImage}
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
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                {item.category && (
                  <p className="text-gray-400 text-sm mb-2">{item.category}</p>
                )}
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{item.content}</p>
                <div className="flex justify-between items-center">
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/90 text-sm font-medium"
                    >
                      Read More →
                    </a>
                  )}
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
              
              {/* Image Upload Section */}
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <button
                    type="button"
                    onClick={() => setUseFileUpload(false)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      !useFileUpload 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4 inline mr-2" />
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseFileUpload(true)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      useFileUpload 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Upload Image
                  </button>
                </div>
                
                {!useFileUpload ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                    <input
                      type="url"
                      value={formData.featuredImage}
                      onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                      className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Upload Image</label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-primary transition-colors">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-h-48 mx-auto rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview('');
                            }}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                          <p className="text-gray-400 text-sm">Click to upload or drag and drop</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="mt-2 inline-block bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg cursor-pointer"
                          >
                            Select Image
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Link (Optional)</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                  placeholder="https://example.com/news-article"
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
                  disabled={uploading}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Creating...' : 'Create News'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({
                      title: '',
                      content: '',
                      featuredImage: '',
                      link: '',
                      category: '',
                      isPublished: true,
                    });
                    setImageFile(null);
                    setImagePreview('');
                    setUseFileUpload(false);
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