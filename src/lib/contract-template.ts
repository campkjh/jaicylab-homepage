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

/** 약관 문안의 {{DEV_AMOUNT}} 토큰을 실제 개발비로 치환. */
export function interpolate(text: string, devAmount: number): string {
  return text.replace(/\{\{DEV_AMOUNT\}\}/g, formatWon(devAmount))
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
