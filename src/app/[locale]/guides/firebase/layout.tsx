import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Firebase / Google Cloud 프로젝트 셋업 가이드',
  description: 'FCM 푸시·Authentication·Firestore·Analytics 등 Firebase 기능 셋업 가이드. GCP 프로젝트 생성부터 iOS/Android 앱 등록, APNs 키 업로드, 서비스 계정 발급까지.',
  keywords: ['Firebase', 'GCP', 'Google Cloud', 'FCM', 'Firestore', 'Firebase Auth', 'APNs 키', 'google-services.json', 'GoogleService-Info.plist'],
  alternates: { canonical: 'https://jaicylab.com/guides/firebase' },
  openGraph: { title: 'Firebase / GCP 가이드 | 제이씨랩', description: 'Firebase 프로젝트 생성부터 iOS/Android SDK·푸시·DB 셋업까지.', url: 'https://jaicylab.com/guides/firebase', type: 'article' },
}

export default function Layout({ children }: { children: React.ReactNode }) { return children }
