import { Logo } from '@/components/Logo'
import { formatWon } from '@/data/medinity'

type QuoteLine = { label: string; sub?: string; price: number }

/**
 * 인쇄(→ PDF 저장) 전용 견적서. 화면에서는 숨기고 print 시에만 보인다.
 * 제이씨랩(JAICYLAB) 로고와 함께 항목·합계를 A4 문서 형태로 낸다.
 */
export function PrintableQuote({
  lines,
  subtotal,
  vat,
  total,
  date,
  className,
}: {
  lines: QuoteLine[]
  subtotal: number
  vat: number
  total: number
  date: string
  className?: string
}) {
  return (
    <div className={className}>
      <style
        dangerouslySetInnerHTML={{
          __html:
            '@media print{html,body{background:#fff !important;-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{margin:14mm}[data-sonner-toaster]{display:none !important}}',
        }}
      />
      <div className="mx-auto max-w-2xl px-2 py-1 text-slate-900">
        {/* 상단: 제이씨랩 로고 + 견적일 */}
        <div className="flex items-end justify-between border-b-2 border-slate-900 pb-4">
          <Logo height={26} className="text-slate-900" />
          <div className="text-right text-[11px] text-slate-500">
            견적일 <span className="tabular-nums">{date}</span>
          </div>
        </div>

        <h1 className="mt-7 text-[22px] font-bold tracking-tight">홈페이지 제작 견적서</h1>
        <p className="mt-1 text-[12px] text-slate-500">치과 홈페이지 제작 · MEDINITY</p>

        {/* 항목 표 */}
        <table className="mt-6 w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-slate-300 text-slate-500">
              <th className="py-2 text-left font-medium">항목</th>
              <th className="py-2 text-right font-medium">금액</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={i} className="border-b border-slate-100 align-top">
                <td className="py-2 pr-3">
                  <div className="font-medium text-slate-800">{l.label}</div>
                  {l.sub && <div className="mt-0.5 text-[11px] text-slate-400">{l.sub}</div>}
                </td>
                <td className="py-2 text-right tabular-nums text-slate-700">{l.price === 0 ? '포함' : formatWon(l.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 합계 */}
        <div className="mt-5 flex justify-end">
          <div className="w-64 space-y-1.5 text-[13px]">
            <div className="flex justify-between text-slate-500"><span>공급가</span><span className="tabular-nums">{formatWon(subtotal)}</span></div>
            <div className="flex justify-between text-slate-500"><span>부가세 (10%)</span><span className="tabular-nums">{formatWon(vat)}</span></div>
            <div className="mt-1 flex justify-between border-t-2 border-slate-900 pt-2 text-[16px] font-bold">
              <span>합계</span><span className="tabular-nums">{formatWon(total)}</span>
            </div>
          </div>
        </div>

        <p className="mt-10 text-[11px] leading-relaxed text-slate-400">
          본 견적서는 선택하신 옵션 기준으로 자동 산출된 참고용 견적이며, 상세 협의에 따라 변동될 수 있습니다.
        </p>
        <div className="mt-4 border-t border-slate-200 pt-3 text-[11px] text-slate-500">JAICYLAB · jaicylab.com</div>
      </div>
    </div>
  )
}
