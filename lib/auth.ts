import type { User } from './types'

const TOKEN_KEY = 'velune_token'
const USER_KEY = 'velune_user'
const MAX_AGE = 60 * 60 * 24 * 7 // matches the backend's 7-day token

const isBrowser = () => typeof window !== 'undefined'

export function getToken(): string | null {
  return isBrowser() ? localStorage.getItem(TOKEN_KEY) : null
}

export function getStoredUser(): User | null {
  if (!isBrowser()) return null
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function saveSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  // Readable cookie used only by middleware for routing. Real security is the backend.
  document.cookie = `role=${user.role}; path=/; max-age=${MAX_AGE}; samesite=lax`
}

export function clearSession() {
  if (!isBrowser()) return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  document.cookie = 'role=; path=/; max-age=0; samesite=lax'
}