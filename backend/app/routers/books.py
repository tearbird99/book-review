# 책 관련 라우터
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlmodel import Session, select
from typing import List
from pathlib import Path
import shutil
import uuid

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

# ============================================================================
# 책 표지 이미지 업로드
# ============================================================================
@router.post("/{book_id}/cover", response_model=BookRead)
async def upload_cover(
    book_id: int,
    file: UploadFile = File(...),
    session: Session = Depends(get_session)
):
    """책 표지 이미지 업로드"""
    book = session.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="책을 찾을 수 없습니다")

    # 파일 크기 검증 (2MB)
    MAX_SIZE = 2 * 1024 * 1024
    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=413, detail="이미지 크기는 2MB 이하여야 합니다")

    # 파일 형식 검증
    allowed_types = {"image/jpeg", "image/png", "image/webp"}
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=415, detail="JPG, PNG, WebP 형식만 허용됩니다")

    # 고유 파일명 생성 및 저장
    COVERS_DIR = Path(__file__).parent.parent.parent / "data" / "covers"
    COVERS_DIR.mkdir(parents=True, exist_ok=True)
    ext = Path(file.filename).suffix.lower() or ".jpg"
    unique_name = f"{uuid.uuid4().hex}{ext}"
    save_path = COVERS_DIR / unique_name

    with open(save_path, "wb") as f:
        f.write(content)

    # DB 업데이트
    book.cover_image_url = f"/static/covers/{unique_name}"
    session.add(book)
    session.commit()
    session.refresh(book)
    return book
