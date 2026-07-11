import { ensureSchema, sql, type EventCategory, type Timeline } from '@/lib/db'
import { buildMonth, parseYm, shiftMonth, todayIso } from '@/lib/calendar'
import ScheduleCalendar from '@/components/admin/ScheduleCalendar'

export const dynamic = 'force-dynamic'

export default async function SchedulePage({ searchParams }: { searchParams: Promise<{ ym?: string }> }) {
  await ensureSchema()
  const { year, month } = parseYm((await searchParams).ym)

  // 처음에 앞뒤 한 달씩 같이 그려야 스크롤이 양방향으로 자연스럽게 시작된다.
  const prev = shiftMonth(year, month, -1)
  const next = shiftMonth(year, month, 1)

  const [before, current, after, categoryRows, timelineRows] = await Promise.all([
    buildMonth(prev.year, prev.month),
    buildMonth(year, month),
    buildMonth(next.year, next.month),
    sql`SELECT id, name, color, position FROM event_categories ORDER BY position, id`,
    sql`
      SELECT id, title, color, done, created_by,
             to_char(start_date, 'YYYY-MM-DD') AS start_date,
             to_char(end_date, 'YYYY-MM-DD')   AS end_date
      FROM schedule_timelines
      ORDER BY done ASC, end_date ASC, id ASC
    `,
  ])

  return (
    <ScheduleCalendar
      initialMonths={[before, current, after]}
      focusYm={current.ym}
      categories={categoryRows as EventCategory[]}
      todayIso={todayIso()}
      initialTimelines={timelineRows as Timeline[]}
    />
  )
}
