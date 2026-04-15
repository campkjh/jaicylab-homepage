import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개발자 계정 · API 키 가이드 모음',
  description: '앱 개발에 필요한 각종 개발자 계정·API 키 발급 가이드. Apple Developer, Google Play Console, Kakao Developers, Naver Developers, Firebase, Naver Cloud Platform, 토스페이먼츠까지.',
  keywords: ['개발자 계정', 'API 키', 'Apple Developer', 'Google Play', 'Kakao Developers', 'Naver Developers', 'Firebase', 'Naver Cloud', '토스페이먼츠', '앱 개발 가이드'],
  alternates: { canonical: 'https://jaicylab.com/guides' },
  openGraph: { title: '개발자 계정·API 키 가이드 모음 | 제이씨랩', description: '앱 개발에 필요한 모든 계정·키 발급 절차를 한곳에 정리했습니다.', url: 'https://jaicylab.com/guides', type: 'website' },
}

export default function Layout({ children }: { children: React.ReactNode }) { return children }
