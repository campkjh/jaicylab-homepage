import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '자가견적 · 앱 개발 비용 계산기',
  description: '300여 개 세부 항목과 67개 패키지 프리셋(쇼핑몰·배달·커뮤니티·교육 등)으로 앱 개발 견적을 즉시 계산. 네이티브/크로스, 디자인 수준, 일정 보정, 부가세, 맨먼스, 투입 인력까지 실시간 제공.',
  keywords: ['앱 개발 견적', '앱개발 비용', '앱 제작 견적', '자가견적', '맨먼스', '투입 인력', '쇼핑몰 앱 견적', '배달앱 견적', '커뮤니티 앱 견적', 'MVP 견적'],
  alternates: { canonical: 'https://jaicylab.com/estimate' },
  openGraph: {
    title: '자가견적 · 앱 개발 비용 계산기 | 제이씨랩',
    description: '30초 만에 확인하는 앱 개발 견적. 300+ 항목, 67개 패키지 × 5단계 티어, 부가세·맨먼스·인력 구성 실시간 계산.',
    url: 'https://jaicylab.com/estimate',
    type: 'website',
  },
}

export default function EstimateLayout({ children }: { children: React.ReactNode }) {
  return children
}
