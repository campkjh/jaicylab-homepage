'use client'

import { useState, useEffect, useRef } from 'react'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight, CheckCircle2, AlertTriangle, ExternalLink, ChevronRight,
  type LucideIcon,
} from 'lucide-react'
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

export function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-8 opacity-0 blur-[4px]'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

export type GuideStep = {
  no: string
  title: string
  desc: string
  details: string[]
  icon: React.ReactNode
  tag?: string
}

export type GuideResource = { title: string; desc: string; href: string }

export type GuideProps = {
  // 헤더 뱃지·타이틀
  badge: { icon: React.ReactNode; text: string }
  titleTop: string
  titleBottom: string
  description: string

  // 상단 CTA 버튼
  primaryCta?: { label: string; href: string; external?: boolean }

  // 요약 배지 (3칸)
  stats?: { label: string; value: string }[]

  // 배경 (Spline 또는 단색 그라데이션)
  splineUrl?: string

  // 개요 체크리스트
  overviewTitle?: string
  overviewDesc?: string
  overviewItems?: { icon: React.ReactNode; title: string; desc: string }[]

  // 메인 스텝
  stepsLabel?: string
  stepsTitle?: string
  steps: GuideStep[]

  // 주의사항
  pitfalls?: { title: string; desc: string }[]

  // 외부 링크
  resources?: GuideResource[]

  // CTA 섹션
  ctaTitle?: string
  ctaDesc?: string
}

export function GuideTemplate(p: GuideProps) {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const h = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

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
      <section className="relative flex min-h-[80vh] items-center justify-center pt-[60px]">
        {p.splineUrl && (
          <div className="absolute inset-0 overflow-hidden">
            <iframe src={p.splineUrl} className="h-full w-full border-none" style={{ pointerEvents: 'none' }} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_30%,rgba(0,0,0,0.5)_100%)]" />

        <div className="relative z-10 mx-auto max-w-[960px] px-6 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-md">
              {p.badge.icon}
              <span className="text-[11px] font-semibold tracking-wide text-white/70">{p.badge.text}</span>
            </div>
          </Reveal>
          <Reveal delay={180}>
            <h1 className="mt-6 text-[40px] font-bold leading-[1.05] tracking-tight md:text-[60px]">
              <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">{p.titleTop}</span><br />
              <span className="bg-gradient-to-r from-[#82b1ff] via-white to-[#82b1ff] bg-clip-text text-transparent">{p.titleBottom}</span>
            </h1>
          </Reveal>
          <Reveal delay={360}>
            <p className="mx-auto mt-6 max-w-[600px] text-[15px] leading-relaxed text-white/55 whitespace-pre-line">{p.description}</p>
          </Reveal>
          <Reveal delay={540}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {p.primaryCta && (
                <a href={p.primaryCta.href} target={p.primaryCta.external === false ? undefined : '_blank'} rel="noreferrer"
                   className="group flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-[15px] font-bold text-black transition-all hover:bg-white/90 active:scale-95">
                  {p.primaryCta.label}
                  <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              )}
              <a href="#steps" className="rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-[15px] font-bold text-white/80 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white">
                단계별 보기
              </a>
            </div>
          </Reveal>

          {p.stats && p.stats.length > 0 && (
            <Reveal delay={720}>
              <div className="mt-12 grid grid-cols-3 gap-3 md:gap-6">
                {p.stats.map(s => (
                  <div key={s.label} className="rounded-2xl border border-white/8 bg-white/5 px-4 py-4 backdrop-blur-md">
                    <p className="text-[11px] text-white/40">{s.label}</p>
                    <p className="mt-1 text-[18px] font-bold md:text-[22px]">{s.value}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight className="h-5 w-5 rotate-90 text-white/20" />
        </div>
      </section>

      {/* 개요 */}
      {p.overviewItems && p.overviewItems.length > 0 && (
        <section className="border-t border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent py-24">
          <div className="mx-auto max-w-[1000px] px-6">
            <Reveal><p className="text-[12px] font-semibold text-[#82b1ff]">Overview</p></Reveal>
            <Reveal delay={80}>
              <h2 className="mt-3 text-[30px] font-bold leading-tight tracking-tight md:text-[36px]">{p.overviewTitle ?? '시작 전 체크'}</h2>
            </Reveal>
            {p.overviewDesc && (
              <Reveal delay={160}>
                <p className="mt-4 max-w-[620px] text-[15px] leading-relaxed text-white/50 whitespace-pre-line">{p.overviewDesc}</p>
              </Reveal>
            )}
            <div className="mt-10 grid gap-3 md:grid-cols-2">
              {p.overviewItems.map((c, i) => (
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
      )}

      {/* Steps */}
      <section id="steps" className="border-t border-white/5 py-24">
        <div className="mx-auto max-w-[1000px] px-6">
          <Reveal><p className="text-[12px] font-semibold text-[#82b1ff]">{p.stepsLabel ?? 'Step by Step'}</p></Reveal>
          <Reveal delay={80}>
            <h2 className="mt-3 text-[30px] font-bold leading-tight tracking-tight md:text-[36px]">{p.stepsTitle ?? '단계별 가이드'}</h2>
          </Reveal>

          <div className="mt-14 space-y-4">
            {p.steps.map((s, i) => (
              <Reveal key={s.no} delay={i * 60}>
                <div className="group relative flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition-all hover:border-white/15 hover:bg-white/[0.04] md:flex-row md:gap-6">
                  <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm">
                      <span className="bg-gradient-to-br from-white to-[#82b1ff] bg-clip-text text-[22px] font-bold text-transparent">{s.no}</span>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2979FF]/15 text-[#82b1ff] transition-transform group-hover:scale-110">
                      {s.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    {s.tag && <p className="text-[10px] font-semibold tracking-wide text-white/30">{s.tag}</p>}
                    <h3 className="mt-1 text-[20px] font-bold tracking-tight">{s.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-white/55 whitespace-pre-line">{s.desc}</p>
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

      {/* Pitfalls */}
      {p.pitfalls && p.pitfalls.length > 0 && (
        <section className="border-t border-white/5 bg-white/[0.01] py-24">
          <div className="mx-auto max-w-[1000px] px-6">
            <Reveal><p className="text-[12px] font-semibold text-amber-400/80">Pitfalls</p></Reveal>
            <Reveal delay={80}>
              <h2 className="mt-3 text-[28px] font-bold leading-tight tracking-tight md:text-[32px]">자주 막히는 부분</h2>
            </Reveal>

            <div className="mt-12 grid gap-3 md:grid-cols-2">
              {p.pitfalls.map((pf, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-5 transition-all hover:border-amber-500/30">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400/80" />
                    <div>
                      <p className="text-[14px] font-bold text-white/90">{pf.title}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-white/50">{pf.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Resources */}
      {p.resources && p.resources.length > 0 && (
        <section className="border-t border-white/5 py-24">
          <div className="mx-auto max-w-[1000px] px-6">
            <Reveal><p className="text-[12px] font-semibold text-[#82b1ff]">Resources</p></Reveal>
            <Reveal delay={80}>
              <h2 className="mt-3 text-[28px] font-bold leading-tight tracking-tight md:text-[32px]">공식 링크</h2>
            </Reveal>

            <div className="mt-12 grid gap-3 md:grid-cols-2">
              {p.resources.map((l, i) => (
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
      )}

      {/* CTA */}
      <section className="border-t border-white/5 bg-gradient-to-b from-transparent to-white/[0.02] py-28">
        <div className="mx-auto max-w-[720px] px-6 text-center">
          <Reveal>
            <h2 className="text-[34px] font-bold leading-tight tracking-tight md:text-[44px]">
              {p.ctaTitle ?? '등록이 복잡하면\n대행해 드려요'}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 whitespace-pre-line text-[15px] text-white/50">
              {p.ctaDesc ?? '제이씨랩이 진행하는 프로젝트는 개발자 계정 셋업부터 출시·운영까지 모두 포함됩니다.'}
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/about#문의" className="group flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-[15px] font-bold text-black transition-all hover:bg-white/90 active:scale-95">
                대행 문의하기 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/guides" className="rounded-xl border border-white/20 px-8 py-4 text-[15px] font-bold text-white/80 transition-all hover:bg-white/5 hover:text-white">
                다른 가이드 보기
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
              <Link href="/guides" className="transition-colors hover:text-white/50">가이드</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// 외부에서 lucide 아이콘 사용할 수 있게 re-export
export type { LucideIcon }
