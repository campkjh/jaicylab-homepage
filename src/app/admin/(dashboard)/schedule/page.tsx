import { ensureSchema, sql, type EventCategory, type Timeline } from '@/lib/db'
import { adminNames } from '@/lib/auth'
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
      SELECT id, title, assignee, status, color, done, created_by
      FROM schedule_timelines
      ORDER BY done ASC,
               CASE coalesce(status, 'none')
                 WHEN 'urgent' THEN 0 WHEN 'in_progress' THEN 1 WHEN 'none' THEN 2
                 WHEN 'maintenance' THEN 3 WHEN 'hold' THEN 4 ELSE 2 END ASC,
               id DESC
    `,
  ])

  return (
    <ScheduleCalendar
      initialMonths={[before, current, after]}
      focusYm={current.ym}
      categories={categoryRows as EventCategory[]}
      todayIso={todayIso()}
      initialTimelines={timelineRows as Timeline[]}
      admins={adminNames()}
    />
  )
}
