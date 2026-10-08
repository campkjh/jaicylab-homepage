import { NextResponse } from 'next/server'
import { put, del } from '@vercel/blob'
import { currentAdmin, isScreenViewer, canViewScreenOf } from '@/lib/session'
import { ensureSchema, sql } from '@/lib/db'

/** 프레임 한 장 최대 크기(약 1280px JPEG 이면 보통 이 안쪽). */
const MAX_BYTES = 3 * 1024 * 1024
/** 보존 기간 — 하루 지난 이미지는 지운다. */
const RETENTION_HOURS = 24
/** 이 시간 안에 프레임이 올라온 사람을 '지금 공유 중'으로 본다. */
const LIVE_WINDOW_SEC = 25

/** 프레임 한 장 저장 (본인만). 저장 후 하루 지난 것들을 조금씩 지운다. */
export async function POST(req: Request) {
  // 미들웨어는 /api 를 타지 않으므로 여기서 직접 막는다.
  const admin = await currentAdmin()
  if (!admin) return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 })
  await ensureSchema()

  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 })
  if (file.type !== 'image/jpeg') return NextResponse.json({ error: 'jpeg 만 받습니다.' }, { status: 400 })
  if (file.size > MAX_BYTES) return NextResponse.json({ error: '한 장이 너무 큽니다.' }, { status: 400 })

  // Blob 스토어가 public 이라 access 는 public. 대신 랜덤 접미사로 URL 을 못 맞히게 하고,
  // 그 URL 은 클라이언트에 주지 않는다. 열람은 아래 GET 이 인증을 확인한 뒤 대신 받아 내보낸다.
  const { url } = await put(`screen/${encodeURIComponent(admin)}/${Date.now()}.jpg`, file, {
    access: 'public',
    contentType: 'image/jpeg',
    addRandomSuffix: true,
  })
  await sql`INSERT INTO screen_frames (name, pathname) VALUES (${admin}, ${url})`

  // 하루 지난 기록 정리 — 한 번에 조금씩만(업로드가 느려지지 않게)
  const stale = (await sql`
    DELETE FROM screen_frames
    WHERE id IN (
      SELECT id FROM screen_frames
      WHERE taken_at < now() - make_interval(hours => ${RETENTION_HOURS})
      ORDER BY taken_at LIMIT 30
    )
    RETURNING pathname
  `) as { pathname: string }[]
  for (const row of stale) {
    try {
      await del(row.pathname)
    } catch {
      // blob 이 이미 없어도 행은 지워졌으니 넘어간다
    }
  }

  return NextResponse.json({ ok: true })
}

export async function GET(req: Request) {
  const admin = await currentAdmin()
  if (!admin) return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 })
  await ensureSchema()
  const q = new URL(req.url).searchParams

  // 최근 하루 안에 기록이 있는 사람 목록 (화면 열람 권한자만). live=지금 공유 중.
  if (q.get('sharing')) {
    if (!isScreenViewer(admin)) return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
    const rows = (await sql`
      SELECT name, MAX(taken_at) AS last_at,
             (MAX(taken_at) > now() - make_interval(secs => ${LIVE_WINDOW_SEC})) AS live
      FROM screen_frames
      WHERE taken_at > now() - make_interval(hours => ${RETENTION_HOURS})
      GROUP BY name
      ORDER BY live DESC, name
    `) as { name: string; last_at: string; live: boolean }[]
    return NextResponse.json({ sharing: rows })
  }

  // 특정 사람의 최근 프레임 목록 (하루치, 자기 것 또는 상호 열람 권한)
  const listName = q.get('list')
  if (listName) {
    if (!canViewScreenOf(admin, listName)) return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
    const rows = (await sql`
      SELECT id, taken_at FROM screen_frames
      WHERE name = ${listName} AND taken_at > now() - make_interval(hours => ${RETENTION_HOURS})
      ORDER BY taken_at DESC LIMIT 240
    `) as { id: number; taken_at: string }[]
    const live = rows.length > 0 && Date.now() - new Date(rows[0].taken_at).getTime() < LIVE_WINDOW_SEC * 1000
    return NextResponse.json({ frames: rows, live })
  }

  // 프레임 한 장 이미지 — 인증 확인 후 서버가 blob 을 대신 받아 내보낸다(URL 비노출).
  const id = Number(q.get('id'))
  if (!Number.isFinite(id)) return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
  const rows = (await sql`SELECT name, pathname FROM screen_frames WHERE id = ${id}`) as {
    name: string
    pathname: string
  }[]
  const row = rows[0]
  if (!row) return NextResponse.json({ error: '없는 기록입니다.' }, { status: 404 })
  if (!canViewScreenOf(admin, row.name)) return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })

  const upstream = await fetch(row.pathname, { cache: 'no-store' })
  if (!upstream.ok || !upstream.body) return NextResponse.json({ error: '그림을 찾지 못했습니다.' }, { status: 404 })
  return new Response(upstream.body, {
    headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'private, max-age=86400' },
  })
}
