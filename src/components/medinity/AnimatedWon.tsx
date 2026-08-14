'use client'

import { useEffect, useRef } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { formatWon } from '@/data/medinity'

/**
 * 값이 바뀔 때 숫자가 촤라락 굴러 올라가며 살짝 블러가 걸렸다 선명해지는 카운팅 애니메이션.
 * 오르면 아래에서 위로, 내리면 위에서 아래로 흐른다.
 */
export function AnimatedWon({ value, className }: { value: number; className?: string }) {
  const mv = useMotionValue(value)
  const blur = useMotionValue(0)
  const y = useMotionValue(0)
  const prev = useRef(value)

  const text = useTransform(mv, v => formatWon(v))
  const filter = useTransform(blur, b => `blur(${b}px)`)

  useEffect(() => {
    if (value === prev.current) return
    const delta = value - prev.current
    prev.current = value

    const easeOut = [0.22, 1, 0.36, 1] as const
    const c1 = animate(mv, value, { duration: 0.55, ease: easeOut })
    blur.set(7)
    const c2 = animate(blur, 0, { duration: 0.5, ease: 'easeOut' })
    y.set(delta >= 0 ? 10 : -10)
    const c3 = animate(y, 0, { duration: 0.5, ease: easeOut })

    return () => { c1.stop(); c2.stop(); c3.stop() }
  }, [value, mv, blur, y])

  return (
    <motion.span
      className={className}
      style={{ filter, y, display: 'inline-block', willChange: 'filter, transform' }}
    >
      {text}
    </motion.span>
  )
}
