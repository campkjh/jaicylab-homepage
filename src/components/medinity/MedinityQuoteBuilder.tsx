'use client'

import { useMemo, useState } from 'react'
import { Plus, Minus, Check, X, Building2, Loader2, PartyPopper } from 'lucide-react'
import { toast } from 'sonner'
import { submitMedinityQuote, type MedinityQuoteInput } from '@/app/medinity/actions'
import { VAT_RATE, formatWon, includedChoiceIds, totalPageCount, priceOfChoice, stepperPrice, MEDINITY_CHOICE_INDEX, type MedinitySection } from '@/data/medinity'
import { MedinityLogo } from './MedinityLogo'
import { MedinitySectionIcon } from './MedinitySectionIcon'

type Line = { key: string; label: string; sub?: string; price: number; removable: boolean; onRemove?: () => void }

export default function MedinityQuoteBuilder({ sections }: { sections: MedinitySection[] }) {
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

  const [contact, setContact] = useState({ clinicName: '', contactName: '', phone: '', email: '', memo: '' })
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState<number | null>(null)

  const pickSingle = (sectionId: string, choiceId: string) =>
    setSingles(prev => {
      const next = { ...prev, [sectionId]: choiceId }
      // 프리미엄형 등 '기본 포함' 옵션을 고르면 포함된 단일 옵션도 자동 선택 (예: 상급 인터랙션)
      for (const incId of MEDINITY_CHOICE_INDEX[choiceId]?.includes ?? []) {
        const inc = MEDINITY_CHOICE_INDEX[incId]
        if (inc && sections.find(s => s.id === inc.sectionId)?.mode === 'single') next[inc.sectionId] = incId
      }
      return next
    })

  // 무료로 기본 포함되는 옵션 — 합계에서 0원 처리
  const includedIds = useMemo(() => includedChoiceIds([...Object.values(singles), ...multi]), [singles, multi])
  // 총 페이지 수 (기본 패키지 포함 + 추가 페이지) — 커스텀 모션 등 페이지당 단가 계산에 쓴다
  const totalPages = useMemo(
    () => totalPageCount(Object.values(singles), steppers['extra-page'] ?? 0),
    [singles, steppers],
  )

  const toggleMulti = (choiceId: string, childIds: string[] = []) =>
    setMulti(prev => {
      const n = new Set(prev)
      if (n.has(choiceId)) {
        n.delete(choiceId)
        childIds.forEach(id => n.delete(id)) // 부모를 끄면 하위도 함께 해제
      } else {
        n.add(choiceId)
      }
      return n
    })

  const toggleChild = (parentId: string, childId: string) =>
    setMulti(prev => {
      const n = new Set(prev)
      if (n.has(childId)) n.delete(childId)
      else { n.add(childId); n.add(parentId) } // 하위를 켜면 부모도 자동 선택
      return n
    })

  const setQty = (id: string, min: number, max: number, delta: number) =>
    setSteppers(p => ({ ...p, [id]: Math.max(min, Math.min(max, (p[id] ?? 0) + delta)) }))

  // 선택 내역(장바구니) — 서버 계산과 동일한 규칙
  const lines = useMemo<Line[]>(() => {
    const out: Line[] = []
    for (const s of sections) {
      if (s.mode === 'single') {
        const c = s.choices?.find(x => x.id === singles[s.id])
        if (c) {
          const inc = includedIds.has(c.id)
          const price = inc ? 0 : priceOfChoice(c, totalPages)
          if (s.required || inc || price > 0) {
            const sub = inc ? `${s.title} · 기본 포함` : c.perPage != null ? `${s.title} · ${totalPages}페이지 기준` : s.title
            out.push({ key: c.id, label: c.name, sub, price, removable: false })
          }
        }
      } else if (s.mode === 'multi') {
        for (const c of s.choices ?? []) {
          if (multi.has(c.id)) {
            const childIds = (c.children ?? []).map(ch => ch.id)
            out.push({ key: c.id, label: c.name, sub: s.title, price: includedIds.has(c.id) ? 0 : priceOfChoice(c, totalPages), removable: true, onRemove: () => toggleMulti(c.id, childIds) })
            for (const ch of c.children ?? []) {
              if (multi.has(ch.id)) out.push({ key: ch.id, label: ch.name, sub: c.name, price: ch.price, removable: true, onRemove: () => toggleChild(c.id, ch.id) })
            }
          }
        }
      } else if (s.mode === 'stepper' && s.stepper) {
        const st = s.stepper
        const q = steppers[st.id] ?? 0
        if (q > 0) {
          const free = st.freeUnits && q <= st.freeUnits ? '무료' : undefined
          out.push({ key: st.id, label: `${st.name} ${q}${st.unit}`, sub: free ? `${s.title} · ${free}` : s.title, price: stepperPrice(st, q), removable: true, onRemove: () => setSteppers(p => ({ ...p, [st.id]: 0 })) })
        }
      }
    }
    return out
  }, [sections, singles, multi, steppers])

  const subtotal = lines.reduce((sum, l) => sum + l.price, 0)
  const vat = Math.round(subtotal * VAT_RATE)
  const total = subtotal + vat

  const submit = async () => {
    if (!contact.contactName.trim() || !contact.phone.trim()) {
      toast.error('담당자 이름과 연락처를 입력해 주세요.')
      return
    }
    setSending(true)
    try {
      const payload: MedinityQuoteInput = {
        clinicName: contact.clinicName,
        contactName: contact.contactName,
        phone: contact.phone,
        email: contact.email,
        memo: contact.memo,
        choiceIds: [...Object.values(singles), ...multi],
        steppers,
      }
      const res = await submitMedinityQuote(payload)
      if (res.ok) setDone(res.id)
      else toast.error(res.error)
    } catch {
      toast.error('전송에 실패했어요. 잠시 후 다시 시도해 주세요.')
    } finally {
      setSending(false)
    }
  }

  if (done !== null) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-sky-500 text-white">
            <PartyPopper className="size-8" />
          </div>
          <h1 className="mt-6 text-2xl font-bold">견적 요청이 접수됐어요</h1>
          <p className="mt-2 text-slate-500">
            접수번호 <b className="text-slate-700">#{done}</b> · 예상 합계 <b className="text-sky-600">{formatWon(total)}</b>
            <br />담당자가 확인 후 빠르게 연락드릴게요.
          </p>
          <button
            onClick={() => { setDone(null); setContact({ clinicName: '', contactName: '', phone: '', email: '', memo: '' }) }}
            className="mt-8 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-white"
          >
            새 견적 만들기
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* 헤더 */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3.5">
          <MedinityLogo className="h-[22px] w-auto text-slate-900" />
          <div className="hidden h-4 w-px bg-slate-200 sm:block" />
          <h1 className="hidden text-[13px] font-semibold text-slate-500 sm:block">치과 홈페이지 제작 견적</h1>
          <div className="ml-auto flex items-center gap-1.5 text-sm">
            <MedinitySectionIcon name="cart" className="size-4 text-slate-400" />
            <span className="hidden text-slate-500 sm:inline">합계</span>
            <b className="tabular-nums text-sky-600">{formatWon(total)}</b>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-5 py-6 pb-28 lg:grid-cols-[1fr_360px] lg:pb-6">
        {/* 옵션 섹션 */}
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-bold">원하는 옵션을 담아보세요</h2>
            <p className="mt-1 text-sm text-slate-500">고르는 즉시 오른쪽 견적에 실시간으로 반영됩니다. 표시 금액은 부가세 별도 기준입니다.</p>
          </div>

          {sections.map(section => {
            return (
              <section key={section.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                    <MedinitySectionIcon name={section.icon} className="size-6" />
                  </div>
                  <div>
                    <h3 className="flex items-center gap-2 text-[15px] font-bold">
                      {section.title}
                      {section.required && <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">필수</span>}
                    </h3>
                    {section.desc && <p className="mt-0.5 text-[13px] text-slate-500">{section.desc}</p>}
                  </div>
                </div>

                {/* 단일 선택 (라디오 카드) */}
                {section.mode === 'single' && (
                  <div className="grid gap-2 sm:grid-cols-3">
                    {section.choices!.map(c => {
                      const on = singles[section.id] === c.id
                      return (
                        <button
                          key={c.id}
                          onClick={() => pickSingle(section.id, c.id)}
                          className={`flex flex-col rounded-xl border p-3 text-left transition ${on ? 'border-sky-500 bg-sky-50/60 ring-1 ring-sky-500' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">{c.name}</span>
                            <span className={`flex size-4 items-center justify-center rounded-full border ${on ? 'border-sky-500 bg-sky-500 text-white' : 'border-slate-300'}`}>
                              {on && <Check className="size-3" strokeWidth={3} />}
                            </span>
                          </div>
                          {c.desc && <span className="mt-1 text-[12px] leading-snug text-slate-500">{c.desc}</span>}
                          <span className="mt-2 text-sm font-bold text-slate-900">{includedIds.has(c.id) ? '포함' : formatWon(priceOfChoice(c, totalPages))}</span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* 다중 선택 (토글 + 하위 옵션) */}
                {section.mode === 'multi' && (
                  <div className="flex flex-col gap-2">
                    {section.choices!.map(c => {
                      const on = multi.has(c.id)
                      const childIds = (c.children ?? []).map(ch => ch.id)
                      return (
                        <div key={c.id} className={`rounded-xl border transition ${on ? 'border-sky-500' : 'border-slate-200'}`}>
                          <button
                            onClick={() => toggleMulti(c.id, childIds)}
                            className="flex w-full items-center gap-3 p-3 text-left"
                          >
                            <span className={`flex size-5 shrink-0 items-center justify-center rounded-md border ${on ? 'border-sky-500 bg-sky-500 text-white' : 'border-slate-300'}`}>
                              {on && <Check className="size-3.5" strokeWidth={3} />}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="text-sm font-semibold">{c.name}</span>
                              {c.desc && <span className="mt-0.5 block text-[12px] leading-snug text-slate-500">{c.desc}</span>}
                            </span>
                            <span className="shrink-0 text-sm font-bold">{c.price === 0 ? '기본 0원' : `+${formatWon(c.price)}`}</span>
                          </button>

                          {on && c.children && c.children.length > 0 && (
                            <div className="border-t border-slate-100 bg-slate-50/60 p-2 pl-3">
                              <div className="mb-1 pl-1 text-[11px] font-semibold text-slate-400">알림 · 자동화 채널 추가</div>
                              <div className="grid gap-1.5 sm:grid-cols-2">
                                {c.children.map(ch => {
                                  const cOn = multi.has(ch.id)
                                  return (
                                    <button
                                      key={ch.id}
                                      onClick={() => toggleChild(c.id, ch.id)}
                                      className={`flex items-center gap-2 rounded-lg border bg-white px-2.5 py-2 text-left transition ${cOn ? 'border-sky-400' : 'border-slate-200 hover:border-slate-300'}`}
                                    >
                                      <span className={`flex size-4 shrink-0 items-center justify-center rounded border ${cOn ? 'border-sky-500 bg-sky-500 text-white' : 'border-slate-300'}`}>
                                        {cOn && <Check className="size-2.5" strokeWidth={3} />}
                                      </span>
                                      <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium">{ch.name}</span>
                                      <span className="shrink-0 text-[12px] font-semibold text-slate-500">+{formatWon(ch.price)}</span>
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* 수량 스텝퍼 */}
                {section.mode === 'stepper' && section.stepper && (() => {
                  const st = section.stepper
                  const q = steppers[st.id] ?? 0
                  return (
                    <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                      <div>
                        <div className="text-sm font-semibold">{st.name}</div>
                        <div className="mt-0.5 text-[12px] text-slate-500">
                          {st.freeUnits ? `${st.freeUnits}${st.unit}까지 무료 · 이후 ` : ''}{formatWon(st.unitPrice)} / {st.unit}
                          {q > 0 && <b className="text-slate-700"> · 소계 {formatWon(stepperPrice(st, q))}</b>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setQty(st.id, st.min, st.max, -1)} disabled={q <= st.min} className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:opacity-30">
                          <Minus className="size-4" />
                        </button>
                        <span className="w-8 text-center text-base font-bold tabular-nums">{q}</span>
                        <button onClick={() => setQty(st.id, st.min, st.max, 1)} disabled={q >= st.max} className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:opacity-30">
                          <Plus className="size-4" />
                        </button>
                      </div>
                    </div>
                  )
                })()}
              </section>
            )
          })}
        </div>

        {/* 견적 요약 (장바구니) */}
        <aside className="lg:sticky lg:top-[68px] lg:h-fit">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <MedinitySectionIcon name="cart" className="size-4 text-sky-600" />
              <h2 className="text-[15px] font-bold">견적 요약</h2>
              <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">{lines.length}개</span>
            </div>

            <ul className="mt-3 flex max-h-[38vh] flex-col gap-1 overflow-y-auto lg:max-h-[calc(100vh-380px)]">
              {lines.map(l => (
                <li key={l.key} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] hover:bg-slate-50">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-slate-800">{l.label}</span>
                    {l.sub && <span className="block truncate text-[11px] text-slate-400">{l.sub}</span>}
                  </span>
                  <span className="shrink-0 tabular-nums text-slate-700">{l.price === 0 ? '포함' : formatWon(l.price)}</span>
                  {l.removable && l.onRemove && (
                    <button onClick={l.onRemove} aria-label="제거" className="shrink-0 text-slate-300 transition hover:text-red-500">
                      <X className="size-3.5" />
                    </button>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-3 space-y-1 border-t border-slate-200 pt-3 text-[13px]">
              <div className="flex justify-between text-slate-500"><span>공급가</span><span className="tabular-nums">{formatWon(subtotal)}</span></div>
              <div className="flex justify-between text-slate-500"><span>부가세 (10%)</span><span className="tabular-nums">{formatWon(vat)}</span></div>
              <div className="flex items-center justify-between pt-1 text-base font-bold"><span>합계</span><span className="tabular-nums text-sky-600">{formatWon(total)}</span></div>
            </div>

            {/* 제출 폼 */}
            <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
              <div className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-700">
                <Building2 className="size-3.5 text-slate-400" /> 견적 요청 정보
              </div>
              <input value={contact.clinicName} onChange={e => setContact(v => ({ ...v, clinicName: e.target.value }))} placeholder="병원명 (선택)" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-sky-500" />
              <div className="grid grid-cols-2 gap-2">
                <input value={contact.contactName} onChange={e => setContact(v => ({ ...v, contactName: e.target.value }))} placeholder="담당자 *" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-sky-500" />
                <input value={contact.phone} onChange={e => setContact(v => ({ ...v, phone: e.target.value }))} placeholder="연락처 *" inputMode="tel" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-sky-500" />
              </div>
              <input value={contact.email} onChange={e => setContact(v => ({ ...v, email: e.target.value }))} placeholder="이메일 (선택)" inputMode="email" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-sky-500" />
              <textarea value={contact.memo} onChange={e => setContact(v => ({ ...v, memo: e.target.value }))} placeholder="요청사항 (선택)" rows={2} className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-sky-500" />
              <button
                onClick={submit}
                disabled={sending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
              >
                {sending && <Loader2 className="size-4 animate-spin" />}
                {sending ? '전송 중…' : `견적 요청 보내기 · ${formatWon(total)}`}
              </button>
              <p className="text-center text-[11px] text-slate-400">보내주시면 담당자가 확인 후 연락드립니다.</p>
            </div>
          </div>
        </aside>
      </div>

      {/* 모바일 하단 합계 바 */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-5 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="min-w-0">
            <div className="text-[11px] text-slate-400">합계 (부가세 포함)</div>
            <div className="truncate text-lg font-bold tabular-nums text-sky-600">{formatWon(total)}</div>
          </div>
          <button
            onClick={submit}
            disabled={sending}
            className="ml-auto flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
          >
            {sending && <Loader2 className="size-4 animate-spin" />}
            견적 요청
          </button>
        </div>
      </div>
    </main>
  )
}
