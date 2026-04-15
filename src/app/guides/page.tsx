'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Apple, Play, MessageCircle, Globe, Flame, Cloud, CreditCard, ChevronRight, Database, Triangle } from 'lucide-react'
import { Logo } from '@/components/Logo'

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    ob.observe(el)
    return () => ob.disconnect()
  }, [])
  return { ref, visible }
}
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-8 opacity-0 blur-[4px]'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

type GuideCard = {
  href: string
  icon: React.ReactNode
  category: string
  title: string
  desc: string
  meta: string
  accent: string
}

const GROUPS: { label: string; items: GuideCard[] }[] = [
  {
    label: '앱 스토어 · 개발자 계정',
    items: [
      { href: '/guides/apple-developer',  icon: <Apple className="h-5 w-5" />,         category: 'APPLE',       title: 'Apple Developer 계정',    desc: 'iOS 앱 출시에 필수. 개인/법인 선택부터 DUNS, 연회비 $99 결제, App Store Connect 셋업까지.', meta: '$99/년 · 1–7일 심사', accent: 'from-slate-400 to-slate-600' },
      { href: '/guides/google-play',      icon: <Play className="h-5 w-5" />,          category: 'GOOGLE PLAY', title: 'Google Play Console',     desc: 'Android 앱 등록. $25 일회성 등록비, 신원 확인, Closed Testing 14일 규정까지.', meta: '$25 (1회) · 1–3일 심사', accent: 'from-emerald-500 to-green-700' },
    ],
  },
  {
    label: '소셜 로그인 · 국내 오픈 API',
    items: [
      { href: '/guides/kakao-developers', icon: <MessageCircle className="h-5 w-5" />, category: 'KAKAO',       title: 'Kakao Developers',        desc: '카카오 로그인·지도·공유하기·알림톡. 앱 등록, 키 해시, 동의 항목 심사까지.', meta: '무료 · 일부 항목 심사 필요', accent: 'from-yellow-400 to-amber-600' },
      { href: '/guides/naver-developers', icon: <Globe className="h-5 w-5" />,         category: 'NAVER',       title: 'Naver Developers',        desc: '네이버 로그인·검색·Papago 번역. Client ID/Secret 발급, Callback URL 설정.', meta: '무료 · 즉시 발급', accent: 'from-green-500 to-emerald-700' },
    ],
  },
  {
    label: '클라우드 · 인프라',
    items: [
      { href: '/guides/firebase',     icon: <Flame className="h-5 w-5" />,    category: 'FIREBASE',       title: 'Firebase / GCP',          desc: 'FCM 푸시·Auth·Firestore. iOS APNs 키 업로드, Android google-services.json, 서비스 계정.', meta: 'Spark 무료 · Blaze 종량', accent: 'from-orange-500 to-amber-700' },
      { href: '/guides/naver-cloud',  icon: <Cloud className="h-5 w-5" />,    category: 'NCP',            title: 'Naver Cloud Platform',    desc: '네이버 지도·CLOVA OCR·SENS SMS. 계정 생성, Access Key, 상품별 이용 신청.', meta: '첫 가입 크레딧 · 한국 카드 OK', accent: 'from-sky-500 to-blue-700' },
      { href: '/guides/aws',          icon: <Cloud className="h-5 w-5" />,    category: 'AWS',            title: 'Amazon Web Services',     desc: '루트 계정 보호, IAM·MFA, 액세스 키, 예산 알림, 서울 리전 선택까지 안전한 초기 셋업.', meta: '12개월 프리티어 · 카드 필수', accent: 'from-amber-600 to-orange-700' },
      { href: '/guides/supabase',     icon: <Database className="h-5 w-5" />, category: 'SUPABASE',       title: 'Supabase',                desc: 'PostgreSQL·Auth·Storage·Realtime. 프로젝트 생성, RLS 정책, 키 분리.', meta: '무료 2개 · Pro $25/월', accent: 'from-emerald-500 to-teal-700' },
      { href: '/guides/vercel',       icon: <Triangle className="h-5 w-5" />, category: 'VERCEL',         title: 'Vercel 배포',             desc: 'GitHub 연동, 환경변수, 커스텀 도메인 DNS, Preview 배포, Functions 리전.', meta: 'Hobby 무료 · Pro $20/월', accent: 'from-slate-500 to-slate-800' },
    ],
  },
  {
    label: '결제 · PG',
    items: [
      { href: '/guides/toss-payments', icon: <CreditCard className="h-5 w-5" />, category: 'TOSS PAYMENTS', title: '토스페이먼츠 가맹점', desc: 'PG 연동. 테스트 키 → 가맹점 계약 → 실서비스 키 → 웹훅·정산 자동화.', meta: '2–5일 심사 · 수수료 2.5~3.5%', accent: 'from-blue-500 to-indigo-700' },
      { href: '/guides/portone',       icon: <CreditCard className="h-5 w-5" />, category: 'PORTONE',       title: '포트원 (구 아임포트)', desc: '여러 PG를 하나의 API로. V2 채널 등록, 결제 검증, 웹훅 서명까지.', meta: '포트원 무료 · PG 수수료만', accent: 'from-violet-500 to-purple-700' },
    ],
  },
  {
    label: '고객 응대 · 운영',
    items: [
      { href: '/guides/channeltalk', icon: <MessageCircle className="h-5 w-5" />, category: 'CHANNEL TALK', title: '채널톡 (ChannelTalk)', desc: '국내 대표 라이브 챗. 채널 개설·웹/앱 SDK·memberHash·웹훅 자동화.', meta: '무료 3인 · Pro ₩39,000~', accent: 'from-rose-500 to-pink-700' },
    ],
  },
]

export default function GuidesIndexPage() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const h = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const total = GROUPS.reduce((a, g) => a + g.items.length, 0)

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-black/60 backdrop-blur-2xl border-b border-white/5' : 'bg-transparent'}`}>
        <div className="mx-auto flex h-[60px] max-w-[1200px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <Logo height={22} className="text-white" />
            <span className="text-[12px] font-normal text-white/30">제이씨랩</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/about" className="text-[13px] font-medium text-white/40 transition-all hover:text-white">회사소개</Link>
            <Link href="/estimate" className="text-[13px] font-medium text-white/40 transition-all hover:text-white">자가견적</Link>
            <Link href="/guides" className="text-[13px] font-bold text-white transition-all">가이드</Link>
            <Link href="/about#문의" className="text-[13px] font-medium text-white/40 transition-all hover:text-white">문의</Link>
          </nav>
          <Link href="/about#문의" className="rounded-xl bg-white px-5 py-2 text-[13px] font-bold text-black transition-all hover:bg-white/90 active:scale-95">프로젝트 의뢰</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative border-b border-white/5 pt-[140px] pb-20">
        <div className="mx-auto max-w-[1100px] px-6">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-md">
              <ChevronRight className="h-3.5 w-3.5 text-white/60" />
              <span className="text-[11px] font-semibold tracking-wide text-white/70">DEVELOPER GUIDES</span>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-6 text-[44px] font-bold leading-[1.05] tracking-tight md:text-[64px]">
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">앱 만들 때 필요한</span><br />
              <span className="bg-gradient-to-r from-[#82b1ff] to-white bg-clip-text text-transparent">계정·키·가이드 모음</span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-6 max-w-[620px] text-[15px] leading-relaxed text-white/50">
              앱 개발에서 매번 반복되는 계정 생성과 API 키 발급 절차를 한곳에 모았습니다.<br />
              총 <b className="text-white">{total}개 가이드</b>, 각각 단계별 체크리스트·자주 막히는 부분·공식 링크를 포함합니다.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Groups */}
      {GROUPS.map((g, gi) => (
        <section key={g.label} className={`border-b border-white/5 py-20 ${gi % 2 === 1 ? 'bg-white/[0.01]' : ''}`}>
          <div className="mx-auto max-w-[1100px] px-6">
            <Reveal>
              <p className="text-[11px] font-bold tracking-wider text-[#82b1ff]">{String(gi + 1).padStart(2, '0')} · {g.label.toUpperCase()}</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-3 text-[26px] font-bold tracking-tight md:text-[32px]">{g.label}</h2>
            </Reveal>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {g.items.map((c, i) => (
                <Reveal key={c.href} delay={i * 80}>
                  <Link href={c.href} className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.05] hover:shadow-[0_14px_42px_rgba(41,121,255,0.12)]">
                    <div className="flex items-start justify-between">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${c.accent} shadow-[0_6px_18px_rgba(15,23,42,0.3)]`}>
                        {c.icon}
                      </div>
                      <ArrowRight className="h-4 w-4 text-white/25 transition-all group-hover:translate-x-1 group-hover:text-white" />
                    </div>
                    <p className="mt-5 text-[10px] font-bold tracking-wider text-white/30">{c.category}</p>
                    <h3 className="mt-1 text-[18px] font-bold tracking-tight">{c.title}</h3>
                    <p className="mt-2 flex-1 text-[13px] leading-relaxed text-white/45">{c.desc}</p>
                    <div className="mt-5 flex items-center gap-2 text-[11px] font-medium text-white/40">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#82b1ff]" />
                      {c.meta}
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="bg-gradient-to-b from-transparent to-white/[0.02] py-28">
        <div className="mx-auto max-w-[720px] px-6 text-center">
          <Reveal>
            <h2 className="text-[34px] font-bold leading-tight tracking-tight md:text-[44px]">
              등록이 복잡하면<br />전부 대행해 드릴게요
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 text-[15px] text-white/50">
              개발자 계정·API 키·PG 가맹점 계약까지 앱 출시에 필요한 셋업 전부를 한 번에 진행합니다.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/about#문의" className="group flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-[15px] font-bold text-black transition-all hover:bg-white/90 active:scale-95">
                대행 문의하기 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/estimate" className="rounded-xl border border-white/20 px-8 py-4 text-[15px] font-bold text-white/80 transition-all hover:bg-white/5 hover:text-white">
                자가견적 받기
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Logo height={20} className="text-white" />
                <span className="text-[13px] text-white/30">제이씨랩</span>
              </div>
              <p className="mt-2 text-[11px] text-white/15">App Development Studio · jaicylab2009@gmail.com</p>
              <p className="text-[10px] text-white/10">Copyright &copy; JAICYLAB. All rights reserved.</p>
            </div>
            <div className="flex gap-4 text-[12px] text-white/25">
              <Link href="/" className="transition-colors hover:text-white/50">홈</Link>
              <Link href="/about" className="transition-colors hover:text-white/50">회사소개</Link>
              <Link href="/estimate" className="transition-colors hover:text-white/50">자가견적</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
