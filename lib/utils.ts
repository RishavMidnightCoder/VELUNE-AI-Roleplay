import type { ProgressCard, PublicStory, StoryCardData } from './types'
import { API_URL } from './config'


export function imageUrl(path?: string | null) {
  if (!path) return '/placeholder.svg'
  if (path.startsWith('/uploads/')) return `${API_URL}${path}`
  return path
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function timeAgo(iso: string) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`
  return formatDate(iso)
}

export function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || 'U'
}

export function splitTitle(title: string): [string, string] {
  const words = title.trim().split(/\s+/)
  if (words.length < 2) return [title, '']
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}

export function withCurrent(options: string[], value: string) {
  return value && !options.includes(value) ? [value, ...options] : options
}

export function storyToCard(story: PublicStory, progress?: number): StoryCardData {
  return {
    id: story.id,
    title: story.title,
    meta: story.genre,
    image: imageUrl(story.coverImage),
    progress: progress ?? null,
  }
}

export function progressToCard(p: ProgressCard): StoryCardData {
  return { id: p.storyId, title: p.title, meta: p.genre, image: imageUrl(p.coverImage), progress: p.progress }
}

export type ReplyBlock =
  | { type: 'dialogue'; speaker: string; line: string }
  | { type: 'narration'; text: string }

// Matches:  Maya Rao: "Stay close."   or   **Maya Rao**: "Stay close."
const DIALOGUE = /^\**\s*([^:"“\n*]{1,40}?)\s*\**\s*:\s*\**\s*["“](.+?)["”]\s*$/

export function parseReply(content: string): ReplyBlock[] {
  return content
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line): ReplyBlock => {
      const m = line.match(DIALOGUE)
      return m ? { type: 'dialogue', speaker: m[1], line: m[2] } : { type: 'narration', text: line.replace(/\*/g, '') }
    })
}