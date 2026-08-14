'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

type ReqDef = { id: string; title: string; desc: string }

const REQUESTS: ReqDef[] = [
  { id: 'dev-request', title: '개발 의뢰', desc: '홈페이지 제작을 정식으로 의뢰합니다.' },
  { id: 'dev-booking', title: '개발 예약', desc: '상담·개발 일정을 예약합니다.' },
  { id: 'quote-inquiry', title: '견적 문의', desc: '견적 관련 궁금한 점을 남깁니다.' },
  { id: 'maintain', title: '유지보수 문의', desc: '출시 후 운영·유지보수를 문의합니다.' },
]

type Status = 'wait' | 'progress' | 'done'
const STATUS: Record<Status, { label: string; chip: string }> = {
  wait: { label: '대기', chip: 'bg-slate-100 text-slate-500' },
  progress: { label: '진행중', chip: 'bg-[#EAF2FF] text-[#3180F7]' },
  done: { label: '완료', chip: 'bg-emerald-50 text-emerald-600' },
}
const STATUS_ORDER: Status[] = ['wait', 'progress', 'done']

type Entry = { status: Status; clinic: string; contact: string; memo: string }
const emptyEntry = (): Entry => ({ status: 'wait', clinic: '', contact: '', memo: '' })
const KEY = 'medinity_home_v1'

export function MedinityHome() {
  const [data, setData] = useState<Record<string, Entry>>({})
  const [openId, setOpenId] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setData(JSON.parse(raw))
    } catch {}
    setLoaded(true)
  }, [])
  useEffect(() => {
    if (loaded) try { localStorage.setItem(KEY, JSON.stringify(data)) } catch {}
  }, [data, loaded])

  const entry = (id: string) => data[id] ?? emptyEntry()
  const update = (id: string, patch: Partial<Entry>) => setData(d => ({ ...d, [id]: { ...entry(id), ...patch } }))
  const open = openId ? REQUESTS.find(r => r.id === openId) : null

  return (
    <div className="mx-auto max-w-2xl px-5 pb-24 pt-2">
      <h2 className="text-lg font-bold text-slate-900">요청 관리</h2>
      <p className="mt-1 text-sm text-slate-500">항목을 눌러 정보를 등록하고 상태를 바꿔보세요.</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {REQUESTS.map(r => {
          const e = entry(r.id)
          const st = STATUS[e.status]
          return (
            <motion.button
              key={r.id}
              layoutId={`req-${r.id}`}
              onClick={() => setOpenId(r.id)}
              className="flex flex-col rounded-[20px] bg-white p-4 text-left shadow-[0_8px_30px_-6px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between gap-2">
                <motion.span layoutId={`req-title-${r.id}`} className="text-[15px] font-bold text-slate-900">{r.title}</motion.span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${st.chip}`}>{st.label}</span>
              </div>
              <span className="mt-1 text-[12.5px] text-slate-500">{r.desc}</span>
              {(e.clinic || e.contact) && (
                <span className="mt-2 truncate text-[11px] text-slate-400">{[e.clinic, e.contact].filter(Boolean).join(' · ')}</span>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* 그룹 포커스: 카드를 누르면 그 카드가 가운데로 확대되며 상태·정보를 편집 */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setOpenId(null)} />
            <motion.div
              layoutId={`req-${open.id}`}
              className="relative w-full max-w-md rounded-[24px] bg-white p-5 shadow-[0_24px_70px_-12px_rgba(15,23,42,0.4)]"
            >
              <div className="flex items-start justify-between gap-2">
                <motion.span layoutId={`req-title-${open.id}`} className="text-lg font-bold text-slate-900">{open.title}</motion.span>
                <button onClick={() => setOpenId(null)} aria-label="닫기" className="shrink-0 text-slate-400 transition hover:text-slate-700">
                  <X className="size-5" />
                </button>
              </div>
              <p className="mt-1 text-[13px] text-slate-500">{open.desc}</p>

              <div className="mt-4">
                <div className="mb-1.5 text-[12px] font-semibold text-slate-600">상태</div>
                <div className="flex gap-1.5">
                  {STATUS_ORDER.map(s => {
                    const on = entry(open.id).status === s
                    return (
                      <button
                        key={s}
                        onClick={() => update(open.id, { status: s })}
                        className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition ${on ? `${STATUS[s].chip} ring-1 ring-current` : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                      >
                        {STATUS[s].label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="text-[12px] font-semibold text-slate-600">정보 등록</div>
                <input value={entry(open.id).clinic} onChange={e => update(open.id, { clinic: e.target.value })} placeholder="병원명" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-[#3180F7]" />
                <input value={entry(open.id).contact} onChange={e => update(open.id, { contact: e.target.value })} placeholder="담당자 · 연락처" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-[#3180F7]" />
                <textarea value={entry(open.id).memo} onChange={e => update(open.id, { memo: e.target.value })} placeholder="내용" rows={3} className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-[#3180F7]" />
              </div>

              <button onClick={() => setOpenId(null)} className="mt-4 w-full rounded-xl bg-[#3180F7] py-2.5 text-sm font-semibold text-white transition hover:bg-[#2470E6]">
                저장
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
