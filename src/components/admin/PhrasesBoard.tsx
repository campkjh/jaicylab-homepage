'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import Icon from './Icon'
import { Button, Field, Input, Textarea } from './ui'
import type { QuickPhrase } from '@/lib/types'
import { createPhrase, deletePhrase, updatePhrase } from '@/app/admin/actions'

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('복사했습니다')
  } catch {
    // 클립보드 권한이 없는 환경 폴백
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
    toast.success('복사했습니다')
  }
}

/** 수정하면 자동 저장되는 카드. 복사 버튼이 본문 전체를 클립보드로 보낸다. */
function PhraseCard({ phrase }: { phrase: QuickPhrase }) {
  const formRef = useRef<HTMLFormElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const onInput = () => {
    setSaved(false)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      if (!formRef.current) return
      await updatePhrase(new FormData(formRef.current))
      setSaved(true)
    }, 800)
  }

  const copy = () => {
    const body = (formRef.current?.elements.namedItem('body') as HTMLTextAreaElement | null)?.value ?? phrase.body
    void copyText(body)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <li className="group flex flex-col rounded-xl border border-line bg-surface p-4 transition hover:border-ink-muted/40">
      <form ref={formRef} onInput={onInput} className="flex min-h-0 flex-1 flex-col gap-2">
        <input type="hidden" name="id" value={phrase.id} />
        <div className="flex items-center gap-2">
          <input
            name="label"
            defaultValue={phrase.label ?? ''}
            placeholder="제목 없음"
            className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-1 text-sm font-semibold text-ink outline-none transition placeholder:text-ink-muted/60 hover:border-line focus:border-brand"
          />
          {saved && <span className="shrink-0 text-[11px] text-brand">저장됨</span>}
          <button
            type="button"
            aria-label="삭제"
            onClick={() => {
              const fd = new FormData()
              fd.set('id', String(phrase.id))
              void deletePhrase(fd)
            }}
            className="shrink-0 text-ink-muted opacity-0 transition group-hover:opacity-100 hover:text-red-600"
          >
            <Icon name="bin" className="size-4" />
          </button>
        </div>
        <textarea
          name="body"
          rows={5}
          defaultValue={phrase.body}
          className="w-full flex-1 resize-y rounded-lg border border-transparent bg-canvas/50 px-2.5 py-2 text-sm leading-relaxed text-ink outline-none transition hover:border-line focus:border-brand"
        />
      </form>

      <button
        onClick={copy}
        className={`mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition ${
          copied ? 'bg-brand-soft text-emerald-700' : 'bg-ink text-white hover:bg-black'
        }`}
      >
        <Icon name="copy" className="size-4" />
        {copied ? '복사됨!' : '복사'}
      </button>
    </li>
  )
}

export default function PhrasesBoard({ phrases }: { phrases: QuickPhrase[] }) {
  const [creating, setCreating] = useState(false)

  return (
    <>
      <header className="mb-6 flex flex-col items-start justify-between gap-3 sm:mb-7 sm:flex-row sm:items-start sm:gap-4">
        <div>
          <h1 className="text-[22px] leading-tight font-semibold tracking-tight text-ink sm:text-[26px]">자주쓰는말</h1>
          <p className="mt-1 text-sm text-ink-muted">안내문, 답장, 계좌번호처럼 자주 보내는 문구를 카드로 두고 바로 복사하세요.</p>
        </div>
        <button
          onClick={() => setCreating(v => !v)}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-ink px-3 text-sm font-medium text-white transition hover:bg-black"
        >
          <Icon name={creating ? 'x' : 'plus'} className="size-4" />
          새 문구
        </button>
      </header>

      {creating && (
        <form
          action={async fd => {
            await createPhrase(fd)
            setCreating(false)
          }}
          className="animate-fade-up mb-4 flex flex-col gap-3 rounded-xl border border-dashed border-line bg-canvas/50 p-4"
        >
          <Field label="제목 (선택)">
            <Input name="label" autoFocus placeholder="예: 견적 안내" />
          </Field>
          <Field label="내용 *">
            <Textarea name="body" rows={4} required placeholder="복사해서 쓸 문구를 적어주세요" />
          </Field>
          <Button type="submit" className="self-start">추가</Button>
        </form>
      )}

      {phrases.length === 0 && !creating ? (
        <div className="rounded-xl border border-dashed border-line py-12 text-center text-sm text-ink-muted">
          아직 등록된 문구가 없습니다. 오른쪽 위 <b>새 문구</b>로 첫 카드를 만들어 보세요.
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {phrases.map(p => (
            <PhraseCard key={p.id} phrase={p} />
          ))}
        </ul>
      )}
    </>
  )
}
