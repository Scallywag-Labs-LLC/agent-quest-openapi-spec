import type { ClientConfig } from './base.js'
import { HeroesAPI } from './heroes.js'
import { CharactersAPI } from './characters.js'
import { PartyAPI } from './party.js'
import { GameAPI } from './game.js'
import { CombatAPI } from './combat.js'
import { BattleAPI } from './battle.js'
import { PvPAPI } from './pvp.js'
import { QuestsAPI } from './quests.js'
import { ItemsAPI } from './items.js'
import { LeaderboardAPI } from './leaderboard.js'
import { FaucetAPI } from './faucet.js'

export class AgentQuestClient {
  readonly heroes: HeroesAPI
  readonly characters: CharactersAPI
  readonly party: PartyAPI
  readonly game: GameAPI
  readonly combat: CombatAPI
  readonly battle: BattleAPI
  readonly pvp: PvPAPI
  readonly quests: QuestsAPI
  readonly items: ItemsAPI
  readonly leaderboard: LeaderboardAPI
  readonly faucet: FaucetAPI

  constructor(config: ClientConfig) {
    this.heroes = new HeroesAPI(config)
    this.characters = new CharactersAPI(config)
    this.party = new PartyAPI(config)
    this.game = new GameAPI(config)
    this.combat = new CombatAPI(config)
    this.battle = new BattleAPI(config)
    this.pvp = new PvPAPI(config)
    this.quests = new QuestsAPI(config)
    this.items = new ItemsAPI(config)
    this.leaderboard = new LeaderboardAPI(config)
    this.faucet = new FaucetAPI(config)
  }
}
