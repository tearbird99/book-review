import type { MockBook } from '../data/mockBooks'
import Ornament from './Ornament'

type Props = {
  book: MockBook
}

export default function BookCard({ book }: Props) {
  const [from, to] = book.spineGradient

  return (
    <article className="group cursor-pointer">
      {/* 책 표지 */}
      <div
        className="relative aspect-[2/3] overflow-hidden rounded-[2px] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.7)] ring-1 ring-black/40 transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_16px_40px_-12px_rgba(201,169,97,0.4)]"
        style={{
          background: `linear-gradient(155deg, ${from} 0%, ${to} 100%)`,
        }}
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
        <div
          className="absolute inset-2 rounded-[1px] border pointer-events-none"
          style={{ borderColor: book.accent + '60' }}
        />
        <div
          className="absolute inset-3 rounded-[1px] border pointer-events-none"
          style={{ borderColor: book.accent + '20' }}
        />

        {/* 모서리 장식 */}
        {(['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'] as const).map(
          (pos, i) => (
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
          ),
        )}

        {/* 본문 */}
        <div className="relative flex h-full flex-col items-center justify-between p-5 text-center">
          <div
            className="font-display text-[10px] uppercase tracking-[0.3em]"
            style={{ color: book.accent + 'cc' }}
          >
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
              <span
                className="font-serif text-[11px] italic"
                style={{ color: book.accent + 'dd' }}
              >
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
        <p className="font-korean-serif text-sm text-parchment/90">{book.title}</p>
        <p className="mt-0.5 text-xs text-parchment/50">
          {book.author} · 노트 {book.notes}
        </p>
      </div>
    </article>
  )
}
