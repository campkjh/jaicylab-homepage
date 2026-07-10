import Link from 'next/link'
import { sql, ensureSchema, STATUS_LABEL, type ProjectStatus } from '@/lib/db'
import { Button, EmptyState, Field, Input, PageHeader, ProgressBar, Select, StatusBadge, Textarea } from '@/components/admin/ui'
import InlineCreate from '@/components/admin/InlineCreate'
import { createProject } from '../../actions'

export const dynamic = 'force-dynamic'

type Row = {
  id: number
  name: string
  status: ProjectStatus
  progress: number
  due_date: string | null
  client_name: string | null
  open_tasks: number
}

export default async function ProjectsPage() {
  await ensureSchema()

  const projects = (await sql`
    SELECT p.id, p.name, p.status, p.progress, to_char(p.due_date, 'YYYY-MM-DD') AS due_date, c.name AS client_name,
           (SELECT count(*) FROM project_tasks t WHERE t.project_id = p.id AND t.done = false) AS open_tasks
    FROM projects p LEFT JOIN clients c ON c.id = p.client_id
    ORDER BY (p.status = 'done'), p.updated_at DESC
  `) as Row[]

  const clients = (await sql`SELECT id, name FROM clients ORDER BY name`) as { id: number; name: string }[]

  return (
    <>
      <PageHeader
        title="프로젝트"
        subtitle="진척도와 오늘 할 일을 프로젝트별로 기록합니다."
        action={
          <InlineCreate label="새 프로젝트">
            <form action={createProject} className="flex flex-col gap-3">
              <Field label="프로젝트 이름">
                <Input name="name" autoFocus placeholder="예: 펫마일 앱 리뉴얼" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="클라이언트">
                  <Select name="client_id" defaultValue="">
                    <option value="">미지정</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="상태">
                  <Select name="status" defaultValue="planning">
                    {Object.entries(STATUS_LABEL).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="시작일">
                  <Input name="start_date" type="date" />
                </Field>
                <Field label="마감일">
                  <Input name="due_date" type="date" />
                </Field>
              </div>
              <Field label="설명">
                <Textarea name="description" rows={2} placeholder="어떤 프로젝트인가요?" />
              </Field>
              <Button type="submit" className="self-start">만들기</Button>
            </form>
          </InlineCreate>
        }
      />

      {projects.length === 0 ? (
        <EmptyState>아직 프로젝트가 없습니다. 오른쪽 위에서 첫 프로젝트를 만들어 보세요.</EmptyState>
      ) : (
        <div className="overflow-hidden rounded-xl border border-line bg-surface">
          <div className="hidden grid-cols-[1fr_140px_150px_90px] gap-4 border-b border-line px-4 py-2.5 text-[11px] font-medium tracking-wide text-ink-muted uppercase md:grid">
            <span>이름</span>
            <span>클라이언트</span>
            <span>진척도</span>
            <span className="text-right">마감</span>
          </div>
          <ul className="divide-y divide-line">
            {projects.map(p => (
              <li key={p.id}>
                <Link
                  href={`/admin/projects/${p.id}`}
                  className="flex flex-col gap-2 px-4 py-3 transition hover:bg-hover md:grid md:grid-cols-[1fr_140px_150px_90px] md:items-center md:gap-4"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate text-sm font-medium text-ink">{p.name}</span>
                    <StatusBadge status={p.status} />
                    {Number(p.open_tasks) > 0 && (
                      <span className="shrink-0 text-xs text-ink-muted">할 일 {Number(p.open_tasks)}</span>
                    )}
                  </div>
                  <span className="truncate text-xs text-ink-soft md:text-sm">{p.client_name ?? '—'}</span>
                  <div className="flex items-center gap-2">
                    <ProgressBar value={p.progress} />
                    <span className="w-8 shrink-0 text-right text-xs tabular-nums text-ink-muted">{p.progress}%</span>
                  </div>
                  <span className="text-xs text-ink-muted tabular-nums md:text-right">{p.due_date ? `마감 ${p.due_date}` : '—'}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
