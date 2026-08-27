'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import Image, { type StaticImageData } from 'next/image'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { MobileMenu } from '@/components/MobileMenu'
import { Reveal, Stagger, StaggerItem, PressableMotion } from '@/components/Reveal'
import { UiIcon } from '@/components/estimate/UiIcon'
import AppleIcon from './apple-developer.svg'
import PlayIcon from './google-play.svg'
import KakaoIcon from './kakao.svg'
import NaverDevIcon from './naver-developer.svg'
import FirebaseIcon from './firebase.svg'
import NaverCloudIcon from './naver-cloud.svg'
import AwsIcon from './aws.svg'
import SupabaseIcon from './supabase.svg'
import VercelIcon from './vercel.svg'
import TossIcon from './toss.svg'
import PortoneIcon from './portone.svg'
import ChannelTalkIcon from './channeltalk.svg'

type Locale = 'ko' | 'en' | 'ja' | 'zh'


type GuideCard = {
  href: string
  icon: StaticImageData
  iconBg?: string
  preview?: string
  category: string
  title: string
  desc: string
  meta: string
  accent: string
}

const ICON: Record<string, StaticImageData> = {
  apple: AppleIcon, play: PlayIcon, kakao: KakaoIcon, naverdev: NaverDevIcon,
  firebase: FirebaseIcon, ncp: NaverCloudIcon, aws: AwsIcon, supabase: SupabaseIcon,
  vercel: VercelIcon, toss: TossIcon, portone: PortoneIcon, channel: ChannelTalkIcon,
}

type Group = { label: string; items: GuideCard[] }

const CARDS_KO: Group[] = [
  { label: '앱 스토어 · 개발자 계정', items: [
    { href: '/guides/apple-developer', icon: ICON.apple, iconBg: '#000000', preview: '/videoframe_65606-1-832x468.jpg', category: 'APPLE', title: 'Apple Developer 계정', desc: 'iOS 앱 출시에 필수. 개인/법인 선택부터 DUNS, 연회비 $99 결제, App Store Connect 셋업까지.', meta: '$99/년 · 1–7일 심사', accent: '' },
    { href: '/guides/google-play', icon: ICON.play, iconBg: '#ffffff', preview: '/148e7bca11442f664e89e844d628c247.jpg', category: 'GOOGLE PLAY', title: 'Google Play Console', desc: 'Android 앱 등록. $25 일회성 등록비, 신원 확인, Closed Testing 14일 규정까지.', meta: '$25 (1회) · 1–3일 심사', accent: '' },
  ]},
  { label: '소셜 로그인 · 국내 오픈 API', items: [
    { href: '/guides/kakao-developers', icon: ICON.kakao, iconBg: '#FFCA2C', preview: '/f4ee65f8331b2f59809a66f17f4f6f83.gif', category: 'KAKAO', title: 'Kakao Developers', desc: '카카오 로그인·지도·공유하기·알림톡. 앱 등록, 키 해시, 동의 항목 심사까지.', meta: '무료 · 일부 항목 심사 필요', accent: '' },
    { href: '/guides/naver-developers', icon: ICON.naverdev, iconBg: '#00E261', preview: '/8f53dc8db08bf3d52825846e9825cf9d.jpg', category: 'NAVER', title: 'Naver Developers', desc: '네이버 로그인·검색·Papago 번역. Client ID/Secret 발급, Callback URL 설정.', meta: '무료 · 즉시 발급', accent: '' },
  ]},
  { label: '결제 · PG', items: [
    { href: '/guides/toss-payments', icon: ICON.toss, preview: '/tds-kv-text-hero.png', category: 'TOSS PAYMENTS', title: '토스페이먼츠 가맹점', desc: 'PG 연동. 테스트 키 → 가맹점 계약 → 실서비스 키 → 웹훅·정산 자동화.', meta: '2–5일 심사 · 수수료 2.5~3.5%', accent: '' },
    { href: '/guides/portone', icon: ICON.portone, preview: '/cb.png', category: 'PORTONE', title: '포트원 (구 아임포트)', desc: '여러 PG를 하나의 API로. V2 채널 등록, 결제 검증, 웹훅 서명까지.', meta: '포트원 무료 · PG 수수료만', accent: '' },
  ]},
]

const CARDS_EN: Group[] = [
  { label: 'App Stores & Developer Accounts', items: [
    { href: '/guides/apple-developer', icon: ICON.apple, iconBg: '#000000', preview: '/videoframe_65606-1-832x468.jpg', category: 'APPLE', title: 'Apple Developer Account', desc: 'Required for iOS release. Individual vs. organization, DUNS, $99 annual fee, App Store Connect setup.', meta: '$99/year · 1–7 day review', accent: '' },
    { href: '/guides/google-play', icon: ICON.play, iconBg: '#ffffff', preview: '/148e7bca11442f664e89e844d628c247.jpg', category: 'GOOGLE PLAY', title: 'Google Play Console', desc: 'Android app registration. $25 one-time fee, identity verification, 14-day Closed Testing rule.', meta: '$25 (once) · 1–3 day review', accent: '' },
  ]},
  { label: 'Social Login & Korean Open APIs', items: [
    { href: '/guides/kakao-developers', icon: ICON.kakao, iconBg: '#FFCA2C', preview: '/f4ee65f8331b2f59809a66f17f4f6f83.gif', category: 'KAKAO', title: 'Kakao Developers', desc: 'Kakao Login, Maps, Share, AlimTalk. App registration, key hash, consent-item review.', meta: 'Free · some items reviewed', accent: '' },
    { href: '/guides/naver-developers', icon: ICON.naverdev, iconBg: '#00E261', preview: '/8f53dc8db08bf3d52825846e9825cf9d.jpg', category: 'NAVER', title: 'Naver Developers', desc: 'Naver Login, Search, Papago Translate. Client ID/Secret issuance, callback URL setup.', meta: 'Free · instant issuance', accent: '' },
  ]},
  { label: 'Payments & PG', items: [
    { href: '/guides/toss-payments', icon: ICON.toss, preview: '/tds-kv-text-hero.png', category: 'TOSS PAYMENTS', title: 'Toss Payments Merchant', desc: 'PG integration: test keys → merchant contract → live keys → webhook & settlement automation.', meta: '2–5 day review · 2.5–3.5% fee', accent: '' },
    { href: '/guides/portone', icon: ICON.portone, preview: '/cb.png', category: 'PORTONE', title: 'PortOne (formerly Iamport)', desc: 'Multiple PGs behind one API. V2 channel registration, payment verification, webhook signatures.', meta: 'PortOne free · PG fees only', accent: '' },
  ]},
]

const CARDS_JA: Group[] = [
  { label: 'アプリストア・開発者アカウント', items: [
    { href: '/guides/apple-developer', icon: ICON.apple, iconBg: '#000000', preview: '/videoframe_65606-1-832x468.jpg', category: 'APPLE', title: 'Apple Developerアカウント', desc: 'iOSアプリ公開に必須。個人/法人の選択、DUNS、年会費$99、App Store Connectのセットアップまで。', meta: '$99/年 · 1〜7日審査', accent: '' },
    { href: '/guides/google-play', icon: ICON.play, iconBg: '#ffffff', preview: '/148e7bca11442f664e89e844d628c247.jpg', category: 'GOOGLE PLAY', title: 'Google Play Console', desc: 'Androidアプリ登録。$25一回払い、本人確認、Closed Testing 14日ルールまで。', meta: '$25(1回) · 1〜3日審査', accent: '' },
  ]},
  { label: 'ソーシャルログイン・韓国オープンAPI', items: [
    { href: '/guides/kakao-developers', icon: ICON.kakao, iconBg: '#FFCA2C', preview: '/f4ee65f8331b2f59809a66f17f4f6f83.gif', category: 'KAKAO', title: 'Kakao Developers', desc: 'Kakaoログイン・地図・シェア・アラームトーク。アプリ登録、キーハッシュ、同意項目の審査まで。', meta: '無料 · 一部審査あり', accent: '' },
    { href: '/guides/naver-developers', icon: ICON.naverdev, iconBg: '#00E261', preview: '/8f53dc8db08bf3d52825846e9825cf9d.jpg', category: 'NAVER', title: 'Naver Developers', desc: 'Naverログイン・検索・Papago翻訳。Client ID/Secret発行、Callback URL設定。', meta: '無料 · 即時発行', accent: '' },
  ]},
  { label: '決済・PG', items: [
    { href: '/guides/toss-payments', icon: ICON.toss, preview: '/tds-kv-text-hero.png', category: 'TOSS PAYMENTS', title: 'トスペイメンツ加盟店', desc: 'PG連携。テストキー → 加盟店契約 → 本番キー → Webhook・精算の自動化。', meta: '2〜5日審査 · 手数料2.5〜3.5%', accent: '' },
    { href: '/guides/portone', icon: ICON.portone, preview: '/cb.png', category: 'PORTONE', title: 'PortOne(旧Iamport)', desc: '複数のPGを1つのAPIで。V2チャンネル登録、決済検証、Webhook署名まで。', meta: 'PortOne無料 · PG手数料のみ', accent: '' },
  ]},
]

const CARDS_ZH: Group[] = [
  { label: '应用商店 · 开发者账号', items: [
    { href: '/guides/apple-developer', icon: ICON.apple, iconBg: '#000000', preview: '/videoframe_65606-1-832x468.jpg', category: 'APPLE', title: 'Apple Developer 账号', desc: 'iOS 上架必备。个人/公司选择、DUNS、$99 年费、App Store Connect 配置。', meta: '$99/年 · 1–7 天审核', accent: '' },
    { href: '/guides/google-play', icon: ICON.play, iconBg: '#ffffff', preview: '/148e7bca11442f664e89e844d628c247.jpg', category: 'GOOGLE PLAY', title: 'Google Play Console', desc: 'Android 应用注册。$25 一次性费用、身份验证、Closed Testing 14 天规则。', meta: '$25(一次性) · 1–3 天审核', accent: '' },
  ]},
  { label: '社交登录 · 韩国开放 API', items: [
    { href: '/guides/kakao-developers', icon: ICON.kakao, iconBg: '#FFCA2C', preview: '/f4ee65f8331b2f59809a66f17f4f6f83.gif', category: 'KAKAO', title: 'Kakao Developers', desc: 'Kakao 登录、地图、分享、AlimTalk。应用注册、Key Hash、同意项审核。', meta: '免费 · 部分审核', accent: '' },
    { href: '/guides/naver-developers', icon: ICON.naverdev, iconBg: '#00E261', preview: '/8f53dc8db08bf3d52825846e9825cf9d.jpg', category: 'NAVER', title: 'Naver Developers', desc: 'Naver 登录、搜索、Papago 翻译。Client ID/Secret 申请、回调 URL 设置。', meta: '免费 · 即时发放', accent: '' },
  ]},
  { label: '支付 · PG', items: [
    { href: '/guides/toss-payments', icon: ICON.toss, preview: '/tds-kv-text-hero.png', category: 'TOSS PAYMENTS', title: 'Toss Payments 商户', desc: 'PG 对接:测试密钥 → 商户签约 → 生产密钥 → Webhook 与清算自动化。', meta: '2–5 天审核 · 费率 2.5~3.5%', accent: '' },
    { href: '/guides/portone', icon: ICON.portone, preview: '/cb.png', category: 'PORTONE', title: 'PortOne(原 Iamport)', desc: '多家 PG 统一到一个 API。V2 Channel 注册、支付校验、Webhook 签名。', meta: 'PortOne 免费 · 仅 PG 费率', accent: '' },
  ]},
]

const HERO: Record<Locale, { brand: string; badge: string; title1: string; title2: string; desc: (n: number) => React.ReactNode; nav: { about: string; estimate: string; guides: string; contact: string; cta: string }; searchPlaceholder: string; ctaTitle: string; ctaDesc: string; ctaAsk: string; ctaSelf: string; footerHome: string; footerAbout: string; footerEstimate: string }> = {
  ko: { brand: '제이씨랩', badge: 'DEVELOPER GUIDES', searchPlaceholder: '가이드 검색', title1: '앱 만들 때 필요한', title2: '계정·키·가이드 모음',
    desc: (n) => <>앱 개발에서 매번 반복되는 계정 생성과 API 키 발급 절차를 한곳에 모았습니다.<br />총 <b className="text-[#2B313D]">{n}개 가이드</b>, 각각 단계별 체크리스트·자주 막히는 부분·공식 링크를 포함합니다.</>,
    nav: { about: '회사소개', estimate: '자가견적', guides: '가이드', contact: '문의', cta: '프로젝트 의뢰' },
    ctaTitle: '등록이 복잡하면\n전부 대행해 드릴게요', ctaDesc: '개발자 계정·API 키·PG 가맹점 계약까지 앱 출시에 필요한 셋업 전부를 한 번에 진행합니다.',
    ctaAsk: '대행 문의하기', ctaSelf: '자가견적 받기', footerHome: '홈', footerAbout: '회사소개', footerEstimate: '자가견적' },
  en: { brand: 'JAICYLAB', badge: 'DEVELOPER GUIDES', searchPlaceholder: 'Search guides', title1: 'Accounts, keys, and guides', title2: 'you\'ll need to ship an app',
    desc: (n) => <>Every app release repeats the same account and API-key procedures. We collected them in one place.<br /><b className="text-[#2B313D]">{n} guides</b>, each with a step-by-step checklist, common blockers, and official links.</>,
    nav: { about: 'About', estimate: 'Estimate', guides: 'Guides', contact: 'Contact', cta: 'Start a Project' },
    ctaTitle: 'If setup is a headache,\nwe\'ll handle it all', ctaDesc: 'Developer accounts, API keys, PG merchant contracts — every setup step needed to launch, done at once.',
    ctaAsk: 'Ask us to handle it', ctaSelf: 'Get a self-estimate', footerHome: 'Home', footerAbout: 'About', footerEstimate: 'Estimate' },
  ja: { brand: 'JAICYLAB', badge: 'DEVELOPER GUIDES', searchPlaceholder: 'ガイド検索', title1: 'アプリ開発に必要な', title2: 'アカウント・キー・ガイド',
    desc: (n) => <>アプリ開発で毎回繰り返すアカウント作成とAPIキー発行の手順を一箇所にまとめました。<br />全<b className="text-[#2B313D]">{n}ガイド</b>、それぞれにステップ別チェックリスト・詰まりやすいポイント・公式リンクを収録。</>,
    nav: { about: '会社紹介', estimate: '見積もり', guides: 'ガイド', contact: 'お問い合わせ', cta: 'プロジェクト依頼' },
    ctaTitle: '登録が面倒なら\nすべて代行します', ctaDesc: '開発者アカウント・APIキー・PG加盟店契約までアプリ公開に必要な一連のセットアップを一気に進めます。',
    ctaAsk: '代行を依頼する', ctaSelf: '見積もりを取る', footerHome: 'ホーム', footerAbout: '会社紹介', footerEstimate: '見積もり' },
  zh: { brand: 'JAICYLAB', badge: 'DEVELOPER GUIDES', searchPlaceholder: '搜索指南', title1: '开发应用所需的', title2: '账号 · 密钥 · 指南合集',
    desc: (n) => <>开发中重复出现的账号创建与 API 密钥申请流程,我们整理在了一处。<br />共 <b className="text-[#2B313D]">{n} 份指南</b>,每份包含分步清单、常见卡点与官方链接。</>,
    nav: { about: '公司介绍', estimate: '在线报价', guides: '指南', contact: '联系', cta: '委托项目' },
    ctaTitle: '配置太麻烦?\n我们可以全权代办', ctaDesc: '开发者账号、API 密钥、PG 商户签约 —— 上线所需的一切配置,一次到位。',
    ctaAsk: '委托代办', ctaSelf: '在线报价', footerHome: '首页', footerAbout: '公司介绍', footerEstimate: '在线报价' },
}

const CARDS: Record<Locale, Group[]> = { ko: CARDS_KO, en: CARDS_EN, ja: CARDS_JA, zh: CARDS_ZH }

/** 가이드 검색 별칭 — 한글/영문 어느 쪽으로 검색해도 걸리도록 href 기준으로 키워드를 더한다. */
const SEARCH_ALIAS: Record<string, string> = {
  '/guides/apple-developer': '애플 애플개발자 아이폰 아이오에스 앱스토어 앱 스토어 apple ios iphone appstore app store developer 개발자계정',
  '/guides/google-play': '구글 구글플레이 안드로이드 플레이스토어 플레이 콘솔 google play android playstore console 개발자계정',
  '/guides/kakao-developers': '카카오 카톡 카카오톡 카카오로그인 카카오지도 알림톡 kakao kakaotalk 소셜로그인 로그인',
  '/guides/naver-developers': '네이버 네이버로그인 네이버검색 파파고 naver papago 소셜로그인 로그인 오픈api',
  '/guides/toss-payments': '토스 토스페이먼츠 토스결제 결제 피지 가맹점 toss tosspayments payment pg',
  '/guides/portone': '포트원 아임포트 결제 피지 pg portone iamport payment 결제연동',
}

export default function GuidesIndexPage() {
  const [scrollY, setScrollY] = useState(0)
  const locale = useLocale() as Locale
  const h = HERO[locale] ?? HERO.ko
  const allGroups = CARDS[locale] ?? CARDS.ko
  const [query, setQuery] = useState('')
  const groups = (() => {
    const q = query.trim().toLowerCase()
    if (!q) return allGroups
    return allGroups
      .map(g => ({ ...g, items: g.items.filter(i => `${i.title} ${i.desc} ${i.category} ${g.label} ${SEARCH_ALIAS[i.href] ?? ''}`.toLowerCase().includes(q)) }))
      .filter(g => g.items.length > 0)
  })()

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const total = groups.reduce((a, g) => a + g.items.length, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafafa] to-[#f0f4f9] text-[#2B313D] overflow-x-hidden">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-white/80 backdrop-blur-2xl shadow-[0_2px_12px_-6px_rgba(15,23,42,0.08)]' : 'bg-transparent'}`}>
        <div className="mx-auto flex h-[60px] max-w-[1200px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <Logo height={22} className="text-[#2B313D]" />
          </Link>
          <nav className="hidden items-center gap-1 rounded-[14px] bg-[#F2F3F5] p-1 md:flex">
            <Link href="/about" className="rounded-[13px] px-4 py-1.5 text-[13px] font-semibold text-[#A4ABBA] transition-colors hover:text-[#2B313D]">{h.nav.about}</Link>
            <Link href="/estimate" className="rounded-[13px] px-4 py-1.5 text-[13px] font-semibold text-[#A4ABBA] transition-colors hover:text-[#2B313D]">{h.nav.estimate}</Link>
            <Link href="/guides" className="rounded-[13px] bg-white px-4 py-1.5 text-[13px] font-bold text-[#2B313D] shadow-sm transition-colors">{h.nav.guides}</Link>
            <Link href="/about#contact" className="rounded-[13px] px-4 py-1.5 text-[13px] font-semibold text-[#A4ABBA] transition-colors hover:text-[#2B313D]">{h.nav.contact}</Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <Link href="/about#contact" className="hidden rounded-[14px] bg-[#2B313D] px-5 py-2 text-[13px] font-bold text-white transition-all hover:bg-[#3A414F] active:scale-95 md:inline-block">{h.nav.cta}</Link>
            <MobileMenu
              items={[
                { label: h.nav.about, href: '/about' },
                { label: h.nav.estimate, href: '/estimate' },
                { label: h.nav.guides, href: '/guides', active: true },
                { label: h.nav.contact, href: '/about#contact' },
              ]}
              cta={{ label: h.nav.cta, href: '/about#contact' }}
            />
          </div>
        </div>
      </header>

      {/* 알약형 검색 — 자가견적 프리셋 검색과 동일한 톤 */}
      <div className="mx-auto max-w-[1100px] px-6 pt-[116px]">
        <div className="relative w-full max-w-[420px]">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A4ABBA]">
            <UiIcon name="search" className="h-4 w-4" />
          </span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={h.searchPlaceholder}
            className="h-11 w-full rounded-full bg-[#F2F3F5] pl-11 pr-10 text-[13.5px] text-[#2B313D] outline-none transition-colors placeholder:text-[#A4ABBA] focus:bg-[#E9EBEF]"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="검색어 지우기"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A4ABBA] transition-colors hover:text-[#51535C]">
              <UiIcon name="x" className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {groups.map(g => (
        <section key={g.label} className="py-14">
          <div className="mx-auto max-w-[1100px] px-6">
            <Reveal><h2 className="text-[26px] font-bold tracking-tight md:text-[32px]">{g.label}</h2></Reveal>
            <Stagger stagger={0.07} className="mt-10 grid gap-4 md:grid-cols-2">
              {g.items.map((c) => (
                <StaggerItem key={c.href}>
                  <motion.div
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 24 }}
                    className="h-full"
                  >
                    <Link href={c.href} className="group relative block aspect-[4/3] overflow-hidden rounded-[18px] bg-[#F2F3F5]">
                      {/* 배경 이미지 — 카드 전면 */}
                      {c.preview ? (
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                          style={{ backgroundImage: `url(${c.preview})` }}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#F2F3F5] to-[#C8CEDA]" />
                      )}

                      {/* 좌상단 배지 */}
                      <span className="absolute left-4 top-4 z-10 rounded-[10px] bg-[#2B313D]/70 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur-md">
                        {c.category}
                      </span>

                      {/* 하단 바 — 아이콘 + 제목 */}
                      <div className="absolute inset-x-3 bottom-3 z-10 flex items-center gap-3 rounded-[14px] bg-white/85 px-4 py-3 backdrop-blur-xl transition-colors duration-300 group-hover:bg-white">
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]"
                          style={{ backgroundColor: c.iconBg ?? '#ffffff' }}
                        >
                          <Image src={c.icon} alt={c.title} className="h-5 w-5 object-contain" />
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[15px] font-bold tracking-tight text-[#2B313D]">{c.title}</span>
                        <motion.span
                          initial={{ x: 0 }}
                          whileHover={{ x: 4 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          className="shrink-0"
                        >
                          <ArrowRight className="h-4 w-4 text-[#A4ABBA] group-hover:text-[#2B313D]" />
                        </motion.span>
                      </div>
                    </Link>
                  </motion.div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      ))}

      <footer className="border-t border-[#F2F3F5] py-12">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Logo height={20} className="text-[#2B313D]" />
                <span className="text-[13px] text-[#A4ABBA]">{h.brand}</span>
              </div>
              <p className="mt-2 text-[11px] text-[#C8CEDA]">App Development Studio · jaicylab2009@gmail.com</p>
              <p className="text-[10px] text-[#2B313D]/10">Copyright &copy; JAICYLAB. All rights reserved.</p>
            </div>
            <div className="flex gap-4 text-[12px] text-[#C8CEDA]">
              <Link href="/" className="transition-colors hover:text-[#A4ABBA]">{h.footerHome}</Link>
              <Link href="/about" className="transition-colors hover:text-[#A4ABBA]">{h.footerAbout}</Link>
              <Link href="/estimate" className="transition-colors hover:text-[#A4ABBA]">{h.footerEstimate}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
