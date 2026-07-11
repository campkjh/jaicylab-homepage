import { ensureSchema, sql, type QuickPhrase } from '@/lib/db'
import PhrasesBoard from '@/components/admin/PhrasesBoard'
import { PageContainer } from '@/components/admin/ui'

export const dynamic = 'force-dynamic'

export default async function PhrasesPage() {
  await ensureSchema()

  const phrases = (await sql`
    SELECT id, label, body, created_by, to_char(created_at, 'YYYY-MM-DD') AS created_at
    FROM quick_phrases ORDER BY id DESC
  `) as QuickPhrase[]

  return (
    <PageContainer>
      <PhrasesBoard phrases={phrases} />
    </PageContainer>
  )
}
