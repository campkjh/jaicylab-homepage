'use client'

import { GuideTemplate } from '@/components/GuideTemplate'
import { Database, User, Key, Shield, Users, HardDrive, Zap, Settings } from 'lucide-react'

export default function SupabaseGuidePage() {
  return (
    <GuideTemplate
      badge={{ icon: <Database className="h-3.5 w-3.5 text-white/80" />, text: 'SUPABASE' }}
      titleTop="Supabase"
      titleBottom="프로젝트 생성 & 키 셋업"
      description={`오픈소스 Firebase 대안 Supabase로 빠르게 백엔드를 띄우는 가이드입니다.\nPostgreSQL·Auth·Storage·Realtime·Edge Functions를 한 번에 구성합니다.`}
      primaryCta={{ label: 'Supabase 대시보드 열기', href: 'https://supabase.com/dashboard' }}
      stats={[
        { label: '무료 플랜', value: '2개 프로젝트' },
        { label: '유료 전환', value: 'Pro $25/월~' },
        { label: '필요 정보', value: 'GitHub 계정 권장' },
      ]}
      overviewTitle="시작 전에 확인하세요"
      overviewDesc="Supabase 무료 플랜은 프로젝트가 1주일 비활성 시 일시 정지됩니다. 프로덕션 서비스는 Pro 플랜($25/월~)으로 전환해야 안정적입니다. Row Level Security(RLS)를 반드시 켜두고 시작하세요 — 기본 비활성이면 모든 데이터가 공개됩니다."
      overviewItems={[
        { icon: <User className="h-5 w-5" />, title: 'GitHub 계정', desc: 'Supabase는 GitHub OAuth 기반.' },
        { icon: <Settings className="h-5 w-5" />, title: '리전 선택', desc: '한국은 Tokyo(ap-northeast-1).' },
        { icon: <Shield className="h-5 w-5" />, title: 'RLS 정책 설계', desc: 'Row Level Security 기본 비활성.' },
        { icon: <Key className="h-5 w-5" />, title: '두 종류의 키 구분', desc: 'anon vs service_role.' },
      ]}
      steps={[
        { no: '01', title: '계정 가입 & 조직 생성', tag: 'SIGNUP', icon: <User className="h-5 w-5" />, desc: 'supabase.com에서 GitHub으로 가입.', details: [
          'Sign in with GitHub 권장 (이메일도 가능)',
          '조직(Organization) 자동 생성 — 팀 단위로 프로젝트 묶음',
          '팀원 초대는 조직 단위로 관리',
          '무료 플랜: 조직당 프로젝트 2개 제한',
        ] },
        { no: '02', title: '새 프로젝트 생성', tag: 'PROJECT', icon: <Database className="h-5 w-5" />, desc: '데이터베이스와 리전을 결정합니다.', details: [
          'New Project 클릭',
          '프로젝트 이름 (URL 슬러그로 사용됨)',
          'Database Password 생성 (강력한 비밀번호, 안전 보관)',
          'Region: Northeast Asia (Tokyo)가 한국에서 가장 빠름',
          'Pricing Plan: Free / Pro / Team',
          '프로비저닝 2~3분 소요',
        ] },
        { no: '03', title: 'API 키 확인', tag: 'KEYS', icon: <Key className="h-5 w-5" />, desc: '두 가지 키의 역할을 명확히 이해하세요.', details: [
          'Settings > API 메뉴',
          'Project URL: https://${id}.supabase.co',
          'anon public key: 프론트엔드에서 사용 가능, RLS로 보호됨',
          'service_role key: 서버 전용, RLS 우회 · 절대 노출 금지',
          'JWT Secret: 커스텀 토큰 발급 시 사용',
          '.env.local에 NEXT_PUBLIC_SUPABASE_URL / ANON_KEY 저장',
        ] },
        { no: '04', title: 'Authentication 설정', tag: 'AUTH', icon: <Shield className="h-5 w-5" />, desc: '로그인 방식을 활성화합니다.', details: [
          'Authentication > Providers 메뉴',
          'Email (기본 활성), Phone, Google, Apple, Kakao 등',
          '각 OAuth 공급자는 별도 설정 필요 (Client ID/Secret)',
          'Redirect URL: https://${id}.supabase.co/auth/v1/callback',
          'Email Templates 한국어로 커스터마이징',
          'Rate Limits 확인 (무료 플랜은 시간당 제한)',
        ] },
        { no: '05', title: '테이블 생성 & RLS 정책', tag: 'DATABASE', icon: <Database className="h-5 w-5" />, desc: 'Postgres 테이블을 만들고 보안 정책을 설정.', details: [
          'Table Editor로 GUI 생성 또는 SQL Editor에서 DDL 실행',
          '신규 테이블은 반드시 Enable RLS 체크',
          'RLS 정책 예: "auth.uid() = user_id" (본인만 조회)',
          'Realtime 활성화 — INSERT/UPDATE/DELETE 이벤트 구독',
          'Foreign Key 관계 설정 (auth.users와 연결 권장)',
        ] },
        { no: '06', title: 'Storage 버킷 설정', tag: 'STORAGE', icon: <HardDrive className="h-5 w-5" />, desc: '파일 업로드를 위한 버킷 생성.', details: [
          'Storage > New Bucket',
          'Public / Private 선택',
          'Public: 누구나 URL로 접근, 프로필 이미지 등에 적합',
          'Private: 인증된 사용자만, signed URL로 접근',
          'RLS 정책으로 업로드·다운로드 권한 제어',
          '이미지 변환 기능(image transformation)은 Pro 플랜',
        ] },
        { no: '07', title: 'Edge Functions 배포', tag: 'FUNCTIONS', icon: <Zap className="h-5 w-5" />, desc: '서버리스 함수로 커스텀 API 구현.', details: [
          'Deno 런타임 기반, TypeScript 지원',
          'supabase init → supabase functions new my-func',
          'supabase functions deploy my-func',
          '외부 API 호출·복잡한 로직·웹훅 처리에 유용',
          '환경변수는 supabase secrets set 명령',
          '무료 플랜 한도: 500K invocations/월',
        ] },
        { no: '08', title: '팀 초대 & 백업', tag: 'OPS', icon: <Users className="h-5 w-5" />, desc: '운영 필수 설정.', details: [
          'Organization Settings > Team에서 멤버 초대',
          '역할: Owner / Developer (세부 권한은 Pro 이상)',
          'Database > Backups: 일일 자동 백업',
          'Free 플랜은 7일 보관, Pro는 30일',
          'Point-in-time Recovery는 Team 플랜 이상',
          'Disable Postgres upgrades 비활성 권장',
        ] },
      ]}
      pitfalls={[
        { title: 'RLS 비활성 상태로 배포', desc: 'Row Level Security가 꺼져 있으면 anon 키로 모든 테이블 조회/수정이 가능합니다. 데이터 유출 사고 1순위.' },
        { title: 'service_role 키 프론트 노출', desc: 'service_role은 RLS를 우회하는 관리자 키입니다. NEXT_PUBLIC_ 접두사를 절대 붙이면 안 됩니다.' },
        { title: '무료 플랜 자동 일시정지', desc: '1주일 비활성 시 프로젝트가 paused 상태로 전환되어 API가 404를 반환합니다. 프로덕션은 Pro 필수.' },
        { title: '리전 변경 불가', desc: '프로젝트 생성 시 리전은 변경 불가. 잘못 선택하면 새 프로젝트 만들고 마이그레이션해야 합니다.' },
        { title: 'Database Password 분실', desc: '복구 불가능합니다. 반드시 비밀번호 관리자에 저장. 잃으면 새 프로젝트를 만들어야 합니다.' },
      ]}
      resources={[
        { title: 'Supabase Dashboard', desc: '프로젝트 관리', href: 'https://supabase.com/dashboard' },
        { title: 'Pricing', desc: '요금제 비교', href: 'https://supabase.com/pricing' },
        { title: 'Auth 문서', desc: '로그인 구현 가이드', href: 'https://supabase.com/docs/guides/auth' },
        { title: 'Row Level Security', desc: 'RLS 정책 작성법', href: 'https://supabase.com/docs/guides/auth/row-level-security' },
        { title: 'JavaScript 클라이언트', desc: '@supabase/supabase-js', href: 'https://supabase.com/docs/reference/javascript/introduction' },
        { title: 'Edge Functions', desc: 'Deno 서버리스', href: 'https://supabase.com/docs/guides/functions' },
      ]}
    />
  )
}
