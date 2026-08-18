"use client"

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Upload, Trash2, Eye, EyeOff, GripVertical, Plus } from 'lucide-react'
import Image from 'next/image'

interface Banner {
  id: string
  imageUrl: string
  title?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  displayOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [bannerUrl, setBannerUrl] = useState('')
  const [uploadMethod, setUploadMethod] = useState<'file' | 'link'>('file')
  const [ctaText, setCtaText] = useState('')
  const [ctaLink, setCtaLink] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      console.log('🔵 Fetch Banners Request')
      const response = await api.get('/homepage-banners/admin/all')
      console.log('✅ Fetch Banners Success:', response.data)
      setBanners(response.data?.data || response.data)
    } catch (error) {
      console.error('❌ Error fetching banners:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleFileUpload = async () => {
    if (!selectedFile) return

    const formData = new FormData()
    formData.append('image', selectedFile)
    if (ctaText) formData.append('ctaText', ctaText)
    if (ctaLink) formData.append('ctaLink', ctaLink)

    setUploading(true)
    try {
      console.log('🔵 Upload Request:', {
        file: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        ctaText,
        ctaLink
      })

      const response = await api.post('/homepage-banners/upload', formData)

      console.log('✅ Upload Success:', response.data)
      setBanners([...banners, response.data])
      setPreviewUrl(null)
      setSelectedFile(null)
      setCtaText('')
      setCtaLink('')
    } catch (error) {
      console.error('❌ Upload Error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleLinkUpload = async () => {
    if (!bannerUrl) return

    setUploading(true)
    try {
      console.log('🔵 Link Upload Request:', { imageUrl: bannerUrl, ctaText, ctaLink })

      const response = await api.post('/homepage-banners/upload-link', {
        imageUrl: bannerUrl,
        ctaText: ctaText || null,
        ctaLink: ctaLink || null
      })

      console.log('✅ Link Upload Success:', response.data)
      setBanners([...banners, response.data])
      setBannerUrl('')
      setCtaText('')
      setCtaLink('')
    } catch (error) {
      console.error('❌ Link Upload Error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return

    try {
      console.log('🔵 Delete Request:', { id })
      await api.delete(`/homepage-banners/${id}`)
      console.log('✅ Delete Success')
      setBanners(banners.filter(b => b.id !== id))
    } catch (error) {
      console.error('❌ Delete Error:', error)
    }
  }

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      console.log('🔵 Toggle Status Request:', { id, isActive })
      const response = await api.put(`/homepage-banners/status/${id}`, { isActive: !isActive })
      console.log('✅ Toggle Status Success:', response.data)
      setBanners(banners.map(b =>
        b.id === id ? { ...b, isActive: !isActive } : b
      ))
    } catch (error) {
      console.error('❌ Toggle Status Error:', error)
    }
  }

  const handleReorder = async (draggedIndex: number, droppedIndex: number) => {
    const reorderedBanners = [...banners]
    const [draggedItem] = reorderedBanners.splice(draggedIndex, 1)
    reorderedBanners.splice(droppedIndex, 0, draggedItem)

    // Update display orders
    const updatedBanners = reorderedBanners.map((banner, index) => ({
      ...banner,
      displayOrder: index
    }))

    try {
      console.log('🔵 Reorder Request:', { banners: updatedBanners })
      const response = await api.put('/homepage-banners/update-order', { banners: updatedBanners })
      console.log('✅ Reorder Success:', response.data)
      setBanners(updatedBanners)
    } catch (error) {
      console.error('❌ Reorder Error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">Upload New Banner</h3>
        
        {/* Upload Method Selection */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setUploadMethod('file')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              uploadMethod === 'file' 
                ? 'bg-[#BFA253] text-[#1A0033]' 
                : 'bg-[#4A004A] text-white hover:bg-[#660066]'
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setUploadMethod('link')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              uploadMethod === 'link' 
                ? 'bg-[#BFA253] text-[#1A0033]' 
                : 'bg-[#4A004A] text-white hover:bg-[#660066]'
            }`}
          >
            Use Link
          </button>
        </div>

        {uploadMethod === 'file' ? (
          <>
            {/* Optional CTA Fields */}
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-[#D9D9D9] mb-2">CTA Button Text (Optional)</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full px-4 py-2 bg-[#4A004A] border border-white/10 rounded-lg text-white focus:border-[#BFA253] focus:outline-none transition-colors"
                  placeholder="e.g., Register Now"
                />
              </div>
              <div>
                <label className="block text-[#D9D9D9] mb-2">CTA Button Link (Optional)</label>
                <input
                  type="text"
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  className="w-full px-4 py-2 bg-[#4A004A] border border-white/10 rounded-lg text-white focus:border-[#BFA253] focus:outline-none transition-colors"
                  placeholder="e.g., /player-registration"
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label className="block text-[#D9D9D9] mb-2">Banner Image</label>
              <label className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg cursor-pointer transition-colors font-semibold bg-[#BFA253] hover:bg-[#D4B865] text-[#1A0033]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="banner-upload"
                  disabled={uploading}
                />
                <Upload className="w-5 h-5" />
                <span>{selectedFile ? selectedFile.name : 'Choose Image'}</span>
              </label>
              {previewUrl && (
                <div className="relative w-32 h-20 mt-2">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Upload Button */}
            <button
              onClick={handleFileUpload}
              disabled={uploading || !selectedFile}
              className="w-full px-6 py-3 bg-[#BFA253] hover:bg-[#D4B865] disabled:bg-gray-500 disabled:cursor-not-allowed rounded-lg text-[#1A0033] font-semibold transition-colors"
            >
              {uploading ? 'Uploading...' : 'Upload Banner'}
            </button>
          </>
        ) : (
          <>
            {/* Link Upload */}
            <div className="mb-4">
              <label className="block text-[#D9D9D9] mb-2">Banner Image URL</label>
              <input
                type="text"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                className="w-full px-4 py-2 bg-[#4A004A] border border-white/10 rounded-lg text-white focus:border-[#BFA253] focus:outline-none transition-colors"
                placeholder="https://example.com/banner.jpg"
              />
            </div>

            {/* Optional CTA Fields */}
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-[#D9D9D9] mb-2">CTA Button Text (Optional)</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full px-4 py-2 bg-[#4A004A] border border-white/10 rounded-lg text-white focus:border-[#BFA253] focus:outline-none transition-colors"
                  placeholder="e.g., Register Now"
                />
              </div>
              <div>
                <label className="block text-[#D9D9D9] mb-2">CTA Button Link (Optional)</label>
                <input
                  type="text"
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  className="w-full px-4 py-2 bg-[#4A004A] border border-white/10 rounded-lg text-white focus:border-[#BFA253] focus:outline-none transition-colors"
                  placeholder="e.g., /player-registration"
                />
              </div>
            </div>

            <button
              onClick={handleLinkUpload}
              disabled={uploading || !bannerUrl}
              className="px-6 py-3 bg-[#BFA253] hover:bg-[#D4B865] disabled:bg-gray-500 disabled:cursor-not-allowed rounded-lg text-[#1A0033] font-semibold transition-colors"
            >
              {uploading ? 'Uploading...' : 'Submit Banner'}
            </button>
            {uploading && (
              <div className="mt-4 text-[#BFA253]">Uploading...</div>
            )}
          </>
        )}
      </div>

      {/* Banners List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Homepage Banners</h3>
        
        {Array.isArray(banners) && banners.length === 0 ? (
          <div className="glass-card p-8 text-center text-[#D9D9D9]">
            No banners uploaded yet
          </div>
        ) : (
          <div className="space-y-4">
            {Array.isArray(banners) && banners.map((banner, index) => (
              <div
                key={banner.id}
                className="glass-card p-4 flex items-center gap-4 hover:scale-[1.01] transition-transform"
              >
                <GripVertical className="w-6 h-6 text-[#D9D9D9] cursor-move" />
                
                <div className="relative w-48 h-28 flex-shrink-0">
                  <Image
                    src={banner.imageUrl}
                    alt="Banner"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[#D9D9D9] text-sm truncate">{banner.imageUrl}</p>
                  {banner.ctaText && (
                    <p className="text-[#BFA253] text-xs mt-1">CTA: {banner.ctaText}</p>
                  )}
                  <div className="text-[#D9D9D9] text-xs mt-1">
                    Order: {banner.displayOrder} | Created: {new Date(banner.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(banner.id, banner.isActive)}
                    className={`p-2 rounded-lg transition-colors ${
                      banner.isActive
                        ? 'bg-[#BFA253]/20 text-[#BFA253]'
                        : 'bg-[#4A004A]/20 text-[#D9D9D9]'
                    }`}
                    title={banner.isActive ? 'Disable' : 'Enable'}
                  >
                    {banner.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                  
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
