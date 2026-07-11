import { sql, ensureSchema, type Client, type ClientAccount } from '@/lib/db'
import ClientsBoard, { type ClientWithAccounts } from '@/components/admin/ClientsBoard'
import { PageContainer } from '@/components/admin/ui'

export const dynamic = 'force-dynamic'

export default async function ClientsPage() {
  await ensureSchema()

  const [clientRows, accountRows] = await Promise.all([
    sql`SELECT * FROM clients ORDER BY created_at DESC`,
    sql`
      SELECT id, client_id, category, label, url, username, password_enc, memo
      FROM client_accounts ORDER BY created_at
    `,
  ])
  const clients = clientRows as Client[]
  const accounts = accountRows as ClientAccount[]

  const rows: ClientWithAccounts[] = clients.map(c => ({
    ...c,
    accounts: accounts.filter(a => a.client_id === c.id),
  }))

  return (
    <PageContainer>
      <ClientsBoard clients={rows} />
    </PageContainer>
  )
}
