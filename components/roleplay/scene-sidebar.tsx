import Link from 'next/link'
import { RotateCcw } from 'lucide-react'
import { splitTitle } from '@/lib/utils'
import type { SceneBrief } from '@/lib/types'

type Props = {
  title: string
  scenes: SceneBrief[]
  activeIndex: number
  onSelect: (index: number) => void
  onRestart: () => void
}

export function SceneSidebar({ title, scenes, activeIndex, onSelect, onRestart }: Props) {
  const [first, second] = splitTitle(title)
  return (
    <aside className="hidden border-r border-white/10 py-8 lg:block">
      <Link href="/" className="mb-10 block text-xs text-white/45 hover:text-white">← Back to home</Link>
      <p className="text-[10px] uppercase tracking-[.22em] text-white/35">Your story</p>
      <h2 className="mt-3 font-serif text-2xl">
        {first}
        {second && (<><br />{second}</>)}
      </h2>
      <div className="mt-10 flex flex-col gap-5 text-left text-xs">
        {scenes.map((s) => (
          <button
            key={s.index}
            onClick={() => onSelect(s.index)}
            className={`text-left ${s.index === activeIndex ? 'text-violet-200' : 'text-white/45 hover:text-white/80'}`}
          >
            Scene {String(s.index + 1).padStart(2, '0')} · {s.title}
          </button>
        ))}
      </div>
      <button onClick={onRestart} className="mt-12 flex items-center gap-2 text-xs text-white/35 hover:text-red-300">
        <RotateCcw className="size-3" /> Restart story
      </button>
    </aside>
  )
}