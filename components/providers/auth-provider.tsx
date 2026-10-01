'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/services'
import { clearSession, getStoredUser, getToken, saveSession } from '@/lib/auth'
import type { User } from '@/lib/types'

type AuthValue = {
  user: User | null
  ready: boolean
  login: (email: string, password: string) => Promise<User>
  signup: (name: string, email: string, password: string) => Promise<User>
  logout: () => void
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = getStoredUser()
    const token = getToken()
    if (stored && token) {
      setUser(stored)
      // Refresh from the server; a 401 clears the session and redirects (see lib/api.ts).
      authService
        .me()
        .then((fresh) => {
          setUser(fresh)
          saveSession(token, fresh)
        })
        .catch(() => {})
    }
    setReady(true)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await authService.login(email, password)
    saveSession(res.accessToken, res.user)
    setUser(res.user)
    return res.user
  }, [])

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const res = await authService.signup(name, email, password)
    saveSession(res.accessToken, res.user)
    setUser(res.user)
    return res.user
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
    router.replace('/login')
  }, [router])

  const value = useMemo(() => ({ user, ready, login, signup, logout }), [user, ready, login, signup, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}