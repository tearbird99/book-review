import type { MockNote } from '../data/mockNotes'

type Props = {
  note: MockNote
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}

export default function NoteCard({ note }: Props) {
  return (
    <article className="group relative flex gap-5 rounded-sm border border-brass-2/15 bg-white/50 px-6 py-5 shadow-[0_2px_12px_-4px_rgba(31,22,51,0.08)] transition-all hover:border-brass-2/30 hover:shadow-[0_4px_20px_-6px_rgba(90,63,160,0.12)]">
      {/* 왼쪽 세로 액센트 바 */}
      <div className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full bg-gradient-to-b from-transparent via-brass-2/40 to-transparent" />

      <div className="flex-1 min-w-0">
        {/* 날짜 */}
        <time className="font-display text-[10px] uppercase tracking-[0.25em] text-ink-mute">
          {formatDate(note.read_date)}
        </time>

        {/* 본문 */}
        <p className="mt-3 font-korean-serif text-sm leading-relaxed text-ink/80 line-clamp-3">
          {note.content}
        </p>
      </div>

      {/* 편집/삭제 버튼 (뼈대) */}
      <div className="flex shrink-0 flex-col items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          aria-label="편집"
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-mute transition-colors hover:bg-brass-2/10 hover:text-brass-2"
        >
          <PencilIcon />
        </button>
        <button
          aria-label="삭제"
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-mute transition-colors hover:bg-red-100 hover:text-red-500"
        >
          <TrashIcon />
        </button>
      </div>
    </article>
  )
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}
