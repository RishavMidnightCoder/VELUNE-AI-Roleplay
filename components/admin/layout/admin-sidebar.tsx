'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Brand } from '@/components/layout/brand'
import { adminNav } from '../../../lib/constants'

export function AdminSidebar({ open, close }: { open: boolean; close: () => void }) {
  const pathname = usePathname()
  const isActive = (href: string) => (href === '/admin' ? pathname === href : pathname.startsWith(href))

  return (
    <>
      {open && <div onClick={close} className="fixed inset-0 z-30 bg-black/60 lg:hidden" />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 border-r border-white/10 bg-[#0f0f18] p-5 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-[56px] items-center">
          <Brand />
        </div>
        <p className="mb-3 mt-8 text-[10px] uppercase tracking-[.22em] text-white/35">Manage</p>
        <nav className="flex flex-col gap-1">
          {adminNav.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={close}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${isActive(href) ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}