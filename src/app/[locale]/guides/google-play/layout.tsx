import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Google Play Console 개발자 계정 만들기',
  description: 'Android 앱을 Play 스토어에 출시하기 위한 Google Play Console 가입 가이드. 개인·법인, 신원 확인, $25 등록비, 결제 프로필 설정까지 8단계로 정리.',
  keywords: ['Google Play Console', '구글 플레이 콘솔', '안드로이드 앱 등록', 'Play 스토어 출시', '개발자 계정', 'Android 앱 출시', 'Play Billing'],
  alternates: { canonical: 'https://jaicylab.com/guides/google-play' },
  openGraph: { title: 'Google Play Console 가이드 | 제이씨랩', description: 'Android 앱 Play 스토어 출시를 위한 개발자 계정 만들기 8단계 가이드.', url: 'https://jaicylab.com/guides/google-play', type: 'article' },
}

export default function Layout({ children }: { children: React.ReactNode }) { return children }
