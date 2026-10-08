import { Card, SectionTitle } from '@/components/admin/ui'

export type AccessSummary = {
  name: string
  today_sec: number
  week_sec: number
  month_sec: number
  last_at: string | Date | null
}

export type AccessDay = {
  name: string
  /** KST 기준 'YYYY-MM-DD'. 문자열로 받아 시간대 변환 없이 그대로 읽는다. */
  day: string
  seconds: number
  sessions: number
  first_at: string | Date
  last_at: string | Date
}

const KST = 'Asia/Seoul'
const DOW = ['일', '월', '화', '수', '목', '금', '토']

/** 'YYYY-MM-DD' → '10.8(수)'. Date 로 바꾸지 않으므로 서버 시간대와 무관하다. */
function dayLabel(ymd: string): string {
  const [y, m, d] = ymd.split('-').map(Number)
  return `${m}.${d}(${DOW[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]})`
}
const fmtTime = new Intl.DateTimeFormat('ko-KR', { timeZone: KST, hour: '2-digit', minute: '2-digit', hour12: false })
const fmtFull = new Intl.DateTimeFormat('ko-KR', { timeZone: KST, month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })

/** 초 → '2시간 30분'. 1분이 안 되면 접속으로 치기 애매하니 그대로 밝힌다. */
export function formatDuration(sec: number): string {
  const s = Math.max(0, Math.round(sec))
  if (s < 60) return s === 0 ? '0분' : '1분 미만'
  const h = Math.floor(s / 3600)
  const m = Math.round((s % 3600) / 60)
  if (h && m) return `${h}시간 ${m}분`
  if (h) return `${h}시간`
  return `${m}분`
}

/** 날짜 칸은 KST 기준. (자정을 넘긴 접속은 시작한 날로 친다) */
export default function AccessLogTable({ summary, days }: { summary: AccessSummary[]; days: AccessDay[] }) {
  return (
    <>
      <SectionTitle count={summary.length}>직원 접속로그</SectionTitle>

      {summary.length === 0 ? (
        <Card>
          <p className="text-sm text-ink-muted">아직 쌓인 접속 기록이 없어요. 각자 어드민에 한 번 들어오면 이때부터 기록됩니다.</p>
        </Card>
      ) : (
        <>
          {/* 사람별 합계 */}
          <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {summary.map(u => (
              <div key={u.name} className="rounded-xl border border-line bg-surface px-4 py-3.5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-ink">{u.name}</span>
                  <span className="shrink-0 text-[11px] text-ink-muted">
                    {u.last_at ? `마지막 ${fmtFull.format(new Date(u.last_at))}` : '기록 없음'}
                  </span>
                </div>
                <dl className="mt-2.5 grid grid-cols-3 gap-2 text-center">
                  {[
                    ['오늘', u.today_sec],
                    ['최근 7일', u.week_sec],
                    ['최근 30일', u.month_sec],
                  ].map(([label, sec]) => (
                    <div key={label as string} className="rounded-lg bg-hover py-1.5">
                      <dt className="text-[10px] text-ink-muted">{label}</dt>
                      <dd className="text-xs font-bold tabular-nums text-ink">{formatDuration(sec as number)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          {/* 날짜별 기록 */}
          <div className="overflow-x-auto rounded-xl border border-line bg-surface">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-line text-[11px] text-ink-muted">
                  <th className="px-4 py-2.5 text-left font-medium">이름</th>
                  <th className="px-4 py-2.5 text-left font-medium">날짜</th>
                  <th className="px-4 py-2.5 text-right font-medium">접속 시간</th>
                  <th className="px-4 py-2.5 text-right font-medium">첫 접속</th>
                  <th className="px-4 py-2.5 text-right font-medium">마지막</th>
                  <th className="px-4 py-2.5 text-right font-medium">횟수</th>
                </tr>
              </thead>
              <tbody>
                {days.map((d, i) => (
                  <tr key={`${d.name}-${i}`} className="border-b border-line last:border-0">
                    <td className="px-4 py-2.5 font-medium text-ink">{d.name}</td>
                    <td className="px-4 py-2.5 text-ink-soft">{dayLabel(d.day)}</td>
                    <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-ink">{formatDuration(d.seconds)}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-ink-muted">{fmtTime.format(new Date(d.first_at))}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-ink-muted">{fmtTime.format(new Date(d.last_at))}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-ink-muted">{d.sessions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}
