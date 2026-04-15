import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Naver Cloud Platform 계정 생성 & 인증 키 발급 가이드',
  description: '네이버 지도·CLOVA OCR·SENS SMS 등 NCP 상품 사용을 위한 계정 생성 가이드. 회원가입, 결제 수단, Access Key 발급, Maps/SENS/CLOVA 상품별 이용 신청 절차.',
  keywords: ['Naver Cloud Platform', 'NCP', '네이버 클라우드', '네이버 지도 API', 'CLOVA OCR', 'SENS SMS', 'Access Key', '네이버 클라우드 가입'],
  alternates: { canonical: 'https://jaicylab.com/guides/naver-cloud' },
  openGraph: { title: 'Naver Cloud Platform 가이드 | 제이씨랩', description: 'NCP 계정 생성부터 지도·SMS·CLOVA 상품 이용 신청, 인증 키 발급까지.', url: 'https://jaicylab.com/guides/naver-cloud', type: 'article' },
}

export default function Layout({ children }: { children: React.ReactNode }) { return children }
