"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Save, Plus, Trash2 } from 'lucide-react'

interface Team {
  id: string
  name: string
  shortName: string
}

interface UpcomingMatch {
  id: string
  teamAId: string
  teamBId: string
  matchDate: string
  matchTime: string
  venue: string
  leagueStage: string
  isActive: boolean
  displayOrder: number
}

export default function UpcomingMatchesPage() {
  const [matches, setMatches] = useState<UpcomingMatch[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMatches()
    fetchTeams()
  }, [])

  const fetchMatches = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ott/upcoming-matches`)
      const data = await response.json()
      if (data.success) {
        setMatches(data.data)
      }
    } catch (error) {
      console.error('Error fetching matches:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams?limit=100&isActive=true`)
      const data = await response.json()
      if (data.success) {
        setTeams(data.data.filter((team: any) => !team.name.includes('HIDDEN')))
      }
    } catch (error) {
      console.error('Error fetching teams:', error)
    }
  }

  const handleAddMatch = () => {
    setMatches([...matches, {
      id: '',
      teamAId: '',
      teamBId: '',
      matchDate: '',
      matchTime: '',
      venue: '',
      leagueStage: 'League Stage',
      isActive: true,
      displayOrder: matches.length
    }])
  }

  const handleRemoveMatch = (index: number) => {
    const updated = matches.filter((_, i) => i !== index)
    setMatches(updated)
  }

  const handleUpdateMatch = (index: number, field: keyof UpcomingMatch, value: any) => {
    const updated = [...matches]
    updated[index] = { ...updated[index], [field]: value }
    setMatches(updated)
  }

  const handleSave = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken')
      
      for (const match of matches) {
        if (match.id) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ott/upcoming-matches/${match.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${adminToken}`,
            },
            body: JSON.stringify(match),
          })
        } else if (match.teamAId && match.teamBId && match.matchDate) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ott/upcoming-matches`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${adminToken}`,
            },
            body: JSON.stringify(match),
          })
        }
      }
      
      await fetchMatches()
      alert('Matches saved successfully!')
    } catch (error) {
      console.error('Error saving matches:', error)
      alert('Failed to save matches')
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Upcoming Matches</h1>
        <div className="flex space-x-2">
          <Button onClick={handleAddMatch}>
            <Plus className="w-4 h-4 mr-2" />
            Add Match
          </Button>
          <Button className="bg-gradient-to-r from-[#BFA253] to-[#8B5A2B] hover:from-[#8B5A2B] hover:to-[#BFA253]" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save All
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {matches.map((match, index) => (
          <Card key={index}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Match #{index + 1}</h3>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveMatch(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Team A</Label>
                  <Select value={match.teamAId} onValueChange={(value) => handleUpdateMatch(index, 'teamAId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Team A" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name.replace(/ Team$/, '')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Team B</Label>
                  <Select value={match.teamBId} onValueChange={(value) => handleUpdateMatch(index, 'teamBId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Team B" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name.replace(/ Team$/, '')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Match Date</Label>
                  <Input
                    type="date"
                    value={match.matchDate}
                    onChange={(e) => handleUpdateMatch(index, 'matchDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Match Time</Label>
                  <Input
                    type="time"
                    value={match.matchTime}
                    onChange={(e) => handleUpdateMatch(index, 'matchTime', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Venue</Label>
                  <Input
                    value={match.venue}
                    onChange={(e) => handleUpdateMatch(index, 'venue', e.target.value)}
                    placeholder="e.g., Pune"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>League Stage</Label>
                  <Select value={match.leagueStage} onValueChange={(value) => handleUpdateMatch(index, 'leagueStage', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="League Stage">League Stage</SelectItem>
                      <SelectItem value="Semi Final">Semi Final</SelectItem>
                      <SelectItem value="Final">Final</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={match.displayOrder}
                    onChange={(e) => handleUpdateMatch(index, 'displayOrder', parseInt(e.target.value))}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id={`active-${index}`}
                    checked={match.isActive}
                    onChange={(e) => handleUpdateMatch(index, 'isActive', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor={`active-${index}`}>Active</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
