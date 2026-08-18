"use client"

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, Target } from 'lucide-react'

export default function RaidTrackerPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formData, setFormData] = useState({
    matchId: '',
    raiderId: '',
    defenderId: '',
    raidType: '',
    points: 0,
    timestamp: '',
  })

  const raidTypes = ['Successful Raid', 'Unsuccessful Raid', 'Super Raid', 'Do or Die Raid', 'Empty Raid']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement API call to save raid tracker data
    console.log('Form data:', formData)
    setIsDialogOpen(false)
    setEditingItem(null)
    setFormData({ matchId: '', raiderId: '', defenderId: '', raidType: '', points: 0, timestamp: '' })
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setFormData({
      matchId: item.matchId,
      raiderId: item.raiderId,
      defenderId: item.defenderId,
      raidType: item.raidType,
      points: item.points,
      timestamp: item.timestamp,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this raid?')) {
      // TODO: Implement API call to delete
      console.log('Delete:', id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Raid Tracker</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Track raid statistics during live matches</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingItem(null); setFormData({ matchId: '', raiderId: '', defenderId: '', raidType: '', points: 0, timestamp: '' }) }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Raid
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Raid' : 'Add New Raid'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update raid information below.' : 'Add a new raid to track during the match.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="matchId">Match ID</Label>
                <Input id="matchId" value={formData.matchId} onChange={(e) => setFormData({ ...formData, matchId: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="raiderId">Raider ID</Label>
                <Input id="raiderId" value={formData.raiderId} onChange={(e) => setFormData({ ...formData, raiderId: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="defenderId">Defender ID</Label>
                <Input id="defenderId" value={formData.defenderId} onChange={(e) => setFormData({ ...formData, defenderId: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="raidType">Raid Type</Label>
                <select
                  id="raidType"
                  value={formData.raidType}
                  onChange={(e) => setFormData({ ...formData, raidType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select raid type</option>
                  {raidTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="points">Points</Label>
                <Input id="points" type="number" value={formData.points} onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <Label htmlFor="timestamp">Timestamp</Label>
                <Input id="timestamp" type="time" value={formData.timestamp} onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })} required />
              </div>
              <Button type="submit" className="w-full">{editingItem ? 'Update' : 'Create'} Raid</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Raid Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {raidTypes.map((type, index) => (
          <Card key={type}>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <CardTitle className="text-lg">{type}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Track {type.toLowerCase()} events</p>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="ghost" onClick={() => handleEdit({ id: index, matchId: '', raiderId: '', defenderId: '', raidType: type, points: 0, timestamp: '' })}>
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
