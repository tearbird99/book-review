# FastAPI 메인 애플리케이션
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import os

# 모듈 임포트
from .database import init_db

# FastAPI 앱 인스턴스 생성
app = FastAPI(
    title="마법사의 서재 API",
    description="독서 기록 및 주문 관리 API",
    version="1.0.0"
)

# ============================================================================
# CORS 설정 (cross-origin 요청 허용)
# ============================================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프로덕션에서는 구체적인 도메인으로 변경
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# 정적 파일 마운트 (책 표지 이미지 등)
# ============================================================================
static_dir = Path(__file__).parent.parent / "data"
if static_dir.exists():
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

# ============================================================================
# 라우터 등록 (향후 추가될 예정)
# ============================================================================
# from .routers import books, notes, orders, exports
# app.include_router(books.router, prefix="/api/books", tags=["Books"])
# app.include_router(notes.router, prefix="/api/notes", tags=["Notes"])
# app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
# app.include_router(exports.router, prefix="/api/exports", tags=["Exports"])

# ============================================================================
# 앱 시작 이벤트
# ============================================================================
@app.on_event("startup")
async def startup_event():
    """앱 시작 시 DB 테이블 생성"""
    init_db()
    print("✅ 데이터베이스 초기화 완료")

# ============================================================================
# 헬스 체크 엔드포인트
# ============================================================================
@app.get("/health")
async def health_check():
    """서버 상태 확인"""
    return {"status": "ok"}

# ============================================================================
# 루트 엔드포인트
# ============================================================================
@app.get("/")
async def root():
    """API 소개"""
    return {
        "message": "마법사의 서재 API",
        "docs": "/docs",
        "version": "1.0.0"
    }
