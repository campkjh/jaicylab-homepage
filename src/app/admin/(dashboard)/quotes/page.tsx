import { ensureSchema, sql, type MedinityQuote } from '@/lib/db'
import { requireAdmin, isRestrictedAdmin } from '@/lib/session'
import { PageContainer, PageHeader } from '@/components/admin/ui'
import MedinityQuotesBoard from '@/components/admin/MedinityQuotesBoard'

export const dynamic = 'force-dynamic'

export default async function QuotesPage() {
  const admin = await requireAdmin()
  const canPreview = !isRestrictedAdmin(admin)
  await ensureSchema()

  const rows = await sql`
    SELECT id, title, clinic_name, contact_name, phone, email, memo, reference_url, selections, subtotal, total, status,
           req_status, dev,
           to_char(created_at AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD"T"HH24:MI') AS created_at
    FROM medinity_quotes
    ORDER BY created_at DESC, id DESC
  `
  const quotes = rows as MedinityQuote[]
  const pending = quotes.filter(q => q.status === 'new').length

  return (
    <PageContainer>
      <PageHeader
        title="메디니티 견적함"
        subtitle={`공개 견적 페이지(/medinity)에서 접수된 요청입니다.${pending ? ` · 신규 ${pending}건` : ''}`}
      />
      <MedinityQuotesBoard quotes={quotes} canPreview={canPreview} />
    </PageContainer>
  )
}
