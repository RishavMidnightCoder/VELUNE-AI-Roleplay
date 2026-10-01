'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Mic, Send } from 'lucide-react'

type Recognition = {
  lang: string
  interimResults: boolean
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  start: () => void
  stop: () => void
}
type RecognitionCtor = new () => Recognition

function getRecognitionCtor(): RecognitionCtor | undefined {
  if (typeof window === 'undefined') return undefined
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

type Props = {
  choices: string[]
  languages: string[]
  disabled: boolean
  onSend: (action: string, language: string) => void
}

export function ActionBar({ choices, languages, disabled, onSend }: Props) {
  const [action, setAction] = useState('')
  const [lang, setLang] = useState(languages[0] ?? 'English')
  const [voiceSupported, setVoiceSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<Recognition | null>(null)

  useEffect(() => setVoiceSupported(!!getRecognitionCtor()), [])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const text = action.trim()
    if (!text || disabled) return
    onSend(text, lang)
    setAction('')
  }

  const toggleVoice = () => {
    if (listening) {
      recognitionRef.current?.stop()
      return
    }
    const Ctor = getRecognitionCtor()
    if (!Ctor) return
    const rec = new Ctor()
    rec.lang = lang === 'हिन्दी' ? 'hi-IN' : 'en-IN'
    rec.interimResults = true
    rec.onresult = (e) => setAction(Array.from(e.results).map((r) => r[0].transcript).join(' '))
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recognitionRef.current = rec
    setListening(true)
    rec.start()
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-[#0b0b12]/95 px-4 py-4 backdrop-blur-xl">
      <div className="mx-auto max-w-[760px]">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs text-white/45">{disabled ? 'The story is unfolding...' : 'What do you do?'}</p>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="rounded-full border border-white/15 bg-[#11111a] px-3 py-1 text-xs text-white/70 [color-scheme:dark] [&>option]:bg-[#11111a] [&>option]:text-white"
            aria-label="Language"
          >
            {languages.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>

        <div className="mb-3 flex gap-2 overflow-x-auto">
          {choices.map((choice) => (
            <button
              key={choice}
              type="button"
              disabled={disabled}
              onClick={() => setAction(choice)}
              className="whitespace-nowrap rounded-full border border-white/15 px-3 py-2 text-xs text-white/70 disabled:opacity-40"
            >
              {choice}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[.05] px-4 py-2">
          <input
            value={action}
            onChange={(e) => setAction(e.target.value)}
            placeholder="Type your action..."
            maxLength={1000}
            className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-white/30"
            aria-label="Your action"
          />
          {voiceSupported && (
            <button type="button" onClick={toggleVoice} aria-label="Voice input" className={listening ? 'text-violet-200' : 'text-white/45'}>
              <Mic className="size-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={disabled || !action.trim()}
            aria-label="Send action"
            className="flex size-9 items-center justify-center rounded-full bg-white text-slate-950 disabled:opacity-40"
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </div>
  )
}