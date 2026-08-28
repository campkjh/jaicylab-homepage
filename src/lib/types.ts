// 클라이언트 컴포넌트에서도 쓰는 순수 타입/상수.
// db.ts를 직접 import 하면 neon 드라이버가 클라이언트 번들에 끌려오므로 여기로 분리한다.

export type ProjectStatus = 'planning' | 'in_progress' | 'review' | 'done' | 'paused'

// ── 계약서 ─────────────────────────────────────────────
export type ContractSpecialTerm = { title: string; body: string }
export type ContractPaymentStage = { label: string; percent: number }
export type ContractRole = { role: string; grade: string; headcount: number; participation: number; weight: number }

export type Contract = {
  id: number
  client_id: number | null
  kind: string           // 분야: homepage | app
  payment_type: string   // 대금 방식: lump(일시금) | installment(중도금·잔금)
  payment_schedule: ContractPaymentStage[]  // installment 일 때 단계별 비율
  manmonth_rate: number  // 맨먼스 단가(원/M·M)
  roles: ContractRole[]  // 투입 인력(역할·비중)
  tech_stack: string[]   // 사용 기술스택 및 서드파티
  title: string          // 계약명 (예: 외주용역 홈페이지 개발)
  // 갑(고객) 스냅샷 — 저장 시점 값 고정
  gap_company: string | null   // 상호
  gap_address: string | null
  gap_biz_no: string | null    // 사업자번호
  gap_phone: string | null     // 대표전화
  gap_ceo: string | null       // 대표자
  // 금액 (원)
  dev_amount: number           // 개발비(공급가). 부가세=10%, 합계=개발비+부가세는 계산
  // 계약 조건
  deposit: string | null       // 계약 보증금
  deposit_type: string | null  // 보증금 구분
  payment_terms: string | null // 대금지급
  penalty_rate: string | null  // 지체상금율
  period: string | null        // 계약기간
  warranty: string | null      // 사후오류보증
  account: string | null       // 입금계좌
  contract_date: string | null // 계약일 (YYYY-MM-DD)
  special_terms: ContractSpecialTerm[]  // 특약
  status: string               // draft | signed
  created_at: string
  updated_at: string
}

export type Client = {
  id: number
  name: string
  company: string | null
  contact_name: string | null
  phone: string | null
  email: string | null
  business_number: string | null
  ceo_name: string | null
  address: string | null
  memo: string | null
  created_at: string
}

export type ClientAccount = {
  id: number
  client_id: number
  category: string
  label: string
  url: string | null
  username: string | null
  password_enc: string | null
  memo: string | null
}

export type ClientCard = {
  id: number
  client_id: number
  label: string
  brand: string | null
  holder: string | null
  last4: string | null
  number_enc: string | null
  expiry_enc: string | null
  cvc_enc: string | null
  memo: string | null
}

export type Project = {
  id: number
  client_id: number | null
  name: string
  status: ProjectStatus
  progress: number
  start_date: string | null
  due_date: string | null
  description: string | null
  created_at: string
  updated_at: string
}

export type ProjectTask = {
  id: number
  project_id: number
  title: string
  done: boolean
  due_date: string | null
  position: number
}

export type ProjectNote = {
  id: number
  project_id: number
  body: string
  created_at: string
}

export type EventColor = 'blue' | 'green' | 'red' | 'amber' | 'purple' | 'gray'

export type EventCategory = {
  id: number
  name: string
  color: EventColor
  position: number
}

export type ScheduleEvent = {
  id: number
  category_id: number | null
  title: string
  event_date: string
  event_time: string | null
  memo: string | null
  body_html: string | null
  updated_at: string
  updated_by: string | null
  /** 카테고리에서 내려온 색. 미지정이면 gray. */
  color: EventColor
  category_name: string | null
}

/**
 * 설정에서 관리하는 타임라인 상태 태그. position 이 작을수록 위로 온다.
 * is_done 을 켜면 완료 태그처럼 동작한다(체크 버튼·다음 날 지난 기록으로 이동).
 */
export type TimelineStatusDef = {
  id: number
  key: string
  label: string
  color: EventColor
  is_done: boolean
  position: number
}

/** 우측 패널의 할 일. 담당자 태그(관리자 이름)와 상태 태그를 붙인다. */
export type Timeline = {
  id: number
  title: string
  assignee: string | null
  /** timeline_statuses.key. 상태 태그를 떼면 null. */
  status: string | null
  /** 상태 태그의 표시값(조인). 태그가 없거나 지워졌으면 null. */
  status_label: string | null
  status_color: EventColor | null
  status_is_done: boolean
  /** 담당자 색 */
  color: EventColor
  done: boolean
  /** 완료 태그가 붙은 시각. 다음 날부터 목록에서 빠진다. */
  done_at: string | null
  created_by: string | null
}

/** 자주 쓰는 말 카드. 복사해서 쓴다. */
export type QuickPhrase = {
  id: number
  label: string | null
  body: string
  created_by: string | null
  created_at: string
}

export type AdminProfile = {
  name: string
  avatar_url: string | null
  /** 직급. 예: 대표, 디자인 리드 */
  position: string | null
}

export type PresenceUser = {
  name: string
  avatar_url: string | null
  position: string | null
  online: boolean
  typing: boolean
  /** 지금 입력 중인 일정 id */
  typing_on: number | null
}

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export const MEAL_SLOT: Record<MealSlot, { label: string; chip: string; dot: string }> = {
  breakfast: { label: '아침', chip: 'bg-amber-50 text-amber-700', dot: 'bg-amber-400' },
  lunch: { label: '점심', chip: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  dinner: { label: '저녁', chip: 'bg-indigo-50 text-indigo-700', dot: 'bg-indigo-500' },
  snack: { label: '간식', chip: 'bg-pink-50 text-pink-700', dot: 'bg-pink-400' },
}

export type MealEntry = {
  id: number
  meal_date: string
  slot: MealSlot
  title: string
  memo: string | null
  image_url: string | null
  kcal: number | null
  created_by: string | null
}

/** 첨부 디자인처럼 옅은 파스텔 칩. 배경/글자색을 한 쌍으로 묶어둔다. */
export const EVENT_COLOR: Record<EventColor, { chip: string; dot: string; label: string }> = {
  blue: { chip: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500', label: '파랑' },
  green: { chip: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500', label: '초록' },
  red: { chip: 'bg-red-50 text-red-600', dot: 'bg-red-500', label: '빨강' },
  amber: { chip: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500', label: '주황' },
  purple: { chip: 'bg-violet-50 text-violet-700', dot: 'bg-violet-500', label: '보라' },
  gray: { chip: 'bg-zinc-100 text-zinc-600', dot: 'bg-zinc-400', label: '회색' },
}

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  planning: '기획',
  in_progress: '진행중',
  review: '검수',
  done: '완료',
  paused: '보류',
}

/** 계정 페이지의 + 에서 고르는 간단한 종류 */
export const ACCOUNT_KINDS = ['google', 'apple', 'naver', 'biznum', 'card', 'etc'] as const

export const CATEGORY_LABEL: Record<string, string> = {
  google: '구글계정',
  apple: '애플계정',
  naver: '네이버계정',
  biznum: '사업자 등록번호',
  card: '신용카드',
  // 예전 데이터가 쓰던 종류들
  google_play: 'Google Play Console',
  apple_developer: 'Apple Developer',
  firebase: 'Firebase',
  aws: 'AWS',
  vercel: 'Vercel',
  supabase: 'Supabase',
  domain: '도메인 / 호스팅',
  business: '사업자 / 세무',
  etc: '기타',
}

/** 메디니티(치과 홈페이지) 견적 요청 접수. 공개 /medinity 페이지에서 제출된다. */
/** 개발의뢰 시 받는 병원 정보(계정·카드·사업자). 관리자 화면에서만 열람한다. */
export type MedinityDevInfo = {
  googleId?: string
  googlePw?: string
  naverId?: string
  naverPw?: string
  cardNumber?: string
  cardExpiry?: string
  cardCvc?: string
  bizNumber?: string
  address?: string
  ceo?: string
}

export type MedinityQuote = {
  id: number
  title: string | null
  clinic_name: string | null
  contact_name: string | null
  phone: string | null
  email: string | null
  memo: string | null
  reference_url: string | null
  selections: { label: string; price: number }[]
  subtotal: number
  total: number
  status: string
  /** 홈 요청관리 단계: inquiry(견적문의) · requested(개발의뢰) · done(개발완료) */
  req_status: string | null
  dev: MedinityDevInfo | null
  created_at: string
}

/** 설정에서 관리하는 계정 종류. + 계정 추가의 종류 드롭다운에 나온다. */
export type AccountCategory = {
  id: number
  key: string
  label: string
  position: number
}

/**
 * 계정 목록 표시·수정용. 비밀번호는 복호화한 원문을 함께 내려준다.
 * (관리자 인증으로 가려진 내부 화면에서만 쓴다)
 */
export type AccountView = {
  id: number
  client_id: number
  category: string
  label: string
  username: string | null
  password: string | null
}
