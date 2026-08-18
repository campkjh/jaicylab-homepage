'use client'

import { useMemo, useState } from 'react'
import { Check, Plus, Minus } from 'lucide-react'
import {
  MEDINITY_SECTIONS,
  MEDINITY_CHOICE_INDEX,
  includedChoiceIds,
  totalPageCount,
  priceOfChoice,
  stepperPrice,
  VAT_RATE,
  formatWon,
} from '@/data/medinity'
import { MedinitySectionIcon } from '@/components/medinity/MedinitySectionIcon'
import { InteractionPreview } from '@/components/medinity/InteractionPreview'
import { AnimatedWon } from '@/components/medinity/AnimatedWon'
import { GoogleIcon } from '@/components/medinity/GoogleIcon'
import { PrintableSpec, type SpecGroup } from './PrintableSpec'

type Line = { key: string; label: string; sub?: string; price: number }

/**
 * 홈페이지 제작 견적 — 메디니티(/medinity)와 동일한 카탈로그·계산·레이아웃.
 * 자가견적 페이지의 '홈페이지 견적' 탭에서 렌더된다.
 */
export function WebQuotePanel({ onSubmit }: { onSubmit?: (total: number) => void }) {
  const sections = MEDINITY_SECTIONS

  const [singles, setSingles] = useState<Record<string, string>>(() => {
    const o: Record<string, string> = {}
    for (const s of sections) if (s.mode === 'single' && s.choices?.[0]) o[s.id] = s.choices[0].id
    return o
  })
  const [multi, setMulti] = useState<Set<string>>(new Set())
  const [steppers, setSteppers] = useState<Record<string, number>>(() => {
    const o: Record<string, number> = {}
    for (const s of sections) if (s.stepper) o[s.stepper.id] = s.stepper.default
    return o
  })

  const modeOf = (id: string) => sections.find(s => s.id === MEDINITY_CHOICE_INDEX[id]?.sectionId)?.mode

  const pickSingle = (sectionId: string, choiceId: string) => {
    const newInc = MEDINITY_CHOICE_INDEX[choiceId]?.includes ?? []
    setSingles(prev => {
      const next = { ...prev, [sectionId]: choiceId }
      for (const incId of newInc) {
        if (modeOf(incId) === 'single' && MEDINITY_CHOICE_INDEX[incId]) next[MEDINITY_CHOICE_INDEX[incId].sectionId] = incId
      }
      return next
    })
    setMulti(prev => {
      const next = new Set(prev)
      for (const incId of newInc) if (modeOf(incId) === 'multi') next.add(incId)
      return next
    })
  }

  const toggleMulti = (id: string, childIds: string[] = []) => {
    setMulti(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id); childIds.forEach(c => next.delete(c)) }
      else next.add(id)
      return next
    })
  }
  const toggleChild = (_parentId: string, childId: string) => {
    setMulti(prev => { const n = new Set(prev); n.has(childId) ? n.delete(childId) : n.add(childId); return n })
  }
  const setQty = (id: string, min: number, max: number, delta: number) =>
    setSteppers(p => ({ ...p, [id]: Math.max(min, Math.min(max, (p[id] ?? 0) + delta)) }))

  const picked = useMemo(() => new Set([...Object.values(singles), ...multi]), [singles, multi])
  const includedIds = useMemo(() => includedChoiceIds(picked), [picked])
  const extraPages = Math.max(0, Math.floor(Number(steppers['extra-page'] ?? 0)))
  const totalPages = useMemo(() => totalPageCount(picked, extraPages), [picked, extraPages])
  const basePages = totalPages - extraPages

  const lines: Line[] = useMemo(() => {
    const out: Line[] = []
    for (const s of sections) {
      for (const ch of s.choices ?? []) {
        if (!picked.has(ch.id)) continue
        const inc = includedIds.has(ch.id)
        out.push({
          key: ch.id,
          label: ch.name,
          sub: inc ? `${s.title} · 기본 포함` : ch.perPage != null ? `${s.title} · ${totalPages}페이지 기준` : s.title,
          price: inc ? 0 : priceOfChoice(ch, totalPages),
        })
        for (const child of ch.children ?? []) {
          if (picked.has(child.id)) out.push({ key: child.id, label: child.name, sub: ch.name, price: child.price })
        }
      }
      if (s.id === 'integration' && !picked.has('int-navermap')) {
        out.push({ key: 'googlemap', label: '구글 지도 연동', sub: '연동 · 기본 무료', price: 0 })
      }
      if (s.stepper) {
        const st = s.stepper
        const qty = Math.max(st.min, Math.min(st.max, Math.floor(Number(steppers[st.id] ?? 0))))
        if (qty > 0) {
          const free = st.freeUnits ? ` · ${st.freeUnits}${st.unit}까지 무료` : ''
          out.push({ key: st.id, label: `${st.name} ${qty}${st.unit}`, sub: `${s.title}${free}`, price: stepperPrice(st, qty) })
        }
      }
    }
    return out
  }, [sections, picked, includedIds, totalPages, steppers])

  // 견적서 PDF — 섹션별 기능명세 + 맨먼스/투입인원(홈페이지 제작 기준)
  const specGroups: SpecGroup[] = useMemo(() => {
    const out: SpecGroup[] = []
    for (const s of sections) {
      const items: { label: string; sub?: string; price: number }[] = []
      for (const ch of s.choices ?? []) {
        if (!picked.has(ch.id)) continue
        items.push({ label: ch.name, sub: ch.desc, price: includedIds.has(ch.id) ? 0 : priceOfChoice(ch, totalPages) })
        for (const child of ch.children ?? []) if (picked.has(child.id)) items.push({ label: `└ ${child.name}`, price: child.price })
      }
      if (s.id === 'integration' && !picked.has('int-navermap')) items.push({ label: '구글 지도 연동', sub: '기본 무료', price: 0 })
      if (s.stepper) {
        const st = s.stepper
        const qty = Math.max(st.min, Math.min(st.max, Math.floor(Number(steppers[st.id] ?? 0))))
        if (qty > 0) items.push({ label: `${st.name} ${qty}${st.unit}`, price: stepperPrice(st, qty) })
      }
      if (items.length) out.push({ title: s.title, items })
    }
    return out
  }, [sections, picked, includedIds, totalPages, steppers])

  const subtotal = lines.reduce((sum, l) => sum + l.price, 0)
  const vat = Math.round(subtotal * VAT_RATE)
  const total = subtotal + vat

  // 맨먼스: 공급가 / 600만원. 홈페이지 제작 표준 롤 배분.
  const MM_RATE = 6_000_000
  const totalMM = subtotal / MM_RATE
  const team = useMemo(() => {
    const w: Record<string, number> = { '프로덕트 디자이너': 0.34, '프론트엔드 개발자': 0.4, '백엔드 개발자': 0.14, '프로젝트 매니저 (PM)': 0.12 }
    return Object.entries(w).map(([role, ratio]) => ({ role, mm: totalMM * ratio })).filter(t => t.mm > 0)
  }, [totalMM])
  const months = Math.max(0.5, totalMM / 1.8)

  const [printDate, setPrintDate] = useState('')
  function printSpec() {
    const d = new Date()
    setPrintDate(`${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}`)
    setTimeout(() => window.print(), 80)
  }

  return (
    <div className="mx-auto grid max-w-[1320px] gap-8 px-6 lg:grid-cols-[1fr_400px]">
      {/* 옵션 선택 */}
      <div className="flex flex-col gap-4">
        {sections.map(section => (
          <section key={section.id} className="rounded-[24px] bg-white p-5">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#F2F3F5]">
                <MedinitySectionIcon name={section.icon} className="size-6" />
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-[15px] font-bold text-[#2B313D]">
                  {section.title}
                  {section.required && <span className="rounded bg-[#F2F3F5] px-1.5 py-0.5 text-[10px] font-semibold text-[#51535C]">필수</span>}
                </h3>
                {section.desc && <p className="mt-0.5 text-[13px] text-[#A4ABBA]">{section.desc}</p>}
              </div>
            </div>

            {/* 단일 선택 (라디오 카드) */}
            {section.mode === 'single' && (
              <div className="grid gap-2 sm:grid-cols-3">
                {section.choices!.map(ch => {
                  const on = singles[section.id] === ch.id
                  return (
                    <button
                      key={ch.id}
                      onClick={() => pickSingle(section.id, ch.id)}
                      className={`flex flex-col rounded-xl border p-3 text-left transition ${on ? 'border-[#3180F7] bg-[#EAF2FF] ring-1 ring-[#3180F7]' : 'border-[#C8CEDA] hover:border-[#A4ABBA]'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#2B313D]">{ch.name}</span>
                        <span className={`flex size-5 items-center justify-center rounded-md border ${on ? 'border-[#3180F7] bg-[#3180F7] text-white' : 'border-[#C8CEDA]'}`}>
                          {on && <Check className="size-3.5" strokeWidth={3} />}
                        </span>
                      </div>
                      {ch.desc && <span className="mt-1 text-[12px] leading-snug text-[#A4ABBA]">{ch.desc}</span>}
                      {section.id === 'interaction' && (
                        <span className="mt-2.5 block">
                          <InteractionPreview level={ch.id === 'inter-high' ? 'high' : ch.id === 'inter-mid' ? 'mid' : 'low'} />
                        </span>
                      )}
                      <span className="mt-2 text-sm font-bold text-[#2B313D]">
                        {includedIds.has(ch.id) ? '포함' : formatWon(priceOfChoice(ch, totalPages))}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}

            {/* 다중 선택 (토글 + 하위 옵션) */}
            {section.mode === 'multi' && (
              <div className="flex flex-col gap-2">
                {section.choices!.map(ch => {
                  const on = multi.has(ch.id)
                  const childIds = (ch.children ?? []).map(x => x.id)
                  return (
                    <div key={ch.id} className={`rounded-xl border transition ${on ? 'border-[#3180F7]' : 'border-[#C8CEDA]'}`}>
                      <button onClick={() => toggleMulti(ch.id, childIds)} className="flex w-full items-center gap-3 p-3 text-left">
                        <span className={`flex size-5 shrink-0 items-center justify-center rounded-md border ${on ? 'border-[#3180F7] bg-[#3180F7] text-white' : 'border-[#C8CEDA]'}`}>
                          {on && <Check className="size-3.5" strokeWidth={3} />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="text-sm font-semibold text-[#2B313D]">{ch.name}</span>
                          {ch.desc && <span className="mt-0.5 block text-[12px] leading-snug text-[#A4ABBA]">{ch.desc}</span>}
                        </span>
                        <span className="shrink-0 text-sm font-bold text-[#2B313D]">
                          {includedIds.has(ch.id) ? '포함' : ch.price === 0 ? '기본 0원' : `+${formatWon(ch.price)}`}
                        </span>
                      </button>

                      {on && ch.children && ch.children.length > 0 && (
                        <div className="border-t border-[#F2F3F5] bg-[#F2F3F5]/60 p-2 pl-3">
                          <div className="mb-1 pl-1 text-[11px] font-semibold text-[#A4ABBA]">알림 · 자동화 채널 추가</div>
                          <div className="grid gap-1.5 sm:grid-cols-2">
                            {ch.children.map(child => {
                              const cOn = multi.has(child.id)
                              return (
                                <button
                                  key={child.id}
                                  onClick={() => toggleChild(ch.id, child.id)}
                                  className={`flex items-center gap-2 rounded-lg border bg-white px-2.5 py-2 text-left transition ${cOn ? 'border-[#3180F7]' : 'border-[#C8CEDA] hover:border-[#A4ABBA]'}`}
                                >
                                  <span className={`flex size-4 shrink-0 items-center justify-center rounded border ${cOn ? 'border-[#3180F7] bg-[#3180F7] text-white' : 'border-[#C8CEDA]'}`}>
                                    {cOn && <Check className="size-2.5" strokeWidth={3} />}
                                  </span>
                                  <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-[#2B313D]">{child.name}</span>
                                  <span className="shrink-0 text-[12px] font-semibold text-[#51535C]">+{formatWon(child.price)}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {ch.id === 'int-navermap' && !on && (
                        <div className="flex items-center gap-2 border-t border-[#F2F3F5] bg-[#F2F3F5]/60 px-3 py-2 text-[12px] text-[#51535C]">
                          <GoogleIcon className="size-4 shrink-0" />
                          <span>선택 안 하면 <b className="text-[#2B313D]">구글 지도</b>로 무료 연동됩니다</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* 수량 스텝퍼 */}
            {section.mode === 'stepper' && section.stepper && (() => {
              const st = section.stepper!
              const q = steppers[st.id] ?? 0
              return (
                <>
                  {section.id === 'pages' && (
                    <div className="mb-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl bg-[#F2F3F5] px-3 py-2.5 text-[12px] text-[#51535C]">
                      <span>기본 패키지 <b className="text-[#2B313D]">{basePages}페이지</b></span>
                      <span className="text-[#C8CEDA]">+</span>
                      <span>추가 <b className="text-[#2B313D]">{q}페이지</b></span>
                      <span className="ml-auto rounded-md bg-white px-2 py-0.5 font-semibold text-[#3180F7]">총 {basePages + q}페이지</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between rounded-xl border border-[#C8CEDA] p-3">
                    <div>
                      <div className="text-sm font-semibold text-[#2B313D]">{st.name}</div>
                      <div className="mt-0.5 text-[12px] text-[#A4ABBA]">
                        {st.freeUnits ? `${st.freeUnits}${st.unit}까지 무료 · 이후 ` : ''}{formatWon(st.unitPrice)} / {st.unit}
                        {q > 0 && <b className="text-[#51535C]"> · 소계 {formatWon(stepperPrice(st, q))}</b>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setQty(st.id, st.min, st.max, -1)} disabled={q <= st.min}
                        className="flex size-8 items-center justify-center rounded-lg border border-[#C8CEDA] text-[#51535C] transition hover:bg-[#F2F3F5] disabled:opacity-30">
                        <Minus className="size-4" />
                      </button>
                      <span className="w-8 text-center text-base font-bold tabular-nums text-[#2B313D]">{q}</span>
                      <button onClick={() => setQty(st.id, st.min, st.max, 1)} disabled={q >= st.max}
                        className="flex size-8 items-center justify-center rounded-lg border border-[#C8CEDA] text-[#51535C] transition hover:bg-[#F2F3F5] disabled:opacity-30">
                        <Plus className="size-4" />
                      </button>
                    </div>
                  </div>
                </>
              )
            })()}
          </section>
        ))}
      </div>

      {/* 견적 요약 */}
      <aside>
        <div className="scrollbar-hide sticky top-[80px] max-h-[calc(100vh-96px)] space-y-4 overflow-y-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          <div className="rounded-[24px] bg-white p-5">
            <div className="flex items-center gap-2">
              <MedinitySectionIcon name="summary" className="size-5" />
              <h2 className="text-[15px] font-bold text-[#2B313D]">견적 요약</h2>
              <span className="ml-auto rounded-full bg-[#F2F3F5] px-2 py-0.5 text-[11px] font-semibold text-[#51535C]">{lines.length}개</span>
            </div>

            <ul className="mt-3 flex max-h-[38vh] flex-col gap-1 overflow-y-auto">
              {lines.map(l => (
                <li key={l.key} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] hover:bg-[#F2F3F5]">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-[#2B313D]">{l.label}</span>
                    {l.sub && <span className="block truncate text-[11px] text-[#A4ABBA]">{l.sub}</span>}
                  </span>
                  <span className="shrink-0 tabular-nums text-[#51535C]">{l.price === 0 ? '포함' : formatWon(l.price)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 space-y-1 border-t border-[#C8CEDA] pt-3 text-[13px]">
              <div className="flex justify-between text-[#51535C]"><span>공급가</span><AnimatedWon value={subtotal} className="tabular-nums" /></div>
              <div className="flex justify-between text-[#51535C]"><span>부가세 (10%)</span><AnimatedWon value={vat} className="tabular-nums" /></div>
              <div className="flex items-center justify-between pt-1 text-base font-bold">
                <span className="text-[#2B313D]">합계</span>
                <AnimatedWon value={total} className="tabular-nums text-[#3180F7]" />
              </div>
            </div>

            <button
              type="button"
              onClick={printSpec}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#F2F3F5] py-3 text-[13px] font-bold text-[#51535C] transition-colors hover:bg-[#E3E6EB] active:scale-[0.98]"
            >
              <MedinitySectionIcon name="printer" className="size-4" /> 견적서 PDF 출력
            </button>

            <button
              type="button"
              onClick={() => onSubmit?.(total)}
              className="mt-2 flex w-full items-center justify-center rounded-[14px] bg-[#3180F7] py-3.5 text-[14px] font-bold text-white transition-colors duration-200 hover:bg-[#2470E6] active:scale-[0.98]"
            >
              제출하기
            </button>
          </div>
        </div>
      </aside>

      {/* 견적서 PDF (인쇄 전용) */}
      <div className="print-doc hidden print:fixed print:inset-0 print:z-[999] print:block print:bg-white">
        <PrintableSpec
          title="홈페이지 제작 견적서 · 기능명세서"
          date={printDate}
          groups={specGroups}
          subtotal={subtotal}
          vat={vat}
          total={total}
          unit="원"
          totalMM={totalMM}
          months={months}
          team={team}
          mmRateLabel="맨먼스 단가 평균 600만원 (혼합 인력 기준) 적용."
        />
      </div>
    </div>
  )
}
