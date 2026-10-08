import { ensureSchema, sql, type EventCategory, type TimelineStatusDef, type AccountCategory } from '@/lib/db'
import { requireAdmin, isOwnerAdmin, isScreenViewer } from '@/lib/session'
import { PageContainer, PageHeader, SectionTitle } from '@/components/admin/ui'
import CategoryEditor from '@/components/admin/CategoryEditor'
import TimelineStatusEditor from '@/components/admin/TimelineStatusEditor'
import AccountCategoryEditor from '@/components/admin/AccountCategoryEditor'
import AvatarUploader from '@/components/admin/AvatarUploader'
import AccessLogTable, { type AccessSummary, type AccessDay } from '@/components/admin/AccessLogTable'
import RemoteScreen from '@/components/admin/RemoteScreen'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const admin = await requireAdmin()
  await ensureSchema()

  const [categoryRows, usageRows, statusRows, statusUsageRows, acctCatRows, acctUsageRows, profileRows] = await Promise.all([
    sql`SELECT id, name, color, position FROM event_categories ORDER BY position, id`,
    sql`SELECT category_id, count(*)::int AS count FROM schedule_events WHERE category_id IS NOT NULL GROUP BY category_id`,
    sql`SELECT id, key, label, color, is_done, position FROM timeline_statuses ORDER BY position, id`,
    sql`SELECT status, count(*)::int AS count FROM schedule_timelines WHERE status IS NOT NULL GROUP BY status`,
    sql`SELECT id, key, label, position FROM account_categories ORDER BY position, id`,
    sql`SELECT category, count(*)::int AS count FROM client_accounts GROUP BY category`,
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
  const acctCategories = acctCatRows as AccountCategory[]
  const acctUsage = Object.fromEntries(
    (acctUsageRows as { category: string; count: number }[]).map(r => [r.category, r.count]),
  )
  const profile = (profileRows as { avatar_url: string | null; position: string | null }[])[0]

  // 직원 접속로그 — 대표만 본다. 날짜 구분은 KST 기준(자정 넘긴 접속은 시작한 날로).
  const owner = isOwnerAdmin(admin)
  // 화면 자동 캡처를 끈 동안에는 '원격 화면 보기' 섹션도 숨긴다 (layout 의 스위치와 함께 켜고 끈다)
  const screenViewer = false && isScreenViewer(admin)
  const [summaryRows, dayRows, pageRows] = owner
    ? await Promise.all([
        sql`
          SELECT name,
                 SUM(CASE WHEN (started_at AT TIME ZONE 'Asia/Seoul')::date = (now() AT TIME ZONE 'Asia/Seoul')::date
                          THEN EXTRACT(EPOCH FROM (ended_at - started_at)) ELSE 0 END)::int AS today_sec,
                 SUM(CASE WHEN started_at > now() - interval '7 days'
                          THEN EXTRACT(EPOCH FROM (ended_at - started_at)) ELSE 0 END)::int AS week_sec,
                 SUM(CASE WHEN started_at > now() - interval '30 days'
                          THEN EXTRACT(EPOCH FROM (ended_at - started_at)) ELSE 0 END)::int AS month_sec,
                 MAX(ended_at) AS last_at
          FROM admin_sessions
          GROUP BY name
          ORDER BY month_sec DESC, name
        `,
        sql`
          SELECT name,
                 to_char((started_at AT TIME ZONE 'Asia/Seoul')::date, 'YYYY-MM-DD') AS day,
                 SUM(EXTRACT(EPOCH FROM (ended_at - started_at)))::int AS seconds,
                 COUNT(*)::int AS sessions,
                 MIN(started_at) AS first_at,
                 MAX(ended_at)   AS last_at
          FROM admin_sessions
          WHERE started_at > now() - interval '60 days'
          GROUP BY name, (started_at AT TIME ZONE 'Asia/Seoul')::date
          ORDER BY day DESC, name
          LIMIT 200
        `,
        sql`
          SELECT name, location,
                 SUM(EXTRACT(EPOCH FROM (ended_at - started_at)))::int AS seconds,
                 MAX(ended_at) AS last_at
          FROM admin_page_views
          WHERE started_at > now() - interval '7 days'
          GROUP BY name, location
          HAVING SUM(EXTRACT(EPOCH FROM (ended_at - started_at))) >= 30
          ORDER BY name, seconds DESC
        `,
      ])
    : [[], [], []]

  // 사람별로 페이지 묶기 (최근 7일, 체류 30초 이상만)
  type PageRow = { name: string; location: string; seconds: number; last_at: string }
  const pageByName = new Map<string, PageRow[]>()
  for (const r of pageRows as PageRow[]) {
    const arr = pageByName.get(r.name) ?? []
    arr.push(r)
    pageByName.set(r.name, arr)
  }
  const PAGE_LABEL: Record<string, string> = {
    '/admin': '대시보드', '/admin/schedule': '스케줄', '/admin/projects': '프로젝트',
    '/admin/clients': '계정', '/admin/quotes': '견적함', '/admin/contracts': '계약서',
    '/admin/phrases': '자주쓰는말', '/admin/settings': '설정',
  }
  const pageLabel = (loc: string) =>
    PAGE_LABEL[loc] ?? Object.entries(PAGE_LABEL).find(([k]) => loc.startsWith(k + '/'))?.[1] ?? loc
  const fmtDur = (sec: number) => {
    const s = Math.max(0, Math.round(sec))
    const h = Math.floor(s / 3600), m = Math.round((s % 3600) / 60)
    if (h && m) return `${h}시간 ${m}분`
    if (h) return `${h}시간`
    return `${m}분`
  }

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

      <section className="mb-10">
        <SectionTitle count={statuses.length}>타임라인 상태 태그</SectionTitle>
        <TimelineStatusEditor statuses={statuses} usage={statusUsage} />
        <p className="mt-3 text-xs text-ink-muted">
          타임라인 할 일에 붙이는 상태 태그입니다. 위아래 화살표로 순서를 바꾸면 목록 정렬 순서도 따라갑니다.
          <b> 완료</b>를 켠 태그를 붙인 할 일은 체크 완료 처리되어 다음 날 <b>지난 기록</b>으로 넘어갑니다.
          태그를 삭제해도 할 일은 남고, 그 태그만 <b>미지정</b>으로 바뀝니다.
        </p>
      </section>

      <section>
        <SectionTitle count={acctCategories.length}>계정 종류</SectionTitle>
        <AccountCategoryEditor categories={acctCategories} usage={acctUsage} />
        <p className="mt-3 text-xs text-ink-muted">
          계정 페이지에서 <b>+ 계정 추가</b> 시 고르는 종류입니다. 위아래 화살표로 순서를 바꾸면 드롭다운 순서도 따라갑니다.
          종류를 삭제해도 계정은 남고, 그 종류를 쓰던 계정은 <b>기타</b>로 옮겨집니다.
        </p>
      </section>

      {owner && (
        <section className="mt-10">
          <AccessLogTable summary={summaryRows as AccessSummary[]} days={dayRows as AccessDay[]} />
          <p className="mt-3 text-xs text-ink-muted">
            어드민 화면을 열어 둔 시간을 기준으로 집계합니다. 하트비트가 <b>10분</b> 넘게 끊기면 다음 접속으로 나뉩니다.
            자리를 비워도 창이 떠 있으면 접속으로 잡히니, 로그인 시각이 아니라 <b>화면을 띄워 둔 시간</b>으로 보세요.
          </p>
        </section>
      )}

      {screenViewer && (
        <section className="mt-10">
          <SectionTitle>원격 화면 보기</SectionTitle>
          <RemoteScreen />
          <p className="mt-3 text-xs text-ink-muted">
            정훈·채은공듀가 어드민 화면을 열어 둔 동안 10초마다 자동으로 저장됩니다(별도 조작 없음).
            어드민 화면 안쪽만 담기며 다른 탭·다른 앱은 담기지 않습니다. <b>하루가 지난 이미지는 자동으로 지워집니다</b>.
          </p>
        </section>
      )}

      {owner && pageByName.size > 0 && (
        <section className="mt-10">
          <SectionTitle count={pageByName.size}>화면별 사용 시간 (최근 7일)</SectionTitle>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[...pageByName.entries()].map(([name, rows]) => (
              <div key={name} className="rounded-xl border border-line bg-surface px-4 py-3.5">
                <div className="mb-2 text-sm font-semibold text-ink">{name}</div>
                <ul className="flex flex-col gap-1">
                  {rows.slice(0, 8).map(r => (
                    <li key={r.location} className="flex items-baseline justify-between gap-2 text-xs">
                      <span className="truncate text-ink-soft">{pageLabel(r.location)}</span>
                      <span className="shrink-0 tabular-nums text-ink-muted">{fmtDur(r.seconds)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </PageContainer>
  )
}
