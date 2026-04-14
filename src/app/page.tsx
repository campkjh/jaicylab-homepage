'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Smartphone, Server, Sparkles, Code2, Layers, Rocket } from 'lucide-react'
import { Logo } from '@/components/Logo'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/5">
        <div className="mx-auto flex h-[60px] max-w-[1200px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <Logo height={22} className="text-white" />
            <span className="text-[12px] font-normal text-white/30">제이씨랩</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/about" className="text-[13px] font-medium text-white/40 transition-all hover:text-white">회사소개</Link>
            <a href="#services" className="text-[13px] font-medium text-white/40 transition-all hover:text-white">서비스</a>
            <Link href="/estimate" className="text-[13px] font-medium text-white/40 transition-all hover:text-white">자가견적</Link>
            <Link href="/about#문의" className="text-[13px] font-medium text-white/40 transition-all hover:text-white">문의</Link>
          </nav>
          <Link href="/about#문의" className="bg-white px-5 py-2 text-[13px] font-bold text-black transition-all hover:bg-white/90 active:scale-95">프로젝트 의뢰</Link>
        </div>
      </header>

      {/* Hero — Split layout: Spline left, content right */}
      <section className="relative flex min-h-screen pt-[60px]">
        {/* Spline 3D */}
        <div className="relative hidden w-[48%] overflow-hidden lg:block">
          <iframe
            src="https://my.spline.design/radialglass-FUwYApl0VW1nPrvtevgrvChJ/"
            frameBorder="0"
            className="absolute inset-0 h-full w-full"
            style={{ border: 'none' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#050505]" />
        </div>

        {/* Mobile Spline (background) */}
        <div className="absolute inset-0 lg:hidden">
          <iframe
            src="https://my.spline.design/radialglass-FUwYApl0VW1nPrvtevgrvChJ/"
            frameBorder="0"
            className="h-full w-full opacity-30"
            style={{ border: 'none', pointerEvents: 'none' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 via-transparent to-[#050505]" />
        </div>

        {/* Right content */}
        <div className="relative z-10 flex flex-1 items-center px-6 lg:px-16">
          <div className={`w-full max-w-[560px] transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
            <p className="mb-4 text-[12px] font-bold tracking-wide text-[#2979FF]">APP DEVELOPMENT STUDIO</p>
            <h1 className="text-[44px] font-bold leading-[1.05] tracking-tight md:text-[64px]">
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">아이디어를</span><br />
              <span className="bg-gradient-to-r from-[#2979FF] to-[#82b1ff] bg-clip-text text-transparent">앱으로.</span>
            </h1>
            <p className="mt-6 text-[15px] leading-relaxed text-white/40">
              제이씨랩은 iOS · Android · 웹 · 백엔드 · AI 통합까지<br />
              제품의 처음과 끝을 함께 설계하는 앱 개발 스튜디오입니다.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/estimate" className="group flex items-center gap-2 bg-white px-7 py-3.5 text-[15px] font-bold text-black transition-all hover:bg-white/90 active:scale-95">
                30초 견적 받기
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/about" className="border border-white/15 px-7 py-3.5 text-[15px] font-bold text-white/70 transition-all hover:bg-white/5 hover:text-white">
                회사소개 보기
              </Link>
            </div>

            {/* Stack badges */}
            <div className="mt-12 flex flex-wrap gap-2">
              {['iOS', 'Android', 'React Native', 'Next.js', 'Node.js', 'AI / LLM'].map((t) => (
                <span key={t} className="border border-white/8 bg-white/[0.02] px-3 py-1.5 text-[11px] tracking-wider text-white/40">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="border-t border-white/5 py-28">
        <div className="mx-auto max-w-[1100px] px-6">
          <p className="text-[11px] font-bold tracking-wide text-[#2979FF]">SERVICES</p>
          <h2 className="mt-3 text-[36px] font-bold tracking-tight">제품 전 단계를<br />하나의 팀으로 커버합니다</h2>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {[
              { icon: <Smartphone className="h-6 w-6" />, title: '모바일 앱', desc: 'iOS · Android 네이티브와 React Native / Flutter 크로스플랫폼까지 요구사항에 맞춰 설계합니다.' },
              { icon: <Code2 className="h-6 w-6" />, title: '웹 · 어드민', desc: 'Next.js 기반 반응형 웹과 운영자용 어드민 대시보드를 제품과 함께 구축합니다.' },
              { icon: <Server className="h-6 w-6" />, title: '백엔드 · 인프라', desc: 'Supabase, Vercel, AWS 기반 확장 가능한 서버 아키텍처와 DB 설계를 제공합니다.' },
              { icon: <Sparkles className="h-6 w-6" />, title: 'AI 통합', desc: 'LLM · 음성 · 이미지 모델을 제품 워크플로우에 자연스럽게 녹여냅니다.' },
              { icon: <Layers className="h-6 w-6" />, title: 'MVP · PoC', desc: '4–8주 단위 MVP 스프린트로 가설을 빠르게 검증하고 다음 단계를 함께 결정합니다.' },
              { icon: <Rocket className="h-6 w-6" />, title: '운영 · 성장', desc: '런칭 이후의 분석, 운영 자동화, 점진적 기능 확장을 같은 팀이 이어갑니다.' },
            ].map((s, i) => (
              <div key={i} className="group border border-white/8 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#2979FF]/30 hover:bg-[#2979FF]/[0.03] hover:shadow-[0_8px_32px_rgba(41,121,255,0.08)]">
                <div className="flex h-12 w-12 items-center justify-center bg-[#2979FF]/10 text-[#2979FF] transition-transform duration-300 group-hover:scale-110">{s.icon}</div>
                <h3 className="mt-4 text-[17px] font-bold">{s.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/40">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="border-t border-white/5 bg-white/[0.01] py-28">
        <div className="mx-auto max-w-[1000px] px-6">
          <p className="text-[11px] font-bold tracking-wide text-[#2979FF]">PROCESS</p>
          <h2 className="mt-3 text-[32px] font-bold tracking-tight">우리가 일하는 방식</h2>

          <div className="mt-12 space-y-4">
            {[
              { phase: '01', title: 'Discovery', desc: '문제 정의, 사용자 시나리오, 기술 조사. 무엇을 만들 것인가에 답합니다.' },
              { phase: '02', title: 'Design', desc: 'UX 플로우와 UI 시안, 데이터 모델까지 함께 설계해 개발 리스크를 줄입니다.' },
              { phase: '03', title: 'Build', desc: '2주 단위 스프린트로 데모를 공유하며 빠르게 합의하고 빠르게 반영합니다.' },
              { phase: '04', title: 'Launch & Grow', desc: '스토어 출시, 분석 도입, 운영 자동화까지 같은 팀이 책임집니다.' },
            ].map((p, i) => (
              <div key={i} className="flex items-start gap-6 border-l-2 border-[#2979FF] pl-6 py-2 transition-all hover:pl-8">
                <span className="text-[32px] font-bold text-[#2979FF]/20">{p.phase}</span>
                <div>
                  <h3 className="text-[17px] font-bold">{p.title}</h3>
                  <p className="mt-1 text-[13px] text-white/40">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 py-28">
        <div className="mx-auto max-w-[800px] px-6 text-center">
          <h2 className="text-[36px] font-bold leading-tight md:text-[48px]">
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">함께 만들어 볼까요?</span>
          </h2>
          <p className="mt-4 text-[15px] text-white/40">아이디어 단계여도 좋습니다. 가볍게 이야기 나눠보세요.</p>
          <Link href="/about#문의" className="group mt-10 inline-flex items-center gap-2 bg-white px-8 py-4 text-[15px] font-bold text-black transition-all animate-[pulseRing_2.5s_ease-out_infinite] hover:bg-white/90 hover:animate-none hover:scale-[1.03] active:scale-95">
            프로젝트 의뢰하기 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-3 px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Logo height={20} className="text-white" />
              <span className="text-[13px] text-white/30">제이씨랩</span>
            </div>
            <p className="mt-2 text-[11px] text-white/15">App Development Studio · contact@jaicylab.com</p>
            <p className="text-[10px] text-white/10">Copyright &copy; JAICYLAB. All rights reserved.</p>
          </div>
          <div className="flex gap-4 text-[12px] text-white/25">
            <Link href="/about" className="transition-colors hover:text-white/50">회사소개</Link>
            <Link href="/about#문의" className="transition-colors hover:text-white/50">문의</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
