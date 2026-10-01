import { api } from './api'
import type {
  AdminUser, CharacterInput, DashboardStats, PlayState, ProgressCard, PublicCharacter, PublicStory,
  StoryAdmin, StoryAdminRow, StoryFormValues, TokenResponse, User,
} from './types'

export const authService = {
  login: (email: string, password: string) =>
    api<TokenResponse>('/auth/login', { method: 'POST', body: { email, password }, auth: false }),
  signup: (name: string, email: string, password: string) =>
    api<TokenResponse>('/auth/signup', { method: 'POST', body: { name, email, password }, auth: false }),
  me: () => api<User>('/auth/me'),
}

export const storiesService = {
  list: () => api<PublicStory[]>('/stories'),
  get: (id: number) => api<PublicStory>(`/stories/${id}`),
}

export const charactersService = {
  list: () => api<PublicCharacter[]>('/characters'),
}

export const playService = {
  myProgress: () => api<ProgressCard[]>('/play/progress/me'),
  state: (storyId: number) => api<PlayState>(`/play/${storyId}`),
  setScene: (storyId: number, sceneIndex: number) =>
    api<PlayState>(`/play/${storyId}/scene`, { method: 'PUT', body: { sceneIndex } }),
  reset: (storyId: number) => api<void>(`/play/${storyId}/reset`, { method: 'POST' }),
}

export const adminService = {
  stats: () => api<DashboardStats>('/admin/stats'),
  stories: () => api<StoryAdminRow[]>('/admin/stories'),
  story: (id: number) => api<StoryAdmin>(`/admin/stories/${id}`),
  createStory: (data: StoryFormValues) => api<StoryAdmin>('/admin/stories', { method: 'POST', body: data }),
  updateStory: (id: number, data: StoryFormValues) =>
    api<StoryAdmin>(`/admin/stories/${id}`, { method: 'PUT', body: data }),
  deleteStory: (id: number) => api<void>(`/admin/stories/${id}`, { method: 'DELETE' }),

  characters: () => api<PublicCharacter[]>('/admin/characters'),
  createCharacter: (data: CharacterInput) =>
    api<PublicCharacter>('/admin/characters', { method: 'POST', body: data }),
  updateCharacter: (id: number, data: CharacterInput) =>
    api<PublicCharacter>(`/admin/characters/${id}`, { method: 'PUT', body: data }),
  deleteCharacter: (id: number) => api<void>(`/admin/characters/${id}`, { method: 'DELETE' }),

  users: () => api<AdminUser[]>('/admin/users'),

    uploadImage: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api<{ url: string }>('/admin/uploads', { method: 'POST', body: form })
  },
}