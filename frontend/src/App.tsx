import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BookProvider } from './contexts/BookContext'
import LibraryPage from './pages/LibraryPage'
import BookDetailPage from './pages/BookDetailPage'

export default function App() {
  return (
    <BookProvider>
      <BrowserRouter>
        <div className="relative z-10 min-h-screen">
          <Routes>
            <Route path="/" element={<LibraryPage />} />
            <Route path="/books/:id" element={<BookDetailPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </BookProvider>
  )
}
