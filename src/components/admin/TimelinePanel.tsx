'use client'

import { useState, useTransition } from 'react'
import { EVENT_COLOR, TIMELINE_STATUS, type Timeline, type TimelineStatus } from '@/lib/types'
import { createTimeline, deleteTimeline, setTimelineStatus, toggleTimeline } from '@/app/admin/actions'
import Icon from './Icon'

/** 담당자 태그 칩 색. 서버(createTimeline)와 같은 순서로 돌아간다. */
const TAG_COLORS = ['purple', 'blue', 'green', 'amber', 'red'] as const

/** 우선순위 순서. 항목의 상태 칩을 누르면 이 순서로 돌아가며 바뀐다(마지막엔 해제). */
const STATUS_ORDER: TimelineStatus[] = ['urgent', 'in_progress', 'maintenance', 'hold']

function tagColor(admins: string[], name: string | null): (typeof TAG_COLORS)[number] | 'gray' {
  const i = name ? admins.indexOf(name) : -1
  return i === -1 ? 'gray' : TAG_COLORS[i % TAG_COLORS.length]
}

function nextStatus(current: TimelineStatus | null): TimelineStatus | null {
  if (current === null) return STATUS_ORDER[0]
  const i = STATUS_ORDER.indexOf(current)
  return i === STATUS_ORDER.length - 1 ? null : STATUS_ORDER[i + 1]
}

/**
 * 스케줄 우측 패널. + 를 누르고 할 일을 적은 뒤
 * 담당자 태그(정훈·채은공듀…)와 상태 태그(긴급·진행중·유지보수·보류)를 붙인다.
 * 긴급이 맨 위, 보류가 맨 아래로 정렬된다.
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
  const [pending, startTransition] = useTransition()

  const submit = () => {
    if (!title.trim()) return
    startTransition(async () => {
      const list = await createTimeline(title, assignee, status)
      setTitle('')
      setStatus(null)
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
          <div className="flex flex-wrap gap-1.5">
            {admins.map(name => {
              const on = assignee === name
              const color = tagColor(admins, name)
              return (
                <button
                  key={name}
                  onClick={() => setAssignee(on ? null : name)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                    on ? EVENT_COLOR[color].chip : 'border border-line text-ink-muted hover:bg-hover'
                  }`}
                >
                  {name}
                </button>
              )
            })}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_ORDER.map(s => {
              const on = status === s
              return (
                <button
                  key={s}
                  onClick={() => setStatus(on ? null : s)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                    on ? TIMELINE_STATUS[s].chip : 'border border-line text-ink-muted hover:bg-hover'
                  }`}
                >
                  {TIMELINE_STATUS[s].label}
                </button>
              )
            })}
          </div>
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

      <ul className="flex min-h-0 flex-col gap-1 overflow-y-auto">
        {timelines.map(t => (
          <li
            key={t.id}
            className={`group rounded-lg border border-line bg-surface px-2.5 py-2 transition hover:border-ink-muted/40 ${t.done ? 'opacity-50' : ''}`}
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
            <div className="mt-1.5 flex flex-wrap items-center gap-1">
              {/* 상태 칩. 누르면 긴급→진행중→유지보수→보류→해제 순으로 바뀐다. */}
              <button
                onClick={() => startTransition(async () => onChanged(await setTimelineStatus(t.id, nextStatus(t.status))))}
                title="누르면 상태가 바뀝니다"
                className={`rounded-full px-2 py-0.5 text-[11px] font-medium transition hover:brightness-95 ${
                  t.status
                    ? TIMELINE_STATUS[t.status].chip
                    : 'border border-dashed border-line text-ink-muted opacity-0 group-hover:opacity-100'
                }`}
              >
                {t.status ? TIMELINE_STATUS[t.status].label : '+ 상태'}
              </button>
              {t.assignee && (
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${EVENT_COLOR[t.color]?.chip ?? EVENT_COLOR.gray.chip}`}>
                  {t.assignee}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
