import { ensureSchema, sql, type EventCategory, type Timeline, type TimelineStatusDef } from '@/lib/db'
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

  const [before, current, after, categoryRows, timelineRows, statusRows] = await Promise.all([
    buildMonth(prev.year, prev.month),
    buildMonth(year, month),
    buildMonth(next.year, next.month),
    sql`SELECT id, name, color, position FROM event_categories ORDER BY position, id`,
    sql`
      SELECT t.id, t.title, t.assignee, t.status, t.color, t.done, t.created_by,
             to_char(t.done_at AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD') AS done_at,
             s.label AS status_label, s.color AS status_color,
             coalesce(s.is_done, false) AS status_is_done
      FROM schedule_timelines t
      LEFT JOIN timeline_statuses s ON s.key = t.status
      WHERE NOT (
        coalesce(s.is_done, false) AND t.done_at IS NOT NULL
        AND (t.done_at AT TIME ZONE 'Asia/Seoul')::date < (now() AT TIME ZONE 'Asia/Seoul')::date
      )
      ORDER BY coalesce(s.position, 999999) ASC, t.id DESC
    `,
    sql`SELECT id, key, label, color, is_done, position FROM timeline_statuses ORDER BY position, id`,
  ])

  return (
    <ScheduleCalendar
      initialMonths={[before, current, after]}
      focusYm={current.ym}
      categories={categoryRows as EventCategory[]}
      todayIso={todayIso()}
      initialTimelines={timelineRows as Timeline[]}
      admins={adminNames()}
      timelineStatuses={statusRows as TimelineStatusDef[]}
    />
  )
}
