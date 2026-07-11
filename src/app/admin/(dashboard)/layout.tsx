import Sidebar from '@/components/admin/Sidebar'
import SummerShore from '@/components/admin/SummerShore'
import PresenceProvider from '@/components/admin/PresenceProvider'
import { requireAdmin } from '@/lib/session'
import { ensureSchema, sql } from '@/lib/db'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin()
  await ensureSchema()

  const rows = (await sql`SELECT avatar_url, position FROM admin_profiles WHERE name = ${admin}`) as {
    avatar_url: string | null
    position: string | null
  }[]

  return (
    <PresenceProvider me={admin}>
      <div className="flex min-h-dvh bg-surface">
        <Sidebar admin={admin} myAvatar={rows[0]?.avatar_url ?? null} myPosition={rows[0]?.position ?? null} />
        {/* 모바일에선 상단 바(h-14)가 fixed 로 떠 있어 그만큼 밀어준다 */}
        {/* 폭 제한은 페이지가 스스로 정한다. 스케줄은 풀사이즈, 나머지는 PageContainer 로 1200px */}
        <main className="min-w-0 flex-1 px-4 pt-[4.5rem] pb-16 lg:px-7 lg:pt-6 lg:pb-16">
          <div className="w-full animate-fade-up">{children}</div>
        </main>
        <SummerShore />
      </div>
    </PresenceProvider>
  )
}
