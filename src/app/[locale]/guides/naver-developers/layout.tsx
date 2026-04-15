import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Naver Developers 애플리케이션 등록 가이드',
  description: '네이버 로그인·검색·Papago 번역·Clova 등 네이버 오픈 API를 사용하기 위한 Naver Developers 앱 등록 가이드. Client ID/Secret 발급, 플랫폼 등록, 검수 절차까지.',
  keywords: ['Naver Developers', '네이버 개발자', '네이버 로그인', '네이버 검색 API', 'Papago', 'Client ID', 'Naver OAuth'],
  alternates: { canonical: 'https://jaicylab.com/guides/naver-developers' },
  openGraph: { title: 'Naver Developers 가이드 | 제이씨랩', description: '네이버 로그인·검색·번역 API 사용을 위한 애플리케이션 등록 가이드.', url: 'https://jaicylab.com/guides/naver-developers', type: 'article' },
}

export default function Layout({ children }: { children: React.ReactNode }) { return children }
