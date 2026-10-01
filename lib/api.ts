import { API_URL } from './config'
import { clearSession, getToken } from './auth'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export function handleUnauthorized() {
  if (typeof window === 'undefined') return
  clearSession()
  if (!window.location.pathname.startsWith('/login')) window.location.href = '/login'
}

export async function readError(res: Response): Promise<string> {
  try {
    const data = await res.json()
    const detail = data?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail) && detail.length) {
      return detail.map((d: { msg?: string }) => d.msg).filter(Boolean).join(', ')
    }
  } catch {
    // body was not JSON
  }
  return `Request failed (${res.status})`
}

type Options = Omit<RequestInit, 'body'> & { body?: unknown; auth?: boolean }

/** Every backend call in the app goes through this one function. */
export async function api<T>(path: string, { body, auth = true, headers, ...init }: Options = {}): Promise<T> {
  const token = auth ? getToken() : null
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData

  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        ...(body !== undefined && !isForm ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Is the backend running?')
  }

  if (res.status === 401 && auth) handleUnauthorized()
  if (!res.ok) throw new ApiError(res.status, await readError(res))
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}