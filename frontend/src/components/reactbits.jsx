import { motion } from 'motion/react'

export function Aurora({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
    </div>
  )
}

export function SpotlightCard({ children, className = '', glow = 'teal' }) {
  return (
    <motion.div className={`spotlight-card group relative overflow-hidden ${glow} ${className}`}>
      {children}
    </motion.div>
  )
}

export function ShinyText({ children, className = '' }) {
  return <span className={`shiny-text ${className}`}>{children}</span>
}

export function NumberTicker({ value, suffix = '' }) {
  return (
    <motion.span initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} key={value}>
      {value}
      {suffix}
    </motion.span>
  )
}

export function BlurFade({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(8px)', y: 8 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      transition={{ duration: 0.45, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
