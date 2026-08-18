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
import { Plus, Edit, Trash2, MapPin, Building2 } from 'lucide-react'

export default function StadiumsPage() {
  const { data: stadiumsData, loading, refetch } = useData(() => apiService.stadiums?.getAll() || Promise.resolve([]))
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStadium, setEditingStadium] = useState<any>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    state: '',
    capacity: '',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('city', formData.city)
      formDataToSend.append('state', formData.state)
      formDataToSend.append('capacity', formData.capacity)
      formDataToSend.append('description', formData.description)
      
      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }
      
      if (editingStadium) {
        await apiService.stadiums?.update(editingStadium.id, formDataToSend)
      } else {
        await apiService.stadiums?.create(formDataToSend)
      }
      setIsDialogOpen(false)
      setEditingStadium(null)
      setImageFile(null)
      refetch()
    } catch (error) {
      console.error('Error saving stadium:', error)
    }
  }

  const handleEdit = (stadium: any) => {
    setEditingStadium(stadium)
    setImageFile(null)
    setFormData({
      name: stadium.name,
      city: stadium.city,
      state: stadium.state || '',
      capacity: stadium.capacity?.toString() || '',
      description: stadium.description || '',
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this stadium?')) {
      try {
        await apiService.stadiums?.delete(id)
        refetch()
      } catch (error) {
        console.error('Error deleting stadium:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stadiums</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage league stadiums</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingStadium(null); setImageFile(null); setFormData({ name: '', city: '', state: '', capacity: '', description: '' }) }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Stadium
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingStadium ? 'Edit Stadium' : 'Add New Stadium'}</DialogTitle>
              <DialogDescription>
                {editingStadium ? 'Update stadium information below. Changes will be saved immediately.' : 'Add a new stadium to the league. Fill in all required fields.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="image">Stadium Image</Label>
                <Input id="image" type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setImageFile(file)
                }} />
              </div>
              <div>
                <Label htmlFor="name">Stadium Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                </div>
              </div>
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <Button type="submit" className="w-full">{editingStadium ? 'Update' : 'Create'} Stadium</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <p>Loading...</p> : ((stadiumsData as any[]) || []).map((stadium: any) => (
          <Card key={stadium.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    {stadium.image ? (
                      <img src={stadium.image} alt={stadium.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Building2 className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{stadium.name}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stadium.city}, {stadium.state}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600 dark:text-gray-400">Capacity:</span> {stadium.capacity ? stadium.capacity.toLocaleString() : 'N/A'}</p>
                <p><span className="text-gray-600 dark:text-gray-400">Teams:</span> {stadium._count?.teams || 0}</p>
                {stadium.description && <p className="text-gray-600 dark:text-gray-400">{stadium.description}</p>}
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <Button size="sm" variant="ghost" onClick={() => handleEdit(stadium)}><Edit className="w-4 h-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(stadium.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
