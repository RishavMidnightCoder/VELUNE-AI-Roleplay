import { PageHeader } from '@/components/admin/ui/page-header'
import { StoryForm } from '@/components/admin/stories/story-form'
import { emptyStory } from '@/lib/constants'

export default function NewStoryPage() {
  return (
    <>
      <PageHeader title="New story" subtitle="Fill in the details, add scenes, then publish." />
      <StoryForm initial={emptyStory} />
    </>
  )
}