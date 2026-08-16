import type { MedinityQuote } from '@/lib/types'

/**
 * 치과 홈페이지 템플릿(A안)에 주입하는 사이트 설정.
 * 접수된 견적(MedinityQuote)에서 buildSiteConfig 로 뽑아내며,
 * 병원이 실제 콘텐츠를 주면 이 값들만 채워 넣으면 된다.
 */
export type ClinicSiteConfig = {
  id: number
  name: string
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
  departments: { name: string; desc: string; emoji: string }[]
  hours: { day: string; time: string }[]
}

const DEFAULT_DEPARTMENTS: ClinicSiteConfig['departments'] = [
  { name: '임플란트', desc: '정밀 진단으로 자연치아처럼 튼튼하게', emoji: '🦷' },
  { name: '치아교정', desc: '투명·설측 교정까지 라이프스타일에 맞춰', emoji: '😁' },
  { name: '심미치료', desc: '라미네이트·미백으로 자신 있는 미소', emoji: '✨' },
  { name: '충치·신경치료', desc: '통증은 줄이고 자연치아는 최대한 보존', emoji: '🩺' },
  { name: '잇몸치료', desc: '치주 관리로 오래 건강한 치아 유지', emoji: '🌿' },
  { name: '검진·예방', desc: '정기 스케일링과 맞춤 예방 관리', emoji: '🛡️' },
]

const DEFAULT_HOURS: ClinicSiteConfig['hours'] = [
  { day: '평일', time: '09:30 – 18:30' },
  { day: '야간진료 (목)', time: '09:30 – 20:30' },
  { day: '토요일', time: '09:30 – 14:00' },
  { day: '점심시간', time: '13:00 – 14:00' },
  { day: '일요일·공휴일', time: '휴진' },
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
    tagline: '환자 한 분 한 분을 정성으로, 정직한 진료를 약속합니다.',
    brandColor: '#12A594',
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
  }
}

/** 주소로 구글 지도 임베드 URL (API 키 불필요). 네이버 지도 선택이어도 미리보기는 구글 임베드로 표시. */
export function mapEmbedUrl(address: string) {
  const q = encodeURIComponent(address || '대한민국')
  return `https://maps.google.com/maps?q=${q}&t=&z=16&ie=UTF8&iwloc=&output=embed`
}
