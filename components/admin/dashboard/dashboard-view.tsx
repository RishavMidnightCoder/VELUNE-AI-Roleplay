'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { PageHeader } from '../ui/page-header'
import { StatCard } from '../ui/stat-card'
import { StoriesTable } from '../stories/stories-table'
import { ErrorBox, LoadingBlock } from '@/components/common/states'
import { useAsync } from '@/hooks/use-async'
import { adminService } from '@/lib/services'

export function DashboardView() {
  const stats = useAsync(() => adminService.stats(), [])
  const stories = useAsync(() => adminService.stories(), [])
  const s = stats.data

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your stories and players."
        action={
          <Link href="/admin/stories/new" className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950">
            <Plus className="size-4" /> New story
          </Link>
        }
      />

      {stats.error ? (
        <ErrorBox message={stats.error} retry={stats.reload} />
      ) : !s ? (
        <LoadingBlock />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total stories" value={String(s.totalStories)} note={`${s.publishedStories} published`} />
          <StatCard label="Active players" value={s.activePlayersWeek.toLocaleString()} note="Last 7 days" />
          <StatCard label="Messages today" value={s.messagesToday.toLocaleString()} note="Player + AI messages" />
          <StatCard label="New users" value={String(s.newUsersWeek)} note={`${s.totalUsers} total users`} />
        </div>
      )}

      <h2 className="mb-4 mt-12 font-serif text-2xl">Recent stories</h2>
      {stories.error ? (
        <ErrorBox message={stories.error} retry={stories.reload} />
      ) : !stories.data ? (
        <LoadingBlock />
      ) : (
        <StoriesTable stories={stories.data.slice(0, 5)} />
      )}
    </>
  )
}