"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Save } from 'lucide-react'

interface OttSettings {
  id: string
  starSportsUrl: string
  hotstarUrl: string
  defaultStreamUrl: string
  autoRedirect: boolean
}

export default function OttSettingsPage() {
  const [settings, setSettings] = useState<OttSettings>({
    id: '',
    starSportsUrl: '',
    hotstarUrl: '',
    defaultStreamUrl: '',
    autoRedirect: false
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ott/settings`)
      const data = await response.json()
      if (data.success && data.data) {
        setSettings(data.data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken')
      
      if (settings.id) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ott/settings/${settings.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`,
          },
          body: JSON.stringify(settings),
        })
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ott/settings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`,
          },
          body: JSON.stringify(settings),
        })
      }
      
      await fetchSettings()
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">OTT Settings</h1>
        <Button className="bg-gradient-to-r from-[#BFA253] to-[#8B5A2B] hover:from-[#8B5A2B] hover:to-[#BFA253]" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Broadcaster URLs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Star Sports URL</Label>
            <Input
              value={settings.starSportsUrl}
              onChange={(e) => setSettings({ ...settings, starSportsUrl: e.target.value })}
              placeholder="https://www.starsports.com/..."
            />
          </div>

          <div>
            <Label>Hotstar URL</Label>
            <Input
              value={settings.hotstarUrl}
              onChange={(e) => setSettings({ ...settings, hotstarUrl: e.target.value })}
              placeholder="https://www.hotstar.com/..."
            />
          </div>

          <div>
            <Label>Default Stream URL</Label>
            <Input
              value={settings.defaultStreamUrl}
              onChange={(e) => setSettings({ ...settings, defaultStreamUrl: e.target.value })}
              placeholder="https://youtube.com/..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Auto Redirect</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-redirect">Auto Redirect to Default Stream</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Automatically redirect users to the default stream when they visit the OTT page
              </p>
            </div>
            <Switch
              id="auto-redirect"
              checked={settings.autoRedirect}
              onCheckedChange={(checked) => setSettings({ ...settings, autoRedirect: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
