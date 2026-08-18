"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiService } from '@/lib/api'
import { Trash2, Edit, Plus, Upload } from 'lucide-react'

export default function LeadershipManagementPage() {
  const [leadership, setLeadership] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    description: '',
    photo: '',
    order: 0,
    isActive: true,
  })

  useEffect(() => {
    fetchLeadership()
  }, [])

  const fetchLeadership = async () => {
    try {
      const response = await apiService.leadership.getAll()
      setLeadership((response as any)?.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch leadership:', error)
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingItem(null)
    setPhotoFile(null)
    setFormData({
      name: '',
      designation: '',
      description: '',
      photo: '',
      order: 0,
      isActive: true,
    })
    setShowModal(true)
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setPhotoFile(null)
    setFormData({
      name: item.name,
      designation: item.designation,
      description: item.description,
      photo: item.photo,
      order: item.order,
      isActive: item.isActive,
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this leadership member?')) return

    try {
      await apiService.leadership.delete(id)
      fetchLeadership()
    } catch (error) {
      console.error('Failed to delete leadership:', error)
      alert('Failed to delete leadership member')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('designation', formData.designation)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('order', formData.order.toString())
      formDataToSend.append('isActive', formData.isActive.toString())
      
      if (photoFile) {
        formDataToSend.append('photo', photoFile)
      } else if (formData.photo) {
        formDataToSend.append('photo', formData.photo)
      }

      if (editingItem) {
        await apiService.leadership.update(editingItem.id, formDataToSend)
      } else {
        await apiService.leadership.create(formDataToSend)
      }
      setShowModal(false)
      setEditingItem(null)
      setPhotoFile(null)
      fetchLeadership()
    } catch (error) {
      console.error('Failed to save leadership:', error)
      alert('Failed to save leadership member')
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      setFormData({ ...formData, photo: URL.createObjectURL(file) })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Leadership Management</h1>
        <Button onClick={handleAdd} className="bg-[#7A3D92] text-white hover:bg-[#652F7A]">
          <Plus className="w-4 h-4 mr-2" />
          Add Leadership Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leadership.map((item) => (
          <div key={item.id} className="bg-[#652F7A] rounded-lg p-6 relative">
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button
                onClick={() => handleEdit(item)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-[#7A3D92]"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => handleDelete(item.id)}
                variant="ghost"
                size="sm"
                className="text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-col items-center">
              {item.photo && (
                <img
                  src={item.photo}
                  alt={item.name}
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
              )}
              <h3 className="text-xl font-bold text-white text-center">{item.name}</h3>
              <p className="text-[#7A3D92] text-center">{item.designation}</p>
              <p className="text-white/70 text-sm text-center mt-2 line-clamp-3">
                {item.description}
              </p>
              <div className="mt-4 flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs ${item.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {item.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="text-white/50 text-xs">Order: {item.order}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {leadership.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/50">No leadership members found. Add your first one!</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2B123A] rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingItem ? 'Edit Leadership Member' : 'Add Leadership Member'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-[#652F7A] border-white/20 text-white"
                />
              </div>

              <div>
                <Label htmlFor="designation" className="text-white">Designation *</Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  required
                  className="bg-[#652F7A] border-white/20 text-white"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-white">Description *</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full min-h-[200px] px-3 py-2 border rounded-md bg-[#652F7A] border-white/20 text-white"
                />
              </div>

              <div>
                <Label htmlFor="photo" className="text-white">Photo</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="bg-[#652F7A] border-white/20 text-white"
                  />
                  {formData.photo && (
                    <img
                      src={formData.photo}
                      alt="Preview"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="order" className="text-white">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="bg-[#652F7A] border-white/20 text-white"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="isActive" className="text-white">Active</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowModal(false)}
                  variant="ghost"
                  className="text-white hover:bg-[#652F7A]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#7A3D92] text-white hover:bg-[#652F7A]"
                >
                  {editingItem ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
