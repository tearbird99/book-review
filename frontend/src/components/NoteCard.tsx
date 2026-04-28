import type { ApiNote } from '../types/api'

type Props = {
  note: ApiNote
  onEdit?: (noteId: number) => void
  onDelete?: (noteId: number) => void
}

// ISO 형식 날짜를 "YYYY년 M월 D일" 형태로 변환
function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}

// 노트 타입별 레이블과 이모지
function getNoteTypeInfo(type: string): { label: string; icon: string } {
  const typeMap: Record<string, { label: string; icon: string }> = {
    text: { label: '감상', icon: '📝' },
    quote: { label: '인용구', icon: '💬' },
    table: { label: '표', icon: '📊' },
    diagram: { label: '다이어그램', icon: '📐' },
    mindmap: { label: '마인드맵', icon: '🧠' },
    relationship: { label: '인물관계도', icon: '👥' },
  }
  return typeMap[type] || { label: '메모', icon: '📌' }
}

// 노트 카드: 날짜, 내용 표시 + 마우스 호버 시 삭제 버튼 표시
export default function NoteCard({ note, onEdit, onDelete }: Props) {
  // content 파싱 (JSON 형식일 수 있음)
  let displayContent = note.content
  let pageNumber: number | null = null

  try {
    const parsed = JSON.parse(note.content)
    if (parsed && typeof parsed === 'object') {
      displayContent = parsed.content || ''
      if (parsed.type === 'quote' && parsed.page) {
        pageNumber = parsed.page
      }
    }
  } catch {
    displayContent = note.content
  }

  // 노트 타입 정보 추출
  const noteTypeInfo = getNoteTypeInfo(
    (() => {
      try {
        const parsed = JSON.parse(displayContent === note.content ? note.content : note.content)
        return parsed?.type || 'text'
      } catch {
        return 'text'
      }
    })()
  )

  return (
    <article className="group relative flex gap-5 rounded-sm border border-brass-2/15 bg-white/50 px-6 py-5 shadow-[0_2px_12px_-4px_rgba(31,22,51,0.08)] transition-all hover:border-brass-2/30 hover:shadow-[0_4px_20px_-6px_rgba(90,63,160,0.12)]">
      {/* 왼쪽 세로 액센트 바 */}
      <div className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full bg-gradient-to-b from-transparent via-brass-2/40 to-transparent" />

      {/* 우상단 노트 타입 아이콘 */}
      <div className="absolute top-3 right-6 flex items-center gap-2">
        <span className="text-lg">{noteTypeInfo.icon}</span>
      </div>

      {/* 클릭 가능한 영역: 날짜, 본문 */}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onEdit?.(note.id)}>
        <time className="font-display text-[10px] uppercase tracking-[0.25em] text-ink-mute">
          {formatDate(note.read_date)}
        </time>

        <p className="mt-3 font-korean-serif text-sm leading-relaxed text-ink/80 line-clamp-3">
          {displayContent}
        </p>
      </div>

      {/* 인용구: 우측 하단에 페이지 표시 (절대 위치) */}
      {pageNumber && (
        <div className="absolute bottom-3 right-6">
          <span className="font-display text-[10px] text-brass-2/60">p. {pageNumber}</span>
        </div>
      )}

      {/* 우상단 삭제 버튼 */}
      <button
        onClick={() => onDelete?.(note.id)}
        aria-label="삭제"
        className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center text-ink-mute opacity-0 transition-all group-hover:opacity-100 hover:text-red-500"
      >
        <TrashIcon />
      </button>
    </article>
  )
}

// 삭제 버튼 아이콘
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
