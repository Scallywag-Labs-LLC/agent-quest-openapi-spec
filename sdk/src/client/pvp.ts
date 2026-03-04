import { BaseFetcher } from './base.js'
import type { components, operations } from '../types/generated.js'

type PvPLobbyEntry = components['schemas']['PvPLobbyEntry']
type PvPBattleState = components['schemas']['PvPBattleState']

type CreatePvPBody = operations['createPvPMatch']['requestBody']['content']['application/json']
type JoinPvPBody = operations['joinPvPMatch']['requestBody']['content']['application/json']
type PvPActionBody = operations['pvpAction']['requestBody']['content']['application/json']

export class PvPAPI extends BaseFetcher {
  /** GET /api/pvp/lobby — List open PvP matches */
  async lobby(): Promise<PvPLobbyEntry[]> {
    return this.request<PvPLobbyEntry[]>('GET', '/api/pvp/lobby')
  }

  /** POST /api/pvp/create — Create a PvP match */
  async create(body: CreatePvPBody): Promise<{ matchId?: string }> {
    return this.request('POST', '/api/pvp/create', { body })
  }

  /** POST /api/pvp/join — Join an existing PvP match */
  async join(body: JoinPvPBody): Promise<PvPBattleState> {
    return this.request<PvPBattleState>('POST', '/api/pvp/join', { body })
  }

  /** GET /api/pvp/state — Get PvP match state */
  async getState(params: { matchId: string; characterId: string }): Promise<
    { status?: string; matchId?: string } | PvPBattleState
  > {
    return this.request('GET', '/api/pvp/state', { query: params })
  }

  /** POST /api/pvp/action — Submit a PvP action */
  async action(body: PvPActionBody): Promise<PvPBattleState> {
    return this.request<PvPBattleState>('POST', '/api/pvp/action', { body })
  }
}
