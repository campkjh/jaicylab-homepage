'use client'

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { EVENT_COLOR, MEAL_SLOT, type EventCategory, type MealEntry, type ScheduleEvent, type Timeline } from '@/lib/types'
import type { DayCell, DayTask, MonthData } from '@/lib/calendar'
import {
  autosaveEventBody,
  autosaveEventMeta,
  createEventDraft,
  deleteEvent,
  fetchEventBody,
  loadScheduleMonth,
  moveEvent,
  moveMeal,
} from '@/app/admin/actions'
import { usePresence } from './PresenceProvider'
import RichEditor from './RichEditor'
import MealForm from './MealForm'
import TimelinePanel from './TimelinePanel'
import Avatar from './Avatar'
import Icon from './Icon'
import { Button } from './ui'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']
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

/** 칩을 드래그할 때 dataTransfer 에 싣는 내용 */
type DragPayload = { kind: 'event' | 'meal'; id: number; date: string }

function setDragPayload(e: React.DragEvent, payload: DragPayload) {
  e.dataTransfer.setData('text/plain', JSON.stringify(payload))
  e.dataTransfer.effectAllowed = 'move'
}

type Dialog =
  | { mode: 'create'; date: string }
  | { mode: 'edit'; event: ScheduleEvent }
  | { mode: 'day'; cell: DayCell }
  | { mode: 'meal'; meal: MealEntry | null; date: string }
  | { mode: 'timelines' }
  | null

function EventChip({ event, onClick }: { event: ScheduleEvent; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      draggable
      onDragStart={e => setDragPayload(e, { kind: 'event', id: event.id, date: event.event_date })}
      className={`flex w-full cursor-grab items-center gap-1 rounded px-1.5 py-0.5 text-left text-[11px] transition hover:brightness-95 active:cursor-grabbing ${EVENT_COLOR[event.color]?.chip ?? EVENT_COLOR.blue.chip}`}
    >
      <span className="min-w-0 flex-1 truncate">{event.title}</span>
      {event.event_time && <span className="hidden shrink-0 tabular-nums opacity-70 sm:inline">{event.event_time}</span>}
    </button>
  )
}

function MealChip({ meal, onClick }: { meal: MealEntry; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      draggable
      data-meal={meal.meal_date}
      onDragStart={e => setDragPayload(e, { kind: 'meal', id: meal.id, date: meal.meal_date })}
      className={`flex w-full cursor-grab items-center gap-1 rounded px-1.5 py-0.5 text-left text-[11px] transition hover:brightness-95 active:cursor-grabbing ${MEAL_SLOT[meal.slot].chip}`}
    >
      {meal.image_url && <img src={meal.image_url} alt="" className="size-3.5 shrink-0 rounded-sm object-cover" />}
      <span className="min-w-0 flex-1 truncate">{meal.title}</span>
      <span className="hidden shrink-0 opacity-70 sm:inline">{MEAL_SLOT[meal.slot].label}</span>
    </button>
  )
}

function TaskChip({ task }: { task: DayTask }) {
  return (
    <Link
      href={`/admin/projects?open=${task.project_id}`}
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
  onMeal,
  onDropChip,
}: {
  month: MonthData
  onCreate: (date: string) => void
  onEdit: (e: ScheduleEvent) => void
  onDay: (cell: DayCell) => void
  onMeal: (meal: MealEntry, date: string) => void
  onDropChip: (payload: DragPayload, date: string) => void
}) {
  /** 지금 드롭 대상으로 겨누고 있는 날짜 (하이라이트용) */
  const [over, setOver] = useState<string | null>(null)

  return (
    <section data-ym={month.ym} className="scroll-mt-12">
      <h2 className="sticky top-0 z-10 bg-surface/95 py-2 text-[13px] font-semibold text-ink backdrop-blur">
        {month.title}
      </h2>

      <div className="grid grid-cols-7 border-t border-l border-line">
        {month.cells.map(cell => {
          const chips = [
            ...cell.events.map(e => ({ k: `e${e.id}`, node: <EventChip event={e} onClick={() => onEdit(e)} /> })),
            ...cell.meals.map(m => ({ k: `m${m.id}`, node: <MealChip meal={m} onClick={() => onMeal(m, cell.date)} /> })),
            ...cell.tasks.map(t => ({ k: `t${t.id}`, node: <TaskChip task={t} /> })),
          ]
          const shown = chips.slice(0, MAX_CHIPS)
          const hidden = chips.length - shown.length

          return (
            <div
              key={cell.date}
              data-date={cell.date}
              data-today={cell.isToday && cell.inMonth ? '1' : undefined}
              // 터치 기기엔 hover 가 없다. 칩이나 버튼이 아닌 빈 곳을 탭하면 그 날짜를 연다.
              onClick={e => {
                if (!(e.target as HTMLElement).closest('button, a')) onDay(cell)
              }}
              onDragOver={e => {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'
                setOver(cell.date)
              }}
              onDragLeave={() => setOver(v => (v === cell.date ? null : v))}
              onDrop={e => {
                e.preventDefault()
                setOver(null)
                try {
                  const payload = JSON.parse(e.dataTransfer.getData('text/plain')) as DragPayload
                  if ((payload.kind === 'event' || payload.kind === 'meal') && typeof payload.id === 'number')
                    onDropChip(payload, cell.date)
                } catch {
                  /* 칩이 아닌 것을 떨어뜨리면 무시 */
                }
              }}
              className={`group relative min-h-[68px] cursor-pointer border-r border-b border-line p-0.5 sm:min-h-[92px] sm:p-1 lg:cursor-default ${cell.inMonth ? 'bg-surface' : 'bg-canvas/50'} ${
                over === cell.date ? 'ring-2 ring-brand ring-inset' : ''
              }`}
            >
              <div className="mb-0.5 flex items-center gap-1 px-0.5">
                <span className={`flex size-[18px] shrink-0 items-center justify-center rounded-full text-[11px] tabular-nums ${dayNumberClass(cell)}`}>
                  {cell.day}
                </span>
                {cell.holiday && cell.inMonth && (
                  <span className="hidden min-w-0 truncate text-[10px] text-red-500 sm:inline">{cell.holiday}</span>
                )}
                <span className="flex-1" />
                <button
                  onClick={() => onCreate(cell.date)}
                  aria-label={`${cell.date} 일정 추가`}
                  className="hidden text-ink-muted opacity-0 transition group-hover:opacity-100 hover:text-ink lg:block"
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
  initialTimelines,
  admins,
}: {
  initialMonths: MonthData[]
  focusYm: string
  categories: EventCategory[]
  todayIso: string
  initialTimelines: Timeline[]
  admins: string[]
}) {
  const router = useRouter()
  const [months, setMonths] = useState<MonthData[]>(initialMonths)
  const [timelines, setTimelines] = useState<Timeline[]>(initialTimelines)
  const [dialog, setDialog] = useState<Dialog>(null)
  const [visibleYm, setVisibleYm] = useState(focusYm)

  const scrollRef = useRef<HTMLDivElement>(null)
  const loading = useRef(false)
  /** prepend 직후 스크롤 위치를 보정하기 위한 직전 높이 */
  const pendingPrepend = useRef<number | null>(null)
  /** 일정 다이얼로그가 닫히기 전에 남은 자동 저장을 마저 보내도록 폼이 등록해 두는 닫기 함수 */
  const dialogCloseRef = useRef<(() => void) | null>(null)

  const close = () => {
    dialogCloseRef.current = null
    setDialog(null)
  }

  // ?ym= 으로 다른 달을 열면 서버가 새 initialMonths 를 내려준다. state 도 갈아끼운다.
  useEffect(() => {
    setMonths(initialMonths)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusYm])

  // 처음 열었을 때 가운데 달(현재 달)이 보이도록 맞춘다.
  // months 를 넣으면 달이 붙을 때마다 스크롤이 되돌아가므로 focusYm 만 본다.
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

  /**
   * 일정을 만들거나 고친 뒤 화면에 바로 반영한다.
   * 달을 state 로 들고 있어서 router.refresh() 만으로는 갱신되지 않는다.
   * 한 날짜는 앞뒤 달 그리드에도 걸쳐 보이므로, 그 날짜를 품은 달을 모두 새로 받는다.
   */
  const reloadDates = useCallback(async (dates: string[]) => {
    const wanted = new Set<string>()
    for (const date of dates.filter(Boolean)) {
      const owners = monthsRef.current.filter(m => m.cells.some(c => c.date === date))
      if (owners.length) owners.forEach(m => wanted.add(m.ym))
      else wanted.add(date.slice(0, 7))
    }
    if (!wanted.size) return

    const loaded = await Promise.all([...wanted].map(ym => loadScheduleMonth(ym)))
    setMonths(prev => prev.map(m => loaded.find(l => l.ym === m.ym) ?? m))
  }, [])

  const onTimelinesChanged = useCallback((list: Timeline[]) => setTimelines(list), [])

  /** 칩을 다른 날짜에 떨어뜨리면 옮긴다. 식단은 같은 때가 이미 있으면 서로 맞바꾼다. */
  const handleDropChip = useCallback(
    async (payload: DragPayload, date: string) => {
      if (payload.date === date) return
      if (payload.kind === 'event') await moveEvent(payload.id, date)
      else await moveMeal(payload.id, date)
      void reloadDates([payload.date, date])
    },
    [reloadDates],
  )

  // ── 타임라인 패널 폭. 경계 바를 끌어 조절하고 localStorage 에 저장한다.
  const PANEL_MIN = 180
  const PANEL_MAX = 560
  const [panelW, setPanelW] = useState(232)
  const panelWRef = useRef(panelW)
  panelWRef.current = panelW
  const barDrag = useRef<{ startX: number; startW: number } | null>(null)

  useEffect(() => {
    const saved = Number(localStorage.getItem('jl.timeline.width'))
    if (saved >= PANEL_MIN && saved <= PANEL_MAX) setPanelW(saved)
  }, [])

  const onBarPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    barDrag.current = { startX: e.clientX, startW: panelWRef.current }
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* 포인터 캡처가 안 되는 환경에서도 드래그는 동작한다 */
    }
  }
  const onBarPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!barDrag.current) return
    const w = Math.min(PANEL_MAX, Math.max(PANEL_MIN, barDrag.current.startW + (barDrag.current.startX - e.clientX)))
    setPanelW(w)
  }
  const onBarPointerUp = () => {
    if (!barDrag.current) return
    barDrag.current = null
    localStorage.setItem('jl.timeline.width', String(panelWRef.current))
  }

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

  /**
   * 양 끝에 가까워지면 더 불러온다.
   *
   * IntersectionObserver 로 하면, 달이 적어 위/아래 센티널이 동시에 보일 때
   * 위쪽이 loading 잠금을 먼저 잡고 아래쪽 호출이 버려진다. 그 뒤로는 교차 상태가
   * 바뀌지 않아 콜백이 다시 오지 않으므로 아래로 영영 붙지 않는다.
   * 스크롤 위치로 매번 판정하면 그 교착이 생기지 않는다.
   */
  const EDGE = 400
  const checkEdges = useCallback(() => {
    const box = scrollRef.current
    if (!box || loading.current) return
    if (box.scrollTop < EDGE) void extend('up')
    else if (box.scrollHeight - box.scrollTop - box.clientHeight < EDGE) void extend('down')
  }, [extend])

  /**
   * 헤더에 지금 보고 있는 달을 띄운다.
   * IntersectionObserver 의 entries 에는 "교차 상태가 바뀐" 항목만 들어와서,
   * 스크롤 도중 아무 것도 바뀌지 않으면 갱신이 누락된다. 스크롤 위치로 직접 계산한다.
   */
  const syncVisibleYm = useCallback(() => {
    const box = scrollRef.current
    if (!box) return
    const line = box.scrollTop + 8 // 월 제목이 sticky 로 붙는 지점
    let current: string | null = null
    box.querySelectorAll<HTMLElement>('[data-ym]').forEach(el => {
      if (el.offsetTop <= line) current = el.dataset.ym ?? null
    })
    if (current) setVisibleYm(current)
  }, [])

  useEffect(() => {
    const box = scrollRef.current
    if (!box) return

    // requestAnimationFrame 으로 미루면, 달이 붙어 이 이펙트가 다시 도는 순간
    // cleanup 이 예약된 프레임을 취소해 그 스크롤의 헤더 갱신이 통째로 날아간다.
    // 섹션이 몇 개뿐이라 바로 계산해도 싸다.
    const onScroll = () => {
      syncVisibleYm()
      checkEdges()
    }
    box.addEventListener('scroll', onScroll, { passive: true })
    // 달이 붙은 직후에도 한 번 더 본다. 화면보다 내용이 짧으면 스크롤이 안 나기 때문.
    onScroll()
    return () => box.removeEventListener('scroll', onScroll)
  }, [syncVisibleYm, checkEdges, months])

  const jumpToToday = () => {
    const ym = todayIso.slice(0, 7)
    const el = scrollRef.current?.querySelector<HTMLElement>(`[data-ym="${ym}"]`)
    if (el && scrollRef.current) scrollRef.current.scrollTo({ top: el.offsetTop - 8, behavior: 'smooth' })
    else router.push(`/admin/schedule?ym=${ym}`)
  }

  const [year, mon] = visibleYm.split('-')

  const onDialogDone = (dates?: string[]) => {
    close()
    if (dates?.length) void reloadDates(dates)
  }

  return (
    // 아래 3rem 은 해변 장식(SummerShore) 자리
    <div className="flex h-[calc(100dvh-11rem)] gap-2 lg:h-[calc(100dvh-6.5rem)]">
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-[20px] leading-tight font-semibold tracking-tight text-ink tabular-nums sm:text-[26px]">
              {year}년 {Number(mon)}월
            </h1>
            <button
              onClick={jumpToToday}
              className="rounded-md border border-line px-2 py-1 text-xs text-ink-soft transition hover:bg-hover"
            >
              오늘
            </button>
            <span className="hidden text-xs text-ink-muted xl:inline">스크롤하면 이전·다음 달이 이어집니다</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDialog({ mode: 'timelines' })}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-surface px-3 text-sm font-medium text-ink-soft transition hover:bg-hover lg:hidden"
            >
              타임라인
            </button>
            <Button variant="ghost" onClick={() => setDialog({ mode: 'meal', meal: null, date: todayIso })}>
              <Icon name="food" className="size-4" />
              식단
            </Button>
            <Button onClick={() => setDialog({ mode: 'create', date: todayIso })}>
              <Icon name="plus" className="size-4" />
              일정 추가
            </Button>
          </div>
        </header>

        {categories.length > 0 && (
          <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            {categories.map(c => (
              <span key={c.id} className="flex items-center gap-1.5 text-xs text-ink-soft">
                <span className={`size-2 rounded-full ${EVENT_COLOR[c.color].dot}`} />
                {c.name}
              </span>
            ))}
            <span className="flex items-center gap-1.5 text-xs text-ink-soft">
              <span className="size-2 rounded-full bg-emerald-500" />
              식단
            </span>
          </div>
        )}

        <div className="grid grid-cols-7 border-b border-line">
          {WEEKDAYS.map((w, i) => (
            <div
              key={w}
              className={`px-2 py-1.5 text-[11px] font-medium ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-ink-soft'}`}
            >
              {w}
            </div>
          ))}
        </div>

        {/* offsetTop 이 이 박스 기준이 되도록 relative 를 준다 (스크롤 위치 계산에 쓰인다) */}
        <div ref={scrollRef} className="relative min-h-0 flex-1 overflow-y-auto">
          {months.map(m => (
            <MonthGrid
              key={m.ym}
              month={m}
              onCreate={date => setDialog({ mode: 'create', date })}
              onEdit={e => setDialog({ mode: 'edit', event: e })}
              onDay={cell => setDialog({ mode: 'day', cell })}
              onMeal={(meal, date) => setDialog({ mode: 'meal', meal, date })}
              onDropChip={handleDropChip}
            />
          ))}
        </div>
      </div>

      {/* 경계 바: 끌면 달력·타임라인 폭이 같이 조절된다 */}
      <div
        role="separator"
        aria-label="타임라인 폭 조절"
        onPointerDown={onBarPointerDown}
        onPointerMove={onBarPointerMove}
        onPointerUp={onBarPointerUp}
        className="hidden w-1.5 shrink-0 cursor-col-resize touch-none rounded-full transition hover:bg-line active:bg-brand lg:block"
      />

      <aside data-timeline-panel style={{ width: panelW }} className="hidden shrink-0 lg:flex lg:flex-col">
        <TimelinePanel timelines={timelines} admins={admins} onChanged={onTimelinesChanged} />
      </aside>

      {dialog && (
        <Modal
          onClose={() => {
            // 일정 편집 중이면 남은 자동 저장을 흘려보낸 뒤 닫는다.
            if (dialogCloseRef.current) dialogCloseRef.current()
            else close()
          }}
          wide={dialog.mode === 'create' || dialog.mode === 'edit'}
        >
          {dialog.mode === 'day' && (
            <DayDetail
              cell={dialog.cell}
              onClose={close}
              onEdit={e => setDialog({ mode: 'edit', event: e })}
              onCreate={() => setDialog({ mode: 'create', date: dialog.cell.date })}
              onMeal={meal => setDialog({ mode: 'meal', meal, date: dialog.cell.date })}
            />
          )}
          {dialog.mode === 'meal' && (
            <MealForm key={dialog.meal?.id ?? dialog.date} meal={dialog.meal} date={dialog.date} onDone={onDialogDone} />
          )}
          {dialog.mode === 'timelines' && (
            <div className="p-1">
              <TimelinePanel timelines={timelines} admins={admins} onChanged={onTimelinesChanged} />
            </div>
          )}
          {(dialog.mode === 'create' || dialog.mode === 'edit') && (
            <EventDialog
              key={dialog.mode === 'edit' ? dialog.event.id : dialog.date}
              event={dialog.mode === 'edit' ? dialog.event : null}
              date={dialog.mode === 'create' ? dialog.date : dialog.event.event_date}
              categories={categories}
              closeRef={dialogCloseRef}
              onDone={onDialogDone}
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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-3 sm:p-6"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`animate-fade-up max-h-[90dvh] w-full overflow-y-auto rounded-2xl border border-line bg-surface shadow-[0_24px_60px_-20px_rgba(15,15,15,0.35)] ${
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
  onMeal,
}: {
  cell: DayCell
  onClose: () => void
  onEdit: (e: ScheduleEvent) => void
  onCreate: () => void
  onMeal: (meal: MealEntry | null) => void
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
        {cell.events.length === 0 && cell.tasks.length === 0 && cell.meals.length === 0 && (
          <p className="py-6 text-center text-sm text-ink-muted">이 날은 비어 있습니다.</p>
        )}
        {cell.events.map(e => (
          <EventChip key={e.id} event={e} onClick={() => onEdit(e)} />
        ))}
        {cell.meals.map(m => (
          <MealChip key={m.id} meal={m} onClick={() => onMeal(m)} />
        ))}
        {cell.tasks.map(t => (
          <TaskChip key={t.id} task={t} />
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="ghost" onClick={onCreate} className="flex-1">
          <Icon name="plus" className="size-4" />
          일정
        </Button>
        <Button variant="ghost" onClick={() => onMeal(null)} className="flex-1">
          <Icon name="food" className="size-4" />
          식단
        </Button>
      </div>
    </>
  )
}

/** 편집 중인 일정의 본문을 자동 저장하고, 상대가 저장한 내용을 폴링으로 받아온다. */
function useCollaborativeBody(event: ScheduleEvent) {
  const { setTypingOn } = usePresence()
  const [html, setHtml] = useState(event.body_html ?? '')
  const [remoteHtml, setRemoteHtml] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  const htmlRef = useRef(html)
  htmlRef.current = html
  const lastSyncedRef = useRef(event.updated_at ?? '')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onChange = useCallback(
    (next: string) => {
      setHtml(next)
      setTypingOn(event.id)
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(async () => {
        const at = await autosaveEventBody(event.id, htmlRef.current)
        lastSyncedRef.current = at
        setSavedAt(at)
      }, 1200)
    },
    [event.id, setTypingOn],
  )

  useEffect(() => {
    const id = setInterval(async () => {
      const remote = await fetchEventBody(event.id)
      if (!remote || remote.updatedAt <= lastSyncedRef.current) return
      lastSyncedRef.current = remote.updatedAt
      setRemoteHtml(remote.html)
      setHtml(remote.html)
    }, 3000)
    return () => clearInterval(id)
  }, [event.id])

  useEffect(() => () => setTypingOn(null), [setTypingOn])

  return { html, remoteHtml, savedAt, onChange }
}

function PropertyRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-1">
      <div className="flex w-[74px] shrink-0 items-center gap-1.5 pt-1.5 text-xs text-ink-muted sm:w-[104px]">
        {icon}
        {label}
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

const bareInput =
  'w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-sm text-ink outline-none transition hover:bg-hover focus:border-brand focus:bg-surface'

/**
 * 팝업을 여는 순간 초안이 저장되고(제목은 알아서 지어진다),
 * 이후의 모든 입력은 자동 저장된다. 저장 버튼이 없다.
 */
function EventDialog({
  event,
  date,
  categories,
  closeRef,
  onDone,
}: {
  event: ScheduleEvent | null
  date: string
  categories: EventCategory[]
  closeRef: React.MutableRefObject<(() => void) | null>
  /** 닫힌 뒤 다시 그려야 할 날짜들 */
  onDone: (dates?: string[]) => void
}) {
  const [ev, setEv] = useState<ScheduleEvent | null>(event)
  const started = useRef(false)

  // 새 일정: 여는 순간 초안을 만든다. (StrictMode 의 이중 마운트에도 한 번만)
  useEffect(() => {
    if (ev || started.current) return
    started.current = true
    void createEventDraft(date).then(setEv)
  }, [ev, date])

  if (!ev) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center gap-3 text-sm text-ink-muted">
        <Icon name="refresh" className="size-5 animate-spin" />
        일정을 만드는 중…
      </div>
    )
  }

  return <EventForm key={ev.id} event={ev} isNew={!event} categories={categories} closeRef={closeRef} onDone={onDone} />
}

function EventForm({
  event,
  isNew,
  categories,
  closeRef,
  onDone,
}: {
  event: ScheduleEvent
  isNew: boolean
  categories: EventCategory[]
  closeRef: React.MutableRefObject<(() => void) | null>
  onDone: (dates?: string[]) => void
}) {
  const [title, setTitle] = useState(event.title)
  const [eventDate, setEventDate] = useState(event.event_date)
  const [eventTime, setEventTime] = useState(event.event_time ?? '')
  const [categoryId, setCategoryId] = useState<string>(event.category_id ? String(event.category_id) : '')
  const [metaSaved, setMetaSaved] = useState(false)
  const active = categories.find(c => String(c.id) === categoryId)

  // 디바운스 타이머가 항상 최신 값을 저장하도록 ref 로도 들고 있는다.
  const metaRef = useRef({ title, eventDate, eventTime, categoryId })
  metaRef.current = { title, eventDate, eventTime, categoryId }
  const touched = useRef(new Set([event.event_date]))
  const dirty = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const flush = useCallback(async () => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
    if (!dirty.current) return
    dirty.current = false
    const m = metaRef.current
    if (!m.eventDate) return
    touched.current.add(m.eventDate)
    await autosaveEventMeta(event.id, {
      title: m.title,
      event_date: m.eventDate,
      event_time: m.eventTime || null,
      category_id: m.categoryId ? Number(m.categoryId) : null,
    })
    setMetaSaved(true)
  }, [event.id])

  const scheduleSave = useCallback(() => {
    dirty.current = true
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => void flush(), 600)
  }, [flush])

  const handleClose = useCallback(async () => {
    await flush()
    onDone([...touched.current])
  }, [flush, onDone])

  // 딤 클릭 / ESC 로 닫아도 남은 자동 저장을 마저 보낸다.
  useEffect(() => {
    closeRef.current = () => void handleClose()
    return () => {
      closeRef.current = null
    }
  }, [closeRef, handleClose])

  const { html, remoteHtml, savedAt, onChange } = useCollaborativeBody(event)
  const { whoIsTyping } = usePresence()
  const typist = whoIsTyping(event.id)

  return (
    <>
      {/* 상단 바 */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-surface/95 px-4 py-2.5 backdrop-blur">
        <span className="text-xs text-ink-muted">
          {isNew ? '새 일정 · 자동 저장' : `수정 · ${event.updated_by ?? ''} · 자동 저장`}
        </span>
        <div className="flex items-center gap-3">
          {typist ? (
            <span className="flex items-center gap-1.5 text-[11px] text-brand">
              <Avatar name={typist.name} url={typist.avatar_url} size="sm" />
              {typist.name}님이 입력 중…
            </span>
          ) : (
            (savedAt || metaSaved) && <span className="text-[11px] text-ink-muted">저장됨</span>
          )}
          <button onClick={() => void handleClose()} aria-label="닫기" className="text-ink-muted transition hover:text-ink">
            <Icon name="x" className="size-4" />
          </button>
        </div>
      </div>

      <div className="px-5 pt-6 pb-6 sm:px-12 sm:pt-10 sm:pb-8">
        {/* 아이콘 + 제목 */}
        <div
          className={`mb-5 flex size-12 items-center justify-center rounded-xl ${active ? EVENT_COLOR[active.color].chip : 'bg-canvas text-ink-muted'}`}
        >
          <Icon name="calendar" className="size-6" />
        </div>

        <input
          value={title}
          autoFocus
          onFocus={e => isNew && e.target.select()}
          onChange={e => {
            setTitle(e.target.value)
            scheduleSave()
          }}
          placeholder="제목 없음"
          className="-ml-1 mb-6 w-full rounded-md border border-transparent bg-transparent px-1 text-[24px] sm:text-[32px] leading-tight font-bold tracking-tight text-ink outline-none transition placeholder:text-ink-muted/50 hover:border-line focus:border-brand"
        />

        {/* 속성 */}
        <div className="mb-6 flex flex-col">
          <PropertyRow icon={<Icon name="calendar" className="size-3.5" />} label="날짜">
            <input
              type="date"
              value={eventDate}
              onChange={e => {
                setEventDate(e.target.value)
                scheduleSave()
              }}
              className={bareInput}
            />
          </PropertyRow>

          <PropertyRow icon={<Icon name="clock" className="size-3.5" />} label="시간">
            <input
              type="time"
              value={eventTime}
              onChange={e => {
                setEventTime(e.target.value)
                scheduleSave()
              }}
              className={bareInput}
            />
          </PropertyRow>

          <PropertyRow icon={<Icon name="tag" className="size-3.5" />} label="카테고리">
            <div className="flex items-center gap-2">
              <span className={`size-2.5 shrink-0 rounded-full ${active ? EVENT_COLOR[active.color].dot : 'bg-zinc-300'}`} />
              <select
                value={categoryId}
                onChange={e => {
                  setCategoryId(e.target.value)
                  scheduleSave()
                }}
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
        <RichEditor initialHtml={event.body_html ?? ''} remoteHtml={remoteHtml} onChange={onChange} seamless />

        <div className="mt-8 flex items-center gap-2 border-t border-line pt-5">
          <button
            onClick={async () => {
              const fd = new FormData()
              fd.set('id', String(event.id))
              await deleteEvent(fd)
              onDone([...touched.current])
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 px-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <Icon name="bin" className="size-4" />
            삭제
          </button>
          <span className="text-xs text-ink-muted">닫으면 자동으로 저장됩니다</span>
          <Link href="/admin/settings" className="ml-auto text-xs text-ink-muted underline underline-offset-2 hover:text-ink">
            카테고리 설정
          </Link>
        </div>
      </div>
    </>
  )
}
