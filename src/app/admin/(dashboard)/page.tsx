import Link from 'next/link'
import Icon from '@/components/admin/Icon'
import { sql, ensureSchema, type ProjectStatus } from '@/lib/db'
import { Card, EmptyState, PageHeader, ProgressBar, SectionTitle, StatusBadge } from '@/components/admin/ui'
import { toggleTask } from '../actions'

export const dynamic = 'force-dynamic'

type ActiveProject = { id: number; name: string; status: ProjectStatus; progress: number; client_name: string | null }
type OpenTask = { id: number; title: string; due_date: string | null; project_id: number; project_name: string }

function dueLabel(due: string | null): { text: string; tone: string } | null {
  if (!due) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(`${due}T00:00:00`) // 'YYYY-MM-DD'만 주면 UTC로 해석된다
  const diff = Math.round((d.getTime() - today.getTime()) / 86_400_000)
  if (diff < 0) return { text: `${Math.abs(diff)}일 지남`, tone: 'text-red-600' }
  if (diff === 0) return { text: '오늘', tone: 'text-brand' }
  if (diff === 1) return { text: '내일', tone: 'text-ink-soft' }
  return { text: `${diff}일 남음`, tone: 'text-ink-muted' }
}

export default async function DashboardPage() {
  await ensureSchema()

  const [stats] = (await sql`
    SELECT
      (SELECT count(*) FROM projects WHERE status <> 'done')                AS active_projects,
      (SELECT count(*) FROM clients)                                        AS total_clients,
      (SELECT count(*) FROM project_tasks WHERE done = false)               AS open_tasks,
      (SELECT count(*) FROM project_tasks WHERE done = false AND due_date <= current_date) AS due_tasks
  `) as { active_projects: number; total_clients: number; open_tasks: number; due_tasks: number }[]

  const projects = (await sql`
    SELECT p.id, p.name, p.status, p.progress, c.name AS client_name
    FROM projects p LEFT JOIN clients c ON c.id = p.client_id
    WHERE p.status <> 'done'
    ORDER BY p.updated_at DESC
    LIMIT 6
  `) as ActiveProject[]

  const tasks = (await sql`
    SELECT t.id, t.title, to_char(t.due_date, 'YYYY-MM-DD') AS due_date, t.project_id, p.name AS project_name
    FROM project_tasks t JOIN projects p ON p.id = t.project_id
    WHERE t.done = false
    ORDER BY t.due_date ASC NULLS LAST, t.created_at ASC
    LIMIT 8
  `) as OpenTask[]

  const cards = [
    { label: '진행중 프로젝트', value: Number(stats.active_projects) },
    { label: '클라이언트', value: Number(stats.total_clients) },
    { label: '남은 할 일', value: Number(stats.open_tasks) },
    { label: '오늘까지 마감', value: Number(stats.due_tasks) },
  ]

  return (
    <>
      <PageHeader title="대시보드" subtitle="오늘 챙겨야 할 것들을 한눈에 봅니다." />

      <div className="mb-9 grid grid-cols-2 gap-3 md:grid-cols-4">
        {cards.map(c => (
          <Card key={c.label} className="!p-4">
            <div className="text-xs text-ink-muted">{c.label}</div>
            <div className="mt-1.5 text-2xl font-semibold tracking-tight text-ink">{c.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <section>
          <SectionTitle count={tasks.length}>오늘 할 일</SectionTitle>
          {tasks.length === 0 ? (
            <EmptyState>남은 할 일이 없습니다.</EmptyState>
          ) : (
            <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
              {tasks.map(t => {
                const due = dueLabel(t.due_date)
                return (
                  <li key={t.id} className="group flex items-center gap-3 px-4 py-2.5">
                    <form action={toggleTask} className="flex">
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="project_id" value={t.project_id} />
                      <button type="submit" aria-label="완료 처리" className="text-ink-muted transition hover:text-brand">
                        <Icon name="checkCircleLine" className="size-[18px]" />
                      </button>
                    </form>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm text-ink">{t.title}</div>
                      <Link
                        href={`/admin/projects?open=${t.project_id}`}
                        className="text-xs text-ink-muted transition hover:text-ink-soft"
                      >
                        {t.project_name}
                      </Link>
                    </div>
                    {due && <span className={`shrink-0 text-xs ${due.tone}`}>{due.text}</span>}
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section>
          <SectionTitle count={projects.length}>진행중 프로젝트</SectionTitle>
          {projects.length === 0 ? (
            <EmptyState>
              아직 프로젝트가 없습니다.{' '}
              <Link href="/admin/projects" className="text-ink underline underline-offset-2">
                만들러 가기
              </Link>
            </EmptyState>
          ) : (
            <ul className="flex flex-col gap-2">
              {projects.map(p => (
                <li key={p.id}>
                  <Link
                    href={`/admin/projects?open=${p.id}`}
                    className="group block rounded-xl border border-line bg-surface p-4 transition hover:border-ink-muted/40 hover:shadow-[0_1px_3px_rgba(15,15,15,0.06)]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-ink">{p.name}</span>
                      <StatusBadge status={p.status} />
                      <Icon name="arrowRight" className="ml-auto size-4 shrink-0 text-ink-muted opacity-0 transition group-hover:opacity-100" />
                    </div>
                    <div className="mt-1 truncate text-xs text-ink-muted">{p.client_name ?? '클라이언트 미지정'}</div>
                    <div className="mt-3 flex items-center gap-2.5">
                      <ProgressBar value={p.progress} />
                      <span className="shrink-0 text-xs tabular-nums text-ink-muted">{p.progress}%</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <p className="mt-10 flex items-center gap-1.5 text-xs text-ink-muted">
        <Icon name="checkCircle" className="size-3.5" />
        할 일 왼쪽 동그라미를 누르면 바로 완료 처리됩니다.
      </p>
    </>
  )
}
