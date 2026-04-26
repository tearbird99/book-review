import { useState } from 'react'
import { mockBooks, type ReadStatus } from '../data/mockBooks'
import BookCard from '../components/BookCard'

const TABS: { key: ReadStatus | 'all'; label: string }[] = [
  { key: 'all', label: '서재 전체' },
  { key: 'to_read', label: '읽을 책' },
  { key: 'reading', label: '읽는 중' },
  { key: 'read', label: '읽은 책' },
]

export default function LibraryPage() {
  const [active, setActive] = useState<ReadStatus | 'all'>('all')

  const filtered = active === 'all' ? mockBooks : mockBooks.filter((b) => b.status === active)

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-12">
      {/* 상단 브랜딩 */}
      <header className="mb-12 flex items-start justify-between">
        <div>
          <p className="font-display text-[11px] uppercase tracking-[0.4em] text-brass-2">
            Wizard&apos;s Library
          </p>
          <h1 className="mt-2 font-korean-serif text-4xl font-semibold tracking-wide text-ink">
            마법사의 서재
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <span className="h-px w-12 bg-brass-2/60" />
            <span className="font-serif text-sm italic text-ink-soft">
              Codices et notae lectoris
            </span>
            <span className="h-px w-12 bg-brass-2/60" />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <IconButton ariaLabel="검색">
            <SearchIcon />
          </IconButton>
          <IconButton ariaLabel="주문">
            <ScrollIcon />
          </IconButton>
        </div>
      </header>

      {/* 탭 */}
      <nav className="border-b border-brass-2/25">
        <ul className="flex gap-8">
          {TABS.map((tab) => {
            const isActive = active === tab.key
            return (
              <li key={tab.key}>
                <button
                  onClick={() => setActive(tab.key)}
                  className={`relative pb-4 font-korean-serif text-sm tracking-wider transition-colors ${
                    isActive ? 'text-ink' : 'text-ink-mute hover:text-ink-soft'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brass-2 to-transparent" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* 카운트 + 정렬 */}
      <div className="mt-8 flex items-end justify-between">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.3em] text-brass-2">
            Tomus · {filtered.length} volumina
          </p>
          <p className="mt-1 font-korean-serif text-lg text-ink/80">
            서재에 꽂힌 {filtered.length}권
          </p>
        </div>
        <button className="group flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-ink-mute hover:text-ink-soft">
          <span>최근 추가 순</span>
          <ChevronDown className="h-3 w-3 transition-transform group-hover:translate-y-0.5" />
        </button>
      </div>

      {/* 책 그리드 */}
      <section className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}

        {/* 새 책 추가 카드 */}
        <button className="group flex aspect-[2/3] flex-col items-center justify-center rounded-[2px] border-2 border-dashed border-brass-2/50 bg-[#ebe5f8] transition-all hover:border-brass-2/80 hover:bg-[#e0d6f5]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-brass-2/60 text-brass-2 transition-colors group-hover:border-brass-2 group-hover:bg-brass-2/10">
            <PlusIcon />
          </div>
          <span className="mt-3 font-korean-serif text-sm font-medium text-ink-soft group-hover:text-ink">
            새 책 봉인하기
          </span>
          <span className="mt-1 font-display text-[9px] uppercase tracking-[0.3em] text-brass-2/70">
            Adde Librum
          </span>
        </button>
      </section>

      {/* 푸터 장식 */}
      <footer className="mt-24 flex items-center justify-center gap-4 opacity-40">
        <span className="h-px w-16 bg-brass-2" />
        <span className="font-display text-[10px] uppercase tracking-[0.4em] text-brass-2">
          ✦ ✦ ✦
        </span>
        <span className="h-px w-16 bg-brass-2" />
      </footer>
    </div>
  )
}

function IconButton({
  children,
  ariaLabel,
}: {
  children: React.ReactNode
  ariaLabel: string
}) {
  return (
    <button
      aria-label={ariaLabel}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-brass-2/35 text-ink-soft transition-all hover:border-brass-2 hover:text-brass-2"
    >
      {children}
    </button>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function ScrollIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3h11a3 3 0 0 1 3 3v2a2 2 0 0 1-2 2H5" />
      <path d="M5 10v8a3 3 0 0 0 3 3h11" />
      <path d="M2 6a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v0a2 2 0 0 1-2 2H2z" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
