'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Check, ArrowRight, Smartphone, Apple, Globe, Settings, Sparkles, Zap, AlertCircle, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Logo } from '@/components/Logo'

type Platform = { id: string; label: string; sub: string; price: number; icon: React.ReactNode }
type Feature = { id: string; label: string; desc: string; price: number }
type DesignTier = { id: string; label: string; desc: string; mult: number }
type Timeline = { id: string; label: string; desc: string; mult: number }

const PLATFORMS: Platform[] = [
  { id: 'ios', label: 'iOS', sub: '아이폰 네이티브', price: 2500, icon: <Apple className="h-5 w-5" /> },
  { id: 'android', label: 'Android', sub: '안드로이드 네이티브', price: 2500, icon: <Smartphone className="h-5 w-5" /> },
  { id: 'cross', label: 'iOS + Android (크로스)', sub: 'React Native / Flutter', price: 3500, icon: <Smartphone className="h-5 w-5" /> },
  { id: 'web', label: '웹 / 반응형', sub: 'Next.js 기반', price: 1800, icon: <Globe className="h-5 w-5" /> },
  { id: 'admin', label: '어드민 / CMS', sub: '관리자 페이지', price: 1500, icon: <Settings className="h-5 w-5" /> },
]

const FEATURES: Feature[] = [
  { id: 'auth', label: '회원가입 · 로그인', desc: '이메일 / 소셜 로그인, 권한 관리', price: 250 },
  { id: 'push', label: '푸시 알림', desc: 'FCM / APNs 기반 알림', price: 180 },
  { id: 'payment', label: '결제 연동', desc: '토스 / 아임포트 / 인앱결제', price: 500 },
  { id: 'chat', label: '실시간 채팅', desc: 'WebSocket 기반 1:1 / 그룹 채팅', price: 650 },
  { id: 'map', label: '지도 / 위치', desc: 'Google Maps / Kakao / Naver', price: 350 },
  { id: 'camera', label: '카메라 · 미디어', desc: '사진/영상 업로드, 필터', price: 280 },
  { id: 'ai', label: 'AI 통합', desc: 'LLM · 이미지 · 음성 모델', price: 800 },
  { id: 'matching', label: '매칭 · 예약', desc: '실시간 매칭, 스케줄', price: 600 },
  { id: 'analytics', label: '분석 · 대시보드', desc: '통계 차트, 리포트', price: 400 },
  { id: 'community', label: '커뮤니티 · 피드', desc: '게시판, 댓글, 좋아요', price: 450 },
  { id: 'i18n', label: '다국어 지원', desc: '영어 · 일본어 등 추가', price: 200 },
  { id: 'offline', label: '오프라인 모드', desc: '로컬 DB · 동기화', price: 350 },
]

const DESIGNS: DesignTier[] = [
  { id: 'template', label: '템플릿 기반', desc: '기본 디자인 시스템 활용', mult: 1.0 },
  { id: 'custom', label: '커스텀 디자인', desc: '브랜드 맞춤 UI/UX 설계', mult: 1.25 },
  { id: 'premium', label: '프리미엄', desc: '모션 · 3D · 인터랙션 포함', mult: 1.5 },
]

const TIMELINES: Timeline[] = [
  { id: 'normal', label: '일반 일정', desc: '3 – 6개월', mult: 1.0 },
  { id: 'fast', label: '단축 일정', desc: '2개월 이내', mult: 1.2 },
  { id: 'urgent', label: '긴급', desc: '1개월 이내', mult: 1.4 },
]

function fmt(manwon: number) {
  if (manwon >= 10000) return `${(manwon / 10000).toFixed(1)}억`
  return `${manwon.toLocaleString()}만`
}

export default function EstimatePage() {
  const [platforms, setPlatforms] = useState<string[]>(['cross'])
  const [features, setFeatures] = useState<string[]>(['auth', 'push'])
  const [design, setDesign] = useState('custom')
  const [timeline, setTimeline] = useState('normal')
  const [contact, setContact] = useState({ name: '', phone: '', email: '', memo: '' })
  const [sending, setSending] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const h = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const { base, featuresSum, subtotal, min, max } = useMemo(() => {
    const base = platforms.reduce((sum, id) => sum + (PLATFORMS.find(p => p.id === id)?.price ?? 0), 0)
    const featuresSum = features.reduce((sum, id) => sum + (FEATURES.find(f => f.id === id)?.price ?? 0), 0)
    const designMult = DESIGNS.find(d => d.id === design)?.mult ?? 1
    const timeMult = TIMELINES.find(t => t.id === timeline)?.mult ?? 1
    const subtotal = Math.round((base + featuresSum) * designMult * timeMult)
    const min = Math.round(subtotal * 0.85)
    const max = Math.round(subtotal * 1.25)
    return { base, featuresSum, subtotal, min, max }
  }, [platforms, features, design, timeline])

  function togglePlatform(id: string) {
    setPlatforms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }
  function toggleFeature(id: string) {
    setFeatures(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!contact.name || !contact.phone) { toast.error('담당자명과 연락처를 입력해주세요'); return }
    if (platforms.length === 0) { toast.error('플랫폼을 1개 이상 선택해주세요'); return }
    setSending(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('견적서 요청이 접수되었습니다. 영업일 기준 1일 내 회신드릴게요.')
    setContact({ name: '', phone: '', email: '', memo: '' })
    setSending(false)
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-black/60 backdrop-blur-2xl border-b border-white/5' : 'bg-transparent'}`}>
        <div className="mx-auto flex h-[60px] max-w-[1200px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <Logo height={22} className="text-white" />
            <span className="text-[12px] font-normal text-white/30">제이씨랩</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/about" className="text-[13px] font-medium text-white/40 transition-all hover:text-white">회사소개</Link>
            <Link href="/estimate" className="text-[13px] font-medium text-white transition-all">자가견적</Link>
            <Link href="/about#문의" className="text-[13px] font-medium text-white/40 transition-all hover:text-white">문의</Link>
          </nav>
          <Link href="/about#문의" className="bg-white px-5 py-2 text-[13px] font-bold text-black transition-all hover:bg-white/90 active:scale-95">프로젝트 의뢰</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-white/5 pt-[120px] pb-16">
        <div className="mx-auto max-w-[1100px] px-6">
          <p className="text-[11px] font-bold tracking-[0.4em] text-[#2979FF]">SELF ESTIMATE</p>
          <h1 className="mt-3 text-[40px] font-black leading-[1.1] tracking-tight md:text-[56px]">
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">30초 만에 받는</span><br />
            <span className="bg-gradient-to-r from-[#2979FF] to-[#82b1ff] bg-clip-text text-transparent">프로젝트 예상 견적</span>
          </h1>
          <p className="mt-5 max-w-[560px] text-[14px] leading-relaxed text-white/40">
            플랫폼과 주요 기능을 선택하시면 실시간으로 예상 견적을 확인할 수 있습니다.<br />
            실제 견적은 기능 상세와 운영 범위에 따라 조정될 수 있습니다.
          </p>
        </div>
      </section>

      {/* Body — 2 columns on desktop */}
      <section className="py-16">
        <div className="mx-auto grid max-w-[1100px] gap-10 px-6 lg:grid-cols-[1fr_380px]">

          {/* LEFT: choices */}
          <div className="space-y-12">

            {/* Step 1: Platform */}
            <div>
              <div className="flex items-baseline justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center bg-[#2979FF] text-[12px] font-black">1</span>
                  <h2 className="text-[20px] font-black">플랫폼 선택</h2>
                </div>
                <span className="text-[11px] text-white/30">복수선택 가능</span>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {PLATFORMS.map(p => {
                  const active = platforms.includes(p.id)
                  return (
                    <button key={p.id} type="button" onClick={() => togglePlatform(p.id)}
                      className={`group relative flex items-start gap-4 border p-5 text-left transition-all ${active ? 'border-[#2979FF] bg-[#2979FF]/10' : 'border-white/8 bg-white/[0.02] hover:border-white/20'}`}>
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center ${active ? 'bg-[#2979FF] text-white' : 'bg-white/[0.04] text-white/50'}`}>{p.icon}</div>
                      <div className="flex-1">
                        <p className="text-[14px] font-bold">{p.label}</p>
                        <p className="mt-0.5 text-[12px] text-white/40">{p.sub}</p>
                        <p className="mt-2 text-[11px] tracking-wider text-[#2979FF]">+ {p.price.toLocaleString()}만원~</p>
                      </div>
                      {active && <div className="absolute right-3 top-3"><Check className="h-4 w-4 text-[#2979FF]" /></div>}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step 2: Features */}
            <div>
              <div className="flex items-baseline justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center bg-[#2979FF] text-[12px] font-black">2</span>
                  <h2 className="text-[20px] font-black">주요 기능</h2>
                </div>
                <span className="text-[11px] text-white/30">필요한 기능만 선택</span>
              </div>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {FEATURES.map(f => {
                  const active = features.includes(f.id)
                  return (
                    <button key={f.id} type="button" onClick={() => toggleFeature(f.id)}
                      className={`group flex items-start gap-3 border p-4 text-left transition-all ${active ? 'border-[#2979FF] bg-[#2979FF]/8' : 'border-white/8 bg-white/[0.02] hover:border-white/20'}`}>
                      <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border transition-all ${active ? 'border-[#2979FF] bg-[#2979FF]' : 'border-white/20'}`}>
                        {active && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[13px] font-bold">{f.label}</p>
                          <span className="text-[11px] text-[#2979FF]">+{f.price}만</span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-white/35">{f.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step 3: Design */}
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center bg-[#2979FF] text-[12px] font-black">3</span>
                <h2 className="text-[20px] font-black">디자인 수준</h2>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {DESIGNS.map(d => {
                  const active = design === d.id
                  return (
                    <button key={d.id} type="button" onClick={() => setDesign(d.id)}
                      className={`flex flex-col border p-5 text-left transition-all ${active ? 'border-[#2979FF] bg-[#2979FF]/10' : 'border-white/8 bg-white/[0.02] hover:border-white/20'}`}>
                      <div className="flex items-center justify-between">
                        <Sparkles className={`h-4 w-4 ${active ? 'text-[#2979FF]' : 'text-white/30'}`} />
                        {active && <Check className="h-4 w-4 text-[#2979FF]" />}
                      </div>
                      <p className="mt-4 text-[14px] font-bold">{d.label}</p>
                      <p className="mt-1 text-[11px] text-white/40">{d.desc}</p>
                      <p className="mt-3 text-[11px] tracking-wider text-[#2979FF]">× {d.mult.toFixed(2)}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step 4: Timeline */}
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center bg-[#2979FF] text-[12px] font-black">4</span>
                <h2 className="text-[20px] font-black">일정</h2>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {TIMELINES.map(t => {
                  const active = timeline === t.id
                  return (
                    <button key={t.id} type="button" onClick={() => setTimeline(t.id)}
                      className={`flex flex-col border p-5 text-left transition-all ${active ? 'border-[#2979FF] bg-[#2979FF]/10' : 'border-white/8 bg-white/[0.02] hover:border-white/20'}`}>
                      <div className="flex items-center justify-between">
                        <Zap className={`h-4 w-4 ${active ? 'text-[#2979FF]' : 'text-white/30'}`} />
                        {active && <Check className="h-4 w-4 text-[#2979FF]" />}
                      </div>
                      <p className="mt-4 text-[14px] font-bold">{t.label}</p>
                      <p className="mt-1 text-[11px] text-white/40">{t.desc}</p>
                      <p className="mt-3 text-[11px] tracking-wider text-[#2979FF]">× {t.mult.toFixed(2)}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Contact form for quote */}
            <div className="border-t border-white/5 pt-10">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center bg-white text-[12px] font-black text-black">5</span>
                <h2 className="text-[20px] font-black">상세 견적서 요청</h2>
              </div>
              <p className="mt-3 text-[13px] text-white/40">연락처를 남겨주시면 담당자가 영업일 기준 1일 내 상세 견적서와 일정 제안을 드립니다.</p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input className="h-12 w-full border border-white/8 bg-white/[0.03] px-4 text-[14px] text-white outline-none transition-all placeholder-white/20 focus:border-[#2979FF]" placeholder="담당자명 *" value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })} required />
                  <input className="h-12 w-full border border-white/8 bg-white/[0.03] px-4 text-[14px] text-white outline-none transition-all placeholder-white/20 focus:border-[#2979FF]" placeholder="연락처 *" value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} required />
                </div>
                <input className="h-12 w-full border border-white/8 bg-white/[0.03] px-4 text-[14px] text-white outline-none transition-all placeholder-white/20 focus:border-[#2979FF]" placeholder="이메일" type="email" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} />
                <textarea className="h-28 w-full resize-none border border-white/8 bg-white/[0.03] px-4 py-3 text-[14px] text-white outline-none transition-all placeholder-white/20 focus:border-[#2979FF]" placeholder="추가로 전달할 내용 (참고 서비스, 예상 사용자 수, 특별 요구사항 등)" value={contact.memo} onChange={e => setContact({ ...contact, memo: e.target.value })} />
                <button type="submit" disabled={sending} className="flex w-full items-center justify-center gap-2 bg-white py-3.5 text-[15px] font-bold text-black transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-50">
                  <Send className="h-4 w-4" /> {sending ? '전송 중...' : '상세 견적서 받기'}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: sticky summary */}
          <aside className="relative">
            <div className="sticky top-[80px] border border-white/8 bg-white/[0.02] p-6">
              <p className="text-[11px] font-bold tracking-[0.3em] text-white/30">YOUR ESTIMATE</p>
              <div className="mt-4">
                <p className="text-[11px] text-white/40">예상 견적 범위</p>
                <p className="mt-2 text-[32px] font-black leading-tight">
                  <span className="bg-gradient-to-r from-[#2979FF] to-[#82b1ff] bg-clip-text text-transparent">{fmt(min)} – {fmt(max)}</span>
                  <span className="ml-1 text-[14px] text-white/40">원</span>
                </p>
                <p className="mt-1 text-[11px] text-white/30">VAT 별도 · 실제 견적은 상세 협의 후 확정</p>
              </div>

              {/* breakdown */}
              <div className="mt-6 space-y-2 border-t border-white/5 pt-5 text-[12px]">
                <div className="flex justify-between text-white/50"><span>플랫폼 기본</span><span className="font-medium text-white/70">{base.toLocaleString()}만</span></div>
                <div className="flex justify-between text-white/50"><span>기능 추가 ({features.length}개)</span><span className="font-medium text-white/70">{featuresSum.toLocaleString()}만</span></div>
                <div className="flex justify-between text-white/50"><span>디자인</span><span className="font-medium text-white/70">×{(DESIGNS.find(d => d.id === design)?.mult ?? 1).toFixed(2)}</span></div>
                <div className="flex justify-between text-white/50"><span>일정</span><span className="font-medium text-white/70">×{(TIMELINES.find(t => t.id === timeline)?.mult ?? 1).toFixed(2)}</span></div>
                <div className="flex justify-between border-t border-white/5 pt-2 text-white"><span className="font-bold">예상 금액</span><span className="font-black">{subtotal.toLocaleString()}만원</span></div>
              </div>

              {platforms.length === 0 && (
                <div className="mt-5 flex items-start gap-2 border border-amber-500/30 bg-amber-500/5 p-3 text-[12px] text-amber-400/80">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>플랫폼을 1개 이상 선택해주세요.</span>
                </div>
              )}

              <div className="mt-6 space-y-2">
                <a href="#5" onClick={(e) => { e.preventDefault(); document.querySelector('form')?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }}
                   className="flex w-full items-center justify-center gap-2 bg-[#2979FF] py-3 text-[13px] font-bold text-white transition-all hover:bg-[#1E6AE1]">
                  상세 견적서 받기 <ArrowRight className="h-4 w-4" />
                </a>
                <Link href="/about#문의" className="flex w-full items-center justify-center border border-white/15 py-3 text-[13px] font-bold text-white/60 transition-all hover:bg-white/5 hover:text-white">
                  직접 상담 요청
                </Link>
              </div>

              <p className="mt-5 text-[10px] leading-relaxed text-white/25">
                본 견적은 자동 계산된 참고 금액이며 실제 계약 금액과 다를 수 있습니다. 정확한 견적은 기능 명세서 기반의 상세 상담 후 확정됩니다.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Logo height={20} className="text-white" />
                <span className="text-[13px] text-white/30">제이씨랩</span>
              </div>
              <p className="mt-2 text-[11px] text-white/15">App Development Studio · contact@jaicylab.com</p>
              <p className="text-[10px] text-white/10">Copyright &copy; JAICYLAB. All rights reserved.</p>
            </div>
            <div className="flex gap-4 text-[12px] text-white/25">
              <Link href="/" className="transition-colors hover:text-white/50">홈</Link>
              <Link href="/about" className="transition-colors hover:text-white/50">회사소개</Link>
              <Link href="/about#문의" className="transition-colors hover:text-white/50">문의</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
