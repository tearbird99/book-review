# 마법사의 서재 (Wizard's Library)

독서 기록을 남기고, 콘텐츠를 책으로 만드는 서비스

## 1. 서비스 소개

### 개요
독서 기록을 남기고, 완성된 노트들을 선택해 책으로 만들 수 있는 웹 애플리케이션입니다.

### 대상 사용자
- 책을 읽으며 감상, 인용구, 분석을 기록하고 싶은 독자
- 독서 경험을 시각화하고 아카이빙하고 싶은 사람
- 자신의 독서 기록을 출판하거나 공유하고 싶은 사람

### 주요 기능

**도서 관리**
- 책 추가/편집 (제목, 저자, 카테고리, 표지 이미지, 읽음 상태)
- 다양한 정렬 옵션 (제목 가나다순, 최근 추가순, 별점순, 진행률순)
- 페이지네이션 (페이지당 15권)

**독서노트**
- 노트 종류별 에디터 (감상, 인용구, 표, 이미지)
- 이미지 노트: 업로드 + 설명 캡션 + 원본 가로세로 비율 유지
- 노트 더블클릭으로 편집 모드 진입
- 노트 작성 날짜 편집
- 별점 평가

**기록 시각화**
- 연간 독서 활동 히트맵 (GitHub 스타일)
- 독서 진행 상황 추적

**책 제작 (주문)**
- 완성된 노트들 선택
- 주문 생성 및 상태 관리
- 주문 데이터 ZIP 익스포트 (JSON + 이미지)

## 2. 실행 방법 (Docker)

### 사전 요구사항
- Docker & Docker Compose 설치
- Git

### 빠른 시작

```bash
# 저장소 클론
git clone https://github.com/tearbird99/book-review.git
cd book-review

# 환경변수 설정
cp .env.example .env

# Docker Compose 실행
docker-compose up

# 브라우저에서 접속
http://localhost:3000
```

서비스가 시작되면 더미 데이터가 자동으로 로드되어 로그인 없이 바로 사용할 수 있습니다.

### 포트 변경

기본 포트: 프론트엔드 3000, 백엔드 8000

포트를 변경해야 할 경우 `.env` 파일을 수정하세요:

```bash
# .env 파일
APP_PORT=3000        # 프론트엔드 포트 (변경하려면 여기를 수정)
BACKEND_PORT=8000    # 백엔드 포트 (변경하려면 여기를 수정)
```

또는 `docker-compose.yml`의 ports 섹션을 직접 수정할 수 있습니다:

```yaml
backend:
  ports:
    - "8000:8000"  # 왼쪽 숫자를 원하는 포트로 변경
```

### 주요 디렉터리 구조

```
book-review/
├── frontend/                  # React + TypeScript 프론트엔드
│   ├── src/
│   │   ├── pages/            # 페이지 컴포넌트 (LibraryPage, BookDetailPage, OrdersPage)
│   │   ├── components/       # 재사용 가능한 컴포넌트 (BookCard, NoteCard, Modal 등)
│   │   ├── contexts/         # React Context (상태 관리)
│   │   ├── types/            # TypeScript 타입 정의 (API 응답 타입)
│   │   ├── lib/              # 유틸리티 (API 클라이언트)
│   │   ├── data/             # 더미 데이터
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/               # 정적 자산 (로고, 파비콘)
│   └── index.html
├── backend/                   # FastAPI 백엔드
│   ├── app/
│   │   ├── routers/          # API 라우터 (books, notes, orders, exports)
│   │   ├── models.py         # SQLModel 데이터 모델
│   │   ├── main.py           # FastAPI 앱 진입점
│   │   ├── database.py       # 데이터베이스 설정
│   │   ├── seed.py           # 초기 더미 데이터
│   │   └── services/         # 비즈니스 로직 (exports, ZIP 생성 등)
│   ├── data/                 # 데이터베이스 (SQLite) & 파일 저장소
│   ├── requirements.txt       # Python 패키지 의존성
│   └── Dockerfile
├── docker-compose.yml         # 컨테이너 오케스트레이션
├── .env.example               # 환경변수 템플릿
├── task.md                    # 과제 요구사항
└── plan.md                    # 구현 계획
```

## 3. 완성한 레벨

**결과: Lv1 + Lv2 + Lv3 모두 완성** ✅

### Lv1. 서비스 구현 ✅

**도서 관리 (기본 기능)**
- 책 추가/삭제/조회
- 책 정보 편집 (제목, 저자, 카테고리, 페이지 수, 표지 이미지)
- 읽음 상태 변경 (to_read → reading → read)
- 독서 기간 추적 (읽는 중일 때 시작 날짜, 읽은 책일 때 시작/종료 날짜)
- 별점 평가 (0.5 단위, reading/read 상태에서만)
- 페이지 진행률 바 표시
- 카테고리별 색상 및 오너먼트 자동 할당

**독서노트 기능**
- 노트 추가 (타입 선택: 감상, 인용구, 표, 이미지)
- 타입별 에디터
  - 감상: 자유 텍스트
  - 인용구: 텍스트 + 페이지 번호
  - 표: 행/열 추가, 데이터 입력
  - 이미지: 이미지 업로드 + 설명 캡션 + 원본 가로세로 비율 자동 유지 + 드래그로 크기 조절
- 노트 더블클릭으로 편집 모드 진입
- 노트 작성 날짜 편집
- 별점 평가
- 노트 목록 표시 및 삭제

**서비스 플로우 기능**
- 정렬 옵션: 제목 가나다순, 최근 추가순, 별점순, 읽기 진행률순
- 페이지당 15권 페이지네이션
- 탭 필터링 (전체, 읽을 책, 읽는 중, 읽은 책)
- 제목/저자 검색
- Floating 책 추가 버튼
- 표지 이미지 업로드 (JPG, PNG, WebP, 최대 2MB)

### Lv2. 자체 주문 기능 ✅

**주문 관리**
- 주문 생성: 책 1권 이상 선택 후 주문 제목 입력
- 주문 상태 관리: pending → processing → completed (단방향 상태 전이)
- 주문 목록 조회 및 상태 표시
- 주문별 포함된 책 목록 조회

**데이터 구조**
- Order: 주문 제목, 상태, 생성 날짜
- OrderItem: 책 ID, 주문 내 순서, 주문 ID (책 단위로 주문 구성)

### Lv3. 주문 데이터 익스포트 ✅

**ZIP 파일 생성**
- order.json: 주문 메타정보 (ID, 제목, 상태, 생성 날짜, 항목 수)
- books/: 주문에 포함된 책들의 JSON 파일
  - `<position>_<book_id>.json`: 책 정보 (제목, 저자, 카테고리, 읽음 상태, 별점, 독서 기간 등) + 해당 책의 모든 독서노트 데이터
  - 책들은 주문에 추가된 순서대로 저장됨
- images/: 관련 도서 표지 이미지 (중복 제거)
- manifest.json: 파일 인덱스 및 SHA256 체크섬

**데이터 구조화**
- 주문 1건에 필요한 모든 콘텐츠 + 메타데이터를 한 번에 추출
- 파이트너(가상의 인쇄업체)에게 전달 가능한 표준화된 형식

---

## 4. 기술 스택 및 아키텍처

### Frontend
- **Framework**: React 18 with TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router
- **HTTP Client**: Axios
- **Image Handling**: File API (FileReader) + Mouse Events + Aspect Ratio Preservation

### Backend
- **Framework**: FastAPI (Python) with Uvicorn
- **ORM**: SQLModel (SQLAlchemy + Pydantic)
- **Database**: SQLite
- **File Storage**: Docker Volume (`/data/`)
- **Utilities**: 
  - python-multipart (파일 업로드)
  - python-dotenv (환경 변수 관리)
  - pytest (테스트)
  - httpx (HTTP 클라이언트)

### Architecture
```
Frontend (React) ← HTTP ↔ Backend (FastAPI) ← SQLite
                                          ↓
                                    File Storage
```

### 데이터 흐름
1. **도서 관리**: React Form → BookContext → Axios → FastAPI → SQLite
2. **이미지 업로드**: FormData → Axios (multipart) → FastAPI → `/data/covers/`
3. **노트 저장**: 노트 컴포넌트 → JSON 직렬화 → Axios → FastAPI → SQLite
4. **주문 익스포트**: OrdersPage → ordersApi.exportZip → FastAPI → ZIP 생성 → Blob 다운로드

---

## 5. AI 도구 사용 내역

| AI 도구 | 활용 내용 |
|---------|----------|
| **Claude Code (Haiku 4.5)** | 전체 풀스택 개발 담당: 프로젝트 초기 구조 설계, 백엔드 모델/라우터/서비스 로직 구현, React 컴포넌트 및 상태관리 구현, 표지 이미지 업로드(multipart), Textarea 기반 노트 편집, 날짜 필드 데이터베이스 스키마 동기화, 주문 시스템 노트→책 단위 변경, ZIP 익스포트 서비스 구현, Docker 설정 및 배포 구조, 버그 수정 및 기술 문제 해결 |
| **Claude Code (Sonnet 4.6)** | 파이프라인 최적화: 대규모 코드 리팩토링, 복잡한 마이그레이션 작업, 다중 파일 동시 수정, /ultrareview를 통한 코드 품질 검토 |
| **ChatGPT** | 이미지 생성: 웹서비스 로고 아이콘 및 favicon 이미지 생성 |
| **Google Gemini** | 문서 작성: 과제 안내문을 markdown 형식으로 변환, 이를 토대로 PRD(제품 요구사항) 문서 작성 및 Claude Code에 학습 제공 |

---

## 6. 설계 의도

### 서비스 아이디어

개인의 독서 활동을 기록하고, 그 기록들을 한 권의 책으로 만들어 소장할 수 있는 서비스입니다. 일상적인 독서 기록이 흩어지지 않고 물리적 형태의 자산으로 남을 수 있도록 기획했습니다.

### 확장 가능성

현재는 기본 독서 관리 기능에 집중하고 있지만, 향후 다음과 같은 기능 추가를 생각하고 있습니다:
- 사용자 인증 및 다중 사용자 지원
- 독서 통계 대시보드 (장르별 통계, 독서량 추이)
- 노트 내 검색 기능

### 시간이 더 있었다면 추가했을 기능

- 마크다운 에디터 지원
- 노트별 태그 및 분류 기능
- 사용자 간 서재 공유 및 추천 기능