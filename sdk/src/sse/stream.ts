import type { SSEEvent, SSETextDelta, SSEToolCall, SSEToolResult, SSEDone, SSEError } from '../types/sse.js'
import { parseSSE } from './parser.js'

/**
 * Wraps the SSE stream from /api/game/action with convenient iteration methods.
 */
export class GameActionStream {
  private readonly stream: ReadableStream<Uint8Array>

  constructor(stream: ReadableStream<Uint8Array>) {
    this.stream = stream
  }

  /** Iterate over all raw SSE events */
  async *events(): AsyncGenerator<SSEEvent> {
    yield* parseSSE(this.stream)
  }

  /** Iterate over just the text deltas (narrative chunks) */
  async *text(): AsyncGenerator<string> {
    for await (const event of this.events()) {
      if (event.type === 'text_delta') {
        yield (event as SSETextDelta).content
      }
    }
  }

  /**
   * Collect the full response: concatenated narrative text + all events.
   * Consumes the stream.
   */
  async collect(): Promise<{
    narrative: string
    events: SSEEvent[]
    sessionId?: string
    stateUpdates?: Record<string, unknown>
  }> {
    let narrative = ''
    const events: SSEEvent[] = []
    let sessionId: string | undefined
    let stateUpdates: Record<string, unknown> | undefined

    for await (const event of this.events()) {
      events.push(event)
      switch (event.type) {
        case 'text_delta':
          narrative += (event as SSETextDelta).content
          break
        case 'done':
          sessionId = (event as SSEDone).sessionId
          stateUpdates = (event as SSEDone).stateUpdates
          break
      }
    }

    return { narrative, events, sessionId, stateUpdates }
  }
}
