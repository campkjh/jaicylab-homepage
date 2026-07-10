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
