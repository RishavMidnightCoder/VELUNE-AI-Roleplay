'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { StoryCard } from '@/components/home/story-card'
import { EmptyState, ErrorBox, LoadingBlock } from '@/components/common/states'
import { useAsync } from '@/hooks/use-async'
import { playService, storiesService } from '@/lib/services'
import { storyToCard } from '@/lib/utils'

export function DiscoverView() {
  const stories = useAsync(() => storiesService.list(), [])
  const progress = useAsync(() => playService.myProgress(), [])
  const [query, setQuery] = useState('')

  const progressById = new Map((progress.data ?? []).map((p) => [p.storyId, p.progress]))
  const q = query.trim().toLowerCase()
  const filtered = (stories.data ?? []).filter(
    (s) => !q || s.title.toLowerCase().includes(q) || s.genre.toLowerCase().includes(q),
  )

  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 lg:px-8">
      <p className="text-[10px] uppercase tracking-[.24em] text-violet-200">Explore</p>
      <h1 className="mt-2 font-serif text-4xl font-light">Discover stories</h1>

      <div className="mt-6 flex max-w-md items-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5">
        <Search className="size-4 text-white/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or genre"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/30"
          aria-label="Search stories"
        />
      </div>

      <div className="mt-8">
        {stories.loading && !stories.data ? (
          <LoadingBlock label="Loading stories..." />
        ) : stories.error ? (
          <ErrorBox message={stories.error} retry={stories.reload} />
        ) : filtered.length === 0 ? (
          <EmptyState title="Nothing found" text={q ? 'Try a different search.' : 'No stories are published yet.'} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => <StoryCard key={s.id} story={storyToCard(s, progressById.get(s.id))} />)}
          </div>
        )}
      </div>
    </div>
  )
}