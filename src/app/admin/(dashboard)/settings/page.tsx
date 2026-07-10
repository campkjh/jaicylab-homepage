import { ensureSchema, sql, type EventCategory } from '@/lib/db'
import { requireAdmin } from '@/lib/session'
import { PageHeader, SectionTitle } from '@/components/admin/ui'
import CategoryEditor from '@/components/admin/CategoryEditor'
import AvatarUploader from '@/components/admin/AvatarUploader'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const admin = await requireAdmin()
  await ensureSchema()

  const [categoryRows, usageRows, profileRows] = await Promise.all([
    sql`SELECT id, name, color, position FROM event_categories ORDER BY position, id`,
    sql`SELECT category_id, count(*)::int AS count FROM schedule_events WHERE category_id IS NOT NULL GROUP BY category_id`,
    sql`SELECT avatar_url, position FROM admin_profiles WHERE name = ${admin}`,
  ])

  const categories = categoryRows as EventCategory[]
  const usage = Object.fromEntries(
    (usageRows as { category_id: number; count: number }[]).map(r => [r.category_id, r.count]),
  )
  const profile = (profileRows as { avatar_url: string | null; position: string | null }[])[0]

  return (
    <>
      <PageHeader title="설정" subtitle="내 프로필·직급과 스케줄 카테고리를 관리합니다." />

      <section className="mb-10">
        <SectionTitle>프로필</SectionTitle>
        <AvatarUploader name={admin} initialUrl={profile?.avatar_url ?? null} initialPosition={profile?.position ?? null} />
      </section>

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
