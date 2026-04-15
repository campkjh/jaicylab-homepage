import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AWS 계정 생성 & 초기 셋업 가이드',
  description: 'AWS 계정 생성 가이드. 루트 계정 보호, IAM 사용자 MFA 설정, 액세스 키 발급, 예산 알림, 서울 리전 선택까지 실수 없이 시작하는 8단계.',
  keywords: ['AWS', 'AWS 계정 생성', 'IAM', 'MFA', '액세스 키', 'AWS 프리티어', '서울 리전', 'ap-northeast-2', 'AWS 초기 셋업'],
  alternates: { canonical: 'https://jaicylab.com/guides/aws' },
  openGraph: { title: 'AWS 계정 생성 가이드 | 제이씨랩', description: 'AWS 루트 계정 보호부터 IAM·예산 알림·리전 설정까지 초기 셋업 8단계.', url: 'https://jaicylab.com/guides/aws', type: 'article' },
}

export default function Layout({ children }: { children: React.ReactNode }) { return children }
