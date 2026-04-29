import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooks } from '../contexts/BookContext'
import { ordersApi, notesApi } from '../lib/api'
import type { ApiOrder, ApiNote } from '../types/api'

export default function OrdersPage() {
  const navigate = useNavigate()
  const { books } = useBooks()
  const [orders, setOrders] = useState<ApiOrder[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedNotes, setSelectedNotes] = useState<Set<number>>(new Set())
  const [orderTitle, setOrderTitle] = useState('')
  const [availableNotes, setAvailableNotes] = useState<(ApiNote & { bookTitle: string })[]>([])

  // 주문 목록 조회
  const loadOrders = async () => {
    try {
      const response = await ordersApi.getAll()
      setOrders(response.data)
    } catch (error) {
      console.error('주문 조회 실패:', error)
    }
  }

  // 생성 모달 열기
  const handleOpenCreateModal = async () => {
    setIsCreateModalOpen(true)
    setSelectedNotes(new Set())
    setOrderTitle('')

    // 모든 책의 노트 조회
    try {
      const allNotes: (ApiNote & { bookTitle: string })[] = []
      for (const book of books) {
        const response = await notesApi.getByBookId(book.id)
        response.data.forEach((note) => {
          allNotes.push({
            ...note,
            bookTitle: book.title,
          })
        })
      }
      setAvailableNotes(allNotes)
    } catch (error) {
      console.error('노트 조회 실패:', error)
    }
  }

  // 주문 생성
  const handleCreateOrder = async () => {
    if (!orderTitle.trim()) {
      alert('주문 제목을 입력하세요')
      return
    }
    if (selectedNotes.size === 0) {
      alert('최소 1개의 노트를 선택하세요')
      return
    }

    setIsLoading(true)
    try {
      await ordersApi.create({
        title: orderTitle,
        note_ids: Array.from(selectedNotes),
        status: 'pending',
      })
      await loadOrders()
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('주문 생성 실패:', error)
      alert('주문 생성에 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  // 주문 상태 변경
  const handleUpdateStatus = async (orderId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'pending' ? 'processing' : 'completed'
    setIsLoading(true)
    try {
      await ordersApi.updateStatus(orderId, nextStatus)
      await loadOrders()
    } catch (error) {
      console.error('상태 변경 실패:', error)
      alert('상태 변경에 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  // ZIP 다운로드
  const handleDownloadZip = async (orderId: number, orderTitle: string) => {
    try {
      const response = await ordersApi.exportZip(orderId)
      const url = window.URL.createObjectURL(response.data)
      const a = document.createElement('a')
      a.href = url
      a.download = `${orderTitle}_${orderId}.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('다운로드 실패:', error)
      alert('ZIP 다운로드에 실패했습니다')
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: '대기중', color: 'bg-yellow-100 text-yellow-800' },
      processing: { label: '처리중', color: 'bg-blue-100 text-blue-800' },
      completed: { label: '완료', color: 'bg-green-100 text-green-800' },
    }
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="sticky top-0 z-30 border-b border-brass-2/15 bg-white/95 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/')}
              className="mb-2 text-sm text-ink-mute hover:text-ink"
            >
              ← 서재로 돌아가기
            </button>
            <h1 className="font-korean-serif text-2xl font-semibold text-ink">주문 관리</h1>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="rounded-sm bg-brass-2 px-4 py-2 font-korean-serif text-sm font-medium text-white transition-colors hover:bg-brass-2/90"
          >
            + 새 주문
          </button>
        </div>
      </div>

      {/* 내용 */}
      <div className="px-6 py-6">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="font-korean-serif text-lg text-ink-mute">주문이 없습니다</p>
            <p className="mt-1 text-sm text-ink-mute">새 주문을 생성해보세요</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = getStatusLabel(order.status)
              return (
                <div
                  key={order.id}
                  className="flex flex-col gap-4 rounded-sm border border-brass-2/15 bg-white/50 p-5 shadow-[0_2px_12px_-4px_rgba(31,22,51,0.08)] transition-all hover:border-brass-2/30"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-korean-serif text-lg font-semibold text-ink">
                        {order.title}
                      </h3>
                      <p className="mt-1 font-display text-xs text-ink-mute">
                        주문 ID: {order.id} | {new Date(order.created_at).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    <span className={`rounded-sm px-3 py-1 font-korean-serif text-xs font-medium ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {order.status !== 'completed' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, order.status)}
                        disabled={isLoading}
                        className="rounded-sm border border-brass-2/25 px-3 py-2 font-korean-serif text-xs text-brass-2 transition-colors hover:bg-brass-2/10 disabled:opacity-50"
                      >
                        상태 변경
                      </button>
                    )}
                    <button
                      onClick={() => handleDownloadZip(order.id, order.title)}
                      disabled={isLoading}
                      className="rounded-sm bg-brass-2/10 px-3 py-2 font-korean-serif text-xs text-brass-2 transition-colors hover:bg-brass-2/20 disabled:opacity-50"
                    >
                      📥 ZIP 다운로드
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 주문 생성 모달 */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsCreateModalOpen(false)} />
          <div className="relative max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-2xl">
            <div className="sticky top-0 border-b border-brass-2/15 bg-white px-6 py-4">
              <h2 className="font-korean-serif text-lg font-semibold text-ink">새 주문 생성</h2>
            </div>

            <div className="px-6 py-6">
              {/* 주문 제목 */}
              <div className="mb-6">
                <label className="block font-display text-xs uppercase tracking-[0.2em] text-ink-mute mb-2">
                  주문 제목
                </label>
                <input
                  type="text"
                  value={orderTitle}
                  onChange={(e) => setOrderTitle(e.target.value)}
                  placeholder="예: 2024년 독서 기록"
                  className="w-full rounded-sm border border-brass-2/25 bg-white/70 px-3 py-2 font-korean-serif text-sm focus:border-brass-2 focus:outline-none"
                />
              </div>

              {/* 노트 선택 */}
              <div className="mb-6">
                <label className="block font-display text-xs uppercase tracking-[0.2em] text-ink-mute mb-3">
                  포함할 노트 ({selectedNotes.size}개 선택됨)
                </label>
                <div className="space-y-2">
                  {availableNotes.length === 0 ? (
                    <p className="text-sm text-ink-mute">작성된 노트가 없습니다</p>
                  ) : (
                    availableNotes.map((note) => (
                      <label
                        key={note.id}
                        className="flex cursor-pointer items-center gap-3 rounded-sm border border-brass-2/15 bg-white/50 p-3 transition-colors hover:bg-brass-2/5"
                      >
                        <input
                          type="checkbox"
                          checked={selectedNotes.has(note.id)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedNotes)
                            if (e.target.checked) {
                              newSelected.add(note.id)
                            } else {
                              newSelected.delete(note.id)
                            }
                            setSelectedNotes(newSelected)
                          }}
                          className="cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-korean-serif text-sm text-ink">{note.bookTitle}</p>
                          <p className="truncate font-korean-serif text-xs text-ink-mute">
                            {note.content.substring(0, 100)}
                          </p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 rounded-sm border border-brass-2/25 px-4 py-3 font-korean-serif text-sm font-medium text-ink-mute transition-colors hover:border-brass-2/50"
                >
                  취소
                </button>
                <button
                  onClick={handleCreateOrder}
                  disabled={isLoading}
                  className="flex-1 rounded-sm bg-brass-2 px-4 py-3 font-korean-serif text-sm font-medium text-white transition-colors hover:bg-brass-2/90 disabled:opacity-50"
                >
                  {isLoading ? '생성 중...' : '주문 생성'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
