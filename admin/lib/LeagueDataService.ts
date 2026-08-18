import { apiService } from './api'

// Centralized data service for all league data
// Single source of truth for matches, teams, standings, players, videos, news

class LeagueDataService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  private getCacheKey(key: string, params?: any) {
    return params ? `${key}:${JSON.stringify(params)}` : key
  }

  private setCache(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  private getCache(key: string) {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION
    if (isExpired) {
      this.cache.delete(key)
      return null
    }
    
    return cached.data
  }

  private clearCache(pattern?: string) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.startsWith(pattern)) {
          this.cache.delete(key)
        }
      }
    } else {
      this.cache.clear()
    }
  }

  // TEAMS
  async getTeams(params?: any) {
    const cacheKey = this.getCacheKey('teams', params)
    const cached = this.getCache(cacheKey)
    if (cached) return cached

    const response = await apiService.teams.getAll(params)
    const data = response.data?.data || response.data || []
    this.setCache(cacheKey, data)
    return data
  }

  async getTeamById(id: string) {
    const cacheKey = this.getCacheKey(`team:${id}`)
    const cached = this.getCache(cacheKey)
    if (cached) return cached

    const response = await apiService.teams.getById(id)
    const data = response.data
    this.setCache(cacheKey, data)
    return data
  }

  async getTeamBySlug(slug: string) {
    const teams = await this.getTeams()
    return teams.find((team: any) => 
      team.name.toLowerCase().replace(/\s+/g, '-') === slug ||
      team.slug === slug
    )
  }

  async createTeam(data: any) {
    const response = await apiService.teams.create(data)
    this.clearCache('teams')
    return response.data
  }

  async updateTeam(id: string, data: any) {
    const response = await apiService.teams.update(id, data)
    this.clearCache('teams')
    this.clearCache(`team:${id}`)
    return response.data
  }

  async deleteTeam(id: string) {
    await apiService.teams.delete(id)
    this.clearCache('teams')
    this.clearCache(`team:${id}`)
  }

  // STANDINGS / POINTS TABLE
  async getStandings(params?: any) {
    const cacheKey = this.getCacheKey('standings', params)
    const cached = this.getCache(cacheKey)
    if (cached) return cached

    const response = await apiService.points.getTable(params)
    const data = response.data?.data || response.data || []
    this.setCache(cacheKey, data)
    return data
  }

  async updateStanding(id: string, data: any) {
    const response = await apiService.points.update(id, data)
    this.clearCache('standings')
    return response.data
  }

  async recalculateStandings(seasonId: string) {
    const response = await apiService.points.recalculate(seasonId)
    this.clearCache('standings')
    this.clearCache('teams')
    return response.data
  }

  // MATCHES
  async getMatches(params?: any) {
    const cacheKey = this.getCacheKey('matches', params)
    const cached = this.getCache(cacheKey)
    if (cached) return cached

    const response = await apiService.matches.getAll(params)
    const data = response.data?.data || response.data || []
    this.setCache(cacheKey, data)
    return data
  }

  async getMatchById(id: string) {
    const cacheKey = this.getCacheKey(`match:${id}`)
    const cached = this.getCache(cacheKey)
    if (cached) return cached

    const response = await apiService.matches.getById(id)
    const data = response.data
    this.setCache(cacheKey, data)
    return data
  }

  async getMatchesByTeam(teamId: string) {
    const matches = await this.getMatches()
    return matches.filter((m: any) => 
      m.homeTeamId === teamId || m.awayTeamId === teamId
    )
  }

  async createMatch(data: any) {
    const response = await apiService.matches.create(data)
    this.clearCache('matches')
    this.clearCache('standings')
    return response.data
  }

  async updateMatch(id: string, data: any) {
    const response = await apiService.matches.update(id, data)
    this.clearCache('matches')
    this.clearCache(`match:${id}`)
    return response.data
  }

  async updateMatchScore(id: string, data: any) {
    const response = await apiService.matches.updateScore(id, data)
    this.clearCache('matches')
    this.clearCache('standings')
    this.clearCache('teams')
    return response.data
  }

  async deleteMatch(id: string) {
    await apiService.matches.delete(id)
    this.clearCache('matches')
    this.clearCache(`match:${id}`)
    this.clearCache('standings')
  }

  // PLAYERS
  async getPlayers(params?: any) {
    const cacheKey = this.getCacheKey('players', params)
    const cached = this.getCache(cacheKey)
    if (cached) return cached

    const response = await apiService.players.getAll(params)
    const data = response.data?.data || response.data || []
    this.setCache(cacheKey, data)
    return data
  }

  async getPlayersByTeam(teamId: string) {
    const response = await apiService.players.getByTeam(teamId)
    const data = response.data?.data || response.data || []
    return data
  }

  async createPlayer(data: any) {
    const response = await apiService.players.create(data)
    this.clearCache('players')
    return response.data
  }

  async updatePlayer(id: string, data: any) {
    const response = await apiService.players.update(id, data)
    this.clearCache('players')
    this.clearCache(`player:${id}`)
    return response.data
  }

  async deletePlayer(id: string) {
    await apiService.players.delete(id)
    this.clearCache('players')
  }

  // VIDEOS
  async getVideos(params?: any) {
    const cacheKey = this.getCacheKey('videos', params)
    const cached = this.getCache(cacheKey)
    if (cached) return cached

    const response = await apiService.unplugged.getVideos(params)
    const data = response.data?.data || response.data || []
    this.setCache(cacheKey, data)
    return data
  }

  async getVideoById(id: string) {
    const cacheKey = this.getCacheKey(`video:${id}`)
    const cached = this.getCache(cacheKey)
    if (cached) return cached

    const response = await apiService.unplugged.getVideoById(id)
    const data = response.data
    this.setCache(cacheKey, data)
    return data
  }

  async createVideo(data: any) {
    const response = await apiService.unplugged.createVideo(data)
    this.clearCache('videos')
    return response.data
  }

  async updateVideo(id: string, data: any) {
    const response = await apiService.unplugged.updateVideo(id, data)
    this.clearCache('videos')
    this.clearCache(`video:${id}`)
    return response.data
  }

  async deleteVideo(id: string) {
    await apiService.unplugged.deleteVideo(id)
    this.clearCache('videos')
  }

  // NEWS
  async getNews(params?: any) {
    const cacheKey = this.getCacheKey('news', params)
    const cached = this.getCache(cacheKey)
    if (cached) return cached

    const response = await apiService.news.getAll(params)
    const data = response.data?.data || response.data || []
    this.setCache(cacheKey, data)
    return data
  }

  async getNewsById(id: string) {
    const cacheKey = this.getCacheKey(`news:${id}`)
    const cached = this.getCache(cacheKey)
    if (cached) return cached

    const response = await apiService.news.getById(id)
    const data = response.data
    this.setCache(cacheKey, data)
    return data
  }

  async getNewsBySlug(slug: string) {
    const response = await apiService.news.getBySlug(slug)
    return response.data
  }

  async createNews(data: any) {
    const response = await apiService.news.create(data)
    this.clearCache('news')
    return response.data
  }

  async updateNews(id: string, data: any) {
    const response = await apiService.news.update(id, data)
    this.clearCache('news')
    this.clearCache(`news:${id}`)
    return response.data
  }

  async deleteNews(id: string) {
    await apiService.news.delete(id)
    this.clearCache('news')
  }

  // HOMEPAGE - Single endpoint for all homepage data
  async getHomepageData() {
    const cacheKey = 'homepage'
    const cached = this.getCache(cacheKey)
    if (cached) return cached

    const response = await apiService.homepage.getData()
    const data = response.data
    this.setCache(cacheKey, data)
    return data
  }

  // Invalidate all caches (call after any Admin Panel update)
  invalidateAll() {
    this.clearCache()
  }

  // Invalidate specific cache pattern
  invalidate(pattern: string) {
    this.clearCache(pattern)
  }
}

// Export singleton instance
export const leagueDataService = new LeagueDataService()
