"use client"

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, User } from 'lucide-react'

export default function PlayerStatsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formData, setFormData] = useState({
    playerId: '',
    matchId: '',
    raids: 0,
    tackles: 0,
    points: 0,
    superRaids: 0,
    superTackles: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement API call to save player stats
    console.log('Form data:', formData)
    setIsDialogOpen(false)
    setEditingItem(null)
    setFormData({ playerId: '', matchId: '', raids: 0, tackles: 0, points: 0, superRaids: 0, superTackles: 0 })
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setFormData({
      playerId: item.playerId,
      matchId: item.matchId,
      raids: item.raids,
      tackles: item.tackles,
      points: item.points,
      superRaids: item.superRaids,
      superTackles: item.superTackles,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete these stats?')) {
      // TODO: Implement API call to delete
      console.log('Delete:', id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Player Stats</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage player statistics for matches</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingItem(null); setFormData({ playerId: '', matchId: '', raids: 0, tackles: 0, points: 0, superRaids: 0, superTackles: 0 }) }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Stats
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Stats' : 'Add New Stats'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update player statistics below.' : 'Add new player statistics for a match.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="playerId">Player ID</Label>
                <Input id="playerId" value={formData.playerId} onChange={(e) => setFormData({ ...formData, playerId: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="matchId">Match ID</Label>
                <Input id="matchId" value={formData.matchId} onChange={(e) => setFormData({ ...formData, matchId: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="raids">Raids</Label>
                  <Input id="raids" type="number" value={formData.raids} onChange={(e) => setFormData({ ...formData, raids: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <Label htmlFor="tackles">Tackles</Label>
                  <Input id="tackles" type="number" value={formData.tackles} onChange={(e) => setFormData({ ...formData, tackles: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <Label htmlFor="points">Points</Label>
                  <Input id="points" type="number" value={formData.points} onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <Label htmlFor="superRaids">Super Raids</Label>
                  <Input id="superRaids" type="number" value={formData.superRaids} onChange={(e) => setFormData({ ...formData, superRaids: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <Label htmlFor="superTackles">Super Tackles</Label>
                  <Input id="superTackles" type="number" value={formData.superTackles} onChange={(e) => setFormData({ ...formData, superTackles: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <Button type="submit" className="w-full">{editingItem ? 'Update' : 'Create'} Stats</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['Raids', 'Tackles', 'Points', 'Super Raids', 'Super Tackles'].map((stat, index) => (
          <Card key={stat}>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <CardTitle className="text-lg">{stat}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Track player {stat.toLowerCase()} statistics</p>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="ghost" onClick={() => handleEdit({ id: index, playerId: '', matchId: '', raids: 0, tackles: 0, points: 0, superRaids: 0, superTackles: 0 })}>
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
