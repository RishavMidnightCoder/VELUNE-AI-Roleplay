import type { CurrentScene } from '@/lib/types'

export function StoryStatePanel({ scene, progress, memory }: { scene: CurrentScene; progress: number; memory: string }) {
  return (
    <aside className="hidden border-l border-white/10 py-8 lg:block">
      <p className="text-[10px] uppercase tracking-[.22em] text-white/35">Story state</p>
      <div className="mt-7 flex flex-col gap-6 text-xs">
        <div>
          <p className="text-white/35">Location</p>
          <p className="mt-1">{scene.title}</p>
        </div>
        <div>
          <p className="text-white/35">Mood</p>
          <p className="mt-1 text-violet-200">{scene.mood}</p>
        </div>
        <div>
          <p className="text-white/35">Progress</p>
          <div className="mt-2 h-1 rounded-full bg-white/10">
            <div className="h-full rounded-full bg-violet-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div>
          <p className="text-white/35">Memory journal</p>
          <p className="mt-2 leading-6 text-white/60">{memory || 'Your choices will be remembered here.'}</p>
        </div>
      </div>
    </aside>
  )
}