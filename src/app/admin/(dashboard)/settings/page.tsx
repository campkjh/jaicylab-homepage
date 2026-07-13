import { ensureSchema, sql, type EventCategory, type TimelineStatusDef } from '@/lib/db'
import { requireAdmin } from '@/lib/session'
import { PageContainer, PageHeader, SectionTitle } from '@/components/admin/ui'
import CategoryEditor from '@/components/admin/CategoryEditor'
import TimelineStatusEditor from '@/components/admin/TimelineStatusEditor'
import AvatarUploader from '@/components/admin/AvatarUploader'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const admin = await requireAdmin()
  await ensureSchema()

  const [categoryRows, usageRows, statusRows, statusUsageRows, profileRows] = await Promise.all([
    sql`SELECT id, name, color, position FROM event_categories ORDER BY position, id`,
    sql`SELECT category_id, count(*)::int AS count FROM schedule_events WHERE category_id IS NOT NULL GROUP BY category_id`,
    sql`SELECT id, key, label, color, is_done, position FROM timeline_statuses ORDER BY position, id`,
    sql`SELECT status, count(*)::int AS count FROM schedule_timelines WHERE status IS NOT NULL GROUP BY status`,
    sql`SELECT avatar_url, position FROM admin_profiles WHERE name = ${admin}`,
  ])

  const categories = categoryRows as EventCategory[]
  const usage = Object.fromEntries(
    (usageRows as { category_id: number; count: number }[]).map(r => [r.category_id, r.count]),
  )
  const statuses = statusRows as TimelineStatusDef[]
  const statusUsage = Object.fromEntries(
    (statusUsageRows as { status: string; count: number }[]).map(r => [r.status, r.count]),
  )
  const profile = (profileRows as { avatar_url: string | null; position: string | null }[])[0]

  return (
    <PageContainer>
      <PageHeader title="설정" subtitle="내 프로필·직급과 스케줄 카테고리를 관리합니다." />

      <section className="mb-10">
        <SectionTitle>프로필</SectionTitle>
        <AvatarUploader name={admin} initialUrl={profile?.avatar_url ?? null} initialPosition={profile?.position ?? null} />
      </section>

      <section className="mb-10">
        <SectionTitle count={categories.length}>일정 카테고리</SectionTitle>
        <CategoryEditor categories={categories} usage={usage} />
        <p className="mt-3 text-xs text-ink-muted">
          카테고리를 삭제해도 등록된 일정은 지워지지 않습니다. 카테고리만 <b>미지정</b>으로 바뀌고 회색으로 표시됩니다.
        </p>
      </section>

      <section>
        <SectionTitle count={statuses.length}>타임라인 상태 태그</SectionTitle>
        <TimelineStatusEditor statuses={statuses} usage={statusUsage} />
        <p className="mt-3 text-xs text-ink-muted">
          타임라인 할 일에 붙이는 상태 태그입니다. 위아래 화살표로 순서를 바꾸면 목록 정렬 순서도 따라갑니다.
          <b> 완료</b>를 켠 태그를 붙인 할 일은 체크 완료 처리되어 다음 날 <b>지난 기록</b>으로 넘어갑니다.
          태그를 삭제해도 할 일은 남고, 그 태그만 <b>미지정</b>으로 바뀝니다.
        </p>
      </section>
    </PageContainer>
  )
}
