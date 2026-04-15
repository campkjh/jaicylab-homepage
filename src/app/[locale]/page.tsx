'use client'

import { useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Smartphone, Server, Sparkles, Code2, Layers, Rocket } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { ClientMarquee } from '@/components/ClientMarquee'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Reveal } from '@/components/Reveal'

type Locale = 'ko' | 'en' | 'ja' | 'zh'

const CONTENT: Record<Locale, {
  brand: string
  nav: { about: string; services: string; estimate: string; guides: string; contact: string; cta: string }
  hero: { eyebrow: string; title1: string; title2: string; desc: string; cta1: string; cta2: string; refs: string }
  services: { label: string; title: string; items: { title: string; desc: string }[] }
  process: { label: string; title: string; items: { phase: string; title: string; desc: string }[] }
  cta: { title: string; desc: string; button: string }
  footer: { about: string; contact: string }
}> = {
  ko: {
    brand: '제이씨랩',
    nav: { about: '회사소개', services: '서비스', estimate: '자가견적', guides: '가이드', contact: '문의', cta: '프로젝트 의뢰' },
    hero: {
      eyebrow: 'APP DEVELOPMENT STUDIO',
      title1: '아이디어를',
      title2: '앱으로.',
      desc: '제이씨랩은 iOS · Android · 웹 · 백엔드 · AI 통합까지\n제품의 처음과 끝을 함께 설계하는 앱 개발 스튜디오입니다.',
      cta1: '30초 견적 받기',
      cta2: '회사소개 보기',
      refs: '함께한 팀 · 레퍼런스',
    },
    services: {
      label: 'SERVICES', title: '제품 전 단계를\n하나의 팀으로 커버합니다',
      items: [
        { title: '모바일 앱', desc: 'iOS · Android 네이티브와 React Native / Flutter 크로스플랫폼까지 요구사항에 맞춰 설계합니다.' },
        { title: '웹 · 어드민', desc: 'Next.js 기반 반응형 웹과 운영자용 어드민 대시보드를 제품과 함께 구축합니다.' },
        { title: '백엔드 · 인프라', desc: 'Supabase, Vercel, AWS 기반 확장 가능한 서버 아키텍처와 DB 설계를 제공합니다.' },
        { title: 'AI 통합', desc: 'LLM · 음성 · 이미지 모델을 제품 워크플로우에 자연스럽게 녹여냅니다.' },
        { title: 'MVP · PoC', desc: '4–8주 단위 MVP 스프린트로 가설을 빠르게 검증하고 다음 단계를 함께 결정합니다.' },
        { title: '운영 · 성장', desc: '런칭 이후의 분석, 운영 자동화, 점진적 기능 확장을 같은 팀이 이어갑니다.' },
      ],
    },
    process: {
      label: 'PROCESS', title: '우리가 일하는 방식',
      items: [
        { phase: '01', title: 'Discovery', desc: '문제 정의, 사용자 시나리오, 기술 조사. 무엇을 만들 것인가에 답합니다.' },
        { phase: '02', title: 'Design', desc: 'UX 플로우와 UI 시안, 데이터 모델까지 함께 설계해 개발 리스크를 줄입니다.' },
        { phase: '03', title: 'Build', desc: '2주 단위 스프린트로 데모를 공유하며 빠르게 합의하고 빠르게 반영합니다.' },
        { phase: '04', title: 'Launch & Grow', desc: '스토어 출시, 분석 도입, 운영 자동화까지 같은 팀이 책임집니다.' },
      ],
    },
    cta: { title: '함께 만들어 볼까요?', desc: '아이디어 단계여도 좋습니다. 가볍게 이야기 나눠보세요.', button: '프로젝트 의뢰하기' },
    footer: { about: '회사소개', contact: '문의' },
  },
  en: {
    brand: 'JAICYLAB',
    nav: { about: 'About', services: 'Services', estimate: 'Estimate', guides: 'Guides', contact: 'Contact', cta: 'Start a Project' },
    hero: {
      eyebrow: 'APP DEVELOPMENT STUDIO',
      title1: 'Ideas into',
      title2: 'Apps.',
      desc: 'JAICYLAB is a product studio covering iOS, Android, web,\nbackend, and AI integration — end to end, one team.',
      cta1: 'Get a 30-sec Estimate',
      cta2: 'About the Studio',
      refs: 'Teams & References',
    },
    services: {
      label: 'SERVICES', title: 'One team covering\nthe full product lifecycle',
      items: [
        { title: 'Mobile Apps', desc: 'Native iOS & Android plus React Native / Flutter cross-platform — matched to your requirements.' },
        { title: 'Web & Admin', desc: 'Next.js responsive web and operator admin dashboards, designed alongside the product.' },
        { title: 'Backend & Infra', desc: 'Scalable server architecture and DB design on Supabase, Vercel, and AWS.' },
        { title: 'AI Integration', desc: 'LLM, voice, and vision models woven naturally into your product workflow.' },
        { title: 'MVP & PoC', desc: '4–8 week MVP sprints to validate hypotheses fast and decide next steps together.' },
        { title: 'Ops & Growth', desc: 'Post-launch analytics, operational automation, and iterative growth from the same team.' },
      ],
    },
    process: {
      label: 'PROCESS', title: 'How we work',
      items: [
        { phase: '01', title: 'Discovery', desc: 'Problem framing, user scenarios, tech research. We answer what to build.' },
        { phase: '02', title: 'Design', desc: 'UX flows, UI comps, and data models designed together to de-risk the build.' },
        { phase: '03', title: 'Build', desc: '2-week sprints with shared demos — fast alignment, fast iteration.' },
        { phase: '04', title: 'Launch & Grow', desc: 'Store release, analytics, and ops automation — the same team sees it through.' },
      ],
    },
    cta: { title: 'Shall we build it together?', desc: 'Even an idea is enough. Let\'s have a casual chat.', button: 'Start a Project' },
    footer: { about: 'About', contact: 'Contact' },
  },
  ja: {
    brand: 'JAICYLAB',
    nav: { about: '会社紹介', services: 'サービス', estimate: '見積もり', guides: 'ガイド', contact: 'お問い合わせ', cta: 'プロジェクト依頼' },
    hero: {
      eyebrow: 'APP DEVELOPMENT STUDIO',
      title1: 'アイデアを',
      title2: 'アプリへ。',
      desc: 'JAICYLABはiOS・Android・Web・バックエンド・AI統合まで、\n製品の最初から最後まで一緒に設計するアプリ開発スタジオです。',
      cta1: '30秒で見積もり',
      cta2: '会社紹介を見る',
      refs: '協業チーム・実績',
    },
    services: {
      label: 'SERVICES', title: '製品の全工程を\nワンチームで担います',
      items: [
        { title: 'モバイルアプリ', desc: 'iOS・Androidネイティブ、React Native・Flutterクロスプラットフォームまで要件に合わせて設計します。' },
        { title: 'Web・管理画面', desc: 'Next.jsベースのレスポンシブWebと運用向け管理ダッシュボードを製品と一緒に構築します。' },
        { title: 'バックエンド・インフラ', desc: 'Supabase・Vercel・AWSをベースにスケーラブルなサーバー設計とDB設計を提供します。' },
        { title: 'AI統合', desc: 'LLM・音声・画像モデルを製品フローに自然に組み込みます。' },
        { title: 'MVP・PoC', desc: '4〜8週単位のMVPスプリントで仮説を素早く検証し、次のステップを一緒に決めます。' },
        { title: '運用・グロース', desc: 'ローンチ後の分析、運用自動化、段階的な機能拡張まで同じチームが担います。' },
      ],
    },
    process: {
      label: 'PROCESS', title: '私たちの進め方',
      items: [
        { phase: '01', title: 'Discovery', desc: '課題定義・ユーザーシナリオ・技術調査。「何を作るか」に答えます。' },
        { phase: '02', title: 'Design', desc: 'UXフロー、UI案、データモデルまで一緒に設計し開発リスクを下げます。' },
        { phase: '03', title: 'Build', desc: '2週間スプリントでデモを共有し、素早く合意・素早く反映します。' },
        { phase: '04', title: 'Launch & Grow', desc: 'ストア公開、分析導入、運用自動化まで同じチームが責任を持ちます。' },
      ],
    },
    cta: { title: '一緒に作りませんか?', desc: 'アイデア段階でも大丈夫です。気軽にご相談ください。', button: 'プロジェクトを依頼する' },
    footer: { about: '会社紹介', contact: 'お問い合わせ' },
  },
  zh: {
    brand: 'JAICYLAB',
    nav: { about: '公司介绍', services: '服务', estimate: '在线报价', guides: '指南', contact: '联系', cta: '委托项目' },
    hero: {
      eyebrow: 'APP DEVELOPMENT STUDIO',
      title1: '把创意',
      title2: '变成应用。',
      desc: 'JAICYLAB 涵盖 iOS · Android · Web · 后端 · AI 集成,\n由一支团队从头到尾完成产品的设计与实现。',
      cta1: '30 秒获取报价',
      cta2: '了解公司',
      refs: '合作团队与案例',
    },
    services: {
      label: 'SERVICES', title: '一支团队覆盖\n产品的全流程',
      items: [
        { title: '移动应用', desc: '从 iOS · Android 原生到 React Native / Flutter 跨平台,根据需求量身设计。' },
        { title: 'Web · 管理后台', desc: '基于 Next.js 的响应式 Web 与运营管理后台,与产品一同构建。' },
        { title: '后端 · 基础设施', desc: '基于 Supabase、Vercel、AWS 的可扩展服务端架构与数据库设计。' },
        { title: 'AI 集成', desc: '将 LLM、语音、图像模型自然地融入产品工作流。' },
        { title: 'MVP · PoC', desc: '4–8 周 MVP 冲刺快速验证假设,共同决定下一步。' },
        { title: '运营 · 增长', desc: '上线后的数据分析、运营自动化与迭代拓展,由同一团队承担。' },
      ],
    },
    process: {
      label: 'PROCESS', title: '我们的工作方式',
      items: [
        { phase: '01', title: 'Discovery', desc: '定义问题、梳理用户场景、做技术调研,回答"要做什么"。' },
        { phase: '02', title: 'Design', desc: 'UX 流程、UI 稿、数据模型一起设计,降低开发风险。' },
        { phase: '03', title: 'Build', desc: '两周一个冲刺,通过 Demo 快速对齐与迭代。' },
        { phase: '04', title: 'Launch & Grow', desc: '上架发布、数据分析、运营自动化,由同一团队持续跟进。' },
      ],
    },
    cta: { title: '一起打造吧?', desc: '有想法就足够了,欢迎轻松聊聊。', button: '委托项目' },
    footer: { about: '公司介绍', contact: '联系' },
  },
}

export default function HomePage() {
  const locale = useLocale() as Locale
  const c = CONTENT[locale] ?? CONTENT.ko

  const serviceIcons = [
    <Smartphone key="s1" className="h-6 w-6" />,
    <Code2 key="s2" className="h-6 w-6" />,
    <Server key="s3" className="h-6 w-6" />,
    <Sparkles key="s4" className="h-6 w-6" />,
    <Layers key="s5" className="h-6 w-6" />,
    <Rocket key="s6" className="h-6 w-6" />,
  ]

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <header className="fixed inset-x-0 top-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/5">
        <div className="mx-auto flex h-[60px] max-w-[1200px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <Logo height={22} className="text-white" />
            <span className="text-[12px] font-normal text-white/30">{c.brand}</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/about" className="text-[13px] font-medium text-white/40 transition-all hover:text-white">{c.nav.about}</Link>
            <a href="#services" className="text-[13px] font-medium text-white/40 transition-all hover:text-white">{c.nav.services}</a>
            <Link href="/estimate" className="text-[13px] font-medium text-white/40 transition-all hover:text-white">{c.nav.estimate}</Link>
            <Link href="/guides" className="text-[13px] font-medium text-white/40 transition-all hover:text-white">{c.nav.guides}</Link>
            <Link href="/about#contact" className="text-[13px] font-medium text-white/40 transition-all hover:text-white">{c.nav.contact}</Link>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/about#contact" className="bg-white px-5 py-2 text-[13px] font-bold text-black transition-all hover:bg-white/90 active:scale-95">{c.nav.cta}</Link>
          </div>
        </div>
      </header>

      <section className="relative flex min-h-screen pt-[60px]">
        <div className="relative hidden w-[48%] overflow-hidden lg:block">
          <iframe src="https://my.spline.design/radialglass-FUwYApl0VW1nPrvtevgrvChJ/" frameBorder="0" className="absolute inset-0 h-full w-full" style={{ border: 'none' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#050505]" />
        </div>
        <div className="absolute inset-0 lg:hidden">
          <iframe src="https://my.spline.design/radialglass-FUwYApl0VW1nPrvtevgrvChJ/" frameBorder="0" className="h-full w-full opacity-30" style={{ border: 'none', pointerEvents: 'none' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 via-transparent to-[#050505]" />
        </div>
        <div className="relative z-10 flex flex-1 items-center px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[560px]"
          >
            <p className="mb-4 text-[12px] font-bold tracking-wide text-[#2979FF]">{c.hero.eyebrow}</p>
            <h1 className="text-[44px] font-bold leading-[1.05] tracking-tight md:text-[64px]">
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">{c.hero.title1}</span><br />
              <span className="bg-gradient-to-r from-[#2979FF] to-[#82b1ff] bg-clip-text text-transparent">{c.hero.title2}</span>
            </h1>
            <p className="mt-6 whitespace-pre-line text-[15px] leading-relaxed text-white/40">{c.hero.desc}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/estimate" className="group flex items-center gap-2 bg-white px-7 py-3.5 text-[15px] font-bold text-black transition-all hover:bg-white/90 active:scale-95">
                {c.hero.cta1}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/about" className="border border-white/15 px-7 py-3.5 text-[15px] font-bold text-white/70 transition-all hover:bg-white/5 hover:text-white">
                {c.hero.cta2}
              </Link>
            </div>
            <div className="mt-10">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-white/30">{c.hero.refs}</p>
              <ClientMarquee />
            </div>
            <div className="mt-12 flex flex-wrap gap-2">
              {['iOS', 'Android', 'React Native', 'Next.js', 'Node.js', 'AI / LLM'].map((t) => (
                <span key={t} className="border border-white/8 bg-white/[0.02] px-3 py-1.5 text-[11px] tracking-wider text-white/40">{t}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="services" className="border-t border-white/5 py-28">
        <div className="mx-auto max-w-[1100px] px-6">
          <Reveal>
            <p className="text-[11px] font-bold tracking-wide text-[#2979FF]">{c.services.label}</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-3 whitespace-pre-line text-[36px] font-bold tracking-tight">{c.services.title}</h2>
          </Reveal>
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {c.services.items.map((s, i) => (
              <Reveal key={i} delay={i * 60}>
                <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="group border border-white/8 p-6 transition-colors duration-300 hover:border-[#2979FF]/30 hover:bg-[#2979FF]/[0.03] hover:shadow-[0_8px_32px_rgba(41,121,255,0.08)]">
                  <div className="flex h-12 w-12 items-center justify-center bg-[#2979FF]/10 text-[#2979FF] transition-transform duration-300 group-hover:scale-110">{serviceIcons[i]}</div>
                  <h3 className="mt-4 text-[17px] font-bold">{s.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/40">{s.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="border-t border-white/5 bg-white/[0.01] py-28">
        <div className="mx-auto max-w-[1000px] px-6">
          <Reveal>
            <p className="text-[11px] font-bold tracking-wide text-[#2979FF]">{c.process.label}</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-3 text-[32px] font-bold tracking-tight">{c.process.title}</h2>
          </Reveal>
          <div className="mt-12 space-y-4">
            {c.process.items.map((p, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="flex items-start gap-6 border-l-2 border-[#2979FF] pl-6 py-2 transition-all hover:pl-8">
                  <span className="text-[32px] font-bold text-[#2979FF]/20">{p.phase}</span>
                  <div>
                    <h3 className="text-[17px] font-bold">{p.title}</h3>
                    <p className="mt-1 text-[13px] text-white/40">{p.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 py-28">
        <div className="mx-auto max-w-[800px] px-6 text-center">
          <h2 className="text-[36px] font-bold leading-tight md:text-[48px]">
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">{c.cta.title}</span>
          </h2>
          <p className="mt-4 text-[15px] text-white/40">{c.cta.desc}</p>
          <Link href="/about#contact" className="group mt-10 inline-flex items-center gap-2 bg-white px-8 py-4 text-[15px] font-bold text-black transition-all animate-[pulseRing_2.5s_ease-out_infinite] hover:bg-white/90 hover:animate-none hover:scale-[1.03] active:scale-95">
            {c.cta.button} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-3 px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Logo height={20} className="text-white" />
              <span className="text-[13px] text-white/30">{c.brand}</span>
            </div>
            <p className="mt-2 text-[11px] text-white/15">App Development Studio · jaicylab2009@gmail.com</p>
            <p className="text-[10px] text-white/10">Copyright &copy; JAICYLAB. All rights reserved.</p>
          </div>
          <div className="flex gap-4 text-[12px] text-white/25">
            <Link href="/about" className="transition-colors hover:text-white/50">{c.footer.about}</Link>
            <Link href="/about#contact" className="transition-colors hover:text-white/50">{c.footer.contact}</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
