import { Logo } from '@/components/Logo'

export type SpecLine = { label: string; sub?: string; price: number }
export type SpecGroup = { title: string; items: SpecLine[] }
export type SpecTeam = { role: string; mm: number }

/**
 * 인쇄(→ PDF 저장) 전용 견적서 + 기능명세서.
 * 화면에서는 숨기고 print 시에만 보인다. (자가견적 앱/홈페이지 탭 공용)
 * 표지 → 견적 요약 → 기능명세서(카테고리별) → 맨먼스·투입인원 순.
 */
export function PrintableSpec({
  title,
  date,
  groups,
  subtotal,
  vat,
  total,
  unit,
  totalMM,
  months,
  team,
  mmRateLabel,
  className,
}: {
  title: string
  date: string
  groups: SpecGroup[]
  subtotal: number
  vat: number
  total: number
  /** 금액 표기 단위 접미사 ('원' 또는 '만') */
  unit: string
  totalMM?: number
  months?: number
  team?: SpecTeam[]
  mmRateLabel?: string
  className?: string
}) {
  const money = (n: number) => `${Math.round(n).toLocaleString('ko-KR')}${unit}`
  const itemCount = groups.reduce((s, g) => s + g.items.length, 0)

  return (
    <div className={className}>
      <style
        dangerouslySetInnerHTML={{
          __html:
            '@media print{html,body{background:#fff !important;-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{margin:14mm}[data-sonner-toaster]{display:none !important}.spec-break{break-inside:avoid;page-break-inside:avoid}}',
        }}
      />
      <div className="mx-auto max-w-3xl px-2 py-1 text-slate-900">
        {/* 표지 */}
        <div className="flex items-end justify-between border-b-2 border-slate-900 pb-4">
          <div>
            <Logo height={26} className="text-slate-900" />
            <div className="mt-2 text-[17px] font-bold">{title}</div>
          </div>
          <div className="text-right text-[11px] text-slate-500">
            견적일 <span className="tabular-nums">{date}</span>
            <div className="mt-0.5">항목 {itemCount}개</div>
          </div>
        </div>

        {/* 견적 요약 */}
        <div className="spec-break mt-6">
          <h2 className="text-[13px] font-bold tracking-wide text-slate-500">견적 요약</h2>
          <table className="mt-2 w-full text-[12.5px]">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="py-1.5 text-slate-600">공급가</td>
                <td className="py-1.5 text-right tabular-nums">{money(subtotal)}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-1.5 text-slate-600">부가세 (10%)</td>
                <td className="py-1.5 text-right tabular-nums">{money(vat)}</td>
              </tr>
              <tr>
                <td className="py-2 text-[14px] font-bold">합계 (VAT 포함)</td>
                <td className="py-2 text-right text-[15px] font-bold tabular-nums text-[#3180F7]">{money(total)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 맨먼스 · 투입인원 */}
        {team && team.length > 0 && (
          <div className="spec-break mt-6">
            <h2 className="text-[13px] font-bold tracking-wide text-slate-500">투입 공수 · 인원</h2>
            <div className="mt-2 flex gap-8 border-b border-slate-200 pb-2 text-[12.5px]">
              {totalMM != null && (
                <div><span className="text-slate-500">총 맨먼스</span> <b className="tabular-nums">{totalMM.toFixed(1)} MM</b></div>
              )}
              {months != null && (
                <div><span className="text-slate-500">예상 기간</span> <b className="tabular-nums">{months.toFixed(1)} 개월</b></div>
              )}
              <div><span className="text-slate-500">투입 인원</span> <b className="tabular-nums">{team.length} 명</b></div>
            </div>
            <table className="mt-2 w-full text-[12.5px]">
              <tbody>
                {team.map(t => (
                  <tr key={t.role} className="border-b border-slate-100">
                    <td className="py-1.5 text-slate-700">{t.role}</td>
                    <td className="py-1.5 text-right font-mono tabular-nums">{t.mm.toFixed(1)} MM</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {mmRateLabel && <p className="mt-2 text-[10.5px] text-slate-400">{mmRateLabel}</p>}
          </div>
        )}

        {/* 기능 명세서 */}
        <div className="mt-6">
          <h2 className="text-[13px] font-bold tracking-wide text-slate-500">기능 명세서</h2>
          {groups.map(g => (
            <div key={g.title} className="spec-break mt-3">
              <div className="bg-slate-100 px-2 py-1 text-[12px] font-bold">{g.title}</div>
              <table className="w-full text-[12px]">
                <tbody>
                  {g.items.map((it, i) => (
                    <tr key={`${g.title}-${i}`} className="border-b border-slate-100">
                      <td className="py-1.5 pl-2">
                        <div className="font-medium text-slate-800">{it.label}</div>
                        {it.sub && <div className="text-[10.5px] text-slate-400">{it.sub}</div>}
                      </td>
                      <td className="w-28 py-1.5 pr-2 text-right tabular-nums text-slate-600">
                        {it.price === 0 ? '포함' : money(it.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <p className="mt-8 border-t border-slate-200 pt-3 text-[10.5px] leading-relaxed text-slate-400">
          본 견적서는 선택하신 항목을 기준으로 자동 산출된 참고용 금액입니다. 실제 계약 금액은 상세 요구사항 확정 후 조정될 수 있습니다. · JAICYLAB
        </p>
      </div>
    </div>
  )
}
