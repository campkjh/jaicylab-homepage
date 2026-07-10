import 'server-only'
import { sql } from './db'
import { holidayName } from './holidays'
import type { ScheduleEvent } from './types'

export const MS_DAY = 86_400_000

/** 로컬 타임존에 흔들리지 않도록 항상 UTC 기준으로만 다룬다. */
export const iso = (t: number) => new Date(t).toISOString().slice(0, 10)
export const utc = (y: number, m: number, d: number) => Date.UTC(y, m, d)

export function todayIso(): string {
  return iso(Date.now() + new Date().getTimezoneOffset() * -60_000)
}

export function parseYm(ym: string | undefined): { year: number; month: number } {
  const m = /^(\d{4})-(\d{2})$/.exec(ym ?? '')
  if (m) {
    const year = Number(m[1])
    const month = Number(m[2]) - 1
    if (month >= 0 && month <= 11 && year >= 1970 && year <= 2200) return { year, month }
  }
  const now = new Date()
  return { year: now.getFullYear(), month: now.getMonth() }
}

export const ymOf = (year: number, month: number) => {
  const d = new Date(utc(year, month, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

export type DayTask = { id: number; title: string; done: boolean; project_id: number; project_name: string }

export type DayCell = {
  date: string
  day: number
  inMonth: boolean
  isToday: boolean
  holiday: string | null
  isSunday: boolean
  isSaturday: boolean
  events: ScheduleEvent[]
  tasks: DayTask[]
}

export type MonthData = {
  ym: string
  year: number
  month: number
  title: string
  cells: DayCell[]
}

function gridRange(year: number, month: number) {
  const firstOfMonth = utc(year, month, 1)
  const lead = (new Date(firstOfMonth).getUTCDay() + 6) % 7 // 월요일 시작
  const gridStart = firstOfMonth - lead * MS_DAY
  const daysInMonth = new Date(utc(year, month + 1, 0)).getUTCDate()
  const cellCount = Math.ceil((lead + daysInMonth) / 7) * 7
  return { gridStart, cellCount, gridEnd: gridStart + (cellCount - 1) * MS_DAY }
}

/** 한 달치 달력 데이터를 통째로 만든다. 무한 스크롤에서 월 단위로 붙인다. */
export async function buildMonth(year: number, month: number): Promise<MonthData> {
  const { gridStart, gridEnd, cellCount } = gridRange(year, month)

  const [eventRows, taskRows] = await Promise.all([
    sql`
      SELECT e.id, e.category_id, e.title, e.memo, e.body_html, e.updated_by,
             to_char(e.event_date, 'YYYY-MM-DD') AS event_date,
             to_char(e.event_time, 'HH24:MI')    AS event_time,
             to_char(e.updated_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS') AS updated_at,
             c.name                    AS category_name,
             coalesce(c.color, 'gray') AS color
      FROM schedule_events e LEFT JOIN event_categories c ON c.id = e.category_id
      WHERE e.event_date BETWEEN ${iso(gridStart)} AND ${iso(gridEnd)}
      ORDER BY e.event_time ASC NULLS LAST, e.id ASC
    `,
    sql`
      SELECT t.id, t.title, t.done, t.project_id, p.name AS project_name,
             to_char(t.due_date, 'YYYY-MM-DD') AS due_date
      FROM project_tasks t JOIN projects p ON p.id = t.project_id
      WHERE t.due_date BETWEEN ${iso(gridStart)} AND ${iso(gridEnd)}
      ORDER BY t.done ASC, t.id ASC
    `,
  ])

  const events = eventRows as ScheduleEvent[]
  const tasks = taskRows as (DayTask & { due_date: string })[]

  const today = todayIso()
  const byDate = new Map<string, DayCell>()

  const cells: DayCell[] = Array.from({ length: cellCount }, (_, i) => {
    const t = gridStart + i * MS_DAY
    const date = iso(t)
    const weekday = new Date(t).getUTCDay()
    const cell: DayCell = {
      date,
      day: new Date(t).getUTCDate(),
      inMonth: new Date(t).getUTCMonth() === month,
      isToday: date === today,
      holiday: holidayName(date),
      isSunday: weekday === 0,
      isSaturday: weekday === 6,
      events: [],
      tasks: [],
    }
    byDate.set(date, cell)
    return cell
  })

  for (const e of events) byDate.get(e.event_date)?.events.push(e)
  for (const t of tasks) byDate.get(t.due_date)?.tasks.push(t)

  return { ym: ymOf(year, month), year, month, title: `${year}년 ${month + 1}월`, cells }
}

/** 기준 달에서 offset 만큼 떨어진 달 */
export function shiftMonth(year: number, month: number, offset: number) {
  const d = new Date(utc(year, month + offset, 1))
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() }
}
