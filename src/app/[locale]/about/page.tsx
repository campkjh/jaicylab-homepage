'use client'

import { useState, useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ChevronRight, MapPin, Phone, Mail, Building2, FileText, Users, Clock, Send, Shield, X, CheckCircle, Zap, BarChart3, Smartphone, Server, Sparkles, Code2 } from 'lucide-react'
import { toast } from 'sonner'
import { Logo } from '@/components/Logo'
import { FileDropzone } from '@/components/FileDropzone'
import { TechMarquee } from '@/components/TechMarquee'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Reveal } from '@/components/Reveal'

type Locale = 'ko' | 'en' | 'ja' | 'zh'

type NavKey = 'about' | 'tech' | 'services' | 'process' | 'vision' | 'resources' | 'contact'

type Content = {
  brandSub: string
  nav: Record<NavKey, string>
  extraSelfEstimate: string
  ctaInquiry: string
  heroKicker: string
  heroTitle1: string
  heroTitle2: string
  heroDesc1: string
  heroDesc2: string
  heroCta1: string
  heroCta2: string
  aboutKicker: string
  aboutTitle: string
  aboutDesc: string
  ourTrackKicker: string
  ourTrackTitle1: string
  ourTrackTitle2: string
  statLaunched: string
  statUsers: string
  statUptime: string
  statIssue: string
  value1Title: string
  value1Desc: string
  value2Title: string
  value2Desc: string
  value3Title: string
  value3Desc: string
  techKicker: string
  techTitle: string
  techDesc: string
  servicesKicker: string
  servicesTitle1: string
  servicesTitle2: string
  service1Title: string
  service1Desc: string
  service2Title: string
  service2Desc: string
  service3Title: string
  service3Desc: string
  service4Title: string
  service4Desc: string
  processKicker: string
  processTitle: string
  step1Items: string[]
  step2Items: string[]
  step3Items: string[]
  step4Items: string[]
  visionKicker: string
  visionTitle1: string
  visionTitle2: string
  visionPairs: { before: string; after: string }[]
  resourcesKicker: string
  resourcesTitle: string
  resCompanyIntro: string
  resPortfolio: string
  resPrivacy: string
  resTerms: string
  resPreparing: string
  contactKicker: string
  contactTitle: string
  contactDesc1: string
  contactDesc2: string
  contactAddress: string
  formCompany: string
  formName: string
  formPhone: string
  formEmail: string
  formMessage: string
  formSubmit: string
  formSending: string
  formRequired: string
  formSuccess: string
  formFail: string
  formCompanyLabel: string
  formAttachNote: (n: number) => string
  footerBrandSub: string
  footerTag: string
  footerCopy: string
  footerPrivacy: string
  footerTerms: string
  footerHome: string
  privacyTitle: string
  privacyArticles: { h: string; b: string }[]
  privacyEffective: string
  termsTitle: string
  termsArticles: { h: string; b: string }[]
  termsEffective: string
}

const CONTENT: Record<Locale, Content> = {
  ko: {
    brandSub: '제이씨랩',
    nav: { about: '회사소개', tech: '기술스택', services: '서비스', process: '프로세스', vision: '비전', resources: '자료실', contact: '문의' },
    extraSelfEstimate: '자가견적',
    ctaInquiry: '프로젝트 의뢰',
    heroKicker: 'APP DEVELOPMENT STUDIO',
    heroTitle1: '아이디어를 제품으로,',
    heroTitle2: '제품을 성장으로',
    heroDesc1: '제이씨랩은 기획 · 디자인 · 모바일 · 웹 · 백엔드 · AI 통합까지',
    heroDesc2: '하나의 팀이 이어서 책임지는 앱 개발 스튜디오입니다.',
    heroCta1: '프로젝트 의뢰하기',
    heroCta2: '서비스 둘러보기',
    aboutKicker: 'ABOUT US',
    aboutTitle: '작은 팀, 끝까지 가는 방식',
    aboutDesc: '제이씨랩(JAICYLAB)은 기획부터 출시, 운영까지 한 팀이 이어서 책임지는 앱 개발 스튜디오입니다. 단발성 외주가 아닌 제품의 라이프사이클을 함께 설계하는 파트너를 지향합니다.',
    ourTrackKicker: 'OUR TRACK',
    ourTrackTitle1: '스타트업과 함께 달려온',
    ourTrackTitle2: '앱 개발 스튜디오',
    statLaunched: '출시 프로젝트',
    statUsers: '누적 사용자',
    statUptime: '서비스 가동률',
    statIssue: '이슈 대응',
    value1Title: '제품 중심',
    value1Desc: '요구사항 이전에 해결할 문제를 먼저 정의하고 제품 관점에서 설계합니다.',
    value2Title: '한 팀 구조',
    value2Desc: '기획·디자인·개발이 한 팀으로 움직여 커뮤니케이션 비용을 최소화합니다.',
    value3Title: '데이터 기반',
    value3Desc: '지표 기반으로 판단하고, 가설을 빠르게 검증해 다음을 결정합니다.',
    techKicker: 'TECH STACK',
    techTitle: '사용 가능한 언어 · 프레임워크',
    techDesc: 'iOS · Android 네이티브부터 크로스플랫폼, 웹, 백엔드까지. 프로젝트 성격에 맞춰 최적의 기술을 선택합니다.',
    servicesKicker: 'SERVICES',
    servicesTitle1: '제품 전 단계를',
    servicesTitle2: '하나의 팀으로 커버합니다',
    service1Title: '모바일 앱 개발',
    service1Desc: 'iOS · Android 네이티브와 React Native · Flutter 크로스플랫폼',
    service2Title: '웹 · 어드민 개발',
    service2Desc: 'Next.js 기반 반응형 웹과 운영자용 어드민 대시보드',
    service3Title: '백엔드 · 인프라',
    service3Desc: 'Supabase · Vercel · AWS 기반 확장 가능한 서버 구조',
    service4Title: 'AI 통합',
    service4Desc: 'LLM · 음성 · 이미지 모델의 제품 워크플로우 통합',
    processKicker: 'OUR PROCESS',
    processTitle: 'Discovery — Design — Build — Grow',
    step1Items: ['문제 정의', '사용자 시나리오', '기술 조사', '범위 합의'],
    step2Items: ['UX 플로우', 'UI 시안', '데이터 모델', '프로토타입'],
    step3Items: ['2주 스프린트', '데모 공유', '품질 검증', '점진적 반영'],
    step4Items: ['스토어 출시', '분석 도입', '운영 자동화', '기능 확장'],
    visionKicker: 'WHY JAICYLAB?',
    visionTitle1: '"빠르게 만들고,',
    visionTitle2: '오래 가는 제품으로"',
    visionPairs: [
      { before: '요구사항만 받아 구현하는 외주', after: '문제 정의부터 함께하는 파트너' },
      { before: '출시 후 연락이 끊기는 관계', after: '운영·개선까지 이어지는 장기 협업' },
      { before: '기획/디자인/개발의 분절된 커뮤니케이션', after: '한 팀 구조로 합의와 반영이 빠름' },
      { before: '기술 선택이 개발자 취향에 좌우', after: '제품 맥락과 운영비용 기반 기술 선택' },
    ],
    resourcesKicker: 'RESOURCES',
    resourcesTitle: '자료실',
    resCompanyIntro: '회사소개서',
    resPortfolio: '포트폴리오',
    resPrivacy: '개인정보처리방침',
    resTerms: '서비스 이용약관',
    resPreparing: '준비 중입니다',
    contactKicker: 'CONTACT',
    contactTitle: '프로젝트 문의',
    contactDesc1: '아이디어 단계여도 좋습니다.',
    contactDesc2: '간단한 내용이라도 남겨주시면 빠르게 회신드릴게요.',
    contactAddress: '수원시 장안구 서부로 2066 제2공학관 27505',
    formCompany: '회사명 / 소속',
    formName: '담당자명 *',
    formPhone: '연락처 *',
    formEmail: '이메일',
    formMessage: '프로젝트 내용 *  (어떤 앱을 만들고 싶으신지, 예상 일정, 참고 서비스 등 자유롭게 적어주세요)',
    formSubmit: '문의하기',
    formSending: '전송 중...',
    formRequired: '필수 항목을 입력해주세요',
    formSuccess: '문의가 접수되었습니다. 영업일 기준 1일 내 회신드릴게요.',
    formFail: '전송에 실패했어요.',
    formCompanyLabel: '회사명',
    formAttachNote: (n) => `\n(첨부 파일 ${n}개 — 회신 메일로 전달 부탁드려요)`,
    footerBrandSub: '제이씨랩',
    footerTag: 'App Development Studio',
    footerCopy: 'Copyright © JAICYLAB. All rights reserved.',
    footerPrivacy: '개인정보처리방침',
    footerTerms: '이용약관',
    footerHome: '홈',
    privacyTitle: '개인정보처리방침',
    privacyArticles: [
      { h: '제1조 (목적)', b: '제이씨랩(이하 "회사")은 개인정보 보호법에 따라 정보주체의 개인정보를 보호하고 관련 고충을 신속히 처리할 수 있도록 다음과 같이 처리방침을 수립·공개합니다.' },
      { h: '제2조 (수집 항목)', b: '필수: 이름, 연락처, 이메일 / 선택: 회사명, 문의 내용 / 자동수집: 접속 IP, 이용 기록' },
      { h: '제3조 (처리 목적)', b: '프로젝트 문의 응대, 계약 검토, 서비스 개선' },
      { h: '제4조 (보유·파기)', b: '목적 달성 후 지체 없이 파기합니다.' },
      { h: '제5조 (제3자 제공)', b: '동의 없이 제3자에게 제공하지 않습니다.' },
      { h: '제6조 (문의)', b: 'jaicylab2009@gmail.com' },
    ],
    privacyEffective: '시행일자: 2026년 1월 1일',
    termsTitle: '서비스 이용약관',
    termsArticles: [
      { h: '제1조 (목적)', b: '이 약관은 제이씨랩이 제공하는 앱 개발 및 관련 서비스의 이용조건, 권리·의무·책임사항을 규정합니다.' },
      { h: '제2조 (서비스)', b: '모바일 앱, 웹, 백엔드, AI 통합 개발 및 유지보수' },
      { h: '제3조 (계약)', b: '프로젝트별 별도 계약서에 따라 범위 · 비용 · 일정이 확정됩니다.' },
      { h: '제4조 (지적재산권)', b: '대금 완납 시 결과물의 이용권이 이전됩니다. 자체 라이브러리와 노하우는 회사에 귀속됩니다.' },
      { h: '제5조 (비밀유지)', b: '프로젝트 과정에서 취득한 정보를 외부에 누설하지 않습니다.' },
      { h: '제6조 (책임 제한)', b: '불가항력으로 인한 손해에 대해 책임을 지지 않습니다.' },
      { h: '제7조 (분쟁해결)', b: '분쟁 발생 시 회사 소재지 관할 법원을 전속 관할로 합니다.' },
    ],
    termsEffective: '시행일자: 2026년 1월 1일',
  },
  en: {
    brandSub: 'JAICYLAB',
    nav: { about: 'About', tech: 'Tech Stack', services: 'Services', process: 'Process', vision: 'Vision', resources: 'Resources', contact: 'Contact' },
    extraSelfEstimate: 'Self Estimate',
    ctaInquiry: 'Start a Project',
    heroKicker: 'APP DEVELOPMENT STUDIO',
    heroTitle1: 'From idea to product,',
    heroTitle2: 'from product to growth',
    heroDesc1: 'JAICYLAB covers planning, design, mobile, web, backend, and AI integration',
    heroDesc2: 'as one team that carries your product end to end.',
    heroCta1: 'Start a Project',
    heroCta2: 'Explore Services',
    aboutKicker: 'ABOUT US',
    aboutTitle: 'A small team that goes the distance',
    aboutDesc: 'JAICYLAB is an app development studio where a single team owns the full cycle — planning, launch, and operations. We aim to be a partner that designs the product lifecycle with you, not a one-off vendor.',
    ourTrackKicker: 'OUR TRACK',
    ourTrackTitle1: 'The app studio that runs',
    ourTrackTitle2: 'alongside startups',
    statLaunched: 'Launched Projects',
    statUsers: 'Cumulative Users',
    statUptime: 'Service Uptime',
    statIssue: 'Issue Response',
    value1Title: 'Product First',
    value1Desc: 'We define the problem to solve before requirements, and design from a product perspective.',
    value2Title: 'One Team',
    value2Desc: 'Planning, design, and engineering move as one team to minimize communication overhead.',
    value3Title: 'Data Driven',
    value3Desc: 'We decide based on metrics, validate hypotheses quickly, and let data drive the next step.',
    techKicker: 'TECH STACK',
    techTitle: 'Languages & Frameworks we work with',
    techDesc: 'From iOS/Android native to cross-platform, web, and backend. We pick the best stack for each project.',
    servicesKicker: 'SERVICES',
    servicesTitle1: 'One team covering',
    servicesTitle2: 'every stage of your product',
    service1Title: 'Mobile App Development',
    service1Desc: 'iOS/Android native, plus React Native and Flutter cross-platform',
    service2Title: 'Web & Admin',
    service2Desc: 'Next.js responsive web and operator admin dashboards',
    service3Title: 'Backend & Infra',
    service3Desc: 'Scalable server architecture on Supabase, Vercel, and AWS',
    service4Title: 'AI Integration',
    service4Desc: 'Integrating LLM, voice, and image models into product workflows',
    processKicker: 'OUR PROCESS',
    processTitle: 'Discovery — Design — Build — Grow',
    step1Items: ['Problem definition', 'User scenarios', 'Tech research', 'Scope alignment'],
    step2Items: ['UX flow', 'UI mockups', 'Data model', 'Prototype'],
    step3Items: ['2-week sprints', 'Demo sharing', 'Quality checks', 'Iterative delivery'],
    step4Items: ['Store launch', 'Analytics setup', 'Ops automation', 'Feature expansion'],
    visionKicker: 'WHY JAICYLAB?',
    visionTitle1: '"Build fast,',
    visionTitle2: 'build to last"',
    visionPairs: [
      { before: 'Vendor that only implements given requirements', after: 'Partner that starts from problem definition' },
      { before: 'Contact ends after launch', after: 'Long-term collaboration through ops & iteration' },
      { before: 'Fragmented planning/design/dev communication', after: 'Fast alignment with a one-team structure' },
      { before: 'Tech picked by developer preference', after: 'Tech chosen by product context and operating cost' },
    ],
    resourcesKicker: 'RESOURCES',
    resourcesTitle: 'Resources',
    resCompanyIntro: 'Company Intro',
    resPortfolio: 'Portfolio',
    resPrivacy: 'Privacy Policy',
    resTerms: 'Terms of Service',
    resPreparing: 'Coming soon',
    contactKicker: 'CONTACT',
    contactTitle: 'Project Inquiry',
    contactDesc1: 'Idea stage is perfectly fine.',
    contactDesc2: 'Drop us even a short note and we will get back to you quickly.',
    contactAddress: 'Bldg. 2, 27505, 2066 Seobu-ro, Jangan-gu, Suwon, Korea',
    formCompany: 'Company / Organization',
    formName: 'Contact Name *',
    formPhone: 'Phone *',
    formEmail: 'Email',
    formMessage: 'Project details *  (what kind of app, expected timeline, reference services — feel free to share)',
    formSubmit: 'Send Inquiry',
    formSending: 'Sending...',
    formRequired: 'Please fill in the required fields',
    formSuccess: 'Your inquiry has been received. We will reply within 1 business day.',
    formFail: 'Failed to send.',
    formCompanyLabel: 'Company',
    formAttachNote: (n) => `\n(${n} attachment${n > 1 ? 's' : ''} — please share via reply email)`,
    footerBrandSub: 'JAICYLAB',
    footerTag: 'App Development Studio',
    footerCopy: 'Copyright © JAICYLAB. All rights reserved.',
    footerPrivacy: 'Privacy Policy',
    footerTerms: 'Terms',
    footerHome: 'Home',
    privacyTitle: 'Privacy Policy',
    privacyArticles: [
      { h: 'Article 1 (Purpose)', b: 'JAICYLAB ("the Company") establishes and publishes this policy to protect the personal information of data subjects and to promptly handle related matters in accordance with applicable privacy laws.' },
      { h: 'Article 2 (Items Collected)', b: 'Required: name, phone, email / Optional: company, inquiry content / Automatically collected: IP, usage logs' },
      { h: 'Article 3 (Purpose of Processing)', b: 'Handling project inquiries, contract review, service improvement' },
      { h: 'Article 4 (Retention & Disposal)', b: 'Data is disposed of without delay once its purpose has been fulfilled.' },
      { h: 'Article 5 (Third-Party Disclosure)', b: 'We do not disclose information to third parties without consent.' },
      { h: 'Article 6 (Contact)', b: 'jaicylab2009@gmail.com' },
    ],
    privacyEffective: 'Effective: January 1, 2026',
    termsTitle: 'Terms of Service',
    termsArticles: [
      { h: 'Article 1 (Purpose)', b: 'These terms govern the conditions, rights, obligations, and responsibilities for app development and related services provided by JAICYLAB.' },
      { h: 'Article 2 (Services)', b: 'Mobile apps, web, backend, AI integration development and maintenance' },
      { h: 'Article 3 (Contract)', b: 'Scope, cost, and schedule are fixed by individual contract per project.' },
      { h: 'Article 4 (IP Rights)', b: 'Rights of use to deliverables transfer upon full payment. Internal libraries and know-how remain with the Company.' },
      { h: 'Article 5 (Confidentiality)', b: 'Information obtained during projects is not disclosed externally.' },
      { h: 'Article 6 (Limitation of Liability)', b: 'The Company is not liable for damages due to force majeure.' },
      { h: 'Article 7 (Dispute Resolution)', b: 'Disputes are subject to the exclusive jurisdiction of the court at the Company\'s location.' },
    ],
    termsEffective: 'Effective: January 1, 2026',
  },
  ja: {
    brandSub: 'JAICYLAB',
    nav: { about: '会社紹介', tech: '技術スタック', services: 'サービス', process: 'プロセス', vision: 'ビジョン', resources: '資料室', contact: 'お問い合わせ' },
    extraSelfEstimate: 'セルフ見積',
    ctaInquiry: 'プロジェクト依頼',
    heroKicker: 'APP DEVELOPMENT STUDIO',
    heroTitle1: 'アイデアをプロダクトへ、',
    heroTitle2: 'プロダクトを成長へ',
    heroDesc1: 'JAICYLAB は企画・デザイン・モバイル・Web・バックエンド・AI 統合まで、',
    heroDesc2: '一つのチームが最後まで責任を持つアプリ開発スタジオです。',
    heroCta1: 'プロジェクトを依頼する',
    heroCta2: 'サービスを見る',
    aboutKicker: 'ABOUT US',
    aboutTitle: '小さなチームで、最後まで走り切る',
    aboutDesc: 'JAICYLAB は企画からローンチ、運用まで一つのチームが継続して担当するアプリ開発スタジオです。一回きりの外注ではなく、プロダクトのライフサイクルを共に設計するパートナーを目指しています。',
    ourTrackKicker: 'OUR TRACK',
    ourTrackTitle1: 'スタートアップと共に歩む',
    ourTrackTitle2: 'アプリ開発スタジオ',
    statLaunched: 'ローンチ実績',
    statUsers: '累計ユーザー',
    statUptime: '稼働率',
    statIssue: 'イシュー対応',
    value1Title: 'プロダクト中心',
    value1Desc: '要件より先に解くべき課題を定義し、プロダクト視点で設計いたします。',
    value2Title: 'ワンチーム体制',
    value2Desc: '企画・デザイン・開発が一つのチームで動き、コミュニケーションコストを最小化します。',
    value3Title: 'データドリブン',
    value3Desc: '指標に基づき判断し、仮説を素早く検証して次の一手を決めます。',
    techKicker: 'TECH STACK',
    techTitle: '対応可能な言語・フレームワーク',
    techDesc: 'iOS・Android ネイティブからクロスプラットフォーム、Web、バックエンドまで。プロジェクトの性格に合わせて最適な技術を選定します。',
    servicesKicker: 'SERVICES',
    servicesTitle1: 'プロダクトの全フェーズを',
    servicesTitle2: '一つのチームでカバーします',
    service1Title: 'モバイルアプリ開発',
    service1Desc: 'iOS・Android ネイティブと React Native・Flutter のクロスプラットフォーム',
    service2Title: 'Web・管理画面開発',
    service2Desc: 'Next.js ベースのレスポンシブ Web と運用者向け管理ダッシュボード',
    service3Title: 'バックエンド・インフラ',
    service3Desc: 'Supabase・Vercel・AWS を用いたスケーラブルなサーバー構成',
    service4Title: 'AI 統合',
    service4Desc: 'LLM・音声・画像モデルをプロダクトのワークフローに統合',
    processKicker: 'OUR PROCESS',
    processTitle: 'Discovery — Design — Build — Grow',
    step1Items: ['課題定義', 'ユーザーシナリオ', '技術調査', 'スコープ合意'],
    step2Items: ['UX フロー', 'UI デザイン', 'データモデル', 'プロトタイプ'],
    step3Items: ['2週間スプリント', 'デモ共有', '品質検証', '段階的リリース'],
    step4Items: ['ストア公開', '分析導入', '運用自動化', '機能拡張'],
    visionKicker: 'WHY JAICYLAB?',
    visionTitle1: '「素早く作り、',
    visionTitle2: '長く使われるプロダクトへ」',
    visionPairs: [
      { before: '要件を受け取って実装するだけの外注', after: '課題定義から共に考えるパートナー' },
      { before: 'リリース後に連絡が途絶える関係', after: '運用・改善まで続く長期的な協業' },
      { before: '企画/デザイン/開発の分断されたコミュニケーション', after: 'ワンチーム体制で合意と反映が早い' },
      { before: '技術選定が開発者の好みに左右される', after: 'プロダクト文脈と運用コストに基づく技術選定' },
    ],
    resourcesKicker: 'RESOURCES',
    resourcesTitle: '資料室',
    resCompanyIntro: '会社紹介資料',
    resPortfolio: 'ポートフォリオ',
    resPrivacy: 'プライバシーポリシー',
    resTerms: '利用規約',
    resPreparing: '準備中です',
    contactKicker: 'CONTACT',
    contactTitle: 'プロジェクトのお問い合わせ',
    contactDesc1: 'アイデア段階でも大丈夫です。',
    contactDesc2: '簡単な内容でもご記入いただければ、迅速にご返信いたします。',
    contactAddress: '韓国・水原市 長安区 西部路 2066 第2工学館 27505',
    formCompany: '会社名 / 所属',
    formName: 'ご担当者名 *',
    formPhone: '連絡先 *',
    formEmail: 'メールアドレス',
    formMessage: 'プロジェクト内容 *  (どのようなアプリをお作りになりたいか、想定スケジュール、参考サービスなどご自由にご記入ください)',
    formSubmit: 'お問い合わせ',
    formSending: '送信中...',
    formRequired: '必須項目をご入力ください',
    formSuccess: 'お問い合わせを受け付けました。営業日1日以内にご返信いたします。',
    formFail: '送信に失敗しました。',
    formCompanyLabel: '会社名',
    formAttachNote: (n) => `\n(添付ファイル ${n} 件 — 返信メールにてお送りください)`,
    footerBrandSub: 'JAICYLAB',
    footerTag: 'App Development Studio',
    footerCopy: 'Copyright © JAICYLAB. All rights reserved.',
    footerPrivacy: 'プライバシーポリシー',
    footerTerms: '利用規約',
    footerHome: 'ホーム',
    privacyTitle: 'プライバシーポリシー',
    privacyArticles: [
      { h: '第1条(目的)', b: 'JAICYLAB(以下「当社」)は、個人情報保護法に基づき、情報主体の個人情報を保護し、関連する苦情を迅速に処理するため、以下の通り本方針を策定・公開いたします。' },
      { h: '第2条(収集項目)', b: '必須: 氏名、連絡先、メール / 任意: 会社名、お問い合わせ内容 / 自動収集: 接続 IP、利用記録' },
      { h: '第3条(処理目的)', b: 'プロジェクトに関するお問い合わせ対応、契約検討、サービス改善' },
      { h: '第4条(保有・破棄)', b: '目的達成後は遅滞なく破棄いたします。' },
      { h: '第5条(第三者提供)', b: '同意なく第三者に提供することはありません。' },
      { h: '第6条(お問い合わせ)', b: 'jaicylab2009@gmail.com' },
    ],
    privacyEffective: '施行日: 2026年1月1日',
    termsTitle: '利用規約',
    termsArticles: [
      { h: '第1条(目的)', b: '本規約は、JAICYLAB が提供するアプリ開発および関連サービスの利用条件、権利・義務・責任事項を規定いたします。' },
      { h: '第2条(サービス)', b: 'モバイルアプリ、Web、バックエンド、AI 統合開発および保守' },
      { h: '第3条(契約)', b: 'プロジェクトごとに個別契約書に従って範囲・費用・スケジュールを確定いたします。' },
      { h: '第4条(知的財産権)', b: '代金完納時に成果物の利用権が移転します。自社ライブラリおよびノウハウは当社に帰属します。' },
      { h: '第5条(秘密保持)', b: 'プロジェクトの過程で取得した情報を外部に漏洩いたしません。' },
      { h: '第6条(責任制限)', b: '不可抗力による損害については責任を負いません。' },
      { h: '第7条(紛争解決)', b: '紛争が生じた場合は、当社所在地を管轄する裁判所を専属管轄といたします。' },
    ],
    termsEffective: '施行日: 2026年1月1日',
  },
  zh: {
    brandSub: 'JAICYLAB',
    nav: { about: '公司介绍', tech: '技术栈', services: '服务', process: '流程', vision: '愿景', resources: '资料中心', contact: '联系我们' },
    extraSelfEstimate: '自助报价',
    ctaInquiry: '项目咨询',
    heroKicker: 'APP DEVELOPMENT STUDIO',
    heroTitle1: '从创意到产品,',
    heroTitle2: '从产品到增长',
    heroDesc1: 'JAICYLAB 覆盖策划、设计、移动端、Web、后端到 AI 集成',
    heroDesc2: '由一个团队端到端负责的 App 开发工作室。',
    heroCta1: '立即咨询项目',
    heroCta2: '浏览服务',
    aboutKicker: 'ABOUT US',
    aboutTitle: '小团队,走到最后',
    aboutDesc: 'JAICYLAB 是一家从策划、上线到运营由同一团队持续负责的 App 开发工作室。我们致力于成为与您共同设计产品生命周期的合作伙伴,而非一次性外包。',
    ourTrackKicker: 'OUR TRACK',
    ourTrackTitle1: '与创业公司一同成长的',
    ourTrackTitle2: 'App 开发工作室',
    statLaunched: '上线项目',
    statUsers: '累计用户',
    statUptime: '服务可用率',
    statIssue: '问题响应',
    value1Title: '产品导向',
    value1Desc: '先于需求定义待解决的问题,从产品视角进行设计。',
    value2Title: '一体化团队',
    value2Desc: '策划、设计、开发作为一个团队协作,最大限度降低沟通成本。',
    value3Title: '数据驱动',
    value3Desc: '基于指标判断,快速验证假设,用数据决定下一步。',
    techKicker: 'TECH STACK',
    techTitle: '可使用的语言与框架',
    techDesc: '从 iOS・Android 原生到跨平台、Web 和后端。根据项目特性选择最合适的技术。',
    servicesKicker: 'SERVICES',
    servicesTitle1: '产品全阶段',
    servicesTitle2: '由一个团队覆盖',
    service1Title: '移动 App 开发',
    service1Desc: 'iOS・Android 原生与 React Native・Flutter 跨平台',
    service2Title: 'Web 与管理后台',
    service2Desc: '基于 Next.js 的响应式 Web 及运营管理仪表盘',
    service3Title: '后端与基础设施',
    service3Desc: '基于 Supabase・Vercel・AWS 的可扩展服务器架构',
    service4Title: 'AI 集成',
    service4Desc: '将 LLM・语音・图像模型集成到产品工作流中',
    processKicker: 'OUR PROCESS',
    processTitle: 'Discovery — Design — Build — Grow',
    step1Items: ['问题定义', '用户场景', '技术调研', '范围共识'],
    step2Items: ['UX 流程', 'UI 设计稿', '数据模型', '原型'],
    step3Items: ['双周冲刺', 'Demo 同步', '质量验证', '渐进式交付'],
    step4Items: ['应用商店上架', '分析接入', '运营自动化', '功能扩展'],
    visionKicker: 'WHY JAICYLAB?',
    visionTitle1: '"快速打造,',
    visionTitle2: '长期陪伴的产品"',
    visionPairs: [
      { before: '仅按需求实现的外包', after: '从问题定义开始同行的伙伴' },
      { before: '上线后就失联的关系', after: '延续到运营与迭代的长期协作' },
      { before: '策划/设计/开发沟通割裂', after: '一体化团队,共识与落地更快' },
      { before: '技术选型依赖开发者偏好', after: '基于产品语境与运营成本的技术选型' },
    ],
    resourcesKicker: 'RESOURCES',
    resourcesTitle: '资料中心',
    resCompanyIntro: '公司介绍书',
    resPortfolio: '作品集',
    resPrivacy: '隐私政策',
    resTerms: '服务条款',
    resPreparing: '正在准备中',
    contactKicker: 'CONTACT',
    contactTitle: '项目咨询',
    contactDesc1: '处于创意阶段也没关系。',
    contactDesc2: '哪怕是简短的留言,我们也会尽快回复。',
    contactAddress: '韩国 水原市 长安区 西部路 2066 第2工学馆 27505',
    formCompany: '公司 / 所属机构',
    formName: '联系人 *',
    formPhone: '联系方式 *',
    formEmail: '邮箱',
    formMessage: '项目内容 *  (想做什么样的 App、预期排期、参考产品等,欢迎自由填写)',
    formSubmit: '提交咨询',
    formSending: '发送中...',
    formRequired: '请填写必填项',
    formSuccess: '咨询已收到,我们将在 1 个工作日内回复。',
    formFail: '发送失败。',
    formCompanyLabel: '公司',
    formAttachNote: (n) => `\n(附件 ${n} 个 — 请通过回复邮件发送)`,
    footerBrandSub: 'JAICYLAB',
    footerTag: 'App Development Studio',
    footerCopy: 'Copyright © JAICYLAB. All rights reserved.',
    footerPrivacy: '隐私政策',
    footerTerms: '服务条款',
    footerHome: '首页',
    privacyTitle: '隐私政策',
    privacyArticles: [
      { h: '第1条(目的)', b: 'JAICYLAB(以下简称"公司")依据适用的个人信息保护法律,为保护信息主体的个人信息并迅速处理相关诉求,特制定并公开本政策。' },
      { h: '第2条(收集项目)', b: '必填: 姓名、联系方式、邮箱 / 可选: 公司名、咨询内容 / 自动收集: 访问 IP、使用记录' },
      { h: '第3条(处理目的)', b: '项目咨询响应、合同审查、服务改进' },
      { h: '第4条(保存与销毁)', b: '达成目的后将立即予以销毁。' },
      { h: '第5条(第三方提供)', b: '未经同意不向第三方提供。' },
      { h: '第6条(联系方式)', b: 'jaicylab2009@gmail.com' },
    ],
    privacyEffective: '施行日期: 2026年1月1日',
    termsTitle: '服务条款',
    termsArticles: [
      { h: '第1条(目的)', b: '本条款规定 JAICYLAB 提供的 App 开发及相关服务的使用条件、权利、义务与责任事项。' },
      { h: '第2条(服务)', b: '移动 App、Web、后端、AI 集成开发及维护' },
      { h: '第3条(合同)', b: '范围、费用与排期按各项目单独合同确定。' },
      { h: '第4条(知识产权)', b: '款项结清后成果物的使用权发生转移。自有库与技术诀窍归公司所有。' },
      { h: '第5条(保密)', b: '项目过程中获取的信息不会对外泄露。' },
      { h: '第6条(责任限制)', b: '对不可抗力造成的损害不承担责任。' },
      { h: '第7条(争议解决)', b: '发生争议时,以公司所在地管辖法院为专属管辖。' },
    ],
    termsEffective: '施行日期: 2026年1月1日',
  },
}

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const visible = useInView(ref, { once: true, amount: 0.3 })
  useEffect(() => {
    if (!visible) return
    const dur = 1500; const st = Date.now()
    const tick = () => { const p = Math.min(1, (Date.now() - st) / dur); setVal(Math.round(target * p)); if (p < 1) requestAnimationFrame(tick) }
    tick()
  }, [visible, target])
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

export default function AboutPage() {
  const locale = useLocale() as Locale
  const c = CONTENT[locale] ?? CONTENT.ko

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

  const NAV_ITEMS: { key: NavKey; id: string }[] = [
    { key: 'about', id: 'about' },
    { key: 'tech', id: 'tech' },
    { key: 'services', id: 'services' },
    { key: 'process', id: 'process' },
    { key: 'vision', id: 'vision' },
    { key: 'resources', id: 'resources' },
    { key: 'contact', id: 'contact' },
  ]

  async function handleInquiry(e: React.FormEvent) {
    e.preventDefault()
    if (!inquiry.name || !inquiry.phone || !inquiry.message) { toast.error(c.formRequired); return }
    setSending(true)
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inquiry.name,
          phone: inquiry.phone,
          email: inquiry.email,
          memo: [
            inquiry.company ? `${c.formCompanyLabel}: ${inquiry.company}` : '',
            '',
            inquiry.message,
            files.length ? c.formAttachNote(files.length) : '',
          ].filter(Boolean).join('\n'),
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || c.formFail)
      }
      toast.success(c.formSuccess)
      setInquiry({ company: '', name: '', phone: '', email: '', message: '' })
      setFiles([])
    } catch (err) {
      toast.error(err instanceof Error ? err.message : c.formFail)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-black/60 backdrop-blur-2xl border-b border-white/5' : 'bg-transparent'}`}>
        <div className="mx-auto flex h-[60px] max-w-[1200px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <Logo height={22} className="text-white" />
            <span className="text-[12px] font-normal text-white/30">{c.brandSub}</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_ITEMS.map(n => (<button key={n.id} onClick={() => scrollTo(n.id)} className="text-[13px] font-medium text-white/40 transition-all hover:text-white">{c.nav[n.key]}</button>))}
            <Link href="/estimate" className="text-[13px] font-medium text-white/40 transition-all hover:text-white">{c.extraSelfEstimate}</Link>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button onClick={() => scrollTo('contact')} className="bg-white px-5 py-2 text-[13px] font-bold text-black transition-all hover:bg-white/90 active:scale-95">{c.ctaInquiry}</button>
          </div>
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
            <p className="mb-4 text-[12px] font-bold tracking-wide text-white/30">{c.heroKicker}</p>
          </Reveal>
          <Reveal delay={200}>
            <h1 className="text-[44px] font-bold leading-[1.1] tracking-tight md:text-[72px]">
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">{c.heroTitle1}</span><br />
              <span className="bg-gradient-to-r from-[#2979FF] to-[#82b1ff] bg-clip-text text-transparent">{c.heroTitle2}</span>
            </h1>
          </Reveal>
          <Reveal delay={400}>
            <p className="mx-auto mt-6 max-w-[520px] text-[15px] leading-relaxed text-white/40">
              {c.heroDesc1}<br />
              {c.heroDesc2}
            </p>
          </Reveal>
          <Reveal delay={600}>
            <div className="mt-10 flex justify-center gap-3">
              <button onClick={() => scrollTo('contact')} className="bg-white px-8 py-3.5 text-[15px] font-bold text-black transition-all hover:bg-white/90 active:scale-95">{c.heroCta1}</button>
              <button onClick={() => scrollTo('services')} className="border border-white/15 px-8 py-3.5 text-[15px] font-bold text-white/60 transition-all hover:bg-white/5 hover:text-white">{c.heroCta2}</button>
            </div>
          </Reveal>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"><ChevronRight className="h-5 w-5 rotate-90 text-white/15" /></div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-white/5 py-28">
        <div className="mx-auto max-w-[1100px] px-6">
          <Reveal><p className="text-[11px] font-bold tracking-wide text-[#2979FF]">{c.aboutKicker}</p></Reveal>
          <Reveal delay={100}><h2 className="mt-3 text-[36px] font-bold tracking-tight">{c.aboutTitle}</h2></Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-[640px] text-[15px] leading-[1.9] text-white/40">
              {c.aboutDesc}
            </p>
          </Reveal>

          {/* Spline + stats */}
          <div className="mt-16 flex flex-col items-center gap-8 md:flex-row">
            <div className="w-full md:w-1/2 h-[350px] relative">
              <iframe src="https://my.spline.design/earthdayandnight-uYL2SNcaKz91RDsQEV88Kqig/" className="h-full w-full border-none rounded-2xl" style={{ pointerEvents: 'none' }} />
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <Reveal>
                <p className="text-[11px] font-bold tracking-wide text-white/20">{c.ourTrackKicker}</p>
                <h3 className="mt-2 text-[24px] font-bold">{c.ourTrackTitle1}<br />{c.ourTrackTitle2}</h3>
              </Reveal>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { num: 30, suffix: '+', label: c.statLaunched, icon: <Building2 className="h-4 w-4" /> },
                  { num: 100, suffix: 'k+', label: c.statUsers, icon: <Users className="h-4 w-4" /> },
                  { num: 99, suffix: '.9%', label: c.statUptime, icon: <Zap className="h-4 w-4" /> },
                  { num: 24, suffix: '/7', label: c.statIssue, icon: <Clock className="h-4 w-4" /> },
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

          {/* Core values */}
          <div className="mt-20 grid gap-4 md:grid-cols-3">
            {[
              { icon: <Building2 className="h-6 w-6" />, title: c.value1Title, desc: c.value1Desc },
              { icon: <Users className="h-6 w-6" />, title: c.value2Title, desc: c.value2Desc },
              { icon: <BarChart3 className="h-6 w-6" />, title: c.value3Title, desc: c.value3Desc },
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

      {/* Tech stack — white */}
      <section id="tech" className="border-t border-white/5 bg-white py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <Reveal><p className="text-[11px] font-bold tracking-wide text-[#2979FF]">{c.techKicker}</p></Reveal>
          <Reveal delay={100}><h2 className="mt-3 text-[32px] font-bold tracking-tight text-slate-900">{c.techTitle}</h2></Reveal>
          <Reveal delay={200}>
            <p className="mt-4 max-w-[620px] text-[14px] leading-relaxed text-slate-500">
              {c.techDesc}
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-10">
              <TechMarquee />
            </div>
          </Reveal>
          <Reveal delay={400}>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                'Swift / SwiftUI', 'Kotlin / Compose', 'React Native', 'Flutter',
                'Next.js / React', 'Vue.js / Nuxt', 'Node.js / NestJS', 'Spring Boot',
                'Ionic / Capacitor', 'Supabase / Firebase', 'PostgreSQL / MongoDB', 'AWS / GCP / Vercel',
              ].map(t => (
                <span key={t} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[12px] font-medium text-slate-600">{t}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="border-t border-white/5 py-28 bg-white/[0.01]">
        <div className="mx-auto max-w-[1100px] px-6">
          <Reveal><p className="text-[11px] font-bold tracking-wide text-[#2979FF]">{c.servicesKicker}</p></Reveal>
          <Reveal delay={100}><h2 className="mt-3 text-[32px] font-bold tracking-tight">{c.servicesTitle1}<br />{c.servicesTitle2}</h2></Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {[
              { icon: <Smartphone className="h-5 w-5" />, title: c.service1Title, desc: c.service1Desc },
              { icon: <Code2 className="h-5 w-5" />, title: c.service2Title, desc: c.service2Desc },
              { icon: <Server className="h-5 w-5" />, title: c.service3Title, desc: c.service3Desc },
              { icon: <Sparkles className="h-5 w-5" />, title: c.service4Title, desc: c.service4Desc },
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

      {/* Process */}
      <section id="process" className="border-t border-white/5 py-28">
        <div className="mx-auto max-w-[1000px] px-6">
          <Reveal><p className="text-[11px] font-bold tracking-wide text-[#2979FF]">{c.processKicker}</p></Reveal>
          <Reveal delay={100}><h2 className="mt-3 text-[32px] font-bold tracking-tight">{c.processTitle}</h2></Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {[
              { step: '01', title: 'Discovery', color: '#ef4444', items: c.step1Items },
              { step: '02', title: 'Design', color: '#f59e0b', items: c.step2Items },
              { step: '03', title: 'Build', color: '#2979FF', items: c.step3Items },
              { step: '04', title: 'Launch & Grow', color: '#22c55e', items: c.step4Items },
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

      {/* Vision */}
      <section id="vision" className="border-t border-white/5 py-28 bg-white/[0.01]">
        <div className="mx-auto max-w-[1000px] px-6">
          <Reveal><p className="text-[11px] font-bold tracking-wide text-[#2979FF]">{c.visionKicker}</p></Reveal>
          <Reveal delay={100}>
            <h2 className="mt-3 text-[32px] font-bold tracking-tight">{c.visionTitle1}<br />{c.visionTitle2}</h2>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {c.visionPairs.map((p, i) => (
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

      {/* Resources */}
      <section id="resources" className="border-t border-white/5 py-28">
        <div className="mx-auto max-w-[1000px] px-6">
          <Reveal><p className="text-[11px] font-bold tracking-wide text-[#2979FF]">{c.resourcesKicker}</p></Reveal>
          <Reveal delay={100}><h2 className="mt-3 text-[32px] font-bold">{c.resourcesTitle}</h2></Reveal>
          <div className="mt-12 grid gap-3 md:grid-cols-2">
            {[
              { icon: <FileText className="h-5 w-5" />, title: c.resCompanyIntro, desc: 'PDF', action: () => toast(c.resPreparing) },
              { icon: <FileText className="h-5 w-5" />, title: c.resPortfolio, desc: 'PDF', action: () => toast(c.resPreparing) },
              { icon: <Shield className="h-5 w-5" />, title: c.resPrivacy, desc: '', action: () => setShowPrivacy(true) },
              { icon: <FileText className="h-5 w-5" />, title: c.resTerms, desc: '', action: () => setShowTerms(true) },
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

      {/* Contact */}
      <section id="contact" className="border-t border-white/5 py-28 bg-white/[0.01]">
        <div className="mx-auto grid max-w-[1000px] gap-12 px-6 md:grid-cols-[1fr_1.2fr]">
          <div>
            <Reveal><p className="text-[11px] font-bold tracking-wide text-[#2979FF]">{c.contactKicker}</p></Reveal>
            <Reveal delay={100}><h2 className="mt-3 text-[32px] font-bold">{c.contactTitle}</h2></Reveal>
            <Reveal delay={200}>
              <p className="mt-4 text-[14px] leading-relaxed text-white/40">
                {c.contactDesc1}<br />{c.contactDesc2}
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-8 space-y-3 text-[13px] text-white/50">
                <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#2979FF]" /> jaicylab2009@gmail.com</p>
                <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#2979FF]" /> +82-10-9433-5674</p>
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#2979FF]" /> {c.contactAddress}</p>
              </div>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <form onSubmit={handleInquiry} className="space-y-3">
              {[
                { ph: c.formCompany, k: 'company', req: false },
                { ph: c.formName, k: 'name', req: true },
                { ph: c.formPhone, k: 'phone', req: true },
                { ph: c.formEmail, k: 'email', req: false },
              ].map(f => (
                <input key={f.k} className="h-12 w-full border border-white/8 bg-white/[0.03] px-4 text-[14px] text-white outline-none transition-all placeholder-white/20 focus:border-[#2979FF] focus:bg-[#2979FF]/[0.02]" placeholder={f.ph} value={(inquiry as Record<string, string>)[f.k]} onChange={e => setInquiry({ ...inquiry, [f.k]: e.target.value })} required={f.req} />
              ))}
              <textarea className="h-40 w-full resize-none border border-white/8 bg-white/[0.03] px-4 py-3 text-[14px] text-white outline-none transition-all placeholder-white/20 focus:border-[#2979FF]" placeholder={c.formMessage} value={inquiry.message} onChange={e => setInquiry({ ...inquiry, message: e.target.value })} required />
              <FileDropzone theme="dark" files={files} onChange={setFiles} />
              <button type="submit" disabled={sending} className="flex w-full items-center justify-center gap-2 bg-white py-3.5 text-[15px] font-bold text-black transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-50">
                <Send className="h-4 w-4" /> {sending ? c.formSending : c.formSubmit}
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
                <span className="text-[13px] text-white/30">{c.footerBrandSub}</span>
              </div>
              <p className="mt-2 text-[11px] text-white/15">{c.footerTag} | T +82-10-9433-5674 | E jaicylab2009@gmail.com</p>
              <p className="text-[10px] text-white/10">{c.footerCopy}</p>
            </div>
            <div className="flex gap-4 text-[12px] text-white/25">
              <button onClick={() => setShowPrivacy(true)} className="transition-colors hover:text-white/50">{c.footerPrivacy}</button>
              <button onClick={() => setShowTerms(true)} className="transition-colors hover:text-white/50">{c.footerTerms}</button>
              <Link href="/" className="transition-colors hover:text-white/50">{c.footerHome}</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy */}
      {showPrivacy && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowPrivacy(false)}>
          <div className="relative w-full max-w-[700px] max-h-[80vh] overflow-auto bg-[#111] border border-white/10 p-8 animate-[scaleIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowPrivacy(false)} className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"><X className="h-5 w-5" /></button>
            <h2 className="text-[22px] font-bold mb-6">{c.privacyTitle}</h2>
            <div className="space-y-4 text-[13px] leading-[1.8] text-white/45">
              {c.privacyArticles.map((a, i) => (
                <p key={i}><strong className="text-white/80">{a.h}</strong><br />{a.b}</p>
              ))}
              <p className="text-white/15">{c.privacyEffective}</p>
            </div>
          </div>
        </div>
      )}

      {/* Terms */}
      {showTerms && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowTerms(false)}>
          <div className="relative w-full max-w-[700px] max-h-[80vh] overflow-auto bg-[#111] border border-white/10 p-8 animate-[scaleIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowTerms(false)} className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"><X className="h-5 w-5" /></button>
            <h2 className="text-[22px] font-bold mb-6">{c.termsTitle}</h2>
            <div className="space-y-4 text-[13px] leading-[1.8] text-white/45">
              {c.termsArticles.map((a, i) => (
                <p key={i}><strong className="text-white/80">{a.h}</strong><br />{a.b}</p>
              ))}
              <p className="text-white/15">{c.termsEffective}</p>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  )
}
