import { ensureSchema, sql, type EventCategory } from '@/lib/db'
import { PageHeader, SectionTitle } from '@/components/admin/ui'
import CategoryEditor from '@/components/admin/CategoryEditor'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  await ensureSchema()

  const [categoryRows, usageRows] = await Promise.all([
    sql`SELECT id, name, color, position FROM event_categories ORDER BY position, id`,
    sql`SELECT category_id, count(*)::int AS count FROM schedule_events WHERE category_id IS NOT NULL GROUP BY category_id`,
  ])

  const categories = categoryRows as EventCategory[]
  const usage = Object.fromEntries(
    (usageRows as { category_id: number; count: number }[]).map(r => [r.category_id, r.count]),
  )

  return (
    <>
      <PageHeader title="설정" subtitle="스케줄 달력에서 쓰는 카테고리를 관리합니다." />

      <section>
        <SectionTitle count={categories.length}>일정 카테고리</SectionTitle>
        <CategoryEditor categories={categories} usage={usage} />
        <p className="mt-3 text-xs text-ink-muted">
          카테고리를 삭제해도 등록된 일정은 지워지지 않습니다. 카테고리만 <b>미지정</b>으로 바뀌고 회색으로 표시됩니다.
        </p>
      </section>
    </>
  )
}
