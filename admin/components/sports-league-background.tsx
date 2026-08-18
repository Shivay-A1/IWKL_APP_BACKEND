'use client'

import React from 'react'

export default function SportsLeagueBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base Gradient - Deep Royal Purple to Electric Magenta */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A0033] via-[#4A0080] to-[#FF00FF]" />
      
      {/* Secondary Gradient Layer */}
      <div className="absolute inset-0 bg-gradient-to-tl from-[#2E004F] via-[#5A008C] to-[#8B008B] opacity-60" />
      
      {/* Dynamic Energy Trails */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="energyTrail1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF00FF" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#4A0080" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="energyTrail2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF00FF" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#8B008B" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d="M0,50 Q25,30 50,50 T100,50" stroke="url(#energyTrail1)" strokeWidth="0.8" fill="none"/>
          <path d="M0,60 Q25,40 50,60 T100,60" stroke="url(#energyTrail2)" strokeWidth="0.6" fill="none"/>
          <path d="M0,40 Q25,20 50,40 T100,40" stroke="url(#energyTrail1)" strokeWidth="0.5" fill="none"/>
          <path d="M10,0 Q30,50 10,100" stroke="url(#energyTrail2)" strokeWidth="0.4" fill="none"/>
          <path d="M90,0 Q70,50 90,100" stroke="url(#energyTrail1)" strokeWidth="0.4" fill="none"/>
        </svg>
      </div>

      {/* Motion Streaks */}
      <div className="absolute inset-0 opacity-15">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="motionStreak" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0"/>
              <stop offset="50%" stopColor="#FF00FF" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <line x1="0" y1="10" x2="100" y2="90" stroke="url(#motionStreak)" strokeWidth="0.3"/>
          <line x1="0" y1="30" x2="100" y2="70" stroke="url(#motionStreak)" strokeWidth="0.4"/>
          <line x1="0" y1="50" x2="100" y2="50" stroke="url(#motionStreak)" strokeWidth="0.5"/>
          <line x1="0" y1="70" x2="100" y2="30" stroke="url(#motionStreak)" strokeWidth="0.4"/>
          <line x1="0" y1="90" x2="100" y2="10" stroke="url(#motionStreak)" strokeWidth="0.3"/>
        </svg>
      </div>

      {/* Glowing Arena Lights */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-[#FF00FF] rounded-full filter blur-[150px] opacity-25" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#8B008B] rounded-full filter blur-[150px] opacity-20" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#4A0080] rounded-full filter blur-[200px] opacity-15" />
      <div className="absolute top-20 right-20 w-60 h-60 bg-[#FF00FF] rounded-full filter blur-[120px] opacity-15" />
      <div className="absolute bottom-20 left-20 w-60 h-60 bg-[#8B008B] rounded-full filter blur-[120px] opacity-15" />

      {/* Stadium Atmosphere - Abstract Architecture */}
      <div className="absolute inset-0 opacity-8">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="stadiumArch" patternUnits="userSpaceOnUse" width="80" height="80" patternTransform="rotate(10)">
              <path d="M0,80 Q40,20 80,80" stroke="#FFFFFF" strokeWidth="0.3" fill="none"/>
              <path d="M0,70 Q40,10 80,70" stroke="#FFFFFF" strokeWidth="0.2" fill="none"/>
              <path d="M0,60 Q40,0 80,60" stroke="#FFFFFF" strokeWidth="0.15" fill="none"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#stadiumArch)"/>
        </svg>
      </div>

      {/* Abstract Player Movement Paths */}
      <div className="absolute inset-0 opacity-12">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="movementPath" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF00FF" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#4A0080" stopOpacity="0.2"/>
            </linearGradient>
          </defs>
          <path d="M10,10 Q30,40 50,20 T90,30" stroke="url(#movementPath)" strokeWidth="0.5" fill="none" strokeDasharray="2,2"/>
          <path d="M10,90 Q30,60 50,80 T90,70" stroke="url(#movementPath)" strokeWidth="0.5" fill="none" strokeDasharray="2,2"/>
          <path d="M20,10 Q40,30 60,10 T80,20" stroke="url(#movementPath)" strokeWidth="0.4" fill="none" strokeDasharray="3,3"/>
          <path d="M20,90 Q40,70 60,90 T80,80" stroke="url(#movementPath)" strokeWidth="0.4" fill="none" strokeDasharray="3,3"/>
        </svg>
      </div>

      {/* Speed Lines */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="speedLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0"/>
              <stop offset="50%" stopColor="#FF00FF" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <line x1="0" y1="20" x2="100" y2="20" stroke="url(#speedLine)" strokeWidth="0.2"/>
          <line x1="0" y1="40" x2="100" y2="40" stroke="url(#speedLine)" strokeWidth="0.3"/>
          <line x1="0" y1="60" x2="100" y2="60" stroke="url(#speedLine)" strokeWidth="0.3"/>
          <line x1="0" y1="80" x2="100" y2="80" stroke="url(#speedLine)" strokeWidth="0.2"/>
        </svg>
      </div>

      {/* Digital Particle Effects */}
      <div className="absolute inset-0 opacity-6">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="particleGrid" patternUnits="userSpaceOnUse" width="30" height="30">
              <circle cx="15" cy="15" r="1.5" fill="#FF00FF" opacity="0.6"/>
              <circle cx="0" cy="0" r="1" fill="#8B008B" opacity="0.4"/>
              <circle cx="30" cy="0" r="1" fill="#8B008B" opacity="0.4"/>
              <circle cx="0" cy="30" r="1" fill="#8B008B" opacity="0.4"/>
              <circle cx="30" cy="30" r="1" fill="#8B008B" opacity="0.4"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#particleGrid)"/>
        </svg>
      </div>

      {/* Geometric Sports-Inspired Patterns */}
      <div className="absolute inset-0 opacity-8">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="sportsPattern" patternUnits="userSpaceOnUse" width="50" height="50" patternTransform="rotate(25)">
              <polygon points="25,0 50,25 25,50 0,25" stroke="#FFFFFF" strokeWidth="0.2" fill="none"/>
              <circle cx="25" cy="25" r="15" stroke="#FF00FF" strokeWidth="0.15" fill="none"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#sportsPattern)"/>
        </svg>
      </div>

      {/* Digital Mesh Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="digitalMesh" patternUnits="userSpaceOnUse" width="40" height="40">
              <rect x="0" y="0" width="40" height="40" stroke="#FFFFFF" strokeWidth="0.1" fill="none"/>
              <rect x="10" y="10" width="20" height="20" stroke="#FF00FF" strokeWidth="0.1" fill="none"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#digitalMesh)"/>
        </svg>
      </div>

      {/* Energy Waves */}
      <div className="absolute inset-0 opacity-7">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="energyWave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF00FF" stopOpacity="0"/>
              <stop offset="50%" stopColor="#8B008B" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#FF00FF" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d="M0,25 Q25,15 50,25 T100,25" stroke="url(#energyWave)" strokeWidth="0.4" fill="none"/>
          <path d="M0,50 Q25,40 50,50 T100,50" stroke="url(#energyWave)" strokeWidth="0.5" fill="none"/>
          <path d="M0,75 Q25,65 50,75 T100,75" stroke="url(#energyWave)" strokeWidth="0.4" fill="none"/>
        </svg>
      </div>

      {/* Subtle Crowd Light Effects */}
      <div className="absolute inset-0 opacity-4">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="crowdLights" patternUnits="userSpaceOnUse" width="25" height="25">
              <circle cx="12.5" cy="12.5" r="2" fill="#FFFFFF" opacity="0.3"/>
              <circle cx="0" cy="0" r="1.5" fill="#FF00FF" opacity="0.2"/>
              <circle cx="25" cy="0" r="1.5" fill="#FF00FF" opacity="0.2"/>
              <circle cx="0" cy="25" r="1.5" fill="#FF00FF" opacity="0.2"/>
              <circle cx="25" cy="25" r="1.5" fill="#FF00FF" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#crowdLights)"/>
        </svg>
      </div>

      {/* Neon Light Trails */}
      <div className="absolute inset-0 opacity-12">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="neonTrail" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF00FF" stopOpacity="0.8"/>
              <stop offset="50%" stopColor="#8B008B" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#4A0080" stopOpacity="0.2"/>
            </linearGradient>
          </defs>
          <path d="M0,0 L100,100" stroke="url(#neonTrail)" strokeWidth="0.6" fill="none"/>
          <path d="M100,0 L0,100" stroke="url(#neonTrail)" strokeWidth="0.6" fill="none"/>
          <path d="M50,0 L50,100" stroke="url(#neonTrail)" strokeWidth="0.4" fill="none"/>
          <path d="M0,50 L100,50" stroke="url(#neonTrail)" strokeWidth="0.4" fill="none"/>
        </svg>
      </div>

      {/* Spotlight Effects */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-[#FF00FF]/30 to-transparent rounded-full filter blur-[80px]" />
        <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-bl from-[#8B008B]/30 to-transparent rounded-full filter blur-[80px]" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-tr from-[#4A0080]/30 to-transparent rounded-full filter blur-[80px]" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-tl from-[#FF00FF]/30 to-transparent rounded-full filter blur-[80px]" />
      </div>

      {/* Layered Lighting */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A0033]/70 via-transparent to-[#FF00FF]/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#2E004F]/50 via-transparent to-[#8B008B]/50" />
      <div className="absolute inset-0 bg-gradient-to-bl from-[#4A0080]/40 via-transparent to-[#FF00FF]/30" />

      {/* Futuristic Sports Technology Visuals */}
      <div className="absolute inset-0 opacity-6">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="techPattern" patternUnits="userSpaceOnUse" width="60" height="60" patternTransform="rotate(15)">
              <rect x="0" y="0" width="60" height="60" stroke="#FFFFFF" strokeWidth="0.15" fill="none"/>
              <rect x="10" y="10" width="40" height="40" stroke="#FF00FF" strokeWidth="0.1" fill="none"/>
              <line x1="0" y1="30" x2="60" y2="30" stroke="#8B008B" strokeWidth="0.1"/>
              <line x1="30" y1="0" x2="30" y2="60" stroke="#8B008B" strokeWidth="0.1"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#techPattern)"/>
        </svg>
      </div>

      {/* Semi-Transparent Geometric Shapes */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 border border-white/10 rounded-full opacity-20" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-white/10 rounded-full opacity-15" />
      <div className="absolute top-1/3 right-1/3 w-48 h-48 border border-white/10 rounded-full opacity-10" />
      <div className="absolute bottom-1/3 left-1/3 w-56 h-56 border border-white/10 rounded-full opacity-12" />

      {/* Additional Depth Layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2E004F]/20 to-[#1A0033]/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#5A008C]/15 to-transparent" />
    </div>
  )
}
