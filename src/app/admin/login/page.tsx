import LoginForm from './LoginForm'
import Wordmark from '@/components/admin/Wordmark'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  return (
    <main className="flex min-h-dvh items-center justify-center bg-canvas px-6">
      <div className="w-full max-w-[380px] animate-fade-up">
        <div className="mb-8 flex flex-col items-center text-center">
          <Wordmark className="mb-5 h-6 w-auto text-brand" />
          <h1 className="text-[22px] font-semibold tracking-tight text-ink">관리자</h1>
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
