'use client'

import { useState } from 'react'
import { Eye, EyeOff, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import { revealSecret } from '@/app/admin/actions'

type Kind = 'account_password' | 'card_number' | 'card_expiry' | 'card_cvc'

/** 값은 서버에 암호화되어 있고, 눈 아이콘을 눌러야 그 순간 복호화해서 받아온다. */
export default function SecretValue({
  kind,
  id,
  placeholder = '••••••••',
  empty = '—',
  hasValue,
}: {
  kind: Kind
  id: number
  placeholder?: string
  empty?: string
  hasValue: boolean
}) {
  const [value, setValue] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!hasValue) return <span className="text-sm text-ink-muted">{empty}</span>

  async function reveal() {
    if (value !== null) {
      setValue(null)
      return
    }
    setLoading(true)
    try {
      const v = await revealSecret(kind, id)
      setValue(v || '')
    } catch {
      toast.error('값을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  async function copy() {
    const v = value ?? (await revealSecret(kind, id))
    await navigator.clipboard.writeText(v)
    setCopied(true)
    toast.success('복사했습니다.')
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="font-mono text-sm text-ink select-all">
        {loading ? '…' : (value ?? placeholder)}
      </span>
      <button onClick={reveal} aria-label={value !== null ? '숨기기' : '보기'} className="text-ink-muted transition hover:text-ink">
        {value !== null ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
      </button>
      <button onClick={copy} aria-label="복사" className="text-ink-muted transition hover:text-ink">
        {copied ? <Check className="size-3.5 text-brand" /> : <Copy className="size-3.5" />}
      </button>
    </span>
  )
}
