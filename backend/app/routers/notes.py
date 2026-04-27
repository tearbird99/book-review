# 노트 관련 라우터
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from typing import List

from ..database import get_session
from ..models import Book, Note, NoteCreate, NoteRead, NoteUpdate

# 라우터 생성
router = APIRouter()

# ============================================================================
# 책의 노트 목록 조회
# ============================================================================
@router.get("", response_model=List[NoteRead])
async def get_notes(
    book_id: int = Query(..., description="책 ID"),
    session: Session = Depends(get_session)
):
    """특정 책의 노트 목록 조회"""
    notes = session.exec(select(Note).where(Note.book_id == book_id)).all()
    return notes

# ============================================================================
# 노트 상세 조회
# ============================================================================
@router.get("/{note_id}", response_model=NoteRead)
async def get_note(note_id: int, session: Session = Depends(get_session)):
    """특정 노트 조회"""
    note = session.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="노트를 찾을 수 없습니다")
    return note

# ============================================================================
# 노트 생성
# ============================================================================
@router.post("", response_model=NoteRead)
async def create_note(
    note_data: NoteCreate,
    book_id: int = Query(..., description="책 ID"),
    session: Session = Depends(get_session)
):
    """새 노트 생성"""
    # 책 존재 여부 확인
    book = session.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="책을 찾을 수 없습니다")

    note = Note(book_id=book_id, **note_data.dict())
    session.add(note)
    session.commit()
    session.refresh(note)
    return note

# ============================================================================
# 노트 수정
# ============================================================================
@router.put("/{note_id}", response_model=NoteRead)
async def update_note(
    note_id: int,
    note_data: NoteUpdate,
    session: Session = Depends(get_session)
):
    """노트 정보 수정"""
    note = session.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="노트를 찾을 수 없습니다")

    # 제공된 필드만 업데이트
    update_data = note_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(note, key, value)

    session.add(note)
    session.commit()
    session.refresh(note)
    return note

# ============================================================================
# 노트 삭제
# ============================================================================
@router.delete("/{note_id}")
async def delete_note(note_id: int, session: Session = Depends(get_session)):
    """노트 삭제"""
    note = session.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="노트를 찾을 수 없습니다")

    session.delete(note)
    session.commit()
    return {"message": "노트가 삭제되었습니다"}
