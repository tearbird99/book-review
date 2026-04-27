# 주문 데이터 ZIP 익스포트 서비스
import json
import io
import zipfile
from hashlib import sha256
from datetime import datetime
from pathlib import Path
from sqlmodel import Session, select

from ..models import Order, OrderItem, Note, Book


# ============================================================================
# ZIP 파일 생성
# ============================================================================
async def create_order_zip(order: Order, session: Session) -> io.BytesIO:
    """주문 데이터를 ZIP 파일로 생성

    구조:
    order_<id>_<slug>.zip
    ├── order.json       # 주문 메타
    ├── manifest.json    # 파일 인덱스
    ├── notes/
    │   ├── 001_<note_id>.json
    │   └── ...
    └── images/
        └── <book_id>_<filename>
    """
    # 주문 항목 조회 (position 순으로)
    order_items = session.exec(
        select(OrderItem).where(OrderItem.order_id == order.id)
    ).all()
    order_items.sort(key=lambda x: x.position)

    if not order_items:
        raise ValueError("주문에 노트가 포함되어 있지 않습니다")

    # ZIP 버퍼 생성
    zip_buffer = io.BytesIO()
    manifest_entries = []

    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        # ========================================================================
        # 1. order.json 생성 (주문 메타)
        # ========================================================================
        order_json = {
            "id": order.id,
            "title": order.title,
            "status": order.status,
            "created_at": order.created_at.isoformat(),
            "item_count": len(order_items)
        }
        order_json_str = json.dumps(order_json, ensure_ascii=False, indent=2)
        order_json_bytes = order_json_str.encode("utf-8")

        zip_file.writestr("order.json", order_json_bytes)
        manifest_entries.append({
            "path": "order.json",
            "sha256": sha256(order_json_bytes).hexdigest(),
            "size": len(order_json_bytes)
        })

        # ========================================================================
        # 2. notes/ 디렉터리 생성 (노트들)
        # ========================================================================
        collected_books = {}  # book_id → Book 객체 (이미지 중복 제거용)

        for item in order_items:
            note = session.get(Note, item.note_id)
            book = session.get(Book, note.book_id)

            # 책 정보 저장 (이미지 수집용)
            if book.id not in collected_books:
                collected_books[book.id] = book

            # 노트 JSON 생성 (position 기반 파일명: 001, 002, ...)
            note_filename = f"{item.position:03d}_{note.id}.json"
            note_json = {
                "id": note.id,
                "book_id": note.book_id,
                "book_title": book.title,
                "book_author": book.author,
                "book_cover": book.cover_image_url,
                "content": note.content,
                "rating": note.rating,
                "read_date": note.read_date,
                "created_at": note.created_at.isoformat(),
                "updated_at": note.updated_at.isoformat(),
            }
            note_json_str = json.dumps(note_json, ensure_ascii=False, indent=2)
            note_json_bytes = note_json_str.encode("utf-8")

            notes_path = f"notes/{note_filename}"
            zip_file.writestr(notes_path, note_json_bytes)
            manifest_entries.append({
                "path": notes_path,
                "sha256": sha256(note_json_bytes).hexdigest(),
                "size": len(note_json_bytes)
            })

        # ========================================================================
        # 3. images/ 디렉터리 생성 (책 표지 이미지 - 중복 제거)
        # ========================================================================
        for book_id, book in collected_books.items():
            if book.cover_image_url:
                # 로컬 파일 경로에서 읽기
                image_path = Path(__file__).parent.parent.parent / "data" / book.cover_image_url.lstrip("/")

                if image_path.exists():
                    with open(image_path, "rb") as img_file:
                        img_data = img_file.read()
                        img_filename = image_path.name
                        zip_path = f"images/{book_id}_{img_filename}"

                        zip_file.writestr(zip_path, img_data)
                        manifest_entries.append({
                            "path": zip_path,
                            "sha256": sha256(img_data).hexdigest(),
                            "size": len(img_data)
                        })

        # ========================================================================
        # 4. manifest.json 생성 (파일 인덱스)
        # ========================================================================
        manifest = {
            "created_at": datetime.utcnow().isoformat(),
            "file_count": len(manifest_entries),
            "files": manifest_entries
        }
        manifest_json_str = json.dumps(manifest, ensure_ascii=False, indent=2)
        manifest_json_bytes = manifest_json_str.encode("utf-8")

        zip_file.writestr("manifest.json", manifest_json_bytes)

    # 버퍼 포인터를 처음으로 이동
    zip_buffer.seek(0)
    return zip_buffer
