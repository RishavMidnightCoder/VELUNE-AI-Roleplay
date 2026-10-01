import Link from 'next/link'
import { Pencil, Trash2 } from 'lucide-react'
import { StatusBadge } from '../ui/status-badge'
import { timeAgo } from '@/lib/utils'
import type { StoryAdminRow } from '@/lib/types'

export function StoriesTable({ stories, onDelete }: { stories: StoryAdminRow[]; onDelete?: (story: StoryAdminRow) => void }) {
  if (stories.length === 0) {
    return <p className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-white/45">No stories yet.</p>
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[.04]">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="text-[10px] uppercase tracking-[.2em] text-white/40">
          <tr className="border-b border-white/10">
            <th className="px-5 py-4 font-normal">Story</th>
            <th className="px-5 py-4 font-normal">Status</th>
            <th className="px-5 py-4 font-normal">Scenes</th>
            <th className="px-5 py-4 font-normal">Players</th>
            <th className="px-5 py-4 font-normal">Updated</th>
            <th className="px-5 py-4 text-right font-normal">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stories.map((s) => (
            <tr key={s.id} className="border-b border-white/5 last:border-0">
              <td className="px-5 py-4">
                <p className="font-medium">{s.title}</p>
                <p className="mt-1 text-xs text-white/45">{s.genre} · {s.ageRating}</p>
              </td>
              <td className="px-5 py-4"><StatusBadge status={s.status} /></td>
              <td className="px-5 py-4 text-white/70">{s.scenes}</td>
              <td className="px-5 py-4 text-white/70">{s.players.toLocaleString()}</td>
              <td className="px-5 py-4 text-white/50">{timeAgo(s.updatedAt)}</td>
              <td className="px-5 py-4">
                <div className="flex justify-end gap-3 text-white/50">
                  <Link href={`/admin/stories/${s.id}/edit`} aria-label={`Edit ${s.title}`} className="hover:text-white"><Pencil className="size-4" /></Link>
                  {onDelete && (
                    <button onClick={() => onDelete(s)} aria-label={`Delete ${s.title}`} className="hover:text-red-300"><Trash2 className="size-4" /></button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}