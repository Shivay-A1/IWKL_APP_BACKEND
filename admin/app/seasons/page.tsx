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
import { Plus, Edit, Trash2, Calendar } from 'lucide-react'

export default function SeasonsPage() {
  const { data: seasonsData, loading, refetch } = useData(() => apiService.seasons.getAll())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSeason, setEditingSeason] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    year: new Date().getFullYear(),
    startDate: '',
    endDate: '',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      }
      
      if (editingSeason) {
        await apiService.seasons.update(editingSeason.id, payload)
      } else {
        await apiService.seasons.create(payload)
      }
      setIsDialogOpen(false)
      setEditingSeason(null)
      setFormData({ name: '', year: new Date().getFullYear(), startDate: '', endDate: '', description: '' })
      refetch()
    } catch (error) {
      console.error('Error saving season:', error)
    }
  }

  const handleEdit = (season: any) => {
    setEditingSeason(season)
    setFormData({
      name: season.name,
      year: season.year,
      startDate: season.startDate.split('T')[0],
      endDate: season.endDate.split('T')[0],
      description: season.description || '',
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this season?')) {
      try {
        await apiService.seasons.delete(id)
        refetch()
      } catch (error) {
        console.error('Error deleting season:', error)
      }
    }
  }

  const handleSetActive = async (id: string) => {
    try {
      await apiService.seasons.setActive(id)
      refetch()
    } catch (error) {
      console.error('Error setting active season:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Seasons</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage league seasons
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingSeason(null); setFormData({ name: '', year: new Date().getFullYear(), startDate: '', endDate: '', description: '' }) }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Season
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSeason ? 'Edit Season' : 'Add New Season'}</DialogTitle>
              <DialogDescription>
                {editingSeason ? 'Update season information below. Changes will be saved immediately.' : 'Add a new season to the league. Fill in all required fields.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Season Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingSeason ? 'Update' : 'Create'} Season
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading...</p>
        ) : ((seasonsData as any)?.data || (seasonsData as any[]))?.map((season: any) => (
          <Card key={season.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{season.name}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{season.year}</p>
                  </div>
                </div>
                {season.isActive && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Active
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-600 dark:text-gray-400">Start:</span>{' '}
                  {new Date(season.startDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="text-gray-600 dark:text-gray-400">End:</span>{' '}
                  {new Date(season.endDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="text-gray-600 dark:text-gray-400">Teams:</span>{' '}
                  {season._count?.teams || 0}
                </p>
                <p>
                  <span className="text-gray-600 dark:text-gray-400">Matches:</span>{' '}
                  {season._count?.matches || 0}
                </p>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                {!season.isActive && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSetActive(season.id)}
                  >
                    Set Active
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEdit(season)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(season.id)}
                >
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
