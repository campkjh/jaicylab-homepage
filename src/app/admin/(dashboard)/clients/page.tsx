import Link from 'next/link'
import { sql, ensureSchema } from '@/lib/db'
import { Button, EmptyState, Field, Input, PageHeader, Textarea } from '@/components/admin/ui'
import InlineCreate from '@/components/admin/InlineCreate'
import { createClient } from '../../actions'

export const dynamic = 'force-dynamic'

type Row = {
  id: number
  name: string
  company: string | null
  phone: string | null
  email: string | null
  project_count: number
  account_count: number
}

export default async function ClientsPage() {
  await ensureSchema()

  const clients = (await sql`
    SELECT c.id, c.name, c.company, c.phone, c.email,
           (SELECT count(*) FROM projects p WHERE p.client_id = c.id)        AS project_count,
           (SELECT count(*) FROM client_accounts a WHERE a.client_id = c.id) AS account_count
    FROM clients c
    ORDER BY c.created_at DESC
  `) as Row[]

  return (
    <>
      <PageHeader
        title="클라이언트"
        subtitle="사업자 정보와 개발에 필요한 계정·결제 수단을 모아둡니다."
        action={
          <InlineCreate label="새 클라이언트">
            <form action={createClient} className="flex w-[420px] flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="이름 *">
                  <Input name="name" autoFocus placeholder="예: 펫마일" />
                </Field>
                <Field label="회사명">
                  <Input name="company" placeholder="(주)펫마일" />
                </Field>
                <Field label="담당자">
                  <Input name="contact_name" placeholder="김담당" />
                </Field>
                <Field label="연락처">
                  <Input name="phone" placeholder="010-0000-0000" />
                </Field>
                <Field label="이메일" className="col-span-2">
                  <Input name="email" type="email" placeholder="contact@example.com" />
                </Field>
              </div>
              <Field label="메모">
                <Textarea name="memo" rows={2} placeholder="특이사항" />
              </Field>
              <Button type="submit" className="self-start">만들기</Button>
            </form>
          </InlineCreate>
        }
      />

      {clients.length === 0 ? (
        <EmptyState>등록된 클라이언트가 없습니다.</EmptyState>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {clients.map(c => (
            <li key={c.id}>
              <Link
                href={`/admin/clients/${c.id}`}
                className="block h-full rounded-xl border border-line bg-surface p-5 transition hover:border-ink-muted/40 hover:shadow-[0_1px_3px_rgba(15,15,15,0.06)]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-canvas text-sm font-semibold text-ink-soft">
                    {c.name.slice(0, 1)}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-ink">{c.name}</div>
                    {c.company && <div className="truncate text-xs text-ink-muted">{c.company}</div>}
                  </div>
                </div>

                <dl className="mt-4 flex flex-col gap-1 text-xs">
                  {c.phone && (
                    <div className="flex gap-2">
                      <dt className="w-12 shrink-0 text-ink-muted">연락처</dt>
                      <dd className="truncate text-ink-soft">{c.phone}</dd>
                    </div>
                  )}
                  {c.email && (
                    <div className="flex gap-2">
                      <dt className="w-12 shrink-0 text-ink-muted">이메일</dt>
                      <dd className="truncate text-ink-soft">{c.email}</dd>
                    </div>
                  )}
                </dl>

                <div className="mt-4 flex gap-1.5 border-t border-line pt-3 text-[11px] text-ink-muted">
                  <span className="rounded-md bg-canvas px-1.5 py-0.5">프로젝트 {Number(c.project_count)}</span>
                  <span className="rounded-md bg-canvas px-1.5 py-0.5">계정 {Number(c.account_count)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
