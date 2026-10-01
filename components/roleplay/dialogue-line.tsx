export function DialogueLine({ speaker, line }: { speaker: string; line: string }) {
  return (
    <div className="border-l border-violet-300 pl-5">
      <p className="text-[10px] uppercase tracking-[.25em] text-violet-200">{speaker}</p>
      <p className="mt-2 font-serif text-2xl italic">&quot;{line}&quot;</p>
    </div>
  )
}