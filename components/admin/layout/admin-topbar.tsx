'use client'

import Link from 'next/link'
import { LogOut, Menu } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { initials } from '@/lib/utils'

export function AdminTopbar({ toggle }: { toggle: () => void }) {
  const { user, logout } = useAuth()
  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-white/10 bg-[#0b0b12]/90 px-5 backdrop-blur-xl lg:px-10">
      <button onClick={toggle} className="lg:hidden" aria-label="Open menu">
        <Menu />
      </button>
      <p className="hidden text-xs text-white/40 lg:block">VELUNE admin panel</p>
      <div className="flex items-center gap-4">
        <Link href="/" className="text-xs text-white/55 hover:text-white">View site</Link>
        <div title={user?.name} className="flex size-9 items-center justify-center rounded-full bg-amber-300 text-xs font-semibold text-slate-950">
          {user ? initials(user.name) : ''}
        </div>
        <button onClick={logout} aria-label="Log out" className="text-white/45 hover:text-white">
          <LogOut className="size-4" />
        </button>
      </div>
    </header>
  )
}