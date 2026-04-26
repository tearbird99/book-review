export type ReadStatus = 'to_read' | 'reading' | 'read'

export type MockBook = {
  id: number
  title: string
  author: string
  status: ReadStatus
  notes: number
  rating?: number       // 책 단위 별점 (1-5), 노트가 아닌 책에 귀속
  totalPages?: number
  currentPage?: number
  spineGradient: [string, string]
  accent: string
  ornament: 'star' | 'moon' | 'eye' | 'rune' | 'flame'
  category: string
}

export const mockBooks: MockBook[] = [
  {
    id: 1,
    title: '연금술사',
    author: '파울로 코엘료',
    status: 'read',
    notes: 7,
    rating: 5,
    spineGradient: ['#3b1d1f', '#7a1f24'],
    accent: '#c9a961',
    ornament: 'flame',
    category: '소설',
    totalPages: 256,
    currentPage: 256,
  },
  {
    id: 2,
    title: '데미안',
    author: '헤르만 헤세',
    status: 'read',
    notes: 4,
    rating: 4,
    spineGradient: ['#14142a', '#2a2050'],
    accent: '#c9a961',
    ornament: 'eye',
    category: '소설',
    totalPages: 200,
    currentPage: 200,
  },
  {
    id: 3,
    title: '코스모스',
    author: '칼 세이건',
    status: 'reading',
    notes: 12,
    rating: 5,
    spineGradient: ['#0a0a18', '#1f1f3d'],
    accent: '#d8c89c',
    ornament: 'star',
    category: '과학',
    totalPages: 719,
    currentPage: 342,
  },
  {
    id: 4,
    title: '모모',
    author: '미하엘 엔데',
    status: 'reading',
    notes: 3,
    rating: 4,
    spineGradient: ['#1f3a2e', '#2d5240'],
    accent: '#c9a961',
    ornament: 'moon',
    category: '동화',
    totalPages: 480,
    currentPage: 180,
  },
  {
    id: 5,
    title: '어린 왕자',
    author: '생텍쥐페리',
    status: 'to_read',
    notes: 0,
    spineGradient: ['#2a1a3a', '#4a1c40'],
    accent: '#d8c89c',
    ornament: 'star',
    category: '동화',
    totalPages: 144,
    currentPage: 0,
  },
  {
    id: 6,
    title: '차라투스트라는 이렇게 말했다',
    author: '프리드리히 니체',
    status: 'to_read',
    notes: 0,
    spineGradient: ['#1c1a14', '#3a2f1c'],
    accent: '#c9a961',
    ornament: 'rune',
    category: '철학',
    totalPages: 518,
    currentPage: 0,
  },
]
