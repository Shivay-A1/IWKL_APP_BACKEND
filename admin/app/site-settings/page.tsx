"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiService } from '@/lib/api'
import { Save, Upload } from 'lucide-react'

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [faviconFile, setFaviconFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    siteName: '',
    siteTagline: '',
    siteLogo: '',
    favicon: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    contactEmail: '',
    contactPhone: '',
    socialMedia: '',
    maintenanceMode: false,
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await apiService.siteSettings.get()
      setSettings((response as any)?.data)
      setFormData({
        siteName: (response as any)?.data?.siteName || '',
        siteTagline: (response as any)?.data?.siteTagline || '',
        siteLogo: (response as any)?.data?.siteLogo || '',
        favicon: (response as any)?.data?.favicon || '',
        seoTitle: (response as any)?.data?.seoTitle || '',
        seoDescription: (response as any)?.data?.seoDescription || '',
        seoKeywords: (response as any)?.data?.seoKeywords || '',
        contactEmail: (response as any)?.data?.contactEmail || '',
        contactPhone: (response as any)?.data?.contactPhone || '',
        socialMedia: JSON.stringify((response as any)?.data?.socialMedia || {}, null, 2),
        maintenanceMode: (response as any)?.data?.maintenanceMode || false,
      })
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch settings:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('siteName', formData.siteName)
      formDataToSend.append('siteTagline', formData.siteTagline)
      
      if (logoFile) {
        formDataToSend.append('siteLogo', logoFile)
      } else if (formData.siteLogo) {
        formDataToSend.append('siteLogo', formData.siteLogo)
      }
      
      if (faviconFile) {
        formDataToSend.append('favicon', faviconFile)
      } else if (formData.favicon) {
        formDataToSend.append('favicon', formData.favicon)
      }
      
      formDataToSend.append('seoTitle', formData.seoTitle)
      formDataToSend.append('seoDescription', formData.seoDescription)
      formDataToSend.append('seoKeywords', formData.seoKeywords)
      formDataToSend.append('contactEmail', formData.contactEmail)
      formDataToSend.append('contactPhone', formData.contactPhone)
      formDataToSend.append('socialMedia', JSON.stringify(JSON.parse(formData.socialMedia)))
      formDataToSend.append('maintenanceMode', formData.maintenanceMode.toString())
      
      await apiService.siteSettings.update(formDataToSend)
      alert('Site settings updated successfully!')
      fetchSettings()
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Failed to save settings. Please check your JSON format.')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (file) {
      if (field === 'siteLogo') {
        setLogoFile(file)
      } else if (field === 'favicon') {
        setFaviconFile(file)
      }
      setFormData({ ...formData, [field]: URL.createObjectURL(file) })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Site Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#652F7A] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="siteName" className="text-white">Site Name *</Label>
              <Input
                id="siteName"
                value={formData.siteName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, siteName: e.target.value })}
                required
                className="bg-[#2B123A] border-white/20 text-white"
              />
            </div>

            <div>
              <Label htmlFor="siteTagline" className="text-white">Site Tagline</Label>
              <Input
                id="siteTagline"
                value={formData.siteTagline}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, siteTagline: e.target.value })}
                className="bg-[#2B123A] border-white/20 text-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#652F7A] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Logo & Favicon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="siteLogo" className="text-white">Site Logo</Label>
              <div className="flex items-center space-x-4 mt-2">
                <Input
                  id="siteLogo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'siteLogo')}
                  className="bg-[#2B123A] border-white/20 text-white"
                />
                {formData.siteLogo && (
                  <img
                    src={formData.siteLogo}
                    alt="Site Logo"
                    className="w-16 h-16 object-contain"
                  />
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="favicon" className="text-white">Favicon</Label>
              <div className="flex items-center space-x-4 mt-2">
                <Input
                  id="favicon"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'favicon')}
                  className="bg-[#2B123A] border-white/20 text-white"
                />
                {formData.favicon && (
                  <img
                    src={formData.favicon}
                    alt="Favicon"
                    className="w-8 h-8 object-contain"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#652F7A] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">SEO Settings</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="seoTitle" className="text-white">SEO Title</Label>
              <Input
                id="seoTitle"
                value={formData.seoTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="bg-[#2B123A] border-white/20 text-white"
              />
            </div>

            <div>
              <Label htmlFor="seoDescription" className="text-white">SEO Description</Label>
              <Input
                id="seoDescription"
                value={formData.seoDescription}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, seoDescription: e.target.value })}
                className="bg-[#2B123A] border-white/20 text-white"
              />
            </div>

            <div>
              <Label htmlFor="seoKeywords" className="text-white">SEO Keywords</Label>
              <Input
                id="seoKeywords"
                value={formData.seoKeywords}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, seoKeywords: e.target.value })}
                className="bg-[#2B123A] border-white/20 text-white"
                placeholder="kabaddi, women kabaddi, sports, league, IWKL"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#652F7A] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactEmail" className="text-white">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="bg-[#2B123A] border-white/20 text-white"
              />
            </div>

            <div>
              <Label htmlFor="contactPhone" className="text-white">Contact Phone</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="bg-[#2B123A] border-white/20 text-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#652F7A] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Social Media Links (JSON Object)</h2>
          <p className="text-white/60 text-sm mb-2">Format: Object with facebook, twitter, instagram, youtube, linkedin properties</p>
          <Input
            value={formData.socialMedia}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, socialMedia: e.target.value })}
            className="bg-[#2B123A] border-white/20 text-white font-mono text-sm"
            placeholder='{"facebook": "https://facebook.com", "twitter": "https://twitter.com", "instagram": "https://instagram.com", "youtube": "https://youtube.com", "linkedin": "https://linkedin.com"}'
          />
        </div>

        <div className="bg-[#652F7A] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Maintenance Mode</h2>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="maintenanceMode"
              checked={formData.maintenanceMode}
              onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="maintenanceMode" className="text-white">Enable Maintenance Mode</Label>
          </div>
          <p className="text-white/60 text-sm mt-2">When enabled, the site will show a maintenance message to visitors.</p>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#7A3D92] text-white hover:bg-[#652F7A]"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  )
}
