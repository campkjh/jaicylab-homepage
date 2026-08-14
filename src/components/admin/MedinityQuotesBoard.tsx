'use client'

import { useState } from 'react'
import Icon from './Icon'
import { type MedinityQuote } from '@/lib/types'
import { deleteMedinityQuote, updateMedinityQuoteStatus } from '@/app/admin/actions'

const STATUS: Record<string, { label: string; chip: string }> = {
  new: { label: '신규', chip: 'bg-sky-50 text-sky-700' },
  contacted: { label: '연락함', chip: 'bg-amber-50 text-amber-700' },
  done: { label: '완료', chip: 'bg-emerald-50 text-emerald-700' },
}

function won(n: number) {
  return `${n.toLocaleString('ko-KR')}원`
}

function QuoteCard({ quote }: { quote: MedinityQuote }) {
  const [open, setOpen] = useState(false)
  const st = STATUS[quote.status] ?? STATUS.new
  const date = quote.created_at?.slice(0, 16).replace('T', ' ')

  return (
    <li className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${st.chip}`}>{st.label}</span>
        <span className="text-sm font-semibold text-ink">{quote.clinic_name || quote.contact_name}</span>
        <span className="text-xs text-ink-muted">{quote.contact_name} · {quote.phone}{quote.email ? ` · ${quote.email}` : ''}</span>
        <span className="ml-auto text-sm font-bold tabular-nums text-ink">{won(quote.total)}</span>
        <button onClick={() => setOpen(v => !v)} aria-label="상세" className="shrink-0 text-ink-muted transition hover:text-ink">
          <Icon name="arrowRight" className={`size-4 transition-transform ${open ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-canvas/40 px-4 py-3">
          <div className="mb-2 text-[11px] text-ink-muted">접수 #{quote.id} · {date} · 부가세 포함 합계 {won(quote.total)} (공급가 {won(quote.subtotal)})</div>
          <ul className="mb-3 flex flex-col gap-0.5">
            {quote.selections.map((s, i) => (
              <li key={i} className="flex items-center justify-between text-[13px]">
                <span className="min-w-0 flex-1 truncate text-ink-soft">{s.label}</span>
                <span className="shrink-0 tabular-nums text-ink-muted">{s.price === 0 ? '포함' : won(s.price)}</span>
              </li>
            ))}
          </ul>
          {quote.memo && (
            <div className="mb-3 rounded-lg border border-line bg-surface px-3 py-2 text-[13px] whitespace-pre-wrap text-ink-soft">{quote.memo}</div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {(['new', 'contacted', 'done'] as const).map(s => (
              <form key={s} action={updateMedinityQuoteStatus}>
                <input type="hidden" name="id" value={quote.id} />
                <input type="hidden" name="status" value={s} />
                <button
                  type="submit"
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${quote.status === s ? STATUS[s].chip : 'border border-line bg-surface text-ink-muted hover:bg-hover'}`}
                >
                  {STATUS[s].label}
                </button>
              </form>
            ))}
            <form action={deleteMedinityQuote} className="ml-auto">
              <input type="hidden" name="id" value={quote.id} />
              <button type="submit" aria-label="삭제" className="text-ink-muted transition hover:text-red-600">
                <Icon name="bin" className="size-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </li>
  )
}

export default function MedinityQuotesBoard({ quotes }: { quotes: MedinityQuote[] }) {
  if (quotes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line py-12 text-center text-sm text-ink-muted">
        아직 접수된 견적 요청이 없습니다.
      </div>
    )
  }
  return (
    <ul className="flex flex-col gap-2.5">
      {quotes.map(q => (
        <QuoteCard key={q.id} quote={q} />
      ))}
    </ul>
  )
}
