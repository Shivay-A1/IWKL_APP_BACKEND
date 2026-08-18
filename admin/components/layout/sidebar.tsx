"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Trophy, 
  PlayCircle, 
  Newspaper, 
  Image as ImageIcon, 
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  UserPlus,
  Tv,
  Smartphone,
  Share2
} from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'App Management', href: '/admin/app-management', icon: Smartphone },
  { name: 'Seasons', href: '/admin/seasons', icon: Calendar },
  { name: 'Teams', href: '/admin/teams', icon: Users },
  { name: 'Players', href: '/admin/teams', icon: Trophy },
  { name: 'Matches', href: '/admin/matches', icon: PlayCircle },
  { name: 'Points Table', href: '/admin/points', icon: Trophy },
  { name: 'Videos', href: '/admin/videos', icon: PlayCircle, hasSubmenu: true, submenu: [
    { name: 'IWKL Unplugged Categories', href: '/admin/unplugged/categories' },
    { name: 'IWKL Unplugged Videos', href: '/admin/unplugged/videos' },
  ]},
  { name: 'OTT Management', href: '/admin/ott', icon: Tv, hasSubmenu: true, submenu: [
    { name: 'Broadcasters', href: '/admin/ott/broadcasters' },
    { name: 'Live Match', href: '/admin/ott/live-match' },
    { name: 'Upcoming Matches', href: '/admin/ott/upcoming-matches' },
    { name: 'Highlights', href: '/admin/ott/highlights' },
    { name: 'Hero CMS', href: '/admin/ott/hero' },
    { name: 'OTT Settings', href: '/admin/ott/settings' },
    { name: 'Exclusive Content', href: '/admin/ott/exclusive-content' },
    { name: 'Live Tracker', href: '/admin/ott/live-tracker' },
    { name: 'Player Stats', href: '/admin/ott/player-stats' },
    { name: 'Raid Tracker', href: '/admin/ott/raid-tracker' },
  ]},
  { name: 'News', href: '/admin/news', icon: Newspaper },
  { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
  { name: 'Leadership', href: '/admin/leadership', icon: Building2 },
  { name: 'Fan Club', href: '/admin/fan-club', icon: Users },
  { name: 'Player Registration', href: '/admin/player-registration', icon: UserPlus },
  { name: 'Social Media Partners', href: '/admin/social-media-partners', icon: Share2 },
  { name: 'Banners', href: '/admin/banners', icon: ImageIcon },
  { name: 'Footer', href: '/admin/footer', icon: Settings },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [videosMenuOpen, setVideosMenuOpen] = useState(false)
  const [ottMenuOpen, setOttMenuOpen] = useState(false)

  const isVideosActive = pathname === '/admin/videos' || pathname.startsWith('/admin/unplugged')
  const isOttActive = pathname.startsWith('/admin/ott')

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-white"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-screen lg:h-auto">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-800">
            <h1 className="text-2xl font-bold text-gradient">IWKL Admin</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const hasSubmenu = (item as any).hasSubmenu
                
                if (hasSubmenu) {
                  const submenu = (item as any).submenu
                  const isSubmenuActive = submenu.some((sub: any) => pathname === sub.href)
                  const isOttItem = item.name === 'OTT Management'
                  
                  return (
                    <li key={item.name}>
                      <button
                        onClick={() => isOttItem ? setOttMenuOpen(!ottMenuOpen) : setVideosMenuOpen(!videosMenuOpen)}
                        className={cn(
                          "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          (isVideosActive && !isOttItem) || (isOttActive && isOttItem) || isSubmenuActive
                            ? "bg-primary text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                      >
                        <div className="flex items-center">
                          <item.icon className="w-5 h-5 mr-3" />
                          {item.name}
                        </div>
                        <ChevronDown className={cn("w-4 h-4 transition-transform", (isOttItem ? ottMenuOpen : videosMenuOpen) && "rotate-180")} />
                      </button>
                      
                      {(isOttItem ? ottMenuOpen : videosMenuOpen) && (
                        <ul className="mt-1 ml-6 space-y-1">
                          {submenu.map((sub: any) => (
                            <li key={sub.name}>
                              <Link
                                href={sub.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                  "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                  pathname === sub.href
                                    ? "bg-primary/20 text-primary dark:bg-primary/30"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                )}
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  )
                }
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
