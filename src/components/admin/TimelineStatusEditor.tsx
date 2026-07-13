'use client'

import { useState } from 'react'
import Icon from './Icon'
import { EVENT_COLOR, type EventColor, type TimelineStatusDef } from '@/lib/types'
import {
  createTimelineStatus,
  deleteTimelineStatus,
  moveTimelineStatus,
  updateTimelineStatus,
} from '@/app/admin/actions'
import { Button, Input } from './ui'

const COLORS = Object.keys(EVENT_COLOR) as EventColor[]

function ColorDots({ value, onChange }: { value: EventColor; onChange: (c: EventColor) => void }) {
  return (
    <div className="flex shrink-0 gap-1.5">
      {COLORS.map(c => (
        <button
          key={c}
          type="button"
          aria-label={EVENT_COLOR[c].label}
          aria-pressed={value === c}
          onClick={() => onChange(c)}
          className={`size-5 rounded-full transition ${EVENT_COLOR[c].dot} ${
            value === c ? 'ring-2 ring-ink ring-offset-2' : 'opacity-60 hover:opacity-100'
          }`}
        />
      ))}
    </div>
  )
}

/** 완료 태그 토글. 켜면 그 태그가 붙은 할 일은 체크 완료·다음 날 지난 기록으로 넘어간다. */
function DoneToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      title="완료 태그로 사용"
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-medium transition ${
        value ? 'border-transparent bg-brand text-white' : 'border-line bg-surface text-ink-muted hover:bg-hover'
      }`}
    >
      <Icon name="checkCircle" className="size-3.5" />
      완료
    </button>
  )
}

function StatusRow({ status, usage, first, last }: { status: TimelineStatusDef; usage: number; first: boolean; last: boolean }) {
  const [color, setColor] = useState<EventColor>(status.color)
  const [isDone, setIsDone] = useState(status.is_done)

  return (
    <li className="group flex items-center gap-2 px-4 py-2.5">
      <div className="flex shrink-0 flex-col">
        <form action={moveTimelineStatus}>
          <input type="hidden" name="id" value={status.id} />
          <input type="hidden" name="dir" value="up" />
          <button
            type="submit"
            disabled={first}
            aria-label="위로"
            className="flex size-4 items-center justify-center text-ink-muted transition hover:text-ink disabled:opacity-20"
          >
            <Icon name="arrowRight" className="size-3 -rotate-90" />
          </button>
        </form>
        <form action={moveTimelineStatus}>
          <input type="hidden" name="id" value={status.id} />
          <input type="hidden" name="dir" value="down" />
          <button
            type="submit"
            disabled={last}
            aria-label="아래로"
            className="flex size-4 items-center justify-center text-ink-muted transition hover:text-ink disabled:opacity-20"
          >
            <Icon name="arrowRight" className="size-3 rotate-90" />
          </button>
        </form>
      </div>

      <form action={updateTimelineStatus} className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-2">
        <input type="hidden" name="id" value={status.id} />
        <input type="hidden" name="color" value={color} />
        {isDone && <input type="hidden" name="is_done" value="1" />}
        <span className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${EVENT_COLOR[color].chip}`}>
          {status.label}
        </span>
        <Input name="label" defaultValue={status.label} className="min-w-[120px] max-w-[200px] flex-1" />
        <ColorDots value={color} onChange={setColor} />
        <DoneToggle value={isDone} onChange={setIsDone} />
        <Button type="submit" variant="ghost" className="shrink-0">저장</Button>
      </form>

      <span className="w-14 shrink-0 text-right text-xs text-ink-muted">{usage}건</span>

      <form action={deleteTimelineStatus} className="flex shrink-0">
        <input type="hidden" name="id" value={status.id} />
        <button
          type="submit"
          aria-label={`${status.label} 삭제`}
          className="text-ink-muted opacity-0 transition group-hover:opacity-100 hover:text-red-600"
        >
          <Icon name="bin" className="size-4" />
        </button>
      </form>
    </li>
  )
}

function NewStatusForm() {
  const [color, setColor] = useState<EventColor>('gray')
  const [isDone, setIsDone] = useState(false)

  return (
    <form action={createTimelineStatus} className="flex flex-wrap items-center gap-3 border-t border-line px-4 py-3">
      <input type="hidden" name="color" value={color} />
      {isDone && <input type="hidden" name="is_done" value="1" />}
      <span className={`size-2.5 shrink-0 rounded-full ${EVENT_COLOR[color].dot}`} />
      <Input name="label" required placeholder="새 상태 태그 이름" className="min-w-[120px] max-w-[200px] flex-1" />
      <ColorDots value={color} onChange={setColor} />
      <DoneToggle value={isDone} onChange={setIsDone} />
      <Button type="submit" className="shrink-0">
        <Icon name="plus" className="size-4" />
        추가
      </Button>
    </form>
  )
}

export default function TimelineStatusEditor({
  statuses,
  usage,
}: {
  statuses: TimelineStatusDef[]
  usage: Record<string, number>
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <ul className="divide-y divide-line">
        {statuses.map((s, i) => (
          <StatusRow
            key={s.id}
            status={s}
            usage={usage[s.key] ?? 0}
            first={i === 0}
            last={i === statuses.length - 1}
          />
        ))}
      </ul>
      <NewStatusForm />
    </div>
  )
}
