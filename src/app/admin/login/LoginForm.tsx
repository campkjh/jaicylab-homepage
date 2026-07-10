'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Lock } from 'lucide-react'
import { login } from '../actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-1 flex h-10 w-full items-center justify-center rounded-lg bg-ink text-sm font-medium text-white transition hover:bg-black disabled:opacity-50"
    >
      {pending ? '확인 중…' : '로그인'}
    </button>
  )
}

export default function LoginForm({ next }: { next: string }) {
  const [error, formAction] = useActionState(login, null)

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="next" value={next} />

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-ink-soft">비밀번호</span>
        <div className="relative">
          <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-muted" />
          <input
            name="password"
            type="password"
            autoFocus
            autoComplete="current-password"
            placeholder="••••••••"
            className="h-10 w-full rounded-lg border border-line bg-canvas pr-3 pl-9 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-brand focus:bg-surface"
          />
        </div>
      </label>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
      )}

      <SubmitButton />
    </form>
  )
}
