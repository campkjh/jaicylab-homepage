'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { EVENT_COLOR, TIMELINE_STATUS, type Timeline, type TimelineStatus } from '@/lib/types'
import {
  createTimeline,
  deleteTimeline,
  setTimelineAssignee,
  setTimelineStatus,
  toggleTimeline,
} from '@/app/admin/actions'
import Icon from './Icon'

/** 담당자 태그 칩 색. 서버(createTimeline)와 같은 순서로 돌아간다. */
const TAG_COLORS = ['purple', 'blue', 'green', 'amber', 'red'] as const

/** 우선순위 순서. 긴급이 맨 위, 보류가 맨 아래로 정렬된다. */
const STATUS_ORDER: TimelineStatus[] = ['urgent', 'in_progress', 'maintenance', 'hold']

function tagColor(admins: string[], name: string | null): (typeof TAG_COLORS)[number] | 'gray' {
  const i = name ? admins.indexOf(name) : -1
  return i === -1 ? 'gray' : TAG_COLORS[i % TAG_COLORS.length]
}

/** 담당자·상태 칩을 고르는 리스트. 추가 폼과 항목 수정 툴팁이 같이 쓴다. */
function TagPicker({
  admins,
  assignee,
  status,
  onAssignee,
  onStatus,
}: {
  admins: string[]
  assignee: string | null
  status: TimelineStatus | null
  onAssignee: (name: string | null) => void
  onStatus: (s: TimelineStatus | null) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <div className="mb-1 text-[10px] font-medium text-ink-muted">담당자</div>
        <div className="flex flex-wrap gap-1.5">
          {admins.map(name => {
            const on = assignee === name
            const color = tagColor(admins, name)
            return (
              <button
                key={name}
                onClick={() => onAssignee(on ? null : name)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                  on ? EVENT_COLOR[color].chip : 'border border-line bg-surface text-ink-muted hover:bg-hover'
                }`}
              >
                {name}
              </button>
            )
          })}
        </div>
      </div>
      <div>
        <div className="mb-1 text-[10px] font-medium text-ink-muted">상태</div>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_ORDER.map(s => {
            const on = status === s
            return (
              <button
                key={s}
                onClick={() => onStatus(on ? null : s)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                  on ? TIMELINE_STATUS[s].chip : 'border border-line bg-surface text-ink-muted hover:bg-hover'
                }`}
              >
                {TIMELINE_STATUS[s].label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/**
 * 스케줄 우측 패널. + 를 누르고 할 일을 적은 뒤 태그를 골라 붙인다.
 * 항목의 태그를 누르면 툴팁이 떠서 담당자·상태를 바로 바꿀 수 있다.
 */
export default function TimelinePanel({
  timelines,
  admins,
  onChanged,
}: {
  timelines: Timeline[]
  admins: string[]
  onChanged: (list: Timeline[]) => void
}) {
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [assignee, setAssignee] = useState<string | null>(null)
  const [status, setStatus] = useState<TimelineStatus | null>(null)
  const [tagsOpen, setTagsOpen] = useState(false)
  /** 태그 수정 툴팁이 열려 있는 항목 id */
  const [editingId, setEditingId] = useState<number | null>(null)
  const [pending, startTransition] = useTransition()
  const listRef = useRef<HTMLUListElement>(null)

  // 툴팁 바깥을 누르면 닫는다.
  useEffect(() => {
    if (editingId == null) return
    const onDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-tag-popover], [data-tag-trigger]')) setEditingId(null)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [editingId])

  const submit = () => {
    if (!title.trim()) return
    startTransition(async () => {
      const list = await createTimeline(title, assignee, status)
      setTitle('')
      setStatus(null)
      setTagsOpen(false)
      setAdding(false)
      onChanged(list)
    })
  }

  return (
    <div className="flex min-h-0 flex-col">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[13px] font-semibold text-ink">타임라인</h2>
        <button
          onClick={() => setAdding(v => !v)}
          aria-label="할 일 추가"
          className={`flex size-6 items-center justify-center rounded-md transition hover:bg-hover ${adding ? 'bg-hover text-ink' : 'text-ink-muted hover:text-ink'}`}
        >
          <Icon name="plus" className="size-4" />
        </button>
      </div>

      {adding && (
        <div className="animate-fade-up mb-3 flex flex-col gap-2.5 rounded-xl border border-line bg-surface p-3">
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="어떤 일을 하나요?"
            className="w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-brand"
          />
          {/* 태그 선택: 누르면 리스트가 펼쳐지고, 고른 태그가 버튼에 표시된다 */}
          <button
            onClick={() => setTagsOpen(v => !v)}
            className={`flex flex-wrap items-center gap-1.5 rounded-lg border px-2 py-1.5 text-left text-xs transition hover:bg-hover ${tagsOpen ? 'border-brand' : 'border-line'}`}
          >
            {assignee || status ? (
              <>
                {assignee && (
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${EVENT_COLOR[tagColor(admins, assignee)].chip}`}>
                    {assignee}
                  </span>
                )}
                {status && (
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${TIMELINE_STATUS[status].chip}`}>
                    {TIMELINE_STATUS[status].label}
                  </span>
                )}
              </>
            ) : (
              <span className="text-ink-muted">태그 선택</span>
            )}
            <Icon name="arrowRight" className={`ml-auto size-3 shrink-0 text-ink-muted transition-transform ${tagsOpen ? 'rotate-90' : ''}`} />
          </button>

          {tagsOpen && (
            <div className="animate-fade-up rounded-lg border border-line bg-canvas/50 p-2.5">
              <TagPicker admins={admins} assignee={assignee} status={status} onAssignee={setAssignee} onStatus={setStatus} />
            </div>
          )}

          <button
            onClick={submit}
            disabled={pending || !title.trim()}
            className="inline-flex h-8 items-center justify-center rounded-lg bg-ink text-xs font-medium text-white transition hover:bg-black disabled:opacity-50"
          >
            추가
          </button>
        </div>
      )}

      {timelines.length === 0 && !adding && (
        <p className="rounded-xl border border-dashed border-line px-3 py-6 text-center text-xs leading-relaxed text-ink-muted">
          + 를 누르고 할 일을 적은 뒤
          <br />
          담당자·상태 태그를 붙이세요.
        </p>
      )}

      <ul ref={listRef} className="flex min-h-0 flex-col gap-1 overflow-y-auto">
        {timelines.map(t => (
          <li
            key={t.id}
            className={`group relative rounded-lg border border-line bg-surface px-2.5 py-2 transition hover:border-ink-muted/40 ${t.done ? 'opacity-50' : ''}`}
          >
            <div className="flex items-start gap-1.5">
              <span className={`min-w-0 flex-1 text-xs font-medium break-keep text-ink ${t.done ? 'line-through' : ''}`}>
                {t.title}
              </span>
              <button
                onClick={() => startTransition(async () => onChanged(await toggleTimeline(t.id)))}
                aria-label={t.done ? '완료 취소' : '완료 처리'}
                className="shrink-0 text-ink-muted opacity-0 transition group-hover:opacity-100 hover:text-brand"
              >
                <Icon name={t.done ? 'checkCircle' : 'checkCircleLine'} className="size-3.5" />
              </button>
              <button
                onClick={() => startTransition(async () => onChanged(await deleteTimeline(t.id)))}
                aria-label="삭제"
                className="shrink-0 text-ink-muted opacity-0 transition group-hover:opacity-100 hover:text-red-600"
              >
                <Icon name="bin" className="size-3.5" />
              </button>
            </div>

            {/* 태그 줄: 누르면 수정 툴팁이 뜬다. 이름(담당자)이 항상 왼쪽 */}
            <button
              data-tag-trigger
              onClick={() => setEditingId(v => (v === t.id ? null : t.id))}
              title="태그 수정"
              className="mt-1.5 flex flex-wrap items-center gap-1"
            >
              {t.assignee && (
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${EVENT_COLOR[t.color]?.chip ?? EVENT_COLOR.gray.chip}`}>
                  {t.assignee}
                </span>
              )}
              {t.status && (
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${TIMELINE_STATUS[t.status].chip}`}>
                  {TIMELINE_STATUS[t.status].label}
                </span>
              )}
              {!t.assignee && !t.status && (
                <span className="rounded-full border border-dashed border-line px-2 py-0.5 text-[11px] text-ink-muted opacity-0 transition group-hover:opacity-100">
                  + 태그
                </span>
              )}
            </button>

            {/* 태그 수정 툴팁 */}
            {editingId === t.id && (
              <div
                data-tag-popover
                className="animate-fade-up absolute inset-x-1 top-full z-20 mt-1 rounded-xl border border-line bg-surface p-2.5 shadow-[0_8px_24px_-8px_rgba(15,15,15,0.25)]"
              >
                <TagPicker
                  admins={admins}
                  assignee={t.assignee}
                  status={t.status}
                  onAssignee={name => startTransition(async () => onChanged(await setTimelineAssignee(t.id, name)))}
                  onStatus={s => startTransition(async () => onChanged(await setTimelineStatus(t.id, s)))}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
