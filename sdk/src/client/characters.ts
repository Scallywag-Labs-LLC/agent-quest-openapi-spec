import { BaseFetcher } from './base.js'
import type { components, operations } from '../types/generated.js'

type Character = components['schemas']['Character']
type OwnedCharacter = components['schemas']['OwnedCharacter']
type CharacterStats = components['schemas']['CharacterStats']
type Equipment = components['schemas']['Equipment']
type ArmorSlot = components['schemas']['ArmorSlot']

type CreateCharacterBody = operations['createCharacter']['requestBody']['content']['application/json']
type UpdateOwnerBody = operations['updateCharacterOwner']['requestBody']['content']['application/json']
type ClaimBody = operations['claimHero']['requestBody']['content']['application/json']
type EquipBody = operations['equipItem']['requestBody']['content']['application/json']
type SyncOwnerBody = operations['syncOwner']['requestBody']['content']['application/json']

export class CharactersAPI extends BaseFetcher {
  /** GET /api/characters — List all local characters */
  async list(): Promise<Character[]> {
    return this.request<Character[]>('GET', '/api/characters')
  }

  /** POST /api/characters — Create a new character */
  async create(body: CreateCharacterBody): Promise<Character> {
    return this.request<Character>('POST', '/api/characters', { body })
  }

  /** PATCH /api/characters — Update character owner address */
  async updateOwner(body: UpdateOwnerBody): Promise<Character> {
    return this.request<Character>('PATCH', '/api/characters', { body })
  }

  /** GET /api/characters/owned — List characters owned by wallet */
  async listOwned(params: { address: string }): Promise<OwnedCharacter[]> {
    return this.request<OwnedCharacter[]>('GET', '/api/characters/owned', { query: params })
  }

  /** POST /api/characters/claim — Claim a hero NFT and create character */
  async claim(body: ClaimBody): Promise<Character> {
    return this.request<Character>('POST', '/api/characters/claim', { body })
  }

  /** POST /api/characters/burn — Delete a character */
  async burn(body: { characterId: string }): Promise<{ ok?: boolean; deleted?: string }> {
    return this.request('POST', '/api/characters/burn', { body })
  }

  /** POST /api/characters/equip — Equip or unequip an item */
  async equip(body: EquipBody): Promise<{
    success?: boolean
    equipment?: Equipment
    inventory?: string[]
    stats?: CharacterStats
  }> {
    return this.request('POST', '/api/characters/equip', { body })
  }

  /** PATCH /api/characters/sync-owner — Sync owner from on-chain data */
  async syncOwner(body: SyncOwnerBody): Promise<Character> {
    return this.request<Character>('PATCH', '/api/characters/sync-owner', { body })
  }
}
