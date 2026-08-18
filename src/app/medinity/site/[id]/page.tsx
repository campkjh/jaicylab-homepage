import { notFound } from 'next/navigation'
import { ensureSchema, sql, type MedinityQuote } from '@/lib/db'
import { buildSiteConfig } from '@/data/medinity-site'
import { ClinicSite } from '@/components/medinity/ClinicSite'
import { requireFullAdmin } from '@/lib/session'

export const dynamic = 'force-dynamic'

/**
 * 접수 건(id)으로 치과 홈페이지 템플릿(A안)을 렌더한 미리보기.
 * /medinity/site/{id} — 관리자 견적함의 "홈페이지 미리보기"에서 연다.
 */
export default async function ClinicSitePreview({ params }: { params: Promise<{ id: string }> }) {
  await requireFullAdmin() // 어드민만 열람 — 제한 계정(메디니티)은 /medinity 로 리다이렉트
  const { id } = await params
  const n = Number(id)
  if (!Number.isFinite(n)) notFound()

  await ensureSchema()
  const rows = await sql`
    SELECT id, title, clinic_name, contact_name, phone, email, memo, reference_url,
           selections, subtotal, total, status, req_status, dev,
           to_char(created_at AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD"T"HH24:MI') AS created_at
    FROM medinity_quotes WHERE id = ${n}
  `
  const quote = rows[0] as MedinityQuote | undefined
  if (!quote) notFound()

  return <ClinicSite config={buildSiteConfig(quote)} />
}
