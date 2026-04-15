import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '회사소개',
  description: '제이씨랩은 기획부터 출시·운영까지 한 팀이 책임지는 앱 개발 스튜디오입니다. iOS · Android · React Native · Flutter · Next.js · AI 통합 등 전 스택을 다룹니다.',
  keywords: ['제이씨랩 소개', '앱 개발 회사', '앱 개발 스튜디오', '회사소개', '연혁', '기술 스택', '서비스', '비전'],
  alternates: { canonical: 'https://jaicylab.com/about' },
  openGraph: {
    title: '회사소개 | 제이씨랩',
    description: '제이씨랩은 기획부터 출시·운영까지 한 팀이 책임지는 앱 개발 스튜디오입니다.',
    url: 'https://jaicylab.com/about',
    type: 'website',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
