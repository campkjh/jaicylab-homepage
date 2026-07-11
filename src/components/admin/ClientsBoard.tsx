'use client'

import { useRef, useState } from 'react'
import Icon from './Icon'
import SecretValue from './SecretValue'
import { Button, Input } from './ui'
import { ACCOUNT_KINDS, CATEGORY_LABEL, type Client, type ClientAccount } from '@/lib/types'
import { addAccount, createClient, deleteAccount, deleteClient, renameClient } from '@/app/admin/actions'

export type ClientWithAccounts = Client & { accounts: ClientAccount[] }

/** 입력을 멈추면 자동 저장. (프로젝트 보드에서도 쓴다) */
export function SaveHint({ state }: { state: 'idle' | 'saving' | 'saved' }) {
  if (state === 'idle') return <span className="text-xs text-ink-muted">수정하면 자동 저장됩니다</span>
  if (state === 'saving') return <span className="text-xs text-ink-muted">저장 중…</span>
  return <span className="text-xs text-brand">저장됨</span>
}

/** 계정 한 줄: [종류] 아이디 · 비밀번호 · 삭제 */
function AccountRow({ account }: { account: ClientAccount }) {
  return (
    <li className="group/acc flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2">
      <span className="w-[92px] shrink-0 rounded-md bg-canvas px-1.5 py-0.5 text-center text-[11px] font-medium text-ink-soft">
        {CATEGORY_LABEL[account.category] ?? account.label}
      </span>
      <span className="min-w-0 flex-1 truncate font-mono text-sm text-ink select-all">{account.username || '—'}</span>
      <SecretValue kind="account_password" id={account.id} hasValue={Boolean(account.password_enc)} />
      <button
        onClick={() => {
          const fd = new FormData()
          fd.set('id', String(account.id))
          fd.set('client_id', String(account.client_id))
          void deleteAccount(fd)
        }}
        aria-label="계정 삭제"
        className="shrink-0 text-ink-muted opacity-0 transition group-hover/acc:opacity-100 hover:text-red-600"
      >
        <Icon name="bin" className="size-3.5" />
      </button>
    </li>
  )
}

/** + 를 누르면 그 자리에 펼쳐지는 계정 추가 줄 */
function AddAccountRow({ clientId, onDone }: { clientId: number; onDone: () => void }) {
  return (
    <form
      action={async fd => {
        await addAccount(fd)
        onDone()
      }}
      className="animate-fade-up flex flex-wrap items-center gap-2 border-t border-dashed border-line bg-canvas/40 px-3 py-2.5"
    >
      <input type="hidden" name="client_id" value={clientId} />
      <select
        name="category"
        defaultValue="google"
        className="h-8 w-[100px] shrink-0 rounded-lg border border-line bg-surface px-1.5 text-xs text-ink outline-none transition focus:border-brand"
      >
        {ACCOUNT_KINDS.map(k => (
          <option key={k} value={k}>{CATEGORY_LABEL[k]}</option>
        ))}
      </select>
      <Input name="username" autoFocus placeholder="아이디 / 이메일" autoComplete="off" className="!h-8 min-w-[140px] flex-1 !text-xs" />
      <Input name="password" type="password" placeholder="비밀번호" autoComplete="new-password" className="!h-8 min-w-[100px] flex-1 !text-xs" />
      <Button type="submit" className="!h-8 shrink-0 !px-2.5 !text-xs">추가</Button>
    </form>
  )
}

function ClientRow({ client }: { client: ClientWithAccounts }) {
  const [addingAccount, setAddingAccount] = useState(false)
  const nameTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [saved, setSaved] = useState(false)

  const onNameInput = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setSaved(false)
    if (nameTimer.current) clearTimeout(nameTimer.current)
    nameTimer.current = setTimeout(async () => {
      const fd = new FormData()
      fd.set('id', String(client.id))
      fd.set('name', value)
      await renameClient(fd)
      setSaved(true)
    }, 800)
  }

  return (
    <li className="group overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-canvas text-sm font-semibold text-ink-soft">
          {client.name.slice(0, 1)}
        </span>
        <input
          defaultValue={client.name}
          onInput={onNameInput}
          className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-1 text-sm font-semibold text-ink outline-none transition hover:border-line focus:border-brand"
        />
        {saved && <span className="shrink-0 text-[11px] text-brand">저장됨</span>}
        <button
          onClick={() => setAddingAccount(v => !v)}
          aria-label="계정 추가"
          className={`flex size-7 shrink-0 items-center justify-center rounded-md transition hover:bg-hover ${addingAccount ? 'bg-hover text-ink' : 'text-ink-muted hover:text-ink'}`}
        >
          <Icon name={addingAccount ? 'x' : 'plus'} className="size-4" />
        </button>
        <button
          onClick={() => {
            const fd = new FormData()
            fd.set('id', String(client.id))
            void deleteClient(fd)
          }}
          aria-label="클라이언트 삭제"
          className="shrink-0 text-ink-muted opacity-0 transition group-hover:opacity-100 hover:text-red-600"
        >
          <Icon name="bin" className="size-4" />
        </button>
      </div>

      {client.accounts.length > 0 && (
        <ul className="divide-y divide-line border-t border-line">
          {client.accounts.map(a => (
            <AccountRow key={a.id} account={a} />
          ))}
        </ul>
      )}

      {addingAccount && <AddAccountRow clientId={client.id} onDone={() => setAddingAccount(false)} />}

      {client.accounts.length === 0 && !addingAccount && (
        <p className="border-t border-dashed border-line px-3 py-2.5 text-xs text-ink-muted">
          + 를 누르면 구글·애플·네이버 계정을 바로 등록할 수 있습니다.
        </p>
      )}
    </li>
  )
}

export default function ClientsBoard({ clients }: { clients: ClientWithAccounts[] }) {
  const [creating, setCreating] = useState(false)

  return (
    <>
      <header className="mb-6 flex flex-col items-start justify-between gap-3 sm:mb-7 sm:flex-row sm:items-start sm:gap-4">
        <div>
          <h1 className="text-[22px] leading-tight font-semibold tracking-tight text-ink sm:text-[26px]">계정</h1>
          <p className="mt-1 text-sm text-ink-muted">클라이언트 이름 아래에 구글·애플·네이버 계정을 + 로 쌓아두세요.</p>
        </div>
        <button
          onClick={() => setCreating(v => !v)}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-ink px-3 text-sm font-medium text-white transition hover:bg-black"
        >
          <Icon name={creating ? 'x' : 'plus'} className="size-4" />
          새 클라이언트
        </button>
      </header>

      {creating && (
        <form
          action={async fd => {
            await createClient(fd)
            setCreating(false)
          }}
          className="animate-fade-up mb-4 flex items-center gap-2 rounded-xl border border-dashed border-line bg-canvas/50 p-3"
        >
          <Input name="name" autoFocus required placeholder="클라이언트 이름" className="flex-1" />
          <Button type="submit">추가</Button>
        </form>
      )}

      {clients.length === 0 && !creating ? (
        <div className="rounded-xl border border-dashed border-line py-12 text-center text-sm text-ink-muted">
          등록된 클라이언트가 없습니다.
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {clients.map(c => (
            <ClientRow key={c.id} client={c} />
          ))}
        </ul>
      )}
    </>
  )
}
