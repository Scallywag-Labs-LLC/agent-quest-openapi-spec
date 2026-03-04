import { BaseFetcher } from './base.js'
import type { components, operations } from '../types/generated.js'

type BattleState = components['schemas']['BattleState']
type BattleActionBody = operations['battleAction']['requestBody']['content']['application/json']
type StartBattleBody = operations['startBattle']['requestBody']['content']['application/json']

export class BattleAPI extends BaseFetcher {
  /** POST /api/battle/start — Start a card battle */
  async start(body: StartBattleBody): Promise<BattleState> {
    return this.request<BattleState>('POST', '/api/battle/start', { body })
  }

  /** POST /api/battle/action — Submit a battle action */
  async action(body: BattleActionBody): Promise<BattleState> {
    return this.request<BattleState>('POST', '/api/battle/action', { body })
  }
}
