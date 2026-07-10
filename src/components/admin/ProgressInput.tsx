'use client'

import { useState } from 'react'

export default function ProgressInput({ defaultValue }: { defaultValue: number }) {
  const [value, setValue] = useState(defaultValue)

  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        name="progress"
        min={0}
        max={100}
        step={5}
        value={value}
        onChange={e => setValue(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-[var(--color-brand)]"
        style={{
          background: `linear-gradient(to right, var(--color-brand) ${value}%, var(--color-line) ${value}%)`,
        }}
      />
      <span className="w-10 shrink-0 text-right text-sm font-medium tabular-nums text-ink">{value}%</span>
    </div>
  )
}
