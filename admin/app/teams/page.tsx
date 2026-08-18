"use client"

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useData } from '@/lib/hooks'
import { apiService, invalidateCache } from '@/lib/api'
import { mutate } from '@/lib/swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Edit, Trash2, Users } from 'lucide-react'

export default function TeamsPage() {
  const { data: teamsData, loading, refetch } = useData(() => apiService.teams.getAll())
  const { data: stadiumsData } = useData(() => apiService.stadiums?.getAll() || Promise.resolve([]))
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState<any>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    city: '',
    stadiumId: '',
    coach: '',
    seasonId: '',
    description: '',
    tagline: '',
    primaryColor: '#800080',
    secondaryColor: '#6B21A8',
    owner: '',
    captain: '',
    homeGround: '',
    region: '',
    founded: '',
    wins: 0,
    losses: 0,
    draws: 0,
    points: 0,
    matchesPlayed: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if user is authenticated
    if (typeof window !== 'undefined') {
      const adminToken = localStorage.getItem('adminToken')
      if (!adminToken) {
        alert('You are not logged in as admin. Redirecting to login page...')
        window.location.href = '/admin/login'
        return
      }
    }
    
    try {
      const formDataToSend = new FormData()
      
      // Only append non-empty values to avoid validation errors
      if (formData.name) formDataToSend.append('name', formData.name)
      if (formData.shortName) formDataToSend.append('shortName', formData.shortName)
      if (formData.city) formDataToSend.append('city', formData.city)
      if (formData.stadiumId) formDataToSend.append('stadiumId', formData.stadiumId)
      if (formData.coach) formDataToSend.append('coach', formData.coach)
      if (formData.seasonId) formDataToSend.append('seasonId', formData.seasonId)
      if (formData.description) formDataToSend.append('description', formData.description)
      if (formData.tagline) formDataToSend.append('tagline', formData.tagline)
      if (formData.primaryColor) formDataToSend.append('primaryColor', formData.primaryColor)
      if (formData.secondaryColor) formDataToSend.append('secondaryColor', formData.secondaryColor)
      if (formData.owner) formDataToSend.append('owner', formData.owner)
      if (formData.captain) formDataToSend.append('captain', formData.captain)
      if (formData.homeGround) formDataToSend.append('homeGround', formData.homeGround)
      if (formData.region) formDataToSend.append('region', formData.region)
      if (formData.founded) formDataToSend.append('founded', formData.founded)
      formDataToSend.append('wins', String(formData.wins))
      formDataToSend.append('losses', String(formData.losses))
      formDataToSend.append('draws', String(formData.draws))
      formDataToSend.append('points', String(formData.points))
      formDataToSend.append('matchesPlayed', String(formData.matchesPlayed))
      
      if (logoFile) {
        formDataToSend.append('logo', logoFile)
      }
      
      if (bannerFile) {
        formDataToSend.append('banner', bannerFile)
      }
      
      console.log('Submitting team data:', { editingTeam, formData })
      
      if (editingTeam) {
        console.log('Updating team:', editingTeam.id)
        await apiService.teams.update(editingTeam.id, formDataToSend)
      } else {
        console.log('Creating new team')
        await apiService.teams.create(formDataToSend)
      }
      setIsDialogOpen(false)
      setEditingTeam(null)
      setLogoFile(null)
      setBannerFile(null)
      // Reset form data
      setFormData({
        name: '',
        shortName: '',
        city: '',
        stadiumId: '',
        coach: '',
        seasonId: '',
        description: '',
        tagline: '',
        primaryColor: '',
        secondaryColor: '',
        owner: '',
        captain: '',
        homeGround: '',
        region: '',
        founded: '',
        wins: 0,
        losses: 0,
        draws: 0,
        points: 0,
        matchesPlayed: 0,
      })
      console.log('Team saved successfully, invalidating caches...')
      // Invalidate Axios cache for teams, points, and points-table FIRST
      invalidateCache('/teams')
      invalidateCache('/points')
      invalidateCache('/points-table')
      invalidateCache('/homepage')
      console.log('Axios cache invalidated')
      
      // Invalidate SWR cache for teams, points, points-table, and homepage with force revalidation
      mutate('/teams', true)
      mutate('/points', true)
      mutate('/points-table', true)
      mutate('/homepage', true)
      console.log('SWR cache invalidated for /teams, /points, /points-table, and /homepage')
      
      // Set localStorage timestamp for cross-tab communication
      localStorage.setItem('team-update-timestamp', Date.now().toString())
      console.log('localStorage team-update-timestamp set')
      
      // Force refetch to get fresh data in admin panel
      console.log('Calling refetch() for admin panel...')
      const refetchResult = await refetch()
      console.log('Admin panel refetch completed, result:', refetchResult)
      
      // Also do a direct API call to verify the data was saved
      try {
        const directFetch = await apiService.teams.getAll()
        console.log('Direct API fetch result:', directFetch)
        console.log('Direct API fetch data:', directFetch.data)
        
        // Backend returns { data: [...], pagination: {...} }
        const teamsArray = directFetch.data?.data || directFetch.data || directFetch
        console.log('Teams array extracted:', teamsArray)
        
        if (!Array.isArray(teamsArray)) {
          console.error('Expected array but received:', teamsArray)
        } else {
          const updatedTeam = teamsArray.find((t: any) => t.id === editingTeam.id)
          console.log('Updated team from direct fetch:', updatedTeam)
          console.log('Updated team jerseyColor:', updatedTeam?.jerseyColor)
          console.log('Updated team name:', updatedTeam?.name)
        }
      } catch (err) {
        console.error('Direct fetch error:', err)
      }
      
      // Use localStorage to trigger cross-tab cache invalidation
      if (typeof window !== 'undefined') {
        localStorage.setItem('team-update-timestamp', Date.now().toString())
        console.log('localStorage team-update-timestamp set')
      }
      // Invalidate homepage cache by triggering a page reload if needed
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'))
      }
    } catch (error: any) {
      console.error('Error saving team:', error)
      
      // Handle validation errors
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map((e: any) => e.msg).join(', ')
        alert(`Validation error: ${errorMessages}`)
      } else if (error.response?.status === 401) {
        alert('Authentication failed. Please log in again.')
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login'
        }
      } else {
        alert(`Failed to save team: ${error.response?.data?.error || error.message || 'Unknown error'}`)
      }
    }
  }

  const handleEdit = (team: any) => {
    setEditingTeam(team)
    setLogoFile(null)
    setBannerFile(null)
    setFormData({
      name: team.name,
      shortName: team.shortName,
      city: team.city || '',
      stadiumId: team.stadiumId || '',
      coach: team.coach || '',
      seasonId: team.seasonId,
      description: team.description || '',
      tagline: team.tagline || '',
      primaryColor: team.primaryColor || '#800080',
      secondaryColor: team.secondaryColor || '#6B21A8',
      owner: team.owner || '',
      captain: team.captain || '',
      homeGround: team.homeGround || '',
      region: team.region || '',
      founded: team.founded || '',
      wins: team.wins || 0,
      losses: team.losses || 0,
      draws: team.draws || 0,
      points: team.points || 0,
      matchesPlayed: team.matchesPlayed || 0,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      try {
        await apiService.teams.delete(id)
        refetch()
      } catch (error) {
        console.error('Error deleting team:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teams</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage league teams</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingTeam(null); setLogoFile(null); setBannerFile(null); setFormData({ name: '', shortName: '', city: '', stadiumId: '', coach: '', seasonId: '', description: '', tagline: '', primaryColor: '#800080', secondaryColor: '#6B21A8', owner: '', captain: '', homeGround: '', region: '', founded: '', wins: 0, losses: 0, draws: 0, points: 0, matchesPlayed: 0 }) }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Team
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTeam ? 'Edit Team' : 'Add New Team'}</DialogTitle>
              <DialogDescription>
                {editingTeam ? 'Update team information below. Changes will be saved immediately.' : 'Add a new team to the league. Fill in all required fields.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="logo">Team Logo</Label>
                <Input id="logo" type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setLogoFile(file)
                }} />
              </div>
              <div>
                <Label htmlFor="banner">Team Banner</Label>
                <Input id="banner" type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setBannerFile(file)
                }} />
              </div>
              <div>
                <Label htmlFor="name">Team Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="shortName">Short Name</Label>
                <Input id="shortName" value={formData.shortName} onChange={(e) => setFormData({ ...formData, shortName: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="stadiumId">Stadium</Label>
                <Select value={formData.stadiumId} onValueChange={(v) => setFormData({ ...formData, stadiumId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select stadium" /></SelectTrigger>
                  <SelectContent>
                    {(stadiumsData as any[])?.map((stadium: any) => (
                      <SelectItem key={stadium.id} value={stadium.id}>{stadium.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="coach">Coach</Label>
                <Input id="coach" value={formData.coach} onChange={(e) => setFormData({ ...formData, coach: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="seasonId">Season ID</Label>
                <Input id="seasonId" value={formData.seasonId} onChange={(e) => setFormData({ ...formData, seasonId: e.target.value })} required />
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
              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" value={formData.tagline} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <Input id="primaryColor" type="color" value={formData.primaryColor || '#800080'} onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })} className="w-20 h-10" />
                  <Input value={formData.primaryColor || ''} onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value || '#800080' })} className="flex-1" placeholder="#800080" />
                </div>
              </div>
              <div>
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex items-center gap-2">
                  <Input id="secondaryColor" type="color" value={formData.secondaryColor || '#6B21A8'} onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })} className="w-20 h-10" />
                  <Input value={formData.secondaryColor || ''} onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value || '#6B21A8' })} className="flex-1" placeholder="#6B21A8" />
                </div>
              </div>
              <div>
                <Label htmlFor="owner">Owner</Label>
                <Input id="owner" value={formData.owner} onChange={(e) => setFormData({ ...formData, owner: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="captain">Captain</Label>
                <Input id="captain" value={formData.captain} onChange={(e) => setFormData({ ...formData, captain: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="homeGround">Home Ground</Label>
                <Input id="homeGround" value={formData.homeGround} onChange={(e) => setFormData({ ...formData, homeGround: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="region">Region/State</Label>
                <Input id="region" value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="founded">Founded Year</Label>
                <Input id="founded" value={formData.founded} onChange={(e) => setFormData({ ...formData, founded: e.target.value })} placeholder="2024" />
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
              <Button type="submit" className="w-full">{editingTeam ? 'Update' : 'Create'} Team</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <p>Loading...</p> : (Array.isArray(teamsData) ? teamsData.filter((team: any) => !team.name.includes('HIDDEN') && team.isActive !== false) : []).map((team: any) => (
          <Card key={team.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    {team.logo ? (
                      <img src={team.logo} alt={team.name.replace(/ Team$/, '')} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Users className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{team.name.replace(/ Team$/, '')}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{team.shortName}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600 dark:text-gray-400">City:</span> {team.city || 'N/A'}</p>
                <p><span className="text-gray-600 dark:text-gray-400">Stadium:</span> {team.stadium?.name || 'N/A'}</p>
                <p><span className="text-gray-600 dark:text-gray-400">Players:</span> {team._count?.players || 0}</p>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <Button size="sm" variant="ghost" onClick={() => handleEdit(team)}><Edit className="w-4 h-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(team.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
