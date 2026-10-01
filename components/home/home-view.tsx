'use client'

import { Hero } from './hero'
import { StoriesSection } from './stories-section'
import { CharactersSection } from './characters-section'
import { EmptyState, ErrorBox, LoadingBlock } from '@/components/common/states'
import { useAsync } from '@/hooks/use-async'
import { charactersService, playService, storiesService } from '@/lib/services'
import { storyToCard } from '@/lib/utils'

export function HomeView() {
  const stories = useAsync(() => storiesService.list(), [])
  const progress = useAsync(() => playService.myProgress(), [])
  const characters = useAsync(() => charactersService.list(), [])

  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 lg:px-8">
      {stories.loading && !stories.data ? (
        <LoadingBlock label="Loading stories..." />
      ) : stories.error ? (
        <ErrorBox message={stories.error} retry={stories.reload} />
      ) : !stories.data || stories.data.length === 0 ? (
        <EmptyState title="No stories yet" text="New stories will appear here once an admin publishes them." />
      ) : (
        (() => {
          const list = stories.data
          const progressList = progress.data ?? []
          const progressById = new Map(progressList.map((p) => [p.storyId, p.progress]))
          const featured = list.find((s) => s.id === progressList[0]?.storyId) ?? list[0]
          const sorted = [...list].sort((a, b) => Number(progressById.has(b.id)) - Number(progressById.has(a.id)))
          const cards = sorted.slice(0, 6).map((s) => storyToCard(s, progressById.get(s.id)))
          return (
            <>
              <Hero story={featured} started={progressById.has(featured.id)} />
              <StoriesSection cards={cards} />
              <CharactersSection characters={characters.data ?? []} />
            </>
          )
        })()
      )}
    </div>
  )
}