import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import type { StoryCardData } from '@/lib/types'

export function StoryCard({ story, onRestart }: { story: StoryCardData; onRestart?: () => void }) {
  const isNew = story.progress === null
  const href = `/play/${story.id}`

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/[.04] transition hover:-translate-y-1 hover:border-violet-300/40">
      <div className="relative aspect-[1.55]">
        <img src={story.image} alt={story.title} className="h-full w-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b12] to-transparent" />
        <Link href={href} className="absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-full bg-white text-slate-950" aria-label={`Open ${story.title}`}>
          <Play className="size-4" />
        </Link>
      </div>
      <div className="p-4">
        <div className="flex justify-between gap-3">
          <div>
            <h3 className="font-medium">{story.title}</h3>
            <p className="mt-1 text-xs text-white/45">{story.meta}</p>
          </div>
          <span className="text-xs text-violet-200">{isNew ? 'New' : `${story.progress}%`}</span>
        </div>
        <div className="mt-4 h-1 rounded-full bg-white/10">
          <div className="h-full rounded-full bg-violet-300" style={{ width: `${story.progress ?? 0}%` }} />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Link href={href} className="text-xs text-white/65">
            {isNew ? 'Start story' : 'Continue'} <ArrowRight className="ml-1 inline size-3" />
          </Link>
          {onRestart && (
            <button onClick={onRestart} className="text-xs text-white/35 hover:text-red-300">Restart</button>
          )}
        </div>
      </div>
    </article>
  )
}