"use client"

import { Bell, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Header() {
  return (
    <header className="h-16 glass-card flex items-center justify-between px-6 border-0 border-b border-white/10">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10 w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-[#BFA253]"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative text-white hover:text-[#BFA253] hover:bg-white/10 transition-all duration-300">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </Button>

        {/* User menu */}
        <Button variant="ghost" size="icon" className="text-white hover:text-[#BFA253] hover:bg-white/10 transition-all duration-300">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}
