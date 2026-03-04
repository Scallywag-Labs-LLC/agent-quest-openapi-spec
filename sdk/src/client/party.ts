import { BaseFetcher } from './base.js'
import type { components, operations } from '../types/generated.js'

type PartyResponse = components['schemas']['PartyResponse']
type Companion = components['schemas']['Companion']

type ForgeBody = operations['forgeParty']['requestBody']['content']['application/json']
type LinkTokensBody = operations['linkCompanionTokens']['requestBody']['content']['application/json']
type CreateCompanionBody = operations['createCompanion']['requestBody']['content']['application/json']
type ReassignBody = operations['reassignCompanion']['requestBody']['content']['application/json']
type BenchBody = operations['createBenchCompanion']['requestBody']['content']['application/json']
type GenerateBody = operations['generateCompanion']['requestBody']['content']['application/json']

export class PartyAPI extends BaseFetcher {
  /** GET /api/party — Get party for a character */
  async get(params: { characterId: string }): Promise<PartyResponse> {
    return this.request<PartyResponse>('GET', '/api/party', { query: params })
  }

  /** POST /api/party/forge — Forge a full party (hero + 5 companions) */
  async forge(body: ForgeBody): Promise<{ companions?: Companion[] }> {
    return this.request('POST', '/api/party/forge', { body })
  }

  /** PATCH /api/party/forge — Link companion token IDs */
  async linkTokens(body: LinkTokensBody): Promise<{ success?: boolean }> {
    return this.request('PATCH', '/api/party/forge', { body })
  }

  /** GET /api/party/companions — List companions */
  async listCompanions(params: {
    ownerAddress: string
    heroCharacterId?: string
    unassigned?: 'true'
  }): Promise<{ companions?: Companion[] }> {
    return this.request('GET', '/api/party/companions', { query: params })
  }

  /** POST /api/party/companions — Create a companion in a party slot */
  async createCompanion(body: CreateCompanionBody): Promise<Companion> {
    return this.request<Companion>('POST', '/api/party/companions', { body })
  }

  /** PATCH /api/party/companions — Reassign a companion */
  async reassignCompanion(body: ReassignBody): Promise<Companion> {
    return this.request<Companion>('PATCH', '/api/party/companions', { body })
  }

  /** POST /api/party/companions/bench — Create bench (unassigned) companion */
  async createBenchCompanion(body: BenchBody): Promise<Companion> {
    return this.request<Companion>('POST', '/api/party/companions/bench', { body })
  }

  /** POST /api/party/companions/generate — AI-generate companion lore and images */
  async generateCompanion(body: GenerateBody): Promise<{
    lore?: {
      name?: string
      epithet?: string
      backstory?: string
      personality?: string
      abilities?: string
      appearance?: string
    }
    portraitBase64?: string
    avatarBase64?: string
    mimeType?: string
  }> {
    return this.request('POST', '/api/party/companions/generate', { body })
  }
}
