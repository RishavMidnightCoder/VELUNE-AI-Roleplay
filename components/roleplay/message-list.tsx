import { DialogueLine } from './dialogue-line'
import { parseReply } from '@/lib/utils'
import type { ChatMessage } from '@/lib/types'

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

export function MessageList({ messages, streamText, streaming }: { messages: ChatMessage[]; streamText: string; streaming: boolean }) {
  return (
    <>
      {messages.map((m) =>
        m.role === 'user' ? <PlayerAction key={m.id} text={m.content} /> : <StoryBlocks key={m.id} content={m.content} />,
      )}
      {streaming &&
        (streamText ? (
          <StoryBlocks content={streamText} />
        ) : (
          <p className="animate-pulse text-sm italic text-white/40">The story continues...</p>
        ))}
    </>
  )
}