'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { PageHeader } from '../ui/page-header'
import { StoriesTable } from './stories-table'
import { ErrorBox, LoadingBlock } from '@/components/common/states'
import { useAsync } from '@/hooks/use-async'
import { adminService } from '@/lib/services'
import type { StoryAdminRow } from '@/lib/types'

export function StoriesAdminView() {
  const { data, error, loading, reload } = useAsync(() => adminService.stories(), [])
  const [actionError, setActionError] = useState<string | null>(null)

  const remove = async (story: StoryAdminRow) => {
    if (!confirm(`Delete "${story.title}"? Its scenes, characters and player progress will be deleted too.`)) return
    try {
      await adminService.deleteStory(story.id)
      setActionError(null)
      reload()
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Could not delete the story')
    }
  }

  return (
    <>
      <PageHeader
        title="Stories"
        subtitle="Create and manage the stories players can play."
        action={
          <Link href="/admin/stories/new" className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950">
            <Plus className="size-4" /> New story
          </Link>
        }
      />
      {actionError && <div className="mb-4"><ErrorBox message={actionError} /></div>}
      {error ? (
        <ErrorBox message={error} retry={reload} />
      ) : loading && !data ? (
        <LoadingBlock />
      ) : (
        <StoriesTable stories={data ?? []} onDelete={remove} />
      )}
    </>
  )
}