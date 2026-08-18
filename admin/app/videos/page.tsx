"use client"

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useData } from '@/lib/hooks'
import { apiService } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Edit, Trash2, PlayCircle, Upload, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react'

export default function VideosPage() {
  const { data: videosData, loading, refetch } = useData(() => apiService.videos.getAll())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<any>(null)
  const [uploadType, setUploadType] = useState<'url' | 'upload'>('url')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'MATCH_HIGHLIGHTS',
    videoUrl: '',
    thumbnail: '',
    displayOrder: 0,
    isActive: true,
    isFeatured: false,
    duration: '',
    publishedAt: '',
    tags: '',
  })

  const categories = [
    { value: 'MATCH_HIGHLIGHTS', label: 'Match Highlights' },
    { value: 'FULL_MATCH', label: 'Full Match' },
    { value: 'INTERVIEWS', label: 'Interviews' },
    { value: 'DOCUMENTARY', label: 'Documentary' },
    { value: 'TRAILERS', label: 'Trailers' },
    { value: 'PROMOS', label: 'Promos' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = new FormData()
      data.append('title', formData.title)
      data.append('description', formData.description)
      data.append('category', formData.category)
      data.append('displayOrder', formData.displayOrder.toString())
      data.append('isActive', formData.isActive.toString())
      data.append('isFeatured', formData.isFeatured.toString())
      
      if (formData.duration) {
        data.append('duration', formData.duration)
      }
      if (formData.publishedAt) {
        data.append('publishedAt', formData.publishedAt)
      }
      if (formData.tags) {
        data.append('tags', JSON.stringify(formData.tags.split(',').map(t => t.trim())))
      }

      if (uploadType === 'upload' && videoFile) {
        data.append('files', videoFile)
      } else {
        data.append('videoUrl', formData.videoUrl)
      }

      if (thumbnailFile) {
        data.append('files', thumbnailFile)
      } else if (formData.thumbnail) {
        data.append('thumbnail', formData.thumbnail)
      }

      if (editingVideo) {
        await apiService.videos.update(editingVideo.id, data)
      } else {
        await apiService.videos.create(data)
      }
      setIsDialogOpen(false)
      setEditingVideo(null)
      setVideoFile(null)
      setThumbnailFile(null)
      refetch()
    } catch (error) {
      console.error('Error saving video:', error)
    }
  }

  const handleEdit = (video: any) => {
    setEditingVideo(video)
    setFormData({
      title: video.title,
      description: video.description || '',
      category: video.category,
      videoUrl: video.videoUrl || '',
      thumbnail: video.thumbnail || '',
      displayOrder: video.displayOrder || 0,
      isActive: video.isActive !== false,
      isFeatured: video.isFeatured,
      duration: video.duration ? video.duration.toString() : '',
      publishedAt: video.publishedAt ? new Date(video.publishedAt).toISOString().split('T')[0] : '',
      tags: video.tags && Array.isArray(video.tags) ? video.tags.join(', ') : '',
    })
    setUploadType(video.videoUrl ? 'url' : 'upload')
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      try {
        await apiService.videos.delete(id)
        refetch()
      } catch (error) {
        console.error('Error deleting video:', error)
      }
    }
  }

  const handleToggleActive = async (video: any) => {
    try {
      await apiService.videos.update(video.id, { ...video, isActive: !video.isActive })
      refetch()
    } catch (error) {
      console.error('Error toggling video status:', error)
    }
  }

  const handleMoveUp = async (video: any, index: number) => {
    try {
      const videos = ((videosData as any)?.data || (videosData as any[])) || []
      if (index > 0) {
        const newOrder: any[] = [...videos]
        const temp = newOrder[index]
        newOrder[index] = newOrder[index - 1]
        newOrder[index - 1] = temp
        await Promise.all(newOrder.map((v, i) => apiService.videos.update(v.id, { ...v, displayOrder: i })))
        refetch()
      }
    } catch (error) {
      console.error('Error moving video up:', error)
    }
  }

  const handleMoveDown = async (video: any, index: number) => {
    try {
      const videos = ((videosData as any)?.data || (videosData as any[])) || []
      if (index < videos.length - 1) {
        const newOrder: any[] = [...videos]
        const temp = newOrder[index]
        newOrder[index] = newOrder[index + 1]
        newOrder[index + 1] = temp
        await Promise.all(newOrder.map((v, i) => apiService.videos.update(v.id, { ...v, displayOrder: i })))
        refetch()
      }
    } catch (error) {
      console.error('Error moving video down:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Videos</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage video content</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingVideo(null); setFormData({ title: '', description: '', category: 'MATCH_HIGHLIGHTS', videoUrl: '', thumbnail: '', displayOrder: 0, isActive: true, isFeatured: false, duration: '', publishedAt: '', tags: '' }); setUploadType('url'); setVideoFile(null); setThumbnailFile(null) }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingVideo ? 'Edit Video' : 'Add New Video'}</DialogTitle>
              <DialogDescription>
                {editingVideo ? 'Update video information below. Changes will be saved immediately.' : 'Add a new video to the league. Fill in all required fields.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Upload Type</Label>
                <div className="flex gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setUploadType('url')}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${uploadType === 'url' ? 'border-[#CC66FF] bg-[#CC66FF]/10' : 'border-gray-300'}`}
                  >
                    External URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadType('upload')}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${uploadType === 'upload' ? 'border-[#CC66FF] bg-[#CC66FF]/10' : 'border-gray-300'}`}
                  >
                    Upload Video
                  </button>
                </div>
              </div>
              {uploadType === 'url' ? (
                <div>
                  <Label htmlFor="videoUrl">Video URL (YouTube, Vimeo, or direct MP4)</Label>
                  <Input id="videoUrl" value={formData.videoUrl || ''} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} placeholder="https://youtube.com/watch?v=..." />
                </div>
              ) : (
                <div>
                  <Label htmlFor="videoFile">Upload Video File</Label>
                  <Input
                    id="videoFile"
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    className="cursor-pointer"
                  />
                  {videoFile && <p className="text-sm text-gray-500 mt-1">{videoFile.name}</p>}
                </div>
              )}
              <div>
                <Label htmlFor="thumbnail">Thumbnail</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                  className="cursor-pointer"
                />
                {thumbnailFile && <p className="text-sm text-gray-500 mt-1">{thumbnailFile.name}</p>}
                {formData.thumbnail && !thumbnailFile && <p className="text-sm text-gray-500 mt-1">Current: {formData.thumbnail}</p>}
              </div>
              <div>
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input id="displayOrder" type="number" value={formData.displayOrder} onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <Label htmlFor="duration">Duration (seconds)</Label>
                <Input id="duration" type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g., 120" />
              </div>
              <div>
                <Label htmlFor="publishedAt">Published Date</Label>
                <Input id="publishedAt" type="date" value={formData.publishedAt} onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input id="tags" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="e.g., highlights, kabaddi, season1" />
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <span>Active</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded"
                  />
                  <span>Featured</span>
                </label>
              </div>
              <Button type="submit" className="w-full">{editingVideo ? 'Update' : 'Create'} Video</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <p>Loading...</p> : ((videosData as any)?.data || (videosData as any[]))?.map((video: any, index: number) => (
          <Card key={video.id} className={!video.isActive ? 'opacity-50' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                    {video.thumbnail ? (
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                    ) : (
                      <PlayCircle className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {video.isFeatured && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      Featured
                    </span>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => handleToggleActive(video)}>
                    {video.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <CardTitle className="text-lg line-clamp-2 mt-4">{video.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">{video.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>{video.category}</span>
                <span>Order: {video.displayOrder}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => handleMoveUp(video, index)} disabled={index === 0}>
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleMoveDown(video, index)} disabled={index === ((videosData as any)?.data || (videosData as any[]))?.length - 1}>
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(video)}><Edit className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(video.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
