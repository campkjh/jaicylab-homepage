import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'
import { SESSION_COOKIE, verifySession } from './lib/auth'

const intlMiddleware = createMiddleware(routing)

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 관리자 영역은 로케일 라우팅을 타지 않는다.
  if (pathname.startsWith('/admin')) {
    const authed = Boolean(await verifySession(req.cookies.get(SESSION_COOKIE)?.value))

    if (pathname === '/admin/login') {
      if (authed) return NextResponse.redirect(new URL('/admin', req.url))
      return NextResponse.next()
    }

    if (!authed) {
      const url = new URL('/admin/login', req.url)
      if (pathname !== '/admin') url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
