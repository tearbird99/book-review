// 책 표지 중앙에 표시되는 5가지 장식 아이콘 (스타, 달, 눈, 룬, 화염)
type OrnamentName = 'star' | 'moon' | 'eye' | 'rune' | 'flame'

type Props = {
  name: OrnamentName
  className?: string
}

export default function Ornament({ name, className }: Props) {
  const common = {
    className,
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    stroke: 'currentColor',
    strokeWidth: 1.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (name) {
    case 'star':
      // 별 모양 아이콘
      return (
        <svg {...common}>
          <path d="M12 2.5l1.6 6.2 6.4.4-5 4 1.7 6.2L12 16l-5.7 3.3 1.7-6.2-5-4 6.4-.4z" />
          <circle cx="12" cy="12" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'moon':
      // 달 모양 아이콘
      return (
        <svg {...common}>
          <path d="M19 13.5A8 8 0 1 1 10.5 5a6.5 6.5 0 0 0 8.5 8.5z" />
          <circle cx="17" cy="7" r="0.5" fill="currentColor" stroke="none" />
          <circle cx="20" cy="10" r="0.4" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'eye':
      // 눈 모양 아이콘
      return (
        <svg {...common}>
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
          <circle cx="12" cy="12" r="2.5" />
          <circle cx="12" cy="12" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'rune':
      // 룬 문양 아이콘
      return (
        <svg {...common}>
          <path d="M12 2v20M5 6l7 4 7-4M5 18l7-4 7 4" />
        </svg>
      )
    case 'flame':
      // 화염 모양 아이콘
      return (
        <svg {...common}>
          <path d="M12 2.5c1 3 4 4.5 4 8 0 2.5-1.8 4.5-4 4.5s-4-2-4-4.5c0-2 1-3 1.5-4.5C10 7.5 9.5 9 11 10c.5-1.5-.5-2.5 1-7.5z" />
          <path d="M9 18c0 2 1.3 3.5 3 3.5s3-1.5 3-3.5" />
        </svg>
      )
  }
}
