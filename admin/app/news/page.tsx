"use client"

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useData } from '@/lib/hooks'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, Newspaper } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function NewsPage() {
  const { data: newsData, loading, refetch } = useData(() => api.get('/news'))
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<any>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [useUrlMode, setUseUrlMode] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    isFeatured: false,
    isPublished: false,
  })

  const handleSimpleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const dataToSend = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        isFeatured: formData.isFeatured,
        isPublished: formData.isPublished,
      }
      await api.post('/news/simple', dataToSend)
      setIsDialogOpen(false)
      setEditingNews(null)
      setImageFile(null)
      setImageFiles([])
      setFormData({ title: '', excerpt: '', content: '', category: '', isFeatured: false, isPublished: false })
      refetch()
    } catch (error) {
      console.error('Error saving news:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (useUrlMode) {
        // Use URL mode
        const dataToSend = {
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          category: formData.category,
          isFeatured: formData.isFeatured,
          isPublished: formData.isPublished,
          featuredImage: imageUrl,
        }

        if (editingNews) {
          await api.put(`/news/${editingNews.id}/simple`, dataToSend)
        } else {
          await api.post('/news/simple', dataToSend)
        }
      } else {
        // Use file upload mode
        const formDataToSend = new FormData()
        formDataToSend.append('title', formData.title)
        formDataToSend.append('excerpt', formData.excerpt)
        formDataToSend.append('content', formData.content)
        formDataToSend.append('category', formData.category)
        formDataToSend.append('isFeatured', formData.isFeatured.toString())
        formDataToSend.append('isPublished', formData.isPublished.toString())

        if (imageFile) {
          formDataToSend.append('image', imageFile)
        }

        if (editingNews) {
          await api.put(`/news/${editingNews.id}`, formDataToSend)
        } else {
          await api.post('/news', formDataToSend)
        }
      }
      
      setIsDialogOpen(false)
      setEditingNews(null)
      setImageFile(null)
      setImageFiles([])
      setImageUrl('')
      setFormData({ title: '', excerpt: '', content: '', category: '', isFeatured: false, isPublished: false })
      refetch()
    } catch (error) {
      console.error('Error saving news:', error)
    }
  }

  const handleEdit = (news: any) => {
    setEditingNews(news)
    setImageFile(null)
    setImageFiles([])
    // Determine if the news has a URL or was uploaded
    if (news.featuredImage && (news.featuredImage.startsWith('http://') || news.featuredImage.startsWith('https://'))) {
      setUseUrlMode(true)
      setImageUrl(news.featuredImage)
    } else {
      setUseUrlMode(false)
      setImageUrl('')
    }
    setFormData({
      title: news.title,
      excerpt: news.excerpt,
      content: news.content,
      category: news.category || '',
      isFeatured: news.isFeatured,
      isPublished: news.isPublished,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this news article?')) {
      try {
        await api.delete(`/news/${id}`)
        refetch()
      } catch (error) {
        console.error('Error deleting news:', error)
      }
    }
  }

  const handleDeleteAll = async () => {
    if (confirm('Are you sure you want to delete ALL news articles? This cannot be undone.')) {
      try {
        await api.delete('/news/all')
        refetch()
      } catch (error) {
        console.error('Error deleting all news:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">News Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage news articles and press conference announcements</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={handleDeleteAll} variant="destructive" className="mr-2">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete All
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingNews(null); setImageFile(null); setImageFiles([]); setImageUrl(''); setUseUrlMode(false); setFormData({ title: '', excerpt: '', content: '', category: '', isFeatured: false, isPublished: false }); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add News
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingNews ? 'Edit News' : 'Add New Article'}</DialogTitle>
                <DialogDescription>
                  {editingNews ? 'Update article information below. Changes will be saved immediately.' : 'Add a new news article to the league. Fill in all required fields.'}
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-4 mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="imageMode"
                    checked={!useUrlMode}
                    onChange={() => setUseUrlMode(false)}
                    className="rounded"
                  />
                  <span className="text-sm">Upload File</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="imageMode"
                    checked={useUrlMode}
                    onChange={() => setUseUrlMode(true)}
                    className="rounded"
                  />
                  <span className="text-sm">Image URL</span>
                </label>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {useUrlMode ? (
                  <div>
                    <Label htmlFor="imageUrl">Featured Image URL</Label>
                    <Input
                      id="imageUrl"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter the full URL of the image (e.g., from your hosting or CDN)</p>
                    {imageUrl && (
                      <div className="mt-2">
                        <img src={imageUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="image">Featured Image</Label>
                    <Input id="image" type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) setImageFile(file)
                    }} />
                    {imageFile && (
                      <div className="mt-2">
                        <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                      </div>
                    )}
                  </div>
                )}
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Input id="excerpt" value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full min-h-[200px] px-3 py-2 border rounded-md text-black"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded"
                    />
                    <span>Featured</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="rounded"
                    />
                    <span>Published</span>
                  </label>
                </div>
                <Button type="submit" className="w-full">{editingNews ? 'Update' : 'Create'} Article</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <p>Loading...</p> : ((newsData as any)?.data || (newsData as any[]))?.map((news: any) => (
          <Card key={news.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Newspaper className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{news.title}</CardTitle>
                    <CardDescription className="text-sm">{news.category || 'Uncategorized'}</CardDescription>
                  </div>
                </div>
                {news.isFeatured && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    Featured
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {news.featuredImage && (
                <img src={news.featuredImage} alt={news.title} className="w-full h-32 object-cover rounded-lg mb-3" />
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">{news.excerpt}</p>
              {news.featuredImage && (
                <p className="text-xs text-gray-500 mb-2 truncate" title={news.featuredImage}>{news.featuredImage}</p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{formatDate(news.createdAt)}</span>
                <div className="flex items-center space-x-1">
                  {news.isPublished && <span className="text-green-600">Published</span>}
                  {!news.isPublished && <span className="text-gray-600">Draft</span>}
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <Button size="sm" variant="ghost" onClick={() => handleEdit(news)}><Edit className="w-4 h-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(news.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
