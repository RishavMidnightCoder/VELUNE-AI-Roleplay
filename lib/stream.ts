import { API_URL } from './config'
import { getToken } from './auth'
import { ApiError, handleUnauthorized, readError } from './api'

export type StreamEvent =
  | { type: 'token'; content: string }
  | { type: 'done'; messageId: number; choices: string[]; memory: string; imagePending: boolean }
  | { type: 'image'; messageId: number; url: string | null }
  | { type: 'error'; message: string }

/** POST + Server-Sent Events (EventSource can't POST, so we read the stream by hand). */
export async function streamAction(
  storyId: number,
  body: { action: string; language: string },
  onEvent: (event: StreamEvent) => void,
  signal?: AbortSignal,
) {
  let res: Response
  try {
    res = await fetch(`${API_URL}/play/${storyId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken() ?? ''}` },
      body: JSON.stringify(body),
      signal,
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    throw new ApiError(0, 'Cannot reach the server. Is the backend running?')
  }

  if (res.status === 401) handleUnauthorized()
  if (!res.ok || !res.body) throw new ApiError(res.status, await readError(res))

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const parts = buffer.split('\n\n')
    buffer = parts.pop() ?? ''
    for (const part of parts) {
      const line = part.split('\n').find((l) => l.startsWith('data: '))
      if (!line) continue
      try {
        onEvent(JSON.parse(line.slice(6)) as StreamEvent)
      } catch {
        // ignore a malformed event
      }
    }
  }
}