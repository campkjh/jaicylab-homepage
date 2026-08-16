import type { MedinityQuote } from '@/lib/types'

/**
 * 치과 홈페이지 템플릿(A안)에 주입하는 사이트 설정.
 * 접수된 견적(MedinityQuote)에서 buildSiteConfig 로 뽑아내며,
 * 병원이 실제 콘텐츠를 주면 이 값들만 채워 넣으면 된다.
 * 디자인 톤 = 연세볼트치과(네이비·미니멀·풀블리드 히어로·하단 고정 상담바).
 */
export type ClinicSiteConfig = {
  id: number
  name: string
  nameEn: string
  slogan: string
  tagline: string
  brandColor: string
  address: string
  ceo: string
  phone: string
  bizNumber: string
  /** 페이지 규모: 원페이지 / 다중 / 프리미엄 */
  scale: 'single' | 'multi' | 'premium'
  features: {
    naverMap: boolean
    naverReserve: boolean
    kakao: boolean
    admin: boolean
  }
  about: string
  departments: { kicker: string; name: string; subtitle: string; desc: string; tags: string[] }[]
  hours: { day: string; time: string }[]
  hoursNote: string
}

const DEFAULT_DEPARTMENTS: ClinicSiteConfig['departments'] = [
  {
    kicker: '회복',
    name: '임플란트',
    subtitle: '맛있는 음식을 즐기는 행복, 다시 시작됩니다.',
    desc: '구강 상태와 잇몸뼈를 확인한 뒤 필요한 임플란트 치료계획을 안내합니다. 뼈이식 또는 진정 적용 가능 여부는 진료 후 상담합니다.',
    tags: ['디지털 가이드', '원데이 즉시식립', '뼈이식', '전체 임플란트', '임플란트 틀니'],
  },
  {
    kicker: '설계',
    name: '심미치료',
    subtitle: '치료를 넘어 미소의 가치를 디자인합니다.',
    desc: '치아의 형태와 색상, 현재 구강 상태를 확인한 뒤 라미네이트와 치아미백 등 심미치료 방법을 상담합니다.',
    tags: ['무삭제 라미네이트', '치아미백', '3D 디지털 스마일 디자인'],
  },
  {
    kicker: '교정',
    name: '치아교정',
    subtitle: '가지런한 미소를, 라이프스타일에 맞춰서.',
    desc: '성장·생활 습관과 구강 상태를 함께 확인한 뒤 투명교정·설측교정 등 적합한 교정 방식을 안내합니다.',
    tags: ['투명교정', '설측교정', '부분교정'],
  },
  {
    kicker: '보존',
    name: '일반진료',
    subtitle: '꼭 필요한 진료만, 내 가족을 진료하는 마음으로.',
    desc: '충치·신경치료부터 잇몸치료, 사랑니 발치, 정기 스케일링까지 자연치아를 오래 보존하는 진료를 우선합니다.',
    tags: ['충치치료', '신경치료', '잇몸치료', '사랑니 발치', '스케일링'],
  },
]

const DEFAULT_HOURS: ClinicSiteConfig['hours'] = [
  { day: '월 · 수 · 금', time: '09:30 – 20:00' },
  { day: '화 · 목', time: '09:30 – 18:30' },
  { day: '토요일', time: '09:30 – 14:00' },
  { day: '점심시간', time: '13:00 – 14:00' },
]

function has(labels: string[], kw: string) {
  return labels.some(l => l.includes(kw))
}

/** 접수 건 → 사이트 설정. 없는 값은 치과 기본값으로 채운다. */
export function buildSiteConfig(quote: MedinityQuote): ClinicSiteConfig {
  const labels = (quote.selections ?? []).map(s => s.label)
  const scale: ClinicSiteConfig['scale'] = has(labels, '프리미엄')
    ? 'premium'
    : has(labels, '다중')
      ? 'multi'
      : 'single'

  const dev = quote.dev ?? {}
  const name = (quote.title || quote.clinic_name || '우리치과').trim()

  return {
    id: quote.id,
    name,
    nameEn: 'DENTAL CLINIC',
    slogan: '꼭 필요한 치료를,\n정직한 기준으로.',
    tagline: '환자 한 분 한 분을 정성으로, 정직한 진료를 약속합니다.',
    brandColor: '#2E3A5C',
    address: (dev.address || '').trim(),
    ceo: (dev.ceo || '').trim(),
    phone: (quote.phone || '').trim(),
    bizNumber: (dev.bizNumber || '').trim(),
    scale,
    features: {
      naverMap: has(labels, '네이버 지도'),
      naverReserve: has(labels, '네이버 예약') || has(labels, '예약'),
      kakao: has(labels, '카카오'),
      admin: has(labels, '어드민'),
    },
    about:
      `${name}는 과잉진료 없이 꼭 필요한 치료만 권해 드립니다. ` +
      `첨단 장비와 체계적인 감염관리, 그리고 충분한 상담으로 ` +
      `처음 오신 분도 편안하게 진료받으실 수 있도록 하겠습니다.`,
    departments: DEFAULT_DEPARTMENTS,
    hours: DEFAULT_HOURS,
    hoursNote: '접수 마감은 진료 종료 30분 전입니다. 일요일 및 공휴일은 휴진입니다.',
  }
}

/** 주소로 구글 지도 임베드 URL (API 키 불필요). 네이버 지도 선택이어도 미리보기는 구글 임베드로 표시. */
export function mapEmbedUrl(address: string) {
  const q = encodeURIComponent(address || '대한민국')
  return `https://maps.google.com/maps?q=${q}&t=&z=16&ie=UTF8&iwloc=&output=embed`
}
