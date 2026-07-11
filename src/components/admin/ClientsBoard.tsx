'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Icon from './Icon'
import SecretValue from './SecretValue'
import { Button, Field, Input, Select, StatusBadge, Textarea } from './ui'
import { CATEGORY_LABEL, type Client, type ClientAccount, type ClientCard, type ProjectStatus } from '@/lib/types'
import { addAccount, addCard, createClient, deleteAccount, deleteCard, deleteClient, updateClient } from '@/app/admin/actions'

export type ClientWithRelations = Client & {
  accounts: ClientAccount[]
  cards: ClientCard[]
  projects: { id: number; name: string; status: ProjectStatus }[]
}

/** 입력을 멈추면 폼 전체를 자동 저장한다. 저장 버튼이 없다. */
function useFormAutosave(action: (fd: FormData) => Promise<void>) {
  const ref = useRef<HTMLFormElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [state, setState] = useState<'idle' | 'saving' | 'saved'>('idle')

  const onInput = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      if (!ref.current) return
      setState('saving')
      await action(new FormData(ref.current))
      setState('saved')
    }, 800)
  }

  return { ref, onInput, state }
}

export function SaveHint({ state }: { state: 'idle' | 'saving' | 'saved' }) {
  if (state === 'idle') return <span className="text-xs text-ink-muted">수정하면 자동 저장됩니다</span>
  if (state === 'saving') return <span className="text-xs text-ink-muted">저장 중…</span>
  return <span className="text-xs text-brand">저장됨</span>
}

/** 섹션 제목 옆 + 를 누르면 그 자리에서 인풋이 펼쳐진다. 팝업이 아니다. */
export function InlineAdd({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        className={`inline-flex h-7 items-center gap-1 rounded-md border border-line px-2 text-xs font-medium transition hover:bg-hover ${open ? 'bg-hover text-ink' : 'text-ink-soft'}`}
      >
        <Icon name={open ? 'x' : 'plus'} className="size-3.5" />
        {label}
      </button>
      {open && (
        <div className="animate-fade-up col-span-full mt-2 w-full rounded-xl border border-dashed border-line bg-canvas/50 p-3.5">
          {children}
        </div>
      )}
    </>
  )
}

function AccountsSection({ client }: { client: ClientWithRelations }) {
  return (
    <section>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h3 className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-soft">
          <Icon name="key" className="size-3.5" />
          개발 계정
          <span className="text-ink-muted">{client.accounts.length}</span>
        </h3>
        <span className="flex-1" />
        <InlineAdd label="계정 추가">
          <form action={addAccount} className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <input type="hidden" name="client_id" value={client.id} />
            <Field label="종류">
              <Select name="category" defaultValue="google_play">
                {Object.entries(CATEGORY_LABEL).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </Select>
            </Field>
            <Field label="이름 *">
              <Input name="label" autoFocus placeholder="예: 펫마일 구글 콘솔" />
            </Field>
            <Field label="아이디 / 이메일">
              <Input name="username" autoComplete="off" />
            </Field>
            <Field label="비밀번호">
              <Input name="password" type="password" autoComplete="new-password" />
            </Field>
            <Field label="URL" className="col-span-2">
              <Input name="url" placeholder="https://play.google.com/console" />
            </Field>
            <Field label="메모" className="col-span-2 sm:col-span-3">
              <Input name="memo" placeholder="2FA 백업코드 보관 위치, 소유 계정 등" />
            </Field>
            <Button type="submit" className="col-span-full justify-self-start">추가</Button>
          </form>
        </InlineAdd>
      </div>

      {client.accounts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line py-6 text-center text-xs text-ink-muted">
          + 를 누르면 이 자리에서 바로 등록됩니다.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {client.accounts.map(a => (
            <li key={a.id} className="group rounded-xl border border-line bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-ink">{a.label}</span>
                    <span className="rounded-md bg-canvas px-1.5 py-0.5 text-[11px] text-ink-soft">
                      {CATEGORY_LABEL[a.category] ?? a.category}
                    </span>
                    {a.url && (
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1 text-xs text-ink-muted transition hover:text-ink"
                      >
                        바로가기 <Icon name="link" className="size-3" />
                      </a>
                    )}
                  </div>

                  <dl className="mt-2.5 grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1.5 text-sm">
                    <dt className="text-xs text-ink-muted">아이디</dt>
                    <dd className="font-mono text-sm text-ink select-all">{a.username || '—'}</dd>
                    <dt className="text-xs text-ink-muted">비밀번호</dt>
                    <dd>
                      <SecretValue kind="account_password" id={a.id} hasValue={Boolean(a.password_enc)} />
                    </dd>
                  </dl>

                  {a.memo && <p className="mt-2.5 text-xs leading-relaxed whitespace-pre-wrap text-ink-soft">{a.memo}</p>}
                </div>

                <form action={deleteAccount}>
                  <input type="hidden" name="id" value={a.id} />
                  <input type="hidden" name="client_id" value={client.id} />
                  <button type="submit" aria-label="삭제" className="text-ink-muted opacity-0 transition group-hover:opacity-100 hover:text-red-600">
                    <Icon name="bin" className="size-4" />
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function CardsSection({ client }: { client: ClientWithRelations }) {
  return (
    <section>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h3 className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-soft">
          <Icon name="tag" className="size-3.5" />
          결제 수단
          <span className="text-ink-muted">{client.cards.length}</span>
        </h3>
        <span className="flex-1" />
        <InlineAdd label="카드 추가">
          <form action={addCard} className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <input type="hidden" name="client_id" value={client.id} />
            <Field label="이름 *">
              <Input name="label" autoFocus placeholder="예: 법인카드" />
            </Field>
            <Field label="카드사">
              <Input name="brand" placeholder="신한 / 국민 …" />
            </Field>
            <Field label="소유자">
              <Input name="holder" placeholder="카드에 적힌 이름" />
            </Field>
            <Field label="카드번호" className="col-span-2">
              <Input name="number" autoComplete="off" inputMode="numeric" placeholder="0000 0000 0000 0000" />
            </Field>
            <Field label="유효기간">
              <Input name="expiry" autoComplete="off" placeholder="MM/YY" />
            </Field>
            <Field label="CVC">
              <Input name="cvc" autoComplete="off" inputMode="numeric" placeholder="000" />
            </Field>
            <Field label="메모" className="col-span-2">
              <Input name="memo" placeholder="어디에 등록된 카드인지" />
            </Field>
            <Button type="submit" className="col-span-full justify-self-start">추가</Button>
          </form>
        </InlineAdd>
      </div>

      {client.cards.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line py-6 text-center text-xs text-ink-muted">
          + 를 누르면 이 자리에서 바로 등록됩니다.
        </p>
      ) : (
        <ul className="grid gap-2 md:grid-cols-2">
          {client.cards.map(c => (
            <li key={c.id} className="group rounded-xl border border-line bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-ink">{c.label}</span>
                    {c.brand && <span className="rounded-md bg-canvas px-1.5 py-0.5 text-[11px] text-ink-soft">{c.brand}</span>}
                  </div>
                  <div className="mt-2 font-mono text-sm text-ink-soft">•••• •••• •••• {c.last4 ?? '••••'}</div>

                  <dl className="mt-2.5 grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1.5">
                    <dt className="text-xs text-ink-muted">전체번호</dt>
                    <dd><SecretValue kind="card_number" id={c.id} hasValue={Boolean(c.number_enc)} /></dd>
                    <dt className="text-xs text-ink-muted">유효기간</dt>
                    <dd><SecretValue kind="card_expiry" id={c.id} placeholder="••/••" hasValue={Boolean(c.expiry_enc)} /></dd>
                    <dt className="text-xs text-ink-muted">CVC</dt>
                    <dd><SecretValue kind="card_cvc" id={c.id} placeholder="•••" hasValue={Boolean(c.cvc_enc)} /></dd>
                    {c.holder && (
                      <>
                        <dt className="text-xs text-ink-muted">소유자</dt>
                        <dd className="text-sm text-ink">{c.holder}</dd>
                      </>
                    )}
                  </dl>

                  {c.memo && <p className="mt-2.5 text-xs leading-relaxed whitespace-pre-wrap text-ink-soft">{c.memo}</p>}
                </div>

                <form action={deleteCard}>
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="client_id" value={client.id} />
                  <button type="submit" aria-label="삭제" className="text-ink-muted opacity-0 transition group-hover:opacity-100 hover:text-red-600">
                    <Icon name="bin" className="size-4" />
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function ClientRow({ client, open, onToggle }: { client: ClientWithRelations; open: boolean; onToggle: () => void }) {
  const info = useFormAutosave(updateClient)

  return (
    <li className="overflow-hidden rounded-xl border border-line bg-surface">
      {/* 헤더: 누르면 펴고 접는다 */}
      <button onClick={onToggle} className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-hover">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-canvas text-sm font-semibold text-ink-soft">
          {client.name.slice(0, 1)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-ink">{client.name}</span>
          <span className="block truncate text-xs text-ink-muted">
            {[client.company, client.phone].filter(Boolean).join(' · ') || '정보 없음'}
          </span>
        </span>
        <span className="hidden gap-1.5 text-[11px] text-ink-muted sm:flex">
          <span className="rounded-md bg-canvas px-1.5 py-0.5">프로젝트 {client.projects.length}</span>
          <span className="rounded-md bg-canvas px-1.5 py-0.5">계정 {client.accounts.length}</span>
          <span className="rounded-md bg-canvas px-1.5 py-0.5">카드 {client.cards.length}</span>
        </span>
        <Icon name="arrowRight" className={`size-4 shrink-0 text-ink-muted transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>

      {open && (
        <div className="animate-fade-up flex flex-col gap-7 border-t border-line bg-canvas/30 p-4 sm:p-5">
          {/* 기본 정보 — 자동 저장 */}
          <form ref={info.ref} onInput={info.onInput} className="flex flex-col gap-3">
            <input type="hidden" name="id" value={client.id} />
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-ink-soft">기본 정보</h3>
              <SaveHint state={info.state} />
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <Field label="이름">
                <Input name="name" defaultValue={client.name} />
              </Field>
              <Field label="회사명">
                <Input name="company" defaultValue={client.company ?? ''} />
              </Field>
              <Field label="담당자">
                <Input name="contact_name" defaultValue={client.contact_name ?? ''} />
              </Field>
              <Field label="대표자">
                <Input name="ceo_name" defaultValue={client.ceo_name ?? ''} />
              </Field>
              <Field label="연락처">
                <Input name="phone" defaultValue={client.phone ?? ''} />
              </Field>
              <Field label="이메일">
                <Input name="email" type="email" defaultValue={client.email ?? ''} />
              </Field>
              <Field label="사업자등록번호">
                <Input name="business_number" defaultValue={client.business_number ?? ''} placeholder="000-00-00000" />
              </Field>
              <Field label="주소" className="col-span-2">
                <Input name="address" defaultValue={client.address ?? ''} />
              </Field>
              <Field label="메모" className="col-span-2 md:col-span-3">
                <Textarea name="memo" rows={2} defaultValue={client.memo ?? ''} />
              </Field>
            </div>
          </form>

          <AccountsSection client={client} />
          <CardsSection client={client} />

          <section>
            <h3 className="mb-2 text-[13px] font-semibold text-ink-soft">
              연결된 프로젝트 <span className="font-normal text-ink-muted">{client.projects.length}</span>
            </h3>
            {client.projects.length === 0 ? (
              <p className="text-xs text-ink-muted">연결된 프로젝트가 없습니다.</p>
            ) : (
              <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
                {client.projects.map(p => (
                  <li key={p.id}>
                    <Link href={`/admin/projects?open=${p.id}`} className="flex items-center gap-2 px-4 py-2.5 transition hover:bg-hover">
                      <span className="truncate text-sm text-ink">{p.name}</span>
                      <StatusBadge status={p.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <form action={deleteClient} className="border-t border-line pt-4">
            <input type="hidden" name="id" value={client.id} />
            <button
              type="submit"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-red-200 px-2.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
            >
              <Icon name="bin" className="size-3.5" />
              클라이언트 삭제
            </button>
            <span className="ml-2 text-xs text-ink-muted">등록된 계정과 카드도 함께 삭제됩니다.</span>
          </form>
        </div>
      )}
    </li>
  )
}

export default function ClientsBoard({
  clients,
  defaultOpenId,
}: {
  clients: ClientWithRelations[]
  defaultOpenId: number | null
}) {
  const [openId, setOpenId] = useState<number | null>(defaultOpenId)
  const [creating, setCreating] = useState(false)

  return (
    <>
      <header className="mb-6 flex flex-col items-start justify-between gap-3 sm:mb-7 sm:flex-row sm:items-start sm:gap-4">
        <div>
          <h1 className="text-[22px] leading-tight font-semibold tracking-tight text-ink sm:text-[26px]">클라이언트</h1>
          <p className="mt-1 text-sm text-ink-muted">행을 누르면 그 자리에서 펼쳐집니다. 계정·카드도 그 안에서 바로 추가하세요.</p>
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
          className="animate-fade-up mb-4 flex flex-wrap items-end gap-2 rounded-xl border border-dashed border-line bg-canvas/50 p-3.5"
        >
          <Field label="이름 *" className="min-w-[200px] flex-1">
            <Input name="name" autoFocus placeholder="예: 펫마일" />
          </Field>
          <Field label="회사명" className="min-w-[180px] flex-1">
            <Input name="company" placeholder="(주)펫마일" />
          </Field>
          <Button type="submit">추가</Button>
        </form>
      )}

      {clients.length === 0 && !creating ? (
        <div className="rounded-xl border border-dashed border-line py-12 text-center text-sm text-ink-muted">
          등록된 클라이언트가 없습니다.
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {clients.map(c => (
            <ClientRow key={c.id} client={c} open={openId === c.id} onToggle={() => setOpenId(openId === c.id ? null : c.id)} />
          ))}
        </ul>
      )}
    </>
  )
}
