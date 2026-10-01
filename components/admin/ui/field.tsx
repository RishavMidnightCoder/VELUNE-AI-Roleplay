import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

const base =
  'w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-violet-300/60'

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-[.22em] text-white/45">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-white/35">{hint}</span>}
    </label>
  )
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={base} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={4} {...props} className={`${base} resize-y`} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`${base} bg-[#11111a] [color-scheme:dark] [&>option]:bg-[#11111a] [&>option]:text-white`}
    />
  )
}

export function FormSection({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[.04] p-6">
      <h2 className="font-serif text-xl">{title}</h2>
      {subtitle && <p className="mt-1 text-xs text-white/45">{subtitle}</p>}
      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </section>
  )
}