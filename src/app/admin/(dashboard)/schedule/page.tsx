import { ensureSchema, sql, type EventCategory, type ScheduleEvent } from '@/lib/db'
import ScheduleCalendar, { type DayCell, type DayTask } from '@/components/admin/ScheduleCalendar'

export const dynamic = 'force-dynamic'

const MS_DAY = 86_400_000

/** 'YYYY-MM-DD' — 로컬 타임존에 흔들리지 않도록 UTC 기준으로만 다룬다. */
function iso(t: number): string {
  return new Date(t).toISOString().slice(0, 10)
}

function utc(y: number, m: number, d: number): number {
  return Date.UTC(y, m, d)
}

function parseMonth(ym: string | undefined): { year: number; month: number } {
  const m = /^(\d{4})-(\d{2})$/.exec(ym ?? '')
  if (m) {
    const year = Number(m[1])
    const month = Number(m[2]) - 1
    if (month >= 0 && month <= 11) return { year, month }
  }
  const now = new Date()
  return { year: now.getFullYear(), month: now.getMonth() }
}

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ ym?: string }>
}) {
  await ensureSchema()
  const { year, month } = parseMonth((await searchParams).ym)

  // 그리드는 월요일에서 시작한다. getUTCDay(): 일=0 → 월=0 으로 옮긴다.
  const firstOfMonth = utc(year, month, 1)
  const lead = (new Date(firstOfMonth).getUTCDay() + 6) % 7
  const gridStart = firstOfMonth - lead * MS_DAY
  const daysInMonth = new Date(utc(year, month + 1, 0)).getUTCDate()
  const weeks = Math.ceil((lead + daysInMonth) / 7)
  const cellCount = weeks * 7
  const gridEnd = gridStart + (cellCount - 1) * MS_DAY

  const [eventRows, taskRows, categoryRows] = await Promise.all([
    sql`
      SELECT e.id, e.category_id, e.title, e.memo,
             to_char(e.event_date, 'YYYY-MM-DD') AS event_date,
             to_char(e.event_time, 'HH24:MI')    AS event_time,
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
    sql`SELECT id, name, color, position FROM event_categories ORDER BY position, id`,
  ])

  const events = eventRows as ScheduleEvent[]
  const tasks = taskRows as (DayTask & { due_date: string })[]
  const categories = categoryRows as EventCategory[]

  const byDate = new Map<string, DayCell>()
  const todayIso = iso(Date.now() + new Date().getTimezoneOffset() * -60_000)

  const cells: DayCell[] = Array.from({ length: cellCount }, (_, i) => {
    const t = gridStart + i * MS_DAY
    const date = iso(t)
    const cell: DayCell = {
      date,
      day: new Date(t).getUTCDate(),
      inMonth: new Date(t).getUTCMonth() === month,
      isToday: date === todayIso,
      events: [],
      tasks: [],
    }
    byDate.set(date, cell)
    return cell
  })

  for (const e of events) byDate.get(e.event_date)?.events.push(e)
  for (const t of tasks) byDate.get(t.due_date)?.tasks.push(t)

  const prev = new Date(utc(year, month - 1, 1))
  const next = new Date(utc(year, month + 1, 1))
  const ymOf = (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`

  return (
    <ScheduleCalendar
      title={`${year}년 ${month + 1}월`}
      cells={cells}
      categories={categories}
      prevYm={ymOf(prev)}
      nextYm={ymOf(next)}
      todayIso={todayIso}
      eventCount={events.length}
    />
  )
}
