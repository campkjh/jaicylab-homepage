'use client'

import { useMemo, useState } from 'react'
import {
  MEDINITY_SECTIONS,
  MEDINITY_CHOICE_INDEX,
  includedChoiceIds,
  totalPageCount,
  priceOfChoice,
  stepperPrice,
  VAT_RATE,
  formatWon,
  type MedinitySection,
} from '@/data/medinity'
import { UiIcon } from './UiIcon'

type Line = { key: string; label: string; sub?: string; price: number }

/**
 * 홈페이지 제작 견적 (메디니티와 동일한 카탈로그·계산 로직).
 * 자가견적 페이지의 '홈페이지' 탭에서 렌더된다.
 */
export function WebQuotePanel({ onSubmit }: { onSubmit?: (total: number) => void }) {
  const sections = MEDINITY_SECTIONS

  // 필수 단일 섹션은 첫 옵션을 기본 선택
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
      if (next.has(id)) {
        next.delete(id)
        childIds.forEach(c => next.delete(c)) // 부모를 끄면 하위도 함께
      } else next.add(id)
      return next
    })
  }

  const picked = useMemo(() => new Set([...Object.values(singles), ...multi]), [singles, multi])
  const includedIds = useMemo(() => includedChoiceIds(picked), [picked])
  const extraPages = Math.max(0, Math.floor(Number(steppers['extra-page'] ?? 0)))
  const totalPages = useMemo(() => totalPageCount(picked, extraPages), [picked, extraPages])

  const lines: Line[] = useMemo(() => {
    const out: Line[] = []
    for (const s of sections) {
      for (const ch of s.choices ?? []) {
        if (!picked.has(ch.id)) continue
        const inc = includedIds.has(ch.id)
        const base = priceOfChoice(ch, totalPages)
        out.push({
          key: ch.id,
          label: ch.name,
          sub: inc ? `${s.title} · 기본 포함` : ch.perPage != null ? `${s.title} · ${totalPages}페이지 기준` : s.title,
          price: inc ? 0 : base,
        })
        for (const child of ch.children ?? []) {
          if (picked.has(child.id)) out.push({ key: child.id, label: child.name, sub: ch.name, price: child.price })
        }
      }
      // 네이버 지도 미선택 시 구글 지도 기본 무료
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

  const subtotal = lines.reduce((sum, l) => sum + l.price, 0)
  const vat = Math.round(subtotal * VAT_RATE)
  const total = subtotal + vat

  return (
    <div className="mx-auto grid max-w-[1320px] gap-8 px-6 lg:grid-cols-[1fr_400px]">
      {/* 옵션 선택 */}
      <div className="space-y-4">
        {sections.map(section => (
          <SectionCard
            key={section.id}
            section={section}
            singles={singles}
            multi={multi}
            steppers={steppers}
            includedIds={includedIds}
            totalPages={totalPages}
            onPickSingle={pickSingle}
            onToggleMulti={toggleMulti}
            onStepper={(id, v) => setSteppers(p => ({ ...p, [id]: v }))}
          />
        ))}
      </div>

      {/* 견적 요약 */}
      <aside>
        <div className="scrollbar-hide sticky top-[80px] max-h-[calc(100vh-96px)] space-y-4 overflow-y-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          <div className="rounded-[24px] bg-white p-5">
            <div className="flex items-center gap-2">
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
              <div className="flex justify-between text-[#51535C]"><span>공급가</span><span className="tabular-nums">{formatWon(subtotal)}</span></div>
              <div className="flex justify-between text-[#51535C]"><span>부가세 (10%)</span><span className="tabular-nums">{formatWon(vat)}</span></div>
              <div className="flex items-center justify-between pt-1 text-base font-bold">
                <span className="text-[#2B313D]">합계</span>
                <span className="tabular-nums text-[#3180F7]">{formatWon(total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSubmit?.(total)}
              className="mt-4 flex w-full items-center justify-center rounded-[14px] bg-[#3180F7] py-3.5 text-[14px] font-bold text-white transition-colors duration-200 hover:bg-[#2470E6] active:scale-[0.98]"
            >
              제출하기
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}

function SectionCard({
  section, singles, multi, steppers, includedIds, totalPages, onPickSingle, onToggleMulti, onStepper,
}: {
  section: MedinitySection
  singles: Record<string, string>
  multi: Set<string>
  steppers: Record<string, number>
  includedIds: Set<string>
  totalPages: number
  onPickSingle: (sectionId: string, choiceId: string) => void
  onToggleMulti: (id: string, childIds?: string[]) => void
  onStepper: (id: string, v: number) => void
}) {
  return (
    <div className="rounded-[18px] bg-white p-6">
      <div className="flex items-baseline gap-2">
        <h3 className="text-[15px] font-bold text-[#2B313D]">{section.title}</h3>
        {section.mode === 'single' && section.required && (
          <span className="rounded-full bg-[#EAF2FF] px-2 py-0.5 text-[10px] font-bold text-[#3180F7]">필수</span>
        )}
      </div>
      {section.desc && <p className="mt-1 text-[12.5px] text-[#A4ABBA]">{section.desc}</p>}

      {/* single / multi 옵션 */}
      {section.choices && (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {section.choices.map(ch => {
            const isSingle = section.mode === 'single'
            const active = isSingle ? singles[section.id] === ch.id : multi.has(ch.id)
            const included = includedIds.has(ch.id)
            const price = priceOfChoice(ch, totalPages)
            const childIds = (ch.children ?? []).map(x => x.id)
            return (
              <div key={ch.id}>
                <button
                  type="button"
                  onClick={() => (isSingle ? onPickSingle(section.id, ch.id) : onToggleMulti(ch.id, childIds))}
                  className={`w-full rounded-[14px] p-4 text-left transition-colors ${active ? 'bg-[#EAF2FF]' : 'bg-[#F2F3F5] hover:bg-[#E3E6EB]'}`}
                >
                  <div className="flex items-start gap-2">
                    <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded ${active ? 'bg-[#3180F7]' : 'bg-white'}`}>
                      {active && <UiIcon name="check" className="h-3 w-3 text-white" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13.5px] font-bold text-[#2B313D]">{ch.name}</span>
                      {ch.desc && <span className="mt-0.5 block text-[11.5px] leading-relaxed text-[#A4ABBA]">{ch.desc}</span>}
                    </span>
                    <span className={`shrink-0 text-[12px] font-bold ${included ? 'text-[#3180F7]' : 'text-[#51535C]'}`}>
                      {included ? '포함' : price === 0 ? '무료' : formatWon(price)}
                    </span>
                  </div>
                </button>

                {/* 하위 옵션 */}
                {ch.children && (multi.has(ch.id) || singles[section.id] === ch.id) && (
                  <div className="mt-1.5 space-y-1.5 pl-4">
                    {ch.children.map(child => {
                      const on = multi.has(child.id)
                      return (
                        <button
                          key={child.id}
                          type="button"
                          onClick={() => onToggleMulti(child.id)}
                          className={`flex w-full items-center gap-2 rounded-[12px] px-3 py-2 text-left transition-colors ${on ? 'bg-[#EAF2FF]' : 'bg-[#F2F3F5] hover:bg-[#E3E6EB]'}`}
                        >
                          <span className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded ${on ? 'bg-[#3180F7]' : 'bg-white'}`}>
                            {on && <UiIcon name="check" className="h-2.5 w-2.5 text-white" />}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-[#2B313D]">{child.name}</span>
                          <span className="shrink-0 text-[11.5px] font-bold text-[#51535C]">{formatWon(child.price)}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* 스텝퍼 */}
      {section.stepper && (() => {
        const st = section.stepper!
        const qty = Math.max(st.min, Math.min(st.max, Math.floor(Number(steppers[st.id] ?? 0))))
        return (
          <div className="mt-4 flex items-center gap-3 rounded-[14px] bg-[#F2F3F5] p-4">
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-bold text-[#2B313D]">{st.name}</p>
              {st.desc && <p className="mt-0.5 text-[11.5px] text-[#A4ABBA]">{st.desc}</p>}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button type="button" aria-label="감소" onClick={() => onStepper(st.id, Math.max(st.min, qty - 1))}
                className="grid h-8 w-8 place-items-center rounded-full bg-white text-[#51535C] transition-colors hover:bg-[#E3E6EB]">−</button>
              <span className="w-8 text-center text-[14px] font-bold tabular-nums text-[#2B313D]">{qty}</span>
              <button type="button" aria-label="증가" onClick={() => onStepper(st.id, Math.min(st.max, qty + 1))}
                className="grid h-8 w-8 place-items-center rounded-full bg-white text-[#51535C] transition-colors hover:bg-[#E3E6EB]">+</button>
            </div>
            <span className="w-20 shrink-0 text-right text-[12px] font-bold text-[#51535C]">
              {stepperPrice(st, qty) === 0 ? '무료' : formatWon(stepperPrice(st, qty))}
            </span>
          </div>
        )
      })()}
    </div>
  )
}
