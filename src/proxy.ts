import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'
import { MAX_AGE_SEC, SESSION_COOKIE, verifySession } from './lib/auth'

const intlMiddleware = createMiddleware(routing)

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 관리자 영역은 로케일 라우팅을 타지 않는다.
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get(SESSION_COOKIE)?.value
    const authed = Boolean(await verifySession(token))

    if (pathname === '/admin/login') {
      if (authed) return NextResponse.redirect(new URL('/admin', req.url))
      return NextResponse.next()
    }

    if (!authed) {
      const url = new URL('/admin/login', req.url)
      if (pathname !== '/admin') url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }

    // 접속할 때마다 쿠키 수명을 다시 채워 로그인이 풀리지 않게 한다.
    const res = NextResponse.next()
    res.cookies.set(SESSION_COOKIE, token!, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: MAX_AGE_SEC,
    })
    return res
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
