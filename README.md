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
- **Image Handling**: Canvas API + Drag & Resize

### Backend
- **Framework**: FastAPI (Python)
- **ORM**: SQLModel (SQLAlchemy + Pydantic)
- **Database**: SQLite
- **File Storage**: Docker Volume (`/data/`)
- **Utilities**: python-multipart (파일 업로드)

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
| **Claude Code (Haiku 4.5)** | 전체 풀스택 개발 담당: 프로젝트 초기 구조 설계, 백엔드 모델/라우터/서비스 로직 구현, React 컴포넌트 및 상태관리 구현, 표지 이미지 업로드(multipart), React Flow 다이어그램, ContentEditable 텍스트 편집 기능, 날짜 필드 데이터베이스 스키마 동기화, 주문 시스템 노트→책 단위 변경, ZIP 익스포트 서비스 구현, Docker 설정 및 배포 구조, 버그 수정 및 기술 문제 해결 |
| **Claude Code (Sonnet 4.6)** | 파이프라인 최적화: 대규모 코드 리팩토링, 복잡한 마이그레이션 작업, 다중 파일 동시 수정, /ultrareview를 통한 코드 품질 검토 |

---

## 6. 설계 의도

### 서비스 기획 배경

**"독서 문화의 개인화와 아카이빙"**

이 서비스는 다음과 같은 관찰에서 출발했습니다:
1. 독서는 여전히 많은 사람들의 일상이지만, 개인의 독서 기록은 대부분 휘발성
2. 노션, 에버노트 같은 일반 노트 앱에서 독서 기록을 남기지만, 이를 "소장할 만한 물건"으로 만들고 싶은 욕구는 충족되지 않음
3. 포토북 서비스(인스타그램→포토북)는 성공했으나, 독서 기록에 특화된 서비스는 드문 상태

따라서 **"개인의 독서 활동을 기록하고, 그 기록을 책이라는 물리적 형태로 소장할 수 있는 서비스"**를 기획했습니다.

### 사업적 가능성

**Market Opportunity**
- 타겟: 월 1회 이상 독서하는 활동적인 독자층 (~연 3~5 주문 기대)
- 시장 규모: 한국 독서인구 약 700만 명 중 적극 독자층 200만 명
- 예상 구독/일회 결제 모델로 월 3~5억 원 규모 시장

**Business Model**
- 기본: Free (서비스 체험)
- Premium: 월 5,000원 (고급 에디터, 통계 대시보드)
- 주문형: 책 제작 시점에 인쇄비 + 마진 (1권당 15,000~25,000원)

**경쟁 우위**
1. 독서에 특화된 노트 에디터 (다양한 타입 지원)
2. 스위트북 같은 인쇄 파트너와의 통합으로 End-to-End 경험 제공
3. 개인화된 독서 통계 및 시각화

### UX/UI 설계 원칙
1. **간결함**: 불필요한 UI 요소 최소화, 핵심 기능에 집중
2. **한국어 지원**: 모든 텍스트와 날짜 포맷을 한국어로 제공
3. **즉시 사용성**: 로그인 없이 더미 데이터로 바로 사용 가능
4. **명확한 상태 표시**: 색상과 라벨로 현재 상태 직관적 표현

### 기술 설계 선택
1. **Context API**: Redux 없이 간단한 전역 상태 관리로 충분
2. **SQLModel**: 타입 안정성과 ORM 기능을 동시에 제공
3. **Tailwind CSS**: 빠른 개발 속도와 일관된 스타일 유지
4. **Docker Compose**: 개발 환경 재현성 및 배포 단순화
5. **Canvas API + 직접 구현**: 이미지 리사이징 및 원본 가로세로 비율 유지 로직

### 데이터 설계
1. **노트 콘텐츠**: JSON 형식으로 저장하여 다양한 타입 지원
2. **주문 항목**: position 필드로 책의 순서 관리
3. **파일 저장**: UUID 기반 파일명으로 중복 방지
4. **독서 기간**: start_date, end_date로 읽음 상태별 시간 추적

### 향후 개선 계획 (우선순위순)

**Phase 1: 사용자 경험 강화 (1-2주)**
1. 사용자 인증 및 다중 사용자 지원
2. 독서 통계 및 분석 대시보드 (연간 히트맵, 장르별 통계)
3. 노트 내 검색 기능 (전체 텍스트 검색)

**Phase 2: 콘텐츠 확장 (2-4주)**
1. Markdown 에디터 지원
2. 소셜 공유 기능 (개별 노트, 주문 공유)
3. 댓글 및 피드백 기능

**Phase 3: 플랫폼 확장 (1개월+)**
1. 모바일 앱 버전 (React Native)
2. 실제 스위트북 API 통합
3. 독서 커뮤니티 (다른 사용자 서재 방문, 추천)