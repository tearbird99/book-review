# 주문 데이터 익스포트 라우터 (Lv3)
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlmodel import Session
import io

from ..database import get_session
from ..models import Order
from ..services.export import create_order_zip

# 라우터 생성
router = APIRouter()

# ============================================================================
# 주문 ZIP 익스포트 (Lv3 기능)
# ============================================================================
@router.get("/{order_id}/export")
async def export_order_zip(
    order_id: int,
    session: Session = Depends(get_session)
):
    """주문 데이터를 ZIP 파일로 익스포트

    포함 내용:
    - order.json: 주문 메타 정보
    - manifest.json: 파일 인덱스 (path, sha256, size)
    - books/: 주문에 포함된 책들 (JSON)
    - images/: 관련 책 표지 이미지
    """
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="주문을 찾을 수 없습니다")

    # ZIP 생성
    zip_buffer = await create_order_zip(order, session)

    return StreamingResponse(
        iter([zip_buffer.getvalue()]),
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename=order_{order_id}.zip"}
    )
