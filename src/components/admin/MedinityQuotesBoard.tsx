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

// 홈 요청관리 단계(고객이 직접 넘김: 견적문의 → 개발의뢰 → 개발완료)
const REQ_STATUS: Record<string, { label: string; chip: string }> = {
  inquiry: { label: '견적 문의', chip: 'bg-slate-100 text-slate-600' },
  requested: { label: '개발 의뢰', chip: 'bg-indigo-50 text-indigo-700' },
  done: { label: '개발 완료', chip: 'bg-emerald-50 text-emerald-700' },
}

// 개발의뢰 정보 한 줄 표시용
function DevRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex gap-2 text-[13px]">
      <span className="w-20 shrink-0 text-ink-muted">{label}</span>
      <span className="min-w-0 flex-1 break-all font-medium text-ink-soft">{value}</span>
    </div>
  )
}

function won(n: number) {
  return `${n.toLocaleString('ko-KR')}원`
}

function QuoteCard({ quote, canPreview }: { quote: MedinityQuote; canPreview: boolean }) {
  const [open, setOpen] = useState(false)
  const st = STATUS[quote.status] ?? STATUS.new
  const date = quote.created_at?.slice(0, 16).replace('T', ' ')

  return (
    <li className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${st.chip}`}>{st.label}</span>
        {quote.req_status && REQ_STATUS[quote.req_status] && (
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${REQ_STATUS[quote.req_status].chip}`}>{REQ_STATUS[quote.req_status].label}</span>
        )}
        <span className="text-sm font-semibold text-ink">{quote.title || quote.clinic_name || quote.contact_name || `견적 요청 #${quote.id}`}</span>
        {(quote.contact_name || quote.phone) && (
          <span className="text-xs text-ink-muted">{[quote.contact_name, quote.phone, quote.email].filter(Boolean).join(' · ')}</span>
        )}
        {quote.reference_url && (
          <a href={quote.reference_url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-xs font-medium text-brand hover:underline">🔗 레퍼런스 링크</a>
        )}
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

          {quote.dev && Object.values(quote.dev).some(Boolean) && (
            <div className="mb-3 rounded-lg border border-line bg-surface px-3 py-2.5">
              <div className="mb-2 text-[11px] font-semibold text-brand">개발 의뢰 정보</div>
              <div className="flex flex-col gap-1">
                <DevRow label="구글 아이디" value={quote.dev.googleId} />
                <DevRow label="구글 비번" value={quote.dev.googlePw} />
                <DevRow label="네이버 아이디" value={quote.dev.naverId} />
                <DevRow label="네이버 비번" value={quote.dev.naverPw} />
                <DevRow label="카드번호" value={quote.dev.cardNumber} />
                <DevRow label="유효기간" value={quote.dev.cardExpiry} />
                <DevRow label="CVC" value={quote.dev.cardCvc} />
                <DevRow label="사업자번호" value={quote.dev.bizNumber} />
                <DevRow label="주소" value={quote.dev.address} />
                <DevRow label="대표자" value={quote.dev.ceo} />
              </div>
            </div>
          )}

          {canPreview && (
            <a
              href={`/medinity/site/${quote.id}`}
              target="_blank"
              rel="noreferrer"
              className="mb-3 flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-bold text-white transition hover:opacity-90"
              style={{ background: '#2E3A5C' }}
            >
              🦷 홈페이지 미리보기
            </a>
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

export default function MedinityQuotesBoard({ quotes, canPreview = true }: { quotes: MedinityQuote[]; canPreview?: boolean }) {
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
        <QuoteCard key={q.id} quote={q} canPreview={canPreview} />
      ))}
    </ul>
  )
}
