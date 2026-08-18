"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useData } from '@/lib/hooks'
import { apiService } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Edit, Trash2, Calendar, PlayCircle, Radio, Play, Pause, Square, Trophy, Copy, Eye, EyeOff, RotateCcw } from 'lucide-react'
import { formatDate, formatTime } from '@/lib/utils'
import { io, Socket } from 'socket.io-client'

export default function MatchesPage() {
  const [activeTab, setActiveTab] = useState('live')
  const [socket, setSocket] = useState<Socket | null>(null)
  
  const { data: liveMatchesData, loading: liveLoading, refetch: refetchLive } = useData(() => apiService.matches.getLive())
  const { data: upcomingMatchesData, loading: upcomingLoading, refetch: refetchUpcoming } = useData(() => apiService.matches.getUpcoming())
  const { data: completedMatchesData, loading: completedLoading, refetch: refetchCompleted } = useData(() => apiService.matches.getCompleted())
  const { data: teamsData } = useData(() => apiService.teams.getAll())
  const { data: seasonsData } = useData(() => apiService.seasons.getAll())
  const { data: stadiumsData } = useData(() => Promise.resolve([]))
  
  const seasonsArray = Array.isArray((seasonsData as any)?.data) ? (seasonsData as any).data : (Array.isArray(seasonsData) ? seasonsData : [])
  const teamsArray = Array.isArray((teamsData as any)?.data) ? (teamsData as any).data.filter((team: any) => !team.name.includes('HIDDEN') && team.isActive !== false) : (Array.isArray(teamsData) ? teamsData.filter((team: any) => !team.name.includes('HIDDEN') && team.isActive !== false) : [])
  const liveMatchesArray = Array.isArray((liveMatchesData as any)?.data) ? (liveMatchesData as any).data : (Array.isArray(liveMatchesData) ? liveMatchesData : [])
  const upcomingMatchesArray = Array.isArray((upcomingMatchesData as any)?.data) ? (upcomingMatchesData as any).data : (Array.isArray(upcomingMatchesData) ? upcomingMatchesData : [])
  const completedMatchesArray = Array.isArray((completedMatchesData as any)?.data) ? (completedMatchesData as any).data : (Array.isArray(completedMatchesData) ? completedMatchesData : [])
  const stadiumsArray: any[] = []
  
  const firstSeasonId = seasonsArray.length > 0 ? seasonsArray[0]?.id : null
  const { data: pointsTableData, refetch: refetchPointsTable } = useData(() => {
    return firstSeasonId ? apiService.pointsTable.getBySeason(firstSeasonId) : Promise.resolve([])
  }, [], [])

  // Dialog states
  const [isLiveDialogOpen, setIsLiveDialogOpen] = useState(false)
  const [isUpcomingDialogOpen, setIsUpcomingDialogOpen] = useState(false)
  const [isCompletedDialogOpen, setIsCompletedDialogOpen] = useState(false)
  const [isLiveScoreDialogOpen, setIsLiveScoreDialogOpen] = useState(false)
  const [isPointsTableDialogOpen, setIsPointsTableDialogOpen] = useState(false)
  
  // Editing states
  const [editingLiveMatch, setEditingLiveMatch] = useState<any>(null)
  const [editingUpcomingMatch, setEditingUpcomingMatch] = useState<any>(null)
  const [editingCompletedMatch, setEditingCompletedMatch] = useState<any>(null)
  const [scoreMatch, setScoreMatch] = useState<any>(null)
  const [editingPointsEntry, setEditingPointsEntry] = useState<any>(null)

  // Form states
  const [liveFormData, setLiveFormData] = useState({
    seasonId: '',
    homeTeamId: '',
    awayTeamId: '',
    matchDate: '',
    stadiumId: '',
    matchType: 'LEAGUE_MATCH',
    matchTitle: '',
    toss: '',
    referee: '',
  })
  
  const [upcomingFormData, setUpcomingFormData] = useState({
    seasonId: '',
    homeTeamId: '',
    awayTeamId: '',
    matchDate: '',
    stadiumId: '',
    matchType: 'LEAGUE_MATCH',
    matchTitle: '',
    broadcaster: '',
    matchBanner: '',
  })
  
  const [completedFormData, setCompletedFormData] = useState({
    winnerId: '',
    manOfTheMatch: '',
    matchSummary: '',
  })
  
  const [liveScoreData, setLiveScoreData] = useState({
    homeScore: 0,
    awayScore: 0,
    homeRaidPoints: 0,
    awayRaidPoints: 0,
    homeTacklePoints: 0,
    awayTacklePoints: 0,
    homeBonusPoints: 0,
    awayBonusPoints: 0,
    homeAllOutCount: 0,
    awayAllOutCount: 0,
    matchTimer: '00:00',
    halfTimeStatus: 'First Half',
  })
  
  const [pointsTableFormData, setPointsTableFormData] = useState({
    position: 0,
    matchesPlayed: 0,
    wins: 0,
    losses: 0,
    ties: 0,
    points: 0,
    raidPoints: 0,
    tacklePoints: 0,
  })

  // Socket.IO connection for real-time updates
  useEffect(() => {
    let newSocket: Socket | null = null
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const socketUrl = apiUrl.replace('/api', '')
      newSocket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 3,
        timeout: 5000,
      })
      setSocket(newSocket)

      newSocket.on('score-update', () => {
        refetchLive()
      })

      newSocket.on('status-update', () => {
        refetchLive()
        refetchUpcoming()
        refetchCompleted()
      })

      newSocket.on('points-table-update', () => {
        refetchPointsTable()
      })
    } catch (error) {
      console.error('Socket.IO connection error:', error)
    }

    return () => {
      if (newSocket) {
        newSocket.disconnect()
      }
    }
  }, [])

  const handleCreateLiveMatch = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const match = await apiService.matches.create({
        ...liveFormData,
        status: 'SCHEDULED',
        matchDate: new Date(liveFormData.matchDate).toISOString(),
      })
      setIsLiveDialogOpen(false)
      setLiveFormData({
        seasonId: '',
        homeTeamId: '',
        awayTeamId: '',
        matchDate: '',
        stadiumId: '',
        matchType: 'LEAGUE_MATCH',
        matchTitle: '',
        toss: '',
        referee: '',
      })
      refetchUpcoming()
    } catch (error) {
      console.error('Error creating live match:', error)
    }
  }

  const handleCreateUpcomingMatch = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const match = await apiService.matches.create({
        ...upcomingFormData,
        status: 'SCHEDULED',
        matchDate: new Date(upcomingFormData.matchDate).toISOString(),
      })
      setIsUpcomingDialogOpen(false)
      setUpcomingFormData({
        seasonId: '',
        homeTeamId: '',
        awayTeamId: '',
        matchDate: '',
        stadiumId: '',
        matchType: 'LEAGUE_MATCH',
        matchTitle: '',
        broadcaster: '',
        matchBanner: '',
      })
      refetchUpcoming()
    } catch (error) {
      console.error('Error creating upcoming match:', error)
    }
  }

  const handleUpdateCompletedMatch = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiService.matches.update(editingCompletedMatch.id, completedFormData)
      setIsCompletedDialogOpen(false)
      setEditingCompletedMatch(null)
      refetchCompleted()
    } catch (error) {
      console.error('Error updating completed match:', error)
    }
  }

  const handleUpdateLiveScore = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiService.matches.updateLiveScore(scoreMatch.id, liveScoreData)
      setIsLiveScoreDialogOpen(false)
      setScoreMatch(null)
      refetchLive()
    } catch (error) {
      console.error('Error updating live score:', error)
    }
  }

  const handleStartMatch = async (matchId: string) => {
    try {
      await apiService.matches.startMatch(matchId)
      refetchLive()
      refetchUpcoming()
    } catch (error) {
      console.error('Error starting match:', error)
    }
  }

  const handlePauseMatch = async (matchId: string) => {
    try {
      await apiService.matches.pauseMatch(matchId)
      refetchLive()
    } catch (error) {
      console.error('Error pausing match:', error)
    }
  }

  const handleResumeMatch = async (matchId: string) => {
    try {
      await apiService.matches.resumeMatch(matchId)
      refetchLive()
    } catch (error) {
      console.error('Error resuming match:', error)
    }
  }

  const handleEndMatch = async (matchId: string) => {
    if (confirm('Are you sure you want to end this match? This will move it to completed matches.')) {
      try {
        const match = liveMatchesArray?.find((m: any) => m.id === matchId)
        await apiService.matches.endMatch(matchId, {
          winnerId: match?.homeScore > match?.awayScore ? match?.homeTeamId : match?.awayTeamId,
          manOfTheMatch: '',
          keyStatistics: {},
        })
        refetchLive()
        refetchCompleted()
      } catch (error) {
        console.error('Error ending match:', error)
      }
    }
  }

  const handleCancelMatch = async (matchId: string) => {
    if (confirm('Are you sure you want to cancel this match?')) {
      try {
        await apiService.matches.updateStatus(matchId, { status: 'CANCELLED' })
        refetchLive()
        refetchUpcoming()
      } catch (error) {
        console.error('Error cancelling match:', error)
      }
    }
  }

  const handleAbandonMatch = async (matchId: string) => {
    if (confirm('Are you sure you want to abandon this match?')) {
      try {
        await apiService.matches.updateStatus(matchId, { status: 'ABANDONED' })
        refetchLive()
        refetchUpcoming()
      } catch (error) {
        console.error('Error abandoning match:', error)
      }
    }
  }

  const handleRollbackMatch = async (matchId: string) => {
    const historyId = prompt('Enter the history ID to rollback to (or leave empty for latest):')
    if (historyId === null) return
    
    try {
      await apiService.matches.rollback(matchId, historyId || '')
      refetchLive()
      alert('Match rolled back successfully')
    } catch (error) {
      console.error('Error rolling back match:', error)
      alert('Failed to rollback match')
    }
  }

  const handleDeleteMatch = async (matchId: string) => {
    if (confirm('Are you sure you want to delete this match? This action cannot be undone.')) {
      try {
        await apiService.matches.delete(matchId)
        refetchLive()
        refetchUpcoming()
        refetchCompleted()
        alert('Match deleted successfully')
      } catch (error) {
        console.error('Error deleting match:', error)
        alert('Failed to delete match')
      }
    }
  }

  const handleSetHalfTime = async (matchId: string, halfTimeStatus: string) => {
    try {
      await apiService.matches.updateLiveScore(matchId, { halfTimeStatus })
      refetchLive()
    } catch (error) {
      console.error('Error setting half time:', error)
    }
  }

  const handleSetTimer = async (matchId: string, timer: string) => {
    try {
      await apiService.matches.updateLiveScore(matchId, { matchTimer: timer })
      refetchLive()
    } catch (error) {
      console.error('Error setting timer:', error)
    }
  }

  const handleSetQuarter = async (matchId: string, quarter: string) => {
    try {
      await apiService.matches.updateLiveScore(matchId, { halfTimeStatus: quarter })
      refetchLive()
    } catch (error) {
      console.error('Error setting quarter:', error)
    }
  }

  const handleUpdatePointsTable = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiService.pointsTable.update(editingPointsEntry.id, pointsTableFormData)
      setIsPointsTableDialogOpen(false)
      setEditingPointsEntry(null)
      refetchPointsTable()
    } catch (error) {
      console.error('Error updating points table:', error)
    }
  }

  const handleDuplicateMatch = async (id: string) => {
    if (confirm('Are you sure you want to duplicate this match? A new match will be created for tomorrow.')) {
      try {
        await apiService.matches.duplicate(id)
        refetchUpcoming()
      } catch (error) {
        console.error('Error duplicating match:', error)
      }
    }
  }

  const handlePublishMatch = async (id: string, published: boolean) => {
    try {
      await apiService.matches.publish(id, { published })
      refetchUpcoming()
      refetchLive()
      refetchCompleted()
    } catch (error) {
      console.error('Error publishing match:', error)
    }
  }

  const handleLogEvent = async (matchId: string, eventType: string, teamSide: string) => {
    try {
      const match = liveMatches.find((m: any) => m.id === matchId)
      if (!match) return

      const teamId = teamSide === 'home' ? match.homeTeamId : match.awayTeamId
      const points = {
        'RAID': 1,
        'BONUS': 1,
        'SUPER_RAID': 2,
        'TOUCH': 0,
        'SUPER_TACKLE': 2,
        'ALL_OUT': 2,
      }

      const scoreUpdate = {
        homeScore: teamSide === 'home' ? match.homeScore + (points[eventType as keyof typeof points] || 0) : match.homeScore,
        awayScore: teamSide === 'away' ? match.awayScore + (points[eventType as keyof typeof points] || 0) : match.awayScore,
        homeRaidPoints: teamSide === 'home' && ['RAID', 'BONUS', 'SUPER_RAID'].includes(eventType) ? match.homeRaidPoints + (points[eventType as keyof typeof points] || 0) : match.homeRaidPoints,
        awayRaidPoints: teamSide === 'away' && ['RAID', 'BONUS', 'SUPER_RAID'].includes(eventType) ? match.awayRaidPoints + (points[eventType as keyof typeof points] || 0) : match.awayRaidPoints,
        homeTacklePoints: teamSide === 'home' && ['TOUCH', 'SUPER_TACKLE'].includes(eventType) ? match.homeTacklePoints + (points[eventType as keyof typeof points] || 0) : match.homeTacklePoints,
        awayTacklePoints: teamSide === 'away' && ['TOUCH', 'SUPER_TACKLE'].includes(eventType) ? match.awayTacklePoints + (points[eventType as keyof typeof points] || 0) : match.awayTacklePoints,
        homeAllOutCount: teamSide === 'home' && eventType === 'ALL_OUT' ? match.homeAllOutCount + 1 : match.homeAllOutCount,
        awayAllOutCount: teamSide === 'away' && eventType === 'ALL_OUT' ? match.awayAllOutCount + 1 : match.awayAllOutCount,
      }

      await apiService.matches.updateLiveScore(matchId, scoreUpdate)
      refetchLive()
    } catch (error) {
      console.error('Error logging event:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800'
      case 'LIVE': return 'bg-red-100 text-red-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-gray-100 text-gray-800'
      case 'ABANDONED': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const liveMatches = liveMatchesArray
  const upcomingMatches = upcomingMatchesArray
  const completedMatches = completedMatchesArray
  const pointsTable = Array.isArray((pointsTableData as any)?.data) ? (pointsTableData as any).data : (Array.isArray(pointsTableData) ? pointsTableData : [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Matches Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage live, upcoming, and completed matches</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('live')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'live'
              ? 'text-[#800080] border-b-2 border-[#800080] bg-white/10'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          LIVE MATCHES
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'upcoming'
              ? 'text-[#800080] border-b-2 border-[#800080] bg-white/10'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          UPCOMING MATCHES
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'completed'
              ? 'text-[#800080] border-b-2 border-[#800080] bg-white/10'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          COMPLETED MATCHES
        </button>
      </div>

      {/* Live Matches Tab */}
      {activeTab === 'live' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Live Matches</h2>
            <Dialog open={isLiveDialogOpen} onOpenChange={setIsLiveDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setLiveFormData({
                  seasonId: seasonsArray[0]?.id || '',
                  homeTeamId: '',
                  awayTeamId: '',
                  matchDate: new Date().toISOString().slice(0, 16),
                  stadiumId: '',
                  matchType: 'LEAGUE_MATCH',
                  matchTitle: '',
                  toss: '',
                  referee: '',
                })}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Live Match
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Live Match</DialogTitle>
                  <DialogDescription>
                    Create a new live match. Fill in all required fields to start the match.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateLiveMatch} className="space-y-4">
                  <div>
                    <Label htmlFor="seasonId">Season</Label>
                    <Select value={liveFormData.seasonId} onValueChange={(v) => setLiveFormData({ ...liveFormData, seasonId: v })}>
                      <SelectTrigger><SelectValue placeholder="Select season" /></SelectTrigger>
                      <SelectContent>
                        {seasonsArray?.map((season: any) => (
                          <SelectItem key={season.id} value={season.id}>{season.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="matchType">Match Type</Label>
                    <Select value={liveFormData.matchType} onValueChange={(v) => setLiveFormData({ ...liveFormData, matchType: v })}>
                      <SelectTrigger><SelectValue placeholder="Select match type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LEAGUE_MATCH">League Match</SelectItem>
                        <SelectItem value="ELIMINATOR">Eliminator</SelectItem>
                        <SelectItem value="QUALIFIER_1">Qualifier 1</SelectItem>
                        <SelectItem value="QUALIFIER_2">Qualifier 2</SelectItem>
                        <SelectItem value="SEMI_FINAL">Semi Final</SelectItem>
                        <SelectItem value="FINAL">Final</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="matchTitle">Match Title</Label>
                    <Input id="matchTitle" value={liveFormData.matchTitle} onChange={(e) => setLiveFormData({ ...liveFormData, matchTitle: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="homeTeamId">Team A</Label>
                      <Select value={liveFormData.homeTeamId} onValueChange={(v) => setLiveFormData({ ...liveFormData, homeTeamId: v })}>
                        <SelectTrigger><SelectValue placeholder="Select team" /></SelectTrigger>
                        <SelectContent>
                          {teamsArray?.map((team: any) => (
                            <SelectItem key={team.id} value={team.id}>{team.name.replace(/ Team$/, '')}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="awayTeamId">Team B</Label>
                      <Select value={liveFormData.awayTeamId} onValueChange={(v) => setLiveFormData({ ...liveFormData, awayTeamId: v })}>
                        <SelectTrigger><SelectValue placeholder="Select team" /></SelectTrigger>
                        <SelectContent>
                          {teamsArray?.map((team: any) => (
                            <SelectItem key={team.id} value={team.id}>{team.name.replace(/ Team$/, '')}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="stadiumId">Stadium</Label>
                      <Select value={liveFormData.stadiumId} onValueChange={(v) => setLiveFormData({ ...liveFormData, stadiumId: v })}>
                        <SelectTrigger><SelectValue placeholder="Select stadium" /></SelectTrigger>
                        <SelectContent>
                          {stadiumsArray?.map((stadium: any) => (
                            <SelectItem key={stadium.id} value={stadium.id}>{stadium.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="matchDate">Match Date & Time</Label>
                      <Input id="matchDate" type="datetime-local" value={liveFormData.matchDate} onChange={(e) => setLiveFormData({ ...liveFormData, matchDate: e.target.value })} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="toss">Toss Information (Optional)</Label>
                      <Input id="toss" value={liveFormData.toss} onChange={(e) => setLiveFormData({ ...liveFormData, toss: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="referee">Referee (Optional)</Label>
                      <Input id="referee" value={liveFormData.referee} onChange={(e) => setLiveFormData({ ...liveFormData, referee: e.target.value })} />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-[#800080] hover:bg-[#700070]">Create Match</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {liveLoading ? <p>Loading...</p> : liveMatches.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">No live matches</CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {liveMatches.map((match: any) => (
                <Card key={match.id} className="border-l-4 border-l-red-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
                        {match.status}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {match.matchType?.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                            {match.homeTeam.logo ? (
                              <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <PlayCircle className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                          <p className="font-semibold">{match.homeTeam.name}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-4xl font-bold text-[#800080]">
                            {match.homeScore} - {match.awayScore}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {match.matchTimer || '00:00'}
                          </p>
                          <p className="text-xs text-gray-500">{match.halfTimeStatus}</p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                            {match.awayTeam.logo ? (
                              <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <PlayCircle className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                          <p className="font-semibold">{match.awayTeam.name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="text-center bg-gray-50 dark:bg-gray-800 p-2 rounded">
                        <p className="text-gray-600 dark:text-gray-400">Raid Points</p>
                        <p className="font-semibold">{match.homeRaidPoints} - {match.awayRaidPoints}</p>
                      </div>
                      <div className="text-center bg-gray-50 dark:bg-gray-800 p-2 rounded">
                        <p className="text-gray-600 dark:text-gray-400">Tackle Points</p>
                        <p className="font-semibold">{match.homeTacklePoints} - {match.awayTacklePoints}</p>
                      </div>
                      <div className="text-center bg-gray-50 dark:bg-gray-800 p-2 rounded">
                        <p className="text-gray-600 dark:text-gray-400">Bonus Points</p>
                        <p className="font-semibold">{match.homeBonusPoints} - {match.awayBonusPoints}</p>
                      </div>
                      <div className="text-center bg-gray-50 dark:bg-gray-800 p-2 rounded">
                        <p className="text-gray-600 dark:text-gray-400">All Out</p>
                        <p className="font-semibold">{match.homeAllOutCount} - {match.awayAllOutCount}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => handleStartMatch(match.id)} disabled={match.status === 'LIVE'}>
                          <Play className="w-4 h-4 mr-1" /> Start
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handlePauseMatch(match.id)} disabled={match.status !== 'LIVE'}>
                          <Pause className="w-4 h-4 mr-1" /> Pause
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleResumeMatch(match.id)} disabled={match.halfTimeStatus !== 'Paused'}>
                          <Play className="w-4 h-4 mr-1" /> Resume
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleEndMatch(match.id)} disabled={match.status !== 'LIVE'}>
                          <Square className="w-4 h-4 mr-1" /> End
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleCancelMatch(match.id)} disabled={match.status === 'CANCELLED' || match.status === 'COMPLETED'}>
                          Cancel
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleAbandonMatch(match.id)} disabled={match.status === 'ABANDONED' || match.status === 'COMPLETED'}>
                          Abandon
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRollbackMatch(match.id)} disabled={match.status !== 'LIVE'}>
                          <RotateCcw className="w-4 h-4 mr-1" /> Rollback
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteMatch(match.id)}>
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleSetHalfTime(match.id, 'First Half')} disabled={match.status !== 'LIVE'}>
                          1st Half
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleSetHalfTime(match.id, 'Half Time')} disabled={match.status !== 'LIVE'}>
                          Half Time
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleSetHalfTime(match.id, 'Second Half')} disabled={match.status !== 'LIVE'}>
                          2nd Half
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleSetQuarter(match.id, 'Q1')} disabled={match.status !== 'LIVE'}>
                          Q1
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleSetQuarter(match.id, 'Q2')} disabled={match.status !== 'LIVE'}>
                          Q2
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleSetQuarter(match.id, 'Q3')} disabled={match.status !== 'LIVE'}>
                          Q3
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleSetQuarter(match.id, 'Q4')} disabled={match.status !== 'LIVE'}>
                          Q4
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Timer:</span>
                        <Input 
                          type="text" 
                          value={match.matchTimer || '00:00'} 
                          onChange={(e) => handleSetTimer(match.id, e.target.value)}
                          className="w-24 text-center"
                          disabled={match.status !== 'LIVE'}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleSetTimer(match.id, '00:00')} disabled={match.status !== 'LIVE'}>
                          Reset
                        </Button>
                      </div>
                    </div>
                      <div className="flex space-x-2 mb-4">
                        <Button size="sm" variant="outline" onClick={() => handleLogEvent(match.id, 'RAID', 'home')} disabled={match.status !== 'LIVE'}>
                          Home Raid
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleLogEvent(match.id, 'RAID', 'away')} disabled={match.status !== 'LIVE'}>
                          Away Raid
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleLogEvent(match.id, 'BONUS', 'home')} disabled={match.status !== 'LIVE'}>
                          Home Bonus
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleLogEvent(match.id, 'BONUS', 'away')} disabled={match.status !== 'LIVE'}>
                          Away Bonus
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleLogEvent(match.id, 'SUPER_RAID', 'home')} disabled={match.status !== 'LIVE'}>
                          Home Super Raid
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleLogEvent(match.id, 'SUPER_RAID', 'away')} disabled={match.status !== 'LIVE'}>
                          Away Super Raid
                        </Button>
                      </div>
                      <div className="flex space-x-2 mb-4">
                        <Button size="sm" variant="outline" onClick={() => handleLogEvent(match.id, 'TOUCH', 'home')} disabled={match.status !== 'LIVE'}>
                          Home Touch
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleLogEvent(match.id, 'TOUCH', 'away')} disabled={match.status !== 'LIVE'}>
                          Away Touch
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleLogEvent(match.id, 'SUPER_TACKLE', 'home')} disabled={match.status !== 'LIVE'}>
                          Home Super Tackle
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleLogEvent(match.id, 'SUPER_TACKLE', 'away')} disabled={match.status !== 'LIVE'}>
                          Away Super Tackle
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleLogEvent(match.id, 'ALL_OUT', 'home')} disabled={match.status !== 'LIVE'}>
                          Home All Out
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleLogEvent(match.id, 'ALL_OUT', 'away')} disabled={match.status !== 'LIVE'}>
                          Away All Out
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => {
                        setScoreMatch(match)
                        setLiveScoreData({
                          homeScore: match.homeScore,
                          awayScore: match.awayScore,
                          homeRaidPoints: match.homeRaidPoints,
                          awayRaidPoints: match.awayRaidPoints,
                          homeTacklePoints: match.homeTacklePoints,
                          awayTacklePoints: match.awayTacklePoints,
                          homeBonusPoints: match.homeBonusPoints,
                          awayBonusPoints: match.awayBonusPoints,
                          homeAllOutCount: match.homeAllOutCount,
                          awayAllOutCount: match.awayAllOutCount,
                          matchTimer: match.matchTimer || '00:00',
                          halfTimeStatus: match.halfTimeStatus || 'First Half',
                        })
                        setIsLiveScoreDialogOpen(true)
                      }}>
                        <Radio className="w-4 h-4 mr-1" /> Update Score
                      </Button>
                        <Button size="sm" variant="ghost" onClick={() => handlePublishMatch(match.id, !match.published)}>
                          {match.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDuplicateMatch(match.id)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteMatch(match.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Live Points Table */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Live Points Table</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Pos</th>
                      <th className="text-left p-2">Team</th>
                      <th className="text-center p-2">P</th>
                      <th className="text-center p-2">W</th>
                      <th className="text-center p-2">L</th>
                      <th className="text-center p-2">T</th>
                      <th className="text-center p-2">Pts</th>
                      <th className="text-center p-2">Raid</th>
                      <th className="text-center p-2">Tackle</th>
                      <th className="text-center p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pointsTable.map((entry: any) => (
                      <tr key={entry.id} className="border-b">
                        <td className="p-2 font-semibold">{entry.position}</td>
                        <td className="p-2">{entry.team?.name}</td>
                        <td className="text-center p-2">{entry.matchesPlayed}</td>
                        <td className="text-center p-2">{entry.wins}</td>
                        <td className="text-center p-2">{entry.losses}</td>
                        <td className="text-center p-2">{entry.ties}</td>
                        <td className="text-center p-2 font-bold">{entry.points}</td>
                        <td className="text-center p-2">{entry.raidPoints}</td>
                        <td className="text-center p-2">{entry.tacklePoints}</td>
                        <td className="text-center p-2">
                          <Button size="sm" variant="ghost" onClick={() => {
                            setEditingPointsEntry(entry)
                            setPointsTableFormData({
                              position: entry.position,
                              matchesPlayed: entry.matchesPlayed,
                              wins: entry.wins,
                              losses: entry.losses,
                              ties: entry.ties,
                              points: entry.points,
                              raidPoints: entry.raidPoints,
                              tacklePoints: entry.tacklePoints,
                            })
                            setIsPointsTableDialogOpen(true)
                          }}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Upcoming Matches Tab */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Upcoming Matches</h2>
            <Dialog open={isUpcomingDialogOpen} onOpenChange={setIsUpcomingDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setUpcomingFormData({
                  seasonId: seasonsArray[0]?.id || '',
                  homeTeamId: '',
                  awayTeamId: '',
                  matchDate: new Date().toISOString().slice(0, 16),
                  stadiumId: '',
                  matchType: 'LEAGUE_MATCH',
                  matchTitle: '',
                  broadcaster: '',
                  matchBanner: '',
                })}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Upcoming Match
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Upcoming Match</DialogTitle>
                  <DialogDescription>
                    Schedule a new upcoming match. Fill in all required fields to add it to the calendar.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateUpcomingMatch} className="space-y-4">
                  <div>
                    <Label htmlFor="seasonId">Season</Label>
                    <Select value={upcomingFormData.seasonId} onValueChange={(v) => setUpcomingFormData({ ...upcomingFormData, seasonId: v })}>
                      <SelectTrigger><SelectValue placeholder="Select season" /></SelectTrigger>
                      <SelectContent>
                        {seasonsArray?.map((season: any) => (
                          <SelectItem key={season.id} value={season.id}>{season.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="matchType">Match Type</Label>
                    <Select value={upcomingFormData.matchType} onValueChange={(v) => setUpcomingFormData({ ...upcomingFormData, matchType: v })}>
                      <SelectTrigger><SelectValue placeholder="Select match type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LEAGUE_MATCH">League Match</SelectItem>
                        <SelectItem value="ELIMINATOR">Eliminator</SelectItem>
                        <SelectItem value="QUALIFIER_1">Qualifier 1</SelectItem>
                        <SelectItem value="QUALIFIER_2">Qualifier 2</SelectItem>
                        <SelectItem value="SEMI_FINAL">Semi Final</SelectItem>
                        <SelectItem value="FINAL">Final</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="matchTitle">Match Title</Label>
                    <Input id="matchTitle" value={upcomingFormData.matchTitle} onChange={(e) => setUpcomingFormData({ ...upcomingFormData, matchTitle: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="homeTeamId">Team A</Label>
                      <Select value={upcomingFormData.homeTeamId} onValueChange={(v) => setUpcomingFormData({ ...upcomingFormData, homeTeamId: v })}>
                        <SelectTrigger><SelectValue placeholder="Select team" /></SelectTrigger>
                        <SelectContent>
                          {teamsArray?.map((team: any) => (
                            <SelectItem key={team.id} value={team.id}>{team.name.replace(/ Team$/, '')}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="awayTeamId">Team B</Label>
                      <Select value={upcomingFormData.awayTeamId} onValueChange={(v) => setUpcomingFormData({ ...upcomingFormData, awayTeamId: v })}>
                        <SelectTrigger><SelectValue placeholder="Select team" /></SelectTrigger>
                        <SelectContent>
                          {teamsArray?.map((team: any) => (
                            <SelectItem key={team.id} value={team.id}>{team.name.replace(/ Team$/, '')}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="stadiumId">Stadium</Label>
                      <Select value={upcomingFormData.stadiumId} onValueChange={(v) => setUpcomingFormData({ ...upcomingFormData, stadiumId: v })}>
                        <SelectTrigger><SelectValue placeholder="Select stadium" /></SelectTrigger>
                        <SelectContent>
                          {stadiumsArray?.map((stadium: any) => (
                            <SelectItem key={stadium.id} value={stadium.id}>{stadium.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="matchDate">Match Date & Time</Label>
                      <Input id="matchDate" type="datetime-local" value={upcomingFormData.matchDate} onChange={(e) => setUpcomingFormData({ ...upcomingFormData, matchDate: e.target.value })} required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="broadcaster">Broadcaster</Label>
                    <Input id="broadcaster" value={upcomingFormData.broadcaster} onChange={(e) => setUpcomingFormData({ ...upcomingFormData, broadcaster: e.target.value })} />
                  </div>
                  <Button type="submit" className="w-full bg-[#800080] hover:bg-[#700070]">Save Match</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {upcomingLoading ? <p>Loading...</p> : upcomingMatches.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">No upcoming matches</CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {upcomingMatches.map((match: any) => (
                <Card key={match.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
                            {match.status}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {match.matchType?.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                                {match.homeTeam.logo ? (
                                  <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                  <PlayCircle className="w-8 h-8 text-gray-400" />
                                )}
                              </div>
                              <p className="font-semibold">{match.homeTeam.name}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-gray-400">VS</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {formatDate(match.matchDate)} at {formatTime(match.matchDate)}
                              </p>
                            </div>
                            <div className="text-center">
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                                {match.awayTeam.logo ? (
                                  <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                  <PlayCircle className="w-8 h-8 text-gray-400" />
                                )}
                              </div>
                              <p className="font-semibold">{match.awayTeam.name}</p>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          {match.stadium?.name || match.venue}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button size="sm" variant="ghost" onClick={() => handlePublishMatch(match.id, !match.published)}>
                          {match.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDuplicateMatch(match.id)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteMatch(match.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Completed Matches Tab */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Completed Matches</h2>
          {completedLoading ? <p>Loading...</p> : completedMatches.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">No completed matches</CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {completedMatches.map((match: any) => (
                <Card key={match.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
                            {match.status}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {match.matchType?.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                                {match.homeTeam.logo ? (
                                  <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                  <PlayCircle className="w-8 h-8 text-gray-400" />
                                )}
                              </div>
                              <p className="font-semibold">{match.homeTeam.name}</p>
                            </div>
                            <div className="text-center">
                              {match.result ? (
                                <p className="text-3xl font-bold">
                                  {match.result.homeScore} - {match.result.awayScore}
                                </p>
                              ) : (
                                <p className="text-2xl font-bold text-gray-400">VS</p>
                              )}
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {formatDate(match.matchDate)}
                              </p>
                            </div>
                            <div className="text-center">
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                                {match.awayTeam.logo ? (
                                  <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                  <PlayCircle className="w-8 h-8 text-gray-400" />
                                )}
                              </div>
                              <p className="font-semibold">{match.awayTeam.name}</p>
                            </div>
                          </div>
                        </div>
                        {match.result?.winner && (
                          <div className="mt-4 flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                            <span className="font-semibold text-yellow-600">Winner: {match.result.winner?.name}</span>
                          </div>
                        )}
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          {match.stadium?.name || match.venue}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button size="sm" variant="ghost" onClick={() => {
                          setEditingCompletedMatch(match)
                          setCompletedFormData({
                            winnerId: match.result?.winnerId || '',
                            manOfTheMatch: match.result?.manOfTheMatch || '',
                            matchSummary: '',
                          })
                          setIsCompletedDialogOpen(true)
                        }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteMatch(match.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Live Score Dialog */}
      <Dialog open={isLiveScoreDialogOpen} onOpenChange={setIsLiveScoreDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Live Score</DialogTitle>
            <DialogDescription>
              Update the live score for this match. Changes will be reflected immediately.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateLiveScore} className="space-y-4">
            <div className="text-center mb-4">
              <p className="font-semibold">{scoreMatch?.homeTeam?.name} vs {scoreMatch?.awayTeam?.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="homeScore">Home Score</Label>
                <Input id="homeScore" type="number" value={liveScoreData.homeScore} onChange={(e) => setLiveScoreData({ ...liveScoreData, homeScore: parseInt(e.target.value) })} />
              </div>
              <div>
                <Label htmlFor="awayScore">Away Score</Label>
                <Input id="awayScore" type="number" value={liveScoreData.awayScore} onChange={(e) => setLiveScoreData({ ...liveScoreData, awayScore: parseInt(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="homeRaidPoints">Home Raid Points</Label>
                <Input id="homeRaidPoints" type="number" value={liveScoreData.homeRaidPoints} onChange={(e) => setLiveScoreData({ ...liveScoreData, homeRaidPoints: parseInt(e.target.value) })} />
              </div>
              <div>
                <Label htmlFor="awayRaidPoints">Away Raid Points</Label>
                <Input id="awayRaidPoints" type="number" value={liveScoreData.awayRaidPoints} onChange={(e) => setLiveScoreData({ ...liveScoreData, awayRaidPoints: parseInt(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="homeTacklePoints">Home Tackle Points</Label>
                <Input id="homeTacklePoints" type="number" value={liveScoreData.homeTacklePoints} onChange={(e) => setLiveScoreData({ ...liveScoreData, homeTacklePoints: parseInt(e.target.value) })} />
              </div>
              <div>
                <Label htmlFor="awayTacklePoints">Away Tackle Points</Label>
                <Input id="awayTacklePoints" type="number" value={liveScoreData.awayTacklePoints} onChange={(e) => setLiveScoreData({ ...liveScoreData, awayTacklePoints: parseInt(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="homeBonusPoints">Home Bonus Points</Label>
                <Input id="homeBonusPoints" type="number" value={liveScoreData.homeBonusPoints} onChange={(e) => setLiveScoreData({ ...liveScoreData, homeBonusPoints: parseInt(e.target.value) })} />
              </div>
              <div>
                <Label htmlFor="awayBonusPoints">Away Bonus Points</Label>
                <Input id="awayBonusPoints" type="number" value={liveScoreData.awayBonusPoints} onChange={(e) => setLiveScoreData({ ...liveScoreData, awayBonusPoints: parseInt(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="homeAllOutCount">Home All Out</Label>
                <Input id="homeAllOutCount" type="number" value={liveScoreData.homeAllOutCount} onChange={(e) => setLiveScoreData({ ...liveScoreData, homeAllOutCount: parseInt(e.target.value) })} />
              </div>
              <div>
                <Label htmlFor="awayAllOutCount">Away All Out</Label>
                <Input id="awayAllOutCount" type="number" value={liveScoreData.awayAllOutCount} onChange={(e) => setLiveScoreData({ ...liveScoreData, awayAllOutCount: parseInt(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="matchTimer">Match Timer</Label>
                <Input id="matchTimer" value={liveScoreData.matchTimer} onChange={(e) => setLiveScoreData({ ...liveScoreData, matchTimer: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="halfTimeStatus">Half Time Status</Label>
                <Select value={liveScoreData.halfTimeStatus} onValueChange={(v) => setLiveScoreData({ ...liveScoreData, halfTimeStatus: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="First Half">First Half</SelectItem>
                    <SelectItem value="Half Time">Half Time</SelectItem>
                    <SelectItem value="Second Half">Second Half</SelectItem>
                    <SelectItem value="Paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full bg-[#800080] hover:bg-[#700070]">Update Score</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Points Table Dialog */}
      <Dialog open={isPointsTableDialogOpen} onOpenChange={setIsPointsTableDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Points Table Entry</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdatePointsTable} className="space-y-4">
            <div className="text-center mb-4">
              <p className="font-semibold">{editingPointsEntry?.team?.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position">Position</Label>
                <Input id="position" type="number" value={pointsTableFormData.position} onChange={(e) => setPointsTableFormData({ ...pointsTableFormData, position: parseInt(e.target.value) })} />
              </div>
              <div>
                <Label htmlFor="matchesPlayed">Matches Played</Label>
                <Input id="matchesPlayed" type="number" value={pointsTableFormData.matchesPlayed} onChange={(e) => setPointsTableFormData({ ...pointsTableFormData, matchesPlayed: parseInt(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wins">Wins</Label>
                <Input id="wins" type="number" value={pointsTableFormData.wins} onChange={(e) => setPointsTableFormData({ ...pointsTableFormData, wins: parseInt(e.target.value) })} />
              </div>
              <div>
                <Label htmlFor="losses">Losses</Label>
                <Input id="losses" type="number" value={pointsTableFormData.losses} onChange={(e) => setPointsTableFormData({ ...pointsTableFormData, losses: parseInt(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ties">Ties</Label>
                <Input id="ties" type="number" value={pointsTableFormData.ties} onChange={(e) => setPointsTableFormData({ ...pointsTableFormData, ties: parseInt(e.target.value) })} />
              </div>
              <div>
                <Label htmlFor="points">Points</Label>
                <Input id="points" type="number" value={pointsTableFormData.points} onChange={(e) => setPointsTableFormData({ ...pointsTableFormData, points: parseInt(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="raidPoints">Raid Points</Label>
                <Input id="raidPoints" type="number" value={pointsTableFormData.raidPoints} onChange={(e) => setPointsTableFormData({ ...pointsTableFormData, raidPoints: parseInt(e.target.value) })} />
              </div>
              <div>
                <Label htmlFor="tacklePoints">Tackle Points</Label>
                <Input id="tacklePoints" type="number" value={pointsTableFormData.tacklePoints} onChange={(e) => setPointsTableFormData({ ...pointsTableFormData, tacklePoints: parseInt(e.target.value) })} />
              </div>
            </div>
            <Button type="submit" className="w-full bg-[#800080] hover:bg-[#700070]">Update Entry</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Completed Match Edit Dialog */}
      <Dialog open={isCompletedDialogOpen} onOpenChange={setIsCompletedDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Completed Match</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateCompletedMatch} className="space-y-4">
            <div>
              <Label htmlFor="winnerId">Winner</Label>
              <Select value={completedFormData.winnerId} onValueChange={(v) => setCompletedFormData({ ...completedFormData, winnerId: v })}>
                <SelectTrigger><SelectValue placeholder="Select winner" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={editingCompletedMatch?.homeTeamId}>{editingCompletedMatch?.homeTeam?.name}</SelectItem>
                  <SelectItem value={editingCompletedMatch?.awayTeamId}>{editingCompletedMatch?.awayTeam?.name}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="manOfTheMatch">Man of the Match</Label>
              <Input id="manOfTheMatch" value={completedFormData.manOfTheMatch} onChange={(e) => setCompletedFormData({ ...completedFormData, manOfTheMatch: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="matchSummary">Match Summary</Label>
              <Input id="matchSummary" value={completedFormData.matchSummary} onChange={(e) => setCompletedFormData({ ...completedFormData, matchSummary: e.target.value })} />
            </div>
            <Button type="submit" className="w-full bg-[#800080] hover:bg-[#700070]">Update Match</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
