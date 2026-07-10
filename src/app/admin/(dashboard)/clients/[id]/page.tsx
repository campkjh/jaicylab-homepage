import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, ExternalLink, Trash2, CreditCard, KeyRound } from 'lucide-react'
import {
  sql,
  ensureSchema,
  CATEGORY_LABEL,
  type Client,
  type ClientAccount,
  type ClientCard,
  type ProjectStatus,
} from '@/lib/db'
import { Button, Card, Field, Input, SectionTitle, Select, StatusBadge, Textarea } from '@/components/admin/ui'
import InlineCreate from '@/components/admin/InlineCreate'
import SecretValue from '@/components/admin/SecretValue'
import { addAccount, addCard, deleteAccount, deleteCard, deleteClient, updateClient } from '../../../actions'

export const dynamic = 'force-dynamic'

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await ensureSchema()
  const id = Number.parseInt((await params).id, 10)
  if (!Number.isFinite(id)) notFound()

  const [client] = (await sql`SELECT * FROM clients WHERE id = ${id}`) as Client[]
  if (!client) notFound()

  const accounts = (await sql`
    SELECT id, client_id, category, label, url, username, password_enc, memo
    FROM client_accounts WHERE client_id = ${id} ORDER BY category, created_at
  `) as ClientAccount[]

  const cards = (await sql`
    SELECT id, client_id, label, brand, holder, last4, number_enc, expiry_enc, cvc_enc, memo
    FROM client_cards WHERE client_id = ${id} ORDER BY created_at
  `) as ClientCard[]

  const projects = (await sql`
    SELECT id, name, status FROM projects WHERE client_id = ${id} ORDER BY updated_at DESC
  `) as { id: number; name: string; status: ProjectStatus }[]

  return (
    <>
      <Link
        href="/admin/clients"
        className="mb-5 inline-flex items-center gap-1 text-sm text-ink-muted transition hover:text-ink"
      >
        <ChevronLeft className="size-4" />
        클라이언트
      </Link>

      <form action={updateClient} className="mb-10">
        <input type="hidden" name="id" value={client.id} />
        <input
          name="name"
          defaultValue={client.name}
          className="-ml-1 w-full rounded-md border border-transparent bg-transparent px-1 text-[30px] leading-tight font-semibold tracking-tight text-ink outline-none transition hover:border-line focus:border-brand"
        />

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
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
          <Field label="주소" className="col-span-2 md:col-span-3">
            <Input name="address" defaultValue={client.address ?? ''} />
          </Field>
          <Field label="메모" className="col-span-2 md:col-span-3">
            <Textarea name="memo" rows={2} defaultValue={client.memo ?? ''} />
          </Field>
        </div>

        <Button type="submit" className="mt-4">저장</Button>
      </form>

      {/* 개발 계정 */}
      <section className="mb-10">
        <div className="mb-3 flex items-center justify-between">
          <SectionTitle count={accounts.length}>
            <KeyRound className="size-3.5" />
            개발 계정
          </SectionTitle>
          <InlineCreate label="계정 추가">
            <form action={addAccount} className="flex w-[460px] flex-col gap-3">
              <input type="hidden" name="client_id" value={client.id} />
              <div className="grid grid-cols-2 gap-3">
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
                <Field label="메모" className="col-span-2">
                  <Textarea name="memo" rows={2} placeholder="2FA 백업코드 보관 위치, 소유 계정 등" />
                </Field>
              </div>
              <Button type="submit" className="self-start">추가</Button>
            </form>
          </InlineCreate>
        </div>

        {accounts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line py-10 text-center text-sm text-ink-muted">
            구글플레이 콘솔, 애플 디벨로퍼 같은 계정을 등록해 두세요.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {accounts.map(a => (
              <li key={a.id} className="group">
                <Card className="!p-4">
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
                            바로가기 <ExternalLink className="size-3" />
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
                        <Trash2 className="size-4" />
                      </button>
                    </form>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 결제 수단 */}
      <section className="mb-10">
        <div className="mb-3 flex items-center justify-between">
          <SectionTitle count={cards.length}>
            <CreditCard className="size-3.5" />
            결제 수단
          </SectionTitle>
          <InlineCreate label="카드 추가">
            <form action={addCard} className="flex w-[460px] flex-col gap-3">
              <input type="hidden" name="client_id" value={client.id} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="이름 *">
                  <Input name="label" autoFocus placeholder="예: 법인카드 (개발비 결제용)" />
                </Field>
                <Field label="카드사">
                  <Input name="brand" placeholder="신한 / 국민 …" />
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
                <Field label="소유자" className="col-span-2">
                  <Input name="holder" placeholder="카드에 적힌 이름" />
                </Field>
                <Field label="메모" className="col-span-2">
                  <Textarea name="memo" rows={2} placeholder="어디에 등록된 카드인지" />
                </Field>
              </div>
              <Button type="submit" className="self-start">추가</Button>
            </form>
          </InlineCreate>
        </div>

        {cards.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line py-10 text-center text-sm text-ink-muted">
            애플 디벨로퍼 연회비, 클라우드 요금 결제에 쓰는 카드를 등록해 두세요.
          </p>
        ) : (
          <ul className="grid gap-2 md:grid-cols-2">
            {cards.map(c => (
              <li key={c.id} className="group">
                <Card className="!p-4">
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
                        <Trash2 className="size-4" />
                      </button>
                    </form>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 연결된 프로젝트 */}
      <section>
        <SectionTitle count={projects.length}>연결된 프로젝트</SectionTitle>
        {projects.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line py-10 text-center text-sm text-ink-muted">
            이 클라이언트에 연결된 프로젝트가 없습니다.
          </p>
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
            {projects.map(p => (
              <li key={p.id}>
                <Link href={`/admin/projects/${p.id}`} className="flex items-center gap-2 px-4 py-3 transition hover:bg-hover">
                  <span className="truncate text-sm text-ink">{p.name}</span>
                  <StatusBadge status={p.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <form action={deleteClient} className="mt-14 border-t border-line pt-5">
        <input type="hidden" name="id" value={client.id} />
        <Button type="submit" variant="danger">
          <Trash2 className="size-4" />
          클라이언트 삭제
        </Button>
        <p className="mt-2 text-xs text-ink-muted">등록된 계정과 카드도 함께 삭제됩니다.</p>
      </form>
    </>
  )
}
