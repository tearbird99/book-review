import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BookProvider } from './contexts/BookContext'
import LibraryPage from './pages/LibraryPage'
import BookDetailPage from './pages/BookDetailPage'
import OrdersPage from './pages/OrdersPage'

// 메인 앱: 전역 상태(BookProvider) + 라우팅(BrowserRouter) 설정
// 경로: / (서재 페이지) → /books/:id (책 상세 페이지) → /orders (주문 관리 페이지)
export default function App() {
  return (
    <BookProvider>
      <BrowserRouter>
        <div className="relative z-10 min-h-screen">
          <Routes>
            <Route path="/" element={<LibraryPage />} />
            <Route path="/books/:id" element={<BookDetailPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </BookProvider>
  )
}
