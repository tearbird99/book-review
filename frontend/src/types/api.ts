// API 응답 타입 (백엔드와 1:1 매핑, snake_case)

export interface ApiBook {
  id: number;
  title: string;
  author: string;
  cover_image_url?: string;
  category?: string;
  total_pages?: number;
  current_page?: number;
  read_status: 'to_read' | 'reading' | 'read';
  rating?: number;
  created_at: string;
}

export interface ApiNote {
  id: number;
  book_id: number;
  content: string;
  rating: number; // 1~5
  read_date: string; // YYYY-MM-DD
  created_at: string;
  updated_at: string;
}

export interface ApiOrder {
  id: number;
  title: string;
  status: 'pending' | 'processing' | 'completed';
  created_at: string;
}

export interface ApiOrderItem {
  id: number;
  order_id: number;
  note_id: number;
  position: number;
}
