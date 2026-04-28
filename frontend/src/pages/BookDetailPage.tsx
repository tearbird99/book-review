import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useBooks, type Book } from '../contexts/BookContext'
import type { ApiNote } from '../types/api'
import NoteCard from '../components/NoteCard'
import Ornament from '../components/Ornament'
import NoteAddModal from '../components/NoteAddModal'

type Tab = 'notes' | 'info'

const CATEGORIES = ['소설', '과학', '철학', '동화']

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { books, notes: allNotes, updateBook, moveNote, deleteNote } = useBooks()

  // UI 상태
  const [activeTab, setActiveTab] = useState<Tab>('notes')
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedBook, setEditedBook] = useState<Book | null>(null)
  const [categoryMode, setCategoryMode] = useState<'select' | 'custom'>('select')
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null)

  // URL에서 책 ID 추출, 현재 책만 필터링
  const book = books.find((b) => b.id === Number(id))
  const notes = allNotes.filter((n) => n.book_id === Number(id))

  if (!book) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-korean-serif text-ink-soft">책을 찾을 수 없습니다.</p>
      </div>
    )
  }

  // 편집 중이면 임시 데이터, 아니면 원본 데이터 표시
  const displayBook = isEditMode && editedBook ? editedBook : book
  const { total_pages = 0, current_page = 0 } = displayBook
  // 읽은 페이지 진행률 계산
  const progress = total_pages > 0 ? Math.round((current_page / total_pages) * 100) : 0

  const [from, to] = book.spineGradient

  // 책 정보 저장
  const handleSaveEdit = () => {
    if (!editedBook) return
    updateBook(book.id, editedBook)
    setIsEditMode(false)
  }

  // 편집 취소
  const handleCancelEdit = () => {
    setIsEditMode(false)
    setEditedBook(null)
    setCategoryMode('select')
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-10">
      {/* 상단 네비게이션 */}
      <div className="flex items-center justify-between mb-4">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 font-display text-[10px] uppercase tracking-[0.3em] text-brass-2/70 transition-colors hover:text-brass-2"
        >
          <ChevronLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
          서재로
        </Link>
        <button
          onClick={() => {
            setIsEditMode(true)
            setEditedBook({ ...book })
            const isInCategory = CATEGORIES.includes(book.category)
            setCategoryMode(isInCategory ? 'select' : 'custom')
          }}
          className={`text-brass-2 transition-colors hover:text-brass-2/80 ${
            isEditMode ? 'invisible' : ''
          }`}
          aria-label="수정"
        >
          <PencilIcon />
        </button>
      </div>

      {/* 책 헤더 */}
      <header className="mt-8 flex items-start gap-8">
        {/* 책 표지 미니 — relative 래퍼로 책갈피가 삐져나올 수 있게 */}
        <div className="relative shrink-0">
          {/* 읽는 중: 책갈피 */}
          {book.read_status === 'reading' && <DetailBookmark />}

          <div
            className="relative h-44 w-[120px] overflow-hidden rounded-[2px] shadow-[0_8px_28px_-6px_rgba(31,22,51,0.25)] ring-1 ring-black/20"
            style={{ background: `linear-gradient(155deg, ${from} 0%, ${to} 100%)` }}
          >
            {/* 가죽 텍스처 */}
            <div
              className="absolute inset-0 opacity-30 mix-blend-overlay"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, rgba(0,0,0,0.15) 0 1px, transparent 1px 3px)',
              }}
            />
            {/* 황동 테두리 */}
            <div
              className="absolute inset-[6px] rounded-[1px] border pointer-events-none"
              style={{ borderColor: book.accent + '50' }}
            />
            {/* 오너먼트 */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ color: book.accent }}>
              <Ornament name={book.ornament} className="h-8 w-8 opacity-60" />
            </div>
            {/* 읽은 책: 인장 */}
            {book.read_status === 'read' && (
              <div className="absolute bottom-2.5 right-2.5 z-10">
                <DetailSeal accent={book.accent} />
              </div>
            )}
          </div>
        </div>

        {/* 책 정보 */}
        <div className="flex flex-1 flex-col justify-center">
          <div className={`flex gap-2.5 ${isEditMode && editedBook ? 'items-start' : 'items-center'}`}>
            {isEditMode && editedBook ? (
              <div className="flex-1">
                {categoryMode === 'select' ? (
                  <>
                    <select
                      value={editedBook.category || ''}
                      onChange={(e) => {
                        const val = e.target.value
                        if (val === '') {
                          setCategoryMode('custom')
                        } else {
                          setEditedBook({ ...editedBook, category: val })
                        }
                      }}
                      className="w-full rounded-sm border border-brass-2/25 bg-white/70 px-3 py-2 font-korean-serif text-sm focus:border-brass-2 focus:outline-none"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="">기타 (직접 입력)</option>
                    </select>
                  </>
                ) : (
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={editedBook.category}
                      onChange={(e) => setEditedBook({ ...editedBook, category: e.target.value })}
                      className="w-full rounded-sm border border-brass-2/25 bg-white/70 px-3 py-2 font-korean-serif text-sm focus:border-brass-2 focus:outline-none"
                      placeholder="카테고리"
                    />
                    <button
                      type="button"
                      onClick={() => setCategoryMode('select')}
                      className="text-xs text-brass-2 hover:underline"
                    >
                      목록에서 선택하기
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <span className="font-display text-[10px] uppercase tracking-[0.3em] text-brass-2/80">
                {book.category}
              </span>
            )}
            <StatusLabel status={book.read_status} />
          </div>
          {isEditMode && editedBook ? (
            <input
              type="text"
              value={editedBook.title}
              onChange={(e) => setEditedBook({ ...editedBook, title: e.target.value })}
              className="mt-2 rounded-sm border border-brass-2/25 bg-white/70 px-3 py-2 font-korean-serif text-2xl font-semibold focus:border-brass-2 focus:outline-none"
              style={{ wordBreak: 'keep-all' }}
            />
          ) : (
            <h1 className="mt-2 font-korean-serif text-2xl font-semibold leading-snug text-ink" style={{ wordBreak: 'keep-all' }}>
              {book.title}
            </h1>
          )}
          {isEditMode && editedBook ? (
            <input
              type="text"
              value={editedBook.author}
              onChange={(e) => setEditedBook({ ...editedBook, author: e.target.value })}
              className="mt-1 rounded-sm border border-brass-2/25 bg-white/70 px-3 py-2 font-serif text-sm italic focus:border-brass-2 focus:outline-none"
            />
          ) : (
            <p className="mt-1 font-serif text-sm italic text-ink-soft">{book.author}</p>
          )}

          {/* 통계 뱃지들 */}
          {!isEditMode && (
            <div className="mt-4 flex flex-wrap gap-2">
              <StatBadge label="노트" value={`${notes.length}개`} />
              {(book.read_status === 'reading' || book.read_status === 'read') && book.rating != null && (
                <StatBadge
                  label="내 별점"
                  value={'★'.repeat(Math.round(book.rating)) + '☆'.repeat(5 - Math.round(book.rating))}
                />
              )}
              {notes.length > 0 && (
                <StatBadge
                  label="최근 독서"
                  value={notes[notes.length - 1].read_date.replace(/-/g, '.')}
                />
              )}
            </div>
          )}

          {/* 편집 모드: 필드 수정 */}
          {isEditMode && editedBook && (
            <div className="mt-4 space-y-4 rounded-sm bg-brass-2/5 p-4">
              {/* 읽기 상태 변경 */}
              <div>
                <label className="block font-display text-xs uppercase tracking-[0.2em] text-ink-mute mb-2">읽기 상태</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['to_read', 'reading', 'read'] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setEditedBook({ ...editedBook, read_status: status })}
                      className={`rounded-sm border-2 px-3 py-2 text-xs font-korean-serif font-medium transition-all ${
                        editedBook.read_status === status
                          ? 'border-brass-2 bg-brass-2/10 text-brass-2'
                          : 'border-brass-2/25 bg-white/50 text-ink-mute hover:border-brass-2/50'
                      }`}
                    >
                      {status === 'to_read' ? '읽을 책' : status === 'reading' ? '읽는 중' : '읽은 책'}
                    </button>
                  ))}
                </div>
              </div>

              {(editedBook.read_status === 'reading' || editedBook.read_status === 'read') && (
                <div>
                  <label className="block font-display text-xs uppercase tracking-[0.2em] text-ink-mute">별점</label>
                  <div className="mt-2">
                    <StarRating
                      value={editedBook.rating || 0}
                      onChange={(rating) => setEditedBook({ ...editedBook, rating })}
                    />
                  </div>
                </div>
              )}
              {editedBook.read_status !== 'to_read' && (
                <>
                  <div>
                    <label className="block font-display text-xs uppercase tracking-[0.2em] text-ink-mute">읽은 날짜</label>
                    <input
                      type="date"
                      value={notes.length > 0 ? notes[notes.length - 1].read_date : ''}
                      onChange={() => {
                        // This would update the note's read_date in a real implementation
                      }}
                      className="mt-2 w-full rounded-sm border border-brass-2/25 bg-white/70 px-3 py-2 font-korean-serif text-sm focus:border-brass-2 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-display text-xs uppercase tracking-[0.2em] text-ink-mute">전체 페이지</label>
                      <input
                        type="number"
                        value={editedBook.total_pages}
                        onChange={(e) => setEditedBook({ ...editedBook, total_pages: Number(e.target.value) })}
                        className="mt-2 w-full rounded-sm border border-brass-2/25 bg-white/70 px-3 py-2 font-korean-serif text-sm focus:border-brass-2 focus:outline-none"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block font-display text-xs uppercase tracking-[0.2em] text-ink-mute">읽은 페이지</label>
                      <input
                        type="number"
                        value={editedBook.current_page}
                        onChange={(e) => setEditedBook({ ...editedBook, current_page: Number(e.target.value) })}
                        className="mt-2 w-full rounded-sm border border-brass-2/25 bg-white/70 px-3 py-2 font-korean-serif text-sm focus:border-brass-2 focus:outline-none"
                        min="0"
                        max={editedBook.total_pages}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* 페이지 진행 바 */}
          {total_pages > 0 && (
            <div className="mt-5 w-full">
              <div className="h-1.5 overflow-hidden rounded-full bg-brass-2/12">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brass-2/50 to-brass-2 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[11px]">
                <span className="text-ink-mute">
                  {current_page.toLocaleString()} / {total_pages.toLocaleString()} 페이지
                </span>
                <span className="font-semibold text-ink">{progress}%</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 편집 모드: 저장/취소 버튼 */}
      {isEditMode && (
        <div className="mt-8 flex gap-3">
          <button
            onClick={handleCancelEdit}
            className="flex-1 rounded-sm border border-brass-2/25 px-4 py-3 font-korean-serif text-sm font-medium text-ink-mute transition-colors hover:border-brass-2/50 hover:text-ink-soft"
          >
            취소
          </button>
          <button
            onClick={handleSaveEdit}
            className="flex-1 rounded-sm bg-brass-2 px-4 py-3 font-korean-serif text-sm font-medium text-white transition-colors hover:bg-brass-2/90"
          >
            저장
          </button>
        </div>
      )}

      {/* 구분선 */}
      <div className="mt-10 flex items-center gap-4">
        <span className="h-px flex-1 bg-brass-2/15" />
        <span className="font-display text-[9px] uppercase tracking-[0.3em] text-brass-2/40">✦</span>
        <span className="h-px flex-1 bg-brass-2/15" />
      </div>

      {/* 노트 추가 버튼 */}
      <button
        onClick={() => setIsAddNoteModalOpen(true)}
        className="mt-8 w-full rounded-[2px] bg-ink py-4 font-korean-serif text-base font-medium tracking-wider text-parchment shadow-[0_4px_16px_-4px_rgba(31,22,51,0.3)] transition-all hover:bg-ink/85 hover:shadow-[0_6px_20px_-4px_rgba(90,63,160,0.3)] active:scale-[0.99]"
      >
        노트 추가하기
      </button>

      {/* 탭 */}
      <nav className="mt-10 border-b border-brass-2/20">
        <ul className="flex gap-8">
          {([['notes', '노트 목록'], ['info', '책 정보']] as [Tab, string][]).map(([key, label]) => {
            const isActive = activeTab === key
            return (
              <li key={key}>
                <button
                  onClick={() => setActiveTab(key)}
                  className={`relative pb-4 font-korean-serif text-sm tracking-wider transition-colors ${
                    isActive ? 'text-ink' : 'text-ink-mute hover:text-ink-soft'
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brass-2 to-transparent" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* 탭 콘텐츠 */}
      <div className="mt-6">
        {activeTab === 'notes' ? (
          notes.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {notes.map((note, idx) => (
                <li key={note.id}>
                  {editingNoteId === note.id ? (
                    <NoteEditor note={note} onClose={() => setEditingNoteId(null)} />
                  ) : (
                    <NoteCard
                      note={note}
                      onEdit={setEditingNoteId}
                      onDelete={(noteId) => deleteNote(noteId, book.id)}
                      onMove={moveNote}
                      isFirst={idx === 0}
                      isLast={idx === notes.length - 1}
                    />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyNotes />
          )
        ) : (
          <BookInfoTab book={book} />
        )}
      </div>

      {/* 노트 추가 모달 */}
      <NoteAddModal
        bookId={book.id}
        isOpen={isAddNoteModalOpen}
        onClose={() => setIsAddNoteModalOpen(false)}
        onSuccess={() => {
          setIsAddNoteModalOpen(false)
          // 노트 목록 새로고침
        }}
      />
    </div>
  )
}

// 책 정보 요약 배지 (노트 개수, 별점, 최근 독서일)
function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-brass-2/25 bg-white/60 px-3 py-1">
      <span className="font-display text-[9px] uppercase tracking-[0.2em] text-ink-mute">{label}</span>
      <span className="font-korean-serif text-xs text-ink">{value}</span>
    </span>
  )
}

// 노트가 없을 때 표시하는 빈 상태 UI
function EmptyNotes() {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-brass-2/25 text-brass-2/50">
        <QuillIcon />
      </div>
      <p className="mt-5 font-korean-serif text-base text-ink-soft">아직 작성한 노트가 없습니다</p>
      <p className="mt-1 text-sm text-ink-mute">위 버튼으로 첫 노트를 기록해보세요</p>
    </div>
  )
}

// 책 정보 탭 (제목, 저자, 분류, 등록일)
function BookInfoTab({ book }: { book: Book }) {
  return (
    <div className="rounded-sm border border-brass-2/15 bg-white/50 px-6 py-5">
      <dl className="flex flex-col gap-4">
        {[
          ['제목', book.title],
          ['저자', book.author],
          ['분류', book.category],
          ['등록일', '2026.03.01'],
        ].map(([term, desc]) => (
          <div key={term} className="flex gap-6">
            <dt className="w-16 shrink-0 font-display text-[10px] uppercase tracking-[0.2em] text-ink-mute pt-0.5">
              {term}
            </dt>
            <dd className="font-korean-serif text-sm text-ink">{desc}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

// 노트 내용 편집 모드
function NoteEditor({ note, onClose }: { note: ApiNote; onClose: () => void }) {
  const [content, setContent] = useState(note.content)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: 노트 내용 업데이트 - updateNote 함수 구현 필요
      await new Promise((resolve) => setTimeout(resolve, 500))
      onClose()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="rounded-sm border border-brass-2/30 bg-gradient-to-br from-white to-white/50 px-6 py-5 shadow-[0_2px_12px_-4px_rgba(31,22,51,0.12)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-korean-serif text-sm font-semibold text-ink">노트 편집</h3>
        <button
          onClick={onClose}
          className="text-ink-mute hover:text-ink transition-colors"
        >
          ✕
        </button>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full rounded-sm border border-brass-2/25 bg-white/70 px-3 py-2 font-korean-serif text-sm focus:border-brass-2 focus:outline-none"
        style={{ height: '200px', resize: 'vertical' }}
        placeholder="노트 내용을 입력하세요..."
      />

      <div className="flex gap-2 mt-4">
        <button
          onClick={onClose}
          className="flex-1 rounded-sm border border-brass-2/25 px-4 py-2 font-korean-serif text-sm font-medium text-ink-mute transition-colors hover:border-brass-2/50 hover:text-ink-soft"
        >
          취소
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 rounded-sm bg-brass-2 px-4 py-2 font-korean-serif text-sm font-medium text-white transition-colors hover:bg-brass-2/90 disabled:opacity-50"
        >
          {isSaving ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  )
}

// 책 읽음 상태 라벨 (읽을 책 / 읽는 중 / 읽은 책)
function StatusLabel({ status }: { status: string }) {
  const labelMap: Record<string, string> = {
    to_read: '읽을 책',
    reading: '읽는 중',
    read: '읽은 책',
  }
  return (
    <span className="rounded-full border border-brass-2/50 bg-brass-2/8 px-2.5 py-0.5 font-korean-serif text-[11px] text-brass-2">
      {labelMap[status] ?? '읽을 책'}
    </span>
  )
}

// 책갈피 - 읽는 중 상태에 표시 (상세 페이지 미니 표지용)
function DetailBookmark() {
  return (
    <div className="absolute top-0 right-6 z-20 drop-shadow-[1px_2px_5px_rgba(0,0,0,0.5)]">
      <svg width="9" height="46" viewBox="0 0 9 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="d-ribbon-sheen" x1="0" y1="0" x2="9" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#7a5818" />
            <stop offset="28%"  stopColor="#f2dc80" />
            <stop offset="58%"  stopColor="#c9a961" />
            <stop offset="100%" stopColor="#8a6828" />
          </linearGradient>
        </defs>
        <rect width="9" height="46" fill="url(#d-ribbon-sheen)" />
        <rect x="2.5" y="0" width="2" height="46" fill="rgba(255,255,255,0.22)" />
        <line x1="0.3" y1="0" x2="0.3" y2="46" stroke="rgba(0,0,0,0.25)" strokeWidth="0.7" />
        <line x1="8.7" y1="0" x2="8.7" y2="46" stroke="rgba(0,0,0,0.25)" strokeWidth="0.7" />
        <line x1="0" y1="6"  x2="9" y2="6"  stroke="rgba(0,0,0,0.07)" strokeWidth="0.7" />
        <line x1="0" y1="12" x2="9" y2="12" stroke="rgba(0,0,0,0.07)" strokeWidth="0.7" />
        <line x1="0" y1="18" x2="9" y2="18" stroke="rgba(0,0,0,0.07)" strokeWidth="0.7" />
        <line x1="0" y1="24" x2="9" y2="24" stroke="rgba(0,0,0,0.07)" strokeWidth="0.7" />
        <line x1="0" y1="30" x2="9" y2="30" stroke="rgba(0,0,0,0.07)" strokeWidth="0.7" />
        <line x1="0" y1="36" x2="9" y2="36" stroke="rgba(0,0,0,0.07)" strokeWidth="0.7" />
        <line x1="0" y1="42" x2="9" y2="42" stroke="rgba(0,0,0,0.07)" strokeWidth="0.7" />
        <polygon points="0,42 9,44 9,46 0,46" fill="rgba(0,0,0,0.15)" />
      </svg>
    </div>
  )
}

// 인장 - 읽은 책 상태에 표시 (상세 페이지용)
function DetailSeal({ accent }: { accent: string }) {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="dseal-fill" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.4" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.14" />
        </radialGradient>
      </defs>
      <circle cx="17" cy="17" r="15.5" fill="url(#dseal-fill)" stroke={accent} strokeWidth="1.3" />
      <circle cx="17" cy="17" r="11.5" fill="none" stroke={accent} strokeWidth="0.8" strokeDasharray="2.2 1.6" />
      <path d="M11 17.5 L15.5 22 L24 13" stroke={accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function QuillIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 2C14 2 6 8 6 16c0 2 .5 3.5 1 4.5L3 22l2-4c-1-1.5-1.5-3-1.5-4.5C3.5 6.5 11 2 20 2z" />
      <path d="M6 16c2-2 4-3 6-3s4 1 4 3" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

// 별점 평가 컴포넌트 (0.5 단위로 선택 가능)
function StarRating({ value, onChange }: { value: number; onChange: (val: number) => void }) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)

  // 별의 왼쪽/오른쪽 절반으로 0.5 단위 선택
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>, starIndex: number) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const isLeftHalf = x < rect.width / 2
    const rating = starIndex + (isLeftHalf ? 0.5 : 1)
    setHoveredRating(rating)
  }

  // 별 클릭 시 별점 저장
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, starIndex: number) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const isLeftHalf = x < rect.width / 2
    const rating = starIndex + (isLeftHalf ? 0.5 : 1)
    onChange(rating)
  }

  // 마우스 호버 시 미리보기, 아니면 저장된 값 표시
  const displayRating = hoveredRating !== null ? hoveredRating : value

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <button
            key={i}
            type="button"
            onMouseMove={(e) => handleMouseMove(e, i)}
            onClick={(e) => handleClick(e, i)}
            onMouseLeave={() => setHoveredRating(null)}
            className="relative cursor-pointer"
          >
            {/* 배경 별 (회색) */}
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-gray-300"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>

            {/* 채워진 별 (오버레이) */}
            <div
              className="absolute left-0 top-0 overflow-hidden transition-all"
              style={{
                width: `${Math.min(Math.max(displayRating - i, 0), 1) * 36}px`,
              }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-brass-2"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {displayRating > 0 && (
        <p className="font-korean-serif text-sm text-ink-soft">
          {'★'.repeat(Math.floor(displayRating))}
          {displayRating % 1 !== 0 ? '⯨' : ''}
          {'☆'.repeat(5 - Math.ceil(displayRating))} ({displayRating}/5)
        </p>
      )}
    </div>
  )
}
