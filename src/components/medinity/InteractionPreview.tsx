'use client'

import { motion, type Variants } from 'framer-motion'

/**
 * 인터랙션 등급별 미리보기. 은은한 회색 둥근 네모가 등급에 따라 다르게 움직인다.
 * 하 = 은은한 페이드·호버, 중 = 스크롤 등장(스태거 리빌), 상 = 그라데이션 + 시머(고급 모션).
 */
export function InteractionPreview({ level }: { level: 'low' | 'mid' | 'high' }) {
  const boxes = [0, 1, 2]

  // 고급(상): 그라데이션 박스 + 부드러운 호흡 + 빛이 훑고 지나가는 시머
  if (level === 'high') {
    return (
      <div className="relative flex h-6 items-center gap-1.5 overflow-hidden" aria-hidden>
        {boxes.map(i => (
          <motion.span
            key={i}
            className="size-4 rounded-[6px] bg-gradient-to-br from-slate-400 to-slate-600 shadow-[0_2px_6px_-1px_rgba(15,23,42,0.25)]"
            animate={{ scale: [1, 1.12, 1], y: [0, -4, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: [0.4, 0, 0.2, 1], delay: i * 0.22 }}
            style={{ willChange: 'transform' }}
          />
        ))}
        <motion.span
          className="pointer-events-none absolute inset-y-0 w-5 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent"
          animate={{ x: [-24, 82] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.7 }}
        />
      </div>
    )
  }

  const variants: Record<'low' | 'mid', Variants> = {
    low: {
      run: (i: number) => ({
        opacity: [0.3, 0.9, 0.3],
        y: [0, -3, 0],
        transition: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.18 },
      }),
    },
    mid: {
      run: (i: number) => ({
        opacity: [0, 0.9, 0.9, 0],
        y: [10, 0, 0, 10],
        transition: { duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: i * 0.2, times: [0, 0.25, 0.75, 1] },
      }),
    },
  }

  return (
    <div className="flex h-6 items-center gap-1.5" aria-hidden>
      {boxes.map(i => (
        <motion.span
          key={i}
          custom={i}
          variants={variants[level]}
          animate="run"
          className="size-4 rounded-[6px] bg-slate-300"
          style={{ willChange: 'transform, opacity' }}
        />
      ))}
    </div>
  )
}
