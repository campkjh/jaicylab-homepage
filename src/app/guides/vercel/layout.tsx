import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vercel 배포 & 도메인 연결 가이드',
  description: 'Next.js를 만든 Vercel 배포 가이드. GitHub 연동, 환경변수, 커스텀 도메인 DNS 설정, Preview 배포, Serverless/Edge Functions, 분석까지.',
  keywords: ['Vercel', '버셀 배포', 'Next.js 배포', '도메인 연결', 'Edge Functions', 'Serverless', 'Vercel 환경변수', 'DNS 설정'],
  alternates: { canonical: 'https://jaicylab.com/guides/vercel' },
  openGraph: { title: 'Vercel 배포 가이드 | 제이씨랩', description: 'Git 연동부터 도메인·환경변수·Functions까지 8단계.', url: 'https://jaicylab.com/guides/vercel', type: 'article' },
}

export default function Layout({ children }: { children: React.ReactNode }) { return children }
