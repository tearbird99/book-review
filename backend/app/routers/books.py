# 책 관련 라우터
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from ..database import get_session
from ..models import Book, BookCreate, BookRead, BookUpdate

# 라우터 생성
router = APIRouter()

# ============================================================================
# 책 목록 조회
# ============================================================================
@router.get("", response_model=List[BookRead])
async def get_books(session: Session = Depends(get_session)):
    """모든 책 조회"""
    books = session.execute(select(Book)).scalars().all()
    return books

# ============================================================================
# 책 상세 조회
# ============================================================================
@router.get("/{book_id}", response_model=BookRead)
async def get_book(book_id: int, session: Session = Depends(get_session)):
    """특정 책 조회"""
    book = session.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="책을 찾을 수 없습니다")
    return book

# ============================================================================
# 책 생성
# ============================================================================
@router.post("", response_model=BookRead)
async def create_book(book_data: BookCreate, session: Session = Depends(get_session)):
    """새 책 추가"""
    book = Book.from_orm(book_data)
    session.add(book)
    session.commit()
    session.refresh(book)
    return book

# ============================================================================
# 책 수정
# ============================================================================
@router.put("/{book_id}", response_model=BookRead)
async def update_book(
    book_id: int,
    book_data: BookUpdate,
    session: Session = Depends(get_session)
):
    """책 정보 수정"""
    book = session.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="책을 찾을 수 없습니다")

    # 제공된 필드만 업데이트
    update_data = book_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(book, key, value)

    session.add(book)
    session.commit()
    session.refresh(book)
    return book

# ============================================================================
# 책 삭제
# ============================================================================
@router.delete("/{book_id}")
async def delete_book(book_id: int, session: Session = Depends(get_session)):
    """책 삭제 (관련 노트도 삭제)"""
    book = session.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="책을 찾을 수 없습니다")

    # 관련 노트 삭제
    for note in book.notes:
        session.delete(note)

    session.delete(book)
    session.commit()
    return {"message": "책이 삭제되었습니다"}
