'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, Menu, Search, ShieldCheck, X } from 'lucide-react'
import { Brand } from './brand'
import { useAuth } from '@/components/providers/auth-provider'
import { userNav } from '@/lib/constants'
import { initials } from '@/lib/utils'

export function Header({ menuOpen, toggleMenu }: { menuOpen: boolean; toggleMenu: () => void }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-white/10 bg-[#0b0b12]/90 px-5 backdrop-blur-xl lg:px-8">
      <Link href="/"><Brand /></Link>
      <nav className="hidden gap-1 lg:flex">
        {userNav.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs ${isActive(href) ? 'bg-white/10' : 'text-white/45'}`}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <Link href="/discover" aria-label="Search stories" className="hidden text-white/45 hover:text-white sm:block">
          <Search className="size-4" />
        </Link>
        {user?.role === 'admin' && (
          <Link href="/admin" aria-label="Admin panel" className="hidden text-white/45 hover:text-white sm:block">
            <ShieldCheck className="size-4" />
          </Link>
        )}
        <div title={user?.name} className="flex size-9 items-center justify-center rounded-full bg-amber-300 text-xs font-semibold text-slate-950">
          {user ? initials(user.name) : ''}
        </div>
        <button onClick={logout} aria-label="Log out" className="hidden text-white/45 hover:text-white sm:block">
          <LogOut className="size-4" />
        </button>
        <button onClick={toggleMenu} className="lg:hidden" aria-label="Open navigation">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  )
}