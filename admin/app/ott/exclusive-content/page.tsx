"use client"

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, Play } from 'lucide-react'

export default function ExclusiveContentPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    thumbnail: null as File | null,
    videoUrl: '',
    description: '',
  })

  const categories = ['Highlights', 'Player Interviews', 'Behind the Scenes', 'Training Sessions']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement API call to save exclusive content
    console.log('Form data:', formData)
    setIsDialogOpen(false)
    setEditingItem(null)
    setFormData({ title: '', category: '', thumbnail: null, videoUrl: '', description: '' })
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      category: item.category,
      thumbnail: null,
      videoUrl: item.videoUrl,
      description: item.description,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      // TODO: Implement API call to delete
      console.log('Delete:', id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Exclusive Content</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage exclusive OTT content</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingItem(null); setFormData({ title: '', category: '', thumbnail: null, videoUrl: '', description: '' }) }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Content' : 'Add New Content'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update content information below.' : 'Add new exclusive content to the OTT platform.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="thumbnail">Thumbnail</Label>
                <Input id="thumbnail" type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files?.[0] || null })} />
              </div>
              <div>
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input id="videoUrl" value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">{editingItem ? 'Update' : 'Create'} Content</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <Card key={category} className="overflow-hidden">
            <div className="aspect-video bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
              <Play className="w-12 h-12 text-gray-400" />
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="ghost" onClick={() => handleEdit({ id: index, title: category, category, videoUrl: '', description: '' })}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(index.toString())}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
