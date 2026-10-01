'use client'

import { useState } from 'react'
import { PlaySession } from './play-session'
import { ErrorBox, LoadingBlock } from '@/components/common/states'
import { useAsync } from '@/hooks/use-async'
import { playService, storiesService } from '@/lib/services'

export function PlayView({ storyId }: { storyId: number }) {
  const [version, setVersion] = useState(0)
  const { data, error, loading, reload } = useAsync(
    async () => {
      const [state, story] = await Promise.all([playService.state(storyId), storiesService.get(storyId)])
      return { state, story }
    },
    [storyId, version],
  )

  if (loading || !data) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        {error ? <ErrorBox message={error} retry={reload} /> : <LoadingBlock label="Opening your story..." />}
      </div>
    )
  }

  return (
    <PlaySession
      key={`${storyId}-${version}`}
      initial={data.state}
      story={data.story}
      onRestart={() => setVersion((v) => v + 1)}
    />
  )
}