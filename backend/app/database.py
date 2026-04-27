# 데이터베이스 설정 및 세션 관리
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel

# 데이터베이스 경로 설정
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/app.db")

# SQLAlchemy 엔진 생성
# check_same_thread=False는 SQLite에서 멀티스레드 사용 시 필요
engine = create_engine(
    DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

# 세션 팩토리
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# 의존성 주입: 라우터에서 사용할 DB 세션
def get_session():
    """라우터에서 사용할 DB 세션 제공"""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


# 데이터베이스 초기화
def init_db():
    """앱 시작 시 테이블 생성"""
    SQLModel.metadata.create_all(engine)
