'use client'

import { useState, type ReactNode } from 'react'
import { AdminSidebar } from '../layout/admin-sidebar'
import { AdminTopbar } from '../layout/admin-topbar'

export function AdminShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen bg-[#0b0b12] text-white lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <AdminSidebar open={open} close={() => setOpen(false)} />
      <div className="min-w-0">
        <AdminTopbar toggle={() => setOpen(!open)} />
        <main className="mx-auto max-w-6xl px-5 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  )
}