'use client'

import React, { useState, useEffect } from 'react'
import { Trophy, Users, Calendar, Target } from 'lucide-react'

interface StatCardProps {
  icon: React.ElementType
  value: string
  label: string
  delay: number
}

function StatCard({ icon: Icon, value, label, delay }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState('0')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!isVisible) return

    const numericValue = parseInt(value.replace(/\D/g, ''))
    const hasPlus = value.includes('+')
    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const currentValue = Math.floor(numericValue * progress)
      
      setDisplayValue(hasPlus ? `${currentValue}+` : currentValue.toString())

      if (currentStep >= steps) {
        clearInterval(timer)
        setDisplayValue(value)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [isVisible, value])

  return (
    <div className="group relative backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-110 hover:shadow-[0_0_60px_rgba(255,215,0,0.4)]">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
          <Icon className="w-8 h-8 text-[#1A0033]" />
        </div>
        <div className="text-5xl md:text-6xl font-black text-white mb-2 group-hover:text-[#FFD700] transition-colors duration-300">
          {displayValue}
        </div>
        <div className="text-sm text-[#D9D9D9] font-semibold uppercase tracking-wider">
          {label}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/0 to-[#FFD700]/0 group-hover:from-[#FFD700]/10 group-hover:to-[#FFD700]/5 rounded-3xl transition-all duration-500 pointer-events-none"></div>
    </div>
  )
}

export default function AnimatedStatCounter() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
      <StatCard icon={Trophy} value="8" label="Teams" delay={0} />
      <StatCard icon={Users} value="120+" label="Players" delay={200} />
      <StatCard icon={Calendar} value="32" label="Matches" delay={400} />
      <StatCard icon={Target} value="16" label="Thrilling Days" delay={600} />
    </div>
  )
}
