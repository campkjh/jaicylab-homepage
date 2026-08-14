// 메디니티(치과 홈페이지 의뢰) 전용 견적 카탈로그.
// 가격은 원(KRW) 단위의 임시값이며, 여기 숫자만 고치면 견적 페이지에 바로 반영된다.

export type MedinityChoice = {
  id: string
  name: string
  desc?: string
  price: number
  /** 페이지당 단가(커스텀 모션 등). 지정되면 price 대신 (perPage × 총 페이지 수)로 계산한다. */
  perPage?: number
  /** 이 기본 패키지가 포함하는 페이지 수 (총 페이지 수 계산에 쓰인다) */
  pages?: number
  /** 부모 옵션이 켜졌을 때만 고를 수 있는 하위 옵션 (예: 예약 알림 개발 → 알림 채널) */
  children?: MedinityChoice[]
  /** 이 옵션을 고르면 무료로 기본 포함되는 다른 옵션 id */
  includes?: string[]
}

export type MedinityStepper = {
  id: string
  name: string
  desc?: string
  unitPrice: number
  unit: string
  min: number
  max: number
  default: number
  /** 이 수량까지는 무료. 초과분만 unitPrice 로 과금한다. (예: 수정 3회까지 무료) */
  freeUnits?: number
}

export type MedinitySection = {
  id: string
  title: string
  desc?: string
  /** 인라인 아이콘 키 (MedinityQuoteBuilder 의 ICONS 와 매칭) */
  icon: string
  mode: 'single' | 'multi' | 'stepper'
  /** single 에서만: 반드시 하나 선택. 기본값은 choices[0]. */
  required?: boolean
  choices?: MedinityChoice[]
  stepper?: MedinityStepper
}

/** 상급(커스텀 모션) 인터랙션의 페이지당 단가. TODO: 실제 단가 확정 필요. */
export const INTER_HIGH_PER_PAGE = 100_000

export const MEDINITY_SECTIONS: MedinitySection[] = [
  {
    id: 'base',
    title: '기본 패키지',
    desc: '홈페이지의 큰 골격을 고릅니다. (필수)',
    icon: 'layout',
    mode: 'single',
    required: true,
    choices: [
      { id: 'base-onepage', name: '원페이지형', desc: '핵심 정보를 한 페이지에 스크롤로 담는 구성', price: 400_000, pages: 1 },
      { id: 'base-multi', name: '다중 페이지형', desc: '메인·병원소개·진료안내·오시는길 등 기본 5페이지', price: 1_000_000, pages: 5 },
      { id: 'base-premium', name: '프리미엄형', desc: '맞춤 디자인 + 진료과목별 상세 · 기본 10페이지 포함', price: 2_600_000, pages: 10 },
    ],
  },
  {
    id: 'pages',
    title: '추가 페이지',
    desc: '기본 구성 외에 더 필요한 페이지 수를 정합니다.',
    icon: 'file',
    mode: 'stepper',
    stepper: { id: 'extra-page', name: '추가 페이지', desc: '페이지당', unitPrice: 120_000, unit: '페이지', min: 0, max: 20, default: 0 },
  },
  {
    id: 'interaction',
    title: '인터랙션 / 모션',
    desc: '페이지가 움직이고 반응하는 정도를 고릅니다. (필수)',
    icon: 'sparkles',
    mode: 'single',
    required: true,
    choices: [
      { id: 'inter-low', name: '하 · 기본', desc: '페이드·호버 등 은은한 기본 효과 (기본 포함)', price: 0 },
      { id: 'inter-mid', name: '중 · 전 페이지 모션', desc: '전 페이지에 스크롤·등장 모션 적용', price: 200_000 },
      { id: 'inter-high', name: '상 · 커스텀 모션', desc: '페이지 수에 따라 조정 (페이지당 10만원)', price: 0, perPage: INTER_HIGH_PER_PAGE },
    ],
  },
  {
    id: 'admin',
    title: '관리자 페이지 (어드민)',
    desc: '병원이 직접 콘텐츠를 수정·관리하는 관리자 화면입니다.',
    icon: 'admin',
    mode: 'single',
    choices: [
      { id: 'admin-none', name: '미포함', desc: '관리자 페이지 없이 제작만', price: 0 },
      { id: 'admin-low', name: '하 · 기본 관리', desc: '고객관리·로그인, SNS 딥링크 추가, 오픈 배너 변경', price: 200_000 },
      { id: 'admin-mid', name: '중 · 콘텐츠 관리', desc: '의료진 추가, 배너 딥링크, 이벤트 페이지 추가', price: 800_000 },
      { id: 'admin-high', name: '상 · 풀 관리자', desc: '모든 페이지 동적 관리·페이지 추가, 동적 세팅·빌드 개발', price: 2_000_000 },
    ],
  },
  {
    id: 'integration',
    title: '연동',
    desc: '외부 서비스와 연결합니다. 필요한 항목만 담으세요.',
    icon: 'link',
    mode: 'multi',
    choices: [
      { id: 'int-navermap', name: '네이버 지도 연동', desc: '오시는 길 지도 임베드', price: 100_000 },
      {
        id: 'int-booking',
        name: '예약 알림 개발',
        desc: '기본 0원 · 아래 알림 채널을 고른 만큼 견적이 올라갑니다.',
        price: 0,
        children: [
          { id: 'ba-sheet', name: '구글 스프레드시트 기록', desc: '예약 내역 자동 적재', price: 100_000 },
          { id: 'ba-gmailzapier', name: '지메일 + 자피어 연동 알림', desc: '이메일·자동화 알림', price: 100_000 },
          { id: 'ba-channeltalk', name: '채널톡 연동 상담 버튼 제작', desc: '상담 버튼 + 채널톡 연동', price: 100_000 },
        ],
      },
    ],
  },
  {
    id: 'ops',
    title: '부가 / 운영',
    desc: '출시 이후 운영에 필요한 항목입니다.',
    icon: 'shield',
    mode: 'multi',
    choices: [
      { id: 'op-seo', name: 'SEO 기본 세팅', desc: '메타 태그·검색엔진 등록', price: 250_000 },
      { id: 'op-searchadvisor', name: '네이버 서치어드바이저 작업', desc: '네이버 웹마스터도구 등록·최적화', price: 100_000 },
      { id: 'op-domain', name: '도메인 · 호스팅 1년', desc: '도메인 연결 + SSL 포함', price: 200_000 },
      { id: 'op-review', name: '의료광고 사전심의 대응', desc: '심의 필요 문구 정리·대응', price: 300_000 },
      { id: 'op-maintain', name: '6개월 유지보수', desc: '출시 후 수정·장애 대응', price: 600_000 },
    ],
  },
  {
    id: 'revision',
    title: '수정 횟수',
    desc: '납품 후 보완 수정 횟수입니다. 3회까지 무료, 4회차부터 회당 10만원.',
    icon: 'revise',
    mode: 'stepper',
    stepper: { id: 'revision-count', name: '수정 횟수', desc: '3회까지 무료', unitPrice: 100_000, unit: '회', min: 0, max: 12, default: 0, freeUnits: 3 },
  },
]

/** 모든 옵션(하위 포함)을 id 로 찾기 위한 인덱스. */
export const MEDINITY_CHOICE_INDEX: Record<string, MedinityChoice & { sectionId: string; parentId?: string }> = {}
for (const section of MEDINITY_SECTIONS) {
  for (const choice of section.choices ?? []) {
    MEDINITY_CHOICE_INDEX[choice.id] = { ...choice, sectionId: section.id }
    for (const child of choice.children ?? []) {
      MEDINITY_CHOICE_INDEX[child.id] = { ...child, sectionId: section.id, parentId: choice.id }
    }
  }
}

/** 선택된 기본 패키지 + 추가 페이지로 총 페이지 수를 구한다. */
export function totalPageCount(selectedIds: Iterable<string>, extraPages: number): number {
  let base = 0
  for (const id of selectedIds) {
    const c = MEDINITY_CHOICE_INDEX[id]
    if (c?.pages) base += c.pages
  }
  return base + Math.max(0, Math.floor(extraPages || 0))
}

/** 옵션의 실제 단가. perPage 가 있으면 페이지 수에 따라 계산한다. */
export function priceOfChoice(choice: { price: number; perPage?: number }, totalPages: number): number {
  return choice.perPage != null ? choice.perPage * totalPages : choice.price
}

/** 스텝퍼 금액. freeUnits 까지는 무료, 초과분만 과금한다. */
export function stepperPrice(st: { unitPrice: number; freeUnits?: number }, qty: number): number {
  return st.unitPrice * Math.max(0, Math.floor(qty || 0) - (st.freeUnits ?? 0))
}

/** 선택된 옵션들이 무료로 기본 포함하는 다른 옵션 id 집합. */
export function includedChoiceIds(selectedIds: Iterable<string>): Set<string> {
  const inc = new Set<string>()
  for (const id of selectedIds) {
    MEDINITY_CHOICE_INDEX[id]?.includes?.forEach(x => inc.add(x))
  }
  return inc
}

export const VAT_RATE = 0.1

export function formatWon(won: number): string {
  return `${Math.round(won).toLocaleString('ko-KR')}원`
}
