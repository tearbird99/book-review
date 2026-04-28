import { useState, useEffect } from 'react'
import { useBooks } from '../contexts/BookContext'

type NoteType = 'text' | 'quote' | 'table' | 'diagram' | 'mindmap' | 'relationship'

type Props = {
  bookId: number
  isOpen: boolean
  onClose: () => void
  onSuccess?: (noteId: number) => void
}

// 노트 종류별 메타데이터 (레이블, 아이콘)
const NOTE_TYPES = [
  { id: 'text', label: '감상', icon: '📝' },
  { id: 'quote', label: '인용구', icon: '💬' },
  { id: 'table', label: '표', icon: '📊' },
  { id: 'mindmap', label: '마인드맵', icon: '🧠' },
  { id: 'relationship', label: '인물관계도', icon: '👥' },
]

// 노트 추가 팝업: 종류와 작성 날짜만 선택하고 빈 노트 생성
export default function NoteAddModal({ bookId, isOpen, onClose, onSuccess }: Props) {
  const { addNote } = useBooks()
  const [noteType, setNoteType] = useState<NoteType>('text')
  const [readDate, setReadDate] = useState(new Date().toISOString().split('T')[0])
  const [isLoading, setIsLoading] = useState(false)

  // 모달 닫을 때 폼 초기화
  useEffect(() => {
    if (!isOpen) {
      setNoteType('text')
      setReadDate(new Date().toISOString().split('T')[0])
    }
  }, [isOpen])

  if (!isOpen) return null

  // 빈 노트 생성 후 상세 페이지에서 내용 편집
  const handleAdd = async () => {
    setIsLoading(true)
    try {
      // 노트 타입별 초기 content 생성
      let emptyContent = ''
      if (noteType === 'text') {
        emptyContent = JSON.stringify({ type: 'text', content: '' })
      } else if (noteType === 'quote') {
        emptyContent = JSON.stringify({ type: 'quote', content: '', page: null })
      }
      // 다른 타입들은 나중에 추가 (현재는 감상과 인용구만 지원)

      // emptyContent가 비어있으면 기본값으로 설정
      if (!emptyContent) {
        emptyContent = JSON.stringify({ type: noteType, content: '' })
      }

      const newNoteId = await addNote(bookId, emptyContent, readDate)
      onClose()
      onSuccess?.(newNoteId)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* 모달 */}
      <div className="relative w-full max-w-xl rounded-lg bg-white shadow-2xl">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-ink-mute transition-colors hover:bg-brass-2/10 hover:text-brass-2"
        >
          <XIcon />
        </button>

        {/* 컨텐츠 */}
        <div className="px-6 pt-6 pb-6">
          <h2 className="font-korean-serif text-lg font-semibold text-ink">새 노트 추가하기</h2>

          {/* 노트 타입 선택 */}
          <div className="mt-6">
            <label className="block font-display text-xs uppercase tracking-[0.2em] text-ink-mute mb-3">
              노트 종류
            </label>
            <div className="grid grid-cols-3 gap-2">
              {NOTE_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setNoteType(type.id as NoteType)}
                  className={`rounded-sm border-2 px-3 py-3 text-center transition-all ${
                    noteType === type.id
                      ? 'border-brass-2 bg-brass-2/10'
                      : 'border-brass-2/25 bg-white/50 hover:border-brass-2/50'
                  }`}
                >
                  <div className="text-xl">{type.icon}</div>
                  <div className="mt-1 font-korean-serif text-xs text-ink">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 작성 날짜 */}
          <div className="mt-6">
            <label className="block font-display text-xs uppercase tracking-[0.2em] text-ink-mute mb-2">
              작성 날짜
            </label>
            <input
              type="date"
              value={readDate}
              onChange={(e) => setReadDate(e.target.value)}
              className="w-full rounded-sm border border-brass-2/25 bg-white/70 px-3 py-2 font-korean-serif text-sm focus:border-brass-2 focus:outline-none"
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-sm border border-brass-2/25 px-4 py-3 font-korean-serif text-sm font-medium text-ink-mute transition-colors hover:border-brass-2/50 hover:text-ink-soft"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={isLoading}
              className="flex-1 rounded-sm bg-brass-2 px-4 py-3 font-korean-serif text-sm font-medium text-white transition-colors hover:bg-brass-2/90 disabled:opacity-50"
            >
              {isLoading ? '추가 중...' : '추가'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 닫기 버튼 아이콘
function XIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6l-12 12M6 6l12 12" />
    </svg>
  )
}
