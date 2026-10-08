import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, verifySession } from './auth'

/** 로그인한 관리자 이름. 비로그인이면 null. */
export async function currentAdmin(): Promise<string | null> {
  const jar = await cookies()
  return verifySession(jar.get(SESSION_COOKIE)?.value)
}

/** 모든 server action / 관리자 페이지 진입점에서 호출한다. 미들웨어만 믿지 않는다. */
export async function requireAdmin(): Promise<string> {
  const name = await currentAdmin()
  if (!name) redirect('/admin/login')
  return name
}

/**
 * 제한 계정(메디니티 등) — 메디니티 도구는 쓰되 생성된 홈페이지 미리보기는 못 본다.
 * 이름 기준(ADMIN_USERS의 이름). 제이씨랩 내부 어드민(채은공듀·정훈)은 전체 열람.
 */
const RESTRICTED_ADMINS = new Set(['메디니티'])

/** 대표 — 직원 접속 로그처럼 다른 사람 기록까지 보는 메뉴는 여기만 열린다. */
const OWNER_ADMINS = new Set(['정훈'])

export function isOwnerAdmin(name: string | null): boolean {
  return !!name && OWNER_ADMINS.has(name)
}

/** 화면 공유를 서로 볼 수 있는 내부 계정 묶음(본인 소유 계정들). 이 안에서만 상호 열람된다. */
const SCREEN_GROUP = new Set(['정훈', '채은공듀'])

/** 원격 화면 보기 메뉴를 쓸 수 있는가 (대표 또는 내부 묶음). */
export function isScreenViewer(name: string | null): boolean {
  return !!name && (SCREEN_GROUP.has(name) || OWNER_ADMINS.has(name))
}

/** 화면을 자동 캡처하는 대상인가 — 내부 묶음(본인 소유 계정)만. 그 외 계정은 캡처하지 않는다. */
export function isScreenGroupMember(name: string | null): boolean {
  return !!name && SCREEN_GROUP.has(name)
}

/** viewer 가 target 의 공유 화면을 볼 수 있는가. 자기 것은 늘 OK, 대표는 전부, 묶음끼리는 상호. */
export function canViewScreenOf(viewer: string | null, target: string): boolean {
  if (!viewer) return false
  if (viewer === target) return true
  if (OWNER_ADMINS.has(viewer)) return true
  return SCREEN_GROUP.has(viewer) && SCREEN_GROUP.has(target)
}

export function isRestrictedAdmin(name: string | null): boolean {
  return !!name && RESTRICTED_ADMINS.has(name)
}

/** 홈페이지 미리보기 등 내부 전용 화면. 제한 계정은 메디니티 도구로 돌려보낸다. */
export async function requireFullAdmin(): Promise<string> {
  const name = await requireAdmin()
  if (isRestrictedAdmin(name)) redirect('/medinity')
  return name
}
