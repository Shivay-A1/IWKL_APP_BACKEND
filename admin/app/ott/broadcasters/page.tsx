"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Save, Plus, Trash2, ExternalLink } from 'lucide-react'

interface Broadcaster {
  id: string
  name: string
  logo: string
  redirectUrl: string
  isActive: boolean
  displayOrder: number
}

export default function BroadcastersPage() {
  const [broadcasters, setBroadcasters] = useState<Broadcaster[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBroadcasters()
  }, [])

  const fetchBroadcasters = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ott/broadcasters`)
      const data = await response.json()
      if (data.success) {
        setBroadcasters(data.data)
      }
    } catch (error) {
      console.error('Error fetching broadcasters:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBroadcaster = () => {
    setBroadcasters([...broadcasters, {
      id: '',
      name: '',
      logo: '',
      redirectUrl: '',
      isActive: true,
      displayOrder: broadcasters.length
    }])
  }

  const handleRemoveBroadcaster = (index: number) => {
    const updated = broadcasters.filter((_, i) => i !== index)
    setBroadcasters(updated)
  }

  const handleUpdateBroadcaster = (index: number, field: keyof Broadcaster, value: any) => {
    const updated = [...broadcasters]
    updated[index] = { ...updated[index], [field]: value }
    setBroadcasters(updated)
  }

  const handleSave = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken')
      
      for (const broadcaster of broadcasters) {
        if (broadcaster.id) {
          // Update existing
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ott/broadcasters/${broadcaster.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${adminToken}`,
            },
            body: JSON.stringify(broadcaster),
          })
        } else if (broadcaster.name && broadcaster.logo) {
          // Create new
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ott/broadcasters`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${adminToken}`,
            },
            body: JSON.stringify(broadcaster),
          })
        }
      }
      
      await fetchBroadcasters()
      alert('Broadcasters saved successfully!')
    } catch (error) {
      console.error('Error saving broadcasters:', error)
      alert('Failed to save broadcasters')
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Broadcasters</h1>
        <div className="flex space-x-2">
          <Button onClick={handleAddBroadcaster}>
            <Plus className="w-4 h-4 mr-2" />
            Add Broadcaster
          </Button>
          <Button className="bg-gradient-to-r from-[#BFA253] to-[#8B5A2B] hover:from-[#8B5A2B] hover:to-[#BFA253]" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save All
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {broadcasters.map((broadcaster, index) => (
          <Card key={index}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Broadcaster #{index + 1}</h3>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveBroadcaster(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={broadcaster.name}
                    onChange={(e) => handleUpdateBroadcaster(index, 'name', e.target.value)}
                    placeholder="e.g., Star Sports"
                  />
                </div>
                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={broadcaster.displayOrder}
                    onChange={(e) => handleUpdateBroadcaster(index, 'displayOrder', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label>Logo URL</Label>
                <Input
                  value={broadcaster.logo}
                  onChange={(e) => handleUpdateBroadcaster(index, 'logo', e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label>Redirect URL</Label>
                <div className="flex space-x-2">
                  <Input
                    value={broadcaster.redirectUrl}
                    onChange={(e) => handleUpdateBroadcaster(index, 'redirectUrl', e.target.value)}
                    placeholder="https://..."
                    className="flex-1"
                  />
                  {broadcaster.redirectUrl && (
                    <Button variant="outline" size="icon" onClick={() => window.open(broadcaster.redirectUrl, '_blank')}>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`active-${index}`}
                  checked={broadcaster.isActive}
                  onChange={(e) => handleUpdateBroadcaster(index, 'isActive', e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor={`active-${index}`}>Active</Label>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
