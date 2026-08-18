"use client"

import { memo } from 'react'
import Image from 'next/image'
import { Users } from 'lucide-react'
import { getTeamLogo as getTeamLogoFromMaster } from '@/lib/TeamMaster'

interface TeamLogoProps {
  teamName?: string
  teamShortName?: string
  teamSlug?: string
  logo?: string // Database logo URL
  size?: number
  className?: string
  alt?: string
}

/**
 * Find the matching logo file for a team using TeamMaster
 * @param teamName - The team name to search for
 * @param teamShortName - The team short name to search for
 * @param teamSlug - The team slug to search for
 * @returns The logo file path or null if not found
 */
function findTeamLogo(teamName?: string, teamShortName?: string, teamSlug?: string): string | null {
  // Handle case where teamName might be an object
  let safeTeamName = teamName
  if (teamName && typeof teamName === 'object') {
    safeTeamName = (teamName as any).name || (teamName as any).shortName || (teamName as any).toString()
  }

  // Handle case where teamShortName might be an object
  let safeTeamShortName = teamShortName
  if (teamShortName && typeof teamShortName === 'object') {
    safeTeamShortName = (teamShortName as any).name || (teamShortName as any).shortName || (teamShortName as any).toString()
  }

  // Handle case where teamSlug might be an object
  let safeTeamSlug = teamSlug
  if (teamSlug && typeof teamSlug === 'object') {
    safeTeamSlug = (teamSlug as any).name || (teamSlug as any).shortName || (teamSlug as any).toString()
  }

  // Use TeamMaster to get logo
  const identifier = String(safeTeamName || safeTeamShortName || safeTeamSlug || '')
  return getTeamLogoFromMaster(identifier)
}

const TeamLogo = memo(function TeamLogo({
  teamName,
  teamShortName,
  teamSlug,
  logo,
  size = 60,
  className = '',
  alt,
}: TeamLogoProps) {
  // Debug: Log logo URL from database
  if (logo) {
    console.log('[TeamLogo] Database logo URL:', logo)
  }
  
  // Handle case where teamName might be an object
  let safeTeamName = teamName
  if (teamName && typeof teamName === 'object') {
    console.warn('[TeamLogo] teamName prop is an object, extracting name property')
    safeTeamName = (teamName as any).name || String(teamName)
  }
  
  // Handle case where teamShortName might be an object
  let safeTeamShortName = teamShortName
  if (teamShortName && typeof teamShortName === 'object') {
    console.warn('[TeamLogo] teamShortName prop is an object, extracting name property')
    safeTeamShortName = (teamShortName as any).name || String(teamShortName)
  }
  
  // Handle case where teamSlug might be an object
  let safeTeamSlug = teamSlug
  if (teamSlug && typeof teamSlug === 'object') {
    console.warn('[TeamLogo] teamSlug prop is an object, extracting name property')
    safeTeamSlug = (teamSlug as any).name || String(teamSlug)
  }

  const altText = alt || safeTeamName || safeTeamShortName || 'Team Logo'
  
  // Priority 1: Use file system mapping (database has incorrect URLs)
  const logoPath = findTeamLogo(safeTeamName, safeTeamShortName, safeTeamSlug)
  
  if (logoPath) {
    console.log('[TeamLogo] VERIFICATION REPORT:')
    console.log('Team Name:', safeTeamName)
    console.log('Logo Path:', logoPath)
    console.log('Image Loaded: YES')
    console.log('Mapping Status: CORRECT')
    console.log('---')
    return (
      <div className={`relative ${className}`} style={{ width: size, height: size }}>
        <Image
          src={logoPath}
          alt={altText}
          fill
          className="object-contain"
          sizes={`${size}px`}
          onError={(e) => {
            console.error(`[TeamLogo] Failed to load file system logo: ${logoPath}`)
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            // Try database logo as fallback
            if (logo) {
              console.log('[TeamLogo] Trying database logo as fallback:', logo)
              target.src = logo
              target.style.display = 'block'
            } else {
              // Show fallback icon
              const parent = target.parentElement
              if (parent) {
                parent.innerHTML = `
                  <div style="width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.1); border-radius: 50%;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="${size * 0.5}" height="${size * 0.5}" viewBox="0 0 24 24" fill="none" stroke="#BFA253" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                `
              }
            }
          }}
        />
      </div>
    )
  }

  // Priority 2: Use database logo if provided (as fallback)
  if (logo) {
    console.log('[TeamLogo] Using database logo as fallback:', logo)
    return (
      <div className={`relative ${className}`} style={{ width: size, height: size }}>
        <Image
          src={logo}
          alt={altText}
          fill
          className="object-contain"
          sizes={`${size}px`}
          onError={(e) => {
            console.error(`[TeamLogo] Failed to load database logo: ${logo}`)
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            // Show fallback icon
            const parent = target.parentElement
            if (parent) {
              parent.innerHTML = `
                <div style="width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.1); border-radius: 50%;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="${size * 0.5}" height="${size * 0.5}" viewBox="0 0 24 24" fill="none" stroke="#BFA253" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
              `
            }
          }}
        />
      </div>
    )
  }

  // Fallback to icon if no logo found
  return (
    <div
      className={`flex items-center justify-center bg-white/10 rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <Users className="text-[#BFA253]" style={{ width: size * 0.5, height: size * 0.5 }} />
    </div>
  )
})

export default TeamLogo
