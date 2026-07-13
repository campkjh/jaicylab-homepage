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
  // 노션식 리치 본문 (sanitize 된 HTML)
  `ALTER TABLE schedule_events ADD COLUMN IF NOT EXISTS body_html text`,
  `ALTER TABLE schedule_events ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now()`,
  `ALTER TABLE schedule_events ADD COLUMN IF NOT EXISTS updated_by text`,

  `CREATE TABLE IF NOT EXISTS admin_profiles (
    name       text PRIMARY KEY,
    avatar_url text,
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  `ALTER TABLE admin_profiles ADD COLUMN IF NOT EXISTS position text`,

  // 접속 상태 + 타이핑 표시. 폴링으로 갱신한다.
  `CREATE TABLE IF NOT EXISTS admin_presence (
    name        text PRIMARY KEY,
    last_seen   timestamptz NOT NULL DEFAULT now(),
    location    text,
    typing_on   integer
  )`,
  // 타이핑 만료는 서버가 관리한다. 같은 사람이 탭을 여러 개 열어두면
  // 입력하지 않는 탭의 하트비트가 방금 세운 플래그를 지워버리기 때문이다.
  `ALTER TABLE admin_presence ADD COLUMN IF NOT EXISTS typing_until timestamptz`,

  `CREATE TABLE IF NOT EXISTS meal_entries (
    id         serial PRIMARY KEY,
    meal_date  date NOT NULL,
    slot       text NOT NULL DEFAULT 'lunch',
    title      text NOT NULL,
    memo       text,
    image_url  text,
    kcal       integer,
    created_by text,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,

  // 우측 패널의 할 일 목록. 담당자 태그(관리자 이름)를 붙인다.
  `CREATE TABLE IF NOT EXISTS schedule_timelines (
    id         serial PRIMARY KEY,
    title      text NOT NULL,
    start_date date,
    end_date   date,
    color      text NOT NULL DEFAULT 'blue',
    done       boolean NOT NULL DEFAULT false,
    created_by text,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  // 초기 버전은 오늘~마감 띠였다. 지금은 담당자 태그 방식이라 날짜가 필요 없다.
  `ALTER TABLE schedule_timelines ADD COLUMN IF NOT EXISTS assignee text`,
  // 상태 태그: urgent | in_progress | maintenance | hold | done (긴급>진행중>유지보수>보류>완료 순으로 정렬)
  `ALTER TABLE schedule_timelines ADD COLUMN IF NOT EXISTS status text`,
  // 완료 태그가 붙은 시각. 완료한 다음 날부터 목록에서 빠지고 '지난 기록'에서만 보인다.
  `ALTER TABLE schedule_timelines ADD COLUMN IF NOT EXISTS done_at timestamptz`,
  // 예전 체크(done boolean)로 완료했던 항목을 완료 태그 체계로 옮긴다.
  `UPDATE schedule_timelines SET status = 'done', done_at = coalesce(done_at, now())
   WHERE done = true AND (status IS DISTINCT FROM 'done')`,
  `ALTER TABLE schedule_timelines ALTER COLUMN start_date DROP NOT NULL`,
  `ALTER TABLE schedule_timelines ALTER COLUMN end_date DROP NOT NULL`,

  // 타임라인 상태 태그. 설정에서 추가·수정·삭제한다.
  // schedule_timelines.status 는 여기 key 를 가리킨다. is_done 태그를 붙이면 완료로 처리되어
  // 다음 날(KST)부터 목록에서 빠지고 '지난 기록'으로 넘어간다.
  `CREATE TABLE IF NOT EXISTS timeline_statuses (
    id         serial PRIMARY KEY,
    key        text NOT NULL UNIQUE,
    label      text NOT NULL,
    color      text NOT NULL DEFAULT 'gray',
    is_done    boolean NOT NULL DEFAULT false,
    position   integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  // 기존 하드코딩 상태(긴급>진행중>유지보수>보류>완료)를 그대로 옮긴다. key 는 기존 데이터와 맞춘다.
  `INSERT INTO timeline_statuses (key, label, color, is_done, position)
   SELECT * FROM (VALUES
     ('urgent','긴급','red',false,0),
     ('in_progress','진행중','green',false,1),
     ('maintenance','유지보수','amber',false,2),
     ('hold','보류','gray',false,3),
     ('done','완료','blue',true,4)
   ) AS v(key,label,color,is_done,position)
   WHERE NOT EXISTS (SELECT 1 FROM timeline_statuses)`,

  // 자주 쓰는 말. 카드에서 바로 복사한다.
  `CREATE TABLE IF NOT EXISTS quick_phrases (
    id         serial PRIMARY KEY,
    label      text,
    body       text NOT NULL,
    created_by text,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,

  `CREATE INDEX IF NOT EXISTS idx_schedule_date ON schedule_events(event_date)`,
  `CREATE INDEX IF NOT EXISTS idx_schedule_category ON schedule_events(category_id)`,
  `CREATE INDEX IF NOT EXISTS idx_meals_date ON meal_entries(meal_date)`,
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
