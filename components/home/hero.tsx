import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { PublicStory } from '@/lib/types'
import { imageUrl, splitTitle } from '@/lib/utils'

export function Hero({ story, started }: { story: PublicStory; started: boolean }) {
  const [first, second] = splitTitle(story.title)
  return (
    <section className="relative min-h-[430px] overflow-hidden rounded-3xl border border-white/10">
      <img src={imageUrl(story.coverImage)} alt={story.title} className="absolute inset-0 h-full w-full object-cover opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b12] via-[#0b0b12]/70 to-transparent" />
      <div className="relative flex min-h-[430px] max-w-xl flex-col justify-end p-8 sm:p-12">
        <p className="mb-5 text-[10px] uppercase tracking-[.24em] text-violet-200">Featured story · {story.ageRating}</p>
        <h1 className="font-serif text-5xl font-light leading-[.95] sm:text-6xl">
          {first}
          {second && (<><br /><em className="text-violet-200">{second}</em></>)}
        </h1>
        <p className="mt-5 line-clamp-3 max-w-md text-sm leading-6 text-white/60">{story.description}</p>
        <Link href={`/play/${story.id}`} className="mt-7 w-fit rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950">
          {started ? 'Continue story' : 'Start story'} <ArrowRight className="ml-2 inline size-4" />
        </Link>
      </div>
    </section>
  )
}