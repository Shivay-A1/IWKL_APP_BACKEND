"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Bell, User, Menu, X } from 'lucide-react'

export default function SportsHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Matches', href: '/matches' },
    { name: 'Teams', href: '/teams' },
    { name: 'Videos', href: '/videos' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'News', href: '/news' },
    { name: 'Standings', href: '/standings' },
    { name: 'Fan Club', href: '/fan-club' },
    { name: 'About', href: '/about' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#800080]/95 backdrop-blur-lg shadow-lg'
          : 'bg-gradient-to-r from-[#800080] to-[#5B006E]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="text-[#800080] font-bold text-2xl">IW</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-white font-bold text-2xl tracking-wide">IWKL</h1>
                <p className="text-[#FFD700] text-xs font-semibold tracking-wider">INDIAN WOMEN KABADDI LEAGUE</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#FFD700] rounded-full animate-pulse" />
            </button>
            <div className="hidden sm:flex items-center space-x-3">
              <Link
                href="/login"
                className="px-4 py-2 text-white hover:text-[#FFD700] transition-colors text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-[#FFD700] text-[#800080] rounded-lg font-semibold hover:bg-[#FFD700]/90 transition-all duration-200 shadow-lg text-sm"
              >
                Register
              </Link>
            </div>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#5B006E]/95 backdrop-blur-lg border-t border-white/10">
          <nav className="px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <Link
                href="/login"
                className="block px-4 py-3 text-white/90 hover:text-[#FFD700] transition-colors text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block px-4 py-3 bg-[#FFD700] text-[#800080] rounded-lg font-semibold text-center text-sm"
              >
                Register
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
