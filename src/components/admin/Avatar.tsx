/* eslint-disable @next/next/no-img-element */

const SIZES = {
  sm: 'size-6 text-[11px]',
  md: 'size-7 text-[12px]',
  lg: 'size-16 text-xl',
} as const

export default function Avatar({
  name,
  url,
  size = 'md',
  online,
  className = '',
}: {
  name: string
  url?: string | null
  size?: keyof typeof SIZES
  /** 지정하면 우하단에 접속 표시 점을 그린다. */
  online?: boolean
  className?: string
}) {
  return (
    <span className={`relative inline-flex shrink-0 ${className}`}>
      {url ? (
        <img
          src={url}
          alt={name}
          className={`${SIZES[size]} rounded-full object-cover ring-1 ring-line`}
        />
      ) : (
        <span
          className={`${SIZES[size]} flex items-center justify-center rounded-full bg-brand-soft font-semibold text-emerald-700`}
        >
          {name.slice(0, 1)}
        </span>
      )}
      {online !== undefined && (
        <span
          title={online ? '접속 중' : '오프라인'}
          className={`absolute right-0 bottom-0 size-2 rounded-full ring-2 ring-canvas ${online ? 'bg-brand' : 'bg-zinc-300'}`}
        />
      )}
    </span>
  )
}
