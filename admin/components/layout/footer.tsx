"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, User, FileText } from 'lucide-react'

export default function Footer() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
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
  return (
    <footer className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2B0A45 0%, #4F1B78 50%, #2B0A45 100%)' }}>
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#BFA253] rounded-full filter blur-[200px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#BFA253] rounded-full filter blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-12 mb-12">
          {/* Column 1: SPACOR SPORTS */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-[#BFA253] mb-3">SPACOR SPORTS</h2>
              <p className="text-white/80 text-sm leading-relaxed">
                Building the Future of Sports Ecosystems
              </p>
            </div>
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a href="https://facebook.com/iwkl.official" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#2B0A45] border border-[#BFA253]/30 rounded-lg flex items-center justify-center text-[#BFA253] hover:bg-[#BFA253] hover:text-[#2B0A45] transition-all duration-300 hover:scale-110 transform">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://x.com/theiwkl" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#2B0A45] border border-[#BFA253]/30 rounded-lg flex items-center justify-center text-[#BFA253] hover:bg-[#BFA253] hover:text-[#2B0A45] transition-all duration-300 hover:scale-110 transform">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/iwkl.official" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#2B0A45] border border-[#BFA253]/30 rounded-lg flex items-center justify-center text-[#BFA253] hover:bg-[#BFA253] hover:text-[#2B0A45] transition-all duration-300 hover:scale-110 transform">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com/channel/UCDr5W4o2fuZ4Frh05UMA9fg" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#2B0A45] border border-[#BFA253]/30 rounded-lg flex items-center justify-center text-[#BFA253] hover:bg-[#BFA253] hover:text-[#2B0A45] transition-all duration-300 hover:scale-110 transform">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[#BFA253] uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-white/80 hover:text-[#BFA253] transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/matches" className="text-white/80 hover:text-[#BFA253] transition-colors duration-300">
                  Matches
                </Link>
              </li>
              <li>
                <Link href="/teams" className="text-white/80 hover:text-[#BFA253] transition-colors duration-300">
                  Teams
                </Link>
              </li>
              <li>
                <Link href="/points" className="text-white/80 hover:text-[#BFA253] transition-colors duration-300">
                  Standings
                </Link>
              </li>
              <li>
                <Link href="/stats" className="text-white/80 hover:text-[#BFA253] transition-colors duration-300">
                  Stats
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: League */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[#BFA253] uppercase tracking-wider">League</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/unplugged" className="text-white/80 hover:text-[#BFA253] transition-colors duration-300">
                  IWKL Unplugged
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-white/80 hover:text-[#BFA253] transition-colors duration-300">
                  Latest Updates
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-white/80 hover:text-[#BFA253] transition-colors duration-300">
                  Photos
                </Link>
              </li>
              <li>
                <Link href="/fan-club" className="text-white/80 hover:text-[#BFA253] transition-colors duration-300">
                  Fan's Choice
                </Link>
              </li>
              <li>
                <Link href="/player-registration" className="text-white/80 hover:text-[#BFA253] transition-colors duration-300">
                  Player Registration
                </Link>
              </li>
              <li>
                <Link href="/social-media-partner-registration" className="text-white/80 hover:text-[#BFA253] transition-colors duration-300">
                  Social Media Partners
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: User Account (only if logged in) */}
          {user && (
            <div>
              <h3 className="text-lg font-semibold mb-6 text-[#BFA253] uppercase tracking-wider">My Account</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/profile" className="text-white/80 hover:text-[#BFA253] transition-colors duration-300 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link href="/my-registration" className="text-white/80 hover:text-[#BFA253] transition-colors duration-300 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    My Registration
                  </Link>
                </li>
                <li>
                  <Link href="/my-registration" className="text-white/80 hover:text-[#BFA253] transition-colors duration-300 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Application Tracking
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {/* Column 4: Contact (if not logged in) */}
          {!user && (
            <div>
              <h3 className="text-lg font-semibold mb-6 text-[#BFA253] uppercase tracking-wider">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-[#BFA253] flex-shrink-0 mt-1" />
                  <div className="text-white/80 text-sm">
                    <a href="mailto:Contact@iwkl.org" className="hover:text-[#BFA253] transition-colors duration-300">
                      Contact@iwkl.org
                    </a>
                    <br />
                    <a href="mailto:Spacorsports@gmail.com" className="hover:text-[#BFA253] transition-colors duration-300">
                      Spacorsports@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#BFA253] flex-shrink-0 mt-1" />
                  <span className="text-white/80 text-sm">
                    A-901, Ansal Tanushree,<br />
                    NH-24, Ghaziabad - 201002,<br />
                    Uttar Pradesh, India
                  </span>
                </li>
              </ul>
            </div>
          )}

          {/* Column 5: Help */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[#BFA253] uppercase tracking-wider">Help</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-[#BFA253] flex-shrink-0 mt-1" />
                <a href="mailto:shivamdube7985@gmail.com" className="text-white/80 hover:text-[#BFA253] transition-colors duration-300 text-sm">
                  shivamdube7985@gmail.com
                </a>
              </li>
              <li className="text-white/70 text-xs mt-4 leading-relaxed">
                Facing any login or signup issues? Send us an email and we'll help you out.
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright Section */}
        <div className="border-t border-[#BFA253]/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-white/80 text-sm">
                © 2026 SPACOR SPORTS. All Rights Reserved.
              </p>
              <p className="text-white/60 text-xs mt-2">
                Indian Women's Kabaddi League (IWKL) is a property managed by SPACOR SPORTS.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-white/80 hover:text-[#BFA253] transition-colors duration-300 text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/80 hover:text-[#BFA253] transition-colors duration-300 text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
