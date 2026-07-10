'use client'

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
  { href: '/admin/meals', label: '식단', icon: 'food', exact: false },
  { href: '/admin/projects', label: '프로젝트', icon: 'folder', exact: false },
  { href: '/admin/clients', label: '클라이언트', icon: 'user', exact: false },
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

  return (
    <aside className="sticky top-0 flex h-dvh w-[228px] shrink-0 flex-col border-r border-line bg-canvas px-3 py-4">
      <Link href="/admin" className="mb-5 block rounded-lg px-2 py-2.5 transition hover:bg-hover">
        <Wordmark className="h-[18px] w-auto text-brand" />
      </Link>

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
  )
}
