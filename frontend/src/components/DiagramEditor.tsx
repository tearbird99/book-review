import { useState, useRef, useEffect, useCallback } from 'react'
import ReactFlow, {
  Node,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  Handle,
  Position,
} from 'reactflow'
import 'reactflow/dist/style.css'

// Handle: 점은 작게, hitArea는 크게
const handleStyles = `
  .react-flow__handle {
    width: 10px !important;
    height: 10px !important;
    border: 2px solid currentColor;
    background-color: white !important;
  }
  .react-flow__handle::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
  }
`

type Props = {
  initialData?: string
  onSave: (data: string) => void
}

// 노드 렌더링 컴포넌트
function DiagramNode({ data, isConnectable }: any) {
  const [label, setLabel] = useState(data.label || '새 항목')
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(label)
  const inputRef = useRef<HTMLInputElement>(null)
  const clickCountRef = useRef(0)
  const clickTimeoutRef = useRef<number | null>(null)

  const handleSaveEdit = useCallback(() => {
    const newLabel = editValue.trim() || '새 항목'
    setLabel(newLabel)
    setIsEditing(false)
    if (data.onLabelChange) {
      data.onLabelChange(newLabel)
    }
  }, [editValue, data])

  const handleCancel = () => {
    setIsEditing(false)
    setEditValue(label)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return
    e.stopPropagation()

    clickCountRef.current += 1

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current)
    }

    clickTimeoutRef.current = window.setTimeout(() => {
      clickCountRef.current = 0
    }, 300)

    if (clickCountRef.current === 2) {
      clickCountRef.current = 0
      setIsEditing(true)
      setEditValue(label)
    }
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 0)
    }
  }, [isEditing])

  return (
    <div
      className="rounded border-2 border-brass-2 bg-white px-4 py-2 shadow-md min-w-[120px]"
      onMouseDown={handleMouseDown}
    >
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={handleKeyDown}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="w-full font-korean-serif text-sm text-ink bg-white border-0 outline-none"
        />
      ) : (
        <div className="font-korean-serif text-sm text-ink cursor-text whitespace-nowrap">
          {label}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  )
}

export default function DiagramEditor({ initialData, onSave }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [nodeIdCounter, setNodeIdCounter] = useState(1)

  // 초기 데이터 로드
  useEffect(() => {
    if (initialData) {
      try {
        const parsed = JSON.parse(initialData)
        if (parsed.nodes && Array.isArray(parsed.nodes) && parsed.nodes.length > 0) {
          const loadedNodes = parsed.nodes.map((n: any) => ({
            ...n,
            data: {
              ...n.data,
              onLabelChange: (newLabel: string) => {
                setNodes((nds) =>
                  nds.map((node) =>
                    node.id === n.id
                      ? { ...node, data: { ...node.data, label: newLabel } }
                      : node
                  )
                )
              },
            },
          }))
          setNodes(loadedNodes)
        }
        if (parsed.edges && Array.isArray(parsed.edges) && parsed.edges.length > 0) {
          setEdges(parsed.edges)
        }
        if (parsed.nextId) setNodeIdCounter(parsed.nextId)
      } catch (e) {
        console.error('Failed to parse initial data:', e)
      }
    }
  }, [initialData, setNodes, setEdges])

  // 엣지 연결
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds))
    },
    [setEdges]
  )

  // 노드 추가
  const handleAddNode = () => {
    const newId = `node-${nodeIdCounter}`
    const newNode: Node = {
      id: newId,
      data: {
        label: '새 항목',
        onLabelChange: (newLabel: string) => {
          setNodes((nds) =>
            nds.map((n) =>
              n.id === newId ? { ...n, data: { ...n.data, label: newLabel } } : n
            )
          )
        },
      },
      position: {
        x: Math.random() * 300 + 100,
        y: Math.random() * 300 + 100,
      },
    }
    setNodes((nds) => [...nds, newNode])
    setNodeIdCounter(nodeIdCounter + 1)
  }

  // 선택된 노드 삭제
  const handleDeleteSelectedNodes = () => {
    const selectedNodes = nodes.filter((n) => n.selected)
    if (selectedNodes.length === 0) return

    const selectedIds = new Set(selectedNodes.map((n) => n.id))
    setNodes((nds) => nds.filter((n) => !n.selected))
    setEdges((eds) => eds.filter((e) => !selectedIds.has(e.source) && !selectedIds.has(e.target)))
  }

  // 저장
  const handleSave = () => {
    const cleanNodes = nodes.map(({ data, ...rest }) => ({
      ...rest,
      data: {
        label: data.label,
      },
    }))

    const data = {
      nodes: cleanNodes,
      edges,
      nextId: nodeIdCounter,
    }
    onSave(JSON.stringify(data))
  }

  return (
    <div className="flex flex-col gap-3">
      <style>{handleStyles}</style>
      {/* 컨트롤 버튼 */}
      <div className="flex gap-2">
        <button
          onClick={handleAddNode}
          className="rounded-sm border border-brass-2/25 bg-white/70 px-3 py-1.5 font-korean-serif text-xs transition-colors hover:border-brass-2/50 hover:bg-white"
        >
          + 항목 추가
        </button>
        <button
          onClick={handleDeleteSelectedNodes}
          className="rounded-sm border border-red-300 bg-red-50 px-3 py-1.5 font-korean-serif text-xs text-red-600 transition-colors hover:bg-red-100"
        >
          선택 삭제
        </button>
        <button
          onClick={handleSave}
          className="rounded-sm border border-brass-2/25 bg-brass-2/10 px-3 py-1.5 font-korean-serif text-xs text-brass-2 transition-colors hover:bg-brass-2/20"
        >
          저장
        </button>
      </div>

      {/* React Flow 캔버스 */}
      <div className="h-96 rounded-sm border border-brass-2/25 bg-white/50 overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={{
            default: DiagramNode,
          }}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      <p className="font-display text-xs text-ink-mute">
        💡 더블클릭으로 텍스트 편집 | 노드 위/아래 점에서 드래그해서 연결 | 노드 선택 후 '선택 삭제'로 제거
      </p>
    </div>
  )
}
