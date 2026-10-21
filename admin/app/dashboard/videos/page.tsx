'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, ArrowUp, ArrowDown, Youtube, Link } from 'lucide-react';
import toast from 'react-hot-toast';

interface Video {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  category?: string;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
  youtubeUrl?: string;
}

export default function VideosPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [uploadType, setUploadType] = useState<'youtube' | 'upload'>('youtube');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    videoFile: null as File | null,
    thumbnailFile: null as File | null,
    category: '',
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
      // Handle both direct array and paginated response
      const videosData = response.data?.data || response.data || [];
      const normalizedVideos = Array.isArray(videosData) ? videosData.map((v: any) => ({
        id: v.id,
        title: v.title,
        videoUrl: v.youtubeUrl || v.videoUrl || '',
        thumbnailUrl: v.thumbnailUrl || '',
        category: v.category?.name || v.category || '',
        isFeatured: v.isFeatured || false,
        isActive: v.isActive !== false,
        order: v.displayOrder || v.order || 0,
        youtubeUrl: v.youtubeUrl || '',
      })) : [];
      setVideos(normalizedVideos);
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

    if (uploadType === 'upload' && !formData.videoFile) {
      toast.error('Please select a video file to upload');
      return;
    }

    if (uploadType === 'youtube' && !formData.videoUrl) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('isFeatured', formData.isFeatured.toString());
      data.append('isActive', formData.isActive.toString());
      data.append('displayOrder', formData.order.toString());

      if (uploadType === 'youtube') {
        data.append('videoUrl', formData.videoUrl);
        if (formData.thumbnailFile) {
          data.append('files', formData.thumbnailFile);
        }
      } else {
        if (formData.videoFile) {
          data.append('files', formData.videoFile);
        }
        if (formData.thumbnailFile) {
          data.append('files', formData.thumbnailFile);
        }
      }

      console.log('Submitting video data:', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        displayOrder: formData.order,
        uploadType,
        hasVideoFile: !!formData.videoFile,
        hasThumbnailFile: !!formData.thumbnailFile,
      });

      await api.post('/videos', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Video created successfully');
      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        videoUrl: '',
        thumbnailUrl: '',
        videoFile: null,
        thumbnailFile: null,
        category: '',
        isFeatured: false,
        isActive: true,
        order: 0,
      });
      setUploadType('youtube');
      fetchVideos();
    } catch (error) {
      console.error('Error creating video:', error);
      toast.error('Failed to create video');
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
            onClick={() => setShowCreateModal(true)}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Video
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
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
                <div className="absolute top-2 left-2 flex gap-2">
                  {video.youtubeUrl && (
                    <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                      <Youtube className="w-3 h-3" />
                      YouTube
                    </span>
                  )}
                </div>
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
                  <p className="text-gray-400 text-sm mb-2">{video.category}</p>
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
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-6">Add Video</h3>
            <form onSubmit={handleCreateVideo} className="space-y-4">
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                  rows={3}
                  placeholder="Enter video description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Upload Type</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setUploadType('youtube')}
                    className={`flex-1 px-4 py-3 rounded-lg flex items-center justify-center gap-2 ${
                      uploadType === 'youtube'
                        ? 'bg-primary text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    <Youtube className="w-5 h-5" />
                    YouTube URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadType('upload')}
                    className={`flex-1 px-4 py-3 rounded-lg flex items-center justify-center gap-2 ${
                      uploadType === 'upload'
                        ? 'bg-primary text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    <Upload className="w-5 h-5" />
                    Upload File
                  </button>
                </div>
              </div>

              {uploadType === 'youtube' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">YouTube URL</label>
                    <input
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                      placeholder="https://www.youtube.com/watch?v=..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Thumbnail Image (optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData({ ...formData, thumbnailFile: file });
                        }
                      }}
                      className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                    />
                    {formData.thumbnailFile && (
                      <p className="text-gray-400 text-sm mt-1">
                        Selected: {formData.thumbnailFile.name}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Video File (Max 1GB)</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 1024 * 1024 * 1024) {
                            toast.error('Video file must be less than 1GB');
                            return;
                          }
                          setFormData({ ...formData, videoFile: file });
                        }
                      }}
                      className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                      required
                    />
                    {formData.videoFile && (
                      <p className="text-gray-400 text-sm mt-1">
                        Selected: {formData.videoFile.name} ({(formData.videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Thumbnail File (optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData({ ...formData, thumbnailFile: file });
                        }
                      }}
                      className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                    />
                    {formData.thumbnailFile && (
                      <p className="text-gray-400 text-sm mt-1">
                        Selected: {formData.thumbnailFile.name}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                  className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg"
                >
                  Add Video
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({
                      title: '',
                      description: '',
                      videoUrl: '',
                      thumbnailUrl: '',
                      videoFile: null,
                      thumbnailFile: null,
                      category: '',
                      isFeatured: false,
                      isActive: true,
                      order: 0,
                    });
                    setUploadType('youtube');
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