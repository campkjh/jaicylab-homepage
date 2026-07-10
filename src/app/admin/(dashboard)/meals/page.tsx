import { ensureSchema, sql } from '@/lib/db'
import { holidayName } from '@/lib/holidays'
import type { MealEntry } from '@/lib/types'
import MealCalendar, { type MealDayCell } from '@/components/admin/MealCalendar'

export const dynamic = 'force-dynamic'

const MS_DAY = 86_400_000

const iso = (t: number) => new Date(t).toISOString().slice(0, 10)
const utc = (y: number, m: number, d: number) => Date.UTC(y, m, d)

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

export default async function MealsPage({ searchParams }: { searchParams: Promise<{ ym?: string }> }) {
  await ensureSchema()
  const { year, month } = parseMonth((await searchParams).ym)

  const firstOfMonth = utc(year, month, 1)
  const lead = new Date(firstOfMonth).getUTCDay() // 일요일 시작 (0=일)
  const gridStart = firstOfMonth - lead * MS_DAY
  const daysInMonth = new Date(utc(year, month + 1, 0)).getUTCDate()
  const cellCount = Math.ceil((lead + daysInMonth) / 7) * 7
  const gridEnd = gridStart + (cellCount - 1) * MS_DAY

  const rows = (await sql`
    SELECT id, slot, title, memo, image_url, kcal, created_by,
           to_char(meal_date, 'YYYY-MM-DD') AS meal_date
    FROM meal_entries
    WHERE meal_date BETWEEN ${iso(gridStart)} AND ${iso(gridEnd)}
    ORDER BY meal_date,
             CASE slot WHEN 'breakfast' THEN 0 WHEN 'lunch' THEN 1 WHEN 'dinner' THEN 2 ELSE 3 END,
             id
  `) as MealEntry[]

  const byDate = new Map<string, MealDayCell>()
  const todayIso = iso(Date.now() + new Date().getTimezoneOffset() * -60_000)

  const cells: MealDayCell[] = Array.from({ length: cellCount }, (_, i) => {
    const t = gridStart + i * MS_DAY
    const date = iso(t)
    const weekday = new Date(t).getUTCDay()
    const cell: MealDayCell = {
      date,
      day: new Date(t).getUTCDate(),
      inMonth: new Date(t).getUTCMonth() === month,
      isToday: date === todayIso,
      holiday: holidayName(date),
      isSunday: weekday === 0,
      isSaturday: weekday === 6,
      meals: [],
    }
    byDate.set(date, cell)
    return cell
  })

  for (const m of rows) byDate.get(m.meal_date)?.meals.push(m)

  const totalKcal = rows
    .filter(m => m.meal_date.slice(0, 7) === `${year}-${String(month + 1).padStart(2, '0')}`)
    .reduce((sum, m) => sum + (m.kcal ?? 0), 0)

  const prev = new Date(utc(year, month - 1, 1))
  const next = new Date(utc(year, month + 1, 1))
  const ymOf = (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`

  return (
    <MealCalendar
      title={`${year}년 ${month + 1}월 식단`}
      cells={cells}
      prevYm={ymOf(prev)}
      nextYm={ymOf(next)}
      todayIso={todayIso}
      totalKcal={totalKcal}
    />
  )
}
