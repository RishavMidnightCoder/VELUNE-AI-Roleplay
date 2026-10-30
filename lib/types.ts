export type Role = 'user' | 'admin'

export type User = { id: number; name: string; email: string; role: Role; createdAt: string }
export type TokenResponse = { accessToken: string; tokenType: string; user: User }

export type PublicStory = {
  id: number; title: string; genre: string; ageRating: string; description: string
  coverImage: string; languages: string[]; sceneCount: number
}
export type PublicCharacter = {
  id: number; storyId: number; story: string; name: string; role: string; personality: string; backstory: string
  image?: string | null
}
export type ProgressCard = {
  storyId: number; title: string; genre: string; coverImage: string; sceneIndex: number; progress: number
}
export type StoryCardData = { id: number; title: string; meta: string; image: string; progress: number | null }

export type SceneInput = { title: string; mood: string; narration: string }
export type StoryFormValues = {
  title: string; genre: string; ageRating: string; description: string; coverImage: string
  status: 'draft' | 'published'; systemPrompt: string; tone: string; languages: string[]; scenes: SceneInput[]
}
export type StoryAdmin = StoryFormValues & { id: number; createdAt: string; updatedAt: string }
export type StoryAdminRow = {
  id: number; title: string; genre: string; ageRating: string; status: 'draft' | 'published'
  scenes: number; players: number; updatedAt: string
}
export type DashboardStats = {
  totalStories: number; publishedStories: number; totalUsers: number
  newUsersWeek: number; activePlayersWeek: number; messagesToday: number
}
export type AdminUser = User & { storiesPlayed: number }
export type CharacterInput = {
  storyId: number; name: string; role: string; personality: string; backstory: string; image?: string | null
}

export type SceneBrief = { index: number; title: string; mood: string }
export type CurrentScene = SceneBrief & { narration: string }
export type ChatMessage = {
  id: number; role: 'user' | 'assistant'; content: string; createdAt: string; imageUrl?: string | null
}
export type PlayState = {
  storyId: number; title: string; languages: string[]; scenes: SceneBrief[]
  currentSceneIndex: number; currentScene: CurrentScene
  characters: { name: string; role: string }[]; messages: ChatMessage[]
  memoryJournal: string; progress: number
}