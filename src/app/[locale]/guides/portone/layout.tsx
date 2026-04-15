import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '포트원(PortOne) 통합 PG 연동 가이드',
  description: '국내 여러 PG를 하나의 API로 연결하는 포트원(구 아임포트) 연동 가이드. 계정 가입, PG사 계약, 채널 등록, V2 API, 웹훅 서명 검증까지.',
  keywords: ['포트원', 'PortOne', '아임포트', 'iamport', 'PG 통합', '결제 연동', 'V2 API', '웹훅 서명', '카드결제'],
  alternates: { canonical: 'https://jaicylab.com/guides/portone' },
  openGraph: { title: '포트원 PG 연동 가이드 | 제이씨랩', description: '여러 PG를 하나의 API로. 계정 생성부터 V2 API·웹훅까지 8단계.', url: 'https://jaicylab.com/guides/portone', type: 'article' },
}

export default function Layout({ children }: { children: React.ReactNode }) { return children }
