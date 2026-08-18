"use client"

export const dynamic = 'force-dynamic'

import BannerManagement from '@/components/admin/banner-management'

export default function AdminBannersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Homepage Banner Management</h1>
        <p className="text-gray-600 mt-2">
          Upload, manage, and organize homepage banner images
        </p>
      </div>

      <BannerManagement />
    </div>
  )
}
