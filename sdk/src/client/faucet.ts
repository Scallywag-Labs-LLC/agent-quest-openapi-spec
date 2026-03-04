import { BaseFetcher } from './base.js'

export class FaucetAPI extends BaseFetcher {
  /** POST /api/faucet — Request testnet ETH (Hardhat only) */
  async requestEth(body: { address: string }): Promise<{ ok?: boolean; hash?: string }> {
    return this.request('POST', '/api/faucet', { body })
  }
}
