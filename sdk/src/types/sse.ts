/**
 * SSE event types matching the server's GameMasterAgent output.
 * See: agent-quest-main/src/types/agents.ts
 */

export type SSEEventType = 'text_delta' | 'tool_call' | 'tool_result' | 'done' | 'error'

export interface SSETextDelta {
  type: 'text_delta'
  content: string
}

export interface SSEToolCall {
  type: 'tool_call'
  tool: string
  args: Record<string, unknown>
}

export interface SSEToolResult {
  type: 'tool_result'
  tool: string
  result: Record<string, unknown>
  stateUpdates?: Record<string, unknown>
}

export interface SSEDone {
  type: 'done'
  sessionId: string
  stateUpdates?: Record<string, unknown>
}

export interface SSEError {
  type: 'error'
  error: string
}

/** Discriminated union of all SSE events from /api/game/action */
export type SSEEvent = SSETextDelta | SSEToolCall | SSEToolResult | SSEDone | SSEError
