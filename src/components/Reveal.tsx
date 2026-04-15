'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'

type RevealProps = {
  children: React.ReactNode
  delay?: number
  className?: string
  y?: number
} & Omit<HTMLMotionProps<'div'>, 'children'>

export function Reveal({ children, delay = 0, className = '', y = 24, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: delay / 1000 }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
