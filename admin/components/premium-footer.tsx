import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'

export default function PremiumFooter() {
  return (
    <footer className="bg-[#2E004F] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2E004F] via-[#1A0033] to-[#0D001A]" />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#800080] rounded-full filter blur-[200px] opacity-10" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#5A008C] rounded-full filter blur-[200px] opacity-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* IWKL Logo & Description */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-lg flex items-center justify-center">
                <span className="text-2xl font-black text-[#1A0033]">IW</span>
              </div>
              <span className="text-2xl font-bold text-white">IWKL</span>
            </div>
            <p className="text-[#D9D9D9] text-sm leading-relaxed">
              Indian World Kabaddi League - Empowering women through sport, strength, and leadership. The premier platform for women's kabaddi in India.
            </p>
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-[#4A004A] rounded-full flex items-center justify-center text-[#FFD700] hover:bg-[#FFD700] hover:text-[#1A0033] transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-[#4A004A] rounded-full flex items-center justify-center text-[#FFD700] hover:bg-[#FFD700] hover:text-[#1A0033] transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-[#4A004A] rounded-full flex items-center justify-center text-[#FFD700] hover:bg-[#FFD700] hover:text-[#1A0033] transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-[#4A004A] rounded-full flex items-center justify-center text-[#FFD700] hover:bg-[#FFD700] hover:text-[#1A0033] transition-all duration-300">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-[#D9D9D9] hover:text-[#FFD700] transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/videos" className="text-[#D9D9D9] hover:text-[#FFD700] transition-colors duration-300">
                  Videos
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-[#D9D9D9] hover:text-[#FFD700] transition-colors duration-300">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-[#D9D9D9] hover:text-[#FFD700] transition-colors duration-300">
                  News
                </Link>
              </li>
              <li>
                <Link href="/teams" className="text-[#D9D9D9] hover:text-[#FFD700] transition-colors duration-300">
                  Teams
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="text-[#D9D9D9] hover:text-[#FFD700] transition-colors duration-300">
                  Schedule
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#D9D9D9] hover:text-[#FFD700] transition-colors duration-300">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* League Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">League Info</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/rules" className="text-[#D9D9D9] hover:text-[#FFD700] transition-colors duration-300">
                  Rules & Regulations
                </Link>
              </li>
              <li>
                <Link href="/teams" className="text-[#D9D9D9] hover:text-[#FFD700] transition-colors duration-300">
                  Participating Teams
                </Link>
              </li>
              <li>
                <Link href="/standings" className="text-[#D9D9D9] hover:text-[#FFD700] transition-colors duration-300">
                  League Standings
                </Link>
              </li>
              <li>
                <Link href="/players" className="text-[#D9D9D9] hover:text-[#FFD700] transition-colors duration-300">
                  Player Statistics
                </Link>
              </li>
              <li>
                <Link href="/awards" className="text-[#D9D9D9] hover:text-[#FFD700] transition-colors duration-300">
                  Awards & Honors
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#FFD700] flex-shrink-0 mt-1" />
                <span className="text-[#D9D9D9] text-sm">
                  IWKL Headquarters, Sports Complex, New Delhi, India
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#FFD700] flex-shrink-0" />
                <a href="mailto:info@iwkl.com" className="text-[#D9D9D9] hover:text-[#FFD700] transition-colors duration-300 text-sm">
                  info@iwkl.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#FFD700] flex-shrink-0" />
                <a href="tel:+911234567890" className="text-[#D9D9D9] hover:text-[#FFD700] transition-colors duration-300 text-sm">
                  +91 123 456 7890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#4A004A] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-[#D9D9D9] text-sm text-center md:text-left">
              © 2024 Indian World Kabaddi League. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-[#D9D9D9] hover:text-[#FFD700] transition-colors duration-300 text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-[#D9D9D9] hover:text-[#FFD700] transition-colors duration-300 text-sm">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-[#D9D9D9] hover:text-[#FFD700] transition-colors duration-300 text-sm">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
