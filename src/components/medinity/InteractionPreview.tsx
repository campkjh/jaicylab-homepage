'use client'

import { motion, type Variants } from 'framer-motion'

/**
 * 인터랙션 등급별 미리보기. 둥근 네모(브랜드 파랑)가 등급에 따라 다르게 움직인다.
 * 하 = 은은한 페이드·호버, 중 = 스크롤 등장(스태거 리빌), 상 = 풀 모션(스케일·회전).
 */
export function InteractionPreview({ level }: { level: 'low' | 'mid' | 'high' }) {
  const boxes = [0, 1, 2]

  const variants: Record<typeof level, Variants> = {
    low: {
      run: (i: number) => ({
        opacity: [0.3, 1, 0.3],
        y: [0, -3, 0],
        transition: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.18 },
      }),
    },
    mid: {
      run: (i: number) => ({
        opacity: [0, 1, 1, 0],
        y: [10, 0, 0, 10],
        transition: { duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: i * 0.2, times: [0, 0.25, 0.75, 1] },
      }),
    },
    high: {
      run: (i: number) => ({
        scale: [1, 1.3, 0.9, 1],
        rotate: [0, 14, -10, 0],
        y: [0, -5, 2, 0],
        transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.12 },
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
          className="size-4 rounded-[6px] bg-[#3180F7]"
          style={{ willChange: 'transform, opacity' }}
        />
      ))}
    </div>
  )
}
