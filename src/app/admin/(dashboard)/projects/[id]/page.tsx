import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, Circle, CheckCircle2, Trash2 } from 'lucide-react'
import { sql, ensureSchema, STATUS_LABEL, type Project, type ProjectNote, type ProjectTask } from '@/lib/db'
import { Button, Card, Field, Input, SectionTitle, Select, Textarea } from '@/components/admin/ui'
import ProgressInput from '@/components/admin/ProgressInput'
import { addNote, addTask, deleteNote, deleteProject, deleteTask, toggleTask, updateProject } from '../../../actions'

export const dynamic = 'force-dynamic'

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await ensureSchema()
  const id = Number.parseInt((await params).id, 10)
  if (!Number.isFinite(id)) notFound()

  const [project] = (await sql`
    SELECT id, client_id, name, status, progress, description, created_at, updated_at,
           to_char(start_date, 'YYYY-MM-DD') AS start_date,
           to_char(due_date, 'YYYY-MM-DD')   AS due_date
    FROM projects WHERE id = ${id}
  `) as Project[]
  if (!project) notFound()

  const clients = (await sql`SELECT id, name FROM clients ORDER BY name`) as { id: number; name: string }[]
  const tasks = (await sql`
    SELECT id, project_id, title, done, position, to_char(due_date, 'YYYY-MM-DD') AS due_date
    FROM project_tasks WHERE project_id = ${id}
    ORDER BY done ASC, due_date ASC NULLS LAST, created_at ASC
  `) as ProjectTask[]
  const notes = (await sql`
    SELECT * FROM project_notes WHERE project_id = ${id} ORDER BY created_at DESC
  `) as ProjectNote[]

  return (
    <>
      <Link
        href="/admin/projects"
        className="mb-5 inline-flex items-center gap-1 text-sm text-ink-muted transition hover:text-ink"
      >
        <ChevronLeft className="size-4" />
        프로젝트
      </Link>

      <form action={updateProject} className="mb-9">
        <input type="hidden" name="id" value={project.id} />

        <input
          name="name"
          defaultValue={project.name}
          className="-ml-1 w-full rounded-md border border-transparent bg-transparent px-1 text-[30px] leading-tight font-semibold tracking-tight text-ink outline-none transition hover:border-line focus:border-brand"
        />

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Field label="클라이언트">
            <Select name="client_id" defaultValue={project.client_id ?? ''}>
              <option value="">미지정</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="상태">
            <Select name="status" defaultValue={project.status}>
              {Object.entries(STATUS_LABEL).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </Select>
          </Field>
          <Field label="시작일">
            <Input name="start_date" type="date" defaultValue={project.start_date ?? ''} />
          </Field>
          <Field label="마감일">
            <Input name="due_date" type="date" defaultValue={project.due_date ?? ''} />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="진척도">
            <ProgressInput defaultValue={project.progress} />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="설명">
            <Textarea name="description" rows={3} defaultValue={project.description ?? ''} placeholder="프로젝트 개요, 범위, 참고 링크 등" />
          </Field>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button type="submit">저장</Button>
          <span className="text-xs text-ink-muted">최근 수정 {formatDateTime(project.updated_at)}</span>
        </div>
      </form>

      <div className="grid gap-9 lg:grid-cols-2">
        <section>
          <SectionTitle count={tasks.filter(t => !t.done).length}>할 일</SectionTitle>

          <form action={addTask} className="mb-3 flex flex-wrap gap-2">
            <input type="hidden" name="project_id" value={project.id} />
            <Input name="title" placeholder="오늘 할 일을 적어보세요" className="min-w-[180px] flex-1" />
            <Input name="due_date" type="date" className="w-[150px] shrink-0" />
            <Button type="submit" variant="ghost" className="shrink-0">추가</Button>
          </form>

          {tasks.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-muted">할 일이 없습니다.</p>
          ) : (
            <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
              {tasks.map(t => (
                <li key={t.id} className="group flex items-center gap-3 px-4 py-2.5">
                  <form action={toggleTask} className="flex shrink-0">
                    <input type="hidden" name="id" value={t.id} />
                    <input type="hidden" name="project_id" value={project.id} />
                    <button type="submit" aria-label={t.done ? '완료 취소' : '완료 처리'} className="transition">
                      {t.done ? (
                        <CheckCircle2 className="size-[18px] text-brand" />
                      ) : (
                        <Circle className="size-[18px] text-ink-muted hover:text-brand" />
                      )}
                    </button>
                  </form>
                  <span className={`min-w-0 flex-1 truncate text-sm ${t.done ? 'text-ink-muted line-through' : 'text-ink'}`}>
                    {t.title}
                  </span>
                  {t.due_date && <span className="shrink-0 text-xs tabular-nums text-ink-muted">{t.due_date}</span>}
                  <form action={deleteTask} className="flex shrink-0">
                    <input type="hidden" name="id" value={t.id} />
                    <input type="hidden" name="project_id" value={project.id} />
                    <button type="submit" aria-label="삭제" className="text-ink-muted opacity-0 transition group-hover:opacity-100 hover:text-red-600">
                      <Trash2 className="size-4" />
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <SectionTitle count={notes.length}>메모</SectionTitle>

          <form action={addNote} className="mb-3">
            <input type="hidden" name="project_id" value={project.id} />
            <Textarea name="body" rows={3} placeholder="진행 상황, 회의 내용, 결정 사항을 기록하세요." />
            <Button type="submit" variant="ghost" className="mt-2">기록하기</Button>
          </form>

          {notes.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-muted">기록된 메모가 없습니다.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {notes.map(n => (
                <li key={n.id} className="group">
                  <Card className="!p-4">
                    <div className="mb-1.5 flex items-center justify-between">
                      <time className="text-xs text-ink-muted">{formatDateTime(n.created_at)}</time>
                      <form action={deleteNote}>
                        <input type="hidden" name="id" value={n.id} />
                        <input type="hidden" name="project_id" value={project.id} />
                        <button type="submit" aria-label="삭제" className="text-ink-muted opacity-0 transition group-hover:opacity-100 hover:text-red-600">
                          <Trash2 className="size-3.5" />
                        </button>
                      </form>
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-ink">{n.body}</p>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <form action={deleteProject} className="mt-14 border-t border-line pt-5">
        <input type="hidden" name="id" value={project.id} />
        <Button type="submit" variant="danger">
          <Trash2 className="size-4" />
          프로젝트 삭제
        </Button>
        <p className="mt-2 text-xs text-ink-muted">할 일과 메모도 함께 삭제됩니다.</p>
      </form>
    </>
  )
}
