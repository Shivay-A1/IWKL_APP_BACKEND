"use client"

import { usePathname } from 'next/navigation'
import PremiumHeader from './premium-header'
import Footer from './footer'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminPath = pathname?.startsWith('/admin')

  return (
    <>
      {!isAdminPath && <PremiumHeader />}
      <div className={!isAdminPath ? "pt-4 sm:pt-20 md:pt-24 lg:pt-28 pb-8 overflow-x-hidden w-full" : "overflow-x-hidden w-full"}>
        {children}
      </div>
      {!isAdminPath && <Footer />}
    </>
  )
}
