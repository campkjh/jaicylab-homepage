import { neon } from '@neondatabase/serverless'

const DATABASE_URL = process.env.DATABASE_URL || ''

// URL이 없어도 모듈 로드는 성공해야 한다. (로그인 화면은 DB를 쓰지 않는다)
// 실제 쿼리를 던지는 순간 ensureSchema()가 알아보기 쉬운 에러를 낸다.
export const sql = neon(DATABASE_URL || 'postgresql://placeholder:placeholder@localhost/placeholder')

// date 컬럼은 반드시 to_char(col, 'YYYY-MM-DD')로 뽑을 것.
// 그냥 받으면 드라이버가 Date로 파싱해 KST(UTC+9)에서 하루 밀리고(2026-09-30 → 2026-09-29T15:00Z),
// <input type="date">에도 들어가지 않는다. 드라이버의 types 옵션은 HTTP 드라이버에서 무시된다.

// Neon HTTP 드라이버는 한 번에 한 문장만 실행할 수 있어 DDL을 하나씩 돌린다.
const DDL = [
  `CREATE TABLE IF NOT EXISTS clients (
    id              serial PRIMARY KEY,
    name            text NOT NULL,
    company         text,
    contact_name    text,
    phone           text,
    email           text,
    business_number text,
    ceo_name        text,
    address         text,
    memo            text,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS client_accounts (
    id           serial PRIMARY KEY,
    client_id    integer NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    category     text NOT NULL DEFAULT 'etc',
    label        text NOT NULL,
    url          text,
    username     text,
    password_enc text,
    memo         text,
    created_at   timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS client_cards (
    id          serial PRIMARY KEY,
    client_id   integer NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    label       text NOT NULL,
    brand       text,
    holder      text,
    last4       text,
    number_enc  text,
    expiry_enc  text,
    cvc_enc     text,
    memo        text,
    created_at  timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS projects (
    id          serial PRIMARY KEY,
    client_id   integer REFERENCES clients(id) ON DELETE SET NULL,
    name        text NOT NULL,
    status      text NOT NULL DEFAULT 'planning',
    progress    integer NOT NULL DEFAULT 0,
    start_date  date,
    due_date    date,
    description text,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS project_tasks (
    id         serial PRIMARY KEY,
    project_id integer NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title      text NOT NULL,
    done       boolean NOT NULL DEFAULT false,
    due_date   date,
    position   integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS project_notes (
    id         serial PRIMARY KEY,
    project_id integer NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    body       text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS event_categories (
    id         serial PRIMARY KEY,
    name       text NOT NULL,
    color      text NOT NULL DEFAULT 'blue',
    position   integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS schedule_events (
    id          serial PRIMARY KEY,
    category_id integer REFERENCES event_categories(id) ON DELETE SET NULL,
    title       text NOT NULL,
    event_date  date NOT NULL,
    event_time  time,
    memo        text,
    created_at  timestamptz NOT NULL DEFAULT now()
  )`,
  // 일정 색은 카테고리가 들고 있다. 초기 버전에 있던 project_id/color 컬럼은 더 이상 쓰지 않는다.
  `ALTER TABLE schedule_events ADD COLUMN IF NOT EXISTS category_id integer REFERENCES event_categories(id) ON DELETE SET NULL`,
  `ALTER TABLE schedule_events DROP COLUMN IF EXISTS project_id`,
  `ALTER TABLE schedule_events DROP COLUMN IF EXISTS color`,
  `INSERT INTO event_categories (name, color, position)
   SELECT * FROM (VALUES ('미팅','blue',0),('개발','green',1),('디자인','purple',2),('마감','red',3),('기타','gray',4)) AS v(name,color,position)
   WHERE NOT EXISTS (SELECT 1 FROM event_categories)`,
  `CREATE INDEX IF NOT EXISTS idx_schedule_date ON schedule_events(event_date)`,
  `CREATE INDEX IF NOT EXISTS idx_schedule_category ON schedule_events(category_id)`,
  `CREATE INDEX IF NOT EXISTS idx_tasks_project ON project_tasks(project_id)`,
  `CREATE INDEX IF NOT EXISTS idx_notes_project ON project_notes(project_id)`,
  `CREATE INDEX IF NOT EXISTS idx_accounts_client ON client_accounts(client_id)`,
  `CREATE INDEX IF NOT EXISTS idx_cards_client ON client_cards(client_id)`,
]

let ready: Promise<void> | null = null

export function ensureSchema(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      if (!DATABASE_URL) throw new Error('DATABASE_URL 환경변수가 없습니다. .env.local에 Neon 연결 문자열을 넣어 주세요.')
      for (const stmt of DDL) await sql.query(stmt)
    })().catch(err => {
      ready = null // 다음 요청에서 다시 시도할 수 있게
      throw err
    })
  }
  return ready
}

// 타입/상수는 클라이언트에서도 쓰므로 types.ts에 두고 여기서 다시 내보낸다.
export * from './types'
