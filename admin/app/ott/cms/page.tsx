"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, Save, Plus, Trash2 } from 'lucide-react'

export default function OTTCMSPage() {
  const [heroData, setHeroData] = useState({
    heading: 'IWKL OTT',
    subheading: 'Watch Live Matches • Exclusive Content • Live Highlights • Player Interviews • Press Conferences',
  })

  const [broadcasters, setBroadcasters] = useState([
    { id: 1, name: 'Star Sports', logo: '', url: '' },
    { id: 2, name: 'JioHotstar', logo: '', url: '' },
  ])

  const [featuredVideos, setFeaturedVideos] = useState([
    { id: 1, title: 'Match Highlights', url: '', thumbnail: '' },
  ])

  const [upcomingMatches, setUpcomingMatches] = useState([
    { id: 1, teamA: 'Puneri Paltan', teamB: 'Bengaluru Bulls', date: '', time: '', venue: '' },
  ])

  const handleAddBroadcaster = () => {
    setBroadcasters([...broadcasters, { id: Date.now(), name: '', logo: '', url: '' }])
  }

  const handleRemoveBroadcaster = (id: number) => {
    setBroadcasters(broadcasters.filter(b => b.id !== id))
  }

  const handleAddVideo = () => {
    setFeaturedVideos([...featuredVideos, { id: Date.now(), title: '', url: '', thumbnail: '' }])
  }

  const handleRemoveVideo = (id: number) => {
    setFeaturedVideos(featuredVideos.filter(v => v.id !== id))
  }

  const handleAddMatch = () => {
    setUpcomingMatches([...upcomingMatches, { id: Date.now(), teamA: '', teamB: '', date: '', time: '', venue: '' }])
  }

  const handleRemoveMatch = (id: number) => {
    setUpcomingMatches(upcomingMatches.filter(m => m.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">OTT CMS</h1>
        <Button className="bg-gradient-to-r from-[#BFA253] to-[#8B5A2B] hover:from-[#8B5A2B] hover:to-[#BFA253]">
          <Save className="w-4 h-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="broadcasters">Broadcasters</TabsTrigger>
          <TabsTrigger value="videos">Featured Videos</TabsTrigger>
          <TabsTrigger value="matches">Upcoming Matches</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Main Heading</Label>
                <Input
                  value={heroData.heading}
                  onChange={(e) => setHeroData({ ...heroData, heading: e.target.value })}
                  placeholder="IWKL OTT"
                />
              </div>
              <div>
                <Label>Subheading</Label>
                <Textarea
                  value={heroData.subheading}
                  onChange={(e) => setHeroData({ ...heroData, subheading: e.target.value })}
                  placeholder="Watch Live Matches • Exclusive Content..."
                  rows={3}
                />
              </div>
              <div>
                <Label>Hero Background Image</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="broadcasters" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Broadcasters</CardTitle>
                <Button onClick={handleAddBroadcaster} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Broadcaster
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {broadcasters.map((broadcaster) => (
                <div key={broadcaster.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Input
                      value={broadcaster.name}
                      onChange={(e) => {
                        const updated = broadcasters.map(b => 
                          b.id === broadcaster.id ? { ...b, name: e.target.value } : b
                        )
                        setBroadcasters(updated)
                      }}
                      placeholder="Broadcaster Name"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveBroadcaster(broadcaster.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div>
                    <Label>Logo</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                      <Upload className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                      <p className="text-xs text-gray-500">Upload logo</p>
                    </div>
                  </div>
                  <div>
                    <Label>Watch URL</Label>
                    <Input
                      value={broadcaster.url}
                      onChange={(e) => {
                        const updated = broadcasters.map(b => 
                          b.id === broadcaster.id ? { ...b, url: e.target.value } : b
                        )
                        setBroadcasters(updated)
                      }}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Featured Videos</CardTitle>
                <Button onClick={handleAddVideo} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Video
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {featuredVideos.map((video) => (
                <div key={video.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Input
                      value={video.title}
                      onChange={(e) => {
                        const updated = featuredVideos.map(v => 
                          v.id === video.id ? { ...v, title: e.target.value } : v
                        )
                        setFeaturedVideos(updated)
                      }}
                      placeholder="Video Title"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveVideo(video.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div>
                    <Label>Video URL</Label>
                    <Input
                      value={video.url}
                      onChange={(e) => {
                        const updated = featuredVideos.map(v => 
                          v.id === video.id ? { ...v, url: e.target.value } : v
                        )
                        setFeaturedVideos(updated)
                      }}
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                  <div>
                    <Label>Thumbnail</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                      <Upload className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                      <p className="text-xs text-gray-500">Upload thumbnail</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matches" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Upcoming Matches</CardTitle>
                <Button onClick={handleAddMatch} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Match
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingMatches.map((match) => (
                <div key={match.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">Match #{match.id}</div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveMatch(match.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Team A</Label>
                      <Input
                        value={match.teamA}
                        onChange={(e) => {
                          const updated = upcomingMatches.map(m => 
                            m.id === match.id ? { ...m, teamA: e.target.value } : m
                          )
                          setUpcomingMatches(updated)
                        }}
                        placeholder="Team A"
                      />
                    </div>
                    <div>
                      <Label>Team B</Label>
                      <Input
                        value={match.teamB}
                        onChange={(e) => {
                          const updated = upcomingMatches.map(m => 
                            m.id === match.id ? { ...m, teamB: e.target.value } : m
                          )
                          setUpcomingMatches(updated)
                        }}
                        placeholder="Team B"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={match.date}
                        onChange={(e) => {
                          const updated = upcomingMatches.map(m => 
                            m.id === match.id ? { ...m, date: e.target.value } : m
                          )
                          setUpcomingMatches(updated)
                        }}
                      />
                    </div>
                    <div>
                      <Label>Time</Label>
                      <Input
                        type="time"
                        value={match.time}
                        onChange={(e) => {
                          const updated = upcomingMatches.map(m => 
                            m.id === match.id ? { ...m, time: e.target.value } : m
                          )
                          setUpcomingMatches(updated)
                        }}
                      />
                    </div>
                    <div>
                      <Label>Venue</Label>
                      <Input
                        value={match.venue}
                        onChange={(e) => {
                          const updated = upcomingMatches.map(m => 
                            m.id === match.id ? { ...m, venue: e.target.value } : m
                          )
                          setUpcomingMatches(updated)
                        }}
                        placeholder="Venue"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
