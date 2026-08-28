import { notFound } from 'next/navigation'
import { ensureSchema, sql } from '@/lib/db'
import { requireAdmin } from '@/lib/session'
import ContractEditor, { type ClientLite } from '@/components/admin/ContractEditor'
import type { Contract } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function ContractEditorPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  await ensureSchema()
  const { id } = await params

  const clients = (await sql`
    SELECT id, name, company, business_number, ceo_name, address, phone
    FROM clients ORDER BY name
  `) as ClientLite[]

  let contract: Contract | null = null
  if (id !== 'new') {
    const nid = Number(id)
    if (!Number.isInteger(nid)) notFound()
    const rows = (await sql`
      SELECT id, client_id, title, gap_company, gap_address, gap_biz_no, gap_phone, gap_ceo,
             dev_amount, deposit, deposit_type, payment_terms, penalty_rate, period, warranty, account,
             to_char(contract_date, 'YYYY-MM-DD') AS contract_date,
             special_terms, status,
             to_char(created_at AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD"T"HH24:MI') AS created_at,
             to_char(updated_at AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD"T"HH24:MI') AS updated_at
      FROM contracts WHERE id = ${nid}
    `) as Contract[]
    if (!rows.length) notFound()
    contract = rows[0]
  }

  return <ContractEditor contract={contract} clients={clients} />
}
