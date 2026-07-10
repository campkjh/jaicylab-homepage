'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { sql, ensureSchema } from '@/lib/db'
import { requireAdmin } from '@/lib/session'
import { SESSION_COOKIE, createSession, authenticate } from '@/lib/auth'
import { encrypt, decrypt, last4 } from '@/lib/crypto'

function str(fd: FormData, k: string): string {
  const v = fd.get(k)
  return typeof v === 'string' ? v.trim() : ''
}
function nullable(fd: FormData, k: string): string | null {
  return str(fd, k) || null
}
function int(fd: FormData, k: string, fallback = 0): number {
  const n = Number.parseInt(str(fd, k), 10)
  return Number.isFinite(n) ? n : fallback
}

// ─────────────────────────── 인증

export async function login(_prev: string | null, fd: FormData): Promise<string | null> {
  const password = str(fd, 'password')
  const next = str(fd, 'next') || '/admin'
  if (!password) return '비밀번호를 입력해 주세요.'

  const name = await authenticate(password)
  if (!name) return '비밀번호가 올바르지 않습니다.'

  const { value, maxAge } = await createSession(name)
  const jar = await cookies()
  jar.set(SESSION_COOKIE, value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  })
  redirect(next.startsWith('/admin') ? next : '/admin')
}

export async function logout(): Promise<void> {
  const jar = await cookies()
  jar.delete(SESSION_COOKIE)
  redirect('/admin/login')
}

// ─────────────────────────── 프로젝트

export async function createProject(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  const clientId = int(fd, 'client_id', 0)
  const rows = (await sql`
    INSERT INTO projects (name, client_id, status, description, start_date, due_date)
    VALUES (${str(fd, 'name') || '제목 없는 프로젝트'}, ${clientId || null}, ${str(fd, 'status') || 'planning'},
            ${nullable(fd, 'description')}, ${nullable(fd, 'start_date')}, ${nullable(fd, 'due_date')})
    RETURNING id
  `) as { id: number }[]
  revalidatePath('/admin')
  revalidatePath('/admin/projects')
  redirect(`/admin/projects/${rows[0].id}`)
}

export async function updateProject(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  const id = int(fd, 'id')
  const progress = Math.min(100, Math.max(0, int(fd, 'progress')))
  const clientId = int(fd, 'client_id', 0)
  await sql`
    UPDATE projects SET
      name = ${str(fd, 'name') || '제목 없는 프로젝트'},
      client_id = ${clientId || null},
      status = ${str(fd, 'status') || 'planning'},
      progress = ${progress},
      description = ${nullable(fd, 'description')},
      start_date = ${nullable(fd, 'start_date')},
      due_date = ${nullable(fd, 'due_date')},
      updated_at = now()
    WHERE id = ${id}
  `
  revalidatePath('/admin')
  revalidatePath('/admin/projects')
  revalidatePath(`/admin/projects/${id}`)
}

export async function deleteProject(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  await sql`DELETE FROM projects WHERE id = ${int(fd, 'id')}`
  revalidatePath('/admin')
  revalidatePath('/admin/projects')
  redirect('/admin/projects')
}

// ─────────────────────────── 할 일 / 메모

export async function addTask(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  const projectId = int(fd, 'project_id')
  const title = str(fd, 'title')
  if (!title) return
  await sql`
    INSERT INTO project_tasks (project_id, title, due_date)
    VALUES (${projectId}, ${title}, ${nullable(fd, 'due_date')})
  `
  revalidatePath('/admin')
  revalidatePath(`/admin/projects/${projectId}`)
}

export async function toggleTask(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  const id = int(fd, 'id')
  const projectId = int(fd, 'project_id')
  await sql`UPDATE project_tasks SET done = NOT done WHERE id = ${id}`
  revalidatePath('/admin')
  revalidatePath(`/admin/projects/${projectId}`)
}

export async function deleteTask(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  const projectId = int(fd, 'project_id')
  await sql`DELETE FROM project_tasks WHERE id = ${int(fd, 'id')}`
  revalidatePath('/admin')
  revalidatePath(`/admin/projects/${projectId}`)
}

export async function addNote(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  const projectId = int(fd, 'project_id')
  const body = str(fd, 'body')
  if (!body) return
  await sql`INSERT INTO project_notes (project_id, body) VALUES (${projectId}, ${body})`
  revalidatePath(`/admin/projects/${projectId}`)
}

export async function deleteNote(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  const projectId = int(fd, 'project_id')
  await sql`DELETE FROM project_notes WHERE id = ${int(fd, 'id')}`
  revalidatePath(`/admin/projects/${projectId}`)
}

// ─────────────────────────── 스케줄

export async function createEvent(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  const title = str(fd, 'title')
  const date = str(fd, 'event_date')
  if (!title || !date) return
  const categoryId = int(fd, 'category_id', 0)
  await sql`
    INSERT INTO schedule_events (title, event_date, event_time, category_id, memo)
    VALUES (${title}, ${date}, ${nullable(fd, 'event_time')}, ${categoryId || null}, ${nullable(fd, 'memo')})
  `
  revalidatePath('/admin/schedule')
}

export async function updateEvent(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  const id = int(fd, 'id')
  const categoryId = int(fd, 'category_id', 0)
  await sql`
    UPDATE schedule_events SET
      title = ${str(fd, 'title') || '제목 없는 일정'},
      event_date = ${str(fd, 'event_date')},
      event_time = ${nullable(fd, 'event_time')},
      category_id = ${categoryId || null},
      memo = ${nullable(fd, 'memo')}
    WHERE id = ${id}
  `
  revalidatePath('/admin/schedule')
}

export async function deleteEvent(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  await sql`DELETE FROM schedule_events WHERE id = ${int(fd, 'id')}`
  revalidatePath('/admin/schedule')
}

// ─────────────────────────── 일정 카테고리 (설정)

export async function createCategory(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  const name = str(fd, 'name')
  if (!name) return
  const rows = (await sql`SELECT coalesce(max(position), -1) + 1 AS next FROM event_categories`) as { next: number }[]
  await sql`
    INSERT INTO event_categories (name, color, position)
    VALUES (${name}, ${str(fd, 'color') || 'blue'}, ${rows[0].next})
  `
  revalidatePath('/admin/settings')
  revalidatePath('/admin/schedule')
}

export async function updateCategory(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  const name = str(fd, 'name')
  if (!name) return
  await sql`
    UPDATE event_categories SET name = ${name}, color = ${str(fd, 'color') || 'blue'}
    WHERE id = ${int(fd, 'id')}
  `
  revalidatePath('/admin/settings')
  revalidatePath('/admin/schedule')
}

/** 카테고리를 지워도 일정은 남는다. (category_id 가 NULL 이 되어 회색으로 표시) */
export async function deleteCategory(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  await sql`DELETE FROM event_categories WHERE id = ${int(fd, 'id')}`
  revalidatePath('/admin/settings')
  revalidatePath('/admin/schedule')
}

// ─────────────────────────── 클라이언트

export async function createClient(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  const rows = (await sql`
    INSERT INTO clients (name, company, contact_name, phone, email, business_number, ceo_name, address, memo)
    VALUES (${str(fd, 'name') || '이름 없는 클라이언트'}, ${nullable(fd, 'company')}, ${nullable(fd, 'contact_name')},
            ${nullable(fd, 'phone')}, ${nullable(fd, 'email')}, ${nullable(fd, 'business_number')},
            ${nullable(fd, 'ceo_name')}, ${nullable(fd, 'address')}, ${nullable(fd, 'memo')})
    RETURNING id
  `) as { id: number }[]
  revalidatePath('/admin/clients')
  redirect(`/admin/clients/${rows[0].id}`)
}

export async function updateClient(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  const id = int(fd, 'id')
  await sql`
    UPDATE clients SET
      name = ${str(fd, 'name') || '이름 없는 클라이언트'},
      company = ${nullable(fd, 'company')},
      contact_name = ${nullable(fd, 'contact_name')},
      phone = ${nullable(fd, 'phone')},
      email = ${nullable(fd, 'email')},
      business_number = ${nullable(fd, 'business_number')},
      ceo_name = ${nullable(fd, 'ceo_name')},
      address = ${nullable(fd, 'address')},
      memo = ${nullable(fd, 'memo')},
      updated_at = now()
    WHERE id = ${id}
  `
  revalidatePath('/admin/clients')
  revalidatePath(`/admin/clients/${id}`)
}

export async function deleteClient(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  await sql`DELETE FROM clients WHERE id = ${int(fd, 'id')}`
  revalidatePath('/admin/clients')
  redirect('/admin/clients')
}

// ─────────────────────────── 계정 / 카드 (민감정보)

export async function addAccount(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  const clientId = int(fd, 'client_id')
  const label = str(fd, 'label')
  if (!label) return
  const password = str(fd, 'password')
  await sql`
    INSERT INTO client_accounts (client_id, category, label, url, username, password_enc, memo)
    VALUES (${clientId}, ${str(fd, 'category') || 'etc'}, ${label}, ${nullable(fd, 'url')},
            ${nullable(fd, 'username')}, ${password ? encrypt(password) : null}, ${nullable(fd, 'memo')})
  `
  revalidatePath(`/admin/clients/${clientId}`)
}

export async function deleteAccount(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  const clientId = int(fd, 'client_id')
  await sql`DELETE FROM client_accounts WHERE id = ${int(fd, 'id')}`
  revalidatePath(`/admin/clients/${clientId}`)
}

export async function addCard(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  const clientId = int(fd, 'client_id')
  const label = str(fd, 'label')
  if (!label) return
  const number = str(fd, 'number')
  const expiry = str(fd, 'expiry')
  const cvc = str(fd, 'cvc')
  await sql`
    INSERT INTO client_cards (client_id, label, brand, holder, last4, number_enc, expiry_enc, cvc_enc, memo)
    VALUES (${clientId}, ${label}, ${nullable(fd, 'brand')}, ${nullable(fd, 'holder')},
            ${number ? last4(number) : null}, ${number ? encrypt(number) : null},
            ${expiry ? encrypt(expiry) : null}, ${cvc ? encrypt(cvc) : null}, ${nullable(fd, 'memo')})
  `
  revalidatePath(`/admin/clients/${clientId}`)
}

export async function deleteCard(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  const clientId = int(fd, 'client_id')
  await sql`DELETE FROM client_cards WHERE id = ${int(fd, 'id')}`
  revalidatePath(`/admin/clients/${clientId}`)
}

/** 마스킹된 값을 눌렀을 때만 복호화해서 내려준다. 목록 응답에는 절대 싣지 않는다. */
export async function revealSecret(
  kind: 'account_password' | 'card_number' | 'card_expiry' | 'card_cvc',
  id: number,
): Promise<string> {
  await requireAdmin()
  await ensureSchema()
  if (kind === 'account_password') {
    const rows = (await sql`SELECT password_enc FROM client_accounts WHERE id = ${id}`) as { password_enc: string | null }[]
    return decrypt(rows[0]?.password_enc ?? null)
  }
  const rows = (await sql`
    SELECT number_enc, expiry_enc, cvc_enc FROM client_cards WHERE id = ${id}
  `) as { number_enc: string | null; expiry_enc: string | null; cvc_enc: string | null }[]
  const row = rows[0]
  if (!row) return ''
  if (kind === 'card_number') return decrypt(row.number_enc)
  if (kind === 'card_expiry') return decrypt(row.expiry_enc)
  return decrypt(row.cvc_enc)
}
