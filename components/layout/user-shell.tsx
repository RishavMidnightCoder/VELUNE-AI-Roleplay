'use client'

import { useState, type ReactNode } from 'react'
import { Footer } from './footer'
import { Header } from './header'
import { MobileNav } from './mobile-nav'

export function UserShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <main className="min-h-screen bg-[#0b0b12] text-white">
      <Header menuOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />
      {menuOpen && <MobileNav close={() => setMenuOpen(false)} />}
      {children}
      <Footer />
    </main>
  )
}