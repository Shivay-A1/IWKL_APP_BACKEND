"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Search, Menu, X, Instagram, Youtube, Facebook, User, Apple, ChevronDown, LogOut, Settings, UserCircle, Tv } from 'lucide-react'

export default function PremiumHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setUserDropdownOpen(false)
    router.push('/')
  }

  const getFirstName = (name: string) => {
    return name?.split(' ')[0] || name
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Matches', href: '/matches' },
    { name: 'Teams', href: '/teams' },
    { name: 'Video Hub', href: '/video-hub' },
    { name: 'IWKL Unplugged', href: '/unplugged' },
    { name: 'Standings', href: '/points' },
    { name: 'OTT', href: '/ott', icon: Tv },
    { name: 'Latest Updates', href: '/news' },
    { name: "Fan's Choice", href: '/fan-club' },
    { name: 'Player Registration', href: '/player-registration' },
    { name: 'Photos', href: '/gallery' },
    { name: 'About', href: '/about' },
  ]

  const handlePrefetch = (href: string) => {
    router.prefetch(href)
  }

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/iwkl.official' },
    { name: 'X', icon: null, href: 'https://x.com/theiwkl' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/iwkl.official' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/channel/UCDr5W4o2fuZ4Frh05UMA9fg' },
  ]

  return (
    <header className="fixed top-0 left-0 w-full z-[9999] bg-[#2A003F] shadow-lg border-b border-[#BFA253]/30">
      {/* Top Header Bar */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10">
          {/* Left Side - Empty/Minimal Spacing */}
          <div className="w-24 hidden md:block"></div>

          {/* Center - Social Media Icons */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#BFA253] transition-colors duration-300"
                title={social.name}
              >
                {social.icon ? <social.icon className="w-4 h-4" /> : <span className="font-bold text-xs">X</span>}
              </a>
            ))}
          </div>

          {/* Right Side - Login/Register or User Dropdown */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 text-white hover:text-[#BFA253] transition-colors duration-300 font-medium text-sm"
                >
                  <span>Welcome, {getFirstName(user.name)}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#2A003F] border border-[#BFA253]/30 rounded-lg shadow-xl z-50">
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-white hover:bg-[#4F1B78] hover:text-[#BFA253] transition-colors"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <UserCircle className="w-4 h-4 mr-2" />
                        My Profile
                      </Link>
                      <Link
                        href="/my-registration"
                        className="flex items-center px-4 py-2 text-white hover:bg-[#4F1B78] hover:text-[#BFA253] transition-colors"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        My Registration
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-white hover:bg-[#4F1B78] hover:text-[#BFA253] transition-colors"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                      <div className="border-t border-[#BFA253]/30 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-[#4F1B78] hover:text-red-300 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="text-white hover:text-[#BFA253] transition-colors duration-300 font-medium text-sm">
                Login / Register
              </Link>
            )}
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover:text-[#BFA253] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Separator Line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#BFA253]/30 to-transparent"></div>

      {/* Main Navigation Bar */}
      <nav className="px-4 sm:px-6 lg:px-8">
        <div className="hidden md:flex items-center justify-between h-14">
          {/* Left Side - IWKL Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.jpg"
              alt="IWKL Logo"
              width={100}
              height={100}
              className="h-14 md:h-16 lg:h-20 w-auto object-contain"
            />
          </Link>

          {/* Center - Navigation Links */}
          <div className="flex items-center space-x-2 lg:space-x-4 xl:space-x-6 overflow-x-auto no-scrollbar flex-1 mx-4 lg:mx-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onMouseEnter={() => handlePrefetch(link.href)}
                className={`relative flex items-center space-x-1 transition-all duration-300 font-medium text-xs lg:text-sm group whitespace-nowrap flex-shrink-0 ${
                  link.name === 'OTT' 
                    ? 'text-[#BFA253] border-2 border-[#BFA253] rounded-lg px-2 py-1 lg:px-3 lg:py-1 hover:bg-[#BFA253]/10' 
                    : 'text-white hover:text-[#BFA253]'
                }`}
              >
                {link.icon && <link.icon className="w-3 h-3 lg:w-4 lg:h-4" />}
                <span>{link.name}</span>
                {link.name !== 'OTT' && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#BFA253] transition-all duration-300 group-hover:w-full"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Right Side - Search Icon */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-white hover:text-[#BFA253] transition-colors duration-300 flex-shrink-0"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Search Bar */}
      {searchOpen && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#BFA253] transition-colors"
            autoFocus
          />
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#2A003F] border-t border-[#BFA253]/20">
          <div className="px-4 py-4 space-y-3">
            {/* Mobile Logo */}
            <Link href="/" className="flex justify-center mb-4">
              <Image
                src="/logo.jpg"
                alt="IWKL Logo"
                width={48}
                height={48}
                className="h-12 w-auto object-contain"
              />
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center space-x-2 transition-colors duration-300 font-medium py-2 border-b border-[#BFA253]/20 last:border-0 ${
                  link.name === 'OTT' ? 'text-[#BFA253]' : 'text-white hover:text-[#BFA253]'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                <span>{link.name}</span>
              </Link>
            ))}
            {/* Mobile Social Icons */}
            <div className="flex items-center justify-center space-x-4 pt-4 border-t border-[#BFA253]/20">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#BFA253] transition-colors duration-300"
                  title={social.name}
                >
                  {social.icon ? <social.icon className="w-4 h-4" /> : <span className="font-bold text-xs">X</span>}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
