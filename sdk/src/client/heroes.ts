import { BaseFetcher } from './base.js'
import type { components } from '../types/generated.js'

type PublicHero = components['schemas']['PublicHero']

export class HeroesAPI extends BaseFetcher {
  /** GET /api/heroes — List available hero templates */
  async list(): Promise<PublicHero[]> {
    return this.request<PublicHero[]>('GET', '/api/heroes')
  }
}
