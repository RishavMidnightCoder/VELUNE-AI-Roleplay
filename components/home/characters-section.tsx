import Link from 'next/link'
import type { PublicCharacter } from '@/lib/types'

export function CharactersSection({ characters }: { characters: PublicCharacter[] }) {
  if (characters.length === 0) return null
  return (
    <section className="mt-14">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[.24em] text-violet-200">Made for your mood</p>
          <h2 className="mt-2 font-serif text-3xl">Meet someone new</h2>
        </div>
        <Link href="/characters" className="text-xs text-white/55 hover:text-white">See all</Link>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {characters.slice(0, 3).map((c) => (
          <Link key={c.id} href={`/play/${c.storyId}`} className="rounded-2xl border border-white/10 bg-white/[.04] p-4 text-sm text-white/75 transition hover:border-violet-300/40">
            {c.name} · {c.role}
            <p className="mt-2 line-clamp-2 text-xs text-white/40">{c.personality}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}