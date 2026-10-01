import type { ReactNode } from 'react'

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-[10px] uppercase tracking-[.24em] text-violet-200">Admin</p>
        <h1 className="mt-2 font-serif text-4xl font-light">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-white/50">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}