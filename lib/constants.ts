import { BookOpen, Compass, LayoutDashboard, Library, Sparkles, UserCog, Users } from 'lucide-react'
import type { StoryFormValues } from './types'

export const userNav = [
  { label: 'Home', href: '/', icon: Compass },
  { label: 'Discover', href: '/discover', icon: Sparkles },
  { label: 'Characters', href: '/characters', icon: Users },
  { label: 'My stories', href: '/my-stories', icon: Library },
] as const

export const adminNav = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Stories', href: '/admin/stories', icon: BookOpen },
  { label: 'Characters', href: '/admin/characters', icon: Users },
  { label: 'Users', href: '/admin/users', icon: UserCog },
] as const

export const genres = ['Mystery', 'Drama · Romance', 'Dark fantasy', 'Sci-fi', 'Horror', 'Adventure']
export const ageRatings = ['All ages', '13+', '16+', '18+']
export const tones = ['Suspenseful', 'Romantic', 'Dark', 'Light-hearted', 'Epic']
export const languageOptions = ['English', 'हिन्दी', 'Hinglish', 'Auto Detect']
export const moods = ['Suspense', 'Calm', 'Tense', 'Romantic', 'Action']

export const DEFAULT_CHOICES = ['Continue forward', 'Look around carefully', 'Ask what happens next']

export const emptyStory: StoryFormValues = {
  title: '',
  genre: genres[0],
  ageRating: ageRatings[0],
  description: '',
  coverImage: '',
  status: 'draft',
  systemPrompt: '',
  tone: tones[0],
  languages: ['English'],
  scenes: [{ title: '', mood: moods[0], narration: '' }],
}