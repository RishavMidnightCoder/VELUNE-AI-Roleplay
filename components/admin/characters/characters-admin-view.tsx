'use client'

import { useState, type FormEvent } from 'react'
import { Image as ImageIcon, Pencil, Plus, Trash2, X } from 'lucide-react'
import { PageHeader } from '../ui/page-header'
import { Field, FormSection, Input, Select, Textarea } from '../ui/field'
import { EmptyState, ErrorBox, LoadingBlock } from '@/components/common/states'
import { useAsync } from '@/hooks/use-async'
import { adminService } from '@/lib/services'
import type { PublicCharacter, StoryAdminRow } from '@/lib/types'
import { imageUrl } from '@/lib/utils'


function CharacterForm({
  stories, initial, onSaved, onCancel,
}: {
  stories: StoryAdminRow[]
  initial: PublicCharacter | null
  onSaved: () => void
  onCancel: () => void
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [role, setRole] = useState(initial?.role ?? '')
  const [storyId, setStoryId] = useState<number>(initial?.storyId ?? stories[0]?.id ?? 0)
  const [personality, setPersonality] = useState(initial?.personality ?? '')
  const [backstory, setBackstory] = useState(initial?.backstory ?? '')
  const [image, setImage] = useState<string | null>(initial?.image ?? null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onPickImage = async (file: File | undefined) => {
    if (!file) return
    setError(null)
    setUploading(true)
    try {
      const res = await adminService.uploadImage(file)
      setImage(res.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not upload the image')
    } finally {
      setUploading(false)
    }
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!name.trim()) return setError('Name is required.')
    if (!storyId) return setError('Choose a story first.')
    setSaving(true)
    try {
      const payload = { storyId, name: name.trim(), role, personality, backstory, image }
      if (initial) await adminService.updateCharacter(initial.id, payload)
      else await adminService.createCharacter(payload)
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the character')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="mb-8">
      <FormSection title={initial ? `Edit ${initial.name}` : 'New character'}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Maya Rao" /></Field>
          <Field label="Role"><Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Private investigator" /></Field>
        </div>
        <Field label="Story">
          <Select value={storyId} onChange={(e) => setStoryId(Number(e.target.value))}>
            {stories.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
          </Select>
        </Field>
        <Field label="Portrait">
          <div className="flex items-center gap-4">
            <div className="flex size-20 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[.04]">
              {image ? (
                <img src={imageUrl(image)} alt="Portrait" className="size-full object-cover" />
              ) : (
                <ImageIcon className="size-6 text-white/30" />
              )}
            </div>
            <div className="flex flex-col gap-2 text-xs text-white/50">
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(e) => onPickImage(e.target.files?.[0])}
                className="text-xs"
              />
              <span>{uploading ? 'Uploading...' : 'Use a clear, front-facing photo of one person.'}</span>
              {image && (
                <button type="button" onClick={() => setImage(null)} className="w-fit text-red-300 hover:underline">
                  Remove
                </button>
              )}
            </div>
          </div>
        </Field>
        <Field label="Personality"><Textarea rows={3} value={personality} onChange={(e) => setPersonality(e.target.value)} placeholder="Smart, mysterious, hiding a secret." /></Field>
        <Field label="Backstory"><Textarea rows={4} value={backstory} onChange={(e) => setBackstory(e.target.value)} /></Field>
        {error && <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={saving || uploading} className="rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-950 disabled:opacity-60">
            {saving ? 'Saving...' : 'Save character'}
          </button>
          <button type="button" onClick={onCancel} className="rounded-full border border-white/15 px-5 py-3 text-sm text-white/70">Cancel</button>
        </div>
      </FormSection>
    </form>
  )
}

export function CharactersAdminView() {
  const characters = useAsync(() => adminService.characters(), [])
  const stories = useAsync(() => adminService.stories(), [])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<PublicCharacter | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const openNew = () => { setEditing(null); setShowForm(true) }
  const openEdit = (c: PublicCharacter) => { setEditing(c); setShowForm(true) }
  const close = () => { setShowForm(false); setEditing(null) }

  const remove = async (c: PublicCharacter) => {
    if (!confirm(`Delete ${c.name}?`)) return
    try {
      await adminService.deleteCharacter(c.id)
      setActionError(null)
      characters.reload()
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Could not delete the character')
    }
  }

  return (
    <>
      <PageHeader
        title="Characters"
        subtitle="Characters players meet inside your stories."
        action={
          <button onClick={showForm ? close : openNew} className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950">
            {showForm ? <X className="size-4" /> : <Plus className="size-4" />}
            {showForm ? 'Close' : 'New character'}
          </button>
        }
      />

      {showForm &&
        (stories.data && stories.data.length > 0 ? (
          <CharacterForm
            key={editing?.id ?? 'new'}
            stories={stories.data}
            initial={editing}
            onCancel={close}
            onSaved={() => { close(); characters.reload() }}
          />
        ) : (
          <div className="mb-8"><ErrorBox message="Create a story first, then you can add characters to it." /></div>
        ))}

      {actionError && <div className="mb-4"><ErrorBox message={actionError} /></div>}

      {characters.error ? (
        <ErrorBox message={characters.error} retry={characters.reload} />
      ) : characters.loading && !characters.data ? (
        <LoadingBlock />
      ) : !characters.data || characters.data.length === 0 ? (
        <EmptyState title="No characters yet" text="Add the first character for one of your stories." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {characters.data.map((c) => (
            <div key={c.id} className="rounded-2xl border border-white/10 bg-white/[.04] p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{c.name}</h3>
                  <p className="mt-1 text-xs text-white/45">{c.role}</p>
                </div>
                <div className="flex gap-3 text-white/45">
                  <button onClick={() => openEdit(c)} aria-label={`Edit ${c.name}`} className="hover:text-white"><Pencil className="size-4" /></button>
                  <button onClick={() => remove(c)} aria-label={`Delete ${c.name}`} className="hover:text-red-300"><Trash2 className="size-4" /></button>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/60">{c.personality}</p>
              <p className="mt-4 text-[10px] uppercase tracking-[.2em] text-violet-200">{c.story}</p>
            </div>
          ))}
        </div>
      )}
    </>
  )
}