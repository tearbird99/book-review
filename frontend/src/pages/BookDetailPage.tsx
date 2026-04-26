import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { mockBooks, type ReadStatus } from '../data/mockBooks'
import { mockNotes } from '../data/mockNotes'
import NoteCard from '../components/NoteCard'
import Ornament from '../components/Ornament'

type Tab = 'notes' | 'info'

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<Tab>('notes')

  const book = mockBooks.find((b) => b.id === Number(id))
  const notes = mockNotes.filter((n) => n.book_id === Number(id))

  if (!book) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-korean-serif text-ink-soft">책을 찾을 수 없습니다.</p>
      </div>
    )
  }

  const { totalPages = 0, currentPage = 0 } = book
  const progress = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0

  const [from, to] = book.spineGradient

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-10">
      {/* 뒤로가기 */}
      <Link
        to="/"
        className="group inline-flex items-center gap-2 font-display text-[10px] uppercase tracking-[0.3em] text-brass-2/70 transition-colors hover:text-brass-2"
      >
        <ChevronLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
        서재로
      </Link>

      {/* 책 헤더 */}
      <header className="mt-8 flex gap-8">
        {/* 책 표지 미니 — relative 래퍼로 책갈피가 삐져나올 수 있게 */}
        <div className="relative shrink-0">
          {/* 읽는 중: 책갈피 */}
          {book.status === 'reading' && <DetailBookmark />}

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
            {book.status === 'read' && (
              <div className="absolute bottom-2.5 right-2.5 z-10">
                <DetailSeal accent={book.accent} />
              </div>
            )}
          </div>
        </div>

        {/* 책 정보 */}
        <div className="flex flex-1 flex-col justify-center">
          <div className="flex items-center gap-2.5">
            <span className="font-display text-[10px] uppercase tracking-[0.3em] text-brass-2/80">
              {book.category}
            </span>
            <StatusLabel status={book.status} />
          </div>
          <h1 className="mt-2 font-korean-serif text-2xl font-semibold leading-snug text-ink" style={{ wordBreak: 'keep-all' }}>
            {book.title}
          </h1>
          <p className="mt-1 font-serif text-sm italic text-ink-soft">{book.author}</p>

          {/* 통계 뱃지들 */}
          <div className="mt-4 flex flex-wrap gap-2">
            <StatBadge label="노트" value={`${notes.length}개`} />
            {book.rating != null && (
              <StatBadge
                label="내 별점"
                value={'★'.repeat(book.rating) + '☆'.repeat(5 - book.rating)}
              />
            )}
            {notes.length > 0 && (
              <StatBadge
                label="최근 독서"
                value={notes[notes.length - 1].read_date.replace(/-/g, '.')}
              />
            )}
          </div>

          {/* 페이지 진행 바 */}
          {totalPages > 0 && (
            <div className="mt-5 w-full">
              <div className="h-1.5 overflow-hidden rounded-full bg-brass-2/12">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brass-2/50 to-brass-2 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[11px]">
                <span className="text-ink-mute">
                  {currentPage.toLocaleString()} / {totalPages.toLocaleString()} 페이지
                </span>
                <span className="font-semibold text-ink">{progress}%</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 구분선 */}
      <div className="mt-10 flex items-center gap-4">
        <span className="h-px flex-1 bg-brass-2/15" />
        <span className="font-display text-[9px] uppercase tracking-[0.3em] text-brass-2/40">✦</span>
        <span className="h-px flex-1 bg-brass-2/15" />
      </div>

      {/* 노트 추가 버튼 */}
      <button className="mt-8 w-full rounded-[2px] bg-ink py-4 font-korean-serif text-base font-medium tracking-wider text-parchment shadow-[0_4px_16px_-4px_rgba(31,22,51,0.3)] transition-all hover:bg-ink/85 hover:shadow-[0_6px_20px_-4px_rgba(90,63,160,0.3)] active:scale-[0.99]">
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
              {notes.map((note) => (
                <li key={note.id}>
                  <NoteCard note={note} />
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
    </div>
  )
}

/* ── 서브 컴포넌트들 ── */

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-brass-2/25 bg-white/60 px-3 py-1">
      <span className="font-display text-[9px] uppercase tracking-[0.2em] text-ink-mute">{label}</span>
      <span className="font-korean-serif text-xs text-ink">{value}</span>
    </span>
  )
}

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

function BookInfoTab({ book }: { book: (typeof mockBooks)[number] }) {
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

/* ── 상태 라벨 (BookDetailPage 전용) ── */
function StatusLabel({ status }: { status: string }) {
  const labelMap: Record<string, string> = {
    to_read: '읽을 책',
    reading:  '읽는 중',
    read:     '읽은 책',
  }
  return (
    <span className="rounded-full border border-brass-2/50 bg-brass-2/8 px-2.5 py-0.5 font-korean-serif text-[11px] text-brass-2">
      {labelMap[status] ?? '읽을 책'}
    </span>
  )
}

/* ── 책갈피: 읽는 중 (상세 페이지 미니 표지용) ── */
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

/* ── 인장: 읽은 책 (상세 페이지용) ── */
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
