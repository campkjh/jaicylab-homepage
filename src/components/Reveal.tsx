'use client'

import { motion, type Variants, type HTMLMotionProps } from 'framer-motion'

// Toss-style easing: strong exponential settle — starts fast, lands softly
const EASE = [0.16, 1, 0.3, 1] as const

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.97, filter: 'blur(6px)' },
  visible: {
    opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE },
  },
}

type RevealProps = {
  children: React.ReactNode
  delay?: number
  className?: string
  once?: boolean
  amount?: number
} & Omit<HTMLMotionProps<'div'>, 'children' | 'variants' | 'initial' | 'animate' | 'whileInView' | 'viewport' | 'transition'>

export function Reveal({ children, delay = 0, className = '', once = true, amount = 0.2, ...rest }: RevealProps) {
  return (
    <motion.div
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{ duration: 0.8, ease: EASE, delay: delay / 1000 }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

type StaggerProps = {
  children: React.ReactNode
  className?: string
  stagger?: number
  delay?: number
  once?: boolean
  amount?: number
}

export function Stagger({ children, className = '', stagger = 0.08, delay = 0, once = true, amount = 0.2 }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay / 1000 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.96, filter: 'blur(6px)' },
  visible: {
    opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
    transition: { duration: 0.7, ease: EASE },
  },
}

export function StaggerItem({ children, className = '', ...rest }: { children: React.ReactNode; className?: string } & Omit<HTMLMotionProps<'div'>, 'children' | 'variants'>) {
  return (
    <motion.div variants={itemVariants} className={className} {...rest}>
      {children}
    </motion.div>
  )
}

// Press-and-spring button wrapper — Toss-signature tactile feel
export function PressableMotion({ children, className = '', ...rest }: { children: React.ReactNode; className?: string } & Omit<HTMLMotionProps<'div'>, 'children'>) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.6 }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
