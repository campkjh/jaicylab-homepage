import { ensureSchema, sql, type EventCategory } from '@/lib/db'
import { buildMonth, parseYm, shiftMonth, todayIso } from '@/lib/calendar'
import ScheduleCalendar from '@/components/admin/ScheduleCalendar'

export const dynamic = 'force-dynamic'

export default async function SchedulePage({ searchParams }: { searchParams: Promise<{ ym?: string }> }) {
  await ensureSchema()
  const { year, month } = parseYm((await searchParams).ym)

  // 처음에 앞뒤 한 달씩 같이 그려야 스크롤이 양방향으로 자연스럽게 시작된다.
  const prev = shiftMonth(year, month, -1)
  const next = shiftMonth(year, month, 1)

  const [before, current, after, categoryRows] = await Promise.all([
    buildMonth(prev.year, prev.month),
    buildMonth(year, month),
    buildMonth(next.year, next.month),
    sql`SELECT id, name, color, position FROM event_categories ORDER BY position, id`,
  ])

  return (
    <ScheduleCalendar
      initialMonths={[before, current, after]}
      focusYm={current.ym}
      categories={categoryRows as EventCategory[]}
      todayIso={todayIso()}
    />
  )
}
