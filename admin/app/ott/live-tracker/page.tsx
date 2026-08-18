"use client"

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, Play } from 'lucide-react'

export default function LiveTrackerPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formData, setFormData] = useState({
    matchId: '',
    eventType: '',
    timestamp: '',
    description: '',
  })

  const eventTypes = ['Raid', 'Tackle', 'All Out', 'Super Raid', 'Super Tackle', 'Do or Die', 'Review']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement API call to save live tracker event
    console.log('Form data:', formData)
    setIsDialogOpen(false)
    setEditingItem(null)
    setFormData({ matchId: '', eventType: '', timestamp: '', description: '' })
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setFormData({
      matchId: item.matchId,
      eventType: item.eventType,
      timestamp: item.timestamp,
      description: item.description,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      // TODO: Implement API call to delete
      console.log('Delete:', id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Live Tracker</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Track live match events in real-time</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingItem(null); setFormData({ matchId: '', eventType: '', timestamp: '', description: '' }) }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Event' : 'Add New Event'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update event information below.' : 'Add a new live match event.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="matchId">Match ID</Label>
                <Input id="matchId" value={formData.matchId} onChange={(e) => setFormData({ ...formData, matchId: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="eventType">Event Type</Label>
                <select
                  id="eventType"
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select event type</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="timestamp">Timestamp</Label>
                <Input id="timestamp" type="time" value={formData.timestamp} onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })} required />
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
              <Button type="submit" className="w-full">{editingItem ? 'Update' : 'Create'} Event</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventTypes.map((type, index) => (
          <Card key={type}>
            <CardHeader>
              <CardTitle className="text-lg">{type}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Track {type.toLowerCase()} events during live matches</p>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="ghost" onClick={() => handleEdit({ id: index, matchId: '', eventType: type, timestamp: '', description: '' })}>
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
