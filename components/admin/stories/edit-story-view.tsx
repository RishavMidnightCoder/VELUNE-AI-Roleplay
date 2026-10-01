'use client'

import { PageHeader } from '../ui/page-header'
import { StoryForm } from './story-form'
import { ErrorBox, LoadingBlock } from '@/components/common/states'
import { useAsync } from '@/hooks/use-async'
import { adminService } from '@/lib/services'

export function EditStoryView({ storyId }: { storyId: number }) {
  const { data, error, loading, reload } = useAsync(() => adminService.story(storyId), [storyId])

  return (
    <>
      <PageHeader title="Edit story" subtitle={data ? data.title : `Story ID: ${storyId}`} />
      {error ? <ErrorBox message={error} retry={reload} /> : loading || !data ? <LoadingBlock /> : <StoryForm initial={data} storyId={storyId} />}
    </>
  )
}