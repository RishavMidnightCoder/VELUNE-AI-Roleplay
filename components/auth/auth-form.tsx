'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Brand } from '@/components/layout/brand'
import { Field, Input } from '@/components/admin/ui/field'
import { useAuth } from '@/components/providers/auth-provider'

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter()
  const { login, signup } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const isLogin = mode === 'login'

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const user = isLogin ? await login(email, password) : await signup(name, email, password)
      const next = new URLSearchParams(window.location.search).get('next')
      const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : null
      let target = user.role === 'admin' ? '/admin' : '/'
      if (safeNext && (user.role === 'admin' || !safeNext.startsWith('/admin'))) target = safeNext
      router.replace(target)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0b12] px-5 text-white">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[.04] p-8">
        <Brand />
        <h1 className="mt-8 font-serif text-3xl font-light">{isLogin ? 'Welcome back' : 'Create your account'}</h1>
        <p className="mt-2 text-sm text-white/50">
          {isLogin ? 'Log in to continue your story.' : 'Sign up to start living your story.'}
        </p>

        <div className="mt-8 flex flex-col gap-5">
          {!isLogin && (
            <Field label="Name">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required minLength={2} />
            </Field>
          )}
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </Field>
          <Field label="Password" hint={isLogin ? undefined : 'At least 8 characters.'}>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={isLogin ? 1 : 8} maxLength={64} />
          </Field>

          {error && <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-xs text-red-200">{error}</p>}

          <button type="submit" disabled={loading} className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 disabled:opacity-60">
            {loading ? 'Please wait...' : isLogin ? 'Log in' : 'Sign up'}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-white/45">
          {isLogin ? 'New here? ' : 'Already have an account? '}
          <Link href={isLogin ? '/signup' : '/login'} className="text-violet-200">
            {isLogin ? 'Create an account' : 'Log in'}
          </Link>
        </p>
      </form>
    </main>
  )
}