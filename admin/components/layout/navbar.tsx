"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/hooks'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, logout } = useAuth()
  const [localUser, setLocalUser] = useState<any>(null)

  // Check for Firestore user in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token')
    const isFirestore = token === 'firestore-token'
    
    if (isFirestore) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      // Ensure we have the name field correctly
      if (!userData.name && userData.fullName) {
        userData.name = userData.fullName
        localStorage.setItem('user', JSON.stringify(userData))
      }
      setLocalUser(userData)
    }
  }, [])

  // Use localUser for Firestore users, otherwise use backend user
  const currentUser = localUser || user

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Teams', href: '/teams' },
    { name: 'Matches', href: '/matches' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'News', href: '/news' },
    { name: 'Stats', href: '/points' },
    { name: 'Fan Club', href: '/fan-club' },
    { name: 'Contact', href: '/contact' },
  ]

  const handleLogout = () => {
    logout()
    setIsProfileOpen(false)
  }

  return (
    <nav className="bg-[#2B123A] text-white sticky top-0 z-50 shadow-lg border-b border-white/10 backdrop-blur-lg bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[#652F7A] transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <img src="/logo_image.png" alt="Company Logo" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-bold text-gradient">IWKL</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-[#7A3D92] transition-colors text-sm font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-[#652F7A] transition-colors"
                >
                  <User className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">
                    {currentUser.name || currentUser.fullName || 'User'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-white" />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#652F7A] rounded-lg shadow-xl border border-white/10">
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-white hover:bg-[#7A3D92] transition-colors"
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/dashboard/edit"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-white hover:bg-[#7A3D92] transition-colors"
                      >
                        Edit Profile
                      </Link>
                      <hr className="border-white/10" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-white hover:bg-[#7A3D92] transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-white hover:bg-[#652F7A]">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-[#7A3D92] text-white hover:bg-[#652F7A]">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#2B123A]">
          <div className="px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 rounded-lg text-white hover:bg-[#652F7A] transition-colors"
              >
                {item.name}
              </Link>
            ))}
            {currentUser ? (
              <>
                <div className="px-4 py-2 text-white font-medium">
                  {currentUser.name || currentUser.fullName || 'User'}
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 rounded-lg text-white hover:bg-[#652F7A] transition-colors"
                >
                  My Profile
                </Link>
                <Link
                  href="/dashboard/edit"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 rounded-lg text-white hover:bg-[#652F7A] transition-colors"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg text-white hover:bg-[#7A3D92] transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 rounded-lg text-white hover:bg-[#652F7A] transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 rounded-lg text-white hover:bg-[#652F7A] transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
