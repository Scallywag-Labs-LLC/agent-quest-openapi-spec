/**
 * Friendly re-exports of generated OpenAPI schema types.
 * Import these instead of digging into components["schemas"].
 */
import type { components, operations } from './generated.js'

// ─── Schema Types ────────────────────────────────────────────────────
export type RaceId = components['schemas']['RaceId']
export type ClassId = components['schemas']['ClassId']
export type ClassArchetype = components['schemas']['ClassArchetype']
export type ActionType = components['schemas']['ActionType']
export type BattleStatus = components['schemas']['BattleStatus']
export type PvPStatus = components['schemas']['PvPStatus']
export type PvPResult = components['schemas']['PvPResult']
export type BattleDifficulty = components['schemas']['BattleDifficulty']
export type QuestStatus = components['schemas']['QuestStatus']
export type ObjectiveType = components['schemas']['ObjectiveType']
export type ItemType = components['schemas']['ItemType']
export type WeaponType = components['schemas']['WeaponType']
export type ArmorSlot = components['schemas']['ArmorSlot']
export type DamageType = components['schemas']['DamageType']

export type BaseStats = components['schemas']['BaseStats']
export type CharacterStats = components['schemas']['CharacterStats']
export type Equipment = components['schemas']['Equipment']
export type Currency = components['schemas']['Currency']
export type ItemStats = components['schemas']['ItemStats']
export type ErrorResponse = components['schemas']['ErrorResponse']

export type Character = components['schemas']['Character']
export type OwnedCharacter = components['schemas']['OwnedCharacter']
export type PublicHero = components['schemas']['PublicHero']
export type Item = components['schemas']['Item']
export type ZoneConnection = components['schemas']['ZoneConnection']
export type Zone = components['schemas']['Zone']
export type Quest = components['schemas']['Quest']
export type QuestObjective = components['schemas']['QuestObjective']
export type QuestReward = components['schemas']['QuestReward']
export type CharacterQuest = components['schemas']['CharacterQuest']
export type Ability = components['schemas']['Ability']
export type CardUnit = components['schemas']['CardUnit']
export type BattleMob = components['schemas']['BattleMob']
export type BattleAction = components['schemas']['BattleAction']
export type BattleLogEntry = components['schemas']['BattleLogEntry']
export type BattleWave = components['schemas']['BattleWave']
export type UnitReward = components['schemas']['UnitReward']
export type BattleRewards = components['schemas']['BattleRewards']
export type BattleState = components['schemas']['BattleState']
export type PvPBattleState = components['schemas']['PvPBattleState']
export type PvPLobbyEntry = components['schemas']['PvPLobbyEntry']
export type CombatParticipant = components['schemas']['CombatParticipant']
export type DamageEvent = components['schemas']['DamageEvent']
export type CombatRound = components['schemas']['CombatRound']
export type CombatState = components['schemas']['CombatState']
export type GameStateResponse = components['schemas']['GameStateResponse']
export type PartyResponse = components['schemas']['PartyResponse']
export type Companion = components['schemas']['Companion']
export type LeaderboardEntry = components['schemas']['LeaderboardEntry']
export type Merchant = components['schemas']['Merchant']

// ─── Operation helper types ──────────────────────────────────────────
export type Operations = operations
export type Components = components
