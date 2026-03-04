import type { SSEEvent } from '../types/sse.js'

/**
 * Parse a ReadableStream of SSE bytes into an AsyncGenerator of SSEEvent objects.
 * Handles the `data: {...}\n\n` format used by /api/game/action.
 */
export async function* parseSSE(stream: ReadableStream<Uint8Array>): AsyncGenerator<SSEEvent> {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      // Keep last (potentially incomplete) line in buffer
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const json = line.slice(6)
          try {
            yield JSON.parse(json) as SSEEvent
          } catch {
            // Skip malformed JSON lines
          }
        }
        // Ignore empty lines, comments, other SSE fields
      }
    }

    // Flush remaining buffer
    if (buffer.startsWith('data: ')) {
      try {
        yield JSON.parse(buffer.slice(6)) as SSEEvent
      } catch {
        // ignore
      }
    }
  } finally {
    reader.releaseLock()
  }
}
