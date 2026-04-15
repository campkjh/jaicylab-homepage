'use client'

import { GuideTemplate } from '@/components/GuideTemplate'
import { Triangle, User, GitBranch, Globe, Key, Settings, Shield, Zap } from 'lucide-react'

export default function VercelGuidePage() {
  return (
    <GuideTemplate
      badge={{ icon: <Triangle className="h-3.5 w-3.5 text-white/80" />, text: 'VERCEL' }}
      titleTop="Vercel"
      titleBottom="배포 & 도메인 연결"
      description={`Next.js를 만든 Vercel로 프론트엔드를 배포하는 가이드입니다.\nGitHub 연동, 환경변수, 커스텀 도메인, Preview 배포, Functions까지 실무 중심으로 정리했습니다.`}
      primaryCta={{ label: 'Vercel 대시보드 열기', href: 'https://vercel.com/dashboard' }}
      stats={[
        { label: 'Hobby 플랜', value: '개인·비상업 무료' },
        { label: 'Pro 플랜', value: '$20/월/사용자' },
        { label: '필요 정보', value: 'GitHub 계정' },
      ]}
      overviewTitle="시작 전에 확인하세요"
      overviewDesc="Hobby 플랜은 상업적 용도 금지입니다. 회사 프로젝트는 Pro 이상을 사용해야 ToS 위반이 아닙니다. 커스텀 도메인 연결은 무료 플랜에서도 가능하지만, 팀 협업·분석·보안 기능은 Pro부터 제공됩니다."
      overviewItems={[
        { icon: <GitBranch className="h-5 w-5" />, title: 'GitHub 레포', desc: '배포할 프로젝트 저장소.' },
        { icon: <Globe className="h-5 w-5" />, title: '도메인 구매처', desc: '후이즈·가비아·Cloudflare 등.' },
        { icon: <Shield className="h-5 w-5" />, title: '환경변수 분리', desc: '.env.local은 커밋 금지.' },
        { icon: <Settings className="h-5 w-5" />, title: '리전 선택', desc: 'Functions는 icn1(서울) 기본.' },
      ]}
      steps={[
        { no: '01', title: '계정 가입', tag: 'SIGNUP', icon: <User className="h-5 w-5" />, desc: 'vercel.com에서 가입합니다.', details: [
          'Sign Up with GitHub 권장 (가장 매끄러운 연동)',
          'GitLab·Bitbucket·이메일도 가능',
          'Hobby 플랜으로 자동 시작',
          '팀(Team) 필요 시 조직 생성',
        ] },
        { no: '02', title: 'Git 저장소 연결', tag: 'CONNECT', icon: <GitBranch className="h-5 w-5" />, desc: 'GitHub와 Vercel을 연동합니다.', details: [
          'Import Git Repository 클릭',
          'Vercel GitHub App 설치 (전체 또는 선택 저장소)',
          '저장소 선택 → 프레임워크 자동 감지',
          'Next.js / Nuxt / Vite / SvelteKit 등 주요 프레임워크 지원',
        ] },
        { no: '03', title: '환경변수 설정', tag: 'ENV', icon: <Key className="h-5 w-5" />, desc: '배포 전 필수 환경변수 등록.', details: [
          'Settings > Environment Variables',
          '3개 환경 구분: Production / Preview / Development',
          'NEXT_PUBLIC_ 접두사는 클라이언트 번들에 포함됨 (민감정보 금지)',
          '서버 전용 변수는 접두사 없이 (DATABASE_URL·API_SECRET 등)',
          'vercel env pull로 로컬 .env.local에 동기화 가능',
        ] },
        { no: '04', title: '첫 배포 & Preview URL', tag: 'DEPLOY', icon: <Zap className="h-5 w-5" />, desc: 'main 브랜치 푸시 → 자동 Production 배포.', details: [
          'main(또는 Production Branch) 푸시 시 자동 배포',
          '다른 브랜치·PR은 자동으로 Preview URL 생성',
          'Preview URL: https://${프로젝트}-${브랜치}-${팀}.vercel.app',
          '배포 상태는 GitHub PR에 코멘트로 자동 표시',
          'vercel CLI로 수동 배포도 가능',
        ] },
        { no: '05', title: '커스텀 도메인 연결', tag: 'DOMAIN', icon: <Globe className="h-5 w-5" />, desc: '구매한 도메인을 프로젝트에 연결.', details: [
          'Project Settings > Domains',
          '도메인 입력 → Vercel이 필요한 DNS 레코드 안내',
          'apex 도메인: A 레코드 76.76.21.21',
          'www 서브도메인: CNAME cname.vercel-dns.com',
          '또는 네임서버를 Vercel로 변경 (ns1.vercel-dns.com / ns2.vercel-dns.com)',
          'SSL 인증서(Let\'s Encrypt) 자동 발급 · 자동 갱신',
        ] },
        { no: '06', title: '배포 보호 (선택)', tag: 'SECURITY', icon: <Shield className="h-5 w-5" />, desc: '프리뷰 URL을 외부에서 못 보게 막기.', details: [
          'Settings > Deployment Protection',
          'Vercel Authentication (팀원만 접근)',
          'Password Protection (Pro 이상)',
          'Bypass Token으로 E2E 테스트·에이전트 접근 허용',
          '스테이징/릴리즈 전 검토에 유용',
        ] },
        { no: '07', title: 'Functions & 리전 설정', tag: 'FUNCTIONS', icon: <Zap className="h-5 w-5" />, desc: 'Serverless/Edge Functions 배포 설정.', details: [
          '기본 리전: icn1 (서울) — 한국 서비스에 권장',
          'next.config.js의 runtime export 또는 vercel.json 설정',
          'Fluid Compute: 긴 I/O 작업(LLM·API)에 최적화',
          'maxDuration / memory / CPU 조정 가능',
          'Edge Runtime은 Node.js API 일부 미지원 — 확인 필요',
        ] },
        { no: '08', title: '분석 & 모니터링', tag: 'ANALYTICS', icon: <Settings className="h-5 w-5" />, desc: '방문자·성능 지표 활성화.', details: [
          'Web Analytics: 방문자·페이지뷰 (쿠키리스)',
          'Speed Insights: Core Web Vitals 실사용자 측정',
          'Vercel Logs에서 Functions 로그 확인',
          'OpenTelemetry로 외부 APM 연동 가능',
          '둘 다 Hobby에서도 제한 사용량 무료',
        ] },
      ]}
      pitfalls={[
        { title: 'Hobby 플랜 상업적 사용', desc: '회사 웹사이트·유료 서비스를 Hobby로 운영하면 ToS 위반. 최소 Pro($20/월)로 전환하세요.' },
        { title: 'NEXT_PUBLIC_ 접두사 오남용', desc: '이 접두사가 붙으면 브라우저 번들에 포함됩니다. DATABASE_URL·API_SECRET은 절대 NEXT_PUBLIC_ 붙이지 마세요.' },
        { title: 'Edge Runtime 호환성', desc: 'pg·bcrypt·fs 등 Node.js 전용 모듈은 Edge에서 동작 안 함. Node.js runtime 지정하거나 serverless로 변경.' },
        { title: '.env.local 커밋', desc: '.gitignore에 포함되어 있지만 한 번 커밋하면 히스토리에 남습니다. 즉시 키 순환 필요.' },
        { title: 'Production 브랜치 변경', desc: 'Production Branch를 main에서 다른 것으로 바꾸면 도메인이 해당 브랜치 배포로 이동. 실수 주의.' },
      ]}
      resources={[
        { title: 'Vercel Dashboard', desc: '프로젝트 관리', href: 'https://vercel.com/dashboard' },
        { title: 'Pricing', desc: 'Hobby / Pro / Enterprise', href: 'https://vercel.com/pricing' },
        { title: 'Custom Domains', desc: '도메인 연결 가이드', href: 'https://vercel.com/docs/projects/domains' },
        { title: 'Environment Variables', desc: '환경변수 관리', href: 'https://vercel.com/docs/projects/environment-variables' },
        { title: 'Functions', desc: 'Serverless · Edge · Fluid', href: 'https://vercel.com/docs/functions' },
        { title: 'AI Gateway', desc: '모델 라우팅 게이트웨이', href: 'https://vercel.com/docs/ai-gateway' },
      ]}
    />
  )
}
