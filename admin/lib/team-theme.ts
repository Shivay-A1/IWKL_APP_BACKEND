/**
 * Team Theme Utility
 * Returns team-specific colors and gradients based on team name
 * 
 * DEPRECATED: This file now uses TeamMaster as the single source of truth.
 * All team data is centralized in lib/TeamMaster.ts
 * 
 * @deprecated Use getTeamColors() from lib/TeamMaster.ts instead
 */

import { getTeam, getTeamColors as getTeamColorsFromMaster } from './TeamMaster'

export interface TeamTheme {
  primaryColor: string
  secondaryColor: string
  gradient: string
  accentColor: string
}

// Default theme for unknown teams
const DEFAULT_THEME: TeamTheme = {
  primaryColor: '#800080',
  secondaryColor: '#9333EA',
  gradient: 'linear-gradient(135deg, #800080 0%, #9333EA 50%, #A855F7 100%)',
  accentColor: '#FFD700',
}

/**
 * Get team theme based on team name
 * @param teamName - The team name to search for
 * @param teamShortName - The team short name to search for
 * @param teamSlug - The team slug to search for
 * @returns Team theme object with colors and gradient
 */
export function getTeamTheme(
  teamName?: string,
  teamShortName?: string,
  teamSlug?: string
): TeamTheme {
  // Try to get team from TeamMaster using any identifier
  const team = getTeam(teamName || teamShortName || teamSlug || '')
  
  if (team) {
    return {
      primaryColor: team.primaryColor,
      secondaryColor: team.secondaryColor,
      gradient: team.gradient,
      accentColor: team.accentColor,
    }
  }

  // Log missing team for debugging
  if (teamName || teamShortName || teamSlug) {
    console.warn(`[TeamTheme] No theme found for team:`, {
      teamName,
      teamShortName,
      teamSlug,
    })
  }

  return DEFAULT_THEME
}

/**
 * Get all available team themes
 * @returns Object with all team themes
 * @deprecated Use getAllTeams() from lib/TeamMaster.ts instead
 */
export function getAllTeamThemes(): Record<string, TeamTheme> {
  const { getAllTeams } = require('./TeamMaster')
  const teams = getAllTeams()
  const themes: Record<string, TeamTheme> = {}
  
  teams.forEach((team: any) => {
    themes[team.name.toLowerCase()] = {
      primaryColor: team.primaryColor,
      secondaryColor: team.secondaryColor,
      gradient: team.gradient,
      accentColor: team.accentColor,
    }
  })
  
  return themes
}
