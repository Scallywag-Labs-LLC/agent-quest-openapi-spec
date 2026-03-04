import { BaseFetcher } from './base.js'
import type { components, operations } from '../types/generated.js'

type CombatState = components['schemas']['CombatState']
type Character = components['schemas']['Character']

type CombatActionBody = operations['combatAction']['requestBody']['content']['application/json']

export class CombatAPI extends BaseFetcher {
  /** GET /api/combat — Get current combat state */
  async get(params: { characterId: string }): Promise<{
    active?: boolean
    state?: CombatState | null
  }> {
    return this.request('GET', '/api/combat', { query: params })
  }

  /** POST /api/combat — Perform a combat action (initiate/tick/flee) */
  async action(body: CombatActionBody): Promise<
    | { success?: boolean; state?: CombatState }
    | { round?: number; state?: CombatState; isOver?: boolean; character?: Character; droppedLoot?: string[] }
    | { success?: boolean; outcome?: string }
  > {
    return this.request('POST', '/api/combat', { body })
  }
}
