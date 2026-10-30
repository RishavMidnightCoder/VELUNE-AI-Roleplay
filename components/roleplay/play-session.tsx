'use client'

import { useEffect, useRef, useState } from 'react'
import { ActionBar } from './action-bar'
import { MessageList, type Phase } from './message-list'
import { SceneSidebar } from './scene-sidebar'
import { StoryStatePanel } from './story-state-panel'
import { DEFAULT_CHOICES } from '@/lib/constants'
import { playService } from '@/lib/services'
import { streamAction } from '@/lib/stream'
import { imageUrl } from '@/lib/utils'
import type { ChatMessage, PlayState, PublicStory } from '@/lib/types'

type Props = { initial: PlayState; story: PublicStory; onRestart: () => void }

export function PlaySession({ initial, story, onRestart }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(initial.messages)
  const [memory, setMemory] = useState(initial.memoryJournal)
  const [sceneIndex, setSceneIndex] = useState(initial.currentSceneIndex)
  const [currentScene, setCurrentScene] = useState(initial.currentScene)
  const [progress, setProgress] = useState(initial.progress)
  const [choices, setChoices] = useState<string[]>(DEFAULT_CHOICES)
  const [streamText, setStreamText] = useState('')
  const [phase, setPhase] = useState<Phase>('idle')
  const [pendingImageId, setPendingImageId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const busy = phase !== 'idle'
  const nextId = useRef(-1)
  const abortRef = useRef<AbortController | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => () => abortRef.current?.abort(), [])
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, streamText, pendingImageId])

  const send = async (action: string, language: string) => {
    if (busy) return
    setError(null)
    setPhase('writing')
    setStreamText('')
    setMessages((m) => [...m, { id: nextId.current--, role: 'user', content: action, createdAt: new Date().toISOString() }])

    const controller = new AbortController()
    abortRef.current = controller
    let full = ''

    try {
      await streamAction(
        initial.storyId,
        { action, language },
        (event) => {
          if (event.type === 'token') {
            full += event.content
            setStreamText(full)
          } else if (event.type === 'done') {
            setStreamText('')
            setMessages((m) => [
              ...m,
              { id: event.messageId, role: 'assistant', content: full, createdAt: new Date().toISOString(), imageUrl: null },
            ])
            setChoices(event.choices.length ? event.choices : DEFAULT_CHOICES)
            setMemory(event.memory)
            if (event.imagePending) {
              setPendingImageId(event.messageId)
              setPhase('painting')
            }
          } else if (event.type === 'image') {
            setMessages((m) => m.map((x) => (x.id === event.messageId ? { ...x, imageUrl: event.url } : x)))
            setPendingImageId(null)
          } else if (event.type === 'error') {
            setError(event.message)
          }
        },
        controller.signal,
      )
    } catch (err) {
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      }
    } finally {
      setStreamText('')
      setPendingImageId(null)
      setPhase('idle')
    }
  }

  const goToScene = async (index: number) => {
    if (busy || index === sceneIndex) return
    try {
      const res = await playService.setScene(initial.storyId, index)
      setSceneIndex(res.currentSceneIndex)
      setCurrentScene(res.currentScene)
      setProgress(res.progress)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not change scene')
    }
  }

  const restart = async () => {
    if (busy) return
    if (!confirm('Restart this story? Your chat history and memory will be cleared.')) return
    try {
      await playService.reset(initial.storyId)
      onRestart()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not restart the story')
    }
  }

  return (
    <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[220px_minmax(0,760px)_240px] lg:gap-10 lg:px-8">
      <SceneSidebar title={initial.title} scenes={initial.scenes} activeIndex={sceneIndex} onSelect={goToScene} onRestart={restart} />

      <section className="px-4 pb-48 pt-8 sm:px-8 lg:px-0">
        <p className="text-[10px] uppercase tracking-[.3em] text-violet-200">
          Scene {String(sceneIndex + 1).padStart(2, '0')} of {String(initial.scenes.length).padStart(2, '0')}
        </p>
        <h1 className="mt-2 font-serif text-4xl font-light">{currentScene.title}</h1>

        <div className="mt-8 flex flex-col gap-7">
          <figure className="overflow-hidden rounded-2xl border border-white/10">
            <img src={imageUrl(story.coverImage)} alt={currentScene.title} className="aspect-video w-full object-cover" />
            <figcaption className="p-3 text-[10px] uppercase tracking-[.2em] text-white/40">Scene · {currentScene.mood}</figcaption>
          </figure>

          {currentScene.narration && (
            <p className="font-serif text-xl leading-8 text-white/75">{currentScene.narration}</p>
          )}

          <MessageList messages={messages} streamText={streamText} phase={phase} pendingImageId={pendingImageId} />

          {error && (
            <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-xs text-red-200">{error}</p>
          )}
          <div ref={endRef} />
        </div>
      </section>

      <StoryStatePanel scene={currentScene} progress={progress} memory={memory} />
      <ActionBar choices={choices} languages={initial.languages} disabled={busy} onSend={send} />
    </div>
  )
}