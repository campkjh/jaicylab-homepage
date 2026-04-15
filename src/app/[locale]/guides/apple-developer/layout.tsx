import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Apple Developer 계정 생성하기 · 완벽 가이드',
  description: '개인·법인 구분부터 DUNS 번호, 연회비 $99 결제, 심사 대기, App Store Connect 셋업까지 8단계로 정리한 Apple Developer Program 가입 가이드.',
  keywords: ['Apple Developer Program', '애플 개발자 계정', '앱스토어 등록', 'DUNS 번호', 'Apple Enrollment', 'App Store Connect', 'iOS 앱 출시', '앱스토어 심사'],
  alternates: { canonical: 'https://jaicylab.com/guides/apple-developer' },
  openGraph: {
    title: 'Apple Developer 계정 생성하기 | 제이씨랩',
    description: 'iOS 앱을 App Store에 출시하기 위한 Apple Developer Program 등록 8단계 가이드.',
    url: 'https://jaicylab.com/guides/apple-developer',
    type: 'article',
  },
}

export default function AppleDeveloperGuideLayout({ children }: { children: React.ReactNode }) {
  return children
}
