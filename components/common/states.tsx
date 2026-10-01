import type { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

export function LoadingBlock({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center text-sm text-white/45">
      <Loader2 className="mr-3 size-4 animate-spin" />
      {label}
    </div>
  )
}

export function ErrorBox({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-5 text-sm text-red-200">
      <p>{message}</p>
      {retry && (
        <button onClick={retry} className="mt-3 rounded-full border border-red-300/40 px-4 py-1.5 text-xs">
          Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center">
      <h3 className="font-serif text-2xl">{title}</h3>
      {text && <p className="mt-2 text-sm text-white/50">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}