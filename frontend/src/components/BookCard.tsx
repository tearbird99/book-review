import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useBooks, type Book } from '../contexts/BookContext'
import Ornament from './Ornament'

type Props = {
  book: Book
  deleteMode?: boolean
  onDelete?: () => void
}

// 책 카드: 표지 디자인 + 상태 표시 + 선택모드 지원
export default function BookCard({ book, deleteMode = false, onDelete }: Props) {
  const { deleteBook } = useBooks()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [from, to] = book.spineGradient

  // 책 삭제 확인
  const handleConfirmDelete = () => {
    deleteBook(book.id)
    setShowDeleteConfirm(false)
    onDelete?.()
  }

  return (
    <>
      <div className="relative">
        <Link
          to={deleteMode ? '#' : `/books/${book.id}`}
          className="group block cursor-pointer outline-none"
          onClick={(e) => deleteMode && e.preventDefault()}
        >
          {/* article에 relative — 책갈피가 카드 위로 삐져나올 수 있도록 */}
          <article className={`relative cursor-pointer transition-opacity ${deleteMode ? 'opacity-50' : ''}`}>
            {/* 읽는 중: 황금 책갈피 (표지 위쪽) */}
            {book.read_status === 'reading' && <Bookmark deleteMode={deleteMode} />}

            {/* 책 표지 */}
            <div
              className={`relative aspect-[2/3] overflow-hidden rounded-[2px] shadow-[0_8px_28px_-6px_rgba(31,22,51,0.22)] ring-1 ring-black/20 transition-all duration-500 ${
                deleteMode ? '' : 'group-hover:-translate-y-1 group-hover:shadow-[0_16px_40px_-10px_rgba(138,115,64,0.35)]'
              }`}
              style={{ background: `linear-gradient(155deg, ${from} 0%, ${to} 100%)` }}
            >
              {/* 가죽 결 텍스처 */}
              <div
                className="absolute inset-0 opacity-30 mix-blend-overlay"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, rgba(0,0,0,0.15) 0 1px, transparent 1px 3px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 4px)',
                }}
              />

              {/* 안쪽 황동 테두리 */}
              <div className="absolute inset-2 rounded-[1px] border pointer-events-none" style={{ borderColor: book.accent + '60' }} />
              <div className="absolute inset-3 rounded-[1px] border pointer-events-none" style={{ borderColor: book.accent + '20' }} />

              {/* 모서리 장식 */}
              {(['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'] as const).map((pos, i) => (
                <span
                  key={i}
                  className={`absolute ${pos} h-2 w-2 border`}
                  style={{
                    borderColor: book.accent,
                    borderTopWidth: pos.includes('top') ? '1px' : 0,
                    borderBottomWidth: pos.includes('bottom') ? '1px' : 0,
                    borderLeftWidth: pos.includes('left') ? '1px' : 0,
                    borderRightWidth: pos.includes('right') ? '1px' : 0,
                  }}
                />
              ))}

              {/* 읽은 책: 황동 인장 (표지 우하단, overflow-hidden 안) */}
              {book.read_status === 'read' && (
                <div className="absolute bottom-3 right-3 z-10">
                  <Seal accent={book.accent} />
                </div>
              )}

              {/* 본문 */}
              <div className="relative flex h-full flex-col items-center justify-between p-5 text-center">
                <div className="font-display text-[10px] uppercase tracking-[0.3em]" style={{ color: book.accent + 'cc' }}>
                  {book.category}
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div style={{ color: book.accent }}>
                    <Ornament name={book.ornament} className="h-5 w-5 opacity-80" />
                  </div>
                  <h3
                    className="font-korean-serif text-base font-semibold leading-tight text-parchment drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                    style={{ wordBreak: 'keep-all' }}
                  >
                    {book.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="h-px w-4" style={{ backgroundColor: book.accent }} />
                    <span className="font-serif text-[11px] italic" style={{ color: book.accent + 'dd' }}>
                      {book.author}
                    </span>
                    <span className="h-px w-4" style={{ backgroundColor: book.accent }} />
                  </div>
                </div>
                {/* 별점: 읽는 중 or 읽은 책일 때만 표시 */}
                {(book.read_status === 'reading' || book.read_status === 'read') && (
                  <div className="font-display text-[9px] tracking-[0.2em]" style={{ color: book.accent + '99' }}>
                    {book.rating ? '★'.repeat(Math.round(book.rating)) + '☆'.repeat(5 - Math.round(book.rating)) : '— —'}
                  </div>
                )}
                {/* 읽을 책일 때: 공백 유지 */}
                {book.read_status === 'to_read' && (
                  <div className="font-display text-[9px] tracking-[0.2em]" style={{ color: book.accent + '99' }}>
                    &nbsp;
                  </div>
                )}
              </div>
            </div>

            {/* 카드 하단 메타 */}
            <div className="mt-3 px-1">
              <p className="font-korean-serif text-sm text-ink">{book.title}</p>
              {book.read_status === 'to_read' ? (
                <p className="mt-0.5 text-xs text-ink-mute">{book.author} · 노트 {book.notes}</p>
              ) : (
                <>
                  <p className="mt-0.5 text-xs text-ink-mute">
                    {book.author} · {book.current_page}/{book.total_pages} · 노트 {book.notes}
                  </p>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-brass-2/12">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brass-2/50 to-brass-2 transition-all"
                      style={{
                        width: book.total_pages ? `${Math.round((book.current_page! / book.total_pages) * 100)}%` : '0%',
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </article>
        </Link>

        {/* 삭제 모드: 빨간 삭제 버튼 (article 밖에서 렌더링 — opacity 영향 없음) */}
        {deleteMode && (
          <button
            onClick={(e) => {
              e.preventDefault()
              setShowDeleteConfirm(true)
            }}
            className="absolute top-0 right-0 z-40 flex h-8 w-8 items-center justify-center rounded-tl-none rounded-tr-sm rounded-br-sm rounded-bl-sm border-2 border-red-500 bg-red-500 text-white hover:bg-red-600"
          >
            <span className="text-lg font-bold leading-none">−</span>
          </button>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-2xl">
            <h2 className="font-korean-serif text-lg font-semibold text-ink">책 삭제</h2>
            <p className="mt-4 text-sm text-ink-soft">
              <span className="font-semibold text-ink">{book.title}</span>을(를) 서재에서 삭제하시겠습니까?
            </p>
            <p className="mt-2 text-xs text-ink-mute">이 작업은 되돌릴 수 없습니다.</p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-sm border border-brass-2/25 px-4 py-3 font-korean-serif text-sm font-medium text-ink-mute transition-colors hover:border-brass-2/50 hover:text-ink-soft"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 rounded-sm bg-red-500 px-4 py-3 font-korean-serif text-sm font-medium text-white transition-colors hover:bg-red-600"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// 읽는 중 상태일 때 표시되는 실크 리본 책갈피
function Bookmark({ deleteMode = false }: { deleteMode: boolean }) {
  return (
    <div className={`absolute top-0 right-6 z-20 drop-shadow-[1px_2px_4px_rgba(0,0,0,0.45)] transition-transform duration-500 ${
      deleteMode ? '' : 'group-hover:-translate-y-1'
    }`}>
      <svg width="7" height="36" viewBox="0 0 7 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ribbon-sheen" x1="0" y1="0" x2="7" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7a5818" />
            <stop offset="30%" stopColor="#f2dc80" />
            <stop offset="55%" stopColor="#c9a961" />
            <stop offset="100%" stopColor="#8a6828" />
          </linearGradient>
        </defs>
        <rect width="7" height="36" fill="url(#ribbon-sheen)" />
        <rect x="2" y="0" width="1.5" height="36" fill="rgba(255,255,255,0.22)" />
        <line x1="0.3" y1="0" x2="0.3" y2="36" stroke="rgba(0,0,0,0.25)" strokeWidth="0.6" />
        <line x1="6.7" y1="0" x2="6.7" y2="36" stroke="rgba(0,0,0,0.25)" strokeWidth="0.6" />
        <line x1="0" y1="5" x2="7" y2="5" stroke="rgba(0,0,0,0.07)" strokeWidth="0.6" />
        <line x1="0" y1="10" x2="7" y2="10" stroke="rgba(0,0,0,0.07)" strokeWidth="0.6" />
        <line x1="0" y1="15" x2="7" y2="15" stroke="rgba(0,0,0,0.07)" strokeWidth="0.6" />
        <line x1="0" y1="20" x2="7" y2="20" stroke="rgba(0,0,0,0.07)" strokeWidth="0.6" />
        <line x1="0" y1="25" x2="7" y2="25" stroke="rgba(0,0,0,0.07)" strokeWidth="0.6" />
        <line x1="0" y1="30" x2="7" y2="30" stroke="rgba(0,0,0,0.07)" strokeWidth="0.6" />
        <polygon points="0,32 7,34 7,36 0,36" fill="rgba(0,0,0,0.15)" />
      </svg>
    </div>
  )
}

// 읽은 책 상태일 때 표시되는 황동 인장 (책 커버 우하단에 띄운 체크마크 스탬프)
function Seal({ accent }: { accent: string }) {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="seal-fill" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.12" />
        </radialGradient>
      </defs>
      <circle cx="15" cy="15" r="13.5" fill="url(#seal-fill)" stroke={accent} strokeWidth="1.2" />
      <circle cx="15" cy="15" r="10" fill="none" stroke={accent} strokeWidth="0.7" strokeDasharray="2 1.5" />
      <path d="M9.5 15.5 L13.5 19.5 L21 12" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
