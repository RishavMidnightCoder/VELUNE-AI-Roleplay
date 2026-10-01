'use client'

import { useState } from 'react'
import Link from 'next/link'
import { StoryCard } from '@/components/home/story-card'
import { EmptyState, ErrorBox, LoadingBlock } from '@/components/common/states'
import { useAsync } from '@/hooks/use-async'
import { playService } from '@/lib/services'
import { progressToCard } from '@/lib/utils'

export function MyStoriesView() {
  const { data, error, loading, reload } = useAsync(() => playService.myProgress(), [])
  const [actionError, setActionError] = useState<string | null>(null)

  const restart = async (storyId: number, title: string) => {
    if (!confirm(`Restart "${title}"? Your chat history and memory will be cleared.`)) return
    try {
      await playService.reset(storyId)
      reload()
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Could not restart the story')
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 lg:px-8">
      <p className="text-[10px] uppercase tracking-[.24em] text-violet-200">Library</p>
      <h1 className="mt-2 font-serif text-4xl font-light">My stories</h1>

      {actionError && <div className="mt-6"><ErrorBox message={actionError} /></div>}

      <div className="mt-8">
        {loading && !data ? (
          <LoadingBlock label="Loading your stories..." />
        ) : error ? (
          <ErrorBox message={error} retry={reload} />
        ) : !data || data.length === 0 ? (
          <EmptyState
            title="You haven't started a story yet"
            text="Pick one and your progress will be saved here."
            action={<Link href="/discover" className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950">Discover stories</Link>}
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((p) => (
              <StoryCard key={p.storyId} story={progressToCard(p)} onRestart={() => restart(p.storyId, p.title)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}