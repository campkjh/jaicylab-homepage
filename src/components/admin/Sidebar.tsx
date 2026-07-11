'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/admin/actions'
import { usePresence } from './PresenceProvider'
import Wordmark from './Wordmark'
import Avatar from './Avatar'
import Icon, { type IconName } from './Icon'

const NAV: { href: string; label: string; icon: IconName; exact: boolean }[] = [
  { href: '/admin', label: '대시보드', icon: 'home', exact: true },
  { href: '/admin/schedule', label: '스케줄', icon: 'calendar', exact: false },
  { href: '/admin/projects', label: '프로젝트', icon: 'folder', exact: false },
  { href: '/admin/clients', label: '클라이언트', icon: 'user', exact: false },
  { href: '/admin/phrases', label: '자주쓰는말', icon: 'copy', exact: false },
  { href: '/admin/settings', label: '설정', icon: 'setting', exact: false },
]

export default function Sidebar({
  admin,
  myAvatar,
  myPosition,
}: {
  admin: string
  myAvatar: string | null
  myPosition: string | null
}) {
  const pathname = usePathname()
  const { users } = usePresence()
  const others = users.filter(u => u.name !== admin)

  // 모바일 서랍. 화면을 옮기면 닫는다.
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [pathname])

  return (
    <>
      {/* 모바일 상단 바 */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-canvas px-3 lg:hidden">
        <button
          onClick={() => setOpen(true)}
          aria-label="메뉴 열기"
          aria-expanded={open}
          className="flex size-9 items-center justify-center rounded-lg text-ink-soft transition hover:bg-hover"
        >
          <span className="flex h-3.5 w-4 flex-col justify-between">
            <span className="h-0.5 w-full rounded-full bg-current" />
            <span className="h-0.5 w-full rounded-full bg-current" />
            <span className="h-0.5 w-full rounded-full bg-current" />
          </span>
        </button>
        <Link href="/admin" className="py-1">
          <Wordmark className="h-4 w-auto text-brand" />
        </Link>
        <Link href="/admin/settings" className="ml-auto">
          <Avatar name={admin} url={myAvatar} size="md" />
        </Link>
      </header>

      {open && (
        <div
          onClick={() => setOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[240px] shrink-0 flex-col border-r border-line bg-canvas px-3 py-4 transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:w-[228px] lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <Link href="/admin" className="block rounded-lg px-2 py-2.5 transition hover:bg-hover">
            <Wordmark className="h-[18px] w-auto text-brand" />
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="메뉴 닫기"
            className="flex size-8 items-center justify-center rounded-lg text-ink-muted transition hover:bg-hover lg:hidden"
          >
            <Icon name="x" className="size-4" />
          </button>
        </div>

      <nav className="flex flex-col gap-0.5">
        {NAV.map(({ href, label, icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition ${
                active ? 'bg-hover font-medium text-ink' : 'text-ink-soft hover:bg-hover'
              }`}
            >
              <Icon name={icon} className={`size-4 ${active ? 'text-ink' : 'text-ink-muted'}`} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-line pt-3">
        {others.length > 0 && (
          <div className="mb-2 px-2">
            <div className="mb-1.5 text-[11px] font-medium text-ink-muted">함께 보는 중</div>
            <ul className="flex flex-col gap-1.5">
              {others.map(u => (
                <li key={u.name} className="flex items-center gap-2">
                  <Avatar name={u.name} url={u.avatar_url} size="sm" online={u.online} />
                  <span className="min-w-0">
                    <span className={`block truncate text-xs ${u.online ? 'text-ink-soft' : 'text-ink-muted'}`}>
                      {u.name}
                    </span>
                    {u.position && <span className="block truncate text-[10px] text-ink-muted">{u.position}</span>}
                  </span>
                  {u.typing && <span className="ml-auto shrink-0 text-[10px] text-brand">입력 중…</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link href="/admin/settings" className="mb-1 flex items-center gap-2.5 rounded-md px-2 py-1.5 transition hover:bg-hover">
          <Avatar name={admin} url={myAvatar} size="md" />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-ink">{admin}</div>
            <div className="truncate text-[11px] text-ink-muted">{myPosition || '직급 없음'}</div>
          </div>
        </Link>

        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-ink-muted transition hover:bg-hover hover:text-ink"
          >
            <Icon name="exit" className="size-4" />
            로그아웃
          </button>
        </form>
        </div>
      </aside>
    </>
  )
}
