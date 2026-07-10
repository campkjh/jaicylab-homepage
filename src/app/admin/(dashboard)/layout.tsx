import Sidebar from '@/components/admin/Sidebar'
import { requireAdmin } from '@/lib/session'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin()

  return (
    <div className="flex min-h-dvh bg-surface">
      <Sidebar admin={admin} />
      <main className="min-w-0 flex-1 px-10 py-9">
        <div className="mx-auto max-w-[960px] animate-fade-up">{children}</div>
      </main>
    </div>
  )
}
