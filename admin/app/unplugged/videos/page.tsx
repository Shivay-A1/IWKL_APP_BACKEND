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
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, PlayCircle } from 'lucide-react'

export default function UnpluggedVideosPage() {
  const { data: videosData, loading, refetch } = useData(() => apiService.unplugged.getVideos(), [], [])
  const { data: categoriesData } = useData(() => apiService.unplugged.getCategories(), [], [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<any>(null)
  const [formData, setFormData] = useState({
    categoryId: '',
    title: '',
    description: '',
    thumbnailUrl: '',
    youtubeUrl: '',
    duration: 0,
    displayOrder: 0,
    isActive: true,
    isFeatured: false,
  })

  const categories = Array.isArray(categoriesData) ? categoriesData : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingVideo) {
        await apiService.unplugged.updateVideo(editingVideo.id, formData)
      } else {
        await apiService.unplugged.createVideo(formData)
      }
      setIsDialogOpen(false)
      setEditingVideo(null)
      refetch()
    } catch (error) {
      console.error('Error saving video:', error)
    }
  }

  const handleEdit = (video: any) => {
    setEditingVideo(video)
    setFormData({
      categoryId: video.categoryId,
      title: video.title,
      description: video.description || '',
      thumbnailUrl: video.thumbnailUrl || '',
      youtubeUrl: video.youtubeUrl || '',
      duration: video.duration || 0,
      displayOrder: video.displayOrder || 0,
      isActive: video.isActive !== false,
      isFeatured: video.isFeatured,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      try {
        await apiService.unplugged.deleteVideo(id)
        refetch()
      } catch (error) {
        console.error('Error deleting video:', error)
      }
    }
  }

  const handleToggleActive = async (video: any) => {
    try {
      await apiService.unplugged.updateVideo(video.id, { ...video, isActive: !video.isActive })
      refetch()
    } catch (error) {
      console.error('Error toggling video status:', error)
    }
  }

  const handleToggleFeatured = async (video: any) => {
    try {
      await apiService.unplugged.updateVideo(video.id, { ...video, isFeatured: !video.isFeatured })
      refetch()
    } catch (error) {
      console.error('Error toggling featured status:', error)
    }
  }

  const handleMoveUp = async (video: any, index: number) => {
    try {
      const videos = Array.isArray(videosData) ? videosData : []
      if (index > 0) {
        const newOrder: any[] = [...videos]
        const temp = newOrder[index]
        newOrder[index] = newOrder[index - 1]
        newOrder[index - 1] = temp
        await Promise.all(newOrder.map((v, i) => apiService.unplugged.updateVideo(v.id, { ...v, displayOrder: i })))
        refetch()
      }
    } catch (error) {
      console.error('Error moving video up:', error)
    }
  }

  const handleMoveDown = async (video: any, index: number) => {
    try {
      const videos = Array.isArray(videosData) ? videosData : []
      if (index < videos.length - 1) {
        const newOrder: any[] = [...videos]
        const temp = newOrder[index]
        newOrder[index] = newOrder[index + 1]
        newOrder[index + 1] = temp
        await Promise.all(newOrder.map((v, i) => apiService.unplugged.updateVideo(v.id, { ...v, displayOrder: i })))
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">IWKL Unplugged Videos</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage video content</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingVideo(null); setFormData({ categoryId: '', title: '', description: '', thumbnailUrl: '', youtubeUrl: '', duration: 0, displayOrder: 0, isActive: true, isFeatured: false }) }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingVideo ? 'Edit Video' : 'Add New Video'}</DialogTitle>
              <DialogDescription>
                {editingVideo ? 'Update video information below. Changes will be saved immediately.' : 'Add a new unplugged video. Fill in all required fields.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="categoryId">Category</Label>
                <Select value={formData.categoryId} onValueChange={(v) => setFormData({ ...formData, categoryId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </div>
              <div>
                <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                <Input id="thumbnailUrl" value={formData.thumbnailUrl} onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })} placeholder="https://example.com/thumbnail.jpg" required />
              </div>
              <div>
                <Label htmlFor="youtubeUrl">YouTube URL</Label>
                <Input id="youtubeUrl" value={formData.youtubeUrl} onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })} placeholder="https://youtube.com/watch?v=..." />
              </div>
              <div>
                <Label htmlFor="duration">Duration (seconds)</Label>
                <Input id="duration" type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input id="displayOrder" type="number" value={formData.displayOrder} onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })} />
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
        {loading ? <p>Loading...</p> : Array.isArray(videosData) && videosData.map((video: any, index: number) => (
          <Card key={video.id} className={!video.isActive ? 'opacity-50' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {video.thumbnailUrl ? (
                    <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                  ) : (
                    <PlayCircle className="w-12 h-12 text-gray-400" />
                  )}
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
                <span>{video.category?.name}</span>
                <span>Order: {video.displayOrder}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => handleMoveUp(video, index)} disabled={index === 0}>
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleMoveDown(video, index)} disabled={index === videosData.length - 1}>
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => handleToggleFeatured(video)}>
                    {video.isFeatured ? '★' : '☆'}
                  </Button>
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
