import { BaseFetcher } from './base.js'
import type { components, operations } from '../types/generated.js'

type CharacterQuest = components['schemas']['CharacterQuest']
type Quest = components['schemas']['Quest']

type QuestActionBody = operations['questAction']['requestBody']['content']['application/json']

export class QuestsAPI extends BaseFetcher {
  /** GET /api/quests — List quests for a character */
  async list(params: { characterId: string; zoneId?: string }): Promise<{
    active?: CharacterQuest[]
    available?: Quest[]
    quests?: Record<string, Quest>
  }> {
    return this.request('GET', '/api/quests', { query: params })
  }

  /** POST /api/quests — Perform quest action (accept/progress/complete) */
  async action(body: QuestActionBody): Promise<{
    success?: boolean
    characterQuest?: CharacterQuest
    quest?: Quest
  }> {
    return this.request('POST', '/api/quests', { body })
  }
}
