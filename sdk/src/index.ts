// Client
export { AgentQuestClient } from './client/index.js'
export type { ClientConfig } from './client/base.js'

// Errors
export { AgentQuestError } from './errors.js'

// SSE
export { GameActionStream } from './sse/stream.js'
export type {
  SSEEvent,
  SSEEventType,
  SSETextDelta,
  SSEToolCall,
  SSEToolResult,
  SSEDone,
  SSEError,
} from './types/sse.js'

// Schema types
export type {
  // Enums
  RaceId,
  ClassId,
  ClassArchetype,
  ActionType,
  BattleStatus,
  PvPStatus,
  PvPResult,
  BattleDifficulty,
  QuestStatus,
  ObjectiveType,
  ItemType,
  WeaponType,
  ArmorSlot,
  DamageType,
  // Objects
  BaseStats,
  CharacterStats,
  Equipment,
  Currency,
  ItemStats,
  ErrorResponse,
  Character,
  OwnedCharacter,
  PublicHero,
  Item,
  ZoneConnection,
  Zone,
  Quest,
  QuestObjective,
  QuestReward,
  CharacterQuest,
  Ability,
  CardUnit,
  BattleMob,
  BattleAction,
  BattleLogEntry,
  BattleWave,
  UnitReward,
  BattleRewards,
  BattleState,
  PvPBattleState,
  PvPLobbyEntry,
  CombatParticipant,
  DamageEvent,
  CombatRound,
  CombatState,
  GameStateResponse,
  PartyResponse,
  Companion,
  LeaderboardEntry,
  Merchant,
} from './types/index.js'

// Generated types (for advanced use)
export type { paths, components, operations } from './types/generated.js'
