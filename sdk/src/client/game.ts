import { BaseFetcher } from './base.js'
import { AgentQuestError } from '../errors.js'
import { GameActionStream } from '../sse/stream.js'
import type { components, operations } from '../types/generated.js'

type GameStateResponse = components['schemas']['GameStateResponse']
type Character = components['schemas']['Character']
type Zone = components['schemas']['Zone']

type TravelBody = operations['travel']['requestBody']['content']['application/json']
type RespawnBody = operations['respawn']['requestBody']['content']['application/json']
type ActionBody = operations['gameAction']['requestBody']['content']['application/json']
type TokenCheckBody = operations['tokenCheck']['requestBody']['content']['application/json']

export class GameAPI extends BaseFetcher {
  /** GET /api/game/state — Get full game state for a character */
  async getState(params: { characterId: string }): Promise<GameStateResponse> {
    return this.request<GameStateResponse>('GET', '/api/game/state', { query: params })
  }

  /** POST /api/game/travel — Travel to another zone */
  async travel(body: TravelBody): Promise<{
    success?: boolean
    character?: Character
    zone?: Zone
  }> {
    return this.request('POST', '/api/game/travel', { body })
  }

  /** POST /api/game/respawn — Respawn a dead character */
  async respawn(body: RespawnBody): Promise<{ character?: Character }> {
    return this.request('POST', '/api/game/respawn', { body })
  }

  /** POST /api/game/action — Send action to GM (returns SSE stream) */
  async action(body: ActionBody): Promise<GameActionStream> {
    const res = await this.requestRaw('POST', '/api/game/action', { body })
    if (!res.ok) {
      let errBody: unknown
      try { errBody = await res.json() } catch { errBody = await res.text() }
      const msg = typeof errBody === 'object' && errBody !== null && 'error' in errBody
        ? String((errBody as { error: string }).error)
        : `HTTP ${res.status}`
      throw new AgentQuestError(msg, res.status, errBody)
    }
    if (!res.body) {
      throw new AgentQuestError('No response body for SSE stream', 500)
    }
    return new GameActionStream(res.body)
  }

  /** POST /api/game/token-check — Check token requirements for a wallet */
  async tokenCheck(body: TokenCheckBody): Promise<{
    allowed?: boolean
    requirements?: {
      id?: string
      label?: string
      tokenAddr?: string
      minAmount?: string
      balance?: string
      met?: boolean
    }[]
  }> {
    return this.request('POST', '/api/game/token-check', { body })
  }
}
