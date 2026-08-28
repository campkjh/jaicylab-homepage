'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Field, Input, Textarea, Select, Button } from '@/components/admin/ui'
import { ContractDocument } from '@/components/admin/ContractDocument'
import {
  computeAmounts, formatWon, emptyDraft, computeSchedule,
  DEFAULT_SCHEDULE, KIND_LABEL, KIND_TITLE, type ContractDraft,
} from '@/lib/contract-template'
import { saveContract, deleteContract, type ContractInput } from '@/app/admin/(dashboard)/contracts/actions'
import type { Contract, ContractSpecialTerm } from '@/lib/types'

export type ClientLite = {
  id: number
  name: string
  company: string | null
  business_number: string | null
  ceo_name: string | null
  address: string | null
  phone: string | null
}

function fromContract(c: Contract): State {
  return {
    id: c.id,
    client_id: c.client_id,
    status: c.status,
    draft: {
      kind: c.kind || 'homepage',
      payment_type: c.payment_type || 'lump',
      payment_schedule: Array.isArray(c.payment_schedule) && c.payment_schedule.length ? c.payment_schedule : DEFAULT_SCHEDULE,
      title: c.title,
      gap_company: c.gap_company ?? '',
      gap_address: c.gap_address ?? '',
      gap_biz_no: c.gap_biz_no ?? '',
      gap_phone: c.gap_phone ?? '',
      gap_ceo: c.gap_ceo ?? '',
      dev_amount: c.dev_amount ?? 0,
      deposit: c.deposit ?? 'N/A',
      deposit_type: c.deposit_type ?? 'N/A',
      payment_terms: c.payment_terms ?? 'N/A',
      penalty_rate: c.penalty_rate ?? 'N/A',
      period: c.period ?? '',
      warranty: c.warranty ?? '',
      account: c.account ?? '',
      contract_date: c.contract_date,
      special_terms: Array.isArray(c.special_terms) ? c.special_terms : [],
    },
  }
}

type State = {
  id?: number
  client_id: number | null
  status: string
  draft: ContractDraft
}

export default function ContractEditor({ contract, clients }: { contract: Contract | null; clients: ClientLite[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [st, setSt] = useState<State>(() =>
    contract ? fromContract(contract) : { client_id: null, status: 'draft', draft: emptyDraft() },
  )

  const d = st.draft
  const set = (patch: Partial<ContractDraft>) => setSt(s => ({ ...s, draft: { ...s.draft, ...patch } }))
  const { dev, vat, total } = useMemo(() => computeAmounts(d.dev_amount), [d.dev_amount])

  function pickClient(idStr: string) {
    if (!idStr) {
      setSt(s => ({ ...s, client_id: null }))
      return
    }
    const c = clients.find(x => x.id === Number(idStr))
    if (!c) return
    setSt(s => ({
      ...s,
      client_id: c.id,
      draft: {
        ...s.draft,
        gap_company: c.company || c.name || '',
        gap_address: c.address || '',
        gap_biz_no: c.business_number || '',
        gap_phone: c.phone || '',
        gap_ceo: c.ceo_name || '',
      },
    }))
  }

  // 분야 · 대금 방식
  function setKind(kind: string) {
    setSt(s => {
      const wasDefault =
        !s.draft.title.trim() || s.draft.title === KIND_TITLE.homepage || s.draft.title === KIND_TITLE.app
      const nextTitle = wasDefault ? KIND_TITLE[kind as 'homepage' | 'app'] ?? s.draft.title : s.draft.title
      return { ...s, draft: { ...s.draft, kind, title: nextTitle } }
    })
  }
  function setPaymentType(pt: string) {
    set({
      payment_type: pt,
      payment_schedule:
        pt === 'installment' && (!d.payment_schedule || d.payment_schedule.length === 0)
          ? DEFAULT_SCHEDULE
          : d.payment_schedule,
    })
  }
  const setStage = (i: number, patch: Partial<{ label: string; percent: number }>) =>
    set({ payment_schedule: d.payment_schedule.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) })
  const addStage = () => set({ payment_schedule: [...d.payment_schedule, { label: '', percent: 0 }] })
  const removeStage = (i: number) => set({ payment_schedule: d.payment_schedule.filter((_, idx) => idx !== i) })
  const sched = useMemo(() => computeSchedule(d.dev_amount, d.payment_schedule), [d.dev_amount, d.payment_schedule])
  const pctSum = (d.payment_schedule ?? []).reduce((a, b) => a + (Number(b.percent) || 0), 0)

  // 특약
  const addTerm = () => set({ special_terms: [...d.special_terms, { title: '', body: '' }] })
  const setTerm = (i: number, patch: Partial<ContractSpecialTerm>) =>
    set({ special_terms: d.special_terms.map((t, idx) => (idx === i ? { ...t, ...patch } : t)) })
  const removeTerm = (i: number) => set({ special_terms: d.special_terms.filter((_, idx) => idx !== i) })

  function save(next?: Partial<{ status: string }>) {
    const status = next?.status ?? st.status
    const input: ContractInput = {
      id: st.id,
      client_id: st.client_id,
      kind: d.kind || 'homepage',
      payment_type: d.payment_type || 'lump',
      payment_schedule: d.payment_type === 'installment' ? d.payment_schedule : [],
      title: d.title || '외주용역 홈페이지 개발',
      gap_company: d.gap_company ?? '',
      gap_address: d.gap_address ?? '',
      gap_biz_no: d.gap_biz_no ?? '',
      gap_phone: d.gap_phone ?? '',
      gap_ceo: d.gap_ceo ?? '',
      dev_amount: Math.max(0, Math.round(Number(d.dev_amount) || 0)),
      deposit: d.deposit ?? '',
      deposit_type: d.deposit_type ?? '',
      payment_terms: d.payment_terms ?? '',
      penalty_rate: d.penalty_rate ?? '',
      period: d.period ?? '',
      warranty: d.warranty ?? '',
      account: d.account ?? '',
      contract_date: d.contract_date ?? null,
      special_terms: d.special_terms.filter(t => (t.title || t.body).trim()),
      status,
    }
    startTransition(async () => {
      try {
        const id = await saveContract(input)
        toast.success('저장했어요.')
        if (!st.id) router.replace(`/admin/contracts/${id}`)
        else setSt(s => ({ ...s, status }))
      } catch {
        toast.error('저장에 실패했어요.')
      }
    })
  }

  function remove() {
    if (!st.id) return
    if (!confirm('이 계약서를 삭제할까요?')) return
    startTransition(async () => {
      try {
        await deleteContract(st.id!)
        toast.success('삭제했어요.')
        router.push('/admin/contracts')
      } catch {
        toast.error('삭제에 실패했어요.')
      }
    })
  }

  return (
    <div className="mx-auto w-full max-w-[1320px]">
      {/* 상단 액션 바 — 인쇄 시 숨김 */}
      <div className="contract-toolbar mb-5 flex flex-wrap items-center gap-2">
        <Link href="/admin/contracts" className="text-sm text-ink-muted hover:text-ink">← 목록</Link>
        <h1 className="text-[20px] font-semibold tracking-tight text-ink">
          {st.id ? '계약서 편집' : '새 계약서'}
        </h1>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {st.id && (
            <Button variant="danger" onClick={remove} disabled={pending}>삭제</Button>
          )}
          <Button variant="ghost" onClick={() => window.print()}>PDF 출력</Button>
          <Button variant="ghost" onClick={() => save({ status: st.status === 'signed' ? 'draft' : 'signed' })} disabled={pending}>
            {st.status === 'signed' ? '체결 해제' : '체결로 표시'}
          </Button>
          <Button onClick={() => save()} disabled={pending}>{pending ? '저장 중…' : '저장'}</Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[440px_1fr]">
        {/* 왼쪽: 입력 폼 */}
        <div className="contract-toolbar space-y-5">
          <FormCard title="계약 유형">
            <div className="grid grid-cols-2 gap-3">
              <Field label="분야">
                <Select value={d.kind} onChange={e => setKind(e.target.value)}>
                  <option value="homepage">홈페이지 개발</option>
                  <option value="app">앱 개발</option>
                </Select>
              </Field>
              <Field label="대금 방식">
                <Select value={d.payment_type} onChange={e => setPaymentType(e.target.value)}>
                  <option value="lump">일시금</option>
                  <option value="installment">중도금·잔금 (분할)</option>
                </Select>
              </Field>
            </div>
            {d.payment_type === 'installment' && (
              <div className="rounded-lg border border-line p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-ink-soft">대금 지급 일정 (개발비 기준)</span>
                  <button type="button" onClick={addStage} className="text-xs font-medium text-brand hover:underline">+ 단계</button>
                </div>
                <div className="space-y-2">
                  {d.payment_schedule.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input className="w-24" placeholder="단계명" value={s.label} onChange={e => setStage(i, { label: e.target.value })} />
                      <div className="relative w-20 shrink-0">
                        <Input type="number" min={0} max={100} inputMode="numeric" value={s.percent || ''} onChange={e => setStage(i, { percent: Number(e.target.value) || 0 })} className="pr-6" />
                        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-ink-muted">%</span>
                      </div>
                      <span className="flex-1 text-right text-[13px] tabular-nums text-ink">{formatWon(sched[i]?.amount ?? 0)}</span>
                      <button type="button" onClick={() => removeStage(i)} aria-label="삭제" className="shrink-0 rounded-md px-1.5 py-1 text-sm text-red-500 hover:bg-red-50">✕</button>
                    </div>
                  ))}
                </div>
                <div className={`mt-2 text-right text-[12px] ${pctSum === 100 ? 'text-ink-muted' : 'text-red-500'}`}>
                  합계 {pctSum}%{pctSum !== 100 ? ' — 100%로 맞춰주세요' : ''}
                </div>
              </div>
            )}
          </FormCard>

          <FormCard title="고객 (갑)">
            <Field label="고객 선택">
              <Select value={st.client_id ?? ''} onChange={e => pickClient(e.target.value)}>
                <option value="">직접 입력</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.company || c.name}</option>
                ))}
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="상호"><Input value={d.gap_company ?? ''} onChange={e => set({ gap_company: e.target.value })} /></Field>
              <Field label="대표자"><Input value={d.gap_ceo ?? ''} onChange={e => set({ gap_ceo: e.target.value })} /></Field>
            </div>
            <Field label="주소"><Input value={d.gap_address ?? ''} onChange={e => set({ gap_address: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="사업자번호"><Input value={d.gap_biz_no ?? ''} onChange={e => set({ gap_biz_no: e.target.value })} /></Field>
              <Field label="대표전화"><Input value={d.gap_phone ?? ''} onChange={e => set({ gap_phone: e.target.value })} /></Field>
            </div>
          </FormCard>

          <FormCard title="계약 · 금액">
            <Field label="계약명"><Input value={d.title} onChange={e => set({ title: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="개발비 (공급가, 원)">
                <Input
                  type="number" min={0} step={10000} inputMode="numeric"
                  value={d.dev_amount || ''}
                  onChange={e => set({ dev_amount: Number(e.target.value) || 0 })}
                />
              </Field>
              <Field label="계약일">
                <Input type="date" value={d.contract_date ?? ''} onChange={e => set({ contract_date: e.target.value || null })} />
              </Field>
            </div>
            <div className="rounded-lg bg-hover px-3 py-2 text-[13px] text-ink-soft">
              <div className="flex justify-between"><span>공급가</span><b className="tabular-nums text-ink">{formatWon(dev)}</b></div>
              <div className="flex justify-between"><span>부가세 (10%)</span><b className="tabular-nums text-ink">{formatWon(vat)}</b></div>
              <div className="flex justify-between border-t border-line pt-1"><span>합계</span><b className="tabular-nums text-brand">{formatWon(total)}</b></div>
            </div>
          </FormCard>

          <FormCard title="계약 조건">
            <div className="grid grid-cols-2 gap-3">
              <Field label="계약 보증금"><Input value={d.deposit ?? ''} onChange={e => set({ deposit: e.target.value })} /></Field>
              <Field label="보증금 구분"><Input value={d.deposit_type ?? ''} onChange={e => set({ deposit_type: e.target.value })} /></Field>
              <Field label="대금지급"><Input value={d.payment_terms ?? ''} onChange={e => set({ payment_terms: e.target.value })} /></Field>
              <Field label="지체상금율"><Input value={d.penalty_rate ?? ''} onChange={e => set({ penalty_rate: e.target.value })} /></Field>
            </div>
            <Field label="계약기간"><Input value={d.period ?? ''} onChange={e => set({ period: e.target.value })} /></Field>
            <Field label="사후오류보증"><Input value={d.warranty ?? ''} onChange={e => set({ warranty: e.target.value })} /></Field>
            <Field label="입금계좌"><Input value={d.account ?? ''} onChange={e => set({ account: e.target.value })} /></Field>
          </FormCard>

          <FormCard title="특약사항" action={<button type="button" onClick={addTerm} className="text-sm font-medium text-brand hover:underline">+ 특약 추가</button>}>
            {d.special_terms.length === 0 ? (
              <p className="text-[13px] text-ink-muted">필요 시 특약을 추가하면 PDF 마지막에 별도 페이지로 붙습니다.</p>
            ) : (
              <div className="space-y-3">
                {d.special_terms.map((t, i) => (
                  <div key={i} className="rounded-lg border border-line p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <Input placeholder={`특약 ${i + 1} 제목 (선택)`} value={t.title} onChange={e => setTerm(i, { title: e.target.value })} />
                      <button type="button" onClick={() => removeTerm(i)} aria-label="삭제" className="shrink-0 rounded-md px-2 py-1 text-sm text-red-500 hover:bg-red-50">✕</button>
                    </div>
                    <Textarea rows={3} placeholder="특약 내용" value={t.body} onChange={e => setTerm(i, { body: e.target.value })} />
                  </div>
                ))}
              </div>
            )}
          </FormCard>
        </div>

        {/* 오른쪽: 미리보기 */}
        <div className="min-w-0">
          <div className="contract-toolbar mb-2 text-[13px] text-ink-muted">미리보기 · ‘PDF 출력’ → 인쇄 대화상자에서 “PDF로 저장”</div>
          <div className="contract-preview overflow-auto rounded-xl border border-line bg-[#f1f3f5] p-4 shadow-inner">
            <div className="mx-auto bg-white shadow-[0_4px_24px_rgba(15,23,42,0.12)]">
              <ContractDocument data={d} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FormCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-[0_1px_2px_rgba(15,15,15,0.04)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {action}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}
