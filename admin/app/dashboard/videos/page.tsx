'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, ArrowUp, ArrowDown } from 'lucide-react';
import toast from 'react-hot-toast';

interface Video {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: 'featured' | 'videos';
  isFeatured: boolean;
  isActive: boolean;
  order: number;
}

export default function VideosPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [uploadType, setUploadType] = useState<'url' | 'file'>('url');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'featured' | 'videos'>('featured');
  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    thumbnailUrl: '',
    category: 'featured' as 'featured' | 'videos',
    isFeatured: false,
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await api.get('/videos');
      console.log('Videos response:', response.data);
      // Handle both direct array and wrapped response
      const videosData = response.data?.data || response.data || [];
      setVideos(Array.isArray(videosData) ? videosData : []);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      toast.error('Failed to load videos');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setUploadProgress(0);
    try {
      let finalVideoUrl = formData.videoUrl;

      // If file upload selected, upload the file first
      if (uploadType === 'file' && videoFile) {
        const formDataFile = new FormData();
        formDataFile.append('file', videoFile);
        formDataFile.append('type', 'video');

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 20, 90));
        }, 300);

        const uploadResponse = await api.post('/files/upload', formDataFile, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        clearInterval(progressInterval);
        setUploadProgress(100);
        finalVideoUrl = uploadResponse.data.url;
      }

      const videoData = {
        ...formData,
        videoUrl: finalVideoUrl,
      };

      await api.post('/videos', videoData);
      toast.success('Video created successfully');
      setShowCreateModal(false);
      setFormData({
        title: '',
        videoUrl: '',
        thumbnailUrl: '',
        category: activeTab,
        isFeatured: false,
        isActive: true,
        order: 0,
      });
      setVideoFile(null);
      setUploadType('url');
      setUploadProgress(0);
      fetchVideos();
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create video';
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleToggleVideo = async (videoId: string, isActive: boolean) => {
    try {
      await api.patch(`/videos/${videoId}`, { isActive });
      toast.success('Video status updated');
      fetchVideos();
    } catch (error) {
      toast.error('Failed to update video status');
    }
  };

  const handleToggleFeatured = async (videoId: string, isFeatured: boolean) => {
    try {
      await api.patch(`/videos/${videoId}`, { isFeatured });
      toast.success('Video featured status updated');
      fetchVideos();
    } catch (error) {
      toast.error('Failed to update featured status');
    }
  };

  const handleReorderVideo = async (videoId: string, newOrder: number) => {
    try {
      await api.patch(`/videos/${videoId}`, { order: newOrder });
      toast.success('Video reordered');
      fetchVideos();
    } catch (error) {
      toast.error('Failed to reorder video');
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    try {
      await api.delete(`/videos/${videoId}`);
      toast.success('Video deleted successfully');
      fetchVideos();
    } catch (error) {
      toast.error('Failed to delete video');
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
              <h1 className="text-2xl font-bold text-white">Videos Management</h1>
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
          <h2 className="text-3xl font-bold text-white">Videos</h2>
          <button
            onClick={() => {
              setFormData({
                ...formData,
                category: activeTab,
              });
              setShowCreateModal(true);
            }}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add {activeTab === 'featured' ? 'Featured' : 'Video'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('featured')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'featured'
                ? 'bg-primary text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Featured (OTT)
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'videos'
                ? 'bg-primary text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Videos (Top Videos)
          </button>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos
            .filter((video) => video.category === activeTab)
            .map((video) => (
            <div key={video.id} className="bg-card rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-48 bg-background">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Upload className="w-12 h-12 text-gray-500" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  {video.isFeatured && (
                    <span className="bg-yellow-600 text-white px-2 py-1 rounded text-xs font-bold">
                      Featured
                    </span>
                  )}
                  <button
                    onClick={() => handleToggleVideo(video.id, !video.isActive)}
                    className={`p-2 rounded-full ${
                      video.isActive ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    {video.isActive ? <Eye className="w-4 h-4 text-white" /> : <EyeOff className="w-4 h-4 text-white" />}
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold mb-2">{video.title}</h3>
                {video.category && (
                  <p className="text-gray-400 text-sm mb-2 capitalize">{video.category}</p>
                )}
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReorderVideo(video.id, Math.max(0, video.order - 1))}
                      className="text-gray-400 hover:text-white"
                      disabled={video.order === 0}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <span className="text-gray-500 text-sm">Order: {video.order}</span>
                    <button
                      onClick={() => handleReorderVideo(video.id, video.order + 1)}
                      className="text-gray-400 hover:text-white"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleDeleteVideo(video.id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {videos.filter((video) => video.category === activeTab).length === 0 && (
          <div className="text-center py-12">
            <Upload className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No {activeTab} videos yet</p>
            <p className="text-gray-500 text-sm mt-2">Click "Add {activeTab === 'featured' ? 'Featured' : 'Video'}" to get started</p>
          </div>
        )}
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-6">
              Add {activeTab === 'featured' ? 'Featured' : 'Video'}
            </h3>
            <form onSubmit={handleCreateVideo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                  required
                  placeholder="Enter video title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as 'featured' | 'videos' })}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                >
                  <option value="featured">Featured (OTT heading)</option>
                  <option value="videos">Videos (Top Videos section)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Upload Type</label>
                <div className="flex gap-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setUploadType('url')}
                    className={`flex-1 py-2 rounded-lg ${uploadType === 'url' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}
                  >
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadType('file')}
                    className={`flex-1 py-2 rounded-lg ${uploadType === 'file' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}
                  >
                    File Upload (Max 1GB)
                  </button>
                </div>
              </div>

              {uploadType === 'url' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Video URL (YouTube or other)</label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                    required
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  <p className="text-gray-500 text-xs mt-1">Supports YouTube, Vimeo, and other video platforms</p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Video File (Max 1GB)</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 1024 * 1024 * 1024) {
                          toast.error('File size must be less than 1GB');
                          return;
                        }
                        setVideoFile(file);
                      }
                    }}
                    className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                    required
                  />
                  {videoFile && (
                    <div className="mt-2">
                      <p className="text-gray-400 text-sm">
                        Selected: {videoFile.name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                  {uploading && uploadProgress > 0 && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Thumbnail URL</label>
                <input
                  type="url"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                  required
                  placeholder="https://example.com/thumbnail.jpg"
                />
                <p className="text-gray-500 text-xs mt-1">Recommended size: 1280x720px</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                  min="0"
                />
                <p className="text-gray-500 text-xs mt-1">Lower numbers appear first</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isFeatured" className="text-gray-300">Featured</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isActive" className="text-gray-300">Active</label>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {uploading ? 'Uploading...' : `Add ${activeTab === 'featured' ? 'Featured' : 'Video'}`}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setVideoFile(null);
                    setUploadType('url');
                    setUploadProgress(0);
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-all"
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