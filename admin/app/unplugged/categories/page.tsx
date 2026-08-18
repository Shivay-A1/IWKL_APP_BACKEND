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
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react'

export default function UnpluggedCategoriesPage() {
  const { data: categoriesData, loading, refetch } = useData(() => apiService.unplugged.getCategories(), [], [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    displayOrder: 0,
    isActive: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        await apiService.unplugged.updateCategory(editingCategory.id, formData)
      } else {
        await apiService.unplugged.createCategory(formData)
      }
      setIsDialogOpen(false)
      setEditingCategory(null)
      refetch()
    } catch (error) {
      console.error('Error saving category:', error)
    }
  }

  const handleEdit = (category: any) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      displayOrder: category.displayOrder || 0,
      isActive: category.isActive !== false,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category? This will also delete all videos in this category.')) {
      try {
        await apiService.unplugged.deleteCategory(id)
        refetch()
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
  }

  const handleToggleActive = async (category: any) => {
    try {
      await apiService.unplugged.updateCategory(category.id, { ...category, isActive: !category.isActive })
      refetch()
    } catch (error) {
      console.error('Error toggling category status:', error)
    }
  }

  const handleMoveUp = async (category: any, index: number) => {
    try {
      const categories = Array.isArray(categoriesData) ? categoriesData : []
      if (index > 0) {
        const newOrder: any[] = [...categories]
        const temp = newOrder[index]
        newOrder[index] = newOrder[index - 1]
        newOrder[index - 1] = temp
        await Promise.all(newOrder.map((c, i) => apiService.unplugged.updateCategory(c.id, { ...c, displayOrder: i })))
        refetch()
      }
    } catch (error) {
      console.error('Error moving category up:', error)
    }
  }

  const handleMoveDown = async (category: any, index: number) => {
    try {
      const categories = Array.isArray(categoriesData) ? categoriesData : []
      if (index < categories.length - 1) {
        const newOrder: any[] = [...categories]
        const temp = newOrder[index]
        newOrder[index] = newOrder[index + 1]
        newOrder[index + 1] = temp
        await Promise.all(newOrder.map((c, i) => apiService.unplugged.updateCategory(c.id, { ...c, displayOrder: i })))
        refetch()
      }
    } catch (error) {
      console.error('Error moving category down:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">IWKL Unplugged Categories</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage video categories</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingCategory(null); setFormData({ name: '', slug: '', description: '', displayOrder: 0, isActive: true }) }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
              <DialogDescription>
                {editingCategory ? 'Update category information below. Changes will be saved immediately.' : 'Add a new unplugged category. Fill in all required fields.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </div>
              <div>
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input id="displayOrder" type="number" value={formData.displayOrder} onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded"
                />
                <span>Active</span>
              </div>
              <Button type="submit" className="w-full">{editingCategory ? 'Update' : 'Create'} Category</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <p>Loading...</p> : Array.isArray(categoriesData) && categoriesData.map((category: any, index: number) => (
          <Card key={category.id} className={!category.isActive ? 'opacity-50' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">{category.name}</CardTitle>
                <Button size="sm" variant="ghost" onClick={() => handleToggleActive(category)}>
                  {category.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{category.slug}</p>
            </CardHeader>
            <CardContent>
              {category.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{category.description}</p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>Videos: {category.videos?.length || 0}</span>
                <span>Order: {category.displayOrder}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => handleMoveUp(category, index)} disabled={index === 0}>
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleMoveDown(category, index)} disabled={index === categoriesData.length - 1}>
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(category)}><Edit className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(category.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
