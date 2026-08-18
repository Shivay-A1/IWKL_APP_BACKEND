"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Save, Upload } from 'lucide-react'

interface Hero {
  id: string
  title: string
  subtitle: string
  backgroundImage: string
  isEnabled: boolean
}

export default function HeroCMSPage() {
  const [hero, setHero] = useState<Hero>({
    id: '',
    title: 'IWKL OTT',
    subtitle: 'Watch Live Matches • Exclusive Content • Live Highlights • Player Interviews • Press Conferences',
    backgroundImage: '/ott.png',
    isEnabled: true
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHero()
  }, [])

  const fetchHero = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ott/hero`)
      const data = await response.json()
      if (data.success && data.data) {
        setHero(data.data)
      }
    } catch (error) {
      console.error('Error fetching hero:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken')
      
      if (hero.id) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ott/hero/${hero.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`,
          },
          body: JSON.stringify(hero),
        })
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ott/hero`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`,
          },
          body: JSON.stringify(hero),
        })
      }
      
      await fetchHero()
      alert('Hero saved successfully!')
    } catch (error) {
      console.error('Error saving hero:', error)
      alert('Failed to save hero')
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hero CMS</h1>
        <Button className="bg-gradient-to-r from-[#BFA253] to-[#8B5A2B] hover:from-[#8B5A2B] hover:to-[#BFA253]" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={hero.title}
              onChange={(e) => setHero({ ...hero, title: e.target.value })}
              placeholder="e.g., IWKL OTT"
            />
          </div>

          <div>
            <Label>Subtitle</Label>
            <Textarea
              value={hero.subtitle}
              onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
              placeholder="e.g., Watch Live Matches • Exclusive Content"
              rows={3}
            />
          </div>

          <div>
            <Label>Background Image URL</Label>
            <Input
              value={hero.backgroundImage}
              onChange={(e) => setHero({ ...hero, backgroundImage: e.target.value })}
              placeholder="/ott.png or https://..."
            />
            <div className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
              <Upload className="w-6 h-6 mx-auto mb-1 text-gray-400" />
              <p className="text-xs text-gray-500">Upload background image (via file upload system)</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enabled"
              checked={hero.isEnabled}
              onChange={(e) => setHero({ ...hero, isEnabled: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="enabled">Enable Hero Section</Label>
          </div>

          {hero.backgroundImage && (
            <div className="mt-4">
              <Label>Preview</Label>
              <div className="mt-2 w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={hero.backgroundImage}
                  alt="Hero Preview"
                  className="w-full h-full object-cover"
                  onError={() => console.log('Image failed to load')}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
