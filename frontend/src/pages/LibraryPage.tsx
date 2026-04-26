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
          <p className="font-display text-[11px] uppercase tracking-[0.4em] text-brass/70">
            Wizard&apos;s Library
          </p>
          <h1 className="mt-2 font-korean-serif text-4xl font-semibold tracking-wide text-parchment">
            마법사의 서재
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <span className="h-px w-12 bg-brass" />
            <span className="font-serif text-sm italic text-parchment/60">
              Codices et notae lectoris
            </span>
            <span className="h-px w-12 bg-brass" />
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
      <nav className="border-b border-brass/20">
        <ul className="flex gap-8">
          {TABS.map((tab) => {
            const isActive = active === tab.key
            return (
              <li key={tab.key}>
                <button
                  onClick={() => setActive(tab.key)}
                  className={`relative pb-4 font-korean-serif text-sm tracking-wider transition-colors ${
                    isActive ? 'text-parchment' : 'text-parchment/40 hover:text-parchment/70'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brass to-transparent" />
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
          <p className="font-display text-xs uppercase tracking-[0.3em] text-brass/60">
            Tomus · {filtered.length} volumina
          </p>
          <p className="mt-1 font-korean-serif text-lg text-parchment/80">
            서재에 꽂힌 {filtered.length}권
          </p>
        </div>
        <button className="group flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-parchment/60 hover:text-parchment">
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
        <button className="group flex aspect-[2/3] flex-col items-center justify-center rounded-[2px] border border-dashed border-brass/30 bg-midnight-2/40 transition-all hover:border-brass/60 hover:bg-midnight-2/70">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brass/40 text-brass/70 transition-colors group-hover:border-brass group-hover:text-brass">
            <PlusIcon />
          </div>
          <span className="mt-3 font-korean-serif text-sm text-parchment/60 group-hover:text-parchment/90">
            새 책 봉인하기
          </span>
          <span className="mt-1 font-display text-[9px] uppercase tracking-[0.3em] text-brass/50">
            Adde Librum
          </span>
        </button>
      </section>

      {/* 푸터 장식 */}
      <footer className="mt-24 flex items-center justify-center gap-4 opacity-50">
        <span className="h-px w-16 bg-brass/40" />
        <span className="font-display text-[10px] uppercase tracking-[0.4em] text-brass/60">
          ✦ ✦ ✦
        </span>
        <span className="h-px w-16 bg-brass/40" />
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
      className="flex h-10 w-10 items-center justify-center rounded-full border border-brass/30 text-parchment/70 transition-all hover:border-brass hover:text-brass"
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
