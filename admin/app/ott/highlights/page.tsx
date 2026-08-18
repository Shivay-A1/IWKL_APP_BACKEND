"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Save, Plus, Trash2 } from 'lucide-react'

interface Highlight {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnailUrl: string
  isPublished: boolean
  publishedAt: string
  displayOrder: number
}

export default function HighlightsPage() {
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHighlights()
  }, [])

  const fetchHighlights = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ott/highlights`)
      const data = await response.json()
      if (data.success) {
        setHighlights(data.data)
      }
    } catch (error) {
      console.error('Error fetching highlights:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddHighlight = () => {
    setHighlights([...highlights, {
      id: '',
      title: '',
      description: '',
      videoUrl: '',
      thumbnailUrl: '',
      isPublished: false,
      publishedAt: '',
      displayOrder: highlights.length
    }])
  }

  const handleRemoveHighlight = (index: number) => {
    const updated = highlights.filter((_, i) => i !== index)
    setHighlights(updated)
  }

  const handleUpdateHighlight = (index: number, field: keyof Highlight, value: any) => {
    const updated = [...highlights]
    updated[index] = { ...updated[index], [field]: value }
    setHighlights(updated)
  }

  const handleSave = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken')
      
      for (const highlight of highlights) {
        if (highlight.id) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ott/highlights/${highlight.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${adminToken}`,
            },
            body: JSON.stringify(highlight),
          })
        } else if (highlight.title && highlight.videoUrl) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ott/highlights`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${adminToken}`,
            },
            body: JSON.stringify(highlight),
          })
        }
      }
      
      await fetchHighlights()
      alert('Highlights saved successfully!')
    } catch (error) {
      console.error('Error saving highlights:', error)
      alert('Failed to save highlights')
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Highlights</h1>
        <div className="flex space-x-2">
          <Button onClick={handleAddHighlight}>
            <Plus className="w-4 h-4 mr-2" />
            Add Highlight
          </Button>
          <Button className="bg-gradient-to-r from-[#BFA253] to-[#8B5A2B] hover:from-[#8B5A2B] hover:to-[#BFA253]" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save All
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {highlights.map((highlight, index) => (
          <Card key={index}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Highlight #{index + 1}</h3>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveHighlight(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <Label>Title</Label>
                <Input
                  value={highlight.title}
                  onChange={(e) => handleUpdateHighlight(index, 'title', e.target.value)}
                  placeholder="e.g., Match Highlights"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={highlight.description}
                  onChange={(e) => handleUpdateHighlight(index, 'description', e.target.value)}
                  placeholder="Description of the highlight"
                  rows={3}
                />
              </div>

              <div>
                <Label>Video URL</Label>
                <Input
                  value={highlight.videoUrl}
                  onChange={(e) => handleUpdateHighlight(index, 'videoUrl', e.target.value)}
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div>
                <Label>Thumbnail URL</Label>
                <Input
                  value={highlight.thumbnailUrl}
                  onChange={(e) => handleUpdateHighlight(index, 'thumbnailUrl', e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={highlight.displayOrder}
                    onChange={(e) => handleUpdateHighlight(index, 'displayOrder', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Published At</Label>
                  <Input
                    type="date"
                    value={highlight.publishedAt}
                    onChange={(e) => handleUpdateHighlight(index, 'publishedAt', e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id={`published-${index}`}
                    checked={highlight.isPublished}
                    onChange={(e) => handleUpdateHighlight(index, 'isPublished', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor={`published-${index}`}>Published</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
