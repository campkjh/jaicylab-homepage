'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight, CheckCircle2, AlertTriangle, ExternalLink, ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Reveal } from '@/components/Reveal'

export { Reveal }

type Locale = 'ko' | 'en' | 'ja' | 'zh'

const CHROME: Record<Locale, {
  brand: string
  nav: { about: string; estimate: string; guides: string; contact: string; cta: string }
  stepByStep: string; stepsTitle: string; overviewTitle: string
  pitfallsLabel: string; pitfallsTitle: string
  resourcesLabel: string; resourcesTitle: string
  viewSteps: string
  ctaTitleDefault: string; ctaDescDefault: string
  ctaAsk: string; ctaOther: string
  footerHome: string; footerAbout: string; footerEstimate: string; footerGuides: string
}> = {
  ko: {
    brand: '제이씨랩',
    nav: { about: '회사소개', estimate: '자가견적', guides: '가이드', contact: '문의', cta: '프로젝트 의뢰' },
    stepByStep: 'Step by Step', stepsTitle: '단계별 가이드', overviewTitle: '시작 전 체크',
    pitfallsLabel: 'Pitfalls', pitfallsTitle: '자주 막히는 부분',
    resourcesLabel: 'Resources', resourcesTitle: '공식 링크',
    viewSteps: '단계별 보기',
    ctaTitleDefault: '등록이 복잡하면\n대행해 드려요',
    ctaDescDefault: '제이씨랩이 진행하는 프로젝트는 개발자 계정 셋업부터 출시·운영까지 모두 포함됩니다.',
    ctaAsk: '대행 문의하기', ctaOther: '다른 가이드 보기',
    footerHome: '홈', footerAbout: '회사소개', footerEstimate: '자가견적', footerGuides: '가이드',
  },
  en: {
    brand: 'JAICYLAB',
    nav: { about: 'About', estimate: 'Estimate', guides: 'Guides', contact: 'Contact', cta: 'Start a Project' },
    stepByStep: 'Step by Step', stepsTitle: 'Step-by-step Guide', overviewTitle: 'Before you start',
    pitfallsLabel: 'Pitfalls', pitfallsTitle: 'Common blockers',
    resourcesLabel: 'Resources', resourcesTitle: 'Official links',
    viewSteps: 'View steps',
    ctaTitleDefault: 'If setup is a headache,\nwe\'ll handle it',
    ctaDescDefault: 'Projects at JAICYLAB include everything from developer account setup to launch and ops.',
    ctaAsk: 'Ask us to handle it', ctaOther: 'More guides',
    footerHome: 'Home', footerAbout: 'About', footerEstimate: 'Estimate', footerGuides: 'Guides',
  },
  ja: {
    brand: 'JAICYLAB',
    nav: { about: '会社紹介', estimate: '見積もり', guides: 'ガイド', contact: 'お問い合わせ', cta: 'プロジェクト依頼' },
    stepByStep: 'Step by Step', stepsTitle: 'ステップ別ガイド', overviewTitle: '開始前チェック',
    pitfallsLabel: 'Pitfalls', pitfallsTitle: '詰まりやすいポイント',
    resourcesLabel: 'Resources', resourcesTitle: '公式リンク',
    viewSteps: 'ステップを見る',
    ctaTitleDefault: '登録が面倒なら\n代行します',
    ctaDescDefault: 'JAICYLABのプロジェクトには開発者アカウントの準備から公開・運用まで一貫して含まれます。',
    ctaAsk: '代行を依頼する', ctaOther: '他のガイドを見る',
    footerHome: 'ホーム', footerAbout: '会社紹介', footerEstimate: '見積もり', footerGuides: 'ガイド',
  },
  zh: {
    brand: 'JAICYLAB',
    nav: { about: '公司介绍', estimate: '在线报价', guides: '指南', contact: '联系', cta: '委托项目' },
    stepByStep: 'Step by Step', stepsTitle: '分步指南', overviewTitle: '开始前检查',
    pitfallsLabel: 'Pitfalls', pitfallsTitle: '常见卡点',
    resourcesLabel: 'Resources', resourcesTitle: '官方链接',
    viewSteps: '查看步骤',
    ctaTitleDefault: '嫌配置麻烦?\n可以全权代办',
    ctaDescDefault: 'JAICYLAB 承接的项目,从开发者账号配置到上线与运营全部包含在内。',
    ctaAsk: '委托代办', ctaOther: '更多指南',
    footerHome: '首页', footerAbout: '公司介绍', footerEstimate: '在线报价', footerGuides: '指南',
  },
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
  badge: { icon: React.ReactNode; text: string }
  titleTop: string
  titleBottom: string
  description: string
  primaryCta?: { label: string; href: string; external?: boolean }
  stats?: { label: string; value: string }[]
  splineUrl?: string
  overviewTitle?: string
  overviewDesc?: string
  overviewItems?: { icon: React.ReactNode; title: string; desc: string }[]
  stepsLabel?: string
  stepsTitle?: string
  steps: GuideStep[]
  pitfalls?: { title: string; desc: string }[]
  resources?: GuideResource[]
  ctaTitle?: string
  ctaDesc?: string
}

export function GuideTemplate(p: GuideProps) {
  const [scrollY, setScrollY] = useState(0)
  const locale = useLocale() as Locale
  const cm = CHROME[locale] ?? CHROME.ko
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
            <span className="text-[12px] font-normal text-white/30">{cm.brand}</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/about" className="text-[13px] font-medium text-white/40 transition-all hover:text-white">{cm.nav.about}</Link>
            <Link href="/estimate" className="text-[13px] font-medium text-white/40 transition-all hover:text-white">{cm.nav.estimate}</Link>
            <Link href="/guides" className="text-[13px] font-bold text-white transition-all">{cm.nav.guides}</Link>
            <Link href="/about#contact" className="text-[13px] font-medium text-white/40 transition-all hover:text-white">{cm.nav.contact}</Link>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/about#contact" className="rounded-xl bg-white px-5 py-2 text-[13px] font-bold text-black transition-all hover:bg-white/90 active:scale-95">{cm.nav.cta}</Link>
          </div>
        </div>
      </header>

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
                {cm.viewSteps}
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

      {p.overviewItems && p.overviewItems.length > 0 && (
        <section className="border-t border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent py-24">
          <div className="mx-auto max-w-[1000px] px-6">
            <Reveal><p className="text-[12px] font-semibold text-[#82b1ff]">Overview</p></Reveal>
            <Reveal delay={80}>
              <h2 className="mt-3 text-[30px] font-bold leading-tight tracking-tight md:text-[36px]">{p.overviewTitle ?? cm.overviewTitle}</h2>
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

      <section id="steps" className="border-t border-white/5 py-24">
        <div className="mx-auto max-w-[1000px] px-6">
          <Reveal><p className="text-[12px] font-semibold text-[#82b1ff]">{p.stepsLabel ?? cm.stepByStep}</p></Reveal>
          <Reveal delay={80}>
            <h2 className="mt-3 text-[30px] font-bold leading-tight tracking-tight md:text-[36px]">{p.stepsTitle ?? cm.stepsTitle}</h2>
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

      {p.pitfalls && p.pitfalls.length > 0 && (
        <section className="border-t border-white/5 bg-white/[0.01] py-24">
          <div className="mx-auto max-w-[1000px] px-6">
            <Reveal><p className="text-[12px] font-semibold text-amber-400/80">{cm.pitfallsLabel}</p></Reveal>
            <Reveal delay={80}>
              <h2 className="mt-3 text-[28px] font-bold leading-tight tracking-tight md:text-[32px]">{cm.pitfallsTitle}</h2>
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

      {p.resources && p.resources.length > 0 && (
        <section className="border-t border-white/5 py-24">
          <div className="mx-auto max-w-[1000px] px-6">
            <Reveal><p className="text-[12px] font-semibold text-[#82b1ff]">{cm.resourcesLabel}</p></Reveal>
            <Reveal delay={80}>
              <h2 className="mt-3 text-[28px] font-bold leading-tight tracking-tight md:text-[32px]">{cm.resourcesTitle}</h2>
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

      <section className="border-t border-white/5 bg-gradient-to-b from-transparent to-white/[0.02] py-28">
        <div className="mx-auto max-w-[720px] px-6 text-center">
          <Reveal>
            <h2 className="whitespace-pre-line text-[34px] font-bold leading-tight tracking-tight md:text-[44px]">
              {p.ctaTitle ?? cm.ctaTitleDefault}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 whitespace-pre-line text-[15px] text-white/50">
              {p.ctaDesc ?? cm.ctaDescDefault}
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/about#contact" className="group flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-[15px] font-bold text-black transition-all hover:bg-white/90 active:scale-95">
                {cm.ctaAsk} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/guides" className="rounded-xl border border-white/20 px-8 py-4 text-[15px] font-bold text-white/80 transition-all hover:bg-white/5 hover:text-white">
                {cm.ctaOther}
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
                <span className="text-[13px] text-white/30">{cm.brand}</span>
              </div>
              <p className="mt-2 text-[11px] text-white/15">App Development Studio · jaicylab2009@gmail.com</p>
              <p className="text-[10px] text-white/10">Copyright &copy; JAICYLAB. All rights reserved.</p>
            </div>
            <div className="flex gap-4 text-[12px] text-white/25">
              <Link href="/" className="transition-colors hover:text-white/50">{cm.footerHome}</Link>
              <Link href="/about" className="transition-colors hover:text-white/50">{cm.footerAbout}</Link>
              <Link href="/estimate" className="transition-colors hover:text-white/50">{cm.footerEstimate}</Link>
              <Link href="/guides" className="transition-colors hover:text-white/50">{cm.footerGuides}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export type { LucideIcon }
