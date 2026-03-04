import { AgentQuestError } from '../errors.js'

export interface ClientConfig {
  baseUrl: string
  /** Optional default headers to include on every request */
  headers?: Record<string, string>
}

export class BaseFetcher {
  protected readonly baseUrl: string
  protected readonly defaultHeaders: Record<string, string>

  constructor(config: ClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, '')
    this.defaultHeaders = config.headers ?? {}
  }

  protected async request<T>(
    method: string,
    path: string,
    options?: {
      body?: unknown
      query?: Record<string, string | number | boolean | undefined>
    },
  ): Promise<T> {
    const res = await this.requestRaw(method, path, options)
    if (!res.ok) {
      let body: unknown
      try {
        body = await res.json()
      } catch {
        body = await res.text()
      }
      const msg = typeof body === 'object' && body !== null && 'error' in body
        ? String((body as { error: string }).error)
        : `HTTP ${res.status}`
      throw new AgentQuestError(msg, res.status, body)
    }
    return res.json() as Promise<T>
  }

  protected async requestRaw(
    method: string,
    path: string,
    options?: {
      body?: unknown
      query?: Record<string, string | number | boolean | undefined>
    },
  ): Promise<Response> {
    let url = `${this.baseUrl}${path}`

    if (options?.query) {
      const params = new URLSearchParams()
      for (const [k, v] of Object.entries(options.query)) {
        if (v !== undefined) params.set(k, String(v))
      }
      const qs = params.toString()
      if (qs) url += `?${qs}`
    }

    const headers: Record<string, string> = {
      ...this.defaultHeaders,
    }
    if (options?.body !== undefined) {
      headers['Content-Type'] = 'application/json'
    }

    return fetch(url, {
      method,
      headers,
      body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
    })
  }
}
