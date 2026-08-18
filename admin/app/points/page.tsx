"use client"

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useData } from '@/lib/hooks'
import { apiService } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trophy, Edit, Save } from 'lucide-react'

export default function PointsTablePage() {
  const { data: pointsData, loading, refetch } = useData(() => apiService.points.getTable())
  // Extract array from response if wrapped in { data: [] }
  const rawPointsData = Array.isArray((pointsData as any)?.data) ? (pointsData as any).data : (Array.isArray(pointsData) ? pointsData : [])
  // Backend already filters inactive teams - no client-side filtering needed
  const filteredPointsData = rawPointsData
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<any>(null)
  const [formData, setFormData] = useState({
    rank: 0,
    matchesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    points: 0,
    scoreFor: 0,
    scoreAgainst: 0,
    scoreDifference: 0,
    highestScore: 0,
    recentForm: '',
  })

  const handleRecalculate = async () => {
    if (confirm('Are you sure you want to recalculate the points table?')) {
      try {
        const activeSeason = await apiService.seasons.getAll()
        const season = activeSeason.data?.data?.find((s: any) => s.isActive)
        if (season) {
          await apiService.points.recalculate(season.id)
          refetch()
        }
      } catch (error) {
        console.error('Error recalculating points table:', error)
      }
    }
  }

  const handleEdit = (entry: any) => {
    setEditingEntry(entry)
    setFormData({
      rank: entry.rank,
      matchesPlayed: entry.matchesPlayed,
      wins: entry.wins,
      losses: entry.losses,
      draws: entry.draws || 0,
      points: entry.points,
      scoreFor: entry.scoreFor,
      scoreAgainst: entry.scoreAgainst,
      scoreDifference: entry.scoreDifference,
      highestScore: entry.highestScore || 0,
      recentForm: entry.recentForm || '',
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiService.points.update(editingEntry.id, formData)
      setIsDialogOpen(false)
      setEditingEntry(null)
      refetch()
    } catch (error) {
      console.error('Error updating points entry:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Points Table</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Live league standings</p>
        </div>
        <Button onClick={handleRecalculate}>
          <Trophy className="w-4 h-4 mr-2" />
          Recalculate
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="text-center">Matches</TableHead>
                <TableHead className="text-center">Wins</TableHead>
                <TableHead className="text-center">Losses</TableHead>
                <TableHead className="text-center">Draws</TableHead>
                <TableHead className="text-center">Highest Score</TableHead>
                <TableHead className="text-center">Points</TableHead>
                <TableHead className="text-center">Score For</TableHead>
                <TableHead className="text-center">Score Against</TableHead>
                <TableHead className="text-center">Diff</TableHead>
                <TableHead className="text-center">Form</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={13} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : (filteredPointsData as any[])?.map((entry: any) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-bold">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${entry.rank <= 3 ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      {entry.rank}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        {entry.team.logo ? (
                          <img src={entry.team.logo} alt={entry.team.name.replace(/ Team$/, '')} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Trophy className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <span className="font-semibold">{entry.team.name.replace(/ Team$/, '')}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{entry.matchesPlayed}</TableCell>
                  <TableCell className="text-center text-green-600 font-semibold">{entry.wins}</TableCell>
                  <TableCell className="text-center text-red-600">{entry.losses}</TableCell>
                  <TableCell className="text-center">{entry.draws || 0}</TableCell>
                  <TableCell className="text-center">{entry.highestScore || 0}</TableCell>
                  <TableCell className="text-center font-bold text-primary">{entry.points}</TableCell>
                  <TableCell className="text-center">{entry.scoreFor}</TableCell>
                  <TableCell className="text-center">{entry.scoreAgainst}</TableCell>
                  <TableCell className="text-center font-semibold">{entry.scoreDifference}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
                      {entry.recentForm ? entry.recentForm.split('').map((form: string, i: number) => (
                        <span
                          key={i}
                          className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${
                            form === 'W' ? 'bg-green-500 text-white' :
                            form === 'L' ? 'bg-red-500 text-white' :
                            'bg-gray-500 text-white'
                          }`}
                        >
                          {form}
                        </span>
                      )) : '-'}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(entry)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Points Entry - {editingEntry?.team?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rank">Rank</Label>
                <Input id="rank" type="number" value={formData.rank} onChange={(e) => setFormData({ ...formData, rank: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <Label htmlFor="matchesPlayed">Matches Played</Label>
                <Input id="matchesPlayed" type="number" value={formData.matchesPlayed} onChange={(e) => setFormData({ ...formData, matchesPlayed: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <Label htmlFor="wins">Wins</Label>
                <Input id="wins" type="number" value={formData.wins} onChange={(e) => setFormData({ ...formData, wins: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <Label htmlFor="losses">Losses</Label>
                <Input id="losses" type="number" value={formData.losses} onChange={(e) => setFormData({ ...formData, losses: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <Label htmlFor="draws">Draws</Label>
                <Input id="draws" type="number" value={formData.draws} onChange={(e) => setFormData({ ...formData, draws: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <Label htmlFor="points">Points</Label>
                <Input id="points" type="number" value={formData.points} onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <Label htmlFor="scoreFor">Score For</Label>
                <Input id="scoreFor" type="number" value={formData.scoreFor} onChange={(e) => setFormData({ ...formData, scoreFor: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <Label htmlFor="scoreAgainst">Score Against</Label>
                <Input id="scoreAgainst" type="number" value={formData.scoreAgainst} onChange={(e) => setFormData({ ...formData, scoreAgainst: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <Label htmlFor="highestScore">Highest Score</Label>
                <Input id="highestScore" type="number" value={formData.highestScore} onChange={(e) => setFormData({ ...formData, highestScore: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <Label htmlFor="recentForm">Recent Form</Label>
                <Input id="recentForm" value={formData.recentForm} onChange={(e) => setFormData({ ...formData, recentForm: e.target.value })} placeholder="WWLWL" />
              </div>
            </div>
            <div>
              <Label htmlFor="scoreDifference">Score Difference</Label>
              <Input id="scoreDifference" type="number" value={formData.scoreDifference} onChange={(e) => setFormData({ ...formData, scoreDifference: parseInt(e.target.value) || 0 })} />
            </div>
            <Button type="submit" className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Update Entry
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
