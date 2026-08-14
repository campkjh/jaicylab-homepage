'use client'

import { motion } from 'framer-motion'
import { MedinityNavIcon } from './MedinityNavIcon'

const TABS = [
  { id: 'home', label: '홈', icon: 'home' },
  { id: 'quote', label: '견적서', icon: 'quote' },
] as const

export type MedinityTab = (typeof TABS)[number]['id']

/** 우측 세로 네비게이션(홈·견적서). 활성 탭 뒤로 파란 알약이 미끄러진다. (stady 태블릿 네비 스타일) */
export function MedinityNav({ tab, onChange }: { tab: MedinityTab; onChange: (t: MedinityTab) => void }) {
  return (
    <nav className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-1 rounded-[24px] border border-slate-100 bg-white/95 p-1.5 shadow-[0_12px_40px_-6px_rgba(15,23,42,0.16)] backdrop-blur lg:flex">
      {TABS.map(t => {
        const on = tab === t.id
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`relative flex w-[62px] flex-col items-center gap-1 rounded-[18px] px-2 py-3 transition ${on ? 'text-[#3180F7]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {on && (
              <motion.span
                layoutId="medNavPill"
                className="absolute inset-0 rounded-[18px] bg-[#EAF2FF]"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <MedinityNavIcon name={t.icon} className="relative size-6" />
            <span className="relative text-[11px] font-semibold">{t.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
