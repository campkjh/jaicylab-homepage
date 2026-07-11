'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { sql, ensureSchema } from '@/lib/db'
import { requireAdmin } from '@/lib/session'
import { SESSION_COOKIE, createSession, authenticate, adminNames } from '@/lib/auth'
import { encrypt, decrypt, last4 } from '@/lib/crypto'
import { sanitizeHtml } from '@/lib/sanitize'
import { CATEGORY_LABEL } from '@/lib/types'
import type { EventColor, MealSlot, PresenceUser, ScheduleEvent, Timeline, TimelineStatus } from '@/lib/types'
import { buildMonth, parseYm, type MonthData } from '@/lib/calendar'

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
  await sql`
    INSERT INTO projects (name, client_id, status, description, start_date, due_date)
    VALUES (${str(fd, 'name') || '제목 없는 프로젝트'}, ${clientId || null}, ${str(fd, 'status') || 'planning'},
            ${nullable(fd, 'description')}, ${nullable(fd, 'start_date')}, ${nullable(fd, 'due_date')})
  `
  revalidatePath('/admin')
  revalidatePath('/admin/projects')
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
}

export async function deleteProject(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  await sql`DELETE FROM projects WHERE id = ${int(fd, 'id')}`
  revalidatePath('/admin')
  revalidatePath('/admin/projects')
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
  revalidatePath('/admin/projects')
}

export async function toggleTask(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  await sql`UPDATE project_tasks SET done = NOT done WHERE id = ${int(fd, 'id')}`
  revalidatePath('/admin')
  revalidatePath('/admin/projects')
}

export async function deleteTask(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  await sql`DELETE FROM project_tasks WHERE id = ${int(fd, 'id')}`
  revalidatePath('/admin')
  revalidatePath('/admin/projects')
}

export async function addNote(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  const projectId = int(fd, 'project_id')
  const body = str(fd, 'body')
  if (!body) return
  await sql`INSERT INTO project_notes (project_id, body) VALUES (${projectId}, ${body})`
  revalidatePath('/admin/projects')
}

export async function deleteNote(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  await sql`DELETE FROM project_notes WHERE id = ${int(fd, 'id')}`
  revalidatePath('/admin/projects')
}

// ─────────────────────────── 스케줄

/** 제목을 안 써도 되도록 "채은방방구띠" 같은 제목을 알아서 붙인다. */
const SILLY_TAILS = [
  '방방구띠', '몽글몽글', '반짝반짝', '두근두근', '쫀득쫀득', '살랑살랑',
  '꼬물꼬물', '폭신폭신', '우당탕탕', '아자아자', '호로록', '슝슝',
  '팔랑팔랑', '도리도리', '냠냠타임', '총총총',
]

/**
 * 팝업을 여는 순간 곧바로 저장되는 초안을 만든다.
 * 이후의 모든 편집은 autosaveEventMeta / autosaveEventBody 로 이어진다.
 */
export async function createEventDraft(date: string): Promise<ScheduleEvent> {
  const admin = await requireAdmin()
  await ensureSchema()
  const tail = SILLY_TAILS[Math.floor(Math.random() * SILLY_TAILS.length)]
  const rows = (await sql`
    INSERT INTO schedule_events (title, event_date, updated_by)
    VALUES (${`${admin}${tail}`}, ${date}, ${admin})
    RETURNING id, category_id, title, memo, body_html, updated_by,
              to_char(event_date, 'YYYY-MM-DD') AS event_date,
              to_char(event_time, 'HH24:MI')    AS event_time,
              to_char(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS') AS updated_at
  `) as (Omit<ScheduleEvent, 'color' | 'category_name'>)[]
  revalidatePath('/admin/schedule')
  return { ...rows[0], color: 'gray', category_name: null }
}

/** 제목·날짜·시간·카테고리를 입력하는 즉시 저장한다. 저장 버튼은 없다. */
export async function autosaveEventMeta(
  id: number,
  meta: { title: string; event_date: string; event_time: string | null; category_id: number | null },
): Promise<void> {
  const admin = await requireAdmin()
  await ensureSchema()
  if (!meta.event_date) return
  await sql`
    UPDATE schedule_events SET
      title = ${meta.title.trim() || '제목 없는 일정'},
      event_date = ${meta.event_date},
      event_time = ${meta.event_time || null},
      category_id = ${meta.category_id || null},
      updated_at = now(),
      updated_by = ${admin}
    WHERE id = ${id}
  `
  revalidatePath('/admin/schedule')
}

/** 에디터가 2초마다 부르는 자동 저장. 저장 후 남들이 폴링으로 받아간다. */
export async function autosaveEventBody(id: number, html: string): Promise<string> {
  const admin = await requireAdmin()
  await ensureSchema()
  const clean = sanitizeHtml(html)
  const rows = (await sql`
    UPDATE schedule_events
    SET body_html = ${clean || null}, updated_at = now(), updated_by = ${admin}
    WHERE id = ${id}
    RETURNING to_char(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS') AS updated_at
  `) as { updated_at: string }[]
  return rows[0]?.updated_at ?? ''
}

/** 다른 사람이 저장한 최신 본문을 가져온다. */
export async function fetchEventBody(id: number): Promise<{ html: string; updatedAt: string; updatedBy: string | null } | null> {
  await requireAdmin()
  await ensureSchema()
  const rows = (await sql`
    SELECT coalesce(body_html, '') AS body_html, updated_by,
           to_char(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS') AS updated_at
    FROM schedule_events WHERE id = ${id}
  `) as { body_html: string; updated_at: string; updated_by: string | null }[]
  const r = rows[0]
  return r ? { html: r.body_html, updatedAt: r.updated_at, updatedBy: r.updated_by } : null
}

/** 달력에서 일정 칩을 다른 날짜로 드래그해 옮긴다. */
export async function moveEvent(id: number, date: string): Promise<void> {
  const admin = await requireAdmin()
  await ensureSchema()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return
  await sql`
    UPDATE schedule_events SET event_date = ${date}, updated_at = now(), updated_by = ${admin}
    WHERE id = ${id}
  `
  revalidatePath('/admin/schedule')
}

/**
 * 식단 칩을 다른 날짜로 드래그해 옮긴다.
 * 옮겨간 날에 같은 때(점심 등) 식단이 이미 있으면 서로 날짜를 맞바꾼다(트레이드).
 */
export async function moveMeal(id: number, date: string): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return
  const [meal] = (await sql`
    SELECT id, slot, to_char(meal_date, 'YYYY-MM-DD') AS meal_date FROM meal_entries WHERE id = ${id}
  `) as { id: number; slot: string; meal_date: string }[]
  if (!meal || meal.meal_date === date) return

  const [partner] = (await sql`
    SELECT id FROM meal_entries
    WHERE meal_date = ${date} AND slot = ${meal.slot} AND id <> ${id}
    ORDER BY id LIMIT 1
  `) as { id: number }[]

  if (partner) await sql`UPDATE meal_entries SET meal_date = ${meal.meal_date} WHERE id = ${partner.id}`
  await sql`UPDATE meal_entries SET meal_date = ${date} WHERE id = ${id}`
  revalidatePath('/admin/schedule')
}

export async function deleteEvent(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  await sql`DELETE FROM schedule_events WHERE id = ${int(fd, 'id')}`
  revalidatePath('/admin/schedule')
}

// ─────────────────────────── 타임라인 (할 일 + 담당자 태그)

/** 담당자별로 색을 고정한다. 관리자 목록 순서대로 돌아간다. */
const TIMELINE_COLORS: EventColor[] = ['purple', 'blue', 'green', 'amber', 'red']

const TIMELINE_STATUSES: TimelineStatus[] = ['urgent', 'in_progress', 'maintenance', 'hold']

/** 긴급 > 진행중 > (미지정) > 유지보수 > 보류 순. 완료는 맨 아래. */
async function timelineList(): Promise<Timeline[]> {
  return (await sql`
    SELECT id, title, assignee, status, color, done, created_by
    FROM schedule_timelines
    ORDER BY done ASC,
             CASE coalesce(status, 'none')
               WHEN 'urgent' THEN 0 WHEN 'in_progress' THEN 1 WHEN 'none' THEN 2
               WHEN 'maintenance' THEN 3 WHEN 'hold' THEN 4 ELSE 2 END ASC,
             id DESC
  `) as Timeline[]
}

export async function listTimelines(): Promise<Timeline[]> {
  await requireAdmin()
  await ensureSchema()
  return timelineList()
}

/** 우측 패널 + 에서 만든다. 할 일을 적고 담당자·상태 태그를 고른다. */
export async function createTimeline(
  title: string,
  assignee: string | null,
  status: TimelineStatus | null = null,
): Promise<Timeline[]> {
  const admin = await requireAdmin()
  await ensureSchema()
  const clean = title.trim()
  if (!clean) return timelineList()
  const names = adminNames()
  const who = assignee && names.includes(assignee) ? assignee : null
  const color = who ? TIMELINE_COLORS[names.indexOf(who) % TIMELINE_COLORS.length] : 'gray'
  const st = status && TIMELINE_STATUSES.includes(status) ? status : null
  await sql`
    INSERT INTO schedule_timelines (title, assignee, status, color, created_by)
    VALUES (${clean}, ${who}, ${st}, ${color}, ${admin})
  `
  revalidatePath('/admin/schedule')
  return timelineList()
}

/** 항목의 상태 태그를 바꾼다. null 이면 태그를 뗀다. */
export async function setTimelineStatus(id: number, status: TimelineStatus | null): Promise<Timeline[]> {
  await requireAdmin()
  await ensureSchema()
  const st = status && TIMELINE_STATUSES.includes(status) ? status : null
  await sql`UPDATE schedule_timelines SET status = ${st} WHERE id = ${id}`
  revalidatePath('/admin/schedule')
  return timelineList()
}

/** 항목의 담당자 태그를 바꾼다. null 이면 태그를 뗀다. 색도 담당자를 따라간다. */
export async function setTimelineAssignee(id: number, assignee: string | null): Promise<Timeline[]> {
  await requireAdmin()
  await ensureSchema()
  const names = adminNames()
  const who = assignee && names.includes(assignee) ? assignee : null
  const color = who ? TIMELINE_COLORS[names.indexOf(who) % TIMELINE_COLORS.length] : 'gray'
  await sql`UPDATE schedule_timelines SET assignee = ${who}, color = ${color} WHERE id = ${id}`
  revalidatePath('/admin/schedule')
  return timelineList()
}

export async function toggleTimeline(id: number): Promise<Timeline[]> {
  await requireAdmin()
  await ensureSchema()
  await sql`UPDATE schedule_timelines SET done = NOT done WHERE id = ${id}`
  revalidatePath('/admin/schedule')
  return timelineList()
}

export async function deleteTimeline(id: number): Promise<Timeline[]> {
  await requireAdmin()
  await ensureSchema()
  await sql`DELETE FROM schedule_timelines WHERE id = ${id}`
  revalidatePath('/admin/schedule')
  return timelineList()
}

// ─────────────────────────── 자주 쓰는 말

export async function createPhrase(fd: FormData): Promise<void> {
  const admin = await requireAdmin()
  await ensureSchema()
  const body = str(fd, 'body')
  if (!body) return
  await sql`
    INSERT INTO quick_phrases (label, body, created_by)
    VALUES (${nullable(fd, 'label')}, ${body}, ${admin})
  `
  revalidatePath('/admin/phrases')
}

export async function updatePhrase(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  const body = str(fd, 'body')
  if (!body) return
  await sql`
    UPDATE quick_phrases SET label = ${nullable(fd, 'label')}, body = ${body}
    WHERE id = ${int(fd, 'id')}
  `
  revalidatePath('/admin/phrases')
}

export async function deletePhrase(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  await sql`DELETE FROM quick_phrases WHERE id = ${int(fd, 'id')}`
  revalidatePath('/admin/phrases')
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
  await sql`
    INSERT INTO clients (name, company, contact_name, phone, email, business_number, ceo_name, address, memo)
    VALUES (${str(fd, 'name') || '이름 없는 클라이언트'}, ${nullable(fd, 'company')}, ${nullable(fd, 'contact_name')},
            ${nullable(fd, 'phone')}, ${nullable(fd, 'email')}, ${nullable(fd, 'business_number')},
            ${nullable(fd, 'ceo_name')}, ${nullable(fd, 'address')}, ${nullable(fd, 'memo')})
  `
  revalidatePath('/admin/clients')
}

/** 계정 페이지의 이름 인라인 수정. 다른 필드는 건드리지 않는다. */
export async function renameClient(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  const name = str(fd, 'name')
  if (!name) return
  await sql`UPDATE clients SET name = ${name}, updated_at = now() WHERE id = ${int(fd, 'id')}`
  revalidatePath('/admin/clients')
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
}

export async function deleteClient(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  await sql`DELETE FROM clients WHERE id = ${int(fd, 'id')}`
  revalidatePath('/admin/clients')
}

// ─────────────────────────── 계정 / 카드 (민감정보)

export async function addAccount(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  const clientId = int(fd, 'client_id')
  // 간단 등록에선 이름을 따로 안 적는다. 종류 라벨(구글계정 등)을 그대로 쓴다.
  const label = str(fd, 'label') || CATEGORY_LABEL[str(fd, 'category')] || '계정'
  const password = str(fd, 'password')
  await sql`
    INSERT INTO client_accounts (client_id, category, label, url, username, password_enc, memo)
    VALUES (${clientId}, ${str(fd, 'category') || 'etc'}, ${label}, ${nullable(fd, 'url')},
            ${nullable(fd, 'username')}, ${password ? encrypt(password) : null}, ${nullable(fd, 'memo')})
  `
  revalidatePath('/admin/clients')
}

export async function deleteAccount(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  const clientId = int(fd, 'client_id')
  await sql`DELETE FROM client_accounts WHERE id = ${int(fd, 'id')}`
  revalidatePath('/admin/clients')
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
  revalidatePath('/admin/clients')
}

export async function deleteCard(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  const clientId = int(fd, 'client_id')
  await sql`DELETE FROM client_cards WHERE id = ${int(fd, 'id')}`
  revalidatePath('/admin/clients')
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

// ─────────────────────────── 프로필

export async function updateAvatar(url: string | null): Promise<void> {
  const admin = await requireAdmin()
  await ensureSchema()
  await sql`
    INSERT INTO admin_profiles (name, avatar_url) VALUES (${admin}, ${url})
    ON CONFLICT (name) DO UPDATE SET avatar_url = EXCLUDED.avatar_url, updated_at = now()
  `
  revalidatePath('/admin', 'layout')
}

export async function updatePosition(fd: FormData): Promise<void> {
  const admin = await requireAdmin()
  await ensureSchema()
  await sql`
    INSERT INTO admin_profiles (name, position) VALUES (${admin}, ${nullable(fd, 'position')})
    ON CONFLICT (name) DO UPDATE SET position = EXCLUDED.position, updated_at = now()
  `
  revalidatePath('/admin', 'layout')
}

// ─────────────────────────── 접속 상태 / 타이핑

const ONLINE_WINDOW_SEC = 20

/**
 * 하트비트 겸 조회. 클라이언트가 몇 초마다 부른다.
 * typingOn 은 지금 편집 중인 일정 id (없으면 null).
 */
export async function heartbeat(location: string, typingOn: number | null): Promise<PresenceUser[]> {
  const admin = await requireAdmin()
  await ensureSchema()

  // typingOn 이 null 이어도 아직 만료 전이면 기존 플래그를 유지한다. (다중 탭 대응)
  await sql`
    INSERT INTO admin_presence (name, last_seen, location, typing_on, typing_until)
    VALUES (${admin}, now(), ${location}, ${typingOn},
            CASE WHEN ${typingOn}::int IS NULL THEN NULL ELSE now() + interval '6 seconds' END)
    ON CONFLICT (name) DO UPDATE SET
      last_seen = now(),
      location  = EXCLUDED.location,
      typing_on = CASE
        WHEN EXCLUDED.typing_on IS NOT NULL             THEN EXCLUDED.typing_on
        WHEN admin_presence.typing_until > now()        THEN admin_presence.typing_on
        ELSE NULL END,
      typing_until = CASE
        WHEN EXCLUDED.typing_until IS NOT NULL          THEN EXCLUDED.typing_until
        WHEN admin_presence.typing_until > now()        THEN admin_presence.typing_until
        ELSE NULL END
  `

  return (await sql`
    SELECT p.name, pr.avatar_url, pr.position,
           (p.last_seen > now() - make_interval(secs => ${ONLINE_WINDOW_SEC})) AS online,
           (p.typing_on IS NOT NULL AND p.typing_until > now()) AS typing,
           p.typing_on
    FROM admin_presence p LEFT JOIN admin_profiles pr ON pr.name = p.name
    ORDER BY p.name
  `) as PresenceUser[]
}

export async function goOffline(): Promise<void> {
  const admin = await requireAdmin()
  await ensureSchema()
  await sql`
    UPDATE admin_presence
    SET last_seen = now() - interval '1 hour', typing_on = NULL, typing_until = NULL
    WHERE name = ${admin}
  `
}

// ─────────────────────────── 식단

const MEAL_SLOTS: MealSlot[] = ['breakfast', 'lunch', 'dinner', 'snack']

function slotOf(fd: FormData): MealSlot {
  const v = str(fd, 'slot') as MealSlot
  return MEAL_SLOTS.includes(v) ? v : 'lunch'
}

export async function createMeal(fd: FormData): Promise<void> {
  const admin = await requireAdmin()
  await ensureSchema()
  const title = str(fd, 'title')
  const date = str(fd, 'meal_date')
  if (!title || !date) return
  const kcal = int(fd, 'kcal', 0)
  await sql`
    INSERT INTO meal_entries (meal_date, slot, title, memo, image_url, kcal, created_by)
    VALUES (${date}, ${slotOf(fd)}, ${title}, ${nullable(fd, 'memo')},
            ${nullable(fd, 'image_url')}, ${kcal || null}, ${admin})
  `
  revalidatePath('/admin/schedule')
}

export async function updateMeal(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  const kcal = int(fd, 'kcal', 0)
  await sql`
    UPDATE meal_entries SET
      meal_date = ${str(fd, 'meal_date')},
      slot = ${slotOf(fd)},
      title = ${str(fd, 'title') || '이름 없는 식단'},
      memo = ${nullable(fd, 'memo')},
      image_url = ${nullable(fd, 'image_url')},
      kcal = ${kcal || null}
    WHERE id = ${int(fd, 'id')}
  `
  revalidatePath('/admin/schedule')
}

export async function deleteMeal(fd: FormData): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  await sql`DELETE FROM meal_entries WHERE id = ${int(fd, 'id')}`
  revalidatePath('/admin/schedule')
}

// ─────────────────────────── 무한 스크롤 달력

/** 스크롤이 위/아래 끝에 닿을 때 한 달치를 더 불러온다. */
export async function loadScheduleMonth(ym: string): Promise<MonthData> {
  await requireAdmin()
  await ensureSchema()
  const { year, month } = parseYm(ym)
  return buildMonth(year, month)
}
