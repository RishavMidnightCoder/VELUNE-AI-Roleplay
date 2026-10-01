'use client'

import Link from 'next/link'
import { EmptyState, ErrorBox, LoadingBlock } from '@/components/common/states'
import { useAsync } from '@/hooks/use-async'
import { charactersService } from '@/lib/services'

export function CharactersView() {
  const { data, error, loading, reload } = useAsync(() => charactersService.list(), [])

  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 lg:px-8">
      <p className="text-[10px] uppercase tracking-[.24em] text-violet-200">Cast</p>
      <h1 className="mt-2 font-serif text-4xl font-light">Characters</h1>

      <div className="mt-8">
        {loading && !data ? (
          <LoadingBlock label="Loading characters..." />
        ) : error ? (
          <ErrorBox message={error} retry={reload} />
        ) : !data || data.length === 0 ? (
          <EmptyState title="No characters yet" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((c) => (
              <Link key={c.id} href={`/play/${c.storyId}`} className="rounded-2xl border border-white/10 bg-white/[.04] p-5 transition hover:border-violet-300/40">
                <h3 className="font-medium">{c.name}</h3>
                <p className="mt-1 text-xs text-white/45">{c.role}</p>
                <p className="mt-4 text-sm text-white/60">{c.personality}</p>
                <p className="mt-4 text-[10px] uppercase tracking-[.2em] text-violet-200">{c.story}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}