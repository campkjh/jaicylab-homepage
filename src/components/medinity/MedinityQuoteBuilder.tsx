'use client'

import { useEffect, useMemo, useState } from 'react'
import { Plus, Minus, Check, X, Loader2, ChevronUp } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
import { submitMedinityQuote, type MedinityQuoteInput } from '@/app/medinity/actions'
import { VAT_RATE, formatWon, includedChoiceIds, totalPageCount, priceOfChoice, stepperPrice, MEDINITY_CHOICE_INDEX, type MedinitySection } from '@/data/medinity'
import { MedinityLogo } from './MedinityLogo'
import { MedinitySectionIcon } from './MedinitySectionIcon'
import { AnimatedWon } from './AnimatedWon'
import { InteractionPreview } from './InteractionPreview'
import { PrintableQuote } from './PrintableQuote'
import { GoogleIcon } from './GoogleIcon'
import { MedinityNav, type MedinityTab } from './MedinityNav'
import { MedinityNavIcon } from './MedinityNavIcon'
import { MedinityHome, type RequestEntry, type ReqStatus } from './MedinityHome'

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

  const [memo, setMemo] = useState('')
  const [referenceUrl, setReferenceUrl] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState<number | null>(null)
  const [quoteDate, setQuoteDate] = useState('')
  const [tab, setTab] = useState<MedinityTab>('quote')

  // 홈 요청관리 목록 — 견적서 제출 시 여기에 쌓인다. (기기별 localStorage)
  const [requests, setRequests] = useState<RequestEntry[]>([])
  const [reqLoaded, setReqLoaded] = useState(false)
  useEffect(() => {
    try { const raw = localStorage.getItem('medinity_requests_v1'); if (raw) setRequests(JSON.parse(raw)) } catch {}
    setReqLoaded(true)
  }, [])
  useEffect(() => {
    if (reqLoaded) try { localStorage.setItem('medinity_requests_v1', JSON.stringify(requests)) } catch {}
  }, [requests, reqLoaded])
  const setRequestStatus = (id: string, status: ReqStatus) =>
    setRequests(rs => rs.map(r => (r.id === id ? { ...r, status } : r)))
  const deleteRequest = (id: string) => setRequests(rs => rs.filter(r => r.id !== id))

  // 인쇄 대상(견적서 버튼=현재 견적 / 요청관리=해당 접수). null 이면 현재 견적을 인쇄.
  const [printData, setPrintData] = useState<{ lines: { label: string; sub?: string; price: number }[]; subtotal: number; vat: number; total: number } | null>(null)
  // 모바일 하단바에서 상세 견적 내역 펼침
  const [detailOpen, setDetailOpen] = useState(false)

  // 스크롤해서 콘텐츠가 헤더에 닿으면 헤더 배경(불투명+블러)이 나타난다.
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 견적서 인쇄(→ PDF 저장). 인쇄 직전에 견적일을 찍고 브라우저 인쇄창을 연다.
  const printQuote = () => {
    const d = new Date()
    setPrintData(null) // 현재 견적 사용
    setQuoteDate(`${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}`)
    setTimeout(() => window.print(), 60)
  }
  // 요청관리 접수 건을 PDF 로 인쇄
  const printEntry = (entry: RequestEntry) => {
    const items = entry.items ?? []
    const subtotal = items.reduce((s, it) => s + it.price, 0)
    setPrintData({ lines: items, subtotal, vat: entry.total - subtotal, total: entry.total })
    setQuoteDate(entry.createdAt)
    setTimeout(() => window.print(), 60)
  }

  const modeOf = (id: string) => sections.find(s => s.id === MEDINITY_CHOICE_INDEX[id]?.sectionId)?.mode

  const pickSingle = (sectionId: string, choiceId: string) => {
    const oldInc = MEDINITY_CHOICE_INDEX[singles[sectionId]]?.includes ?? []
    const newInc = MEDINITY_CHOICE_INDEX[choiceId]?.includes ?? []

    setSingles(prev => {
      const next = { ...prev, [sectionId]: choiceId }
      // '기본 포함' 옵션을 고르면 포함된 단일 옵션도 자동 선택 (예: 어드민 중, 중 모션)
      for (const incId of newInc) {
        if (modeOf(incId) === 'single' && MEDINITY_CHOICE_INDEX[incId]) next[MEDINITY_CHOICE_INDEX[incId].sectionId] = incId
      }
      return next
    })

    // 포함된 다중 옵션은 자동 체크 (이전 선택의 포함분은 해제하고 새 선택의 포함분을 체크)
    const oldMulti = oldInc.filter(id => modeOf(id) === 'multi')
    const newMulti = newInc.filter(id => modeOf(id) === 'multi')
    if (oldMulti.length || newMulti.length) {
      setMulti(prev => {
        const n = new Set(prev)
        oldMulti.forEach(id => n.delete(id))
        newMulti.forEach(id => n.add(id))
        return n
      })
    }
  }

  // 무료로 기본 포함되는 옵션 — 합계에서 0원 처리
  const includedIds = useMemo(() => includedChoiceIds([...Object.values(singles), ...multi]), [singles, multi])
  // 기본 패키지에 포함된 페이지 수
  const basePages = MEDINITY_CHOICE_INDEX[singles.base]?.pages ?? 0
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
            out.push({ key: c.id, label: c.name, sub: includedIds.has(c.id) ? `${s.title} · 기본 포함` : s.title, price: includedIds.has(c.id) ? 0 : priceOfChoice(c, totalPages), removable: true, onRemove: () => toggleMulti(c.id, childIds) })
            for (const ch of c.children ?? []) {
              if (multi.has(ch.id)) out.push({ key: ch.id, label: ch.name, sub: c.name, price: ch.price, removable: true, onRemove: () => toggleChild(c.id, ch.id) })
            }
          }
        }
        // 네이버 지도를 선택하지 않으면 기본 구글 지도 무료 연동
        if (s.id === 'integration' && !multi.has('int-navermap')) {
          out.push({ key: 'gmap-default', label: '구글 지도 연동', sub: '연동 · 기본 무료', price: 0, removable: false })
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
    setSending(true)
    try {
      const payload: MedinityQuoteInput = {
        memo,
        referenceUrl: referenceUrl.trim() || undefined,
        choiceIds: [...Object.values(singles), ...multi],
        steppers,
      }
      const res = await submitMedinityQuote(payload)
      if (res.ok) {
        // 홈 요청관리(견적 문의)에 누적
        const d = new Date()
        const entry: RequestEntry = {
          id: (crypto.randomUUID?.() ?? String(res.id) + '-' + d.getTime()),
          createdAt: `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}`,
          total,
          itemsCount: lines.length,
          status: 'inquiry',
          items: lines.map(l => ({ label: l.label, price: l.price })),
          memo: memo.trim() || undefined,
        }
        setRequests(rs => [entry, ...rs])
        setDone(res.id)
      } else toast.error(res.error)
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
          <div className="flex size-20 items-center justify-center rounded-[24px] bg-[#EAF2FF]">
            <MedinitySectionIcon name="party" className="size-11" />
          </div>
          <h1 className="mt-6 text-2xl font-bold">견적 요청이 접수됐어요</h1>
          <p className="mt-2 text-slate-500">
            접수번호 <b className="text-slate-700">#{done}</b> · 예상 합계 <b className="text-[#3180F7]">{formatWon(total)}</b>
            <br />담당자가 확인 후 빠르게 연락드릴게요.
          </p>
          <button
            onClick={() => { setDone(null); setMemo(''); setReferenceUrl('') }}
            className="mt-8 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-white"
          >
            새 견적 만들기
          </button>
        </div>
      </main>
    )
  }

  return (
    <>
    <MedinityNav tab={tab} onChange={setTab} />
    <main className="min-h-screen bg-slate-50 text-slate-900 print:hidden">
      {/* 헤더 — 스크롤 전엔 투명, 콘텐츠가 닿으면 불투명 + 블러 24 (보더 없음) */}
      <header className="sticky top-0 z-30">
        <div className={`pointer-events-none absolute inset-0 bg-white/70 backdrop-blur-[24px] transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`} />
        <div className="relative mx-auto flex max-w-6xl items-center px-5 py-3">
          <MedinityLogo className="h-8 w-auto text-slate-900" />
        </div>
      </header>

      {tab === 'home' && <MedinityHome requests={requests} onStatus={setRequestStatus} onDelete={deleteRequest} onPrint={printEntry} />}

      <div className={`mx-auto grid max-w-6xl grid-cols-1 gap-6 px-5 py-6 pb-28 lg:grid-cols-[1fr_360px] lg:pb-6 lg:pr-20 ${tab === 'home' ? 'hidden' : ''}`}>
        {/* 옵션 섹션 */}
        <div className="flex flex-col gap-5">
          <div className="rounded-[24px] bg-white shadow-[0_10px_40px_-4px_rgba(15,23,42,0.08)] p-5">
            <h2 className="text-lg font-bold">원하는 옵션을 담아보세요</h2>
            <p className="mt-1 text-sm text-slate-500">고르는 즉시 오른쪽 견적에 실시간으로 반영됩니다. 표시 금액은 부가세 별도 기준입니다.</p>
          </div>

          {sections.map(section => {
            return (
              <section key={section.id} className="rounded-[24px] bg-white shadow-[0_10px_40px_-4px_rgba(15,23,42,0.08)] p-5">
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
                          className={`flex flex-col rounded-xl border p-3 text-left transition ${on ? 'border-[#3180F7] bg-[#EAF2FF] ring-1 ring-[#3180F7]' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">{c.name}</span>
                            <span className={`flex size-5 items-center justify-center rounded-md border ${on ? 'border-[#3180F7] bg-[#3180F7] text-white' : 'border-slate-300'}`}>
                              {on && <Check className="size-3.5" strokeWidth={3} />}
                            </span>
                          </div>
                          {c.desc && <span className="mt-1 text-[12px] leading-snug text-slate-500">{c.desc}</span>}
                          {section.id === 'interaction' && (
                            <span className="mt-2.5 block">
                              <InteractionPreview level={c.id === 'inter-high' ? 'high' : c.id === 'inter-mid' ? 'mid' : 'low'} />
                            </span>
                          )}
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
                        <div key={c.id} className={`rounded-xl border transition ${on ? 'border-[#3180F7]' : 'border-slate-200'}`}>
                          <button
                            onClick={() => toggleMulti(c.id, childIds)}
                            className="flex w-full items-center gap-3 p-3 text-left"
                          >
                            <span className={`flex size-5 shrink-0 items-center justify-center rounded-md border ${on ? 'border-[#3180F7] bg-[#3180F7] text-white' : 'border-slate-300'}`}>
                              {on && <Check className="size-3.5" strokeWidth={3} />}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="text-sm font-semibold">{c.name}</span>
                              {c.desc && <span className="mt-0.5 block text-[12px] leading-snug text-slate-500">{c.desc}</span>}
                            </span>
                            <span className="shrink-0 text-sm font-bold">{includedIds.has(c.id) ? '포함' : c.price === 0 ? '기본 0원' : `+${formatWon(c.price)}`}</span>
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
                                      className={`flex items-center gap-2 rounded-lg border bg-white px-2.5 py-2 text-left transition ${cOn ? 'border-[#3180F7]' : 'border-slate-200 hover:border-slate-300'}`}
                                    >
                                      <span className={`flex size-4 shrink-0 items-center justify-center rounded border ${cOn ? 'border-[#3180F7] bg-[#3180F7] text-white' : 'border-slate-300'}`}>
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

                          {/* 네이버 지도 미선택 시 기본 구글 지도 무료 연동 안내 */}
                          {c.id === 'int-navermap' && !on && (
                            <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50/60 px-3 py-2 text-[12px] text-slate-500">
                              <GoogleIcon className="size-4 shrink-0" />
                              <span>선택 안 하면 <b className="text-slate-700">구글 지도</b>로 무료 연동됩니다</span>
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
                    <>
                    {section.id === 'pages' && (
                      <div className="mb-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl bg-slate-50 px-3 py-2.5 text-[12px] text-slate-500">
                        <span>기본 패키지 <b className="text-slate-800">{basePages}페이지</b></span>
                        <span className="text-slate-300">+</span>
                        <span>추가 <b className="text-slate-800">{q}페이지</b></span>
                        <span className="ml-auto rounded-md bg-white px-2 py-0.5 font-semibold text-[#3180F7]">총 {basePages + q}페이지</span>
                      </div>
                    )}
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
                    </>
                  )
                })()}
              </section>
            )
          })}
        </div>

        {/* 견적 요약 (장바구니) */}
        <aside className="lg:sticky lg:top-[68px] lg:h-fit">
          <div className="rounded-[24px] bg-white shadow-[0_10px_40px_-4px_rgba(15,23,42,0.08)] p-5">
            <div className="flex items-center gap-2">
              <MedinitySectionIcon name="summary" className="size-5" />
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
              <div className="flex justify-between text-slate-500"><span>공급가</span><AnimatedWon value={subtotal} className="tabular-nums" /></div>
              <div className="flex justify-between text-slate-500"><span>부가세 (10%)</span><AnimatedWon value={vat} className="tabular-nums" /></div>
              <div className="flex items-center justify-between pt-1 text-base font-bold"><span>합계</span><AnimatedWon value={total} className="tabular-nums text-[#3180F7]" /></div>
            </div>

            <button
              onClick={printQuote}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <MedinitySectionIcon name="printer" className="size-4" /> 견적서 PDF 출력
            </button>

            {/* 제출 폼 — 레퍼런스 PDF + 요청사항 + 보내기 */}
            <div className="mt-4 space-y-2.5 border-t border-slate-200 pt-4">
              <div className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-700">
                <MedinitySectionIcon name="request" className="size-4" /> 견적 요청 정보
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 transition focus-within:border-[#3180F7]">
                <MedinitySectionIcon name="link" className="size-4 shrink-0" />
                <input
                  value={referenceUrl}
                  onChange={e => setReferenceUrl(e.target.value)}
                  placeholder="레퍼런스 URL 첨부 (선택)"
                  inputMode="url"
                  autoComplete="off"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>

              <textarea
                value={memo}
                onChange={e => {
                  setMemo(e.target.value)
                  const el = e.currentTarget
                  el.style.height = 'auto'
                  el.style.height = `${el.scrollHeight}px`
                }}
                placeholder="요청사항을 적어주세요"
                rows={3}
                className="max-h-[280px] min-h-[76px] w-full resize-none overflow-y-auto rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-[#3180F7]"
              />

              <button
                onClick={submit}
                disabled={sending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3180F7] py-3 text-sm font-semibold text-white transition hover:bg-[#2470E6] disabled:opacity-60"
              >
                {sending && <Loader2 className="size-4 animate-spin" />}
                {sending ? '전송 중…' : '보내기'}
              </button>
              <p className="text-center text-[11px] text-slate-400">레퍼런스와 요청사항을 보내주시면 담당자가 확인합니다.</p>
            </div>
          </div>
        </aside>
      </div>

      {/* 모바일 하단 바: 네비(홈/견적서) + 합계(chevron 상세) + 견적요청 */}
      <div className="fixed inset-x-0 bottom-0 z-30 lg:hidden">
        {/* 상세 견적 내역 (chevron으로 펼침) */}
        <AnimatePresence>
          {tab === 'quote' && detailOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="mx-auto max-w-6xl border-t border-slate-200 bg-white px-5 pb-1 pt-3 shadow-[0_-14px_34px_-12px_rgba(15,23,42,0.18)]"
            >
              <div className="max-h-[46vh] overflow-y-auto">
                <ul className="flex flex-col gap-0.5 text-[13px]">
                  {lines.map(l => (
                    <li key={l.key} className="flex items-center justify-between gap-2 py-1">
                      <span className="min-w-0 truncate text-slate-700">{l.label}{l.sub && <span className="ml-1 text-[11px] text-slate-400">{l.sub}</span>}</span>
                      <span className="shrink-0 tabular-nums text-slate-500">{l.price === 0 ? '포함' : formatWon(l.price)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 space-y-0.5 border-t border-slate-200 pt-2 text-[13px]">
                  <div className="flex justify-between text-slate-500"><span>공급가</span><span className="tabular-nums">{formatWon(subtotal)}</span></div>
                  <div className="flex justify-between text-slate-500"><span>부가세 (10%)</span><span className="tabular-nums">{formatWon(vat)}</span></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="border-t border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center gap-2.5">
            {tab === 'quote' ? (
              <button onClick={() => setDetailOpen(v => !v)} className="flex min-w-0 items-center gap-1 text-left">
                <span className="min-w-0">
                  <span className="block text-[11px] text-slate-400">합계 (부가세 포함)</span>
                  <AnimatedWon value={total} className="block truncate text-[17px] font-bold tabular-nums text-[#3180F7]" />
                </span>
                <ChevronUp className={`size-4 shrink-0 text-slate-400 transition-transform ${detailOpen ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <div className="text-[15px] font-bold text-slate-900">요청 관리</div>
            )}

            <div className="ml-auto flex items-center gap-1.5">
              <div className="flex rounded-xl bg-slate-100 p-0.5">
                {([['home', '홈', 'home'], ['quote', '견적서', 'quote']] as const).map(([id, label, icon]) => {
                  const on = tab === id
                  return (
                    <button
                      key={id}
                      onClick={() => setTab(id)}
                      className={`flex items-center gap-1 rounded-[10px] px-2.5 py-2 text-[12px] font-semibold transition ${on ? 'bg-white text-[#3180F7] shadow-sm' : 'text-slate-400'}`}
                    >
                      <MedinityNavIcon name={icon} className="size-4" />
                      {label}
                    </button>
                  )
                })}
              </div>
              {tab === 'quote' && (
                <button
                  onClick={submit}
                  disabled={sending}
                  className="flex items-center gap-2 rounded-xl bg-[#3180F7] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2470E6] disabled:opacity-60"
                >
                  {sending && <Loader2 className="size-4 animate-spin" />}
                  견적 요청
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>

    {/* 인쇄(→ PDF) 전용 견적서 — 화면에선 숨김 */}
    <PrintableQuote
      lines={printData?.lines ?? lines}
      subtotal={printData?.subtotal ?? subtotal}
      vat={printData?.vat ?? vat}
      total={printData?.total ?? total}
      date={quoteDate}
      className="hidden print:block"
    />
    </>
  )
}
