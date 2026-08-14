'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Trash2 } from 'lucide-react'
import { formatWon } from '@/data/medinity'
import { MedinityNavIcon } from './MedinityNavIcon'
import { MedinitySectionIcon } from './MedinitySectionIcon'
import { MedinityColorIcon } from './MedinityColorIcon'
import { GoogleIcon } from './GoogleIcon'

// 상태 = 단계. 탭도 이 3단계로 나뉜다. (견적 문의 → 개발 의뢰 → 개발 완료)
export type ReqStatus = 'inquiry' | 'requested' | 'done'

/** 개발 의뢰 시 필요한 정보 (병원 계정·카드·사업자) */
export type DevInfo = {
  googleId?: string
  googlePw?: string
  naverId?: string
  naverPw?: string
  cardNumber?: string
  cardExpiry?: string
  cardCvc?: string
  bizNumber?: string
  address?: string
  ceo?: string
}

export type RequestEntry = {
  id: string
  createdAt: string
  total: number
  itemsCount: number
  status: ReqStatus
  memo?: string
  items?: { label: string; price: number }[]
  dev?: DevInfo
}

export const STAGES: { id: ReqStatus; label: string; chip: string }[] = [
  { id: 'inquiry', label: '견적 문의', chip: 'bg-slate-100 text-slate-500' },
  { id: 'requested', label: '개발 의뢰', chip: 'bg-[#EAF2FF] text-[#3180F7]' },
  { id: 'done', label: '개발 완료', chip: 'bg-emerald-50 text-emerald-600' },
]
const CHIP = Object.fromEntries(STAGES.map(s => [s.id, s.chip])) as Record<ReqStatus, string>
const LABEL = Object.fromEntries(STAGES.map(s => [s.id, s.label])) as Record<ReqStatus, string>

export function MedinityHome({
  requests,
  onStatus,
  onDelete,
  onPrint,
  onUpdate,
}: {
  requests: RequestEntry[]
  onStatus: (id: string, s: ReqStatus) => void
  onDelete: (id: string) => void
  onPrint: (entry: RequestEntry) => void
  onUpdate: (id: string, patch: Partial<RequestEntry>) => void
}) {
  const [stage, setStage] = useState<ReqStatus>('inquiry')
  const [openId, setOpenId] = useState<string | null>(null)

  const list = requests.filter(r => r.status === stage)
  const open = openId ? requests.find(r => r.id === openId) : null

  return (
    <div className="mx-auto max-w-2xl px-5 pb-24 pt-2 lg:pr-20">
      <h2 className="text-lg font-bold text-slate-900">요청 관리</h2>
      <p className="mt-1 text-sm text-slate-500">견적서 탭에서 제출하면 여기에 쌓입니다. 항목을 눌러 상태를 바꿔보세요.</p>

      {/* 단계 탭 (견적 문의 → 개발 의뢰 → 개발 완료) */}
      <div className="mt-4 flex gap-1 rounded-2xl bg-slate-100 p-1">
        {STAGES.map(s => {
          const on = stage === s.id
          const count = requests.filter(r => r.status === s.id).length
          return (
            <button
              key={s.id}
              onClick={() => setStage(s.id)}
              className={`relative flex-1 rounded-[13px] px-3 py-2 text-[13px] font-semibold transition ${on ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {on && <motion.span layoutId="homeStagePill" className="absolute inset-0 rounded-[13px] bg-white shadow-sm" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              <span className="relative">
                {s.label}
                {count > 0 && <span className="ml-1 text-[#3180F7]">{count}</span>}
              </span>
            </button>
          )
        })}
      </div>

      {/* 누적 리스트 */}
      {list.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-[20px] border border-dashed border-slate-200 py-14 text-center">
          <MedinityNavIcon name="inbox" className="size-11 text-slate-300" />
          <span className="text-sm text-slate-400">리스트가 없습니다</span>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-2.5">
          {list.map(r => (
            <motion.button
              key={r.id}
              layoutId={`req-${r.id}`}
              onClick={() => setOpenId(r.id)}
              className="flex items-center gap-3 rounded-[18px] bg-white p-4 text-left shadow-[0_8px_30px_-6px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <motion.span layoutId={`req-title-${r.id}`} className="text-[15px] font-bold text-slate-900">{formatWon(r.total)}</motion.span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${CHIP[r.status]}`}>{LABEL[r.status]}</span>
                </div>
                <div className="mt-0.5 text-[12px] text-slate-400">{r.createdAt} · 항목 {r.itemsCount}개</div>
              </div>
              <span className="shrink-0 text-slate-300">›</span>
            </motion.button>
          ))}
        </div>
      )}

      {/* 그룹 포커스: 카드가 가운데로 확대되며 상태·상세를 편집 */}
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-slate-900/40" onClick={() => setOpenId(null)} />
            <motion.div layoutId={`req-${open.id}`} className="relative max-h-[86vh] w-full max-w-md overflow-y-auto rounded-[24px] bg-white p-5 shadow-[0_24px_70px_-12px_rgba(15,23,42,0.4)]">
              <div className="flex items-start justify-between gap-2">
                <motion.span layoutId={`req-title-${open.id}`} className="text-lg font-bold text-slate-900">{formatWon(open.total)}</motion.span>
                <button onClick={() => setOpenId(null)} aria-label="닫기" className="shrink-0 text-slate-400 transition hover:text-slate-700">
                  <X className="size-5" />
                </button>
              </div>
              <div className="mt-0.5 text-[12px] text-slate-400">{open.createdAt} · 항목 {open.itemsCount}개</div>

              <div className="mt-4">
                <div className="mb-1.5 text-[12px] font-semibold text-slate-600">상태</div>
                <div className="flex gap-1 rounded-2xl bg-slate-100 p-1">
                  {STAGES.map(s => {
                    const on = open.status === s.id
                    return (
                      <button
                        key={s.id}
                        onClick={() => onStatus(open.id, s.id)}
                        className={`relative flex-1 rounded-[13px] px-3 py-2 text-[13px] font-semibold transition ${on ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {on && <motion.span layoutId="focusStatusPill" className="absolute inset-0 rounded-[13px] bg-white shadow-sm" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                        <span className="relative">{s.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {open.items && open.items.length > 0 && (
                <div className="mt-4">
                  <div className="mb-1.5 text-[12px] font-semibold text-slate-600">선택 항목</div>
                  <ul className="max-h-40 overflow-y-auto rounded-lg bg-slate-50 p-3 text-[12.5px]">
                    {open.items.map((it, i) => (
                      <li key={i} className="flex justify-between gap-2 py-0.5">
                        <span className="min-w-0 truncate text-slate-600">{it.label}</span>
                        <span className="shrink-0 tabular-nums text-slate-400">{it.price === 0 ? '포함' : formatWon(it.price)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {open.memo && <div className="mt-3 rounded-lg bg-slate-50 p-3 text-[12.5px] leading-relaxed whitespace-pre-wrap text-slate-600">{open.memo}</div>}

              {/* 개발 의뢰 정보 — 견적 문의 상태에선 숨기고, 개발 의뢰부터 노출 */}
              {open.status !== 'inquiry' && (() => {
                const dev = open.dev ?? {}
                const setDev = (patch: Partial<DevInfo>) => onUpdate(open.id, { dev: { ...dev, ...patch } })
                const hasNaver = open.items?.some(it => it.label.includes('네이버'))
                const fieldCls = 'min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400'
                const rowCls = 'flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 transition focus-within:border-[#3180F7]'
                const groupCls = 'flex items-center gap-1.5 pt-1 text-[11px] font-medium text-slate-400'
                return (
                  <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
                    <div className="text-[12px] font-semibold text-slate-600">개발 의뢰 정보</div>

                    <div className={groupCls}><GoogleIcon className="size-3.5" /> 병원 구글 계정</div>
                    <div className={rowCls}><input value={dev.googleId ?? ''} onChange={e => setDev({ googleId: e.target.value })} placeholder="구글 아이디" autoComplete="off" className={fieldCls} /></div>
                    <div className={rowCls}><input value={dev.googlePw ?? ''} onChange={e => setDev({ googlePw: e.target.value })} placeholder="구글 비밀번호" autoComplete="off" className={fieldCls} /></div>

                    {hasNaver && (
                      <>
                        <div className={groupCls}><MedinityColorIcon name="naver" className="size-3.5" /> 네이버 계정 (예약 연동용)</div>
                        <div className={rowCls}><input value={dev.naverId ?? ''} onChange={e => setDev({ naverId: e.target.value })} placeholder="네이버 아이디" autoComplete="off" className={fieldCls} /></div>
                        <div className={rowCls}><input value={dev.naverPw ?? ''} onChange={e => setDev({ naverPw: e.target.value })} placeholder="네이버 비밀번호" autoComplete="off" className={fieldCls} /></div>
                      </>
                    )}

                    <div className={groupCls}>
                      <MedinityNavIcon name="card" className="size-3.5 text-slate-400" /> 카드 정보
                    </div>
                    <div className={rowCls}>
                      <input value={dev.cardNumber ?? ''} onChange={e => setDev({ cardNumber: e.target.value })} placeholder="카드 번호" inputMode="numeric" autoComplete="off" className={fieldCls} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className={rowCls}><input value={dev.cardExpiry ?? ''} onChange={e => setDev({ cardExpiry: e.target.value })} placeholder="MM/YY" autoComplete="off" className={fieldCls} /></div>
                      <div className={rowCls}><input value={dev.cardCvc ?? ''} onChange={e => setDev({ cardCvc: e.target.value })} placeholder="CVC" inputMode="numeric" autoComplete="off" className={fieldCls} /></div>
                    </div>

                    <div className={groupCls}>
                      <MedinityNavIcon name="doc" className="size-3.5 text-slate-400" /> 사업자 정보
                    </div>
                    <div className={rowCls}>
                      <MedinityNavIcon name="doc" className="size-4 shrink-0 text-slate-400" />
                      <input value={dev.bizNumber ?? ''} onChange={e => setDev({ bizNumber: e.target.value })} placeholder="사업자 등록번호" inputMode="numeric" autoComplete="off" className={fieldCls} />
                    </div>
                    <div className={rowCls}>
                      <MedinityNavIcon name="pin" className="size-4 shrink-0 text-slate-400" />
                      <input value={dev.address ?? ''} onChange={e => setDev({ address: e.target.value })} placeholder="주소" autoComplete="off" className={fieldCls} />
                    </div>
                    <div className={rowCls}>
                      <MedinityNavIcon name="user" className="size-4 shrink-0 text-slate-400" />
                      <input value={dev.ceo ?? ''} onChange={e => setDev({ ceo: e.target.value })} placeholder="대표자 이름" autoComplete="off" className={fieldCls} />
                    </div>
                  </div>
                )
              })()}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => onPrint(open)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-300 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <MedinitySectionIcon name="printer" className="size-4" /> PDF 출력
                </button>
                <button
                  onClick={() => { onDelete(open.id); setOpenId(null) }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 className="size-4" /> 삭제
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
