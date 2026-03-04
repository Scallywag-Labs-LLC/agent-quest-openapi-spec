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
    const text = await res.text()
    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch {
      parsed = text
    }
    if (!res.ok) {
      const msg = typeof parsed === 'object' && parsed !== null && 'error' in parsed
        ? String((parsed as { error: string }).error)
        : `HTTP ${res.status}`
      throw new AgentQuestError(msg, res.status, parsed)
    }
    return parsed as T
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
