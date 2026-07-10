'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'

/** "새로 만들기" 버튼을 누르면 펼쳐지는 인라인 폼. 모달보다 노션에 가깝다. */
export default function InlineCreate({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-ink px-3 text-sm font-medium text-white transition hover:bg-black"
      >
        <Plus className="size-4" />
        {label}
      </button>
    )
  }

  return (
    <div className="animate-fade-up rounded-xl border border-line bg-surface p-5 shadow-[0_1px_3px_rgba(15,15,15,0.06)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">{label}</h3>
        <button onClick={() => setOpen(false)} aria-label="닫기" className="text-ink-muted transition hover:text-ink">
          <X className="size-4" />
        </button>
      </div>
      {children}
    </div>
  )
}
