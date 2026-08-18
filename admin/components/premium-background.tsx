'use client'

import React from 'react'

export default function PremiumBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2E004F] via-[#5A008C] to-[#7A00B8]" />
      
      {/* Geometric Line Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="geometricLines" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(45)">
              <line x1="0" y1="20" x2="40" y2="20" stroke="#FFFFFF" strokeWidth="0.3"/>
              <line x1="20" y1="0" x2="20" y2="40" stroke="#FFFFFF" strokeWidth="0.3"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#geometricLines)"/>
        </svg>
      </div>

      {/* Chevron/V-Shape Pattern */}
      <div className="absolute inset-0 opacity-8">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="chevronPattern" patternUnits="userSpaceOnUse" width="60" height="60" patternTransform="rotate(30)">
              <polygon points="30,0 60,30 30,60 0,30" stroke="#FFFFFF" strokeWidth="0.2" fill="none"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#chevronPattern)"/>
        </svg>
      </div>

      {/* Diagonal Glowing Strokes */}
      <div className="absolute inset-0 opacity-15">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="diagonalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8"/>
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.8"/>
            </linearGradient>
          </defs>
          <line x1="0" y1="0" x2="100" y2="100" stroke="url(#diagonalGradient)" strokeWidth="0.5"/>
          <line x1="20" y1="0" x2="100" y2="80" stroke="url(#diagonalGradient)" strokeWidth="0.3"/>
          <line x1="0" y1="20" x2="80" y2="100" stroke="url(#diagonalGradient)" strokeWidth="0.3"/>
          <line x1="0" y1="80" x2="80" y2="0" stroke="url(#diagonalGradient)" strokeWidth="0.3"/>
          <line x1="20" y1="100" x2="100" y2="20" stroke="url(#diagonalGradient)" strokeWidth="0.3"/>
        </svg>
      </div>

      {/* Dotted Matrix Texture */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="dotMatrix" patternUnits="userSpaceOnUse" width="20" height="20">
              <circle cx="10" cy="10" r="1" fill="#FFFFFF"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#dotMatrix)"/>
        </svg>
      </div>

      {/* Abstract Digital Wave Elements */}
      <div className="absolute inset-0 opacity-6">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="digitalWave" patternUnits="userSpaceOnUse" width="80" height="80" patternTransform="rotate(15)">
              <path d="M0,40 Q20,20 40,40 T80,40" stroke="#FFFFFF" strokeWidth="0.4" fill="none"/>
              <path d="M0,50 Q20,30 40,50 T80,50" stroke="#FFFFFF" strokeWidth="0.3" fill="none"/>
              <path d="M0,60 Q20,40 40,60 T80,60" stroke="#FFFFFF" strokeWidth="0.2" fill="none"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#digitalWave)"/>
        </svg>
      </div>

      {/* Transparent Futuristic Overlays */}
      <div className="absolute inset-0 opacity-4">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="futuristicOverlay" patternUnits="userSpaceOnUse" width="100" height="100" patternTransform="rotate(20)">
              <rect x="0" y="0" width="100" height="100" stroke="#FFFFFF" strokeWidth="0.2" fill="none"/>
              <rect x="10" y="10" width="80" height="80" stroke="#FFFFFF" strokeWidth="0.15" fill="none"/>
              <rect x="20" y="20" width="60" height="60" stroke="#FFFFFF" strokeWidth="0.1" fill="none"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#futuristicOverlay)"/>
        </svg>
      </div>

      {/* Soft Lighting Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7A00B8] rounded-full filter blur-[200px] opacity-20" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#5A008C] rounded-full filter blur-[200px] opacity-20" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2E004F] rounded-full filter blur-[250px] opacity-15" />

      {/* Semi-Transparent Geometric Shapes */}
      <div className="absolute top-20 right-20 w-64 h-64 border border-white/10 rounded-full opacity-20" />
      <div className="absolute bottom-20 left-20 w-96 h-96 border border-white/10 rounded-full opacity-15" />
      <div className="absolute top-1/3 left-1/3 w-48 h-48 border border-white/10 rounded-full opacity-10" />
      
      {/* Additional Depth Layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#2E004F]/50 via-transparent to-[#7A00B8]/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#2E004F]/30 via-transparent to-[#5A008C]/30" />
    </div>
  )
}
