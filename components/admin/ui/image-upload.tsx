'use client'

import { useRef, useState } from 'react'
import { ImagePlus, Loader2, Trash2 } from 'lucide-react'
import { adminService } from '@/lib/services'
import { imageUrl } from '@/lib/utils'

const MAX_MB = 5
const ALLOWED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']

type Props = { label?: string; value: string; onChange: (url: string) => void }

export function ImageUpload({ label = 'Cover image', value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setError(null)
    if (!ALLOWED.includes(file.type)) return setError('Use a PNG, JPEG, WebP or GIF image.')
    if (file.size > MAX_MB * 1024 * 1024) return setError(`Image must be ${MAX_MB} MB or smaller.`)

    setUploading(true)
    try {
      const { url } = await adminService.uploadImage(file)
      onChange(url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <p className="mb-2 text-[10px] uppercase tracking-[.22em] text-white/45">{label}</p>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex aspect-video w-full max-w-[240px] items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white/5">
          {value ? (
            <img src={imageUrl(value)} alt="Cover preview" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-white/35">No image</span>
          )}
        </div>

        <div className="flex flex-col items-start gap-3">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-white/80 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
            {uploading ? 'Uploading...' : value ? 'Replace image' : 'Upload image'}
          </button>
          {value && !uploading && (
            <button type="button" onClick={() => onChange('')} className="flex items-center gap-2 text-xs text-white/40 hover:text-red-300">
              <Trash2 className="size-3" /> Remove
            </button>
          )}
          <p className="text-xs text-white/35">PNG, JPEG, WebP or GIF, up to {MAX_MB} MB.</p>
        </div>
      </div>
      {error && <p className="mt-3 text-xs text-red-300">{error}</p>}
    </div>
  )
}