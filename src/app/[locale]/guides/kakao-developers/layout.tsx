import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kakao Developers 앱 등록 & 키 발급 가이드',
  description: '카카오 로그인·지도·알림톡·공유하기 등 카카오 API를 사용하기 위한 Kakao Developers 앱 등록 가이드. 앱 생성부터 키 발급, 플랫폼 설정, 동의 항목 심사까지 정리.',
  keywords: ['Kakao Developers', '카카오 개발자', '카카오 로그인', '카카오맵', '카카오 API', '앱 키 발급', '알림톡', '카카오 공유하기'],
  alternates: { canonical: 'https://jaicylab.com/guides/kakao-developers' },
  openGraph: { title: 'Kakao Developers 가이드 | 제이씨랩', description: '카카오 로그인·지도·알림톡 등 카카오 API 사용을 위한 앱 등록 8단계 가이드.', url: 'https://jaicylab.com/guides/kakao-developers', type: 'article' },
}

export default function Layout({ children }: { children: React.ReactNode }) { return children }
