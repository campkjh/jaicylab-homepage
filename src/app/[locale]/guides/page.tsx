'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import Image, { type StaticImageData } from 'next/image'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Reveal, Stagger, StaggerItem, PressableMotion } from '@/components/Reveal'
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
    { href: '/guides/google-play', icon: ICON.play, iconBg: '#ffffff', category: 'GOOGLE PLAY', title: 'Google Play Console', desc: 'Android 앱 등록. $25 일회성 등록비, 신원 확인, Closed Testing 14일 규정까지.', meta: '$25 (1회) · 1–3일 심사', accent: '' },
  ]},
  { label: '소셜 로그인 · 국내 오픈 API', items: [
    { href: '/guides/kakao-developers', icon: ICON.kakao, iconBg: '#FFCA2C', category: 'KAKAO', title: 'Kakao Developers', desc: '카카오 로그인·지도·공유하기·알림톡. 앱 등록, 키 해시, 동의 항목 심사까지.', meta: '무료 · 일부 항목 심사 필요', accent: '' },
    { href: '/guides/naver-developers', icon: ICON.naverdev, iconBg: '#00E261', category: 'NAVER', title: 'Naver Developers', desc: '네이버 로그인·검색·Papago 번역. Client ID/Secret 발급, Callback URL 설정.', meta: '무료 · 즉시 발급', accent: '' },
  ]},
  { label: '클라우드 · 인프라', items: [
    { href: '/guides/firebase', icon: ICON.firebase, category: 'FIREBASE', title: 'Firebase / GCP', desc: 'FCM 푸시·Auth·Firestore. iOS APNs 키 업로드, Android google-services.json, 서비스 계정.', meta: 'Spark 무료 · Blaze 종량', accent: '' },
    { href: '/guides/naver-cloud', icon: ICON.ncp, category: 'NCP', title: 'Naver Cloud Platform', desc: '네이버 지도·CLOVA OCR·SENS SMS. 계정 생성, Access Key, 상품별 이용 신청.', meta: '첫 가입 크레딧 · 한국 카드 OK', accent: '' },
    { href: '/guides/aws', icon: ICON.aws, category: 'AWS', title: 'Amazon Web Services', desc: '루트 계정 보호, IAM·MFA, 액세스 키, 예산 알림, 서울 리전 선택까지 안전한 초기 셋업.', meta: '12개월 프리티어 · 카드 필수', accent: '' },
    { href: '/guides/supabase', icon: ICON.supabase, category: 'SUPABASE', title: 'Supabase', desc: 'PostgreSQL·Auth·Storage·Realtime. 프로젝트 생성, RLS 정책, 키 분리.', meta: '무료 2개 · Pro $25/월', accent: '' },
    { href: '/guides/vercel', icon: ICON.vercel, iconBg: '#000000', category: 'VERCEL', title: 'Vercel 배포', desc: 'GitHub 연동, 환경변수, 커스텀 도메인 DNS, Preview 배포, Functions 리전.', meta: 'Hobby 무료 · Pro $20/월', accent: '' },
  ]},
  { label: '결제 · PG', items: [
    { href: '/guides/toss-payments', icon: ICON.toss, preview: '/tds-kv-text-hero.png', category: 'TOSS PAYMENTS', title: '토스페이먼츠 가맹점', desc: 'PG 연동. 테스트 키 → 가맹점 계약 → 실서비스 키 → 웹훅·정산 자동화.', meta: '2–5일 심사 · 수수료 2.5~3.5%', accent: '' },
    { href: '/guides/portone', icon: ICON.portone, preview: '/cb.png', category: 'PORTONE', title: '포트원 (구 아임포트)', desc: '여러 PG를 하나의 API로. V2 채널 등록, 결제 검증, 웹훅 서명까지.', meta: '포트원 무료 · PG 수수료만', accent: '' },
  ]},
  { label: '고객 응대 · 운영', items: [
    { href: '/guides/channeltalk', icon: ICON.channel, iconBg: '#572DFF', category: 'CHANNEL TALK', title: '채널톡 (ChannelTalk)', desc: '국내 대표 라이브 챗. 채널 개설·웹/앱 SDK·memberHash·웹훅 자동화.', meta: '무료 3인 · Pro ₩39,000~', accent: '' },
  ]},
]

const CARDS_EN: Group[] = [
  { label: 'App Stores & Developer Accounts', items: [
    { href: '/guides/apple-developer', icon: ICON.apple, iconBg: '#000000', preview: '/videoframe_65606-1-832x468.jpg', category: 'APPLE', title: 'Apple Developer Account', desc: 'Required for iOS release. Individual vs. organization, DUNS, $99 annual fee, App Store Connect setup.', meta: '$99/year · 1–7 day review', accent: '' },
    { href: '/guides/google-play', icon: ICON.play, iconBg: '#ffffff', category: 'GOOGLE PLAY', title: 'Google Play Console', desc: 'Android app registration. $25 one-time fee, identity verification, 14-day Closed Testing rule.', meta: '$25 (once) · 1–3 day review', accent: '' },
  ]},
  { label: 'Social Login & Korean Open APIs', items: [
    { href: '/guides/kakao-developers', icon: ICON.kakao, iconBg: '#FFCA2C', category: 'KAKAO', title: 'Kakao Developers', desc: 'Kakao Login, Maps, Share, AlimTalk. App registration, key hash, consent-item review.', meta: 'Free · some items reviewed', accent: '' },
    { href: '/guides/naver-developers', icon: ICON.naverdev, iconBg: '#00E261', category: 'NAVER', title: 'Naver Developers', desc: 'Naver Login, Search, Papago Translate. Client ID/Secret issuance, callback URL setup.', meta: 'Free · instant issuance', accent: '' },
  ]},
  { label: 'Cloud & Infrastructure', items: [
    { href: '/guides/firebase', icon: ICON.firebase, category: 'FIREBASE', title: 'Firebase / GCP', desc: 'FCM push, Auth, Firestore. iOS APNs key upload, Android google-services.json, service accounts.', meta: 'Spark free · Blaze metered', accent: '' },
    { href: '/guides/naver-cloud', icon: ICON.ncp, category: 'NCP', title: 'Naver Cloud Platform', desc: 'Naver Maps, CLOVA OCR, SENS SMS. Account creation, access keys, per-product activation.', meta: 'Sign-up credit · KR cards OK', accent: '' },
    { href: '/guides/aws', icon: ICON.aws, category: 'AWS', title: 'Amazon Web Services', desc: 'Root account hardening, IAM & MFA, access keys, budget alerts, Seoul region — a safe baseline.', meta: '12-month free tier · card required', accent: '' },
    { href: '/guides/supabase', icon: ICON.supabase, category: 'SUPABASE', title: 'Supabase', desc: 'PostgreSQL, Auth, Storage, Realtime. Project setup, RLS policies, key separation.', meta: '2 free · Pro $25/mo', accent: '' },
    { href: '/guides/vercel', icon: ICON.vercel, iconBg: '#000000', category: 'VERCEL', title: 'Vercel Deployment', desc: 'GitHub integration, env vars, custom domain DNS, preview deploys, function regions.', meta: 'Hobby free · Pro $20/mo', accent: '' },
  ]},
  { label: 'Payments & PG', items: [
    { href: '/guides/toss-payments', icon: ICON.toss, preview: '/tds-kv-text-hero.png', category: 'TOSS PAYMENTS', title: 'Toss Payments Merchant', desc: 'PG integration: test keys → merchant contract → live keys → webhook & settlement automation.', meta: '2–5 day review · 2.5–3.5% fee', accent: '' },
    { href: '/guides/portone', icon: ICON.portone, preview: '/cb.png', category: 'PORTONE', title: 'PortOne (formerly Iamport)', desc: 'Multiple PGs behind one API. V2 channel registration, payment verification, webhook signatures.', meta: 'PortOne free · PG fees only', accent: '' },
  ]},
  { label: 'Customer Support & Ops', items: [
    { href: '/guides/channeltalk', icon: ICON.channel, iconBg: '#572DFF', category: 'CHANNEL TALK', title: 'ChannelTalk', desc: 'Korea\'s leading live chat. Channel setup, web/app SDK, memberHash, webhook automation.', meta: '3 agents free · Pro from ₩39,000', accent: '' },
  ]},
]

const CARDS_JA: Group[] = [
  { label: 'アプリストア・開発者アカウント', items: [
    { href: '/guides/apple-developer', icon: ICON.apple, iconBg: '#000000', preview: '/videoframe_65606-1-832x468.jpg', category: 'APPLE', title: 'Apple Developerアカウント', desc: 'iOSアプリ公開に必須。個人/法人の選択、DUNS、年会費$99、App Store Connectのセットアップまで。', meta: '$99/年 · 1〜7日審査', accent: '' },
    { href: '/guides/google-play', icon: ICON.play, iconBg: '#ffffff', category: 'GOOGLE PLAY', title: 'Google Play Console', desc: 'Androidアプリ登録。$25一回払い、本人確認、Closed Testing 14日ルールまで。', meta: '$25(1回) · 1〜3日審査', accent: '' },
  ]},
  { label: 'ソーシャルログイン・韓国オープンAPI', items: [
    { href: '/guides/kakao-developers', icon: ICON.kakao, iconBg: '#FFCA2C', category: 'KAKAO', title: 'Kakao Developers', desc: 'Kakaoログイン・地図・シェア・アラームトーク。アプリ登録、キーハッシュ、同意項目の審査まで。', meta: '無料 · 一部審査あり', accent: '' },
    { href: '/guides/naver-developers', icon: ICON.naverdev, iconBg: '#00E261', category: 'NAVER', title: 'Naver Developers', desc: 'Naverログイン・検索・Papago翻訳。Client ID/Secret発行、Callback URL設定。', meta: '無料 · 即時発行', accent: '' },
  ]},
  { label: 'クラウド・インフラ', items: [
    { href: '/guides/firebase', icon: ICON.firebase, category: 'FIREBASE', title: 'Firebase / GCP', desc: 'FCMプッシュ・Auth・Firestore。iOS APNsキーのアップロード、Android google-services.json、サービスアカウント。', meta: 'Spark無料 · Blaze従量', accent: '' },
    { href: '/guides/naver-cloud', icon: ICON.ncp, category: 'NCP', title: 'Naver Cloud Platform', desc: 'Naver地図・CLOVA OCR・SENS SMS。アカウント作成、Access Key、商品別の利用申請。', meta: '初回クレジット · 韓国カード可', accent: '' },
    { href: '/guides/aws', icon: ICON.aws, category: 'AWS', title: 'Amazon Web Services', desc: 'ルートアカウント保護、IAM・MFA、アクセスキー、予算アラート、ソウルリージョンまで安全な初期設定。', meta: '12ヶ月無料枠 · カード必須', accent: '' },
    { href: '/guides/supabase', icon: ICON.supabase, category: 'SUPABASE', title: 'Supabase', desc: 'PostgreSQL・Auth・Storage・Realtime。プロジェクト作成、RLSポリシー、キー分離。', meta: '無料2個 · Pro $25/月', accent: '' },
    { href: '/guides/vercel', icon: ICON.vercel, iconBg: '#000000', category: 'VERCEL', title: 'Vercelデプロイ', desc: 'GitHub連携、環境変数、カスタムドメインDNS、Previewデプロイ、Functionsリージョン。', meta: 'Hobby無料 · Pro $20/月', accent: '' },
  ]},
  { label: '決済・PG', items: [
    { href: '/guides/toss-payments', icon: ICON.toss, preview: '/tds-kv-text-hero.png', category: 'TOSS PAYMENTS', title: 'トスペイメンツ加盟店', desc: 'PG連携。テストキー → 加盟店契約 → 本番キー → Webhook・精算の自動化。', meta: '2〜5日審査 · 手数料2.5〜3.5%', accent: '' },
    { href: '/guides/portone', icon: ICON.portone, preview: '/cb.png', category: 'PORTONE', title: 'PortOne(旧Iamport)', desc: '複数のPGを1つのAPIで。V2チャンネル登録、決済検証、Webhook署名まで。', meta: 'PortOne無料 · PG手数料のみ', accent: '' },
  ]},
  { label: 'カスタマーサポート・運営', items: [
    { href: '/guides/channeltalk', icon: ICON.channel, iconBg: '#572DFF', category: 'CHANNEL TALK', title: 'ChannelTalk', desc: '韓国の代表的ライブチャット。チャンネル開設、Web/App SDK、memberHash、Webhook自動化。', meta: '無料3名 · Pro ₩39,000〜', accent: '' },
  ]},
]

const CARDS_ZH: Group[] = [
  { label: '应用商店 · 开发者账号', items: [
    { href: '/guides/apple-developer', icon: ICON.apple, iconBg: '#000000', preview: '/videoframe_65606-1-832x468.jpg', category: 'APPLE', title: 'Apple Developer 账号', desc: 'iOS 上架必备。个人/公司选择、DUNS、$99 年费、App Store Connect 配置。', meta: '$99/年 · 1–7 天审核', accent: '' },
    { href: '/guides/google-play', icon: ICON.play, iconBg: '#ffffff', category: 'GOOGLE PLAY', title: 'Google Play Console', desc: 'Android 应用注册。$25 一次性费用、身份验证、Closed Testing 14 天规则。', meta: '$25(一次性) · 1–3 天审核', accent: '' },
  ]},
  { label: '社交登录 · 韩国开放 API', items: [
    { href: '/guides/kakao-developers', icon: ICON.kakao, iconBg: '#FFCA2C', category: 'KAKAO', title: 'Kakao Developers', desc: 'Kakao 登录、地图、分享、AlimTalk。应用注册、Key Hash、同意项审核。', meta: '免费 · 部分审核', accent: '' },
    { href: '/guides/naver-developers', icon: ICON.naverdev, iconBg: '#00E261', category: 'NAVER', title: 'Naver Developers', desc: 'Naver 登录、搜索、Papago 翻译。Client ID/Secret 申请、回调 URL 设置。', meta: '免费 · 即时发放', accent: '' },
  ]},
  { label: '云 · 基础设施', items: [
    { href: '/guides/firebase', icon: ICON.firebase, category: 'FIREBASE', title: 'Firebase / GCP', desc: 'FCM 推送、Auth、Firestore。iOS APNs 密钥上传、Android google-services.json、服务账号。', meta: 'Spark 免费 · Blaze 按量', accent: '' },
    { href: '/guides/naver-cloud', icon: ICON.ncp, category: 'NCP', title: 'Naver Cloud Platform', desc: 'Naver 地图、CLOVA OCR、SENS SMS。账号创建、Access Key、按产品申请。', meta: '新用户赠金 · 支持韩国卡', accent: '' },
    { href: '/guides/aws', icon: ICON.aws, category: 'AWS', title: 'Amazon Web Services', desc: '根账号加固、IAM·MFA、Access Key、预算告警、首尔区域 —— 安全的初始配置。', meta: '12 个月免费套餐 · 需信用卡', accent: '' },
    { href: '/guides/supabase', icon: ICON.supabase, category: 'SUPABASE', title: 'Supabase', desc: 'PostgreSQL、Auth、Storage、Realtime。项目创建、RLS 策略、密钥分离。', meta: '免费 2 个 · Pro $25/月', accent: '' },
    { href: '/guides/vercel', icon: ICON.vercel, iconBg: '#000000', category: 'VERCEL', title: 'Vercel 部署', desc: 'GitHub 接入、环境变量、自定义域名 DNS、Preview 部署、Functions 区域。', meta: 'Hobby 免费 · Pro $20/月', accent: '' },
  ]},
  { label: '支付 · PG', items: [
    { href: '/guides/toss-payments', icon: ICON.toss, preview: '/tds-kv-text-hero.png', category: 'TOSS PAYMENTS', title: 'Toss Payments 商户', desc: 'PG 对接:测试密钥 → 商户签约 → 生产密钥 → Webhook 与清算自动化。', meta: '2–5 天审核 · 费率 2.5~3.5%', accent: '' },
    { href: '/guides/portone', icon: ICON.portone, preview: '/cb.png', category: 'PORTONE', title: 'PortOne(原 Iamport)', desc: '多家 PG 统一到一个 API。V2 Channel 注册、支付校验、Webhook 签名。', meta: 'PortOne 免费 · 仅 PG 费率', accent: '' },
  ]},
  { label: '客服 · 运营', items: [
    { href: '/guides/channeltalk', icon: ICON.channel, iconBg: '#572DFF', category: 'CHANNEL TALK', title: 'ChannelTalk', desc: '韩国主流在线客服。频道开通、Web/App SDK、memberHash、Webhook 自动化。', meta: '3 人免费 · Pro ₩39,000 起', accent: '' },
  ]},
]

const HERO: Record<Locale, { brand: string; badge: string; title1: string; title2: string; desc: (n: number) => React.ReactNode; nav: { about: string; estimate: string; guides: string; contact: string; cta: string }; ctaTitle: string; ctaDesc: string; ctaAsk: string; ctaSelf: string; footerHome: string; footerAbout: string; footerEstimate: string }> = {
  ko: { brand: '제이씨랩', badge: 'DEVELOPER GUIDES', title1: '앱 만들 때 필요한', title2: '계정·키·가이드 모음',
    desc: (n) => <>앱 개발에서 매번 반복되는 계정 생성과 API 키 발급 절차를 한곳에 모았습니다.<br />총 <b className="text-white">{n}개 가이드</b>, 각각 단계별 체크리스트·자주 막히는 부분·공식 링크를 포함합니다.</>,
    nav: { about: '회사소개', estimate: '자가견적', guides: '가이드', contact: '문의', cta: '프로젝트 의뢰' },
    ctaTitle: '등록이 복잡하면\n전부 대행해 드릴게요', ctaDesc: '개발자 계정·API 키·PG 가맹점 계약까지 앱 출시에 필요한 셋업 전부를 한 번에 진행합니다.',
    ctaAsk: '대행 문의하기', ctaSelf: '자가견적 받기', footerHome: '홈', footerAbout: '회사소개', footerEstimate: '자가견적' },
  en: { brand: 'JAICYLAB', badge: 'DEVELOPER GUIDES', title1: 'Accounts, keys, and guides', title2: 'you\'ll need to ship an app',
    desc: (n) => <>Every app release repeats the same account and API-key procedures. We collected them in one place.<br /><b className="text-white">{n} guides</b>, each with a step-by-step checklist, common blockers, and official links.</>,
    nav: { about: 'About', estimate: 'Estimate', guides: 'Guides', contact: 'Contact', cta: 'Start a Project' },
    ctaTitle: 'If setup is a headache,\nwe\'ll handle it all', ctaDesc: 'Developer accounts, API keys, PG merchant contracts — every setup step needed to launch, done at once.',
    ctaAsk: 'Ask us to handle it', ctaSelf: 'Get a self-estimate', footerHome: 'Home', footerAbout: 'About', footerEstimate: 'Estimate' },
  ja: { brand: 'JAICYLAB', badge: 'DEVELOPER GUIDES', title1: 'アプリ開発に必要な', title2: 'アカウント・キー・ガイド',
    desc: (n) => <>アプリ開発で毎回繰り返すアカウント作成とAPIキー発行の手順を一箇所にまとめました。<br />全<b className="text-white">{n}ガイド</b>、それぞれにステップ別チェックリスト・詰まりやすいポイント・公式リンクを収録。</>,
    nav: { about: '会社紹介', estimate: '見積もり', guides: 'ガイド', contact: 'お問い合わせ', cta: 'プロジェクト依頼' },
    ctaTitle: '登録が面倒なら\nすべて代行します', ctaDesc: '開発者アカウント・APIキー・PG加盟店契約までアプリ公開に必要な一連のセットアップを一気に進めます。',
    ctaAsk: '代行を依頼する', ctaSelf: '見積もりを取る', footerHome: 'ホーム', footerAbout: '会社紹介', footerEstimate: '見積もり' },
  zh: { brand: 'JAICYLAB', badge: 'DEVELOPER GUIDES', title1: '开发应用所需的', title2: '账号 · 密钥 · 指南合集',
    desc: (n) => <>开发中重复出现的账号创建与 API 密钥申请流程,我们整理在了一处。<br />共 <b className="text-white">{n} 份指南</b>,每份包含分步清单、常见卡点与官方链接。</>,
    nav: { about: '公司介绍', estimate: '在线报价', guides: '指南', contact: '联系', cta: '委托项目' },
    ctaTitle: '配置太麻烦?\n我们可以全权代办', ctaDesc: '开发者账号、API 密钥、PG 商户签约 —— 上线所需的一切配置,一次到位。',
    ctaAsk: '委托代办', ctaSelf: '在线报价', footerHome: '首页', footerAbout: '公司介绍', footerEstimate: '在线报价' },
}

const CARDS: Record<Locale, Group[]> = { ko: CARDS_KO, en: CARDS_EN, ja: CARDS_JA, zh: CARDS_ZH }

export default function GuidesIndexPage() {
  const [scrollY, setScrollY] = useState(0)
  const locale = useLocale() as Locale
  const h = HERO[locale] ?? HERO.ko
  const groups = CARDS[locale] ?? CARDS.ko

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const total = groups.reduce((a, g) => a + g.items.length, 0)

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-black/60 backdrop-blur-2xl border-b border-white/5' : 'bg-transparent'}`}>
        <div className="mx-auto flex h-[60px] max-w-[1200px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <Logo height={22} className="text-white" />
            <span className="text-[12px] font-normal text-white/30">{h.brand}</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/about" className="text-[13px] font-medium text-white/40 transition-all hover:text-white">{h.nav.about}</Link>
            <Link href="/estimate" className="text-[13px] font-medium text-white/40 transition-all hover:text-white">{h.nav.estimate}</Link>
            <Link href="/guides" className="text-[13px] font-bold text-white transition-all">{h.nav.guides}</Link>
            <Link href="/about#contact" className="text-[13px] font-medium text-white/40 transition-all hover:text-white">{h.nav.contact}</Link>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/about#contact" className="rounded-xl bg-white px-5 py-2 text-[13px] font-bold text-black transition-all hover:bg-white/90 active:scale-95">{h.nav.cta}</Link>
          </div>
        </div>
      </header>

      <section className="relative border-b border-white/5 pt-[140px] pb-20">
        <div className="mx-auto max-w-[1100px] px-6">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-md">
              <ChevronRight className="h-3.5 w-3.5 text-white/60" />
              <span className="text-[11px] font-semibold tracking-wide text-white/70">{h.badge}</span>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-6 text-[44px] font-bold leading-[1.05] tracking-tight md:text-[64px]">
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">{h.title1}</span><br />
              <span className="bg-gradient-to-r from-[#82b1ff] to-white bg-clip-text text-transparent">{h.title2}</span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-6 max-w-[620px] text-[15px] leading-relaxed text-white/50">{h.desc(total)}</p>
          </Reveal>
        </div>
      </section>

      {groups.map((g, gi) => (
        <section key={g.label} className={`border-b border-white/5 py-20 ${gi % 2 === 1 ? 'bg-white/[0.01]' : ''}`}>
          <div className="mx-auto max-w-[1100px] px-6">
            <Reveal><p className="text-[11px] font-bold tracking-wider text-[#82b1ff]">{String(gi + 1).padStart(2, '0')} · {g.label.toUpperCase()}</p></Reveal>
            <Reveal delay={80}><h2 className="mt-3 text-[26px] font-bold tracking-tight md:text-[32px]">{g.label}</h2></Reveal>
            <Stagger stagger={0.07} className="mt-10 grid gap-4 md:grid-cols-2">
              {g.items.map((c) => (
                <StaggerItem key={c.href}>
                  <motion.div
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 24 }}
                    className="h-full"
                  >
                    <Link href={c.href} className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.05] hover:shadow-[0_18px_54px_rgba(41,121,255,0.16)]">
                      {c.preview && (
                        <>
                          <div
                            className="pointer-events-none absolute inset-0 scale-110 bg-cover bg-center opacity-25 transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-70"
                            style={{ backgroundImage: `url(${c.preview})` }}
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-[#050505]/70 transition-all duration-500 group-hover:from-[#050505]/85 group-hover:via-[#050505]/55 group-hover:to-[#050505]/20" />
                        </>
                      )}
                      <div className="relative flex items-start justify-between">
                        <motion.div
                          whileHover={{ scale: 1.08, rotate: -4 }}
                          transition={{ type: 'spring', stiffness: 420, damping: 14 }}
                          className="flex h-11 w-11 items-center justify-center rounded-xl shadow-[0_6px_18px_rgba(15,23,42,0.3)]"
                          style={{ backgroundColor: c.iconBg ?? '#ffffff' }}
                        >
                          <Image src={c.icon} alt={c.title} className="h-7 w-7 object-contain" />
                        </motion.div>
                        <motion.div
                          initial={{ x: 0 }}
                          whileHover={{ x: 4 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                          <ArrowRight className="h-4 w-4 text-white/25 group-hover:text-white" />
                        </motion.div>
                      </div>
                      <p className="relative mt-5 text-[10px] font-bold tracking-wider text-white/30">{c.category}</p>
                      <h3 className="relative mt-1 text-[18px] font-bold tracking-tight">{c.title}</h3>
                      <p className="relative mt-2 flex-1 text-[13px] leading-relaxed text-white/45">{c.desc}</p>
                      <div className="relative mt-5 flex items-center gap-2 text-[11px] font-medium text-white/40">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#82b1ff]" />
                        {c.meta}
                      </div>
                    </Link>
                  </motion.div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      ))}

      <section className="bg-gradient-to-b from-transparent to-white/[0.02] py-28">
        <div className="mx-auto max-w-[720px] px-6 text-center">
          <Reveal>
            <h2 className="whitespace-pre-line text-[34px] font-bold leading-tight tracking-tight md:text-[44px]">{h.ctaTitle}</h2>
          </Reveal>
          <Reveal delay={120}><p className="mt-4 text-[15px] text-white/50">{h.ctaDesc}</p></Reveal>
          <Reveal delay={240}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <PressableMotion>
                <Link href="/about#contact" className="group flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-[15px] font-bold text-black shadow-[0_10px_40px_rgba(255,255,255,0.12)]">
                  {h.ctaAsk}
                  <motion.span whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </Link>
              </PressableMotion>
              <PressableMotion>
                <Link href="/estimate" className="rounded-xl border border-white/20 px-8 py-4 text-[15px] font-bold text-white/80 hover:bg-white/5 hover:text-white">{h.ctaSelf}</Link>
              </PressableMotion>
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
                <span className="text-[13px] text-white/30">{h.brand}</span>
              </div>
              <p className="mt-2 text-[11px] text-white/15">App Development Studio · jaicylab2009@gmail.com</p>
              <p className="text-[10px] text-white/10">Copyright &copy; JAICYLAB. All rights reserved.</p>
            </div>
            <div className="flex gap-4 text-[12px] text-white/25">
              <Link href="/" className="transition-colors hover:text-white/50">{h.footerHome}</Link>
              <Link href="/about" className="transition-colors hover:text-white/50">{h.footerAbout}</Link>
              <Link href="/estimate" className="transition-colors hover:text-white/50">{h.footerEstimate}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
