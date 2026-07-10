'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Plus, Trash2, X } from 'lucide-react'
import { EVENT_COLOR, type EventCategory, type ScheduleEvent } from '@/lib/types'
import { createEvent, deleteEvent, updateEvent } from '@/app/admin/actions'
import { Button, Field, Input, Select, Textarea } from './ui'

export type DayTask = { id: number; title: string; done: boolean; project_id: number; project_name: string }

export type DayCell = {
  date: string
  day: number
  inMonth: boolean
  isToday: boolean
  events: ScheduleEvent[]
  tasks: DayTask[]
}

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일']
const MAX_CHIPS = 3

type Dialog =
  | { mode: 'create'; date: string }
  | { mode: 'edit'; event: ScheduleEvent }
  | { mode: 'day'; cell: DayCell }
  | null

function EventChip({ event, onClick }: { event: ScheduleEvent; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-1 rounded px-1.5 py-0.5 text-left text-[11px] transition hover:brightness-95 ${EVENT_COLOR[event.color]?.chip ?? EVENT_COLOR.blue.chip}`}
    >
      <span className="min-w-0 flex-1 truncate">{event.title}</span>
      {event.event_time && <span className="shrink-0 tabular-nums opacity-70">{event.event_time}</span>}
    </button>
  )
}

function TaskChip({ task }: { task: DayTask }) {
  return (
    <Link
      href={`/admin/projects/${task.project_id}`}
      className="flex w-full items-center gap-1 rounded border border-line px-1.5 py-0.5 text-[11px] text-ink-soft transition hover:bg-hover"
    >
      <span className={`size-1.5 shrink-0 rounded-full ${task.done ? 'bg-brand' : 'bg-ink-muted'}`} />
      <span className={`min-w-0 flex-1 truncate ${task.done ? 'line-through opacity-60' : ''}`}>{task.title}</span>
    </Link>
  )
}

export default function ScheduleCalendar({
  title,
  cells,
  categories,
  prevYm,
  nextYm,
  todayIso,
  eventCount,
}: {
  title: string
  cells: DayCell[]
  categories: EventCategory[]
  prevYm: string
  nextYm: string
  todayIso: string
  eventCount: number
}) {
  const router = useRouter()
  const [dialog, setDialog] = useState<Dialog>(null)

  const close = () => setDialog(null)
  const thisYm = todayIso.slice(0, 7)

  return (
    <>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-[26px] leading-tight font-semibold tracking-tight text-ink">{title}</h1>
          <div className="flex items-center gap-0.5">
            <Link
              href={`/admin/schedule?ym=${prevYm}`}
              aria-label="이전 달"
              className="flex size-7 items-center justify-center rounded-md text-ink-muted transition hover:bg-hover hover:text-ink"
            >
              <ChevronLeft className="size-4" />
            </Link>
            <Link
              href={`/admin/schedule?ym=${nextYm}`}
              aria-label="다음 달"
              className="flex size-7 items-center justify-center rounded-md text-ink-muted transition hover:bg-hover hover:text-ink"
            >
              <ChevronRight className="size-4" />
            </Link>
          </div>
          <Link
            href={`/admin/schedule?ym=${thisYm}`}
            className="rounded-md border border-line px-2 py-1 text-xs text-ink-soft transition hover:bg-hover"
          >
            오늘
          </Link>
          <span className="text-xs text-ink-muted">일정 {eventCount}</span>
        </div>

        <Button onClick={() => setDialog({ mode: 'create', date: todayIso })}>
          <Plus className="size-4" />
          일정 추가
        </Button>
      </header>

      {categories.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {categories.map(c => (
            <span key={c.id} className="flex items-center gap-1.5 text-xs text-ink-soft">
              <span className={`size-2 rounded-full ${EVENT_COLOR[c.color].dot}`} />
              {c.name}
            </span>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="grid grid-cols-7 border-b border-line">
          {WEEKDAYS.map((w, i) => (
            <div
              key={w}
              className={`px-3 py-2 text-[11px] font-medium ${i >= 5 ? 'text-ink-muted' : 'text-ink-soft'}`}
            >
              {w}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {cells.map(cell => {
            const chips = [...cell.events.map(e => ({ k: `e${e.id}`, node: <EventChip event={e} onClick={() => setDialog({ mode: 'edit', event: e })} /> })),
                           ...cell.tasks.map(t => ({ k: `t${t.id}`, node: <TaskChip task={t} /> }))]
            const shown = chips.slice(0, MAX_CHIPS)
            const hidden = chips.length - shown.length

            return (
              <div
                key={cell.date}
                className={`group relative min-h-[112px] border-r border-b border-line p-1.5 last:border-r-0 ${
                  cell.inMonth ? '' : 'bg-canvas/60'
                }`}
              >
                <div className="mb-1 flex items-center justify-between px-1">
                  <span
                    className={`flex size-5 items-center justify-center rounded-full text-[11px] tabular-nums ${
                      cell.isToday
                        ? 'bg-brand font-semibold text-white'
                        : cell.inMonth
                          ? 'text-ink-soft'
                          : 'text-ink-muted/60'
                    }`}
                  >
                    {cell.day}
                  </span>
                  <button
                    onClick={() => setDialog({ mode: 'create', date: cell.date })}
                    aria-label={`${cell.date} 일정 추가`}
                    className="text-ink-muted opacity-0 transition group-hover:opacity-100 hover:text-ink"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  {shown.map(c => <div key={c.k}>{c.node}</div>)}
                  {hidden > 0 && (
                    <button
                      onClick={() => setDialog({ mode: 'day', cell })}
                      className="px-1.5 text-left text-[11px] text-ink-muted transition hover:text-ink"
                    >
                      {hidden}개 더
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <p className="mt-4 text-xs text-ink-muted">
        테두리만 있는 항목은 프로젝트의 할 일 마감일입니다. 누르면 해당 프로젝트로 이동합니다.
      </p>

      {dialog && (
        <Modal onClose={close}>
          {dialog.mode === 'day' ? (
            <DayDetail
              cell={dialog.cell}
              onClose={close}
              onEdit={e => setDialog({ mode: 'edit', event: e })}
              onCreate={() => setDialog({ mode: 'create', date: dialog.cell.date })}
            />
          ) : (
            <EventForm
              key={dialog.mode === 'edit' ? dialog.event.id : dialog.date}
              event={dialog.mode === 'edit' ? dialog.event : null}
              date={dialog.mode === 'create' ? dialog.date : dialog.event.event_date}
              categories={categories}
              onDone={() => {
                close()
                router.refresh()
              }}
            />
          )}
        </Modal>
      )}
    </>
  )
}

/**
 * 딤 레이어가 캘린더 영역에만 갇히지 않도록 body 로 포털한다.
 * 조상 중 하나라도 transform 을 갖고 있으면 position:fixed 의 기준이 뷰포트가 아니게 된다.
 */
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!mounted) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-6"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="animate-fade-up w-full max-w-[440px] rounded-2xl border border-line bg-surface p-5 shadow-[0_12px_40px_-12px_rgba(15,15,15,0.25)]">
        {children}
      </div>
    </div>,
    document.body,
  )
}

function DayDetail({
  cell,
  onClose,
  onEdit,
  onCreate,
}: {
  cell: DayCell
  onClose: () => void
  onEdit: (e: ScheduleEvent) => void
  onCreate: () => void
}) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">{cell.date}</h3>
        <button onClick={onClose} aria-label="닫기" className="text-ink-muted transition hover:text-ink">
          <X className="size-4" />
        </button>
      </div>

      <div className="flex max-h-[320px] flex-col gap-1 overflow-y-auto">
        {cell.events.map(e => (
          <EventChip key={e.id} event={e} onClick={() => onEdit(e)} />
        ))}
        {cell.tasks.map(t => (
          <TaskChip key={t.id} task={t} />
        ))}
      </div>

      <Button variant="ghost" onClick={onCreate} className="mt-4 w-full">
        <Plus className="size-4" />
        이 날에 일정 추가
      </Button>
    </>
  )
}

function EventForm({
  event,
  date,
  categories,
  onDone,
}: {
  event: ScheduleEvent | null
  date: string
  categories: EventCategory[]
  onDone: () => void
}) {
  const [categoryId, setCategoryId] = useState<string>(event?.category_id ? String(event.category_id) : '')
  const active = categories.find(c => String(c.id) === categoryId)

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">{event ? '일정 수정' : '새 일정'}</h3>
        <button onClick={onDone} aria-label="닫기" className="text-ink-muted transition hover:text-ink">
          <X className="size-4" />
        </button>
      </div>

      <form
        action={async fd => {
          await (event ? updateEvent(fd) : createEvent(fd))
          onDone()
        }}
        className="flex flex-col gap-3"
      >
        {event && <input type="hidden" name="id" value={event.id} />}

        <Field label="제목">
          <Input name="title" autoFocus required defaultValue={event?.title ?? ''} placeholder="예: 클라이언트 미팅" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="날짜">
            <Input name="event_date" type="date" required defaultValue={date} />
          </Field>
          <Field label="시간">
            <Input name="event_time" type="time" defaultValue={event?.event_time ?? ''} />
          </Field>
        </div>

        <Field label="카테고리">
          <div className="flex items-center gap-2">
            <span className={`size-3 shrink-0 rounded-full ${active ? EVENT_COLOR[active.color].dot : 'bg-zinc-300'}`} />
            <Select name="category_id" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
              <option value="">미지정</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </div>
          <span className="text-xs text-ink-muted">
            일정 색은 카테고리를 따릅니다.{' '}
            <Link href="/admin/settings" className="underline underline-offset-2 hover:text-ink">
              설정에서 관리
            </Link>
          </span>
        </Field>

        <Field label="메모">
          <Textarea name="memo" rows={2} defaultValue={event?.memo ?? ''} />
        </Field>

        <div className="mt-1 flex items-center gap-2">
          <Button type="submit">{event ? '저장' : '추가'}</Button>
          {event && (
            <button
              type="submit"
              formAction={async fd => {
                await deleteEvent(fd)
                onDone()
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 px-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <Trash2 className="size-4" />
              삭제
            </button>
          )}
        </div>
      </form>
    </>
  )
}
