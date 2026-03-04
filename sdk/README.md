# agent-quest-sdk

TypeScript SDK for the [Agent Quest](https://github.com/marcusrein/agent-quest) API. Zero runtime dependencies — uses native `fetch` and a manual SSE parser.

## Install

```bash
npm install agent-quest-sdk
# or link locally
npm install file:./path-to/sdk
```

Requires Node 18+ (native `fetch`).

## Quick Start

```typescript
import { AgentQuestClient } from 'agent-quest-sdk'
import type { Character, BattleState } from 'agent-quest-sdk'

const client = new AgentQuestClient({ baseUrl: 'http://localhost:3000' })

// Browse heroes
const heroes = await client.heroes.list()

// Create a character
const char = await client.characters.create({
  name: 'Kazrak',
  raceId: 'iksar',
  classId: 'shadowknight',
})

// Get game state
const state = await client.game.getState({ characterId: char.id })

// Talk to the Game Master (SSE streaming)
const stream = await client.game.action({
  characterId: char.id,
  message: 'look around',
})
const result = await stream.collect()
console.log(result.narrative)
```

## API Groups

| Group | Methods | Description |
|-------|---------|-------------|
| `client.heroes` | `list()` | Browse mintable hero templates |
| `client.characters` | `list()`, `create()`, `updateOwner()`, `listOwned()`, `claim()`, `burn()`, `equip()`, `syncOwner()` | Character CRUD + equipment |
| `client.party` | `get()`, `forge()`, `linkTokens()`, `listCompanions()`, `createCompanion()`, `reassignCompanion()`, `createBenchCompanion()`, `generateCompanion()` | Party + companion management |
| `client.game` | `getState()`, `travel()`, `respawn()`, `action()`, `tokenCheck()` | World state + AI game master |
| `client.combat` | `get()`, `action()` | Classic PvE auto-combat |
| `client.battle` | `start()`, `action()` | Card-based PvE battles |
| `client.pvp` | `lobby()`, `create()`, `join()`, `getState()`, `action()` | PvP card battles |
| `client.quests` | `list()`, `action()` | Quest management |
| `client.items` | `list()`, `merchants()`, `merchantTransaction()` | Items + merchant trading |
| `client.leaderboard` | `get()` | Ranked leaderboard |
| `client.faucet` | `requestEth()` | Testnet ETH (Hardhat only) |

## SSE Streaming

The `game.action()` method returns a `GameActionStream` with three ways to consume it:

```typescript
const stream = await client.game.action({ characterId, message: 'attack the goblin' })

// Option 1: Collect everything
const { narrative, events, sessionId } = await stream.collect()

// Option 2: Iterate text chunks
for await (const chunk of stream.text()) {
  process.stdout.write(chunk)
}

// Option 3: Raw SSE events
for await (const event of stream.events()) {
  switch (event.type) {
    case 'text_delta': /* narrative chunk */ break
    case 'tool_call':  /* GM tool usage */  break
    case 'tool_result': /* tool output */   break
    case 'done':       /* stream end */     break
    case 'error':      /* error */          break
  }
}
```

## Error Handling

All API errors throw `AgentQuestError` with `status` and `body`:

```typescript
import { AgentQuestError } from 'agent-quest-sdk'

try {
  await client.characters.create({ name: 'x', raceId: 'invalid', classId: 'warrior' })
} catch (err) {
  if (err instanceof AgentQuestError) {
    console.error(err.status, err.message, err.body)
  }
}
```

## Types

All 45+ schema types are exported with friendly names:

```typescript
import type {
  Character,
  BattleState,
  PvPBattleState,
  CombatState,
  Item,
  Zone,
  Quest,
  Companion,
  // ... and more
} from 'agent-quest-sdk'
```

For advanced use, the raw `paths`, `components`, and `operations` types from `openapi-typescript` are also exported.

## Development

```bash
# Regenerate types from OpenAPI spec
npm run generate

# Build
npm run build

# Typecheck only
npm run typecheck
```
