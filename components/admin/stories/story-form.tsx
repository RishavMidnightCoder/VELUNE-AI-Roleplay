'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'
import { Field, FormSection, Input, Select, Textarea } from '../ui/field'
import { adminService } from '@/lib/services'
import { ageRatings, genres, languageOptions, moods, tones } from '@/lib/constants'
import { withCurrent } from '@/lib/utils'
import type { SceneInput, StoryFormValues } from '@/lib/types'
import { ImageUpload } from '../ui/image-upload'

// Keeps only the fields the backend accepts (edit data also carries id and timestamps).
function pick(f: StoryFormValues): StoryFormValues {
  return {
    title: f.title.trim(),
    genre: f.genre,
    ageRating: f.ageRating,
    description: f.description,
    coverImage: f.coverImage.trim(),
    status: f.status,
    systemPrompt: f.systemPrompt,
    tone: f.tone,
    languages: f.languages.length ? f.languages : ['English'],
    scenes: f.scenes.map((s) => ({ title: s.title.trim(), mood: s.mood, narration: s.narration })),
  }
}

export function StoryForm({ initial, storyId }: { initial: StoryFormValues; storyId?: number }) {
  const router = useRouter()
  const [form, setForm] = useState<StoryFormValues>(() => pick(initial))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = <K extends keyof StoryFormValues>(key: K, value: StoryFormValues[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const updateScene = (i: number, patch: Partial<SceneInput>) =>
    set('scenes', form.scenes.map((s, idx) => (idx === i ? { ...s, ...patch } : s)))
  const addScene = () => set('scenes', [...form.scenes, { title: '', mood: moods[0], narration: '' }])
  const removeScene = (i: number) => set('scenes', form.scenes.filter((_, idx) => idx !== i))
  const toggleLanguage = (lang: string) =>
    set('languages', form.languages.includes(lang) ? form.languages.filter((l) => l !== lang) : [...form.languages, lang])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }
    setSaving(true)
    try {
      const payload = pick(form)
      if (storyId) await adminService.updateStory(storyId, payload)
      else await adminService.createStory(payload)
      router.push('/admin/stories')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the story')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <FormSection title="Basic info" subtitle="What players see on the story card.">
        <Field label="Title">
          <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="The House That Waits" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Genre">
            <Select value={form.genre} onChange={(e) => set('genre', e.target.value)}>
              {withCurrent(genres, form.genre).map((g) => <option key={g}>{g}</option>)}
            </Select>
          </Field>
          <Field label="Age rating">
            <Select value={form.ageRating} onChange={(e) => set('ageRating', e.target.value)}>
              {withCurrent(ageRatings, form.ageRating).map((a) => <option key={a}>{a}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Description">
          <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="A short hook for the story..." />
        </Field>
        <ImageUpload value={form.coverImage} onChange={(url) => set('coverImage', url)} />
      </FormSection>

      <FormSection title="AI settings" subtitle="Controls how the AI narrates and replies in this story.">
        <Field label="System prompt">
          <Textarea rows={6} value={form.systemPrompt} onChange={(e) => set('systemPrompt', e.target.value)} placeholder="You are the narrator of..." />
        </Field>
        <Field label="Tone">
          <Select value={form.tone} onChange={(e) => set('tone', e.target.value)}>
            {withCurrent(tones, form.tone).map((t) => <option key={t}>{t}</option>)}
          </Select>
        </Field>
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-[.22em] text-white/45">Languages</p>
          <div className="flex flex-wrap gap-2">
            {languageOptions.map((lang) => {
              const on = form.languages.includes(lang)
              return (
                <button
                  type="button"
                  key={lang}
                  onClick={() => toggleLanguage(lang)}
                  className={`rounded-full border px-4 py-2 text-xs ${on ? 'border-violet-300/60 bg-violet-300/15 text-violet-200' : 'border-white/15 text-white/55'}`}
                >
                  {lang}
                </button>
              )
            })}
          </div>
        </div>
      </FormSection>

      <FormSection title="Scenes" subtitle="Scenes play in the order listed.">
        {form.scenes.map((scene, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-white/[.03] p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[.22em] text-violet-200">Scene {String(i + 1).padStart(2, '0')}</p>
              <button type="button" onClick={() => removeScene(i)} aria-label="Remove scene" className="text-white/40 hover:text-red-300">
                <Trash2 className="size-4" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
              <Field label="Scene title">
                <Input value={scene.title} onChange={(e) => updateScene(i, { title: e.target.value })} placeholder="The abandoned mansion" />
              </Field>
              <Field label="Mood">
                <Select value={scene.mood} onChange={(e) => updateScene(i, { mood: e.target.value })}>
                  {withCurrent(moods, scene.mood).map((m) => <option key={m}>{m}</option>)}
                </Select>
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Opening narration">
                <Textarea rows={3} value={scene.narration} onChange={(e) => updateScene(i, { narration: e.target.value })} />
              </Field>
            </div>
          </div>
        ))}
        <button type="button" onClick={addScene} className="flex w-fit items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-white/70">
          <Plus className="size-4" /> Add scene
        </button>
      </FormSection>

      <FormSection title="Publishing">
        <Field label="Status" hint="Only published stories are visible to players. Publishing needs at least one scene, and every scene needs a title.">
          <Select value={form.status} onChange={(e) => set('status', e.target.value as StoryFormValues['status'])}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </Select>
        </Field>
      </FormSection>

      {error && <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}

      <div className="flex justify-end gap-3">
        <Link href="/admin/stories" className="rounded-full border border-white/15 px-5 py-3 text-sm text-white/70">Cancel</Link>
        <button type="submit" disabled={saving} className="rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-950 disabled:opacity-60">
          {saving ? 'Saving...' : storyId ? 'Save changes' : 'Create story'}
        </button>
      </div>
    </form>
  )
}