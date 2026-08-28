import Link from 'next/link'
import { ensureSchema, sql } from '@/lib/db'
import { requireAdmin } from '@/lib/session'
import { PageContainer, PageHeader, EmptyState } from '@/components/admin/ui'
import { computeAmounts, formatWon } from '@/lib/contract-template'

export const dynamic = 'force-dynamic'

type Row = {
  id: number
  title: string
  gap_company: string | null
  dev_amount: number
  status: string
  kind: string
  payment_type: string
  contract_date: string | null
  created_at: string
}

export default async function ContractsPage() {
  await requireAdmin()
  await ensureSchema()

  const rows = (await sql`
    SELECT id, title, gap_company, dev_amount, status, kind, payment_type,
           to_char(contract_date, 'YYYY-MM-DD') AS contract_date,
           to_char(created_at AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD') AS created_at
    FROM contracts
    ORDER BY created_at DESC, id DESC
  `) as Row[]

  return (
    <PageContainer>
      <PageHeader
        title="계약서"
        subtitle="표준계약서를 만들어 PDF로 출력합니다. 금액·고객·특약만 채우면 됩니다."
        action={
          <Link
            href="/admin/contracts/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-ink px-3.5 text-sm font-medium text-white transition hover:bg-black"
          >
            + 새 계약서
          </Link>
        }
      />

      {rows.length === 0 ? (
        <EmptyState>아직 만든 계약서가 없어요. ‘새 계약서’로 시작하세요.</EmptyState>
      ) : (
        <div className="grid gap-2">
          {rows.map(c => {
            const { total } = computeAmounts(c.dev_amount)
            return (
              <Link
                key={c.id}
                href={`/admin/contracts/${c.id}`}
                className="flex items-center gap-4 rounded-xl border border-line bg-surface px-4 py-3.5 shadow-[0_1px_2px_rgba(15,15,15,0.04)] transition hover:bg-hover"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-semibold text-ink">{c.gap_company || '고객 미지정'}</span>
                    <span className="shrink-0 rounded bg-hover px-1.5 py-0.5 text-[10px] font-medium text-ink-soft">
                      {c.kind === 'app' ? '앱' : '홈페이지'}
                    </span>
                    {c.payment_type === 'installment' && (
                      <span className="shrink-0 rounded bg-hover px-1.5 py-0.5 text-[10px] font-medium text-ink-soft">분할</span>
                    )}
                  </div>
                  <div className="truncate text-xs text-ink-muted">{c.title}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-sm font-bold tabular-nums text-ink">{formatWon(total)}</div>
                  <div className="text-[11px] text-ink-muted">{c.contract_date || c.created_at}</div>
                </div>
                {c.status === 'signed' && (
                  <span className="shrink-0 rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-semibold text-brand">
                    체결
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </PageContainer>
  )
}
