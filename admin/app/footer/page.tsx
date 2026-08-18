"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiService } from '@/lib/api'
import { Save, Upload } from 'lucide-react'

export default function FooterManagementPage() {
  const [footer, setFooter] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    logo: '',
    quickLinks: '',
    resources: '',
    contactInfo: '',
    socialLinks: '',
    copyright: '',
  })

  useEffect(() => {
    fetchFooter()
  }, [])

  const fetchFooter = async () => {
    try {
      const response = await apiService.footer.get()
      setFooter((response as any)?.data)
      setFormData({
        logo: (response as any)?.data?.logo || '',
        quickLinks: JSON.stringify((response as any)?.data?.quickLinks || [], null, 2),
        resources: JSON.stringify((response as any)?.data?.resources || [], null, 2),
        contactInfo: JSON.stringify((response as any)?.data?.contactInfo || {}, null, 2),
        socialLinks: JSON.stringify((response as any)?.data?.socialLinks || {}, null, 2),
        copyright: (response as any)?.data?.copyright || '',
      })
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch footer:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formDataToSend = new FormData()
      
      if (logoFile) {
        formDataToSend.append('logo', logoFile)
      } else if (formData.logo) {
        formDataToSend.append('logo', formData.logo)
      }
      
      formDataToSend.append('quickLinks', JSON.stringify(JSON.parse(formData.quickLinks)))
      formDataToSend.append('resources', JSON.stringify(JSON.parse(formData.resources)))
      formDataToSend.append('contactInfo', JSON.stringify(JSON.parse(formData.contactInfo)))
      formDataToSend.append('socialLinks', JSON.stringify(JSON.parse(formData.socialLinks)))
      formDataToSend.append('copyright', formData.copyright)
      
      await apiService.footer.update(formDataToSend)
      alert('Footer updated successfully!')
      fetchFooter()
    } catch (error) {
      console.error('Failed to save footer:', error)
      alert('Failed to save footer. Please check your JSON format.')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      setFormData({ ...formData, logo: URL.createObjectURL(file) })
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
        <h1 className="text-3xl font-bold text-white">Footer Management</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#652F7A] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Logo</h2>
          <div className="flex items-center space-x-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="bg-[#2B123A] border-white/20 text-white"
            />
            {formData.logo && (
              <img
                src={formData.logo}
                alt="Footer Logo"
                className="w-16 h-16 object-contain"
              />
            )}
          </div>
        </div>

        <div className="bg-[#652F7A] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Links (JSON Array)</h2>
          <p className="text-white/60 text-sm mb-2">Format: Array of objects with label and link properties</p>
          <Input
            value={formData.quickLinks}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, quickLinks: e.target.value })}
            className="bg-[#2B123A] border-white/20 text-white font-mono text-sm"
            placeholder='[{"label": "Home", "link": "/"}, {"label": "About", "link": "/about"}]'
          />
        </div>

        <div className="bg-[#652F7A] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Resources (JSON Array)</h2>
          <p className="text-white/60 text-sm mb-2">Format: Array of objects with label and link properties</p>
          <Input
            value={formData.resources}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, resources: e.target.value })}
            className="bg-[#2B123A] border-white/20 text-white font-mono text-sm"
            placeholder='[{"label": "Documentation", "link": "/docs"}, {"label": "Help", "link": "/help"}]'
          />
        </div>

        <div className="bg-[#652F7A] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Contact Information (JSON Object)</h2>
          <p className="text-white/60 text-sm mb-2">Format: Object with address, email, phone, whatsapp properties</p>
          <Input
            value={formData.contactInfo}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, contactInfo: e.target.value })}
            className="bg-[#2B123A] border-white/20 text-white font-mono text-sm"
            placeholder='{"address": "123 Street", "email": "contact@iwkl.com", "phone": "+91 1234567890", "whatsapp": "+91 1234567890"}'
          />
        </div>

        <div className="bg-[#652F7A] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Social Media Links (JSON Object)</h2>
          <p className="text-white/60 text-sm mb-2">Format: Object with facebook, twitter, instagram, youtube, linkedin properties</p>
          <Input
            value={formData.socialLinks}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, socialLinks: e.target.value })}
            className="bg-[#2B123A] border-white/20 text-white font-mono text-sm"
            placeholder='{"facebook": "https://facebook.com", "twitter": "https://twitter.com", "instagram": "https://instagram.com", "youtube": "https://youtube.com", "linkedin": "https://linkedin.com"}'
          />
        </div>

        <div className="bg-[#652F7A] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Copyright Text</h2>
          <Input
            value={formData.copyright}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, copyright: e.target.value })}
            className="bg-[#2B123A] border-white/20 text-white"
            placeholder="© 2026 IWKL. All rights reserved."
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#7A3D92] text-white hover:bg-[#652F7A]"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Footer'}
          </Button>
        </div>
      </form>
    </div>
  )
}
