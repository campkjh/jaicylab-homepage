'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronRight, MapPin, Phone, Mail, Building2, FileText, Users, Clock, Send, Shield, X, CheckCircle, Zap, BarChart3, Smartphone, Server, Sparkles, Code2 } from 'lucide-react'
import { toast } from 'sonner'
import { Logo } from '@/components/Logo'
import { FileDropzone } from '@/components/FileDropzone'

const NAV = ['회사소개', '서비스', '프로세스', '비전', '자료실', '문의']
const EXTRA_LINKS = [{ href: '/estimate', label: '자가견적' }]

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
    <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-10 opacity-0 blur-[4px]'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const { ref, visible } = useReveal()
  useEffect(() => {
    if (!visible) return
    const dur = 1500; const st = Date.now()
    const tick = () => { const p = Math.min(1, (Date.now() - st) / dur); setVal(Math.round(target * p)); if (p < 1) requestAnimationFrame(tick) }
    tick()
  }, [visible, target])
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

export default function AboutPage() {
  const [inquiry, setInquiry] = useState({ company: '', name: '', phone: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const h = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  function scrollTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }

  async function handleInquiry(e: React.FormEvent) {
    e.preventDefault()
    if (!inquiry.name || !inquiry.phone || !inquiry.message) { toast.error('필수 항목을 입력해주세요'); return }
    setSending(true); await new Promise(r => setTimeout(r, 1000))
    const fileNote = files.length ? ` (첨부 ${files.length}개)` : ''
    toast.success(`문의가 접수되었습니다.${fileNote}`); setInquiry({ company: '', name: '', phone: '', email: '', message: '' }); setFiles([]); setSending(false)
  }

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
            {NAV.map(n => (<button key={n} onClick={() => scrollTo(n)} className="text-[13px] font-medium text-white/40 transition-all hover:text-white">{n}</button>))}
            {EXTRA_LINKS.map(l => (<Link key={l.href} href={l.href} className="text-[13px] font-medium text-white/40 transition-all hover:text-white">{l.label}</Link>))}
          </nav>
          <button onClick={() => scrollTo('문의')} className="bg-white px-5 py-2 text-[13px] font-bold text-black transition-all hover:bg-white/90 active:scale-95">프로젝트 의뢰</button>
        </div>
      </header>

      {/* Hero — Spline */}
      <section className="relative flex min-h-screen items-center justify-center pt-[60px]">
        <div className="absolute inset-0 overflow-hidden">
          <iframe src="https://my.spline.design/unchained-23GT0claXxFpb4SHPFQ6IaFv/" className="h-full w-full border-none opacity-40" style={{ pointerEvents: 'none' }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]" />
        <div className="relative z-10 text-center px-6">
          <Reveal>
            <p className="mb-4 text-[12px] font-bold tracking-wide text-white/30">APP DEVELOPMENT STUDIO</p>
          </Reveal>
          <Reveal delay={200}>
            <h1 className="text-[44px] font-bold leading-[1.1] tracking-tight md:text-[72px]">
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">아이디어를 제품으로,</span><br />
              <span className="bg-gradient-to-r from-[#2979FF] to-[#82b1ff] bg-clip-text text-transparent">제품을 성장으로</span>
            </h1>
          </Reveal>
          <Reveal delay={400}>
            <p className="mx-auto mt-6 max-w-[520px] text-[15px] leading-relaxed text-white/40">
              제이씨랩은 기획 · 디자인 · 모바일 · 웹 · 백엔드 · AI 통합까지<br />
              하나의 팀이 이어서 책임지는 앱 개발 스튜디오입니다.
            </p>
          </Reveal>
          <Reveal delay={600}>
            <div className="mt-10 flex justify-center gap-3">
              <button onClick={() => scrollTo('문의')} className="bg-white px-8 py-3.5 text-[15px] font-bold text-black transition-all hover:bg-white/90 active:scale-95">프로젝트 의뢰하기</button>
              <button onClick={() => scrollTo('서비스')} className="border border-white/15 px-8 py-3.5 text-[15px] font-bold text-white/60 transition-all hover:bg-white/5 hover:text-white">서비스 둘러보기</button>
            </div>
          </Reveal>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"><ChevronRight className="h-5 w-5 rotate-90 text-white/15" /></div>
      </section>

      {/* 회사소개 */}
      <section id="회사소개" className="border-t border-white/5 py-28">
        <div className="mx-auto max-w-[1100px] px-6">
          <Reveal><p className="text-[11px] font-bold tracking-wide text-[#2979FF]">ABOUT US</p></Reveal>
          <Reveal delay={100}><h2 className="mt-3 text-[36px] font-bold tracking-tight">작은 팀, 끝까지 가는 방식</h2></Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-[640px] text-[15px] leading-[1.9] text-white/40">
              제이씨랩(JAICYLAB)은 기획부터 출시, 운영까지 한 팀이 이어서 책임지는 앱 개발 스튜디오입니다.
              단발성 외주가 아닌 제품의 라이프사이클을 함께 설계하는 파트너를 지향합니다.
            </p>
          </Reveal>

          {/* Spline + 수치 */}
          <div className="mt-16 flex flex-col items-center gap-8 md:flex-row">
            <div className="w-full md:w-1/2 h-[350px] relative">
              <iframe src="https://my.spline.design/earthdayandnight-uYL2SNcaKz91RDsQEV88Kqig/" className="h-full w-full border-none rounded-2xl" style={{ pointerEvents: 'none' }} />
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <Reveal>
                <p className="text-[11px] font-bold tracking-wide text-white/20">OUR TRACK</p>
                <h3 className="mt-2 text-[24px] font-bold">스타트업과 함께 달려온<br />앱 개발 스튜디오</h3>
              </Reveal>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { num: 30, suffix: '+', label: '출시 프로젝트', icon: <Building2 className="h-4 w-4" /> },
                  { num: 100, suffix: 'k+', label: '누적 사용자', icon: <Users className="h-4 w-4" /> },
                  { num: 99, suffix: '.9%', label: '서비스 가동률', icon: <Zap className="h-4 w-4" /> },
                  { num: 24, suffix: '/7', label: '이슈 대응', icon: <Clock className="h-4 w-4" /> },
                ].map((s, i) => (
                  <Reveal key={i} delay={i * 100}>
                    <div className="border border-white/8 bg-white/[0.02] p-4 transition-all hover:border-white/15 hover:bg-white/[0.04]">
                      <div className="flex items-center gap-2 text-white/20 mb-2">{s.icon}<span className="text-[10px] tracking-wider">{s.label}</span></div>
                      <p className="text-[28px] font-bold text-white"><CountUp target={s.num} suffix={s.suffix} /></p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          {/* 핵심 가치 */}
          <div className="mt-20 grid gap-4 md:grid-cols-3">
            {[
              { icon: <Building2 className="h-6 w-6" />, title: '제품 중심', desc: '요구사항 이전에 해결할 문제를 먼저 정의하고 제품 관점에서 설계합니다.' },
              { icon: <Users className="h-6 w-6" />, title: '한 팀 구조', desc: '기획·디자인·개발이 한 팀으로 움직여 커뮤니케이션 비용을 최소화합니다.' },
              { icon: <BarChart3 className="h-6 w-6" />, title: '데이터 기반', desc: '지표 기반으로 판단하고, 가설을 빠르게 검증해 다음을 결정합니다.' },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="group border border-white/8 p-6 transition-all duration-300 hover:border-[#2979FF]/30 hover:bg-[#2979FF]/[0.03]">
                  <div className="flex h-12 w-12 items-center justify-center bg-[#2979FF]/10 text-[#2979FF] transition-transform duration-300 group-hover:scale-110">{item.icon}</div>
                  <h3 className="mt-4 text-[17px] font-bold">{item.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/40">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 서비스 */}
      <section id="서비스" className="border-t border-white/5 py-28 bg-white/[0.01]">
        <div className="mx-auto max-w-[1100px] px-6">
          <Reveal><p className="text-[11px] font-bold tracking-wide text-[#2979FF]">SERVICES</p></Reveal>
          <Reveal delay={100}><h2 className="mt-3 text-[32px] font-bold tracking-tight">제품 전 단계를<br />하나의 팀으로 커버합니다</h2></Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {[
              { icon: <Smartphone className="h-5 w-5" />, title: '모바일 앱 개발', desc: 'iOS · Android 네이티브와 React Native · Flutter 크로스플랫폼' },
              { icon: <Code2 className="h-5 w-5" />, title: '웹 · 어드민 개발', desc: 'Next.js 기반 반응형 웹과 운영자용 어드민 대시보드' },
              { icon: <Server className="h-5 w-5" />, title: '백엔드 · 인프라', desc: 'Supabase · Vercel · AWS 기반 확장 가능한 서버 구조' },
              { icon: <Sparkles className="h-5 w-5" />, title: 'AI 통합', desc: 'LLM · 음성 · 이미지 모델의 제품 워크플로우 통합' },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="group flex items-start gap-4 border border-white/8 bg-white/[0.02] p-5 transition-all hover:border-[#2979FF]/30 hover:bg-[#2979FF]/[0.03]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#2979FF]/10 text-[#2979FF] transition-transform group-hover:scale-110">{t.icon}</div>
                  <div>
                    <p className="text-[15px] font-bold">{t.title}</p>
                    <p className="mt-1 text-[13px] text-white/40">{t.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 프로세스 */}
      <section id="프로세스" className="border-t border-white/5 py-28">
        <div className="mx-auto max-w-[1000px] px-6">
          <Reveal><p className="text-[11px] font-bold tracking-wide text-[#2979FF]">OUR PROCESS</p></Reveal>
          <Reveal delay={100}><h2 className="mt-3 text-[32px] font-bold tracking-tight">Discovery — Design — Build — Grow</h2></Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {[
              { step: '01', title: 'Discovery', color: '#ef4444', items: ['문제 정의', '사용자 시나리오', '기술 조사', '범위 합의'] },
              { step: '02', title: 'Design', color: '#f59e0b', items: ['UX 플로우', 'UI 시안', '데이터 모델', '프로토타입'] },
              { step: '03', title: 'Build', color: '#2979FF', items: ['2주 스프린트', '데모 공유', '품질 검증', '점진적 반영'] },
              { step: '04', title: 'Launch & Grow', color: '#22c55e', items: ['스토어 출시', '분석 도입', '운영 자동화', '기능 확장'] },
            ].map((r, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className="group border border-white/8 p-6 transition-all hover:border-white/15 h-full">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-3 w-3 transition-transform group-hover:scale-125" style={{ background: r.color }} />
                    <span className="text-[11px] font-bold tracking-wider text-white/30">{r.step}</span>
                  </div>
                  <p className="text-[16px] font-bold">{r.title}</p>
                  <ul className="mt-3 space-y-1.5">{r.items.map((item, j) => (<li key={j} className="text-[13px] text-white/40 transition-colors group-hover:text-white/60">• {item}</li>))}</ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 비전 */}
      <section id="비전" className="border-t border-white/5 py-28 bg-white/[0.01]">
        <div className="mx-auto max-w-[1000px] px-6">
          <Reveal><p className="text-[11px] font-bold tracking-wide text-[#2979FF]">WHY JAICYLAB?</p></Reveal>
          <Reveal delay={100}>
            <h2 className="mt-3 text-[32px] font-bold tracking-tight">&ldquo;빠르게 만들고,<br />오래 가는 제품으로&rdquo;</h2>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {[
              { before: '요구사항만 받아 구현하는 외주', after: '문제 정의부터 함께하는 파트너' },
              { before: '출시 후 연락이 끊기는 관계', after: '운영·개선까지 이어지는 장기 협업' },
              { before: '기획/디자인/개발의 분절된 커뮤니케이션', after: '한 팀 구조로 합의와 반영이 빠름' },
              { before: '기술 선택이 개발자 취향에 좌우', after: '제품 맥락과 운영비용 기반 기술 선택' },
            ].map((p, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="flex border border-white/8 overflow-hidden">
                  <div className="flex-1 bg-red-500/5 p-4 border-r border-white/5">
                    <p className="text-[11px] font-bold text-red-400/60 mb-1">BEFORE</p>
                    <p className="text-[13px] text-white/40">{p.before}</p>
                  </div>
                  <div className="flex-1 bg-[#2979FF]/5 p-4">
                    <p className="text-[11px] font-bold text-[#2979FF]/60 mb-1">AFTER</p>
                    <p className="text-[13px] text-white/60">{p.after}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 자료실 */}
      <section id="자료실" className="border-t border-white/5 py-28">
        <div className="mx-auto max-w-[1000px] px-6">
          <Reveal><p className="text-[11px] font-bold tracking-wide text-[#2979FF]">RESOURCES</p></Reveal>
          <Reveal delay={100}><h2 className="mt-3 text-[32px] font-bold">자료실</h2></Reveal>
          <div className="mt-12 grid gap-3 md:grid-cols-2">
            {[
              { icon: <FileText className="h-5 w-5" />, title: '회사소개서', desc: 'PDF', action: () => toast('준비 중입니다') },
              { icon: <FileText className="h-5 w-5" />, title: '포트폴리오', desc: 'PDF', action: () => toast('준비 중입니다') },
              { icon: <Shield className="h-5 w-5" />, title: '개인정보처리방침', desc: '', action: () => setShowPrivacy(true) },
              { icon: <FileText className="h-5 w-5" />, title: '서비스 이용약관', desc: '', action: () => setShowTerms(true) },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 80}>
                <button onClick={item.action} className="group flex w-full items-center gap-4 border border-white/8 p-5 text-left transition-all hover:border-[#2979FF]/30 hover:bg-[#2979FF]/[0.02]">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#2979FF]/10 text-[#2979FF] transition-transform group-hover:scale-110">{item.icon}</div>
                  <div className="flex-1"><p className="text-[15px] font-bold">{item.title}</p></div>
                  {item.desc && <span className="text-[11px] text-white/15">{item.desc}</span>}
                  <ChevronRight className="h-4 w-4 text-white/10 transition-transform group-hover:translate-x-1" />
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 문의 */}
      <section id="문의" className="border-t border-white/5 py-28 bg-white/[0.01]">
        <div className="mx-auto grid max-w-[1000px] gap-12 px-6 md:grid-cols-[1fr_1.2fr]">
          <div>
            <Reveal><p className="text-[11px] font-bold tracking-wide text-[#2979FF]">CONTACT</p></Reveal>
            <Reveal delay={100}><h2 className="mt-3 text-[32px] font-bold">프로젝트 문의</h2></Reveal>
            <Reveal delay={200}>
              <p className="mt-4 text-[14px] leading-relaxed text-white/40">
                아이디어 단계여도 좋습니다.<br />간단한 내용이라도 남겨주시면 빠르게 회신드릴게요.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-8 space-y-3 text-[13px] text-white/50">
                <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#2979FF]" /> contact@jaicylab.com</p>
                <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#2979FF]" /> 070-0000-0000</p>
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#2979FF]" /> 대한민국 · 서울</p>
              </div>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <form onSubmit={handleInquiry} className="space-y-3">
              {[
                { ph: '회사명 / 소속', k: 'company', req: false },
                { ph: '담당자명 *', k: 'name', req: true },
                { ph: '연락처 *', k: 'phone', req: true },
                { ph: '이메일', k: 'email', req: false },
              ].map(f => (
                <input key={f.k} className="h-12 w-full border border-white/8 bg-white/[0.03] px-4 text-[14px] text-white outline-none transition-all placeholder-white/20 focus:border-[#2979FF] focus:bg-[#2979FF]/[0.02]" placeholder={f.ph} value={(inquiry as Record<string, string>)[f.k]} onChange={e => setInquiry({ ...inquiry, [f.k]: e.target.value })} required={f.req} />
              ))}
              <textarea className="h-40 w-full resize-none border border-white/8 bg-white/[0.03] px-4 py-3 text-[14px] text-white outline-none transition-all placeholder-white/20 focus:border-[#2979FF]" placeholder="프로젝트 내용 *  (어떤 앱을 만들고 싶으신지, 예상 일정, 참고 서비스 등 자유롭게 적어주세요)" value={inquiry.message} onChange={e => setInquiry({ ...inquiry, message: e.target.value })} required />
              <FileDropzone theme="dark" files={files} onChange={setFiles} />
              <button type="submit" disabled={sending} className="flex w-full items-center justify-center gap-2 bg-white py-3.5 text-[15px] font-bold text-black transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-50">
                <Send className="h-4 w-4" /> {sending ? '전송 중...' : '문의하기'}
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-[1000px] px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Logo height={20} className="text-white" />
                <span className="text-[13px] text-white/30">제이씨랩</span>
              </div>
              <p className="mt-2 text-[11px] text-white/15">App Development Studio | T 070-0000-0000 | E contact@jaicylab.com</p>
              <p className="text-[10px] text-white/10">Copyright &copy; JAICYLAB. All rights reserved.</p>
            </div>
            <div className="flex gap-4 text-[12px] text-white/25">
              <button onClick={() => setShowPrivacy(true)} className="transition-colors hover:text-white/50">개인정보처리방침</button>
              <button onClick={() => setShowTerms(true)} className="transition-colors hover:text-white/50">이용약관</button>
              <Link href="/" className="transition-colors hover:text-white/50">홈</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy */}
      {showPrivacy && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowPrivacy(false)}>
          <div className="relative w-full max-w-[700px] max-h-[80vh] overflow-auto bg-[#111] border border-white/10 p-8 animate-[scaleIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowPrivacy(false)} className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"><X className="h-5 w-5" /></button>
            <h2 className="text-[22px] font-bold mb-6">개인정보처리방침</h2>
            <div className="space-y-4 text-[13px] leading-[1.8] text-white/45">
              <p><strong className="text-white/80">제1조 (목적)</strong><br />제이씨랩(이하 &ldquo;회사&rdquo;)은 개인정보 보호법에 따라 정보주체의 개인정보를 보호하고 관련 고충을 신속히 처리할 수 있도록 다음과 같이 처리방침을 수립·공개합니다.</p>
              <p><strong className="text-white/80">제2조 (수집 항목)</strong><br />필수: 이름, 연락처, 이메일 / 선택: 회사명, 문의 내용 / 자동수집: 접속 IP, 이용 기록</p>
              <p><strong className="text-white/80">제3조 (처리 목적)</strong><br />프로젝트 문의 응대, 계약 검토, 서비스 개선</p>
              <p><strong className="text-white/80">제4조 (보유·파기)</strong><br />목적 달성 후 지체 없이 파기합니다.</p>
              <p><strong className="text-white/80">제5조 (제3자 제공)</strong><br />동의 없이 제3자에게 제공하지 않습니다.</p>
              <p><strong className="text-white/80">제6조 (문의)</strong><br />contact@jaicylab.com</p>
              <p className="text-white/15">시행일자: 2026년 1월 1일</p>
            </div>
          </div>
        </div>
      )}

      {/* Terms */}
      {showTerms && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowTerms(false)}>
          <div className="relative w-full max-w-[700px] max-h-[80vh] overflow-auto bg-[#111] border border-white/10 p-8 animate-[scaleIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowTerms(false)} className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"><X className="h-5 w-5" /></button>
            <h2 className="text-[22px] font-bold mb-6">서비스 이용약관</h2>
            <div className="space-y-4 text-[13px] leading-[1.8] text-white/45">
              <p><strong className="text-white/80">제1조 (목적)</strong><br />이 약관은 제이씨랩이 제공하는 앱 개발 및 관련 서비스의 이용조건, 권리·의무·책임사항을 규정합니다.</p>
              <p><strong className="text-white/80">제2조 (서비스)</strong><br />모바일 앱, 웹, 백엔드, AI 통합 개발 및 유지보수</p>
              <p><strong className="text-white/80">제3조 (계약)</strong><br />프로젝트별 별도 계약서에 따라 범위 · 비용 · 일정이 확정됩니다.</p>
              <p><strong className="text-white/80">제4조 (지적재산권)</strong><br />대금 완납 시 결과물의 이용권이 이전됩니다. 자체 라이브러리와 노하우는 회사에 귀속됩니다.</p>
              <p><strong className="text-white/80">제5조 (비밀유지)</strong><br />프로젝트 과정에서 취득한 정보를 외부에 누설하지 않습니다.</p>
              <p><strong className="text-white/80">제6조 (책임 제한)</strong><br />불가항력으로 인한 손해에 대해 책임을 지지 않습니다.</p>
              <p><strong className="text-white/80">제7조 (분쟁해결)</strong><br />분쟁 발생 시 회사 소재지 관할 법원을 전속 관할로 합니다.</p>
              <p className="text-white/15">시행일자: 2026년 1월 1일</p>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  )
}
