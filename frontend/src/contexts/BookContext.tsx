import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { booksApi, notesApi } from '../lib/api'
import { ApiBook, ApiNote } from '../types/api'

export type ReadStatus = 'to_read' | 'reading' | 'read'

// UI용 책 타입 (API 응답 + 계산된 UI 필드)
export type Book = {
  id: number
  title: string
  author: string
  read_status: ReadStatus
  notes: number
  rating?: number
  total_pages?: number
  current_page?: number
  spineGradient: [string, string]
  accent: string
  ornament: 'star' | 'moon' | 'eye' | 'rune' | 'flame'
  category: string
  cover_image_url?: string
  created_at: string
}

export type MockNote = ApiNote // API와 동일한 형식 사용

type BookContextType = {
  books: Book[]
  notes: MockNote[]
  loading: boolean
  error: string | null
  addBook: (data: BookFormData) => Promise<{ bookId: number; noteId: number }>
  addNote: (bookId: number, content: string, readDate: string, rating?: number) => Promise<number>
  deleteBook: (bookId: number) => Promise<void>
  deleteNote: (noteId: number, bookId: number) => Promise<void>
  updateBook: (bookId: number, updates: Partial<Book>) => Promise<void>
  updateNote: (noteId: number, content: string, rating?: number, readDate?: string) => Promise<void>
  moveNote: (noteId: number, direction: 'up' | 'down') => void
}

export type BookFormData = {
  title: string
  author: string
  total_pages: number
  category: string
  custom_category?: string
  read_status: ReadStatus
  current_page?: number
  start_date?: string
  end_date?: string
  rating?: number
  cover_image_file?: File
}

// 카테고리별 UI 스타일 매핑
const getCategoryStyles = (category: string): {
  spineGradient: [string, string]
  accent: string
  ornament: 'star' | 'moon' | 'eye' | 'rune' | 'flame'
} => {
  const styles: Record<string, any> = {
    '소설': { spineGradient: ['#3b1d1f', '#7a1f24'], accent: '#c9a961', ornament: 'flame' },
    '과학': { spineGradient: ['#0a0a18', '#1f1f3d'], accent: '#d8c89c', ornament: 'star' },
    '철학': { spineGradient: ['#1c1a14', '#3a2f1c'], accent: '#c9a961', ornament: 'rune' },
    '동화': { spineGradient: ['#1f3a2e', '#2d5240'], accent: '#c9a961', ornament: 'moon' },
    '역사': { spineGradient: ['#2a1a2a', '#4a1f40'], accent: '#d8a87c', ornament: 'eye' },
    '시': { spineGradient: ['#14142a', '#2a2050'], accent: '#c9a961', ornament: 'eye' },
  }
  return styles[category] || { spineGradient: ['#2a2a2a', '#3a3a3a'], accent: '#c9a961', ornament: 'star' }
}

// ApiBook을 UI용 Book으로 변환
const enrichBook = (apiBook: ApiBook, notes: MockNote[]): Book => {
  const bookNotes = notes.filter((n) => n.book_id === apiBook.id)
  const styles = getCategoryStyles(apiBook.category || '')

  return {
    id: apiBook.id,
    title: apiBook.title,
    author: apiBook.author,
    read_status: apiBook.read_status as ReadStatus,
    notes: bookNotes.length,
    rating: apiBook.rating,
    total_pages: apiBook.total_pages,
    current_page: apiBook.current_page,
    spineGradient: styles.spineGradient,
    accent: styles.accent,
    ornament: styles.ornament,
    category: apiBook.category || '',
    cover_image_url: apiBook.cover_image_url,
    created_at: apiBook.created_at,
  }
}

const BookContext = createContext<BookContextType | undefined>(undefined)

export function BookProvider({ children }: { children: ReactNode }) {
  const [apiBooks, setApiBooks] = useState<ApiBook[]>([])
  const [notes, setNotes] = useState<MockNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 초기 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const booksRes = await booksApi.getAll()
        console.log('Books response:', booksRes)
        const books: ApiBook[] = Array.isArray(booksRes.data) ? booksRes.data : (Array.isArray(booksRes) ? booksRes : [])

        // 모든 책의 노트 병렬로 로드
        const notesRequests = books.map((book: ApiBook) => notesApi.getByBookId(book.id))
        const notesResults = await Promise.all(notesRequests)
        const allNotes = notesResults.flatMap((res: any) => res.data)

        setApiBooks(books)
        setNotes(allNotes)
        setError(null)
      } catch (err) {
        console.error('Failed to load books:', err)
        setError('책 데이터를 불러올 수 없습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // UI용 books 계산
  const books: Book[] = apiBooks.map((apiBook) => {
    const enriched = enrichBook(apiBook, notes)
    console.log(`Book: ${enriched.title}, Rating: ${enriched.rating}, ApiRating: ${apiBook.rating}`)
    return enriched
  })

  // 책 추가
  const addBook = async (data: BookFormData): Promise<{ bookId: number; noteId: number }> => {
    try {
      let newBook = await booksApi.create({
        title: data.title,
        author: data.author,
        category: data.custom_category || data.category,
        total_pages: data.total_pages,
        current_page: data.current_page || 0,
        read_status: data.read_status,
        rating: data.read_status === 'to_read' ? null : data.rating,
      })

      const bookId = newBook.data.id

      // 표지 이미지 업로드 (있는 경우)
      if (data.cover_image_file) {
        const uploadRes = await booksApi.uploadCover(bookId, data.cover_image_file)
        newBook = uploadRes
      }

      // 초기 빈 노트 생성
      const newNote = await notesApi.create(bookId, {
        content: '',
        rating: 3,
        read_date: data.start_date || new Date().toISOString().split('T')[0],
      })

      setApiBooks([...apiBooks, newBook.data])
      setNotes([...notes, newNote.data])

      return { bookId, noteId: newNote.data.id }
    } catch (err) {
      console.error('Failed to add book:', err)
      throw err
    }
  }

  // 노트 추가
  const addNote = async (bookId: number, content: string, readDate: string, rating: number = 3): Promise<number> => {
    try {
      const newNote = await notesApi.create(bookId, {
        content,
        rating: Math.max(1, Math.min(5, rating)), // 1~5 범위로 제한
        read_date: readDate,
      })

      setNotes([...notes, newNote.data])
      return newNote.data.id
    } catch (err) {
      console.error('Failed to add note:', err)
      throw err
    }
  }

  // 책 삭제
  const deleteBook = async (bookId: number): Promise<void> => {
    try {
      await booksApi.delete(bookId)
      setApiBooks(apiBooks.filter((b) => b.id !== bookId))
      setNotes(notes.filter((n) => n.book_id !== bookId))
    } catch (err) {
      console.error('Failed to delete book:', err)
      throw err
    }
  }

  // 노트 삭제
  const deleteNote = async (noteId: number, _bookId: number): Promise<void> => {
    try {
      await notesApi.delete(noteId)
      setNotes(notes.filter((n) => n.id !== noteId))
    } catch (err) {
      console.error('Failed to delete note:', err)
      throw err
    }
  }

  // 노트 수정
  const updateNote = async (noteId: number, content: string, rating?: number, readDate?: string): Promise<void> => {
    try {
      const updateData: any = { content }
      if (rating !== undefined) updateData.rating = rating
      if (readDate !== undefined) updateData.read_date = readDate

      await notesApi.update(noteId, updateData)
      setNotes(notes.map((n) => (n.id === noteId ? { ...n, content, rating: rating !== undefined ? rating : n.rating, read_date: readDate || n.read_date } : n)))
    } catch (err) {
      console.error('Failed to update note:', err)
      throw err
    }
  }

  // 책 정보 업데이트
  const updateBook = async (bookId: number, updates: Partial<Book>): Promise<void> => {
    try {
      const updateData: any = {}
      if (updates.title) updateData.title = updates.title
      if (updates.author) updateData.author = updates.author
      if (updates.category) updateData.category = updates.category
      if (updates.total_pages !== undefined) updateData.total_pages = updates.total_pages
      if (updates.current_page !== undefined) updateData.current_page = updates.current_page
      if (updates.read_status) updateData.read_status = updates.read_status
      if (updates.rating !== undefined) updateData.rating = updates.rating
      if (updates.cover_image_url !== undefined) updateData.cover_image_url = updates.cover_image_url

      const updatedBook = await booksApi.update(bookId, updateData)
      setApiBooks(apiBooks.map((b) => (b.id === bookId ? updatedBook.data : b)))
    } catch (err) {
      console.error('Failed to update book:', err)
      throw err
    }
  }

  // 노트 순서 변경 (로컬에서만, moveNote는 현재 사용 안 함)
  const moveNote = (_noteId: number, _direction: 'up' | 'down') => {
    // 현재 구현되지 않음 (필요시 position 필드 추가)
  }

  return (
    <BookContext.Provider value={{ books, notes, loading, error, addBook, addNote, deleteBook, deleteNote, updateBook, updateNote, moveNote }}>
      {children}
    </BookContext.Provider>
  )
}

export function useBooks() {
  const context = useContext(BookContext)
  if (context === undefined) {
    throw new Error('useBooks must be used within BookProvider')
  }
  return context
}
