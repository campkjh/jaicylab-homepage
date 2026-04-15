import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Supabase 프로젝트 생성 & 키 셋업 가이드',
  description: '오픈소스 Firebase 대안 Supabase 프로젝트 생성 가이드. PostgreSQL·Auth·Storage·Realtime·Edge Functions 셋업, RLS 정책, 키 관리까지.',
  keywords: ['Supabase', '수파베이스', 'PostgreSQL', 'Firebase 대안', 'Row Level Security', 'RLS', 'Edge Functions', 'Supabase Auth'],
  alternates: { canonical: 'https://jaicylab.com/guides/supabase' },
  openGraph: { title: 'Supabase 셋업 가이드 | 제이씨랩', description: 'Supabase 프로젝트 생성부터 DB·Auth·Storage·RLS까지 8단계.', url: 'https://jaicylab.com/guides/supabase', type: 'article' },
}

export default function Layout({ children }: { children: React.ReactNode }) { return children }
