import { sql, ensureSchema, type Client, type ClientAccount, type ClientCard, type ProjectStatus } from '@/lib/db'
import ClientsBoard, { type ClientWithRelations } from '@/components/admin/ClientsBoard'
import { PageContainer } from '@/components/admin/ui'

export const dynamic = 'force-dynamic'

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ open?: string }> }) {
  await ensureSchema()

  const [clientRows, accountRows, cardRows, projectRows] = await Promise.all([
    sql`SELECT * FROM clients ORDER BY created_at DESC`,
    sql`
      SELECT id, client_id, category, label, url, username, password_enc, memo
      FROM client_accounts ORDER BY category, created_at
    `,
    sql`
      SELECT id, client_id, label, brand, holder, last4, number_enc, expiry_enc, cvc_enc, memo
      FROM client_cards ORDER BY created_at
    `,
    sql`
      SELECT id, client_id, name, status FROM projects WHERE client_id IS NOT NULL ORDER BY updated_at DESC
    `,
  ])
  const clients = clientRows as Client[]
  const accounts = accountRows as ClientAccount[]
  const cards = cardRows as ClientCard[]
  const projects = projectRows as { id: number; client_id: number; name: string; status: ProjectStatus }[]

  const rows: ClientWithRelations[] = clients.map(c => ({
    ...c,
    accounts: accounts.filter(a => a.client_id === c.id),
    cards: cards.filter(k => k.client_id === c.id),
    projects: projects.filter(p => p.client_id === c.id).map(({ id, name, status }) => ({ id, name, status })),
  }))

  const open = Number.parseInt((await searchParams).open ?? '', 10)

  return (
    <PageContainer>
      <ClientsBoard clients={rows} defaultOpenId={Number.isFinite(open) ? open : null} />
    </PageContainer>
  )
}
