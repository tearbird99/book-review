import { Link } from 'react-router-dom'
import type { MockBook, ReadStatus } from '../data/mockBooks'
import Ornament from './Ornament'

type Props = {
  book: MockBook
}

export default function BookCard({ book }: Props) {
  const [from, to] = book.spineGradient

  return (
    <Link to={`/books/${book.id}`} className="group block cursor-pointer outline-none">
      {/* article에 relative — 책갈피가 카드 위로 삐져나올 수 있도록 */}
      <article className="relative cursor-pointer">

        {/* 읽는 중: 황금 책갈피 (표지 위쪽) */}
        {book.status === 'reading' && <Bookmark />}

        {/* 책 표지 */}
        <div
          className="relative aspect-[2/3] overflow-hidden rounded-[2px] shadow-[0_8px_28px_-6px_rgba(31,22,51,0.22)] ring-1 ring-black/20 transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_16px_40px_-10px_rgba(138,115,64,0.35)]"
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
          {book.status === 'read' && (
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
              <h3 className="font-korean-serif text-base font-semibold leading-tight text-parchment drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" style={{ wordBreak: 'keep-all' }}>
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
            <div className="font-display text-[9px] tracking-[0.2em]" style={{ color: book.accent + '99' }}>
              {book.rating ? '★'.repeat(book.rating) + '☆'.repeat(5 - book.rating) : '— —'}
            </div>
          </div>
        </div>

        {/* 카드 하단 메타 */}
        <div className="mt-3 px-1">
          <p className="font-korean-serif text-sm text-ink">{book.title}</p>
          <p className="mt-0.5 text-xs text-ink-mute">{book.author} · 노트 {book.notes}</p>
        </div>
      </article>
    </Link>
  )
}

/* ── 책갈피: 읽는 중 — 실크 리본 끈 ── */
function Bookmark() {
  return (
    <div className="absolute top-0 right-6 z-20 drop-shadow-[1px_2px_4px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:-translate-y-1">
      <svg width="7" height="36" viewBox="0 0 7 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ribbon-sheen" x1="0" y1="0" x2="7" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#7a5818" />
            <stop offset="30%"  stopColor="#f2dc80" />
            <stop offset="55%"  stopColor="#c9a961" />
            <stop offset="100%" stopColor="#8a6828" />
          </linearGradient>
        </defs>
        {/* 리본 몸체 */}
        <rect width="7" height="36" fill="url(#ribbon-sheen)" />
        {/* 광택 하이라이트 스트라이프 */}
        <rect x="2" y="0" width="1.5" height="36" fill="rgba(255,255,255,0.22)" />
        {/* 좌우 어두운 엣지 */}
        <line x1="0.3" y1="0" x2="0.3" y2="36" stroke="rgba(0,0,0,0.25)" strokeWidth="0.6" />
        <line x1="6.7" y1="0" x2="6.7" y2="36" stroke="rgba(0,0,0,0.25)" strokeWidth="0.6" />
        {/* 직물 결 — 가로 위브 라인 */}
        <line x1="0" y1="5"  x2="7" y2="5"  stroke="rgba(0,0,0,0.07)" strokeWidth="0.6" />
        <line x1="0" y1="10" x2="7" y2="10" stroke="rgba(0,0,0,0.07)" strokeWidth="0.6" />
        <line x1="0" y1="15" x2="7" y2="15" stroke="rgba(0,0,0,0.07)" strokeWidth="0.6" />
        <line x1="0" y1="20" x2="7" y2="20" stroke="rgba(0,0,0,0.07)" strokeWidth="0.6" />
        <line x1="0" y1="25" x2="7" y2="25" stroke="rgba(0,0,0,0.07)" strokeWidth="0.6" />
        <line x1="0" y1="30" x2="7" y2="30" stroke="rgba(0,0,0,0.07)" strokeWidth="0.6" />
        {/* 하단 경사 컷 (끈 끝 처리) */}
        <polygon points="0,32 7,34 7,36 0,36" fill="rgba(0,0,0,0.15)" />
      </svg>
    </div>
  )
}

/* ── 인장: 읽은 책 ── */
function Seal({ accent }: { accent: string }) {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="seal-fill" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.12" />
        </radialGradient>
      </defs>
      {/* 외곽 원 */}
      <circle cx="15" cy="15" r="13.5" fill="url(#seal-fill)" stroke={accent} strokeWidth="1.2" />
      {/* 내부 점선 원 */}
      <circle cx="15" cy="15" r="10" fill="none" stroke={accent} strokeWidth="0.7" strokeDasharray="2 1.5" />
      {/* 체크 마크 */}
      <path d="M9.5 15.5 L13.5 19.5 L21 12" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export type { ReadStatus }
