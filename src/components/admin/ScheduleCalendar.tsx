'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { EVENT_COLOR, type EventCategory, type ScheduleEvent } from '@/lib/types'
import type { DayCell, DayTask, MonthData } from '@/lib/calendar'
import {
  autosaveEventBody,
  createEvent,
  deleteEvent,
  fetchEventBody,
  loadScheduleMonth,
  updateEvent,
} from '@/app/admin/actions'
import { usePresence } from './PresenceProvider'
import RichEditor from './RichEditor'
import Avatar from './Avatar'
import Icon from './Icon'
import { Button } from './ui'

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일']
const MAX_CHIPS = 3
/** 한 번에 붙이는 달 수 */
const CHUNK = 2

function shiftYm(ym: string, offset: number): string {
  const [y, m] = ym.split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1 + offset, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

/** 공휴일과 일요일은 빨강, 토요일은 파랑. */
function dayNumberClass(cell: DayCell): string {
  if (cell.isToday) return 'bg-brand font-semibold text-white'
  const red = Boolean(cell.holiday) || cell.isSunday
  const tone = red ? 'text-red-600' : cell.isSaturday ? 'text-blue-600' : 'text-ink-soft'
  return cell.inMonth ? tone : `${tone} opacity-40`
}

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

function MonthGrid({
  month,
  onCreate,
  onEdit,
  onDay,
}: {
  month: MonthData
  onCreate: (date: string) => void
  onEdit: (e: ScheduleEvent) => void
  onDay: (cell: DayCell) => void
}) {
  return (
    <section data-ym={month.ym} className="scroll-mt-12">
      <h2 className="sticky top-0 z-10 bg-surface/95 py-2 text-[13px] font-semibold text-ink backdrop-blur">
        {month.title}
      </h2>

      <div className="grid grid-cols-7 border-t border-l border-line">
        {month.cells.map(cell => {
          const chips = [
            ...cell.events.map(e => ({ k: `e${e.id}`, node: <EventChip event={e} onClick={() => onEdit(e)} /> })),
            ...cell.tasks.map(t => ({ k: `t${t.id}`, node: <TaskChip task={t} /> })),
          ]
          const shown = chips.slice(0, MAX_CHIPS)
          const hidden = chips.length - shown.length

          return (
            <div
              key={cell.date}
              className={`group relative min-h-[92px] border-r border-b border-line p-1 ${cell.inMonth ? 'bg-surface' : 'bg-canvas/50'}`}
            >
              <div className="mb-0.5 flex items-center gap-1 px-0.5">
                <span className={`flex size-[18px] shrink-0 items-center justify-center rounded-full text-[11px] tabular-nums ${dayNumberClass(cell)}`}>
                  {cell.day}
                </span>
                {cell.holiday && cell.inMonth && (
                  <span className="min-w-0 truncate text-[10px] text-red-500">{cell.holiday}</span>
                )}
                <span className="flex-1" />
                <button
                  onClick={() => onCreate(cell.date)}
                  aria-label={`${cell.date} 일정 추가`}
                  className="text-ink-muted opacity-0 transition group-hover:opacity-100 hover:text-ink"
                >
                  <Icon name="plus" className="size-3" />
                </button>
              </div>

              <div className="flex flex-col gap-0.5">
                {shown.map(c => (
                  <div key={c.k}>{c.node}</div>
                ))}
                {hidden > 0 && (
                  <button
                    onClick={() => onDay(cell)}
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
    </section>
  )
}

export default function ScheduleCalendar({
  initialMonths,
  focusYm,
  categories,
  todayIso,
}: {
  initialMonths: MonthData[]
  focusYm: string
  categories: EventCategory[]
  todayIso: string
}) {
  const router = useRouter()
  const [months, setMonths] = useState<MonthData[]>(initialMonths)
  const [dialog, setDialog] = useState<Dialog>(null)
  const [visibleYm, setVisibleYm] = useState(focusYm)

  const scrollRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const loading = useRef(false)
  /** prepend 직후 스크롤 위치를 보정하기 위한 직전 높이 */
  const pendingPrepend = useRef<number | null>(null)

  const close = () => setDialog(null)

  // 처음 열었을 때 가운데 달(현재 달)이 보이도록 맞춘다.
  useEffect(() => {
    const el = scrollRef.current?.querySelector<HTMLElement>(`[data-ym="${focusYm}"]`)
    if (el && scrollRef.current) scrollRef.current.scrollTop = el.offsetTop - 8
  }, [focusYm])

  // 위쪽에 달을 붙이면 스크롤이 튄다. 늘어난 높이만큼 즉시 되돌린다.
  useLayoutEffect(() => {
    const box = scrollRef.current
    if (!box || pendingPrepend.current == null) return
    box.scrollTop += box.scrollHeight - pendingPrepend.current
    pendingPrepend.current = null
  }, [months])

  const monthsRef = useRef(months)
  monthsRef.current = months

  const extend = useCallback(async (direction: 'up' | 'down') => {
    if (loading.current) return
    loading.current = true
    try {
      const current = monthsRef.current
      const edge = direction === 'up' ? current[0].ym : current[current.length - 1].ym
      const wanted = Array.from({ length: CHUNK }, (_, i) => shiftYm(edge, direction === 'up' ? -(i + 1) : i + 1))
      const loaded = await Promise.all(wanted.map(ym => loadScheduleMonth(ym)))

      if (direction === 'up') pendingPrepend.current = scrollRef.current?.scrollHeight ?? null

      setMonths(prev => {
        const known = new Set(prev.map(m => m.ym))
        const fresh = loaded.filter(m => !known.has(m.ym))
        if (!fresh.length) return prev
        return direction === 'up' ? [...fresh.reverse(), ...prev] : [...prev, ...fresh]
      })
    } finally {
      loading.current = false
    }
  }, [])

  // 위/아래 센티널이 보이면 더 불러온다.
  useEffect(() => {
    const box = scrollRef.current
    if (!box) return
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          if (e.target === topRef.current) void extend('up')
          if (e.target === bottomRef.current) void extend('down')
        }
      },
      { root: box, rootMargin: '300px' },
    )
    if (topRef.current) io.observe(topRef.current)
    if (bottomRef.current) io.observe(bottomRef.current)
    return () => io.disconnect()
  }, [extend])

  // 헤더에 지금 보고 있는 달을 띄운다.
  useEffect(() => {
    const box = scrollRef.current
    if (!box) return
    const io = new IntersectionObserver(
      entries => {
        const top = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        const ym = top?.target.getAttribute('data-ym')
        if (ym) setVisibleYm(ym)
      },
      { root: box, threshold: 0.05 },
    )
    box.querySelectorAll('[data-ym]').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [months])

  const jumpToToday = () => {
    const ym = todayIso.slice(0, 7)
    const el = scrollRef.current?.querySelector<HTMLElement>(`[data-ym="${ym}"]`)
    if (el && scrollRef.current) scrollRef.current.scrollTo({ top: el.offsetTop - 8, behavior: 'smooth' })
    else router.push(`/admin/schedule?ym=${ym}`)
  }

  const [year, mon] = visibleYm.split('-')

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-[26px] leading-tight font-semibold tracking-tight text-ink tabular-nums">
            {year}년 {Number(mon)}월
          </h1>
          <button
            onClick={jumpToToday}
            className="rounded-md border border-line px-2 py-1 text-xs text-ink-soft transition hover:bg-hover"
          >
            오늘
          </button>
          <span className="hidden text-xs text-ink-muted sm:inline">스크롤하면 이전·다음 달이 이어집니다</span>
        </div>

        <Button onClick={() => setDialog({ mode: 'create', date: todayIso })}>
          <Icon name="plus" className="size-4" />
          일정 추가
        </Button>
      </header>

      {categories.length > 0 && (
        <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          {categories.map(c => (
            <span key={c.id} className="flex items-center gap-1.5 text-xs text-ink-soft">
              <span className={`size-2 rounded-full ${EVENT_COLOR[c.color].dot}`} />
              {c.name}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-7 border-b border-line">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={`px-2 py-1.5 text-[11px] font-medium ${i === 6 ? 'text-red-500' : i === 5 ? 'text-blue-500' : 'text-ink-soft'}`}
          >
            {w}
          </div>
        ))}
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div ref={topRef} className="h-px" />
        {months.map(m => (
          <MonthGrid
            key={m.ym}
            month={m}
            onCreate={date => setDialog({ mode: 'create', date })}
            onEdit={e => setDialog({ mode: 'edit', event: e })}
            onDay={cell => setDialog({ mode: 'day', cell })}
          />
        ))}
        <div ref={bottomRef} className="h-px" />
      </div>

      {dialog && (
        <Modal onClose={close} wide={dialog.mode !== 'day'}>
          {dialog.mode === 'day' ? (
            <DayDetail
              cell={dialog.cell}
              onClose={close}
              onEdit={e => setDialog({ mode: 'edit', event: e })}
              onCreate={() => setDialog({ mode: 'create', date: dialog.cell.date })}
            />
          ) : (
            <EventDialog
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
    </div>
  )
}

/**
 * 딤 레이어가 캘린더 영역에만 갇히지 않도록 body 로 포털한다.
 * 조상 중 하나라도 transform 을 갖고 있으면 position:fixed 의 기준이 뷰포트가 아니게 된다.
 */
function Modal({ children, onClose, wide }: { children: React.ReactNode; onClose: () => void; wide?: boolean }) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`animate-fade-up max-h-[86dvh] w-full overflow-y-auto rounded-2xl border border-line bg-surface shadow-[0_24px_60px_-20px_rgba(15,15,15,0.35)] ${
          wide ? 'max-w-[720px]' : 'max-w-[440px] p-5'
        }`}
      >
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
          <Icon name="x" className="size-4" />
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
        <Icon name="plus" className="size-4" />이 날에 일정 추가
      </Button>
    </>
  )
}

/** 편집 중인 일정의 본문을 자동 저장하고, 상대가 저장한 내용을 폴링으로 받아온다. */
function useCollaborativeBody(event: ScheduleEvent | null) {
  const { setTypingOn } = usePresence()
  const [html, setHtml] = useState(event?.body_html ?? '')
  const [remoteHtml, setRemoteHtml] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  const htmlRef = useRef(html)
  htmlRef.current = html
  const lastSyncedRef = useRef(event?.updated_at ?? '')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onChange = useCallback(
    (next: string) => {
      setHtml(next)
      if (!event) return
      setTypingOn(event.id)
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(async () => {
        const at = await autosaveEventBody(event.id, htmlRef.current)
        lastSyncedRef.current = at
        setSavedAt(at)
      }, 1200)
    },
    [event, setTypingOn],
  )

  useEffect(() => {
    if (!event) return
    const id = setInterval(async () => {
      const remote = await fetchEventBody(event.id)
      if (!remote || remote.updatedAt <= lastSyncedRef.current) return
      lastSyncedRef.current = remote.updatedAt
      setRemoteHtml(remote.html)
      setHtml(remote.html)
    }, 3000)
    return () => clearInterval(id)
  }, [event])

  useEffect(() => () => setTypingOn(null), [setTypingOn])

  return { html, remoteHtml, savedAt, onChange }
}

function PropertyRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-1">
      <div className="flex w-[104px] shrink-0 items-center gap-1.5 pt-1.5 text-xs text-ink-muted">
        {icon}
        {label}
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

const bareInput =
  'w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-sm text-ink outline-none transition hover:bg-hover focus:border-brand focus:bg-surface'

function EventDialog({
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

  const { html, remoteHtml, savedAt, onChange } = useCollaborativeBody(event)
  const { whoIsTyping } = usePresence()
  const typist = event ? whoIsTyping(event.id) : null

  return (
    <>
      {/* 상단 바 */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-surface/95 px-4 py-2.5 backdrop-blur">
        <span className="text-xs text-ink-muted">
          {event ? `수정 · ${event.updated_by ?? ''}` : '새 일정'}
        </span>
        <div className="flex items-center gap-3">
          {typist ? (
            <span className="flex items-center gap-1.5 text-[11px] text-brand">
              <Avatar name={typist.name} url={typist.avatar_url} size="sm" />
              {typist.name}님이 입력 중…
            </span>
          ) : (
            savedAt && <span className="text-[11px] text-ink-muted">저장됨</span>
          )}
          <button onClick={onDone} aria-label="닫기" className="text-ink-muted transition hover:text-ink">
            <Icon name="x" className="size-4" />
          </button>
        </div>
      </div>

      <form
        action={async fd => {
          await (event ? updateEvent(fd) : createEvent(fd))
          onDone()
        }}
        className="px-12 pt-10 pb-8"
      >
        {event && <input type="hidden" name="id" value={event.id} />}
        <input type="hidden" name="body_html" value={html} />

        {/* 아이콘 + 제목 */}
        <div
          className={`mb-5 flex size-12 items-center justify-center rounded-xl ${active ? EVENT_COLOR[active.color].chip : 'bg-canvas text-ink-muted'}`}
        >
          <Icon name="calendar" className="size-6" />
        </div>

        <input
          name="title"
          required
          autoFocus
          defaultValue={event?.title ?? ''}
          placeholder="제목 없음"
          className="-ml-1 mb-6 w-full rounded-md border border-transparent bg-transparent px-1 text-[32px] leading-tight font-bold tracking-tight text-ink outline-none transition placeholder:text-ink-muted/50 hover:border-line focus:border-brand"
        />

        {/* 속성 */}
        <div className="mb-6 flex flex-col">
          <PropertyRow icon={<Icon name="calendar" className="size-3.5" />} label="날짜">
            <input type="date" name="event_date" required defaultValue={date} className={bareInput} />
          </PropertyRow>

          <PropertyRow icon={<Icon name="clock" className="size-3.5" />} label="시간">
            <input type="time" name="event_time" defaultValue={event?.event_time ?? ''} className={bareInput} />
          </PropertyRow>

          <PropertyRow icon={<Icon name="tag" className="size-3.5" />} label="카테고리">
            <div className="flex items-center gap-2">
              <span className={`size-2.5 shrink-0 rounded-full ${active ? EVENT_COLOR[active.color].dot : 'bg-zinc-300'}`} />
              <select
                name="category_id"
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className={bareInput}
              >
                <option value="">미지정</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </PropertyRow>
        </div>

        <div className="mb-5 border-t border-line" />

        {/* 본문 */}
        <RichEditor initialHtml={event?.body_html ?? ''} remoteHtml={remoteHtml} onChange={onChange} seamless />

        <div className="mt-8 flex items-center gap-2 border-t border-line pt-5">
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
              <Icon name="bin" className="size-4" />
              삭제
            </button>
          )}
          <Link href="/admin/settings" className="ml-auto text-xs text-ink-muted underline underline-offset-2 hover:text-ink">
            카테고리 설정
          </Link>
        </div>
      </form>
    </>
  )
}
