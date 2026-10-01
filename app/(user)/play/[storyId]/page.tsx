import { PlayView } from '@/components/roleplay/play-view'

export default async function PlayPage({ params }: { params: Promise<{ storyId: string }> }) {
  const { storyId } = await params
  return <PlayView storyId={Number(storyId)} />
}