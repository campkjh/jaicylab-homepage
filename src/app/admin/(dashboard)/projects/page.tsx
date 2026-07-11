import { sql, ensureSchema, type Project, type ProjectNote, type ProjectTask } from '@/lib/db'
import ProjectsBoard, { type ProjectWithRelations } from '@/components/admin/ProjectsBoard'
import { PageContainer } from '@/components/admin/ui'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ open?: string }> }) {
  await ensureSchema()

  const [projectRows, taskRows, noteRows, clientRows] = await Promise.all([
    sql`
      SELECT p.id, p.client_id, p.name, p.status, p.progress, p.description, p.created_at, p.updated_at,
             to_char(p.start_date, 'YYYY-MM-DD') AS start_date,
             to_char(p.due_date, 'YYYY-MM-DD')   AS due_date,
             c.name AS client_name
      FROM projects p LEFT JOIN clients c ON c.id = p.client_id
      ORDER BY (p.status = 'done'), p.updated_at DESC
    `,
    sql`
      SELECT id, project_id, title, done, position, to_char(due_date, 'YYYY-MM-DD') AS due_date
      FROM project_tasks
      ORDER BY done ASC, due_date ASC NULLS LAST, created_at ASC
    `,
    sql`SELECT * FROM project_notes ORDER BY created_at DESC`,
    sql`SELECT id, name FROM clients ORDER BY name`,
  ])
  const projects = projectRows as (Project & { client_name: string | null })[]
  const tasks = taskRows as ProjectTask[]
  const notes = noteRows as ProjectNote[]
  const clients = clientRows as { id: number; name: string }[]

  const rows: ProjectWithRelations[] = projects.map(p => ({
    ...p,
    tasks: tasks.filter(t => t.project_id === p.id),
    notes: notes.filter(n => n.project_id === p.id),
  }))

  const open = Number.parseInt((await searchParams).open ?? '', 10)

  return (
    <PageContainer>
      <ProjectsBoard projects={rows} clients={clients} defaultOpenId={Number.isFinite(open) ? open : null} />
    </PageContainer>
  )
}
