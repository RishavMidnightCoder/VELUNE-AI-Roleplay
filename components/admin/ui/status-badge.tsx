export function StatusBadge({ status }: { status: 'published' | 'draft' }) {
  const published = status === 'published'
  return (
    <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[.18em] ${published ? 'bg-emerald-400/15 text-emerald-300' : 'bg-white/10 text-white/50'}`}>
      {status}
    </span>
  )
}