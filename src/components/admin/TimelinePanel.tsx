'use client'

import { useState, useTransition } from 'react'
import { EVENT_COLOR, type Timeline } from '@/lib/types'
import { createTimeline, deleteTimeline, toggleTimeline } from '@/app/admin/actions'
import Icon from './Icon'

function dday(end: string, today: string): { text: string; tone: string } {
  const diff = Math.round((Date.parse(end) - Date.parse(today)) / 86_400_000)
  if (diff < 0) return { text: `${Math.abs(diff)}일 지남`, tone: 'text-red-600' }
  if (diff === 0) return { text: 'D-DAY', tone: 'text-red-600 font-semibold' }
  return { text: `D-${diff}`, tone: diff <= 3 ? 'text-amber-600' : 'text-ink-muted' }
}

const md = (d: string) => `${Number(d.slice(5, 7))}/${Number(d.slice(8, 10))}`

/**
 * 스케줄 우측 패널. + 를 누르고 할 일과 마감일만 적으면
 * 오늘부터 마감일까지 달력에 띠가 그려진다.
 */
export default function TimelinePanel({
  timelines,
  todayIso,
  onChanged,
}: {
  timelines: Timeline[]
  todayIso: string
  onChanged: (list: Timeline[]) => void
}) {
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [endDate, setEndDate] = useState(todayIso)
  const [pending, startTransition] = useTransition()

  const submit = () => {
    if (!title.trim()) return
    startTransition(async () => {
      const list = await createTimeline(title, todayIso, endDate)
      setTitle('')
      setEndDate(todayIso)
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
          aria-label="타임라인 추가"
          className={`flex size-6 items-center justify-center rounded-md transition hover:bg-hover ${adding ? 'bg-hover text-ink' : 'text-ink-muted hover:text-ink'}`}
        >
          <Icon name="plus" className="size-4" />
        </button>
      </div>

      {adding && (
        <div className="animate-fade-up mb-3 flex flex-col gap-2 rounded-xl border border-line bg-surface p-3">
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="어떤 일을 하나요?"
            className="w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-brand"
          />
          <label className="flex items-center gap-2 text-xs text-ink-muted">
            마감일
            <input
              type="date"
              value={endDate}
              min={todayIso}
              onChange={e => setEndDate(e.target.value)}
              className="flex-1 rounded-lg border border-line bg-surface px-2 py-1.5 text-xs text-ink outline-none transition focus:border-brand"
            />
          </label>
          <button
            onClick={submit}
            disabled={pending || !title.trim()}
            className="inline-flex h-8 items-center justify-center rounded-lg bg-ink text-xs font-medium text-white transition hover:bg-black disabled:opacity-50"
          >
            오늘부터 띠 긋기
          </button>
        </div>
      )}

      {timelines.length === 0 && !adding && (
        <p className="rounded-xl border border-dashed border-line px-3 py-6 text-center text-xs leading-relaxed text-ink-muted">
          + 를 누르고 할 일을 적으면
          <br />
          오늘부터 마감일까지 달력에
          <br />
          띠가 그려집니다.
        </p>
      )}

      <ul className="flex min-h-0 flex-col gap-1 overflow-y-auto">
        {timelines.map(t => {
          const d = dday(t.end_date, todayIso)
          return (
            <li
              key={t.id}
              className={`group rounded-lg border border-line bg-surface px-2.5 py-2 transition hover:border-ink-muted/40 ${t.done ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-1.5">
                <span className={`size-2 shrink-0 rounded-full ${EVENT_COLOR[t.color]?.dot ?? EVENT_COLOR.blue.dot}`} />
                <span className={`min-w-0 flex-1 truncate text-xs font-medium text-ink ${t.done ? 'line-through' : ''}`}>
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
              <div className="mt-1 flex items-center gap-2 pl-3.5 text-[11px] tabular-nums">
                <span className="text-ink-muted">
                  {md(t.start_date)} ~ {md(t.end_date)}
                </span>
                {!t.done && <span className={d.tone}>{d.text}</span>}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
