# 주문 관련 라우터
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from ..database import get_session
from ..models import (
    Order, OrderCreate, OrderRead, OrderStatusUpdate, OrderStatus,
    OrderItem, OrderItemCreate, Book
)

# 라우터 생성
router = APIRouter()

# ============================================================================
# 주문 목록 조회
# ============================================================================
@router.get("", response_model=List[OrderRead])
async def get_orders(session: Session = Depends(get_session)):
    """모든 주문 조회"""
    orders = session.execute(select(Order)).scalars().all()
    return orders

# ============================================================================
# 주문 상세 조회
# ============================================================================
@router.get("/{order_id}", response_model=OrderRead)
async def get_order(order_id: int, session: Session = Depends(get_session)):
    """특정 주문 조회"""
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="주문을 찾을 수 없습니다")
    return order

# ============================================================================
# 주문 생성 (노트 1개 이상 필수)
# ============================================================================
@router.post("", response_model=OrderRead)
async def create_order(
    order_data: OrderCreate,
    session: Session = Depends(get_session)
):
    """새 주문 생성 (책 최소 1개 포함)"""
    # 빈 주문 방지
    if not order_data.book_ids or len(order_data.book_ids) == 0:
        raise HTTPException(
            status_code=400,
            detail="주문에는 최소 1개의 책이 포함되어야 합니다"
        )

    # 모든 책 존재 확인
    for book_id in order_data.book_ids:
        book = session.get(Book, book_id)
        if not book:
            raise HTTPException(
                status_code=404,
                detail=f"책 {book_id}를 찾을 수 없습니다"
            )

    # 주문 생성
    order = Order(
        title=order_data.title,
        status=order_data.status
    )
    session.add(order)
    session.flush()  # ID 생성을 위해 flush

    # 주문항목 생성 (position 할당)
    for position, book_id in enumerate(order_data.book_ids, start=1):
        order_item = OrderItem(
            order_id=order.id,
            book_id=book_id,
            position=position
        )
        session.add(order_item)

    session.commit()
    session.refresh(order)
    return order

# ============================================================================
# 주문 상태 변경 (pending → processing → completed)
# ============================================================================
@router.patch("/{order_id}/status", response_model=OrderRead)
async def update_order_status(
    order_id: int,
    status_data: OrderStatusUpdate,
    session: Session = Depends(get_session)
):
    """주문 상태 변경 (단방향: pending → processing → completed)"""
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="주문을 찾을 수 없습니다")

    # 상태 전이 검증 (단방향만 허용)
    current_status = OrderStatus(order.status)
    new_status = OrderStatus(status_data.status)

    # 유효한 상태 전이 확인
    valid_transitions = {
        OrderStatus.PENDING: [OrderStatus.PROCESSING],
        OrderStatus.PROCESSING: [OrderStatus.COMPLETED],
        OrderStatus.COMPLETED: []  # 완료 상태에서는 전이 불가
    }

    if new_status not in valid_transitions.get(current_status, []):
        raise HTTPException(
            status_code=400,
            detail=f"'{current_status}' 상태에서 '{new_status}'로 변경할 수 없습니다"
        )

    order.status = new_status
    session.add(order)
    session.commit()
    session.refresh(order)
    return order

# ============================================================================
# 주문 삭제
# ============================================================================
@router.delete("/{order_id}")
async def delete_order(order_id: int, session: Session = Depends(get_session)):
    """주문 삭제"""
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="주문을 찾을 수 없습니다")

    # 주문 항목 먼저 삭제
    items = session.execute(
        select(OrderItem).where(OrderItem.order_id == order_id)
    ).scalars().all()
    for item in items:
        session.delete(item)

    # 주문 삭제
    session.delete(order)
    session.commit()

    return {"message": "주문이 삭제되었습니다"}

# ============================================================================
# 주문의 노트 목록 조회 (Lv3 ZIP 생성 시 사용)
# ============================================================================
@router.get("/{order_id}/items", response_model=List)
async def get_order_items(order_id: int, session: Session = Depends(get_session)):
    """주문에 포함된 노트 목록"""
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="주문을 찾을 수 없습니다")

    # position 순서대로 정렬
    items = session.execute(
        select(OrderItem).where(OrderItem.order_id == order_id)
    ).scalars().all()
    items.sort(key=lambda x: x.position)

    return items
