import { BaseFetcher } from './base.js'
import type { components } from '../types/generated.js'

type LeaderboardEntry = components['schemas']['LeaderboardEntry']

export class LeaderboardAPI extends BaseFetcher {
  /** GET /api/leaderboard — Get ranked leaderboard */
  async get(params?: { limit?: number; classId?: string }): Promise<LeaderboardEntry[]> {
    return this.request<LeaderboardEntry[]>('GET', '/api/leaderboard', { query: params })
  }
}
