# 초기 데이터 시드 (멱등성 보장)
from datetime import datetime
from sqlmodel import Session, select

from .database import engine
from .models import Book, Note, Order, OrderItem, OrderStatus


# ============================================================================
# 시드 데이터 실행
# ============================================================================
def seed_data():
    """앱 시작 시 한 번만 실행 (멱등성: books 테이블이 비었을 때만)"""
    from sqlmodel import SQLModel
    from .database import SessionLocal

    # 테이블 생성 (기존 테이블은 유지)
    SQLModel.metadata.create_all(engine)

    session = SessionLocal()

    try:
        # books 테이블이 비어있을 때만 시드 데이터 추가 (멱등성)
        existing_books = session.execute(select(Book)).first()
        if existing_books:
            print("✅ 시드 데이터가 이미 존재합니다. 스킵합니다.")
            return

        # ========================================================================
        # 책 6권 생성
        # ========================================================================
        books_data = [
            {
                "title": "연금술사",
                "author": "파울로 코엘료",
                "cover_image_url": "/static/covers/alchemist.jpg",
                "category": "소설",
                "total_pages": 256,
                "current_page": 256,
                "read_status": "read",
                "rating": 5.0
            },
            {
                "title": "데미안",
                "author": "헤르만 헤세",
                "cover_image_url": "/static/covers/demian.jpg",
                "category": "소설",
                "total_pages": 200,
                "current_page": 200,
                "read_status": "read",
                "rating": 4.0
            },
            {
                "title": "코스모스",
                "author": "칼 세이건",
                "cover_image_url": "/static/covers/cosmos.jpg",
                "category": "과학",
                "total_pages": 719,
                "current_page": 342,
                "read_status": "reading",
                "rating": 5.0
            },
            {
                "title": "모모",
                "author": "미하엘 엔데",
                "cover_image_url": "/static/covers/momo.jpg",
                "category": "동화",
                "total_pages": 480,
                "current_page": 180,
                "read_status": "reading",
                "rating": 4.0
            },
            {
                "title": "어린 왕자",
                "author": "생텍쥐페리",
                "cover_image_url": "/static/covers/little_prince.jpg",
                "category": "동화",
                "total_pages": 144,
                "current_page": 0,
                "read_status": "to_read",
                "rating": None
            },
            {
                "title": "차라투스트라는 이렇게 말했다",
                "author": "프리드리히 니체",
                "cover_image_url": "/static/covers/alchemist.jpg",
                "category": "철학",
                "total_pages": 528,
                "current_page": 0,
                "read_status": "to_read",
                "rating": None
            },
        ]

        books = []
        for book_data in books_data:
            book = Book(**book_data)
            session.add(book)
            books.append(book)

        session.commit()
        print(f"✅ {len(books)}권의 책 추가됨")

        # ========================================================================
        # 각 책에 노트 생성
        # ========================================================================
        notes = []
        notes_content = [
            "이 책은 정말 깊은 인상을 남겼다. 꿈을 따르는 것의 중요성을 배웠다.",
            "주인공의 여정이 나의 삶과 많이 닮아있었다.",
            "철학적인 메시지가 담겨있는 훌륭한 작품이다.",
        ]

        for i, book in enumerate(books[:3]):  # 처음 3권에만 노트 추가
            for j, content in enumerate(notes_content):
                note = Note(
                    book_id=book.id,
                    content=content,
                    rating=(j % 5) + 1,  # 1~5 랜덤
                    read_date=f"2026-04-{15 + j:02d}"
                )
                session.add(note)
                notes.append(note)

        session.commit()
        print(f"✅ {len(notes)}개의 노트 추가됨")

        # ========================================================================
        # 주문 생성 (Lv2 확인용)
        # 1. pending 주문 1건 (처리 대기)
        # 2. completed 주문 1건 (완료됨)
        # ========================================================================

        # Pending 주문
        pending_order = Order(
            title="2026년 봄 독서 모음",
            status=OrderStatus.PENDING
        )
        session.add(pending_order)
        session.flush()  # ID 생성

        # pending 주문에 노트 추가 (처음 3개)
        for position, note in enumerate(notes[:3], start=1):
            item = OrderItem(
                order_id=pending_order.id,
                note_id=note.id,
                position=position
            )
            session.add(item)

        # Completed 주문
        completed_order = Order(
            title="2026년 3월 독서 기록",
            status=OrderStatus.COMPLETED
        )
        session.add(completed_order)
        session.flush()  # ID 생성

        # completed 주문에 노트 추가 (다음 3개)
        for position, note in enumerate(notes[3:6], start=1):
            item = OrderItem(
                order_id=completed_order.id,
                note_id=note.id,
                position=position
            )
            session.add(item)

        session.commit()
        print(f"✅ 2개의 주문 생성 (pending 1, completed 1)")
        print("\n📊 시드 데이터 완료:")
        print(f"   - 책: {len(books)}권")
        print(f"   - 노트: {len(notes)}개")
        print(f"   - 주문: 2건 (pending, completed)")

    except Exception as e:
        session.rollback()
        print(f"❌ 시드 데이터 생성 실패: {e}")
        raise
    finally:
        session.close()
