export function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[.04] p-5">
      <p className="text-[10px] uppercase tracking-[.22em] text-white/40">{label}</p>
      <p className="mt-3 font-serif text-4xl font-light">{value}</p>
      <p className="mt-2 text-xs text-violet-200">{note}</p>
    </div>
  )
}