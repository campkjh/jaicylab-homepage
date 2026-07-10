'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderKanban, Users, CalendarDays, Settings, LogOut } from 'lucide-react'
import { logout } from '@/app/admin/actions'

const NAV = [
  { href: '/admin', label: '대시보드', icon: LayoutDashboard, exact: true },
  { href: '/admin/schedule', label: '스케줄', icon: CalendarDays, exact: false },
  { href: '/admin/projects', label: '프로젝트', icon: FolderKanban, exact: false },
  { href: '/admin/clients', label: '클라이언트', icon: Users, exact: false },
  { href: '/admin/settings', label: '설정', icon: Settings, exact: false },
]

export default function Sidebar({ admin }: { admin: string }) {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 flex h-dvh w-[240px] shrink-0 flex-col border-r border-line bg-canvas px-3 py-4">
      <Link href="/admin" className="mb-5 flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-hover">
        <span className="flex size-7 items-center justify-center rounded-md bg-ink text-[13px] font-bold text-white">J</span>
        <span className="text-sm font-semibold text-ink">JAICYLAB</span>
      </Link>

      <nav className="flex flex-col gap-0.5">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition ${
                active ? 'bg-hover font-medium text-ink' : 'text-ink-soft hover:bg-hover'
              }`}
            >
              <Icon className={`size-4 ${active ? 'text-ink' : 'text-ink-muted'}`} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-line pt-3">
        <div className="mb-1 flex items-center gap-2.5 px-2 py-1.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[12px] font-semibold text-emerald-700">
            {admin.slice(0, 1)}
          </span>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-ink">{admin}</div>
            <div className="text-[11px] text-ink-muted">관리자</div>
          </div>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-ink-muted transition hover:bg-hover hover:text-ink"
          >
            <LogOut className="size-4" />
            로그아웃
          </button>
        </form>
      </div>
    </aside>
  )
}
