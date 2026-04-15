'use client'

import { useState, useEffect, useRef } from 'react'
import { Link } from '@/i18n/navigation'
import { ArrowRight, CheckCircle2, AlertTriangle, ExternalLink, CreditCard, Shield, FileText, Mail, ChevronRight, Apple, Building2, User, Key } from 'lucide-react'
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

const STEPS: { no: string; title: string; desc: string; details: string[]; icon: React.ReactNode; tag?: string }[] = [
  {
    no: '01', title: 'Apple ID 준비', tag: 'PREREQUISITE',
    icon: <User className="h-5 w-5" />,
    desc: '없으면 먼저 Apple ID를 생성합니다. 회사 이메일 사용을 권장합니다.',
    details: [
      'appleid.apple.com에서 가입',
      '개인 이메일이 아닌 도메인 이메일 권장 (예: dev@yourcompany.com)',
      '추후 이관이 거의 불가하므로 신중히 선택',
    ],
  },
  {
    no: '02', title: '2단계 인증 활성화', tag: 'SECURITY',
    icon: <Shield className="h-5 w-5" />,
    desc: '개발자 프로그램 가입 전 반드시 2FA가 켜져 있어야 합니다.',
    details: [
      'iPhone/iPad에서 설정 > Apple ID > 암호 및 보안 > 2단계 인증 켜기',
      '신뢰할 수 있는 전화번호 2개 이상 등록 권장',
      '복구 연락처(Recovery Contact) 설정',
    ],
  },
  {
    no: '03', title: 'Apple Developer Program 접속', tag: 'PORTAL',
    icon: <ExternalLink className="h-5 w-5" />,
    desc: 'developer.apple.com/programs 에서 Enroll 버튼을 누릅니다.',
    details: [
      '로그인 후 Enrollment 페이지로 이동',
      '약관 동의 및 등록 유형 선택으로 진행',
      '가입 도중 이탈해도 세션이 유지됨',
    ],
  },
  {
    no: '04', title: '등록 유형 선택 (개인 vs 법인)', tag: 'ENTITY',
    icon: <Building2 className="h-5 w-5" />,
    desc: '앱 스토어 표기 주체에 따라 신중히 선택. 중간 변경이 까다롭습니다.',
    details: [
      '개인 (Individual): 실명으로 앱 등록, 한국 거주자 주민등록번호 불필요',
      '법인 (Organization): 회사명으로 앱 등록, DUNS 번호 필수',
      'DUNS 번호는 developer.apple.com/enroll/duns-lookup/ 에서 무료 조회·발급',
      'DUNS 신청 후 Apple 연동까지 영업일 기준 3~7일 소요',
    ],
  },
  {
    no: '05', title: '법인 정보 입력 (법인만)', tag: 'ORGANIZATION',
    icon: <FileText className="h-5 w-5" />,
    desc: '법인 등록의 경우 추가 정보가 필요합니다.',
    details: [
      '법인명 (DUNS와 정확히 일치해야 함)',
      '법인 주소·대표자·대표 연락처',
      '계약 체결 권한 보유 증명 (필요 시)',
      'Apple이 전화로 실재 확인 (한국어 가능, 영업일 기준 1~5일)',
    ],
  },
  {
    no: '06', title: '약관 동의 및 결제', tag: 'PAYMENT',
    icon: <CreditCard className="h-5 w-5" />,
    desc: '연회비 $99(개인/법인 동일)를 신용카드로 결제합니다.',
    details: [
      'Apple Developer Program License Agreement 동의',
      'Visa / Mastercard / Amex 등 해외 결제 가능 카드 필요',
      '법인 카드 사용 시 법인명 일치 권장',
      '결제 후 영수증 이메일 자동 발송',
    ],
  },
  {
    no: '07', title: 'Apple 승인 대기', tag: 'WAITING',
    icon: <Mail className="h-5 w-5" />,
    desc: '심사가 완료되면 승인 메일이 발송됩니다.',
    details: [
      '개인: 보통 24시간 이내 (최대 2일)',
      '법인: 보통 2~7일 (DUNS 검증·전화 확인 포함)',
      '접수 이메일과 승인 완료 이메일을 반드시 보관',
      '심사 중 developer.apple.com 헤더에 상태 표시됨',
    ],
  },
  {
    no: '08', title: 'App Store Connect 셋업', tag: 'POST',
    icon: <Key className="h-5 w-5" />,
    desc: '승인 후 App Store Connect에 접속해 앱 등록 준비.',
    details: [
      'appstoreconnect.apple.com 로그인',
      '세금/은행 정보 입력 (Paid Apps 계약 필요)',
      '팀 멤버 초대 (Developer / App Manager / Admin 역할)',
      'Xcode에서 동일 Apple ID로 로그인 후 Signing 구성',
    ],
  },
]

const PITFALLS = [
  { title: '개인 → 법인 전환은 사실상 불가', desc: '앱 소유권·리뷰·매출이 모두 연결되어 있어 이관이 매우 제한적. 처음부터 올바른 유형 선택이 중요합니다.' },
  { title: 'DUNS 정보 불일치', desc: '법인명·주소가 DUNS와 한 글자라도 다르면 반려됩니다. 사업자등록증 정보와 DUNS를 먼저 일치시키세요.' },
  { title: '2FA 미활성 Apple ID 사용', desc: 'Enrollment 도중 2FA 설정 요구로 중단되는 경우가 많습니다. 가입 전에 먼저 켜두세요.' },
  { title: '법인 카드 소유자 불일치', desc: '대표자 명의가 아닌 경우 전화 확인 시 질문이 길어질 수 있습니다.' },
  { title: '세금/은행 정보 누락', desc: '유료 앱이나 인앱결제를 운영하려면 Paid Apps 계약 완료 후 매출 정산이 가능합니다.' },
]

export default function AppleDeveloperGuidePage() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const h = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-black/60 backdrop-blur-2xl border-b border-white/5' : 'bg-transparent'}`}>
        <div className="mx-auto flex h-[60px] max-w-[1200px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <Logo height={22} className="text-white" />
            <span className="text-[12px] font-normal text-white/30">제이씨랩</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/about" className="text-[13px] font-medium text-white/40 transition-all hover:text-white">회사소개</Link>
            <Link href="/estimate" className="text-[13px] font-medium text-white/40 transition-all hover:text-white">자가견적</Link>
            <Link href="/guides/apple-developer" className="text-[13px] font-bold text-white transition-all">가이드</Link>
            <Link href="/about#문의" className="text-[13px] font-medium text-white/40 transition-all hover:text-white">문의</Link>
          </nav>
          <Link href="/about#문의" className="rounded-xl bg-white px-5 py-2 text-[13px] font-bold text-black transition-all hover:bg-white/90 active:scale-95">프로젝트 의뢰</Link>
        </div>
      </header>

      {/* Hero — Spline 3D */}
      <section className="relative flex min-h-[90vh] items-center justify-center pt-[60px]">
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            src="https://my.spline.design/appleproductannouncementanimation-9CEboyMmBCKPi0a1OrpYzr2L/"
            className="h-full w-full border-none"
            style={{ pointerEvents: 'none' }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_30%,rgba(0,0,0,0.5)_100%)]" />

        <div className="relative z-10 mx-auto max-w-[960px] px-6 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-md">
              <Apple className="h-3.5 w-3.5 text-white/80" />
              <span className="text-[11px] font-semibold tracking-wide text-white/70">DEVELOPER ACCOUNT GUIDE</span>
            </div>
          </Reveal>
          <Reveal delay={180}>
            <h1 className="mt-6 text-[44px] font-bold leading-[1.05] tracking-tight md:text-[68px]">
              <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">Apple Developer</span><br />
              <span className="bg-gradient-to-r from-[#82b1ff] via-white to-[#82b1ff] bg-clip-text text-transparent">계정 생성하기</span>
            </h1>
          </Reveal>
          <Reveal delay={360}>
            <p className="mx-auto mt-6 max-w-[560px] text-[15px] leading-relaxed text-white/50">
              iOS 앱을 App Store에 출시하려면 Apple Developer Program 등록이 필요합니다.<br />
              개인·법인 구분부터 결제, 승인까지 순서대로 안내해 드립니다.
            </p>
          </Reveal>
          <Reveal delay={540}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <a href="https://developer.apple.com/programs/enroll/" target="_blank" rel="noreferrer"
                className="group flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-[15px] font-bold text-black transition-all hover:bg-white/90 active:scale-95">
                Enroll 페이지 열기
                <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a href="#steps" className="rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-[15px] font-bold text-white/80 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white">
                단계별 보기
              </a>
            </div>
          </Reveal>

          <Reveal delay={720}>
            <div className="mt-12 grid grid-cols-3 gap-3 md:gap-6">
              {[
                { label: '연회비', value: '$99' },
                { label: '심사 기간', value: '1–7일' },
                { label: '필요 문서', value: 'DUNS·카드' },
              ].map(s => (
                <div key={s.label} className="rounded-2xl border border-white/8 bg-white/5 px-4 py-4 backdrop-blur-md">
                  <p className="text-[11px] text-white/40">{s.label}</p>
                  <p className="mt-1 text-[20px] font-bold md:text-[24px]">{s.value}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight className="h-5 w-5 rotate-90 text-white/20" />
        </div>
      </section>

      {/* 개요 */}
      <section className="border-t border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent py-24">
        <div className="mx-auto max-w-[1000px] px-6">
          <Reveal><p className="text-[12px] font-semibold text-[#82b1ff]">Overview</p></Reveal>
          <Reveal delay={80}>
            <h2 className="mt-3 text-[32px] font-bold leading-tight tracking-tight md:text-[40px]">
              앱 출시 전에 확인하세요
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-4 max-w-[620px] text-[15px] leading-relaxed text-white/50">
              Apple Developer Program 등록은 단순한 계정 가입 이상의 절차를 포함합니다. 개인/법인 유형은 앱 표기 주체를 결정하고 추후 변경이 어려우므로, 아래 체크리스트를 먼저 점검해 주세요.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-3 md:grid-cols-2">
            {[
              { icon: <User className="h-5 w-5" />, title: '개인 vs 법인 명확히 결정', desc: '앱 이름·스토어 노출 주체가 달라집니다.' },
              { icon: <Shield className="h-5 w-5" />, title: 'Apple ID + 2FA 준비', desc: '도메인 이메일, 2단계 인증 활성화.' },
              { icon: <Building2 className="h-5 w-5" />, title: 'DUNS 번호 (법인)', desc: '무료 발급, 영업일 기준 3~7일 소요.' },
              { icon: <CreditCard className="h-5 w-5" />, title: '해외결제 카드', desc: '연회비 $99 결제용 Visa/Master/Amex.' },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="group flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-5 transition-all hover:border-white/20 hover:bg-white/[0.04]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white/80 transition-transform group-hover:scale-110">{c.icon}</div>
                  <div>
                    <p className="text-[14px] font-bold">{c.title}</p>
                    <p className="mt-1 text-[13px] text-white/40">{c.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 단계별 */}
      <section id="steps" className="border-t border-white/5 py-24">
        <div className="mx-auto max-w-[1000px] px-6">
          <Reveal><p className="text-[12px] font-semibold text-[#82b1ff]">Step by Step</p></Reveal>
          <Reveal delay={80}>
            <h2 className="mt-3 text-[32px] font-bold leading-tight tracking-tight md:text-[40px]">
              8단계로 끝내는 개발자 계정 등록
            </h2>
          </Reveal>

          <div className="mt-14 space-y-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.no} delay={i * 60}>
                <div className="group relative flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition-all hover:border-white/15 hover:bg-white/[0.04] md:flex-row md:gap-6">
                  {/* 번호 & 아이콘 */}
                  <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm">
                      <span className="bg-gradient-to-br from-white to-[#82b1ff] bg-clip-text text-[22px] font-bold text-transparent">{s.no}</span>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2979FF]/15 text-[#82b1ff] transition-transform group-hover:scale-110">
                      {s.icon}
                    </div>
                  </div>

                  {/* 본문 */}
                  <div className="flex-1">
                    {s.tag && <p className="text-[10px] font-semibold tracking-wide text-white/30">{s.tag}</p>}
                    <h3 className="mt-1 text-[20px] font-bold tracking-tight">{s.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-white/55">{s.desc}</p>
                    <ul className="mt-4 grid gap-2">
                      {s.details.map((d, j) => (
                        <li key={j} className="flex items-start gap-2 text-[13px] text-white/45">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#82b1ff]" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 자주 발생하는 이슈 */}
      <section className="border-t border-white/5 bg-white/[0.01] py-24">
        <div className="mx-auto max-w-[1000px] px-6">
          <Reveal><p className="text-[12px] font-semibold text-amber-400/80">Pitfalls</p></Reveal>
          <Reveal delay={80}>
            <h2 className="mt-3 text-[32px] font-bold leading-tight tracking-tight md:text-[36px]">
              이 부분이 특히 자주 막힙니다
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-4 max-w-[620px] text-[14px] text-white/50">실제 출시 프로젝트에서 반복적으로 나오는 이슈 모음입니다. 등록 전에 한 번씩 체크해 주세요.</p>
          </Reveal>

          <div className="mt-12 grid gap-3 md:grid-cols-2">
            {PITFALLS.map((p, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-5 transition-all hover:border-amber-500/30">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400/80" />
                  <div>
                    <p className="text-[14px] font-bold text-white/90">{p.title}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-white/50">{p.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 외부 링크 */}
      <section className="border-t border-white/5 py-24">
        <div className="mx-auto max-w-[1000px] px-6">
          <Reveal><p className="text-[12px] font-semibold text-[#82b1ff]">Resources</p></Reveal>
          <Reveal delay={80}>
            <h2 className="mt-3 text-[32px] font-bold leading-tight tracking-tight md:text-[36px]">
              공식 링크 모음
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-3 md:grid-cols-2">
            {[
              { title: 'Apple Developer Enrollment', desc: '개발자 프로그램 가입 시작', href: 'https://developer.apple.com/programs/enroll/' },
              { title: 'DUNS Number Lookup', desc: '법인 DUNS 번호 조회·발급', href: 'https://developer.apple.com/enroll/duns-lookup/' },
              { title: 'App Store Connect', desc: '앱 등록 및 관리 콘솔', href: 'https://appstoreconnect.apple.com/' },
              { title: 'Apple ID 관리', desc: '2FA 설정·비밀번호 변경', href: 'https://appleid.apple.com/' },
              { title: 'Developer Program License', desc: '공식 약관 전문', href: 'https://developer.apple.com/support/terms/' },
              { title: 'App Review Guidelines', desc: '심사 가이드라인', href: 'https://developer.apple.com/app-store/review/guidelines/' },
            ].map((l, i) => (
              <Reveal key={i} delay={i * 50}>
                <a href={l.href} target="_blank" rel="noreferrer"
                  className="group flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.02] p-5 transition-all hover:border-white/20 hover:bg-white/[0.05]">
                  <div>
                    <p className="text-[14px] font-bold">{l.title}</p>
                    <p className="mt-0.5 text-[12px] text-white/40">{l.desc}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0 text-white/30 transition-all group-hover:translate-x-0.5 group-hover:text-white" />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 bg-gradient-to-b from-transparent to-white/[0.02] py-28">
        <div className="mx-auto max-w-[720px] px-6 text-center">
          <Reveal>
            <h2 className="text-[36px] font-bold leading-tight tracking-tight md:text-[48px]">
              등록이 복잡하면<br />대행해 드려요
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 text-[15px] text-white/50">
              제이씨랩이 진행하는 프로젝트는 개발자 계정 셋업부터 앱스토어 제출, 심사 대응까지 모두 포함됩니다.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/about#문의" className="group flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-[15px] font-bold text-black transition-all hover:bg-white/90 active:scale-95">
                등록 대행 문의 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/estimate" className="rounded-xl border border-white/20 px-8 py-4 text-[15px] font-bold text-white/80 transition-all hover:bg-white/5 hover:text-white">
                자가견적 받기
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
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
              <Link href="/about#문의" className="transition-colors hover:text-white/50">문의</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
