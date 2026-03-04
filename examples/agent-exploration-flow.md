# Agent Exploration Flow

Complete lifecycle for an AI agent to explore the world, complete quests, and trade with merchants.

## Prerequisites

- Character created with a valid `characterId`
- Character alive (currentHp > 0)

## Step 1: Check Current State

```bash
curl "http://localhost:3000/api/game/state?characterId=chr_abc123"
```

Returns:
- `character` — full stats, inventory, currency, current zone
- `combatState` — null if not in combat
- `zone` — current zone details with connections and level range

## Step 2: Explore via Travel

Look at `zone.connections` for available destinations:

```json
{
  "connections": [
    { "toZoneId": "zone_commons", "toZoneName": "West Commonlands", "direction": "west", "description": "A dusty road leads west..." },
    { "toZoneId": "zone_befallen", "toZoneName": "Befallen", "direction": "north", "description": "Dark ruins loom..." }
  ]
}
```

Travel to an adjacent zone:

```bash
curl -X POST http://localhost:3000/api/game/travel \
  -H "Content-Type: application/json" \
  -d '{
    "characterId": "chr_abc123",
    "targetZoneId": "zone_commons"
  }'
```

### Agent travel strategy:
- Check `zone.level.min` and `zone.level.max` — avoid zones far above your level
- `safeZone: true` means no mob encounters
- Some connections have `requiresKey` — you need that item in inventory

## Step 3: Talk to the AI Game Master

For freeform exploration, NPC dialogue, and story:

```bash
curl -X POST http://localhost:3000/api/game/action \
  -H "Content-Type: application/json" \
  -d '{
    "characterId": "chr_abc123",
    "message": "I look around the marketplace and approach the nearest vendor"
  }'
```

This returns a **Server-Sent Events stream**. Parse it:

```
data: {"type":"text_delta","content":"The bustling marketplace"}
data: {"type":"text_delta","content":" stretches before you..."}
```

Concatenate all `text_delta` content for the full narrative response.

## Step 4: Discover and Accept Quests

### List available quests in current zone:

```bash
curl "http://localhost:3000/api/quests?characterId=chr_abc123&zoneId=zone_qeynos"
```

Returns:
- `active` — quests you're already tracking
- `available` — quests you can accept in this zone
- `quests` — full quest details keyed by ID

### Accept a quest:

```bash
curl -X POST http://localhost:3000/api/quests \
  -H "Content-Type: application/json" \
  -d '{
    "action": "accept",
    "characterId": "chr_abc123",
    "questId": "quest_rat_slayer"
  }'
```

Check `prerequisiteQuestIds` — those must be completed first.

### Progress a quest objective:

After killing a mob or collecting an item, update the objective:

```bash
curl -X POST http://localhost:3000/api/quests \
  -H "Content-Type: application/json" \
  -d '{
    "action": "progress",
    "characterId": "chr_abc123",
    "questId": "quest_rat_slayer",
    "objectiveId": "obj_kill_rats",
    "increment": 1
  }'
```

### Complete a quest:

When all objectives are done:

```bash
curl -X POST http://localhost:3000/api/quests \
  -H "Content-Type: application/json" \
  -d '{
    "action": "complete",
    "characterId": "chr_abc123",
    "questId": "quest_rat_slayer"
  }'
```

Rewards (XP, gold, items) are applied automatically.

## Step 5: Browse and Buy from Merchants

### Find merchants in current zone:

```bash
curl "http://localhost:3000/api/merchant?zoneId=zone_qeynos"
```

### Check a merchant's inventory:

```bash
curl "http://localhost:3000/api/merchant?merchantId=npc_merchant_qeynos"
```

Returns the merchant with their `inventory` array, each item showing `itemId`, `quantity`, and `priceCopper`.

### Look up an item before buying:

```bash
curl "http://localhost:3000/api/items?id=rusty_short_sword"
```

### Buy an item:

```bash
curl -X POST http://localhost:3000/api/merchant \
  -H "Content-Type: application/json" \
  -d '{
    "characterId": "chr_abc123",
    "merchantId": "npc_merchant_qeynos",
    "action": "buy",
    "itemId": "rusty_short_sword",
    "quantity": 1
  }'
```

Returns your updated `currency` balance.

### Sell loot:

```bash
curl -X POST http://localhost:3000/api/merchant \
  -H "Content-Type: application/json" \
  -d '{
    "characterId": "chr_abc123",
    "merchantId": "npc_merchant_qeynos",
    "action": "sell",
    "itemId": "rat_pelt",
    "quantity": 3
  }'
```

### Currency math:
- 1 platinum = 1000 copper
- 1 gold = 100 copper
- 1 silver = 10 copper

## Step 6: Equip Gear

After buying or looting:

```bash
curl -X POST http://localhost:3000/api/characters/equip \
  -H "Content-Type: application/json" \
  -d '{
    "characterId": "chr_abc123",
    "action": "equip",
    "itemId": "rusty_short_sword",
    "slot": "primary"
  }'
```

Returns recalculated `stats` with equipment bonuses applied.

### Browse available gear by class:

```bash
curl "http://localhost:3000/api/items?classId=shadowknight&type=weapon"
```

---

## Full Exploration Loop

```
gameState = GET /api/game/state?characterId=...
zone = gameState.zone

# Check quests
quests = GET /api/quests?characterId=...&zoneId=zone.id
for quest in quests.available:
    if meetsPrerequisites(quest):
        POST /api/quests { action: "accept", characterId, questId }

# Fight mobs for quest objectives
state = POST /api/battle/start { characterId, ownerAddress }
# ... battle loop (see PvE flow) ...

# Progress quest objectives after combat
POST /api/quests { action: "progress", characterId, questId, objectiveId }

# Complete quest when objectives done
POST /api/quests { action: "complete", characterId, questId }

# Sell loot, buy upgrades
merchants = GET /api/merchant?zoneId=zone.id
POST /api/merchant { characterId, merchantId, action: "sell", itemId }
POST /api/merchant { characterId, merchantId, action: "buy", itemId }

# Equip new gear
POST /api/characters/equip { characterId, action: "equip", itemId, slot }

# Travel to next zone
POST /api/game/travel { characterId, targetZoneId: nextZone }
```
