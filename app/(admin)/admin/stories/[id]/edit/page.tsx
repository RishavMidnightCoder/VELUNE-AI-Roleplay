import { EditStoryView } from '@/components/admin/stories/edit-story-view'

export default async function EditStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <EditStoryView storyId={Number(id)} />
}