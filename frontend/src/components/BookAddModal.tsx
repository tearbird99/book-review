import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooks, type BookFormData, type ReadStatus } from '../contexts/BookContext'

const CATEGORIES = ['소설', '과학', '철학', '동화']

// 책 추가 폼의 지역 상태 타입 (폼 입력용)
type BookAddFormData = {
  title: string
  author: string
  total_pages: number
  category: string
  custom_category?: string
  read_status: ReadStatus
  current_page?: number
  start_date?: string
  end_date?: string
  rating?: number
}

type Props = {
  isOpen: boolean
  onClose: () => void
  defaultStatus?: ReadStatus
}

// 책 추가 팝업: 상태 선택에 따라 조건부 필드 표시
export default function BookAddModal({ isOpen, onClose, defaultStatus = 'to_read' }: Props) {
  const navigate = useNavigate()
  const { addBook } = useBooks()

  // 폼 상태
  const [form, setForm] = useState<BookAddFormData>({
    title: '',
    author: '',
    total_pages: 0,
    category: '소설',
    read_status: defaultStatus,
  })
  const [categoryMode, setCategoryMode] = useState<'select' | 'custom'>('select')
  const [error, setError] = useState<string>('')

  // 모달이 열릴 때마다 폼을 defaultStatus로 리셋
  useEffect(() => {
    if (isOpen) {
      setForm({
        title: '',
        author: '',
        total_pages: 0,
        category: '소설',
        read_status: defaultStatus,
      })
      setError('')
      setCategoryMode('select')
    }
  }, [isOpen, defaultStatus])

  // 숫자 필드는 Number로 변환
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'total_pages' || name === 'current_page' ? Number(value) : value,
    }))
  }

  // 읽기 상태 변경: 상태별 추가 필드 초기화
  const handleStatusChange = (read_status: ReadStatus) => {
    setForm((prev) => ({
      ...prev,
      read_status,
      current_page: undefined,
      start_date: undefined,
      end_date: undefined,
      rating: undefined,
    }))
  }

  // 폼 제출: 검증 → 책 생성 → 상세 페이지 이동
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 필수 필드 검증
    if (!form.title.trim()) {
      setError('제목을 입력해주세요')
      return
    }
    if (!form.author.trim()) {
      setError('저자를 입력해주세요')
      return
    }
    if (form.total_pages <= 0) {
      setError('전체 페이지 수를 입력해주세요')
      return
    }

    const finalCategory = form.custom_category || form.category
    if (!finalCategory.trim()) {
      setError('장르를 선택해주세요')
      return
    }

    // 읽는 중/읽은 책: 추가 필수 필드 검증
    if (form.read_status !== 'to_read') {
      if (!form.current_page || form.current_page < 0) {
        setError('읽은 페이지를 입력해주세요')
        return
      }
      if (!form.start_date) {
        setError('독서 시작 날짜를 입력해주세요')
        return
      }
      if (form.read_status === 'read' && !form.end_date) {
        setError('독서 종료 날짜를 입력해주세요')
        return
      }
    }

    // 최종 제출 데이터 구성
    const submitData: BookFormData = {
      title: form.title,
      author: form.author,
      total_pages: form.total_pages,
      category: form.custom_category || form.category,
      custom_category: form.custom_category,
      read_status: form.read_status,
      current_page: form.current_page,
      start_date: form.start_date,
      end_date: form.end_date,
      rating: form.rating,
    }

    // 책 생성 후 상세 페이지로 이동
    try {
      const { bookId } = await addBook(submitData)
      onClose()
      navigate(`/books/${bookId}`)
    } catch (err) {
      setError('책 추가 중 오류가 발생했습니다')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* 모달 */}
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-2xl" style={{ maxHeight: '90vh' }}>
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-ink-mute transition-colors hover:bg-brass-2/10 hover:text-brass-2"
        >
          <XIcon />
        </button>

        {/* 컨텐츠 (스크롤 가능) */}
        <div className="flex flex-col overflow-y-auto" style={{ maxHeight: '90vh' }}>
          <div className="px-6 pt-6 pb-6">
            <h2 className="font-korean-serif text-lg font-semibold text-ink">새 책 추가하기</h2>

            {error && (
              <div className="mt-4 rounded-sm border border-red-300 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* 공통 입력: 제목, 저자, 페이지 */}
              <div className="space-y-4">
                <FormGroup label="제목" required>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    className="w-full rounded-sm border border-brass-2/25 bg-white/70 px-3 py-2 font-korean-serif text-sm focus:border-brass-2 focus:outline-none"
                    placeholder="책 제목"
                  />
                </FormGroup>

                <FormGroup label="저자" required>
                  <input
                    type="text"
                    name="author"
                    value={form.author}
                    onChange={handleInputChange}
                    className="w-full rounded-sm border border-brass-2/25 bg-white/70 px-3 py-2 font-korean-serif text-sm focus:border-brass-2 focus:outline-none"
                    placeholder="저자 이름"
                  />
                </FormGroup>

                <FormGroup label="전체 페이지" required>
                  <input
                    type="number"
                    name="total_pages"
                    value={form.total_pages || ''}
                    onChange={handleInputChange}
                    className="w-full rounded-sm border border-brass-2/25 bg-white/70 px-3 py-2 font-korean-serif text-sm focus:border-brass-2 focus:outline-none"
                    placeholder="페이지 수"
                    min="1"
                  />
                </FormGroup>

                {/* 장르 */}
                <FormGroup label="장르" required>
                  <div className="space-y-2">
                    {categoryMode === 'select' ? (
                      <>
                        <select
                          name="category"
                          value={form.category}
                          onChange={handleInputChange}
                          className="w-full rounded-sm border border-brass-2/25 bg-white/70 px-3 py-2 font-korean-serif text-sm focus:border-brass-2 focus:outline-none"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                          <option value="">기타 (직접 입력)</option>
                        </select>
                        {form.category === '' && (
                          <button
                            type="button"
                            onClick={() => setCategoryMode('custom')}
                            className="text-xs text-brass-2 hover:underline"
                          >
                            직접 입력하기
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <input
                          type="text"
                          name="custom_category"
                          value={form.custom_category || ''}
                          onChange={handleInputChange}
                          className="w-full rounded-sm border border-brass-2/25 bg-white/70 px-3 py-2 font-korean-serif text-sm focus:border-brass-2 focus:outline-none"
                          placeholder="카테고리"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setCategoryMode('select')
                            setForm((prev) => ({ ...prev, custom_category: undefined }))
                          }}
                          className="text-xs text-brass-2 hover:underline"
                        >
                          목록에서 선택하기
                        </button>
                      </>
                    )}
                  </div>
                </FormGroup>
              </div>

              {/* 구분선 */}
              <div className="h-px bg-brass-2/15" />

              {/* 읽기 상태 선택 */}
              <FormGroup label="읽기 상태" required>
                <div className="grid grid-cols-3 gap-2">
                  {(['to_read', 'reading', 'read'] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleStatusChange(status)}
                      className={`rounded-sm border-2 px-3 py-2 text-xs font-korean-serif font-medium transition-all ${
                        form.read_status === status
                          ? 'border-brass-2 bg-brass-2/10 text-brass-2'
                          : 'border-brass-2/25 bg-white/50 text-ink-mute hover:border-brass-2/50'
                      }`}
                    >
                      {statusLabel(status)}
                    </button>
                  ))}
                </div>
              </FormGroup>

              {/* 조건부 입력: 읽는 중 / 읽은 책 */}
              {(form.read_status === 'reading' || form.read_status === 'read') && (
                <div className="space-y-4 rounded-sm bg-brass-2/5 p-4">
                  <FormGroup label="읽은 페이지" required>
                    <input
                      type="number"
                      name="current_page"
                      value={form.current_page || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-sm border border-brass-2/25 bg-white/70 px-3 py-2 font-korean-serif text-sm focus:border-brass-2 focus:outline-none"
                      placeholder="읽은 페이지"
                      min="0"
                      max={form.total_pages || undefined}
                    />
                  </FormGroup>

                  <FormGroup label="독서 시작 날짜" required>
                    <input
                      type="date"
                      name="start_date"
                      value={form.start_date || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-sm border border-brass-2/25 bg-white/70 px-3 py-2 font-korean-serif text-sm focus:border-brass-2 focus:outline-none"
                    />
                    <p className="mt-2 text-xs text-ink-mute">(캘린더 디자인은 추후 추가)</p>
                  </FormGroup>

                  {form.read_status === 'read' && (
                    <FormGroup label="독서 종료 날짜" required>
                      <input
                        type="date"
                        name="end_date"
                        value={form.end_date || ''}
                        onChange={handleInputChange}
                        className="w-full rounded-sm border border-brass-2/25 bg-white/70 px-3 py-2 font-korean-serif text-sm focus:border-brass-2 focus:outline-none"
                      />
                    </FormGroup>
                  )}

                  <FormGroup label="별점" required>
                    <StarRating
                      value={form.rating || 0}
                      onChange={(rating) => setForm((prev) => ({ ...prev, rating }))}
                    />
                  </FormGroup>
                </div>
              )}

              {/* 읽을 책일 때 */}
              {form.read_status === 'to_read' && (
                <p className="rounded-sm bg-brass-2/5 p-3 text-xs text-ink-soft">
                  추가 정보 없이 책이 서재에 등록됩니다.
                </p>
              )}

              {/* 버튼 */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-sm border border-brass-2/25 px-4 py-3 font-korean-serif text-sm font-medium text-ink-mute transition-colors hover:border-brass-2/50 hover:text-ink-soft"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-sm bg-brass-2 px-4 py-3 font-korean-serif text-sm font-medium text-white transition-colors hover:bg-brass-2/90"
                >
                  추가하기
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// 별점 평가 컴포넌트 (0.5 단위로 선택 가능)
function StarRating({ value, onChange }: { value: number; onChange: (val: number) => void }) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)

  // 별의 왼쪽/오른쪽 절반으로 0.5 단위 선택
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>, starIndex: number) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const isLeftHalf = x < rect.width / 2
    const rating = starIndex + (isLeftHalf ? 0.5 : 1)
    setHoveredRating(rating)
  }

  // 별 클릭 시 별점 저장
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, starIndex: number) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const isLeftHalf = x < rect.width / 2
    const rating = starIndex + (isLeftHalf ? 0.5 : 1)
    onChange(rating)
  }

  // 마우스 호버 시 미리보기, 아니면 저장된 값 표시
  const displayRating = hoveredRating !== null ? hoveredRating : value

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <button
            key={i}
            type="button"
            onMouseMove={(e) => handleMouseMove(e, i)}
            onClick={(e) => handleClick(e, i)}
            onMouseLeave={() => setHoveredRating(null)}
            className="relative cursor-pointer"
          >
            {/* 배경 별 (회색) */}
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-gray-300"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>

            {/* 채워진 별 (오버레이) */}
            <div
              className="absolute left-0 top-0 overflow-hidden transition-all"
              style={{
                width: `${Math.min(Math.max(displayRating - i, 0), 1) * 36}px`,
              }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-brass-2"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {displayRating > 0 && (
        <p className="text-sm text-ink-soft font-korean-serif">
          {'★'.repeat(Math.floor(displayRating))}
          {displayRating % 1 !== 0 ? '⯨' : ''}
          {'☆'.repeat(5 - Math.ceil(displayRating))} ({displayRating}/5)
        </p>
      )}
    </div>
  )
}

// 폼 필드 래퍼: 라벨 + 필수 표시
function FormGroup({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block font-display text-xs uppercase tracking-[0.2em] text-ink-mute">
        {label}
        {required && <span className="text-brass-2">*</span>}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  )
}

// 읽기 상태를 한글 라벨로 변환
function statusLabel(status: ReadStatus): string {
  const map: Record<ReadStatus, string> = {
    to_read: '읽을 책',
    reading: '읽는 중',
    read: '읽은 책',
  }
  return map[status]
}

// 닫기 버튼 아이콘
function XIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6l-12 12M6 6l12 12" />
    </svg>
  )
}
