import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '토스페이먼츠 가맹점 계약 & 연동 가이드',
  description: '앱·웹 결제를 위한 토스페이먼츠 PG 가맹점 계약 가이드. 테스트 키 연동부터 가맹점 신청, 심사, 실서비스 키 발급, 웹훅·정산 자동화까지.',
  keywords: ['토스페이먼츠', 'Toss Payments', 'PG 연동', '가맹점 계약', '결제 연동', '웹훅', '카드결제', '간편결제 연동'],
  alternates: { canonical: 'https://jaicylab.com/guides/toss-payments' },
  openGraph: { title: '토스페이먼츠 가이드 | 제이씨랩', description: 'PG 가맹점 계약부터 결제 연동·웹훅·정산까지 8단계 가이드.', url: 'https://jaicylab.com/guides/toss-payments', type: 'article' },
}

export default function Layout({ children }: { children: React.ReactNode }) { return children }
