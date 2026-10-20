// ============================================================================
// ⚠️  GALLERY FUNCTIONALITY LOCKED - DO NOT MODIFY WITHOUT APPROVAL ⚠️
// ============================================================================
// This file contains the gallery management functionality for the admin panel.
// Any changes to this file must be approved by the project owner.
//
// BEFORE MAKING CHANGES:
// 1. Get explicit approval from project owner
// 2. Document changes in project documentation
// 3. Test thoroughly in development environment
//
// LOCKED BY: Project Owner
// LOCKED DATE: 2026-10-21
// STATUS: 🔒 LOCKED
// ============================================================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, ArrowUp, ArrowDown } from 'lucide-react';
import toast from 'react-hot-toast';

interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  category?: string;
  description?: string;
  isFeatured?: boolean;
  order: number;
}

export default function GalleryPage() {
  const router = useRouter();
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    category: '',
    description: '',
    isFeatured: false,
    order: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await api.get('/gallery');
      console.log('Gallery response:', response.data);
      // Handle both direct array and paginated response
      const galleryData = response.data?.data || response.data || [];
      setGallery(Array.isArray(galleryData) ? galleryData : []);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
      toast.error('Failed to load gallery');
      setGallery([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/gallery', formData);
      toast.success('Gallery item created successfully');
      setShowCreateModal(false);
      setFormData({
        title: '',
        imageUrl: '',
        category: '',
        description: '',
        isFeatured: false,
        order: 0,
      });
      fetchGallery();
    } catch (error) {
      toast.error('Failed to create gallery item');
    }
  };

  const handleToggleGalleryItem = async (itemId: string, isFeatured: boolean) => {
    try {
      await api.patch(`/gallery/${itemId}`, { isFeatured });
      toast.success('Gallery item status updated');
      fetchGallery();
    } catch (error) {
      toast.error('Failed to update gallery item status');
    }
  };

  const handleReorderGalleryItem = async (itemId: string, newOrder: number) => {
    try {
      await api.patch(`/gallery/${itemId}`, { order: newOrder });
      toast.success('Gallery item reordered');
      fetchGallery();
    } catch (error) {
      toast.error('Failed to reorder gallery item');
    }
  };

  const handleDeleteGalleryItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;
    try {
      await api.delete(`/gallery/${itemId}`);
      toast.success('Gallery item deleted successfully');
      fetchGallery();
    } catch (error) {
      toast.error('Failed to delete gallery item');
    }
  };

  const handleEditGalleryItem = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      imageUrl: item.imageUrl,
      category: item.category || '',
      description: item.description || '',
      isFeatured: item.isFeatured || false,
      order: item.order,
    });
    setShowEditModal(true);
  };

  const handleUpdateGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      await api.patch(`/gallery/${editingItem.id}`, formData);
      toast.success('Gallery item updated successfully');
      setShowEditModal(false);
      setEditingItem(null);
      setFormData({
        title: '',
        imageUrl: '',
        category: '',
        description: '',
        isFeatured: false,
        order: 0,
      });
      setImageFile(null);
      fetchGallery();
    } catch (error) {
      toast.error('Failed to update gallery item');
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', 'gallery');

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
      setFormData({ ...formData, imageUrl });
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
              <h1 className="text-xl sm:text-2xl font-bold text-white">Gallery Management</h1>
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
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Gallery</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center gap-2 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Add Image
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {gallery.map((item) => (
            <div key={item.id} className="bg-card rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-40 sm:h-48 bg-background">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
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
                    onClick={() => handleToggleGalleryItem(item.id, !item.isFeatured)}
                    className={`p-2 rounded-full ${
                      item.isFeatured ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    {item.isFeatured ? <Eye className="w-4 h-4 text-white" /> : <EyeOff className="w-4 h-4 text-white" />}
                  </button>
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">{item.title}</h3>
                {item.category && (
                  <p className="text-gray-400 text-xs sm:text-sm mb-2">{item.category}</p>
                )}
                {item.description && (
                  <p className="text-gray-300 text-xs sm:text-sm mb-4 line-clamp-2">{item.description}</p>
                )}
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReorderGalleryItem(item.id, Math.max(0, item.order - 1))}
                      className="text-gray-400 hover:text-white"
                      disabled={item.order === 0}
                    >
                      <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <span className="text-gray-500 text-xs sm:text-sm">Order: {item.order}</span>
                    <button
                      onClick={() => handleReorderGalleryItem(item.id, item.order + 1)}
                      className="text-gray-400 hover:text-white"
                    >
                      <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditGalleryItem(item)}
                      className="text-blue-500 hover:text-blue-400"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGalleryItem(item.id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">Add Gallery Image</h3>
            <form onSubmit={handleCreateGalleryItem} className="space-y-4">
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Image</label>
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
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                  />
                </div>
                {uploading && (
                  <div className="text-center text-primary text-sm mt-2">Uploading image...</div>
                )}
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={formData.imageUrl}
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
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                  rows={3}
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
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isFeatured" className="text-gray-300">Featured</label>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg"
                  disabled={uploading}
                >
                  Add Image
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({
                      title: '',
                      imageUrl: '',
                      category: '',
                      description: '',
                      isActive: true,
                      order: 0,
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

      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">Edit Gallery Image</h3>
            <form onSubmit={handleUpdateGalleryItem} className="space-y-4">
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Image</label>
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
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                  />
                </div>
                {uploading && (
                  <div className="text-center text-primary text-sm mt-2">Uploading image...</div>
                )}
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={formData.imageUrl}
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
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white"
                  rows={3}
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
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isFeatured" className="text-gray-300">Featured</label>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg"
                  disabled={uploading}
                >
                  Update Image
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingItem(null);
                    setFormData({
                      title: '',
                      imageUrl: '',
                      category: '',
                      description: '',
                      isActive: true,
                      order: 0,
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