import Sidebar from '@/components/admin/Sidebar'
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
        <main className="min-w-0 flex-1 px-7 py-6">
          <div className="mx-auto w-full max-w-[1200px] animate-fade-up">{children}</div>
        </main>
      </div>
    </PresenceProvider>
  )
}
