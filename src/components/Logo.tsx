import Image from 'next/image'

export function Logo({ height = 26, className = '' }: { height?: number; className?: string }) {
  const width = Math.round(height * (680 / 151))
  return (
    <Image
      src="/logo.svg"
      alt="JAICYLAB"
      width={width}
      height={height}
      priority
      className={className}
      style={{ height, width: 'auto' }}
    />
  )
}
