'use client'

import { useLocale } from 'next-intl'
import { GuideTemplate } from '@/components/GuideTemplate'
import { Flame, User, CreditCard, Settings, Key, Database, Bell, Shield } from 'lucide-react'

type Locale = 'ko' | 'en' | 'ja' | 'zh'

const badgeIcon = <Flame className="h-3.5 w-3.5 text-white/80" />
const icons = {
  user: <User className="h-5 w-5" />,
  card: <CreditCard className="h-5 w-5" />,
  shield: <Shield className="h-5 w-5" />,
  settings: <Settings className="h-5 w-5" />,
  flame: <Flame className="h-5 w-5" />,
  key: <Key className="h-5 w-5" />,
  bell: <Bell className="h-5 w-5" />,
  database: <Database className="h-5 w-5" />,
}

const DATA: Record<Locale, {
  badgeText: string
  titleTop: string
  titleBottom: string
  description: string
  ctaLabel: string
  stats: { label: string; value: string }[]
  overviewTitle: string
  overviewDesc: string
  overviewItems: { iconKey: keyof typeof icons; title: string; desc: string }[]
  steps: { no: string; title: string; tag: string; iconKey: keyof typeof icons; desc: string; details: string[] }[]
  pitfalls: { title: string; desc: string }[]
  resources: { title: string; desc: string; href: string }[]
}> = {
  ko: {
    badgeText: 'FIREBASE · GOOGLE CLOUD',
    titleTop: 'Firebase / GCP',
    titleBottom: '프로젝트 & 키 셋업',
    description: `앱 개발에서 가장 많이 쓰는 Firebase(FCM 푸시·Auth·Firestore·Analytics)와 Google Cloud 프로젝트 초기 셋업 가이드입니다.\n결제 프로필 연결부터 iOS/Android SDK 키까지 한 번에 정리합니다.`,
    ctaLabel: 'Firebase 콘솔 열기',
    stats: [
      { label: '가입비', value: '무료 (Spark)' },
      { label: '유료 전환', value: '필요 시 Blaze' },
      { label: '필요 정보', value: 'Google 계정·카드' },
    ],
    overviewTitle: '시작 전에 확인하세요',
    overviewDesc: 'Firebase는 Google Cloud 프로젝트 위에 올라가는 제품군입니다. Spark(무료) 요금제로 시작하되, Cloud Functions·Storage 사용량이 늘면 Blaze(종량제)로 업그레이드가 필요합니다. FCM 푸시 자체는 Spark에서도 무제한 무료입니다.',
    overviewItems: [
      { iconKey: 'user', title: 'Google 계정 + 2FA', desc: '조직 Workspace 계정 권장.' },
      { iconKey: 'card', title: '결제 수단 (Blaze)', desc: '해외결제 가능 카드 필요.' },
      { iconKey: 'shield', title: '프로젝트 명 정하기', desc: '일부 리소스에 고정 포함됨.' },
      { iconKey: 'settings', title: '리전 결정 (Asia-Northeast3)', desc: '한국 서비스는 서울 리전.' },
    ],
    steps: [
      { no: '01', title: 'Google Cloud 프로젝트 생성', tag: 'PROJECT', iconKey: 'settings', desc: 'Firebase는 내부적으로 GCP 프로젝트를 생성합니다.', details: [
        'console.cloud.google.com 접속',
        '새 프로젝트 만들기 (프로젝트 ID는 전역 고유)',
        '조직 없음 또는 조직 선택',
        '이후 Firebase 콘솔에서도 자동 연동됨',
      ] },
      { no: '02', title: 'Firebase 프로젝트 추가', tag: 'FIREBASE', iconKey: 'flame', desc: '기존 GCP 프로젝트에 Firebase 기능을 활성화합니다.', details: [
        'console.firebase.google.com > 프로젝트 추가',
        '기존 GCP 프로젝트 선택',
        'Google Analytics 사용 여부 선택 (권장: 사용)',
        'Analytics 계정 연결 (신규 생성 or 기존)',
      ] },
      { no: '03', title: '요금제 업그레이드 (필요 시)', tag: 'BILLING', iconKey: 'card', desc: '외부 API 호출·Storage 사용은 Blaze 필요.', details: [
        '요금제 > 업그레이드 > Blaze 종량제',
        '결제 계정 연결 (카드 등록)',
        '예산 알림 설정 (월 $10·$50·$100 등)',
        'Spark에서도 FCM·Auth·Firestore 무료 한도는 유지',
      ] },
      { no: '04', title: 'iOS / Android 앱 등록', tag: 'APP', iconKey: 'key', desc: '각 플랫폼용 설정 파일을 다운로드합니다.', details: [
        'iOS: 번들 ID 입력 → GoogleService-Info.plist 다운로드',
        'Android: 패키지명 + SHA-1(keystore) → google-services.json 다운로드',
        'Web: 앱 별칭 입력 → firebaseConfig 스크립트 복사',
        '설정 파일은 프로젝트 루트/Android app/ 폴더에 배치',
      ] },
      { no: '05', title: 'FCM 푸시 셋업', tag: 'PUSH', iconKey: 'bell', desc: '푸시 알림은 FCM(Firebase Cloud Messaging) 무료.', details: [
        'iOS: APNs 인증 키(.p8) 업로드 — Apple Developer 계정 필요',
        '  Key ID + Team ID도 함께 입력',
        'Android: FCM은 별도 설정 없이 google-services.json으로 동작',
        '서버 키는 Cloud Messaging 설정에서 확인',
      ] },
      { no: '06', title: 'Authentication 활성화', tag: 'AUTH', iconKey: 'shield', desc: '로그인 방식을 활성화합니다.', details: [
        '이메일/비밀번호 · Google · Apple · Facebook · 전화번호 등',
        '각 제공자별 OAuth 설정 (Apple은 Apple Developer에서 Service ID 발급)',
        '승인된 도메인 등록 (로컬 테스트는 localhost 자동 포함)',
        '보안 규칙 기본값 확인',
      ] },
      { no: '07', title: 'Firestore / Realtime DB', tag: 'DATABASE', iconKey: 'database', desc: '데이터 저장소 선택 및 생성.', details: [
        'Firestore: 문서 기반, 대부분 서비스에 권장',
        'Realtime Database: 실시간 동기화가 핵심인 경우',
        '리전 선택: asia-northeast3 (서울) 권장',
        '시작 모드: 프로덕션(권한 엄격) / 테스트(공개) — 반드시 프로덕션',
        '보안 규칙(Security Rules) 작성 필수',
      ] },
      { no: '08', title: '서비스 계정 / Admin SDK 키', tag: 'ADMIN', iconKey: 'key', desc: '서버에서 Admin SDK를 쓰려면 서비스 계정 키 발급.', details: [
        '프로젝트 설정 > 서비스 계정 > 새 비공개 키 생성',
        '.json 파일 다운로드 (한 번만 표시됨)',
        '절대 Git에 커밋 금지 · .env 또는 Secret Manager 사용',
        'Vercel이면 JSON 전체를 base64로 env에 저장하거나 개별 필드 분리',
      ] },
    ],
    pitfalls: [
      { title: 'Spark → Blaze 강제 전환', desc: 'Cloud Functions 배포·외부 API 호출 시 Blaze가 필수. 카드 등록이 안 된 상태로 배포하면 실패합니다.' },
      { title: 'APNs 키 미등록 iOS 푸시 실패', desc: 'iOS에서 FCM은 APNs(Apple Push Notification) 토큰을 FCM 토큰으로 변환해 사용합니다. Apple Developer에서 APNs 인증 키(.p8)를 먼저 발급하세요.' },
      { title: 'google-services.json 보안', desc: '자체는 공개 가능하지만 Android SHA-1이 포함되어 있어 함께 관리되는 값과 연결됩니다. 대신 서비스 계정 JSON은 절대 공개 금지.' },
      { title: 'Security Rules 기본값 방치', desc: '테스트 모드(공개) 상태로 두면 누구나 DB 조회 가능. 프로덕션 규칙으로 즉시 전환.' },
      { title: '리전 변경 불가', desc: 'Firestore/Storage 리전은 프로젝트 생성 시 한 번 결정하면 변경 불가. 서울 리전 선택 권장.' },
    ],
    resources: [
      { title: 'Firebase Console', desc: '프로젝트 관리', href: 'https://console.firebase.google.com' },
      { title: 'Google Cloud Console', desc: 'GCP 프로젝트 / 결제', href: 'https://console.cloud.google.com' },
      { title: 'Firebase 요금제', desc: 'Spark vs Blaze 비교', href: 'https://firebase.google.com/pricing' },
      { title: 'FCM 설정 가이드', desc: 'iOS/Android 푸시', href: 'https://firebase.google.com/docs/cloud-messaging' },
      { title: 'Firestore 보안 규칙', desc: 'Rules 언어 가이드', href: 'https://firebase.google.com/docs/firestore/security/get-started' },
      { title: 'Admin SDK 문서', desc: '서버 SDK 사용법', href: 'https://firebase.google.com/docs/admin/setup' },
    ],
  },
  en: {
    badgeText: 'FIREBASE · GOOGLE CLOUD',
    titleTop: 'Firebase / GCP',
    titleBottom: 'Project & Key Setup',
    description: `A setup guide for Firebase (FCM push, Auth, Firestore, Analytics) and the underlying Google Cloud project, the stack most app projects rely on.\nCovers billing profile linkage through iOS/Android SDK keys in one pass.`,
    ctaLabel: 'Open Firebase Console',
    stats: [
      { label: 'Signup', value: 'Free (Spark)' },
      { label: 'Paid tier', value: 'Blaze when needed' },
      { label: 'Requirements', value: 'Google account + card' },
    ],
    overviewTitle: 'Before you begin',
    overviewDesc: 'Firebase is a product suite built on top of a Google Cloud project. Start on the Spark (free) plan, and upgrade to Blaze (pay-as-you-go) when Cloud Functions or Storage usage grows. FCM push itself is unlimited and free on Spark.',
    overviewItems: [
      { iconKey: 'user', title: 'Google account + 2FA', desc: 'Workspace org account recommended.' },
      { iconKey: 'card', title: 'Payment method (Blaze)', desc: 'International-capable card required.' },
      { iconKey: 'shield', title: 'Pick a project name', desc: 'Baked into some resource IDs.' },
      { iconKey: 'settings', title: 'Region (Asia-Northeast3)', desc: 'Seoul region for KR services.' },
    ],
    steps: [
      { no: '01', title: 'Create a Google Cloud project', tag: 'PROJECT', iconKey: 'settings', desc: 'Firebase provisions a GCP project under the hood.', details: [
        'Open console.cloud.google.com',
        'Create new project (Project ID is globally unique)',
        'Choose "No organization" or pick your org',
        'Firebase Console will auto-link it later',
      ] },
      { no: '02', title: 'Add a Firebase project', tag: 'FIREBASE', iconKey: 'flame', desc: 'Enable Firebase features on your existing GCP project.', details: [
        'console.firebase.google.com > Add project',
        'Pick the existing GCP project',
        'Choose whether to enable Google Analytics (recommended)',
        'Link an Analytics account (new or existing)',
      ] },
      { no: '03', title: 'Upgrade plan (if needed)', tag: 'BILLING', iconKey: 'card', desc: 'External API calls and Storage require Blaze.', details: [
        'Plan > Upgrade > Blaze pay-as-you-go',
        'Attach a billing account (add a card)',
        'Set budget alerts ($10 / $50 / $100 monthly)',
        'FCM / Auth / Firestore free quotas still apply on Spark',
      ] },
      { no: '04', title: 'Register iOS / Android apps', tag: 'APP', iconKey: 'key', desc: 'Download a config file for each platform.', details: [
        'iOS: enter bundle ID, download GoogleService-Info.plist',
        'Android: package name + SHA-1 (keystore), download google-services.json',
        'Web: enter an app nickname, copy the firebaseConfig snippet',
        'Place config files at project root / Android app/ folder',
      ] },
      { no: '05', title: 'FCM push setup', tag: 'PUSH', iconKey: 'bell', desc: 'Push notifications via FCM (Firebase Cloud Messaging), free of charge.', details: [
        'iOS: upload APNs auth key (.p8) — Apple Developer account required',
        '  Provide Key ID and Team ID as well',
        'Android: works out of the box with google-services.json',
        'Server key is under Cloud Messaging settings',
      ] },
      { no: '06', title: 'Enable Authentication', tag: 'AUTH', iconKey: 'shield', desc: 'Turn on sign-in methods.', details: [
        'Email/password, Google, Apple, Facebook, phone, etc.',
        'OAuth configuration per provider (Apple requires a Service ID from Apple Developer)',
        'Add authorized domains (localhost is auto-included for local testing)',
        'Review default security rules',
      ] },
      { no: '07', title: 'Firestore / Realtime DB', tag: 'DATABASE', iconKey: 'database', desc: 'Pick a data store and create it.', details: [
        'Firestore: document-based, recommended for most services',
        'Realtime Database: when real-time sync is central',
        'Region: asia-northeast3 (Seoul) recommended',
        'Start mode: production (strict) or test (open) — always use production',
        'Security Rules are mandatory',
      ] },
      { no: '08', title: 'Service account / Admin SDK key', tag: 'ADMIN', iconKey: 'key', desc: 'Server-side Admin SDK needs a service account key.', details: [
        'Project settings > Service accounts > Generate new private key',
        'Download the .json file (shown only once)',
        'Never commit to Git — use .env or Secret Manager',
        'On Vercel, store the full JSON as base64 env or split into individual fields',
      ] },
    ],
    pitfalls: [
      { title: 'Forced Spark → Blaze upgrade', desc: 'Deploying Cloud Functions or calling external APIs requires Blaze. Deploys will fail without a registered card.' },
      { title: 'iOS push fails without APNs key', desc: 'On iOS, FCM converts APNs (Apple Push Notification) tokens into FCM tokens. Issue an APNs auth key (.p8) from Apple Developer first.' },
      { title: 'google-services.json hygiene', desc: 'The file itself can be public, but it carries your Android SHA-1 — manage it alongside related values. The service account JSON, however, must never be exposed.' },
      { title: 'Default Security Rules left open', desc: 'If test mode (open) is left in place, anyone can read your DB. Switch to production rules immediately.' },
      { title: 'Region is permanent', desc: 'Firestore/Storage region is fixed at project creation. Choose Seoul if you serve Korean users.' },
    ],
    resources: [
      { title: 'Firebase Console', desc: 'Project management', href: 'https://console.firebase.google.com' },
      { title: 'Google Cloud Console', desc: 'GCP project / billing', href: 'https://console.cloud.google.com' },
      { title: 'Firebase Pricing', desc: 'Spark vs Blaze', href: 'https://firebase.google.com/pricing' },
      { title: 'FCM setup guide', desc: 'iOS / Android push', href: 'https://firebase.google.com/docs/cloud-messaging' },
      { title: 'Firestore Security Rules', desc: 'Rules language guide', href: 'https://firebase.google.com/docs/firestore/security/get-started' },
      { title: 'Admin SDK docs', desc: 'Server SDK usage', href: 'https://firebase.google.com/docs/admin/setup' },
    ],
  },
  ja: {
    badgeText: 'FIREBASE · GOOGLE CLOUD',
    titleTop: 'Firebase / GCP',
    titleBottom: 'プロジェクト&キー設定',
    description: `アプリ開発で最もよく使われる Firebase(FCM プッシュ・Auth・Firestore・Analytics)と Google Cloud プロジェクトの初期設定ガイドです。\n支払いプロファイルの連携から iOS / Android SDK キーまでまとめて整理します。`,
    ctaLabel: 'Firebase コンソールを開く',
    stats: [
      { label: '登録費用', value: '無料(Spark)' },
      { label: '有料移行', value: '必要に応じて Blaze' },
      { label: '必要情報', value: 'Google アカウント・カード' },
    ],
    overviewTitle: '始める前に確認してください',
    overviewDesc: 'Firebase は Google Cloud プロジェクト上で動く製品群です。Spark(無料)プランから始め、Cloud Functions や Storage の利用量が増えたら Blaze(従量課金)へのアップグレードが必要になります。FCM プッシュ自体は Spark でも無制限で無料です。',
    overviewItems: [
      { iconKey: 'user', title: 'Google アカウント + 2FA', desc: '組織 Workspace アカウントを推奨します。' },
      { iconKey: 'card', title: '支払い方法(Blaze)', desc: '海外決済対応カードが必要です。' },
      { iconKey: 'shield', title: 'プロジェクト名の決定', desc: '一部リソースに固定で含まれます。' },
      { iconKey: 'settings', title: 'リージョン(Asia-Northeast3)', desc: '韓国向けはソウルリージョン。' },
    ],
    steps: [
      { no: '01', title: 'Google Cloud プロジェクトの作成', tag: 'PROJECT', iconKey: 'settings', desc: 'Firebase は内部的に GCP プロジェクトを作成します。', details: [
        'console.cloud.google.com にアクセス',
        '新しいプロジェクトを作成(Project ID はグローバルで一意)',
        '組織なし、または組織を選択',
        'Firebase コンソールでも自動的に連携されます',
      ] },
      { no: '02', title: 'Firebase プロジェクトの追加', tag: 'FIREBASE', iconKey: 'flame', desc: '既存の GCP プロジェクトに Firebase 機能を有効化します。', details: [
        'console.firebase.google.com > プロジェクトを追加',
        '既存の GCP プロジェクトを選択',
        'Google Analytics 利用有無を選択(推奨:利用)',
        'Analytics アカウントを連携(新規または既存)',
      ] },
      { no: '03', title: 'プラン変更(必要時)', tag: 'BILLING', iconKey: 'card', desc: '外部 API 呼び出しと Storage 利用には Blaze が必要です。', details: [
        'プラン > アップグレード > Blaze 従量課金',
        '請求先アカウントを連携(カード登録)',
        '予算アラート設定(月 $10・$50・$100 など)',
        'Spark でも FCM / Auth / Firestore の無料枠は維持されます',
      ] },
      { no: '04', title: 'iOS / Android アプリ登録', tag: 'APP', iconKey: 'key', desc: '各プラットフォーム用の設定ファイルをダウンロードします。', details: [
        'iOS: バンドル ID を入力 → GoogleService-Info.plist をダウンロード',
        'Android: パッケージ名 + SHA-1(keystore)→ google-services.json をダウンロード',
        'Web: アプリ名を入力 → firebaseConfig スクリプトをコピー',
        '設定ファイルはプロジェクトルート / Android app/ に配置',
      ] },
      { no: '05', title: 'FCM プッシュ設定', tag: 'PUSH', iconKey: 'bell', desc: 'プッシュ通知は FCM(Firebase Cloud Messaging)で無料です。', details: [
        'iOS: APNs 認証キー(.p8)をアップロード — Apple Developer アカウントが必要',
        '  Key ID と Team ID も併せて入力',
        'Android: FCM は google-services.json だけで動作します',
        'サーバーキーは Cloud Messaging 設定で確認',
      ] },
      { no: '06', title: 'Authentication 有効化', tag: 'AUTH', iconKey: 'shield', desc: 'ログイン方法を有効化します。', details: [
        'メール/パスワード・Google・Apple・Facebook・電話番号など',
        '各プロバイダーごとに OAuth 設定が必要(Apple は Apple Developer で Service ID を発行)',
        '承認済みドメインを登録(ローカルテストでは localhost は自動で含まれます)',
        'デフォルトのセキュリティルールを確認',
      ] },
      { no: '07', title: 'Firestore / Realtime DB', tag: 'DATABASE', iconKey: 'database', desc: 'データストアを選択して作成します。', details: [
        'Firestore: ドキュメントベース、ほとんどのサービスに推奨',
        'Realtime Database: リアルタイム同期が中心の場合',
        'リージョン: asia-northeast3(ソウル)を推奨',
        '開始モード: 本番(厳格) / テスト(公開) — 必ず本番を選択',
        'セキュリティルールの記述は必須',
      ] },
      { no: '08', title: 'サービスアカウント / Admin SDK キー', tag: 'ADMIN', iconKey: 'key', desc: 'サーバーで Admin SDK を使う場合はサービスアカウントキーを発行します。', details: [
        'プロジェクト設定 > サービスアカウント > 新しい秘密鍵を生成',
        '.json ファイルをダウンロード(表示は一度だけ)',
        'Git へのコミット厳禁 · .env または Secret Manager を使用',
        'Vercel では JSON 全体を base64 で env に保存、もしくはフィールド単位に分割',
      ] },
    ],
    pitfalls: [
      { title: 'Spark → Blaze への強制移行', desc: 'Cloud Functions のデプロイや外部 API 呼び出しには Blaze が必須です。カード未登録ではデプロイが失敗します。' },
      { title: 'APNs キー未登録で iOS プッシュ失敗', desc: 'iOS の FCM は APNs(Apple Push Notification)トークンを FCM トークンに変換して使います。先に Apple Developer で APNs 認証キー(.p8)を発行してください。' },
      { title: 'google-services.json の取り扱い', desc: 'ファイル自体は公開可能ですが Android SHA-1 を含むため関連情報と一緒に管理されます。一方、サービスアカウント JSON は絶対に公開しないでください。' },
      { title: 'セキュリティルールを放置', desc: 'テストモード(公開)のままだと誰でも DB を閲覧できます。すぐに本番ルールへ切り替えてください。' },
      { title: 'リージョンは変更不可', desc: 'Firestore / Storage のリージョンはプロジェクト作成時に一度決めたら変更できません。ソウルリージョンを推奨します。' },
    ],
    resources: [
      { title: 'Firebase Console', desc: 'プロジェクト管理', href: 'https://console.firebase.google.com' },
      { title: 'Google Cloud Console', desc: 'GCP プロジェクト / 請求', href: 'https://console.cloud.google.com' },
      { title: 'Firebase 料金プラン', desc: 'Spark と Blaze の比較', href: 'https://firebase.google.com/pricing' },
      { title: 'FCM 設定ガイド', desc: 'iOS / Android プッシュ', href: 'https://firebase.google.com/docs/cloud-messaging' },
      { title: 'Firestore セキュリティルール', desc: 'ルール言語ガイド', href: 'https://firebase.google.com/docs/firestore/security/get-started' },
      { title: 'Admin SDK ドキュメント', desc: 'サーバー SDK の使い方', href: 'https://firebase.google.com/docs/admin/setup' },
    ],
  },
  zh: {
    badgeText: 'FIREBASE · GOOGLE CLOUD',
    titleTop: 'Firebase / GCP',
    titleBottom: '项目与密钥配置',
    description: `App 开发中最常用的 Firebase(FCM 推送 · Auth · Firestore · Analytics)与 Google Cloud 项目初始化配置指南。\n从绑定账单资料到 iOS / Android SDK 密钥一次性梳理清楚。`,
    ctaLabel: '打开 Firebase 控制台',
    stats: [
      { label: '注册费用', value: '免费(Spark)' },
      { label: '付费升级', value: '按需升级 Blaze' },
      { label: '所需信息', value: 'Google 账户与信用卡' },
    ],
    overviewTitle: '开始前请确认',
    overviewDesc: 'Firebase 是构建在 Google Cloud 项目之上的产品矩阵。建议先使用 Spark(免费)套餐,当 Cloud Functions 或 Storage 用量增长后再升级到 Blaze(按量计费)。FCM 推送在 Spark 套餐下也是无限量免费。',
    overviewItems: [
      { iconKey: 'user', title: 'Google 账户 + 2FA', desc: '建议使用组织 Workspace 账户。' },
      { iconKey: 'card', title: '支付方式(Blaze)', desc: '需要支持境外支付的信用卡。' },
      { iconKey: 'shield', title: '确定项目名称', desc: '部分资源 ID 将固定包含该名称。' },
      { iconKey: 'settings', title: '区域选择(Asia-Northeast3)', desc: '面向韩国用户选择首尔区域。' },
    ],
    steps: [
      { no: '01', title: '创建 Google Cloud 项目', tag: 'PROJECT', iconKey: 'settings', desc: 'Firebase 会在底层创建 GCP 项目。', details: [
        '访问 console.cloud.google.com',
        '创建新项目(Project ID 全局唯一)',
        '选择"无组织"或指定组织',
        'Firebase 控制台将自动联动',
      ] },
      { no: '02', title: '添加 Firebase 项目', tag: 'FIREBASE', iconKey: 'flame', desc: '在现有 GCP 项目上启用 Firebase 功能。', details: [
        'console.firebase.google.com > 添加项目',
        '选择已有 GCP 项目',
        '选择是否启用 Google Analytics(建议启用)',
        '关联 Analytics 账户(新建或复用)',
      ] },
      { no: '03', title: '升级套餐(按需)', tag: 'BILLING', iconKey: 'card', desc: '调用外部 API 与使用 Storage 需升级到 Blaze。', details: [
        '套餐 > 升级 > Blaze 按量计费',
        '绑定结算账户(添加信用卡)',
        '设置预算提醒(每月 $10 / $50 / $100 等)',
        '即使升级后 FCM / Auth / Firestore 的免费额度仍然保留',
      ] },
      { no: '04', title: '注册 iOS / Android 应用', tag: 'APP', iconKey: 'key', desc: '为每个平台下载配置文件。', details: [
        'iOS: 输入 Bundle ID → 下载 GoogleService-Info.plist',
        'Android: 填写包名 + SHA-1(keystore)→ 下载 google-services.json',
        'Web: 输入应用昵称 → 复制 firebaseConfig 脚本',
        '将配置文件放入项目根目录或 Android app/ 目录',
      ] },
      { no: '05', title: 'FCM 推送配置', tag: 'PUSH', iconKey: 'bell', desc: '推送通知使用 FCM(Firebase Cloud Messaging),完全免费。', details: [
        'iOS: 上传 APNs 认证密钥(.p8)— 需要 Apple Developer 账户',
        '  同时填写 Key ID 和 Team ID',
        'Android: 无需额外配置,依赖 google-services.json 即可',
        '服务器密钥在 Cloud Messaging 设置中查看',
      ] },
      { no: '06', title: '启用 Authentication', tag: 'AUTH', iconKey: 'shield', desc: '开启所需的登录方式。', details: [
        '邮箱/密码 · Google · Apple · Facebook · 手机号等',
        '各登录方式需单独配置 OAuth(Apple 需在 Apple Developer 签发 Service ID)',
        '添加授权域名(本地测试已自动包含 localhost)',
        '确认默认的安全规则',
      ] },
      { no: '07', title: 'Firestore / Realtime DB', tag: 'DATABASE', iconKey: 'database', desc: '选择并创建数据存储。', details: [
        'Firestore: 基于文档,适合大多数业务场景',
        'Realtime Database: 实时同步为核心的场景',
        '区域: 建议 asia-northeast3(首尔)',
        '初始模式: 生产(严格) / 测试(开放)— 一律选择生产',
        '必须编写安全规则(Security Rules)',
      ] },
      { no: '08', title: '服务账户 / Admin SDK 密钥', tag: 'ADMIN', iconKey: 'key', desc: '在服务器使用 Admin SDK 时需要签发服务账户密钥。', details: [
        '项目设置 > 服务账户 > 生成新的私钥',
        '下载 .json 文件(仅显示一次)',
        '绝不提交到 Git · 请使用 .env 或 Secret Manager',
        'Vercel 可将整个 JSON 以 base64 存入环境变量,或按字段拆分',
      ] },
    ],
    pitfalls: [
      { title: 'Spark → Blaze 强制升级', desc: '部署 Cloud Functions 或调用外部 API 必须使用 Blaze。未绑定信用卡时部署会失败。' },
      { title: 'APNs 密钥未登记导致 iOS 推送失败', desc: '在 iOS 上,FCM 会把 APNs(Apple Push Notification)令牌转换为 FCM 令牌。请先在 Apple Developer 中签发 APNs 认证密钥(.p8)。' },
      { title: 'google-services.json 的安全', desc: '该文件本身可公开,但包含 Android SHA-1,需与相关配置一起管理。而服务账户 JSON 必须严格保密。' },
      { title: '默认安全规则未修改', desc: '保留在测试模式(开放)会导致任何人都能读写数据库。请立即切换为生产规则。' },
      { title: '区域不可变更', desc: 'Firestore / Storage 区域在项目创建时决定后无法更改,建议选择首尔。' },
    ],
    resources: [
      { title: 'Firebase Console', desc: '项目管理', href: 'https://console.firebase.google.com' },
      { title: 'Google Cloud Console', desc: 'GCP 项目 / 账单', href: 'https://console.cloud.google.com' },
      { title: 'Firebase 价格', desc: 'Spark 与 Blaze 对比', href: 'https://firebase.google.com/pricing' },
      { title: 'FCM 配置指南', desc: 'iOS / Android 推送', href: 'https://firebase.google.com/docs/cloud-messaging' },
      { title: 'Firestore 安全规则', desc: '规则语言指南', href: 'https://firebase.google.com/docs/firestore/security/get-started' },
      { title: 'Admin SDK 文档', desc: '服务端 SDK 使用方式', href: 'https://firebase.google.com/docs/admin/setup' },
    ],
  },
}

export default function FirebaseGuidePage() {
  const locale = useLocale() as Locale
  const d = DATA[locale] ?? DATA.ko
  return (
    <GuideTemplate
      badge={{ icon: badgeIcon, text: d.badgeText }}
      titleTop={d.titleTop}
      titleBottom={d.titleBottom}
      description={d.description}
      primaryCta={{ label: d.ctaLabel, href: 'https://console.firebase.google.com' }}
      stats={d.stats}
      overviewTitle={d.overviewTitle}
      overviewDesc={d.overviewDesc}
      overviewItems={d.overviewItems.map(i => ({ icon: icons[i.iconKey], title: i.title, desc: i.desc }))}
      steps={d.steps.map(s => ({ no: s.no, title: s.title, tag: s.tag, icon: icons[s.iconKey], desc: s.desc, details: s.details }))}
      pitfalls={d.pitfalls}
      resources={d.resources}
    />
  )
}
