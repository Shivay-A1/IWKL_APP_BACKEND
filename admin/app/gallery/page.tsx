"use client"

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useData } from '@/lib/hooks'
import { apiService } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react'

export default function GalleryPage() {
  const { data: galleryData, loading, refetch } = useData(() => apiService.gallery.getAll())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    album: '',
    isFeatured: false,
  })

  // Get backend URL
  const getBackendUrl = () => {
    if (typeof window !== 'undefined') {
      return process.env.NEXT_PUBLIC_BACKEND_URL || 'https://iwkl-backend-lg6t-production.up.railway.app'
    }
    return 'https://iwkl-backend-lg6t-production.up.railway.app'
  }

  const backendUrl = getBackendUrl()

  // Function to get full image URL
  const getImageUrl = (url?: string) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    if (url.startsWith('/uploads')) {
      return `${backendUrl}${url}`
    }
    return url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('album', formData.album)
      formDataToSend.append('mediaType', 'IMAGE')
      formDataToSend.append('isFeatured', formData.isFeatured.toString())
      
      if (imageFile) {
        formDataToSend.append('files', imageFile)
      }
      
      if (editingItem) {
        await apiService.gallery.update(editingItem.id, formDataToSend)
      } else {
        await apiService.gallery.create(formDataToSend)
      }
      setIsDialogOpen(false)
      setEditingItem(null)
      setImageFile(null)
      setFormData({
        title: '',
        description: '',
        category: '',
        album: '',
        isFeatured: false,
      })
      refetch()
    } catch (error) {
      console.error('Error saving gallery item:', error)
    }
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setImageFile(null)
    setFormData({
      title: item.title,
      description: item.description || '',
      category: item.category || '',
      album: item.album || '',
      isFeatured: item.isFeatured || false,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this gallery item?')) {
      try {
        await apiService.gallery.delete(id)
        refetch()
      } catch (error) {
        console.error('Error deleting gallery item:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gallery</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage gallery images</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingItem(null); setImageFile(null); setFormData({ title: '', description: '', category: '', album: '', isFeatured: false }) }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Image' : 'Add New Image'}</DialogTitle>
              <p className="text-sm text-gray-500">
                {editingItem ? 'Update the gallery image details below.' : 'Add a new image to the gallery.'}
              </p>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="files">Image</Label>
                <Input id="files" type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setImageFile(file)
                }} />
              </div>
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
                  <SelectTrigger><SelectValue placeholder="Select category (optional)" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matches">Matches</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="teams">Teams</SelectItem>
                    <SelectItem value="fans">Fans</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="album">Album</Label>
                <Input id="album" value={formData.album} onChange={(e) => setFormData({ ...formData, album: e.target.value })} placeholder="Optional" />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="isFeatured" className="text-sm">Set as Featured Image</Label>
              </div>
              <Button type="submit" className="w-full">{editingItem ? 'Update' : 'Create'} Image</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading...</p>
        ) : Array.isArray(galleryData) && galleryData.length > 0 ? (
          galleryData.map((item: any) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.mediaUrl ? (
                        <img 
                          src={getImageUrl(item.mediaUrl)} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center ${item.mediaUrl ? 'hidden' : ''}`}>
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.category || 'Uncategorized'}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">{item.description || 'No description'}</p>
                {item.album && <p className="text-xs text-gray-500 mb-4">Album: {item.album}</p>}
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}><Edit className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No gallery items found</p>
        )}
      </div>
    </div>
  )
}
