import { DialogueLine } from './dialogue-line'
import { imageUrl, parseReply } from '@/lib/utils'
import type { ChatMessage } from '@/lib/types'

export type Phase = 'idle' | 'writing' | 'painting'

function StoryBlocks({ content }: { content: string }) {
  return (
    <div className="flex flex-col gap-5">
      {parseReply(content).map((block, i) =>
        block.type === 'dialogue' ? (
          <DialogueLine key={i} speaker={block.speaker} line={block.line} />
        ) : (
          <p key={i} className="font-serif text-lg leading-8 text-white/70">{block.text}</p>
        ),
      )}
    </div>
  )
}

function PlayerAction({ text }: { text: string }) {
  return (
    <div className="max-w-[85%] self-end rounded-2xl border border-white/15 bg-white/[.06] px-4 py-3">
      <p className="text-[10px] uppercase tracking-[.25em] text-white/40">You</p>
      <p className="mt-1 text-sm text-white/80">{text}</p>
    </div>
  )
}

const isVideo = (url: string) => /\.(mp4|webm)(\?|$)/i.test(url)

function SceneImage({ src }: { src: string }) {
  const url = imageUrl(src)
  return (
    <figure className="overflow-hidden rounded-2xl border border-white/10">
      {isVideo(src) ? (
        <video
          src={url}
          autoPlay
          loop
          muted
          playsInline
          className="aspect-video w-full object-cover"
        />
      ) : (
        <img src={url} alt="Generated scene" className="aspect-video w-full object-cover" />
      )}
      <figcaption className="p-3 text-[10px] uppercase tracking-[.2em] text-white/40">
        Visual scene · Generated
      </figcaption>
    </figure>
  )
}

function ImageSkeleton() {
  return (
    <div className="flex aspect-video w-full animate-pulse items-center justify-center rounded-2xl border border-white/10 bg-white/[.05]">
      <p className="text-[10px] uppercase tracking-[.25em] text-white/40">Painting the scene...</p>
    </div>
  )
}

type Props = {
  messages: ChatMessage[]
  streamText: string
  phase: Phase
  pendingImageId: number | null
}

export function MessageList({ messages, streamText, phase, pendingImageId }: Props) {
  return (
    <>
      {messages.map((m) =>
        m.role === 'user' ? (
          <PlayerAction key={m.id} text={m.content} />
        ) : (
          <div key={m.id} className="flex flex-col gap-6">
            <StoryBlocks content={m.content} />
            {m.imageUrl ? <SceneImage src={m.imageUrl} /> : pendingImageId === m.id ? <ImageSkeleton /> : null}
          </div>
        ),
      )}
      {phase === 'writing' &&
        (streamText ? (
          <StoryBlocks content={streamText} />
        ) : (
          <p className="animate-pulse text-sm italic text-white/40">The story continues...</p>
        ))}
    </>
  )
}