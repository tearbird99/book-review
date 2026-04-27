# 데이터 모델 정의 (SQLModel + Pydantic)
from datetime import datetime
from typing import Optional, List
from enum import Enum
from sqlmodel import SQLModel, Field, Relationship


# ============================================================================
# 1. 책 (Book) 모델
# ============================================================================

class BookBase(SQLModel):
    """책 기본 필드 (생성/수정 시 사용)"""
    title: str
    author: str
    cover_image_url: Optional[str] = None
    category: Optional[str] = None
    total_pages: Optional[int] = None
    current_page: Optional[int] = 0


class Book(BookBase, table=True):
    """책 테이블"""
    __tablename__ = "books"

    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # 관계: 책 → 노트들
    notes: List["Note"] = Relationship(back_populates="book")


class BookCreate(BookBase):
    """책 생성 스키마"""
    pass


class BookUpdate(SQLModel):
    """책 수정 스키마"""
    title: Optional[str] = None
    author: Optional[str] = None
    cover_image_url: Optional[str] = None
    category: Optional[str] = None
    total_pages: Optional[int] = None
    current_page: Optional[int] = None


class BookRead(BookBase):
    """책 조회 스키마 (id, created_at 포함)"""
    id: int
    created_at: datetime


# ============================================================================
# 2. 노트 (Note) 모델
# ============================================================================

class NoteBase(SQLModel):
    """노트 기본 필드"""
    content: str
    rating: int = Field(ge=1, le=5)  # 1~5점
    read_date: str  # YYYY-MM-DD 형식


class Note(NoteBase, table=True):
    """노트 테이블"""
    __tablename__ = "notes"

    id: Optional[int] = Field(default=None, primary_key=True)
    book_id: int = Field(foreign_key="books.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # 관계: 노트 → 책
    book: Optional[Book] = Relationship(back_populates="notes")


class NoteCreate(NoteBase):
    """노트 생성 스키마"""
    pass


class NoteUpdate(SQLModel):
    """노트 수정 스키마 (일부 필드만 수정 가능)"""
    content: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    read_date: Optional[str] = None


class NoteRead(NoteBase):
    """노트 조회 스키마"""
    id: int
    book_id: int
    created_at: datetime
    updated_at: datetime


# ============================================================================
# 3. 주문 (Order) 모델
# ============================================================================

class OrderStatus(str, Enum):
    """주문 상태 열거형"""
    PENDING = "pending"        # 대기 중
    PROCESSING = "processing"  # 처리 중
    COMPLETED = "completed"    # 완료


class OrderBase(SQLModel):
    """주문 기본 필드"""
    title: str
    status: OrderStatus = OrderStatus.PENDING


class Order(OrderBase, table=True):
    """주문 테이블"""
    __tablename__ = "orders"

    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # 관계: 주문 → 주문항목들
    items: List["OrderItem"] = Relationship(back_populates="order")


class OrderCreate(OrderBase):
    """주문 생성 스키마 (note_ids 포함)"""
    note_ids: List[int]  # 주문에 포함할 노트 ID 리스트


class OrderUpdate(SQLModel):
    """주문 수정 스키마 (제목만 수정 가능, 상태는 별도)"""
    title: Optional[str] = None


class OrderStatusUpdate(SQLModel):
    """주문 상태 변경 스키마"""
    status: OrderStatus


class OrderRead(OrderBase):
    """주문 조회 스키마"""
    id: int
    created_at: datetime


# ============================================================================
# 4. 주문항목 (OrderItem) 모델
# ============================================================================

class OrderItemBase(SQLModel):
    """주문항목 기본 필드"""
    position: int  # 책에 들어갈 순서


class OrderItem(OrderItemBase, table=True):
    """주문항목 테이블 (조인 + 순서 보존)"""
    __tablename__ = "order_items"

    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="orders.id")
    note_id: int = Field(foreign_key="notes.id")

    # 관계
    order: Optional[Order] = Relationship(back_populates="items")
    note: Optional[Note] = Relationship()


class OrderItemCreate(OrderItemBase):
    """주문항목 생성 스키마"""
    note_id: int


class OrderItemRead(OrderItemBase):
    """주문항목 조회 스키마"""
    id: int
    order_id: int
    note_id: int
