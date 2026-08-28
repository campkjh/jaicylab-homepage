import { CONTRACT_CHAPTERS, STATEMENT_PARAGRAPHS } from '@/lib/contract-content'
import { PROVIDER, computeAmounts, formatWon, interpolate, formatContractDate, type ContractDraft } from '@/lib/contract-template'

/**
 * 표준계약서 문서 렌더러 — 화면 미리보기와 인쇄(PDF) 양쪽에 동일하게 쓰인다.
 * 표지 → 계약명세서 → 약관 6장 → 특약 순으로 A4 페이지가 흐른다.
 * 인쇄용 규칙은 admin.css 의 @media print 에 있다(.contract-print).
 */
export function ContractDocument({ data }: { data: ContractDraft }) {
  const { dev, vat, total } = computeAmounts(data.dev_amount)
  const date = formatContractDate(data.contract_date)
  const terms = (data.special_terms ?? []).filter(t => (t.title || t.body).trim())

  const AmountBlock = (
    <div className="text-[#191f28]">
      <div className="text-[13px] font-bold text-[#191f28]">Total</div>
      <div className="mt-0.5 text-[30px] font-extrabold leading-tight text-[#191f28]">{formatWon(dev)}</div>
      <div className="mt-2 space-y-0.5 text-[12.5px] text-[#4e5968]">
        <div><span className="text-[#8b95a1]">개발비</span> &nbsp;{formatWon(dev)}</div>
        <div><span className="text-[#8b95a1]">부가세</span> &nbsp;{formatWon(vat)}</div>
        <div><span className="text-[#8b95a1]">Vat포함</span> &nbsp;{formatWon(total)}</div>
      </div>
    </div>
  )

  const InfoGrid = (
    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[12.5px] text-[#4e5968] sm:grid-cols-4">
      <span><b className="font-medium text-[#8b95a1]">계약 보증금</b>&nbsp; {data.deposit || 'N/A'}</span>
      <span><b className="font-medium text-[#8b95a1]">보증금 구분</b>&nbsp; {data.deposit_type || 'N/A'}</span>
      <span><b className="font-medium text-[#8b95a1]">대금지급</b>&nbsp; {data.payment_terms || 'N/A'}</span>
      <span><b className="font-medium text-[#8b95a1]">지체상금율</b>&nbsp; {data.penalty_rate || 'N/A'}</span>
    </div>
  )

  return (
    <div className="contract-print bg-white text-[#191f28]">
      {/* ───────── 표지 ───────── */}
      <section className="contract-page px-[9%] py-[8%]">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-extrabold tracking-tight">표준계약서</h1>
            <p className="mt-0.5 text-[14px] text-[#8b95a1]">standard contract</p>
          </div>
          <div className="select-none text-[22px] font-black italic tracking-tight text-[#c4cbd4]">Jaicy™</div>
        </div>

        <div className="mt-9">{AmountBlock}</div>

        {/* 계약 개요 박스 */}
        <div className="mt-8 rounded-2xl bg-[#f4f5f7] px-6 py-5">
          <div className="text-[15px] font-bold">
            <span className="text-[#4e5968]">계약명</span>&nbsp;&nbsp;{data.title}
          </div>
          <div className="mt-4">{InfoGrid}</div>
          <div className="mt-2.5 space-y-1 text-[12.5px] text-[#4e5968]">
            <div><span className="text-[#8b95a1]">계약기간</span>&nbsp;&nbsp;{data.period}</div>
            <div><span className="text-[#8b95a1]">사후오류보증</span>&nbsp;&nbsp;{data.warranty}</div>
            <div><span className="text-[#8b95a1]">입금계좌</span>&nbsp;&nbsp;{data.account}</div>
          </div>
        </div>

        {/* 당사자 */}
        <div className="mt-7 grid grid-cols-2 gap-8 rounded-2xl bg-[#f4f5f7] px-6 py-5">
          <div>
            <div className="mb-3 text-[14px] font-bold">Provider info.(을)</div>
            <dl className="space-y-1.5 text-[12.5px]">
              <PartyRow k="상호" v={PROVIDER.company} />
              <PartyRow k="주소" v={PROVIDER.address} />
              <PartyRow k="업태" v={PROVIDER.bizType} />
              <PartyRow k="종목" v={PROVIDER.bizItem} />
              <PartyRow k="사업자번호" v={PROVIDER.bizNo} />
              <PartyRow k="대표전화" v={PROVIDER.phone} />
              <PartyRow k="대표자" v={`${PROVIDER.ceo}(인)`} />
            </dl>
          </div>
          <div>
            <div className="mb-3 text-[14px] font-bold">Recipient info.(갑)</div>
            <dl className="space-y-1.5 text-[12.5px]">
              <PartyRow k="상호" v={data.gap_company} />
              <PartyRow k="주소" v={data.gap_address} />
              <PartyRow k="사업자번호" v={data.gap_biz_no} />
              <PartyRow k="대표전화" v={data.gap_phone} />
              <PartyRow k="대표자" v={data.gap_ceo} />
            </dl>
          </div>
        </div>

        <div className="mt-8 border-t border-[#e5e8eb] pt-5">
          <div className="mb-1.5 text-[12.5px] font-bold text-[#191f28]">재경비 및 기술료 청구 안내</div>
          <p className="text-[11.5px] leading-relaxed text-[#4e5968]">
            본 계약에 따라 재경비는 사업 수행 과정에서 발생하는 간접비용으로, 인건비, 사무실 운영비, 회계·법무·행정 관리 비용 등을 포함하며 총 사업비의 10% 이내에서 산정된다. 기술료는 연구개발 결과물의 활용 대가로, 기술 이전 및 상업적 이용 시 매출액 대비 10% 이내에서 부과될 수 있으며, 지급 방식은 계약 조건에 따라 일시금 또는 분할납부로 정해진다. 본 약관에 명시되지 않은 사항은 관련 법령 및 당사자 간 협의에 따른다.
          </p>
        </div>

        <p className="mt-6 border-t border-[#e5e8eb] pt-5 text-[12px] leading-relaxed text-[#4e5968]">
          제이씨랩 (“제공자” 이하 “을”)와 ({data.gap_company || '고객'} “고객” 이하 “갑”)은 본 계약서에 의하여 위 용역에 대한 계약을 체결하고, 신의에 따라 성실히 계약상의 의무를 이행할 것을 확약하며, 본 계약의 증거로서 계약서를 작성하여 계약서에 당사자가 기명 날인한 후 각각 1통씩 보관한다.
        </p>

        <p className="mt-7 text-[15px] font-bold">
          {date.y || '2026'}년 &nbsp;&nbsp;{date.m || ''}월 &nbsp;&nbsp;{date.d || ''}일
        </p>
      </section>

      {/* ───────── 계약명세서 ───────── */}
      <section className="contract-page px-[9%] py-[8%]">
        <div className="mb-6">
          <h2 className="text-[22px] font-extrabold tracking-tight">계약명세서</h2>
          <p className="mt-0.5 text-[13px] text-[#8b95a1]">Statement of contract</p>
        </div>

        <div className="grid grid-cols-[1fr_auto] items-start gap-8 rounded-2xl bg-[#f4f5f7] px-6 py-5">
          <div className="space-y-2 text-[12.5px] text-[#4e5968]">
            <div><span className="text-[#8b95a1]">대금지급</span>&nbsp;&nbsp;{data.account}</div>
            <div className="pt-1">{InfoGrid}</div>
          </div>
          <div className="min-w-[150px]">{AmountBlock}</div>
        </div>

        <ol className="mt-7 space-y-3 text-[12px] leading-relaxed text-[#4e5968]">
          {STATEMENT_PARAGRAPHS.map((p, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-[1px] shrink-0 font-bold text-[#8b95a1]">{i + 1}.</span>
              <span>{p}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* ───────── 약관 (6장) ───────── */}
      <section className="contract-flow px-[9%] py-[8%]">
        {CONTRACT_CHAPTERS.map((ch, ci) => (
          <div key={ci} className={ci === 0 ? '' : 'mt-8'}>
            <div className="mb-3 border-b border-[#191f28] pb-1.5">
              <div className="text-[15px] font-extrabold">{ch.titleKo}</div>
              <div className="text-[10.5px] font-medium uppercase tracking-wide text-[#8b95a1]">{ch.titleEn}</div>
            </div>
            <div className="space-y-3">
              {ch.articles.map((a, ai) => (
                <article key={ai} className="break-avoid">
                  <h3 className="text-[12.5px] font-bold text-[#191f28]">
                    {a.no} <span className="font-semibold">({a.title})</span>
                  </h3>
                  <div className="mt-1 space-y-1">
                    {a.clauses.map((c, cli) => (
                      <p key={cli} className="text-[11.5px] leading-relaxed text-[#4e5968]">
                        {interpolate(c, data.dev_amount)}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ───────── 특약 ───────── */}
      {terms.length > 0 && (
        <section className="contract-flow break-page px-[9%] py-[8%]">
          <div className="mb-3 border-b border-[#191f28] pb-1.5">
            <div className="text-[15px] font-extrabold">특약사항</div>
            <div className="text-[10.5px] font-medium uppercase tracking-wide text-[#8b95a1]">Special Terms</div>
          </div>
          <div className="space-y-3">
            {terms.map((t, i) => (
              <article key={i} className="break-avoid">
                <h3 className="text-[12.5px] font-bold text-[#191f28]">특약 {i + 1}{t.title ? ` (${t.title})` : ''}</h3>
                <p className="mt-1 whitespace-pre-wrap text-[11.5px] leading-relaxed text-[#4e5968]">{t.body}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function PartyRow({ k, v }: { k: string; v: string | null | undefined }) {
  return (
    <div className="flex gap-2">
      <dt className="w-[68px] shrink-0 text-[#8b95a1]">{k}</dt>
      <dd className="text-[#191f28]">{v || ' '}</dd>
    </div>
  )
}
