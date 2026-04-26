import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LibraryPage from './pages/LibraryPage'
import BookDetailPage from './pages/BookDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative z-10 min-h-screen">
        <Routes>
          <Route path="/" element={<LibraryPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
