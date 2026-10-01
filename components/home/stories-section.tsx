import { StoryCard } from './story-card'
import type { StoryCardData } from '@/lib/types'

export function StoriesSection({ cards }: { cards: StoryCardData[] }) {
  return (
    <section className="mt-12">
      <p className="text-[10px] uppercase tracking-[.24em] text-violet-200">Pick up where you left off</p>
      <h2 className="mt-2 font-serif text-3xl">Your stories</h2>
      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {cards.map((card) => <StoryCard key={card.id} story={card} />)}
      </div>
    </section>
  )
}