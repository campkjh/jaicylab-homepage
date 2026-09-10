// 제이씨랩 표준계약서 — 고정 정보 + 계산/치환 헬퍼.
// 고정 법무 문안(약관 6장)은 contract-content.ts, 가변 값은 contracts 테이블에 있다.
import type { Contract } from './types'

/** 제공자("을") = 제이씨랩. 항상 고정. */
export const PROVIDER = {
  company: '제이씨랩',
  address: '경기도 수원시 장안구 화산로 187번길 19',
  bizType: '정보 통신업', // 업태
  bizItem: '시스템소프트웨어 개발 및 공급업', // 종목
  bizNo: '574-17-02394',
  phone: '010-9433-5674',
  ceo: '김정훈',
} as const

/** 새 계약서 기본값. */
export const CONTRACT_DEFAULTS = {
  title: '외주용역 홈페이지 개발',
  deposit: 'N/A',
  deposit_type: 'N/A',
  payment_terms: 'N/A',
  penalty_rate: 'N/A',
  period: '선급금 납입일로부터 2개월',
  warranty: '개발완료 후 무기한 무상보증',
  account: '(케이뱅크)100-216-345262 예금주(제이씨랩 jaicylab)',
} as const

// 분야(계약 대상) — 제목/약관 주어("{{SUBJECT}}") 치환에 쓰인다.
export type ContractKind = 'homepage' | 'app'
export const KIND_LABEL: Record<ContractKind, string> = { homepage: '홈페이지 개발', app: '앱 개발' }
export const KIND_SUBJECT: Record<ContractKind, string> = { homepage: '홈페이지개발', app: '앱개발' }
export const KIND_TITLE: Record<ContractKind, string> = { homepage: '외주용역 홈페이지 개발', app: '외주용역 앱 개발' }
export function kindSubject(kind: string | null | undefined): string {
  return KIND_SUBJECT[(kind as ContractKind) in KIND_SUBJECT ? (kind as ContractKind) : 'homepage']
}

// 계약 종류 — 신규/추가/유지보수/소규모 (2026-09-10). 분야와 직교하는 축으로,
// 제목·약관 주어·기간/보증 기본값에 조합된다. 기존 계약(컬럼 없던 시절)은 'new'.
export type ContractType = 'new' | 'addon' | 'maintenance' | 'small'
export const TYPE_LABEL: Record<ContractType, string> = {
  new: '신규개발',
  addon: '추가개발',
  maintenance: '유지보수',
  small: '소규모개발',
}
const KIND_WORD: Record<ContractKind, string> = { homepage: '홈페이지', app: '앱' }

function normKind(kind: string | null | undefined): ContractKind {
  return kind === 'app' ? 'app' : 'homepage'
}
export function normType(t: string | null | undefined): ContractType {
  return (t as ContractType) in TYPE_LABEL ? (t as ContractType) : 'new'
}

/** 분야×종류 → 계약명 기본값. 신규개발은 기존 제목과 동일(하위호환). */
export function contractTitle(kind: string | null | undefined, type: string | null | undefined): string {
  const w = KIND_WORD[normKind(kind)]
  switch (normType(type)) {
    case 'addon': return `외주용역 ${w} 추가개발`
    case 'maintenance': return `${w} 유지보수 용역`
    case 'small': return `외주용역 ${w} 소규모 개발`
    default: return KIND_TITLE[normKind(kind)]
  }
}

/** 분야×종류 → 약관 주어("{{SUBJECT}}"). 신규개발은 기존 주어와 동일. */
export function contractSubject(kind: string | null | undefined, type: string | null | undefined): string {
  const w = KIND_WORD[normKind(kind)]
  switch (normType(type)) {
    case 'addon': return `${w} 추가개발`
    case 'maintenance': return `${w} 유지보수`
    case 'small': return `${w} 소규모개발`
    default: return KIND_SUBJECT[normKind(kind)]
  }
}

/** 종류별 계약기간/사후보증 기본값 — 값이 아직 기본값일 때만 에디터가 갈아끼운다. */
export const TYPE_PERIOD: Record<ContractType, string> = {
  new: '선급금 납입일로부터 2개월',
  addon: '선급금 납입일로부터 1개월',
  maintenance: '계약일로부터 12개월',
  small: '선급금 납입일로부터 1개월',
}
export const TYPE_WARRANTY: Record<ContractType, string> = {
  new: '개발완료 후 무기한 무상보증',
  addon: '개발완료 후 무기한 무상보증',
  maintenance: '유지보수 계약기간 내 상시 대응',
  small: '개발완료 후 무기한 무상보증',
}

/** 분야×종류 조합의 모든 기본 제목 — 사용자가 손대지 않은 제목인지 판별용. */
export const ALL_DEFAULT_TITLES: readonly string[] = (['homepage', 'app'] as const).flatMap(k =>
  (Object.keys(TYPE_LABEL) as ContractType[]).map(t => contractTitle(k, t)),
)

// 대금 방식 — 일시금 / 중도금·잔금(분할).
export type PaymentType = 'lump' | 'installment'
export type PaymentStage = { label: string; percent: number }
export const DEFAULT_SCHEDULE: PaymentStage[] = [
  { label: '계약금', percent: 40 },
  { label: '중도금', percent: 30 },
  { label: '잔금', percent: 30 },
]

// 맨먼스(투입 인력) — 개발비를 역할별 비중으로 나눠 인건비/맨먼스를 자동 산출.
export type ContractRole = { role: string; grade: string; headcount: number; participation: number; weight: number }
export const DEFAULT_MM_RATE = 4_000_000 // 맨먼스 단가(원/M·M)
export const DEFAULT_ROLES: ContractRole[] = [
  { role: '풀스택 개발자(Front/backend)', grade: '고급', headcount: 1, participation: 100, weight: 67 },
  { role: 'IT, UI/UX 디자이너/기획', grade: '고급', headcount: 1, participation: 100, weight: 33 },
]
export const DEFAULT_TECH_STACK = ['React.js(frontend)', 'typescript', 'Next.js']

export function formatMM(mm: number): string {
  return `${(Math.round((mm || 0) * 100) / 100).toLocaleString('ko-KR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} MM`
}

/** 개발비 + 맨먼스 단가 + 역할 비중 → 역할별 인건비/맨먼스. 인건비 합 = 개발비(반올림은 마지막 역할 흡수). */
export function computeManMonth(devAmount: number, rate: number, roles: ContractRole[]) {
  const dev = Math.max(0, Math.round(devAmount || 0))
  const r = Math.max(1, Math.round(rate || DEFAULT_MM_RATE))
  const rows = (roles ?? []).map(role => {
    const laborCost = Math.round((dev * (Number(role.weight) || 0)) / 100)
    return { ...role, laborCost, mm: laborCost / r }
  })
  if (rows.length) {
    const sum = rows.reduce((a, b) => a + b.laborCost, 0)
    rows[rows.length - 1].laborCost += dev - sum
    rows[rows.length - 1].mm = rows[rows.length - 1].laborCost / r
  }
  const totalMM = rows.reduce((a, b) => a + b.mm, 0)
  return { rows, totalMM, totalLabor: dev }
}

export const VAT_RATE = 0.1

export function formatWon(n: number): string {
  return `${Math.round(n || 0).toLocaleString('ko-KR')}원`
}

/** 개발비(공급가) → 부가세/합계. */
export function computeAmounts(devAmount: number) {
  const dev = Math.max(0, Math.round(devAmount || 0))
  const vat = Math.round(dev * VAT_RATE)
  const total = dev + vat
  return { dev, vat, total }
}

/** 약관 문안의 토큰 치환: {{DEV_AMOUNT}}=개발비, {{SUBJECT}}=분야 주어(홈페이지개발/앱개발). */
export function interpolate(text: string, devAmount: number, subject: string): string {
  return text
    .replace(/\{\{DEV_AMOUNT\}\}/g, formatWon(devAmount))
    .replace(/\{\{SUBJECT\}\}/g, subject)
}

/** 대금 일정 → 단계별 금액. 반올림 오차는 마지막 단계에 흡수해 합계=개발비. */
export function computeSchedule(devAmount: number, stages: PaymentStage[]): (PaymentStage & { amount: number })[] {
  const dev = Math.max(0, Math.round(devAmount || 0))
  const out = (stages ?? []).map(s => ({ ...s, amount: Math.round((dev * (Number(s.percent) || 0)) / 100) }))
  if (out.length) {
    const sum = out.reduce((a, b) => a + b.amount, 0)
    out[out.length - 1].amount += dev - sum
  }
  return out
}

/** 계약일(YYYY-MM-DD) → "2026년 3월 15일" / 값 없으면 빈 자리(년 월 일). */
export function formatContractDate(iso: string | null | undefined): { y: string; m: string; d: string } {
  if (!iso) return { y: '', m: '', d: '' }
  const [y, m, d] = iso.split('-')
  return { y: y ?? '', m: String(Number(m)), d: String(Number(d)) }
}

/** 폼 상태(부분 Contract)를 문서 렌더에 쓰는 형태로 정규화. */
export type ContractDraft = Omit<Contract, 'id' | 'created_at' | 'updated_at' | 'client_id' | 'status'> & {
  id?: number
  client_id?: number | null
  status?: string
}

export function emptyDraft(): ContractDraft {
  return {
    kind: 'homepage',
    contract_type: 'new',
    payment_type: 'lump',
    payment_schedule: DEFAULT_SCHEDULE,
    manmonth_rate: DEFAULT_MM_RATE,
    roles: DEFAULT_ROLES,
    tech_stack: DEFAULT_TECH_STACK,
    title: CONTRACT_DEFAULTS.title,
    gap_company: '',
    gap_address: '',
    gap_biz_no: '',
    gap_phone: '',
    gap_ceo: '',
    dev_amount: 0,
    deposit: CONTRACT_DEFAULTS.deposit,
    deposit_type: CONTRACT_DEFAULTS.deposit_type,
    payment_terms: CONTRACT_DEFAULTS.payment_terms,
    penalty_rate: CONTRACT_DEFAULTS.penalty_rate,
    period: CONTRACT_DEFAULTS.period,
    warranty: CONTRACT_DEFAULTS.warranty,
    account: CONTRACT_DEFAULTS.account,
    contract_date: null,
    special_terms: [],
  }
}
