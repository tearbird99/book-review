import { createContext, useContext, useState, ReactNode } from 'react'
import { mockBooks, type MockBook, type ReadStatus } from '../data/mockBooks'
import { mockNotes, type MockNote } from '../data/mockNotes'

type BookContextType = {
  books: MockBook[]
  notes: MockNote[]
  addBook: (data: BookFormData) => { bookId: number; noteId: number }
  deleteBook: (bookId: number) => void
  updateBook: (bookId: number, updates: Partial<MockBook>) => void
}

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

export function BookProvider({ children }: { children: ReactNode }) {
  const [addedBooks, setAddedBooks] = useState<MockBook[]>([])
  const [addedNotes, setAddedNotes] = useState<MockNote[]>([])

  const books = [...mockBooks, ...addedBooks]
  const notes = [...mockNotes, ...addedNotes]

  const addBook = (data: BookFormData) => {
    // Generate new IDs
    const newBookId = Math.max(...books.map((b) => b.id), 0) + 1
    const newNoteId = Math.max(...notes.map((n) => n.id), 0) + 1

    // Create new book with default gray colors
    const newBook: MockBook = {
      id: newBookId,
      title: data.title,
      author: data.author,
      status: data.status,
      notes: 1,
      rating: data.status === 'to_read' ? undefined : data.rating,
      totalPages: data.totalPages,
      currentPage: data.status === 'to_read' ? 0 : data.currentPage,
      spineGradient: ['#2a2a2a', '#3a3a3a'], // Default gray
      accent: '#c9a961', // Gold accent (same as mockBooks)
      ornament: 'star', // Default ornament
      category: data.customCategory || data.category,
    }

    // Create initial note (empty state)
    const newNote: MockNote = {
      id: newNoteId,
      book_id: newBookId,
      content: '', // Empty note
      rating: 0,
      read_date: data.startDate || new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    }

    setAddedBooks([...addedBooks, newBook])
    setAddedNotes([...addedNotes, newNote])

    return { bookId: newBookId, noteId: newNoteId }
  }

  const deleteBook = (bookId: number) => {
    setAddedBooks(addedBooks.filter((b) => b.id !== bookId))
    setAddedNotes(addedNotes.filter((n) => n.book_id !== bookId))
  }

  const updateBook = (bookId: number, updates: Partial<MockBook>) => {
    setAddedBooks(
      addedBooks.map((b) =>
        b.id === bookId ? { ...b, ...updates } : b
      )
    )
  }

  return (
    <BookContext.Provider value={{ books, notes, addBook, deleteBook, updateBook }}>
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
