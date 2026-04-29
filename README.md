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
- 노트 종류별 에디터 (감상, 인용구, 표, 다이어그램)
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

# Docker Compose 실행
docker-compose up

# 브라우저에서 접속
http://localhost:3000
```

서비스가 시작되면 더미 데이터가 자동으로 로드되어 로그인 없이 바로 사용할 수 있습니다.

### 포트 변경

기본 포트: 프론트엔드 3000, 백엔드 8000

포트를 변경해야 할 경우 `docker-compose.yml`을 수정하세요:

```yaml
services:
  frontend:
    ports:
      - "3000:5173"  # 3000을 원하는 포트로 변경 (왼쪽 값)
  
  backend:
    ports:
      - "8000:8000"  # 8000을 원하는 포트로 변경 (왼쪽 값)
```

### 주요 디렉터리 구조

```
book-review/
├── frontend/              # React 프론트엔드
│   ├── src/
│   │   ├── pages/        # 메인 페이지, 도서 상세 페이지
│   │   ├── components/   # 재사용 컴포넌트
│   │   ├── contexts/     # 상태 관리
│   │   └── lib/          # API 클라이언트
│   └── public/           # 로고, 파비콘
├── backend/              # FastAPI 백엔드
│   ├── app/
│   │   ├── models/       # SQLModel 데이터 모델
│   │   ├── routers/      # API 라우터
│   │   ├── services/     # 비즈니스 로직
│   │   └── seed.py       # 더미 데이터
│   └── data/             # 데이터베이스 & 파일 저장소
└── docker-compose.yml    # 컨테이너 오케스트레이션
```

## 3. 완성한 레벨

### Phase A: 기본 도서 관리 ✅
- 책 추가/삭제/조회
- 책 정보 편집 (제목, 저자, 카테고리, 페이지 수)
- 읽음 상태 변경 (to_read → reading → read)
- 별점 평가 (0.5 단위, reading/read 상태에서만)
- 페이지 진행률 바 표시
- 카테고리별 색상 및 오너먼트 자동 할당

### Phase B: 표지 이미지 업로드 ✅
- 책 추가/편집 시 표지 이미지 선택 (JPG, PNG, WebP, 최대 2MB)
- 이미지 미리보기
- 백엔드 파일 저장 및 DB URL 관리
- 저장 후에도 이미지 유지

### Phase C: 책 정렬 및 페이지네이션 ✅
- 정렬 옵션: 제목 가나다순, 최근 추가순, 별점순, 읽기 진행률순
- 페이지당 15권 페이지네이션
- 탭 필터링 (전체, 읽을 책, 읽는 중, 읽은 책)
- 제목/저자 검색
- Floating 책 추가 버튼

### Phase D: 독서노트 작성/편집 ✅
- 노트 추가 (타입, 날짜 선택)
- 감상 에디터 (자유 텍스트)
- 인용구 에디터 (텍스트 + 페이지 번호)
- 표 에디터 (행/열 추가, 데이터 입력)
- 다이어그램 에디터 (React Flow 기반, 노드-엣지)
  - 노드 추가/삭제
  - 더블클릭으로 텍스트 편집
  - Handle로 노드 간 연결
- 노트 목록 표시 및 삭제
- 별점 평가

### Phase E: 주문 관리 및 익스포트 ✅
- 주문 생성 (노트 1개 이상 선택 필수)
- 주문 상태 관리 (pending → processing → completed)
- 주문 목록 조회
- ZIP 파일 익스포트
  - order.json (주문 메타정보)
  - notes/ (선택된 노트들)
  - images/ (관련 도서 표지 이미지)
  - manifest.json (파일 인덱스 및 체크섬)

---

## 4. 기술 스택 및 아키텍처

### Frontend
- **Framework**: React 18 with TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router
- **HTTP Client**: Axios
- **Diagrams**: React Flow (노드-엣지 기반 다이어그램)

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

### Claude Code (Claude Haiku 4.5)
- **역할**: 전체 풀스택 개발 (기획, 구현, 디버깅)
- **활용 사항**:
  - 초기 프로젝트 구조 설계 및 백엔드 모델 정의
  - React 컴포넌트 구현 및 상태 관리
  - FastAPI 라우터 및 서비스 로직 작성
  - 다양한 기술 문제 해결:
    - React Flow 통합 및 Handle 이벤트 처리
    - 파일 업로드 (multipart/form-data)
    - 데이터 직렬화 (JSON, CSV)
    - Tailwind CSS 레이아웃 및 반응형 디자인
    - ContentEditable을 활용한 인라인 텍스트 편집
  - 테스트 및 버그 수정
  - Docker 설정 및 배포 구조

---

## 6. 설계 의도

### UX/UI 원칙
1. **간결함**: 불필요한 UI 요소 최소화, 핵심 기능에 집중
2. **한국어 지원**: 모든 텍스트와 날짜 포맷을 한국어로 제공
3. **즉시 사용성**: 로그인 없이 더미 데이터로 바로 사용 가능
4. **명확한 상태 표시**: 색상과 라벨로 현재 상태 직관적 표현

### 기술 설계 선택
1. **Context API**: Redux 없이 간단한 전역 상태 관리로 충분
2. **SQLModel**: 타입 안정성과 ORM 기능을 동시에 제공
3. **Tailwind CSS**: 빠른 개발 속도와 일관된 스타일 유지
4. **Docker Compose**: 개발 환경 재현성 및 배포 단순화
5. **React Flow**: 복잡한 다이어그램 로직을 라이브러리로 위임

### 데이터 설계
1. **노트 콘텐츠**: JSON 형식으로 저장하여 다양한 타입 지원
2. **주문 항목**: position 필드로 노트의 순서 관리
3. **파일 저장**: UUID 기반 파일명으로 중복 방지

### 향후 개선 가능 항목
1. 사용자 인증 및 다중 사용자 지원
2. 독서 통계 및 분석 대시보드
3. 소셜 공유 기능
4. 모바일 앱 버전
5. Markdown 에디터 지원
6. 서치 기능 개선 (전체 텍스트 검색)