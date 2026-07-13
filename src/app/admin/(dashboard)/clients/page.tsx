import { sql, ensureSchema, type Client, type ClientAccount, type AccountView } from '@/lib/db'
import { decrypt } from '@/lib/crypto'
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
  // 비밀번호는 화면에서 원문으로 보이도록 여기서 복호화해 내려준다. (관리자 인증 화면 전용)
  const accounts: AccountView[] = (accountRows as ClientAccount[]).map(a => ({
    id: a.id,
    client_id: a.client_id,
    category: a.category,
    label: a.label,
    username: a.username,
    password: a.password_enc ? decrypt(a.password_enc) : '',
  }))

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
