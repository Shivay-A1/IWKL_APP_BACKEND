/**
 * TeamMaster - CENTRALIZED TEAM MANAGEMENT SYSTEM
 * 
 * This is the ONLY official source of truth for all team-related data.
 * No component should use hardcoded team names, logos, colors, or slugs.
 * Everything must pass through TeamMaster.
 * 
 * OFFICIAL IWKL TEAMS:
 * - Ayodhya Shakti
 * - Delhi Warriors
 * - Garvi Gujarat
 * - Haryanvi Fighters
 * - Kashmiri Queens
 * - Kolkata Rangers
 * - Mumbai Strikers
 * - Namma Bengaluru
 * - Odisha Kalingas
 * - Punjab Wings
 */

export interface TeamConfig {
  // Official team name (exact match required)
  name: string
  
  // Short code for API normalization (AYO, DEL, etc.)
  shortCode: string
  
  // URL-friendly slug
  slug: string
  
  // Logo file path in /public/team-logos/
  logoPath: string
  
  // Team colors
  primaryColor: string
  secondaryColor: string
  accentColor: string
  lightColor: string
  darkColor: string
  
  // CSS gradient string
  gradient: string
  
  // City/Location
  city: string
  
  // Team Statistics
  matchesPlayed?: number
  wins?: number
  points?: number
  highestScore?: number
}

// Official IWKL Teams Configuration
export const TEAMS: TeamConfig[] = [
  {
    name: 'Ayodhya Shakti',
    shortCode: 'AYO',
    slug: 'ayodhya-shakti',
    logoPath: '/team-logos/Ayodhya_shakti.jpeg',
    primaryColor: '#B2291A',
    secondaryColor: '#5C0D0D',
    accentColor: '#F39C12',
    lightColor: '#FDE8D0',
    darkColor: '#3D0A08',
    gradient: 'linear-gradient(135deg, #B2291A 0%, #5C0D0D 50%, #F39C12 100%)',
    city: 'Ayodhya',
    matchesPlayed: 0,
    wins: 0,
    points: 0,
    highestScore: 0,
  },
  {
    name: 'Delhi Warriors',
    shortCode: 'DEL',
    slug: 'delhi-warriors',
    logoPath: '/team-logos/Delhi_warriors.jpeg',
    primaryColor: '#2E4DA7',
    secondaryColor: '#1B2E73',
    accentColor: '#E53935',
    lightColor: '#E3F2FD',
    darkColor: '#0D1B3A',
    gradient: 'linear-gradient(135deg, #2E4DA7 0%, #1B2E73 50%, #E53935 100%)',
    city: 'Delhi',
    matchesPlayed: 0,
    wins: 0,
    points: 0,
    highestScore: 0,
  },
  {
    name: 'Garvi Gujarat',
    shortCode: 'GGU',
    slug: 'garvi-gujarat',
    logoPath: '/team-logos/Garvi_Gujarat.jpeg',
    primaryColor: '#B95C28',
    secondaryColor: '#7A3413',
    accentColor: '#F7B84B',
    lightColor: '#FFF3E0',
    darkColor: '#4A1F0A',
    gradient: 'linear-gradient(135deg, #B95C28 0%, #7A3413 50%, #F7B84B 100%)',
    city: 'Gujarat',
    matchesPlayed: 0,
    wins: 0,
    points: 0,
    highestScore: 0,
  },
  {
    name: 'Haryanvi Fighters',
    shortCode: 'HAR',
    slug: 'haryanvi-fighters',
    logoPath: '/team-logos/Haryanvi_fighters.jpeg',
    primaryColor: '#0F5B57',
    secondaryColor: '#083C39',
    accentColor: '#9FE8DD',
    lightColor: '#E0F7FA',
    darkColor: '#04201E',
    gradient: 'linear-gradient(135deg, #0F5B57 0%, #083C39 50%, #9FE8DD 100%)',
    city: 'Haryana',
    matchesPlayed: 0,
    wins: 0,
    points: 0,
    highestScore: 0,
  },
  {
    name: 'Kashmiri Queens',
    shortCode: 'KAS',
    slug: 'kashmiri-queens',
    logoPath: '/team-logos/Kashmiri_Queens.jpeg',
    primaryColor: '#5A3D8C',
    secondaryColor: '#2F184F',
    accentColor: '#C7A54A',
    lightColor: '#F3E5F5',
    darkColor: '#1A0D2E',
    gradient: 'linear-gradient(135deg, #5A3D8C 0%, #2F184F 50%, #C7A54A 100%)',
    city: 'Kashmir',
    matchesPlayed: 0,
    wins: 0,
    points: 0,
    highestScore: 0,
  },
  {
    name: 'Kolkata Rangers',
    shortCode: 'KOL',
    slug: 'kolkata-rangers',
    logoPath: '/team-logos/Kolkata_rengers.jpeg',
    primaryColor: '#1C233D',
    secondaryColor: '#0E1327',
    accentColor: '#F59E0B',
    lightColor: '#E8EBF0',
    darkColor: '#0A0C17',
    gradient: 'linear-gradient(135deg, #1C233D 0%, #0E1327 50%, #F59E0B 100%)',
    city: 'Kolkata',
    matchesPlayed: 0,
    wins: 0,
    points: 0,
    highestScore: 0,
  },
  {
    name: 'Mumbai Strikers',
    shortCode: 'MUM',
    slug: 'mumbai-strikers',
    logoPath: '/team-logos/mumbai_strkerrs.jpeg',
    primaryColor: '#4AA8E0',
    secondaryColor: '#1E6FAF',
    accentColor: '#FFFFFF',
    lightColor: '#E1F5FE',
    darkColor: '#0D3A5F',
    gradient: 'linear-gradient(135deg, #4AA8E0 0%, #1E6FAF 50%, #FFFFFF 100%)',
    city: 'Mumbai',
    matchesPlayed: 0,
    wins: 0,
    points: 0,
    highestScore: 0,
  },
  {
    name: 'Namma Bengaluru',
    shortCode: 'BEN',
    slug: 'namma-bengaluru',
    logoPath: '/team-logos/Namma_Bengaluru.jpeg',
    primaryColor: '#E8D21A',
    secondaryColor: '#C91F2C',
    accentColor: '#1B3F91',
    lightColor: '#FFFDE7',
    darkColor: '#0F1220',
    gradient: 'linear-gradient(135deg, #E8D21A 0%, #C91F2C 50%, #1B3F91 100%)',
    city: 'Bengaluru',
    matchesPlayed: 0,
    wins: 0,
    points: 0,
    highestScore: 0,
  },
  {
    name: 'Odisha Kalingas',
    shortCode: 'ODI',
    slug: 'odisha-kalingas',
    logoPath: '/team-logos/Odisha_Kalingas.jpeg',
    primaryColor: '#8B4513',
    secondaryColor: '#2B1147',
    accentColor: '#D4AF37',
    lightColor: '#F2D06B',
    darkColor: '#140A23',
    gradient: 'linear-gradient(135deg, #8B4513 0%, #2B1147 50%, #D4AF37 100%)',
    city: 'Odisha',
    matchesPlayed: 0,
    wins: 0,
    points: 0,
    highestScore: 0,
  },
  {
    name: 'Punjab Wings',
    shortCode: 'PUN',
    slug: 'punjab-wings',
    logoPath: '/team-logos/Punjab_wiings.jpeg',
    primaryColor: '#5B2C83',
    secondaryColor: '#3B1B5A',
    accentColor: '#D6B35A',
    lightColor: '#F3E5F5',
    darkColor: '#24083D',
    gradient: 'linear-gradient(135deg, #5B2C83 0%, #3B1B5A 50%, #D6B35A 100%)',
    city: 'Punjab',
    matchesPlayed: 0,
    wins: 0,
    points: 0,
    highestScore: 0,
  },
]

// Lookup maps for fast access
const TEAM_BY_NAME: Record<string, TeamConfig> = {}
const TEAM_BY_SHORT_CODE: Record<string, TeamConfig> = {}
const TEAM_BY_SLUG: Record<string, TeamConfig> = {}

// Initialize lookup maps
TEAMS.forEach(team => {
  TEAM_BY_NAME[team.name.toLowerCase()] = team
  TEAM_BY_SHORT_CODE[team.shortCode] = team
  TEAM_BY_SLUG[team.slug] = team
})

/**
 * Get team configuration by name
 * @param name - Team name (case-insensitive)
 * @returns TeamConfig or null if not found
 */
export function getTeamByName(name: string): TeamConfig | null {
  if (!name) return null
  return TEAM_BY_NAME[name.toLowerCase()] || null
}

/**
 * Get team configuration by short code
 * @param shortCode - Team short code (e.g., 'AYO', 'DEL')
 * @returns TeamConfig or null if not found
 */
export function getTeamByShortCode(shortCode: string): TeamConfig | null {
  if (!shortCode) return null
  return TEAM_BY_SHORT_CODE[shortCode.toUpperCase()] || null
}

/**
 * Get team configuration by slug
 * @param slug - Team slug (e.g., 'ayodhya-shakti')
 * @returns TeamConfig or null if not found
 */
export function getTeamBySlug(slug: string): TeamConfig | null {
  if (!slug) return null
  return TEAM_BY_SLUG[slug] || null
}

/**
 * Get team configuration by any identifier
 * Tries name, short code, and slug in order
 * @param identifier - Any team identifier
 * @returns TeamConfig or null if not found
 */
export function getTeam(identifier: string): TeamConfig | null {
  if (!identifier) return null
  
  // Try as name
  const byName = getTeamByName(identifier)
  if (byName) return byName
  
  // Try as short code
  const byShortCode = getTeamByShortCode(identifier)
  if (byShortCode) return byShortCode
  
  // Try as slug
  const bySlug = getTeamBySlug(identifier)
  if (bySlug) return bySlug
  
  return null
}

/**
 * Get all teams
 * @returns Array of all team configurations
 */
export function getAllTeams(): TeamConfig[] {
  return [...TEAMS]
}

/**
 * Get team logo path
 * @param identifier - Team name, short code, or slug
 * @returns Logo path or null if not found
 */
export function getTeamLogo(identifier: string): string | null {
  const team = getTeam(identifier)
  return team ? team.logoPath : null
}

/**
 * Get team colors
 * @param identifier - Team name, short code, or slug
 * @returns Team colors or null if not found
 */
export function getTeamColors(identifier: string): Pick<TeamConfig, 'primaryColor' | 'secondaryColor' | 'accentColor' | 'lightColor' | 'darkColor' | 'gradient'> | null {
  const team = getTeam(identifier)
  if (!team) return null
  
  return {
    primaryColor: team.primaryColor,
    secondaryColor: team.secondaryColor,
    accentColor: team.accentColor,
    lightColor: team.lightColor,
    darkColor: team.darkColor,
    gradient: team.gradient,
  }
}

/**
 * Normalize API response team data
 * Converts short codes to full team names before rendering
 * Keeps all teams (doesn't filter out non-official teams)
 * Removes duplicates
 * @param teamData - Team data from API (may contain short codes)
 * @returns Normalized team data with official names from TeamMaster where available
 */
export function normalizeTeamData(teamData: any): any {
  if (!teamData) return teamData
  
  // Handle array of teams
  if (Array.isArray(teamData)) {
    const normalizedTeams = teamData.map(team => normalizeTeamData(team))
    // Remove duplicates by team name
    const uniqueTeams = Array.from(new Map(normalizedTeams.map(team => [team.name, team])).values())
    return uniqueTeams
  }
  
  // Handle single team object
  const normalized = { ...teamData }
  
  // Handle points table entries with nested team object
  if (normalized.team && typeof normalized.team === 'object') {
    const teamName = normalized.team.name
    const officialTeam = getTeamByName(teamName)
    
    if (officialTeam) {
      // Update nested team object with official data
      normalized.team.name = officialTeam.name
      normalized.team.shortName = officialTeam.shortCode
      normalized.team.logo = officialTeam.logoPath
      // Also set top-level name for deduplication
      normalized.name = officialTeam.name
      return normalized
    } else {
      // Team is not official, keep it as-is
      return normalized
    }
  }
  
  // If team has a shortCode, use it to get official data ONLY as fallback
  if (normalized.shortCode || normalized.shortName) {
    const shortCode = (normalized.shortCode || normalized.shortName).toUpperCase()
    const officialTeam = getTeamByShortCode(shortCode)
    
    if (officialTeam) {
      // Only use static data if API data is missing - don't override API data
      if (!normalized.name) normalized.name = officialTeam.name
      if (!normalized.slug) normalized.slug = officialTeam.slug
      if (!normalized.logo && !normalized.logoPath) normalized.logoPath = officialTeam.logoPath
      if (!normalized.primaryColor && !normalized.jerseyColor) normalized.primaryColor = officialTeam.primaryColor
      if (!normalized.secondaryColor) normalized.secondaryColor = officialTeam.secondaryColor
      if (!normalized.accentColor) normalized.accentColor = officialTeam.accentColor
      if (!normalized.gradient) normalized.gradient = officialTeam.gradient
      // Don't override stats from API
      if (normalized.matchesPlayed === undefined || normalized.matchesPlayed === null) normalized.matchesPlayed = officialTeam.matchesPlayed
      if (normalized.wins === undefined || normalized.wins === null) normalized.wins = officialTeam.wins
      if (normalized.points === undefined || normalized.points === null) normalized.points = officialTeam.points
      if (normalized.highestScore === undefined || normalized.highestScore === null) normalized.highestScore = officialTeam.highestScore
      return normalized
    }
  }
  
  // If team has a name but no shortCode, try to find by name (case-insensitive)
  if (normalized.name) {
    const officialTeam = getTeamByName(normalized.name)
    if (officialTeam) {
      // Only use static data if API data is missing - don't override API data
      if (!normalized.shortCode) normalized.shortCode = officialTeam.shortCode
      if (!normalized.slug) normalized.slug = officialTeam.slug
      if (!normalized.logo && !normalized.logoPath) normalized.logoPath = officialTeam.logoPath
      if (!normalized.primaryColor && !normalized.jerseyColor) normalized.primaryColor = officialTeam.primaryColor
      if (!normalized.secondaryColor) normalized.secondaryColor = officialTeam.secondaryColor
      if (!normalized.accentColor) normalized.accentColor = officialTeam.accentColor
      if (!normalized.gradient) normalized.gradient = officialTeam.gradient
      // Don't override stats from API
      if (normalized.matchesPlayed === undefined || normalized.matchesPlayed === null) normalized.matchesPlayed = officialTeam.matchesPlayed
      if (normalized.wins === undefined || normalized.wins === null) normalized.wins = officialTeam.wins
      if (normalized.points === undefined || normalized.points === null) normalized.points = officialTeam.points
      if (normalized.highestScore === undefined || normalized.highestScore === null) normalized.highestScore = officialTeam.highestScore
      return normalized
    }
  }
  
  // If team is not official, return it as-is (don't filter out)
  return normalized
}

/**
 * Validate if a team name is official
 * @param name - Team name to validate
 * @returns true if team is official, false otherwise
 */
export function isOfficialTeam(name: string): boolean {
  return getTeamByName(name) !== null
}

/**
 * Get team count
 * @returns Number of official teams
 */
export function getTeamCount(): number {
  return TEAMS.length
}

/**
 * Get team by index (for ordered displays)
 * @param index - Team index (0-based)
 * @returns TeamConfig or null if out of range
 */
export function getTeamByIndex(index: number): TeamConfig | null {
  return TEAMS[index] || null
}
