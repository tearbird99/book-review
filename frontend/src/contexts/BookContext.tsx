import { createContext, useContext, useState, ReactNode } from 'react'
import { mockBooks, type MockBook, type ReadStatus } from '../data/mockBooks'
import { mockNotes, type MockNote } from '../data/mockNotes'

// Context 타입 정의: 책 데이터와 모든 액션 함수
type BookContextType = {
  books: MockBook[]
  notes: MockNote[]
  addBook: (data: BookFormData) => { bookId: number; noteId: number }
  addNote: (bookId: number, content: string, readDate: string, rating?: number) => number
  deleteBook: (bookId: number) => void
  deleteNote: (noteId: number, bookId: number) => void
  updateBook: (bookId: number, updates: Partial<MockBook>) => void
  moveNote: (noteId: number, direction: 'up' | 'down') => void
}

// 책 추가 양식 데이터 타입
export type BookFormData = {
  title: string
  author: string
  totalPages: number
  category: string
  customCategory?: string
  status: ReadStatus
  currentPage?: number
  startDate?: string
  endDate?: string
  rating?: number
}

const BookContext = createContext<BookContextType | undefined>(undefined)

// 전역 상태 관리 프로바이더: 책과 노트 데이터 관리
export function BookProvider({ children }: { children: ReactNode }) {
  // 추가된 책/노트만 관리 (mockData와 분리)
  const [addedBooks, setAddedBooks] = useState<MockBook[]>([])
  const [addedNotes, setAddedNotes] = useState<MockNote[]>([])

  // 기본 데이터와 추가된 데이터 병합
  const books = [...mockBooks, ...addedBooks]
  const notes = [...mockNotes, ...addedNotes]

  // 새 책 추가: 책 생성 + 초기 빈 노트 자동 생성
  const addBook = (data: BookFormData) => {
    const newBookId = Math.max(...books.map((b) => b.id), 0) + 1
    const newNoteId = Math.max(...notes.map((n) => n.id), 0) + 1

    const newBook: MockBook = {
      id: newBookId,
      title: data.title,
      author: data.author,
      status: data.status,
      notes: 1,
      rating: data.status === 'to_read' ? undefined : data.rating,
      totalPages: data.totalPages,
      currentPage: data.status === 'to_read' ? 0 : data.currentPage,
      spineGradient: ['#2a2a2a', '#3a3a3a'],
      accent: '#c9a961',
      ornament: 'star',
      category: data.customCategory || data.category,
    }

    // 책 생성 시 초기 노트 자동 생성
    const newNote: MockNote = {
      id: newNoteId,
      book_id: newBookId,
      content: '',
      rating: 0,
      read_date: data.startDate || new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    }

    setAddedBooks([...addedBooks, newBook])
    setAddedNotes([...addedNotes, newNote])

    return { bookId: newBookId, noteId: newNoteId }
  }

  // 새 노트 추가: 빈 노트 생성 + 책의 노트 카운트 증가
  const addNote = (bookId: number, content: string, readDate: string, rating: number = 0) => {
    const newNoteId = Math.max(...notes.map((n) => n.id), 0) + 1

    const newNote: MockNote = {
      id: newNoteId,
      book_id: bookId,
      content,
      rating,
      read_date: readDate,
      created_at: new Date().toISOString(),
    }

    setAddedNotes([...addedNotes, newNote])

    // 책의 노트 개수 증가
    setAddedBooks(
      addedBooks.map((b) =>
        b.id === bookId ? { ...b, notes: b.notes + 1 } : b
      )
    )

    return newNoteId
  }

  // 책 삭제: 관련된 모든 노트도 함께 삭제
  const deleteBook = (bookId: number) => {
    setAddedBooks(addedBooks.filter((b) => b.id !== bookId))
    setAddedNotes(addedNotes.filter((n) => n.book_id !== bookId))
  }

  // 노트 삭제: 책의 노트 카운트 감소
  const deleteNote = (noteId: number, bookId: number) => {
    setAddedNotes(addedNotes.filter((n) => n.id !== noteId))

    setAddedBooks(
      addedBooks.map((b) =>
        b.id === bookId && b.notes > 0 ? { ...b, notes: b.notes - 1 } : b
      )
    )
  }

  // 책 정보 업데이트
  const updateBook = (bookId: number, updates: Partial<MockBook>) => {
    setAddedBooks(
      addedBooks.map((b) =>
        b.id === bookId ? { ...b, ...updates } : b
      )
    )
  }

  // 같은 책의 노트들 끼리 순서 변경 (위/아래 이동)
  const moveNote = (noteId: number, direction: 'up' | 'down') => {
    const note = notes.find((n) => n.id === noteId)
    if (!note) return

    // 같은 책의 노트들만 추출
    const bookNoteIndices = notes
      .map((n: MockNote, idx: number) => (n.book_id === note.book_id ? idx : -1))
      .filter((idx: number) => idx !== -1)

    const currentPosition = bookNoteIndices.indexOf(notes.indexOf(note))
    let newPosition = currentPosition

    if (direction === 'up' && currentPosition > 0) {
      newPosition = currentPosition - 1
    } else if (direction === 'down' && currentPosition < bookNoteIndices.length - 1) {
      newPosition = currentPosition + 1
    } else {
      return
    }

    const currentIdx = bookNoteIndices[currentPosition]
    const swapIdx = bookNoteIndices[newPosition]

    // addedNotes 배열에서 위치 교환
    const addedNotesCopy = [...addedNotes]
    const addedIdx1 = addedNotesCopy.findIndex((n) => n.id === notes[currentIdx].id)
    const addedIdx2 = addedNotesCopy.findIndex((n) => n.id === notes[swapIdx].id)

    if (addedIdx1 !== -1 && addedIdx2 !== -1) {
      ;[addedNotesCopy[addedIdx1], addedNotesCopy[addedIdx2]] = [
        addedNotesCopy[addedIdx2],
        addedNotesCopy[addedIdx1],
      ]
      setAddedNotes(addedNotesCopy)
    }
  }

  return (
    <BookContext.Provider value={{ books, notes, addBook, addNote, deleteBook, deleteNote, updateBook, moveNote }}>
      {children}
    </BookContext.Provider>
  )
}

// 전역 상태 접근 훅
export function useBooks() {
  const context = useContext(BookContext)
  if (context === undefined) {
    throw new Error('useBooks must be used within BookProvider')
  }
  return context
}
