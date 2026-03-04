import { BaseFetcher } from './base.js'
import type { components, operations } from '../types/generated.js'

type Item = components['schemas']['Item']
type Merchant = components['schemas']['Merchant']
type Currency = components['schemas']['Currency']

type MerchantTxBody = operations['merchantTransaction']['requestBody']['content']['application/json']

export class ItemsAPI extends BaseFetcher {
  /** GET /api/items — List or filter items */
  async list(params?: {
    id?: string
    classId?: string
    slot?: string
    type?: 'weapon' | 'armor'
  }): Promise<Item | Item[]> {
    return this.request('GET', '/api/items', { query: params })
  }

  /** GET /api/merchant — List merchants */
  async merchants(params?: { zoneId?: string; merchantId?: string }): Promise<Merchant | Merchant[]> {
    return this.request('GET', '/api/merchant', { query: params })
  }

  /** POST /api/merchant — Buy or sell items */
  async merchantTransaction(body: MerchantTxBody): Promise<{
    success?: boolean
    bought?: number
    sold?: number
    itemId?: string
    totalCost?: number
    saleValue?: number
    currency?: Currency
  }> {
    return this.request('POST', '/api/merchant', { body })
  }
}
