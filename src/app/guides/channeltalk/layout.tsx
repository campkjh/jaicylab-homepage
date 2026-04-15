import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '채널톡(ChannelTalk) 연동 가이드',
  description: '국내 대표 고객 상담 툴 채널톡 연동 가이드. 채널 개설, 웹/앱 SDK 설치, 유저 식별(memberHash), 웹훅·Open API 자동화까지.',
  keywords: ['채널톡', 'ChannelTalk', '고객센터 챗', '라이브 채팅', 'CS 솔루션', 'ChannelIO', 'memberHash', '웹훅'],
  alternates: { canonical: 'https://jaicylab.com/guides/channeltalk' },
  openGraph: { title: '채널톡 연동 가이드 | 제이씨랩', description: '채널 개설부터 웹/앱 SDK·유저 식별·웹훅까지 8단계.', url: 'https://jaicylab.com/guides/channeltalk', type: 'article' },
}

export default function Layout({ children }: { children: React.ReactNode }) { return children }
