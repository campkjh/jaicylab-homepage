import type { ProjectStatus } from '@/lib/types'
import { STATUS_LABEL } from '@/lib/types'

const STATUS_STYLE: Record<ProjectStatus, string> = {
  planning: 'bg-slate-500/20 text-slate-300',
  in_progress: 'bg-emerald-500/15 text-emerald-200',
  review: 'bg-amber-500/15 text-amber-200',
  done: 'bg-blue-500/15 text-blue-200',
  paused: 'bg-zinc-500/20 text-zinc-400',
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className={`inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium ${STATUS_STYLE[status] ?? STATUS_STYLE.planning}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  )
}

export function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  const v = Math.min(100, Math.max(0, value))
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-line ${className}`}>
      <div className="h-full rounded-full bg-brand transition-[width] duration-500" style={{ width: `${v}%` }} />
    </div>
  )
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <header className="mb-6 flex flex-col items-start justify-between gap-3 sm:mb-7 sm:flex-row sm:items-start sm:gap-4">
      <div>
        <h1 className="text-[22px] leading-tight font-semibold tracking-tight text-ink sm:text-[26px]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {action}
    </header>
  )
}

/** 일반 페이지의 본문 폭. 스케줄처럼 풀사이즈가 필요한 페이지는 이걸 쓰지 않는다. */
export function PageContainer({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-[1200px]">{children}</div>
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(15,15,15,0.04)] ${className}`}>
      {children}
    </div>
  )
}

export function SectionTitle({ children, count }: { children: React.ReactNode; count?: number }) {
  return (
    <h2 className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-ink-soft">
      {children}
      {typeof count === 'number' && <span className="text-ink-muted">{count}</span>}
    </h2>
  )
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-line py-12 text-center text-sm text-ink-muted">
      {children}
    </div>
  )
}

const inputBase =
  'w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-brand'

export function Field({
  label,
  children,
  className = '',
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs font-medium text-ink-soft">{label}</span>
      {children}
    </label>
  )
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputBase} ${props.className ?? ''}`} />
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputBase} resize-y leading-relaxed ${props.className ?? ''}`} />
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputBase} ${props.className ?? ''}`} />
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' }) {
  const styles = {
    primary: 'bg-ink text-canvas hover:brightness-90',
    ghost: 'border border-line bg-surface text-ink-soft hover:bg-hover',
    danger: 'border border-red-500/30 bg-surface text-red-300 hover:bg-red-500/10',
  }[variant]
  return (
    <button
      {...props}
      className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium transition disabled:opacity-50 ${styles} ${className}`}
    />
  )
}
