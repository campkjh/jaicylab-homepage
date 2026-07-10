import LoginForm from './LoginForm'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  return (
    <main className="flex min-h-dvh items-center justify-center bg-canvas px-6">
      <div className="w-full max-w-[380px] animate-fade-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-xl bg-ink text-lg font-bold text-white">
            J
          </div>
          <h1 className="text-[22px] font-semibold tracking-tight text-ink">JAICYLAB 관리자</h1>
          <p className="mt-1.5 text-sm text-ink-muted">프로젝트와 클라이언트 정보를 관리합니다.</p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6 shadow-[0_1px_3px_rgba(15,15,15,0.06),0_8px_24px_-12px_rgba(15,15,15,0.12)]">
          <LoginForm next={next ?? '/admin'} />
        </div>

        <p className="mt-6 text-center text-xs text-ink-muted">인가된 관리자만 접근할 수 있습니다.</p>
      </div>
    </main>
  )
}
