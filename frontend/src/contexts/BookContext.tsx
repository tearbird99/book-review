import { createContext, useContext, useState, ReactNode } from 'react'
import { mockBooks, type MockBook, type ReadStatus } from '../data/mockBooks'
import { mockNotes, type MockNote } from '../data/mockNotes'

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

    // Update book's note count
    setAddedBooks(
      addedBooks.map((b) =>
        b.id === bookId ? { ...b, notes: b.notes + 1 } : b
      )
    )

    return newNoteId
  }

  const deleteBook = (bookId: number) => {
    setAddedBooks(addedBooks.filter((b) => b.id !== bookId))
    setAddedNotes(addedNotes.filter((n) => n.book_id !== bookId))
  }

  const deleteNote = (noteId: number, bookId: number) => {
    setAddedNotes(addedNotes.filter((n) => n.id !== noteId))

    // Update book's note count
    setAddedBooks(
      addedBooks.map((b) =>
        b.id === bookId && b.notes > 0 ? { ...b, notes: b.notes - 1 } : b
      )
    )
  }

  const updateBook = (bookId: number, updates: Partial<MockBook>) => {
    setAddedBooks(
      addedBooks.map((b) =>
        b.id === bookId ? { ...b, ...updates } : b
      )
    )
  }

  const moveNote = (noteId: number, direction: 'up' | 'down') => {
    const note = notes.find((n) => n.id === noteId)
    if (!note) return

    // Find all notes for this book and their indices in notes array
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

    // Swap in addedNotes if both notes are in addedNotes
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

export function useBooks() {
  const context = useContext(BookContext)
  if (context === undefined) {
    throw new Error('useBooks must be used within BookProvider')
  }
  return context
}
