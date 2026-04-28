import axios from 'axios';
import { ApiBook, ApiNote, ApiOrder, ApiOrderItem } from '../types/api';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================================
// Books API
// ============================================================================

export const booksApi = {
  // 모든 책 조회
  getAll: () => apiClient.get<ApiBook[]>('/books'),

  // 특정 책 조회
  getById: (id: number) => apiClient.get<ApiBook>(`/books/${id}`),

  // 책 생성
  create: (data: {
    title: string;
    author: string;
    cover_image_url?: string;
    category?: string;
    total_pages?: number;
    current_page?: number;
    read_status?: string;
    rating?: number | null;
  }) => apiClient.post<ApiBook>('/books', data),

  // 책 수정
  update: (id: number, data: Partial<{
    title: string;
    author: string;
    cover_image_url: string;
    category: string;
    total_pages: number;
    current_page: number;
    read_status: string;
    rating: number | null;
  }>) => apiClient.put<ApiBook>(`/books/${id}`, data),

  // 책 삭제
  delete: (id: number) => apiClient.delete(`/books/${id}`),

  // 책 표지 이미지 업로드
  uploadCover: (id: number, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post<ApiBook>(`/books/${id}/cover`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
};

// ============================================================================
// Notes API
// ============================================================================

export const notesApi = {
  // 특정 책의 노트 목록 조회
  getByBookId: (bookId: number) => apiClient.get<ApiNote[]>('/notes', {
    params: { book_id: bookId },
  }),

  // 특정 노트 조회
  getById: (id: number) => apiClient.get<ApiNote>(`/notes/${id}`),

  // 노트 생성
  create: (bookId: number, data: {
    content: string;
    rating: number;
    read_date: string;
  }) => apiClient.post<ApiNote>('/notes', data, {
    params: { book_id: bookId },
  }),

  // 노트 수정
  update: (id: number, data: Partial<{
    content: string;
    rating: number;
    read_date: string;
  }>) => apiClient.put<ApiNote>(`/notes/${id}`, data),

  // 노트 삭제
  delete: (id: number) => apiClient.delete(`/notes/${id}`),
};

// ============================================================================
// Orders API
// ============================================================================

export const ordersApi = {
  // 모든 주문 조회
  getAll: () => apiClient.get<ApiOrder[]>('/orders'),

  // 특정 주문 조회
  getById: (id: number) => apiClient.get<ApiOrder>(`/orders/${id}`),

  // 주문 생성
  create: (data: {
    title: string;
    note_ids: number[];
    status?: string;
  }) => apiClient.post<ApiOrder>('/orders', data),

  // 주문 상태 변경
  updateStatus: (id: number, status: string) =>
    apiClient.patch<ApiOrder>(`/orders/${id}/status`, { status }),

  // 주문의 노트 목록 조회
  getItems: (id: number) => apiClient.get<ApiOrderItem[]>(`/orders/${id}/items`),

  // 주문 ZIP 다운로드 (Lv3)
  exportZip: (id: number) => apiClient.get(`/orders/${id}/export`, {
    responseType: 'blob',
  }),
};

export default apiClient;
