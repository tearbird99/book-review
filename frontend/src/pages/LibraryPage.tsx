import { useState } from 'react'
import { mockBooks, type ReadStatus } from '../data/mockBooks'
import { mockNotes } from '../data/mockNotes'
import BookCard from '../components/BookCard'
import BookAddModal from '../components/BookAddModal'

const TABS: { key: ReadStatus | 'all'; label: string }[] = [
  { key: 'all', label: '서재 전체' },
  { key: 'to_read', label: '읽을 책' },
  { key: 'reading', label: '읽는 중' },
  { key: 'read', label: '읽은 책' },
]

export default function LibraryPage() {
  const [active, setActive] = useState<ReadStatus | 'all'>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

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
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="group flex aspect-[2/3] flex-col items-center justify-center rounded-[2px] border-2 border-dashed border-brass-2/50 bg-[#ebe5f8] transition-all hover:border-brass-2/80 hover:bg-[#e0d6f5]"
        >
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

      {/* 푸터 구분선 */}
      <div className="mt-24 flex items-center justify-center gap-4 opacity-40">
        <span className="h-px w-16 bg-brass-2" />
        <span className="font-display text-[10px] uppercase tracking-[0.4em] text-brass-2">
          ✦ ✦ ✦
        </span>
        <span className="h-px w-16 bg-brass-2" />
      </div>

      {/* 독서 기록 히트맵 */}
      <ReadingHeatmap />

      {/* 책 추가 모달 */}
      <BookAddModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
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

function ReadingHeatmap() {
  const noteCounts: Record<string, number> = {}
  mockNotes.forEach((n) => {
    noteCounts[n.read_date] = (noteCounts[n.read_date] || 0) + 1
  })

  const today = new Date('2026-04-26')
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - 52 * 7)
  startDate.setDate(startDate.getDate() - startDate.getDay())

  type Cell = { dateStr: string; count: number; future: boolean }
  const allDates: Cell[] = []
  const cur = new Date(startDate)
  while (allDates.length < 53 * 7) {
    const y = cur.getFullYear()
    const m = String(cur.getMonth() + 1).padStart(2, '0')
    const d = String(cur.getDate()).padStart(2, '0')
    const dateStr = `${y}-${m}-${d}`
    allDates.push({ dateStr, count: noteCounts[dateStr] || 0, future: cur > today })
    cur.setDate(cur.getDate() + 1)
  }

  const weeks: Cell[][] = []
  for (let i = 0; i < allDates.length; i += 7) {
    weeks.push(allDates.slice(i, i + 7))
  }

  const CELL = 16
  const GAP = 3
  const COL_W = CELL + GAP
  const LABEL_W = 22
  const FONT = 11

  function cellBg(count: number, future: boolean): string {
    if (future) return '#e8e4f0'
    if (count === 0) return '#ddd6f0'
    if (count === 1) return '#d4b896'
    if (count === 2) return '#c9a961'
    if (count === 3) return '#a8873a'
    return '#7a5818'
  }

  // 최소 4주 간격으로만 월 라벨 표시 (겹침 방지)
  const monthLabels: string[] = []
  let lastLabelWi = -5
  for (let wi = 0; wi < weeks.length; wi++) {
    const d = new Date(weeks[wi][0].dateStr)
    const isNewMonth = wi === 0 || d.getMonth() !== new Date(weeks[wi - 1][0].dateStr).getMonth()
    if (isNewMonth && wi - lastLabelWi >= 4) {
      monthLabels.push(d.toLocaleDateString('en-US', { month: 'short' }))
      lastLabelWi = wi
    } else {
      monthLabels.push('')
    }
  }

  const startYear = new Date(weeks[0][0].dateStr).getFullYear()
  const endYear = today.getFullYear()
  const yearLabel = startYear === endYear ? `${startYear}년` : `${startYear}–${endYear}년`

  const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <section className="mt-10 pb-20">
      {/* 헤더: 제목 + 범례 나란히 */}
      <div className="mb-5 flex items-end gap-6">
        <div>
          <p className="font-display text-[10px] uppercase tracking-[0.3em] text-brass-2/60">
            Annales Lectionis
          </p>
          <h2 className="mt-1 font-korean-serif text-base text-ink">
            독서 기록 {yearLabel}
          </h2>
        </div>
        <div className="flex items-center gap-1.5 pb-0.5">
          <span style={{ fontSize: FONT, color: '#7a708c', fontFamily: 'Cinzel, serif' }}>적음</span>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{ width: CELL, height: CELL, backgroundColor: cellBg(i, false), borderRadius: 2 }}
            />
          ))}
          <span style={{ fontSize: FONT, color: '#7a708c', fontFamily: 'Cinzel, serif' }}>많음</span>
        </div>
      </div>

      {/* 그리드 */}
      <div className="overflow-x-auto">
        <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
          {/* 월 라벨 행 */}
          <div style={{ display: 'flex', marginLeft: LABEL_W + 4, marginBottom: 6 }}>
            {weeks.map((_, wi) => (
              <div
                key={wi}
                style={{
                  width: COL_W,
                  flexShrink: 0,
                  fontSize: FONT,
                  color: '#7a708c',
                  fontFamily: 'Cinzel, serif',
                  letterSpacing: '0.03em',
                  lineHeight: 1,
                }}
              >
                {monthLabels[wi]}
              </div>
            ))}
          </div>

          {/* 요일별 행 — 7개 모두 표시 */}
          {DAYS.map((day, di) => (
            <div key={di} style={{ display: 'flex', alignItems: 'center', marginBottom: GAP }}>
              <div
                style={{
                  width: LABEL_W,
                  marginRight: 4,
                  fontSize: FONT,
                  color: '#7a708c',
                  textAlign: 'right',
                  fontFamily: 'Cinzel, serif',
                  flexShrink: 0,
                  lineHeight: 1,
                }}
              >
                {day}
              </div>
              {weeks.map((week, wi) => {
                const cell = week[di]
                return (
                  <div
                    key={wi}
                    title={`${cell.dateStr}: 노트 ${cell.count}개`}
                    style={{
                      width: CELL,
                      height: CELL,
                      marginRight: GAP,
                      backgroundColor: cellBg(cell.count, cell.future),
                      borderRadius: 2,
                      flexShrink: 0,
                    }}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
