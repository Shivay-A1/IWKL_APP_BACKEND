"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Play, Pause, RotateCcw, Redo, Plus, Minus, History, User, Flag, ArrowLeft, Trash2 } from 'lucide-react'

interface Team {
  id: string
  name: string
  shortName: string
  logo: string
}

interface LiveMatch {
  id: string
  teamAId: string
  teamBId: string
  teamA: Team
  teamB: Team
  leagueStage: string
  venue: string
  matchDate: string
  matchTime: string
  status: string
  teamAScore: number
  teamBScore: number
  timer: string
  half: string
  isPaused: boolean
}

interface PointHistory {
  id: string
  matchId: string
  teamAScore: number
  teamBScore: number
  newTeamAScore: number
  newTeamBScore: number
  pointsType: string
  description: string
  timestamp: string
}

interface PlayerStats {
  id: string
  matchId: string
  playerName: string
  team: string
  raids: number
  tackles: number
  points: number
  superRaids: number
  superTackles: number
}

export default function OTTLiveMatchPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([])
  const [selectedMatchId, setSelectedMatchId] = useState('')
  const [loading, setLoading] = useState(true)
  
  const [matchStatus, setMatchStatus] = useState<'live' | 'upcoming' | 'completed'>('live')
  const [isPaused, setIsPaused] = useState(false)
  const [timer, setTimer] = useState('18:45')
  const [half, setHalf] = useState('2nd Half')
  const [teamAScore, setTeamAScore] = useState(26)
  const [teamBScore, setTeamBScore] = useState(22)
  const [teamAId, setTeamAId] = useState('')
  const [teamBId, setTeamBId] = useState('')
  const [leagueStage, setLeagueStage] = useState('League Stage')
  const [venue, setVenue] = useState('')
  const [matchDate, setMatchDate] = useState('')
  const [matchTime, setMatchTime] = useState('')
  
  // New state variables
  const [pointHistory, setPointHistory] = useState<PointHistory[]>([])
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([])
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)
  const [showPlayerStatsDialog, setShowPlayerStatsDialog] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [playerFormData, setPlayerFormData] = useState({
    playerName: '',
    team: 'A',
    raids: 0,
    tackles: 0,
    points: 0,
    superRaids: 0,
    superTackles: 0
  })

  useEffect(() => {
    fetchTeams()
    fetchLiveMatches()
    
    // Only set up polling if no match is selected
    // Once a match is selected, we don't want polling to interfere
    const interval = setInterval(() => {
      if (!selectedMatchId) {
        fetchLiveMatches()
      }
    }, 5000) // Refresh every 5 seconds
    
    return () => clearInterval(interval)
  }, [selectedMatchId])

  useEffect(() => {
    if (selectedMatchId) {
      fetchPointHistory()
      fetchPlayerStats()
    }
  }, [selectedMatchId])

  // Timer countdown effect
  useEffect(() => {
    if (!isPaused && selectedMatchId) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          const [mins, secs] = prevTimer.split(':').map(Number)
          const newSecs = secs - 1
          if (newSecs < 0 && mins > 0) {
            return `${String(mins - 1).padStart(2, '0')}:59`
          } else if (newSecs < 0 && mins === 0) {
            // Timer reached 00:00, pause it
            setIsPaused(true)
            return '00:00'
          } else {
            return `${String(mins).padStart(2, '0')}:${String(newSecs).padStart(2, '0')}`
          }
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isPaused, selectedMatchId])

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams?limit=100&isActive=true`)
      const data = await response.json()
      console.log('Teams response:', data)
      if (data.success) {
        setTeams(data.data.filter((team: any) => !team.name.includes('HIDDEN')))
      } else {
        console.error('Teams API returned error:', data)
      }
    } catch (error) {
      console.error('Error fetching teams:', error)
    }
  }

  const fetchLiveMatches = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ott/live-matches`)
      if (!response.ok) {
        console.error('Live matches response not ok:', response.status)
        return
      }
      const data = await response.json()
      console.log('Live matches response:', data)
      if (data.success && data.data) {
        setLiveMatches(data.data)
        // Only auto-select if no match is currently selected
        if (data.data.length > 0 && !selectedMatchId) {
          const liveMatch = data.data[0]
          setSelectedMatchId(liveMatch.id)
          setTeamAId(liveMatch.teamAId)
          setTeamBId(liveMatch.teamBId)
          setLeagueStage(liveMatch.leagueStage)
          setVenue(liveMatch.venue || '')
          setMatchDate(liveMatch.matchDate)
          setMatchTime(liveMatch.matchTime)
          setMatchStatus(liveMatch.status as any)
          setTeamAScore(liveMatch.teamAScore)
          setTeamBScore(liveMatch.teamBScore)
          setTimer(liveMatch.timer || '00:00')
          setHalf(liveMatch.half || '1st Half')
          setIsPaused(liveMatch.isPaused)
        }
        // If a match is selected, only update the list, don't touch any state
        // This completely prevents timer and score from being reset by the polling
      }
    } catch (error) {
      console.error('Error fetching live matches:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMatch = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ott/live-matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          teamAId,
          teamBId,
          leagueStage,
          venue,
          matchDate: matchDate ? new Date(matchDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          matchTime,
        }),
      })
      const data = await response.json()
      if (data.success) {
        // Reset scores when new match is created
        setTeamAScore(0)
        setTeamBScore(0)
        setTimer('00:00')
        setHalf('1st Half')
        setMatchStatus('live')
        setPointHistory([])
        setPlayerStats([])
        // Set the new match as selected immediately
        setSelectedMatchId(data.data.id)
        // Then fetch live matches to update the list
        await fetchLiveMatches()
        alert('Match created successfully!')
      }
    } catch (error) {
      console.error('Error creating match:', error)
      alert('Failed to create match')
    }
  }

  const handleDeleteMatch = async (matchId: string) => {
    if (confirm('Are you sure you want to delete this match?')) {
      try {
        const adminToken = localStorage.getItem('adminToken')
        if (!adminToken) {
          alert('Admin token not found. Please login again.')
          return
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ott/live-matches/${matchId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`,
          },
        })
        const data = await response.json()
        if (data.success) {
          await fetchLiveMatches()
          if (selectedMatchId === matchId) {
            setSelectedMatchId('')
            setTeamAScore(0)
            setTeamBScore(0)
          }
          alert('Match deleted successfully!')
        } else {
          alert('Failed to delete match: ' + (data.error || 'Unknown error'))
        }
      } catch (error) {
        console.error('Error deleting match:', error)
        alert('Failed to delete match')
      }
    }
  }

  const handleScoreUpdate = async (team: 'A' | 'B', action: string, pointsType?: string) => {
    let newScoreA = teamAScore
    let newScoreB = teamBScore

    if (team === 'A') {
      if (action === '+1') newScoreA = teamAScore + 1
      if (action === '+2') newScoreA = teamAScore + 2
      if (action === '-1') newScoreA = Math.max(0, teamAScore - 1)
      setTeamAScore(newScoreA)
    } else {
      if (action === '+1') newScoreB = teamBScore + 1
      if (action === '+2') newScoreB = teamBScore + 2
      if (action === '-1') newScoreB = Math.max(0, teamBScore - 1)
      setTeamBScore(newScoreB)
    }

    // Send real-time update via API
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ott/score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId: selectedMatchId,
          teamAScore: newScoreA,
          teamBScore: newScoreB,
          pointsType: pointsType || 'manual_update',
          description: `${team} ${action} ${pointsType || 'score update'}`
        }),
      })
      console.log('Score update response:', await response.json())
      await fetchPointHistory()
    } catch (error) {
      console.error('Failed to update score:', error)
    }
  }

  const handleTimerUpdate = async () => {
    if (!selectedMatchId) {
      console.error('No match selected for timer update')
      return
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ott/timer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId: selectedMatchId,
          timer,
          half,
          isPaused,
        }),
      })
      const data = await response.json()
      console.log('Timer update response:', data)
      if (!data.success) {
        console.error('Timer update failed:', data.error)
      }
    } catch (error) {
      console.error('Failed to update timer:', error)
    }
  }

  const handleStatusUpdate = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ott/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId: selectedMatchId,
          status: matchStatus,
        }),
      })
      console.log('Status update response:', await response.json())
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const handleCompleteMatch = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ott/complete-match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          matchId: selectedMatchId,
          finalScoreA: teamAScore,
          finalScoreB: teamBScore,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setMatchStatus('completed')
        setShowCompleteDialog(false)
        alert('Match completed successfully!')
        await fetchLiveMatches()
      }
    } catch (error) {
      console.error('Failed to complete match:', error)
      alert('Failed to complete match')
    }
  }

  const handleRollback = async (historyId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ott/rollback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId: selectedMatchId,
          historyId,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setTeamAScore(data.data.teamAScore)
        setTeamBScore(data.data.teamBScore)
        await fetchPointHistory()
        alert('Score rolled back successfully!')
      }
    } catch (error) {
      console.error('Failed to rollback score:', error)
      alert('Failed to rollback score')
    }
  }

  const fetchPointHistory = async () => {
    if (!selectedMatchId) return
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ott/score-history/${selectedMatchId}`)
      const data = await response.json()
      if (data.success) {
        setPointHistory(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch point history:', error)
    }
  }

  const fetchPlayerStats = async () => {
    if (!selectedMatchId) return
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ott/player-stats/${selectedMatchId}`)
      const data = await response.json()
      if (data.success) {
        setPlayerStats(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch player stats:', error)
    }
  }

  const handlePlayerStatsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const adminToken = localStorage.getItem('adminToken')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ott/player-stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          matchId: selectedMatchId,
          ...playerFormData,
        }),
      })
      const data = await response.json()
      if (data.success) {
        await fetchPlayerStats()
        setShowPlayerStatsDialog(false)
        setPlayerFormData({
          playerName: '',
          team: 'A',
          raids: 0,
          tackles: 0,
          points: 0,
          superRaids: 0,
          superTackles: 0
        })
        alert('Player stats updated successfully!')
      }
    } catch (error) {
      console.error('Failed to update player stats:', error)
      alert('Failed to update player stats')
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">OTT Live Match Controls</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={fetchLiveMatches}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Match Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900">Select Match</CardTitle>
            <Button 
              size="sm" 
              onClick={() => {
                setTeamAId('')
                setTeamBId('')
                setLeagueStage('League Stage')
                setVenue('')
                setMatchDate(new Date().toISOString().split('T')[0])
                setMatchTime('')
                setSelectedMatchId('')
                setTeamAScore(0)
                setTeamBScore(0)
                setTimer('00:00')
                setHalf('1st Half')
                setMatchStatus('live')
              }}
              className="text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Match
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-900 dark:text-gray-100 mb-2 block">Live Matches</Label>
              <div className="space-y-2">
                {liveMatches.filter(m => m.status === 'live').map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-300 dark:border-green-700">
                    <div 
                      className={`flex-1 cursor-pointer ${selectedMatchId === match.id ? 'font-bold text-blue-600' : ''}`}
                      onClick={() => {
                        setSelectedMatchId(match.id)
                        setTeamAScore(match.teamAScore)
                        setTeamBScore(match.teamBScore)
                        setTimer(match.timer || '00:00')
                        setHalf(match.half || '1st Half')
                        setMatchStatus(match.status as 'live' | 'upcoming' | 'completed')
                        setTeamAId(match.teamAId)
                        setTeamBId(match.teamBId)
                      }}
                    >
                      {match.teamA.name} vs {match.teamB.name} - {match.status}
                    </div>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeleteMatch(match.id)}
                      className="text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {liveMatches.filter(m => m.status === 'live').length === 0 && (
                  <p className="text-gray-500 text-center py-2">No live matches</p>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm text-gray-900 dark:text-gray-100 mb-2 block">Upcoming Matches</Label>
              <div className="space-y-2">
                {liveMatches.filter(m => m.status === 'upcoming').map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-300 dark:border-blue-700">
                    <div 
                      className={`flex-1 cursor-pointer ${selectedMatchId === match.id ? 'font-bold text-blue-600' : ''}`}
                      onClick={() => {
                        setSelectedMatchId(match.id)
                        setTeamAScore(match.teamAScore)
                        setTeamBScore(match.teamBScore)
                        setTimer(match.timer || '00:00')
                        setHalf(match.half || 'Not Started')
                        setMatchStatus(match.status as 'live' | 'upcoming' | 'completed')
                        setTeamAId(match.teamAId)
                        setTeamBId(match.teamBId)
                      }}
                    >
                      {match.teamA.name} vs {match.teamB.name} - {match.matchDate} {match.matchTime}
                    </div>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeleteMatch(match.id)}
                      className="text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {liveMatches.filter(m => m.status === 'upcoming').length === 0 && (
                  <p className="text-gray-500 text-center py-2">No upcoming matches</p>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm text-gray-900 dark:text-gray-100 mb-2 block">Completed Matches</Label>
              <div className="space-y-2">
                {liveMatches.filter(m => m.status === 'completed').map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div 
                      className={`flex-1 cursor-pointer ${selectedMatchId === match.id ? 'font-bold text-blue-600' : ''}`}
                      onClick={() => {
                        setSelectedMatchId(match.id)
                        setTeamAScore(match.teamAScore)
                        setTeamBScore(match.teamBScore)
                        setTimer(match.timer || '00:00')
                        setHalf(match.half || 'Completed')
                        setMatchStatus(match.status as 'live' | 'upcoming' | 'completed')
                        setTeamAId(match.teamAId)
                        setTeamBId(match.teamBId)
                      }}
                    >
                      {match.teamA.name} vs {match.teamB.name} - {match.teamAScore}-{match.teamBScore} (Completed)
                    </div>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeleteMatch(match.id)}
                      className="text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {liveMatches.filter(m => m.status === 'completed').length === 0 && (
                  <p className="text-gray-500 text-center py-2">No completed matches</p>
                )}
              </div>
            </div>
            {liveMatches.length === 0 && (
              <p className="text-gray-500 text-center py-4">No matches available. Create a new match to get started.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Match Setup */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900">Match Setup</CardTitle>
            {selectedMatchId && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => setShowCompleteDialog(true)}
                className="text-white"
              >
                <Flag className="w-4 h-4 mr-2" />
                Complete Match
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-900">Team A</Label>
              <Select value={teamAId} onValueChange={setTeamAId}>
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
              <Label className="text-gray-900">Team B</Label>
              <Select value={teamBId} onValueChange={setTeamBId}>
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
              <Label className="text-gray-900">League Stage</Label>
              <Select value={leagueStage} onValueChange={setLeagueStage}>
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
              <Label className="text-gray-900">Venue</Label>
              <Input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="e.g., Pune" />
            </div>
            <div>
              <Label className="text-white">Match Date</Label>
              <Input 
                type="date" 
                value={matchDate} 
                onChange={(e) => setMatchDate(e.target.value)} 
                className="text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-900">Match Time</Label>
              <Input type="time" value={matchTime} onChange={(e) => setMatchTime(e.target.value)} />
            </div>
            <div>
              <Label className="text-gray-900">Match Status</Label>
              <Select value={matchStatus} onValueChange={(v: any) => setMatchStatus(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleCreateMatch} className="w-full">
            Create Match
          </Button>
        </CardContent>
      </Card>

      {/* Score Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900">Score Controls</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowHistoryDialog(true)} className="text-white border-white hover:bg-white/10">
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowPlayerStatsDialog(true)} className="text-white border-white hover:bg-white/10">
                <User className="w-4 h-4 mr-2" />
                Player Stats
              </Button>
              {matchStatus === 'live' && selectedMatchId && (
                <Button variant="destructive" size="sm" onClick={() => setShowCompleteDialog(true)} className="text-white">
                  <Flag className="w-4 h-4 mr-2" />
                  Complete Match
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Controls */}
          <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div>
              <Label className="text-sm text-gray-900 dark:text-gray-100">Timer</Label>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{timer}</div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant={isPaused ? "default" : "outline"}
                onClick={() => {
                  setIsPaused(!isPaused)
                  handleTimerUpdate()
                }}
                className="text-white"
              >
                {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button 
                onClick={() => {
                  setTimer('00:00')
                  setIsPaused(true)
                }}
                variant="outline"
                className="text-white border-white hover:bg-white/10"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button 
                onClick={() => {
                  const [mins, secs] = timer.split(':').map(Number)
                  const newSecs = secs + 1
                  const newMins = newSecs >= 60 ? mins + 1 : mins
                  const finalSecs = newSecs >= 60 ? 0 : newSecs
                  setTimer(`${String(newMins).padStart(2, '0')}:${String(finalSecs).padStart(2, '0')}`)
                }}
                variant="outline"
                className="text-white border-white hover:bg-white/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                +1s
              </Button>
              <Button 
                onClick={() => {
                  const [mins, secs] = timer.split(':').map(Number)
                  const newSecs = Math.max(0, secs - 1)
                  setTimer(`${String(mins).padStart(2, '0')}:${String(newSecs).padStart(2, '0')}`)
                }}
                variant="outline"
                className="text-white border-white hover:bg-white/10"
              >
                <Minus className="w-4 h-4 mr-2" />
                -1s
              </Button>
            </div>
          </div>

          {/* Half Time Controls */}
          <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div>
              <Label className="text-sm text-gray-900 dark:text-gray-100">Half</Label>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{half}</div>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={() => {
                  setHalf('1st Half')
                  setTimer('20:00')
                  setIsPaused(true)
                }}
                variant="outline"
                className="text-white border-white hover:bg-white/10"
              >
                1st Half
              </Button>
              <Button 
                onClick={() => {
                  setHalf('Half Time')
                  setIsPaused(true)
                }}
                variant="outline"
                className="text-white border-white hover:bg-white/10"
              >
                Half Time
              </Button>
              <Button 
                onClick={() => {
                  setHalf('2nd Half')
                  setTimer('20:00')
                  setIsPaused(true)
                }}
                variant="outline"
                className="text-white border-white hover:bg-white/10"
              >
                2nd Half
              </Button>
              <Button 
                onClick={() => {
                  setHalf('Extra Time')
                  setTimer('10:00')
                  setIsPaused(true)
                }}
                variant="outline"
                className="text-white border-white hover:bg-white/10"
              >
                Extra Time
              </Button>
            </div>
          </div>

          {/* Team A Score Controls */}
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-300 dark:border-purple-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Team A ({teams.find(t => t.id === teamAId)?.name || 'Select Team'})</h3>
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">{teamAScore}</div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              <Button onClick={() => handleScoreUpdate('A', '+1')} className="bg-green-500 hover:bg-green-600">
                <Plus className="w-4 h-4" />
                +1
              </Button>
              <Button onClick={() => handleScoreUpdate('A', '+2')} className="bg-blue-500 hover:bg-blue-600">
                <Plus className="w-4 h-4" />
                +2
              </Button>
              <Button onClick={() => handleScoreUpdate('A', '+1')} variant="outline" className="border-yellow-500 text-yellow-600">
                Bonus
              </Button>
              <Button onClick={() => handleScoreUpdate('A', '+2')} variant="outline" className="border-purple-500 text-purple-600">
                Super Raid
              </Button>
              <Button onClick={() => handleScoreUpdate('A', '+2')} variant="outline" className="border-red-500 text-red-600">
                All Out
              </Button>
            </div>
          </div>

          {/* Team B Score Controls */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-300 dark:border-blue-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Team B ({teams.find(t => t.id === teamBId)?.name || 'Select Team'})</h3>
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{teamBScore}</div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              <Button onClick={() => handleScoreUpdate('B', '+1')} className="bg-green-500 hover:bg-green-600">
                <Plus className="w-4 h-4" />
                +1
              </Button>
              <Button onClick={() => handleScoreUpdate('B', '+2')} className="bg-blue-500 hover:bg-blue-600">
                <Plus className="w-4 h-4" />
                +2
              </Button>
              <Button onClick={() => handleScoreUpdate('B', '+1')} variant="outline" className="border-yellow-500 text-yellow-600">
                Bonus
              </Button>
              <Button onClick={() => handleScoreUpdate('B', '+2')} variant="outline" className="border-purple-500 text-purple-600">
                Super Raid
              </Button>
              <Button onClick={() => handleScoreUpdate('B', '+2')} variant="outline" className="border-red-500 text-red-600">
                All Out
              </Button>
            </div>
          </div>

          {/* Special Actions */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-900 dark:text-gray-100 mb-2 block">Team A Special Actions</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="border-orange-500 text-orange-600 text-white" onClick={() => handleScoreUpdate('A', '+2', 'super_tackle')}>
                    Super Tackle
                  </Button>
                  <Button variant="outline" className="border-gray-500 text-gray-600 text-white" onClick={() => handleScoreUpdate('A', '+1', 'do_or_die')}>
                    Do or Die
                  </Button>
                  <Button variant="outline" className="border-green-500 text-green-600 text-white" onClick={() => handleScoreUpdate('A', '+1', 'review')}>
                    Review
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-900 dark:text-gray-100 mb-2 block">Team B Special Actions</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="border-orange-500 text-orange-600 text-white" onClick={() => handleScoreUpdate('B', '+2', 'super_tackle')}>
                    Super Tackle
                  </Button>
                  <Button variant="outline" className="border-gray-500 text-gray-600 text-white" onClick={() => handleScoreUpdate('B', '+1', 'do_or_die')}>
                    Do or Die
                  </Button>
                  <Button variant="outline" className="border-green-500 text-green-600 text-white" onClick={() => handleScoreUpdate('B', '+1', 'review')}>
                    Review
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Rollback Section */}
          {pointHistory.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-2 border-yellow-300 dark:border-yellow-700">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Recent Changes (Click to Rollback)
              </h4>
              <div className="space-y-2">
                {pointHistory.slice(0, 3).map((history) => (
                  <div
                    key={history.id}
                    className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
                    onClick={() => handleRollback(history.id)}
                  >
                    <div className="text-sm">
                      <span className="font-medium">{history.pointsType}</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">
                        {history.teamAScore}-{history.teamBScore} → {history.newTeamAScore}-{history.newTeamBScore}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(history.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">Live Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-br from-[#2A003F]/80 to-[#4F1B78]/80 backdrop-blur-md border-2 border-[#BFA253]/30 rounded-2xl p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border-2 border-[#BFA253]/30">
                  <span className="text-white font-bold text-xl">{teams.find(t => t.id === teamAId)?.shortName || 'A'}</span>
                </div>
                <div>
                  <div className="text-white font-bold text-xl">{teams.find(t => t.id === teamAId)?.name || 'Team A'}</div>
                  <div className="text-[#BFA253] text-4xl font-bold">{teamAScore}</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-red-600 text-white text-sm font-bold px-4 py-1 rounded-full animate-pulse">
                  LIVE
                </div>
                <div className="text-white/80 text-sm mt-1">{half}</div>
                <div className="text-[#BFA253] text-3xl font-bold">{timer}</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-[#BFA253] text-4xl font-bold">{teamBScore}</div>
                  <div className="text-white font-bold text-xl">{teams.find(t => t.id === teamBId)?.name || 'Team B'}</div>
                </div>
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border-2 border-[#BFA253]/30">
                  <span className="text-white font-bold text-xl">{teams.find(t => t.id === teamBId)?.shortName || 'B'}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Point History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Point History</DialogTitle>
            <DialogDescription>
              Complete history of point updates for this match
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {pointHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No history available</p>
            ) : (
              <div className="space-y-2">
                {pointHistory.map((history) => (
                  <div key={history.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{history.pointsType}</span>
                      <span className="text-sm text-gray-500">{new Date(history.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-gray-600 dark:text-gray-400">
                        {history.teamAScore}-{history.teamBScore} → {history.newTeamAScore}-{history.newTeamBScore}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRollback(history.id)}
                        className="border-yellow-500 text-yellow-600"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Rollback
                      </Button>
                    </div>
                    {history.description && (
                      <p className="text-sm text-gray-500 mt-2">{history.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Player Stats Dialog */}
      <Dialog open={showPlayerStatsDialog} onOpenChange={setShowPlayerStatsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Player Statistics</DialogTitle>
            <DialogDescription>
              Update player statistics for this match
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePlayerStatsSubmit} className="space-y-4">
            <div>
              <Label htmlFor="playerName">Player Name</Label>
              <Input
                id="playerName"
                value={playerFormData.playerName}
                onChange={(e) => setPlayerFormData({ ...playerFormData, playerName: e.target.value })}
                required
                placeholder="Enter player name"
              />
            </div>
            <div>
              <Label htmlFor="team">Team</Label>
              <Select value={playerFormData.team} onValueChange={(value) => setPlayerFormData({ ...playerFormData, team: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Team A</SelectItem>
                  <SelectItem value="B">Team B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="raids">Raids</Label>
                <Input
                  id="raids"
                  type="number"
                  value={playerFormData.raids}
                  onChange={(e) => setPlayerFormData({ ...playerFormData, raids: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="tackles">Tackles</Label>
                <Input
                  id="tackles"
                  type="number"
                  value={playerFormData.tackles}
                  onChange={(e) => setPlayerFormData({ ...playerFormData, tackles: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  value={playerFormData.points}
                  onChange={(e) => setPlayerFormData({ ...playerFormData, points: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="superRaids">Super Raids</Label>
                <Input
                  id="superRaids"
                  type="number"
                  value={playerFormData.superRaids}
                  onChange={(e) => setPlayerFormData({ ...playerFormData, superRaids: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="superTackles">Super Tackles</Label>
                <Input
                  id="superTackles"
                  type="number"
                  value={playerFormData.superTackles}
                  onChange={(e) => setPlayerFormData({ ...playerFormData, superTackles: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <Button type="submit" className="w-full">Update Player Stats</Button>
          </form>

          {/* Existing Player Stats */}
          {playerStats.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Current Player Stats</h4>
              <div className="space-y-2">
                {playerStats.map((stat) => (
                  <div key={stat.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{stat.playerName}</span>
                        <span className="text-gray-500 ml-2">Team {stat.team}</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {stat.points} pts | {stat.raids} raids | {stat.tackles} tackles
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Complete Match Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Match</DialogTitle>
            <DialogDescription>
              Are you sure you want to complete this match? This will end the live session and mark the match as completed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {teamAScore} - {teamBScore}
                </div>
                <div className="text-gray-600 dark:text-gray-400 mt-2">
                  Final Score
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowCompleteDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleCompleteMatch} className="flex-1 bg-red-600 hover:bg-red-700">
                Complete Match
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
