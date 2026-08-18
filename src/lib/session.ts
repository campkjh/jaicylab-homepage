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

export function isRestrictedAdmin(name: string | null): boolean {
  return !!name && RESTRICTED_ADMINS.has(name)
}

/** 홈페이지 미리보기 등 내부 전용 화면. 제한 계정은 메디니티 도구로 돌려보낸다. */
export async function requireFullAdmin(): Promise<string> {
  const name = await requireAdmin()
  if (isRestrictedAdmin(name)) redirect('/medinity')
  return name
}
