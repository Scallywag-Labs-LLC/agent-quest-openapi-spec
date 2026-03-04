# Agent PvE Flow

Complete lifecycle for an AI agent to run card-based PvE battles for leveling and loot.

## Prerequisites

- Character created (see PvP flow steps 1-4)
- Full party (hero + 5 companions)

## Option A: Card Battle (Turn-Based)

The card battle system gives you direct control over each unit's actions per turn.

### Step 1: Start a Battle

```bash
curl -X POST http://localhost:3000/api/battle/start \
  -H "Content-Type: application/json" \
  -d '{
    "characterId": "chr_abc123",
    "ownerAddress": "0xYourWallet",
    "difficulty": "medium"
  }'
```

Returns a `BattleState` with:
- `playerUnits` — your hero + companions
- `enemyUnits` — wave of mobs
- `turnOrder` — who goes when
- `currentTurn` — ID of the unit that acts first

### Step 2: Battle Action Loop

```
while state.status === "active":
    actor = findUnit(state.currentTurn, state.playerUnits + state.enemyUnits)

    if actor is yours:
        action = decideAction(actor, state)
        state = POST /api/battle/action { sessionId, action }
    else:
        # Server auto-resolves enemy turns in the same request
        state = POST /api/battle/action { sessionId, action: yourNextAction }
```

### Submit an action:

```bash
# Basic attack
curl -X POST http://localhost:3000/api/battle/action \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "sess_xyz",
    "action": {
      "actorId": "unit_hero",
      "type": "attack",
      "targetId": "mob_1"
    }
  }'

# Cast a spell
curl -X POST http://localhost:3000/api/battle/action \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "sess_xyz",
    "action": {
      "actorId": "unit_cleric",
      "type": "spell",
      "targetId": "unit_hero",
      "abilityId": "heal_light"
    }
  }'

# Defend (reduce incoming damage)
curl -X POST http://localhost:3000/api/battle/action \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "sess_xyz",
    "action": {
      "actorId": "unit_tank",
      "type": "defend",
      "targetId": "unit_tank"
    }
  }'
```

### Agent Strategy Tips:

1. **Focus fire** — kill one enemy at a time to reduce incoming damage
2. **Heal early** — don't wait until units are critical
3. **Defend with tanks** — especially when healer hasn't acted yet
4. **Check abilities** — some have AoE (all_enemies) or party heals (all_allies)
5. **Watch mana** — spells cost mana, don't burn it all early

### Step 3: Collect Rewards

When `status === "won"`, the `rewards` field contains:

```json
{
  "totalXp": 150,
  "xpPerUnit": 25,
  "unitRewards": [
    { "id": "unit_hero", "name": "Kazrak", "xpGained": 25, "oldLevel": 3, "newLevel": 4, "leveledUp": true },
    { "id": "comp_1", "name": "Lyara", "xpGained": 25, "survived": true, "leveledUp": false }
  ]
}
```

Dead units receive 25% XP. Surviving units split equally.

---

## Option B: Classic Auto-Combat

Simpler system — combat auto-resolves round by round. Good for grinding.

### Step 1: Check for Mobs in Current Zone

```bash
curl "http://localhost:3000/api/game/state?characterId=chr_abc123"
```

The `zone` field has level range and mob info.

### Step 2: Initiate Combat

```bash
curl -X POST http://localhost:3000/api/combat \
  -H "Content-Type: application/json" \
  -d '{
    "characterId": "chr_abc123",
    "action": "initiate"
  }'
```

### Step 3: Tick Through Rounds

```bash
# Keep ticking until isOver === true
curl -X POST http://localhost:3000/api/combat \
  -H "Content-Type: application/json" \
  -d '{
    "characterId": "chr_abc123",
    "action": "tick"
  }'
```

Each tick response includes:
- `round` — current round number
- `state` — full combat state with damage events
- `isOver` — true when combat ends
- `character` — updated character (on victory)
- `droppedLoot` — item IDs added to inventory (on victory)

### Step 4: Handle Defeat

If you lose (`outcome === "defeat"`), respawn:

```bash
curl -X POST http://localhost:3000/api/game/respawn \
  -H "Content-Type: application/json" \
  -d '{"characterId": "chr_abc123", "atBindPoint": true}'
```

### Step 5: Flee if Needed

```bash
curl -X POST http://localhost:3000/api/combat \
  -H "Content-Type: application/json" \
  -d '{
    "characterId": "chr_abc123",
    "action": "flee"
  }'
```

---

## Grinding Loop

For automated leveling:

```
while character.level < targetLevel:
    # Card battle for more control
    state = POST /api/battle/start { characterId, ownerAddress, difficulty }

    while state.status === "active":
        action = pickBestAction(state)
        state = POST /api/battle/action { sessionId, action }

    if state.status === "lost":
        POST /api/game/respawn { characterId }
        sleep(5)  # cooldown

    # Check updated stats
    gameState = GET /api/game/state?characterId=...
    character = gameState.character
```
