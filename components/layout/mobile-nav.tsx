'use client'

import Link from 'next/link'
import { LogOut, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { userNav } from '@/lib/constants'

export function MobileNav({ close }: { close: () => void }) {
  const { user, logout } = useAuth()
  const item = 'flex gap-3 rounded-xl px-4 py-3 text-left text-sm text-white/70'

  return (
    <nav className="fixed inset-x-0 top-[76px] z-20 flex flex-col gap-1 border-b border-white/10 bg-[#11111a] p-4 lg:hidden">
      {userNav.map(({ label, href, icon: Icon }) => (
        <Link key={href} href={href} onClick={close} className={item}>
          <Icon className="size-4" />
          {label}
        </Link>
      ))}
      {user?.role === 'admin' && (
        <Link href="/admin" onClick={close} className={item}>
          <ShieldCheck className="size-4" />
          Admin panel
        </Link>
      )}
      <button onClick={logout} className={item}>
        <LogOut className="size-4" />
        Log out
      </button>
    </nav>
  )
}