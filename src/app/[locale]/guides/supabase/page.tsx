'use client'

import { useLocale } from 'next-intl'
import { GuideTemplate } from '@/components/GuideTemplate'
import { Database, User, Key, Shield, Users, HardDrive, Zap, Settings } from 'lucide-react'

type Locale = 'ko' | 'en' | 'ja' | 'zh'

const badgeIcon = <Database className="h-3.5 w-3.5 text-white/80" />
const icons = {
  user: <User className="h-5 w-5" />,
  settings: <Settings className="h-5 w-5" />,
  shield: <Shield className="h-5 w-5" />,
  key: <Key className="h-5 w-5" />,
  database: <Database className="h-5 w-5" />,
  drive: <HardDrive className="h-5 w-5" />,
  zap: <Zap className="h-5 w-5" />,
  users: <Users className="h-5 w-5" />,
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
    badgeText: 'SUPABASE',
    titleTop: 'Supabase',
    titleBottom: '프로젝트 생성 & 키 셋업',
    description: `오픈소스 Firebase 대안 Supabase로 빠르게 백엔드를 띄우는 가이드입니다.\nPostgreSQL·Auth·Storage·Realtime·Edge Functions를 한 번에 구성합니다.`,
    ctaLabel: 'Supabase 대시보드 열기',
    stats: [
      { label: '무료 플랜', value: '2개 프로젝트' },
      { label: '유료 전환', value: 'Pro $25/월~' },
      { label: '필요 정보', value: 'GitHub 계정 권장' },
    ],
    overviewTitle: '시작 전에 확인하세요',
    overviewDesc: 'Supabase 무료 플랜은 프로젝트가 1주일 비활성 시 일시 정지됩니다. 프로덕션 서비스는 Pro 플랜($25/월~)으로 전환해야 안정적입니다. Row Level Security(RLS)를 반드시 켜두고 시작하세요 — 기본 비활성이면 모든 데이터가 공개됩니다.',
    overviewItems: [
      { iconKey: 'user', title: 'GitHub 계정', desc: 'Supabase는 GitHub OAuth 기반.' },
      { iconKey: 'settings', title: '리전 선택', desc: '한국은 Tokyo(ap-northeast-1).' },
      { iconKey: 'shield', title: 'RLS 정책 설계', desc: 'Row Level Security 기본 비활성.' },
      { iconKey: 'key', title: '두 종류의 키 구분', desc: 'anon vs service_role.' },
    ],
    steps: [
      { no: '01', title: '계정 가입 & 조직 생성', tag: 'SIGNUP', iconKey: 'user', desc: 'supabase.com에서 GitHub으로 가입.', details: [
        'Sign in with GitHub 권장 (이메일도 가능)',
        '조직(Organization) 자동 생성 — 팀 단위로 프로젝트 묶음',
        '팀원 초대는 조직 단위로 관리',
        '무료 플랜: 조직당 프로젝트 2개 제한',
      ] },
      { no: '02', title: '새 프로젝트 생성', tag: 'PROJECT', iconKey: 'database', desc: '데이터베이스와 리전을 결정합니다.', details: [
        'New Project 클릭',
        '프로젝트 이름 (URL 슬러그로 사용됨)',
        'Database Password 생성 (강력한 비밀번호, 안전 보관)',
        'Region: Northeast Asia (Tokyo)가 한국에서 가장 빠름',
        'Pricing Plan: Free / Pro / Team',
        '프로비저닝 2~3분 소요',
      ] },
      { no: '03', title: 'API 키 확인', tag: 'KEYS', iconKey: 'key', desc: '두 가지 키의 역할을 명확히 이해하세요.', details: [
        'Settings > API 메뉴',
        'Project URL: https://${id}.supabase.co',
        'anon public key: 프론트엔드에서 사용 가능, RLS로 보호됨',
        'service_role key: 서버 전용, RLS 우회 · 절대 노출 금지',
        'JWT Secret: 커스텀 토큰 발급 시 사용',
        '.env.local에 NEXT_PUBLIC_SUPABASE_URL / ANON_KEY 저장',
      ] },
      { no: '04', title: 'Authentication 설정', tag: 'AUTH', iconKey: 'shield', desc: '로그인 방식을 활성화합니다.', details: [
        'Authentication > Providers 메뉴',
        'Email (기본 활성), Phone, Google, Apple, Kakao 등',
        '각 OAuth 공급자는 별도 설정 필요 (Client ID/Secret)',
        'Redirect URL: https://${id}.supabase.co/auth/v1/callback',
        'Email Templates 한국어로 커스터마이징',
        'Rate Limits 확인 (무료 플랜은 시간당 제한)',
      ] },
      { no: '05', title: '테이블 생성 & RLS 정책', tag: 'DATABASE', iconKey: 'database', desc: 'Postgres 테이블을 만들고 보안 정책을 설정.', details: [
        'Table Editor로 GUI 생성 또는 SQL Editor에서 DDL 실행',
        '신규 테이블은 반드시 Enable RLS 체크',
        'RLS 정책 예: "auth.uid() = user_id" (본인만 조회)',
        'Realtime 활성화 — INSERT/UPDATE/DELETE 이벤트 구독',
        'Foreign Key 관계 설정 (auth.users와 연결 권장)',
      ] },
      { no: '06', title: 'Storage 버킷 설정', tag: 'STORAGE', iconKey: 'drive', desc: '파일 업로드를 위한 버킷 생성.', details: [
        'Storage > New Bucket',
        'Public / Private 선택',
        'Public: 누구나 URL로 접근, 프로필 이미지 등에 적합',
        'Private: 인증된 사용자만, signed URL로 접근',
        'RLS 정책으로 업로드·다운로드 권한 제어',
        '이미지 변환 기능(image transformation)은 Pro 플랜',
      ] },
      { no: '07', title: 'Edge Functions 배포', tag: 'FUNCTIONS', iconKey: 'zap', desc: '서버리스 함수로 커스텀 API 구현.', details: [
        'Deno 런타임 기반, TypeScript 지원',
        'supabase init → supabase functions new my-func',
        'supabase functions deploy my-func',
        '외부 API 호출·복잡한 로직·웹훅 처리에 유용',
        '환경변수는 supabase secrets set 명령',
        '무료 플랜 한도: 500K invocations/월',
      ] },
      { no: '08', title: '팀 초대 & 백업', tag: 'OPS', iconKey: 'users', desc: '운영 필수 설정.', details: [
        'Organization Settings > Team에서 멤버 초대',
        '역할: Owner / Developer (세부 권한은 Pro 이상)',
        'Database > Backups: 일일 자동 백업',
        'Free 플랜은 7일 보관, Pro는 30일',
        'Point-in-time Recovery는 Team 플랜 이상',
        'Disable Postgres upgrades 비활성 권장',
      ] },
    ],
    pitfalls: [
      { title: 'RLS 비활성 상태로 배포', desc: 'Row Level Security가 꺼져 있으면 anon 키로 모든 테이블 조회/수정이 가능합니다. 데이터 유출 사고 1순위.' },
      { title: 'service_role 키 프론트 노출', desc: 'service_role은 RLS를 우회하는 관리자 키입니다. NEXT_PUBLIC_ 접두사를 절대 붙이면 안 됩니다.' },
      { title: '무료 플랜 자동 일시정지', desc: '1주일 비활성 시 프로젝트가 paused 상태로 전환되어 API가 404를 반환합니다. 프로덕션은 Pro 필수.' },
      { title: '리전 변경 불가', desc: '프로젝트 생성 시 리전은 변경 불가. 잘못 선택하면 새 프로젝트 만들고 마이그레이션해야 합니다.' },
      { title: 'Database Password 분실', desc: '복구 불가능합니다. 반드시 비밀번호 관리자에 저장. 잃으면 새 프로젝트를 만들어야 합니다.' },
    ],
    resources: [
      { title: 'Supabase Dashboard', desc: '프로젝트 관리', href: 'https://supabase.com/dashboard' },
      { title: 'Pricing', desc: '요금제 비교', href: 'https://supabase.com/pricing' },
      { title: 'Auth 문서', desc: '로그인 구현 가이드', href: 'https://supabase.com/docs/guides/auth' },
      { title: 'Row Level Security', desc: 'RLS 정책 작성법', href: 'https://supabase.com/docs/guides/auth/row-level-security' },
      { title: 'JavaScript 클라이언트', desc: '@supabase/supabase-js', href: 'https://supabase.com/docs/reference/javascript/introduction' },
      { title: 'Edge Functions', desc: 'Deno 서버리스', href: 'https://supabase.com/docs/guides/functions' },
    ],
  },
  en: {
    badgeText: 'SUPABASE',
    titleTop: 'Supabase',
    titleBottom: 'Project & Key Setup',
    description: `A guide for spinning up a backend fast with Supabase, the open-source Firebase alternative.\nConfigure PostgreSQL, Auth, Storage, Realtime, and Edge Functions in one pass.`,
    ctaLabel: 'Open Supabase Dashboard',
    stats: [
      { label: 'Free plan', value: '2 projects' },
      { label: 'Paid tier', value: 'Pro from $25/mo' },
      { label: 'Requirements', value: 'GitHub account recommended' },
    ],
    overviewTitle: 'Before you begin',
    overviewDesc: "Supabase's free plan pauses a project after 1 week of inactivity. Move production workloads to Pro ($25/mo+) for stable uptime. Always enable Row Level Security (RLS) from day one — when disabled, all data is publicly accessible.",
    overviewItems: [
      { iconKey: 'user', title: 'GitHub account', desc: 'Supabase uses GitHub OAuth.' },
      { iconKey: 'settings', title: 'Region selection', desc: 'Tokyo (ap-northeast-1) for Korea.' },
      { iconKey: 'shield', title: 'RLS policy design', desc: 'Row Level Security is off by default.' },
      { iconKey: 'key', title: 'Two key types', desc: 'anon vs service_role.' },
    ],
    steps: [
      { no: '01', title: 'Sign up & create org', tag: 'SIGNUP', iconKey: 'user', desc: 'Sign up on supabase.com with GitHub.', details: [
        'Sign in with GitHub recommended (email also works)',
        'An Organization is auto-created — projects are grouped per team',
        'Invite teammates at the organization level',
        'Free plan: 2 projects per organization',
      ] },
      { no: '02', title: 'Create a new project', tag: 'PROJECT', iconKey: 'database', desc: 'Pick the database and region.', details: [
        'Click New Project',
        'Project name (used as URL slug)',
        'Create a strong Database Password and store it safely',
        'Region: Northeast Asia (Tokyo) is fastest from Korea',
        'Pricing Plan: Free / Pro / Team',
        'Provisioning takes 2–3 minutes',
      ] },
      { no: '03', title: 'Check API keys', tag: 'KEYS', iconKey: 'key', desc: 'Understand the role of each key clearly.', details: [
        'Settings > API menu',
        'Project URL: https://${id}.supabase.co',
        'anon public key: usable on the frontend, protected by RLS',
        'service_role key: server-only, bypasses RLS — never expose',
        'JWT Secret: used when issuing custom tokens',
        'Store NEXT_PUBLIC_SUPABASE_URL / ANON_KEY in .env.local',
      ] },
      { no: '04', title: 'Authentication setup', tag: 'AUTH', iconKey: 'shield', desc: 'Enable sign-in methods.', details: [
        'Authentication > Providers menu',
        'Email (on by default), Phone, Google, Apple, Kakao, etc.',
        'Each OAuth provider requires its own Client ID / Secret',
        'Redirect URL: https://${id}.supabase.co/auth/v1/callback',
        'Customize email templates (e.g., localize to Korean)',
        'Check rate limits (free plan is throttled hourly)',
      ] },
      { no: '05', title: 'Tables & RLS policies', tag: 'DATABASE', iconKey: 'database', desc: 'Create Postgres tables and set security policies.', details: [
        'Use Table Editor (GUI) or run DDL in the SQL Editor',
        'Always check Enable RLS on new tables',
        'Example RLS policy: "auth.uid() = user_id" (owner-only reads)',
        'Enable Realtime — subscribe to INSERT / UPDATE / DELETE events',
        'Set up foreign keys (recommended link to auth.users)',
      ] },
      { no: '06', title: 'Configure Storage buckets', tag: 'STORAGE', iconKey: 'drive', desc: 'Create buckets for uploads.', details: [
        'Storage > New Bucket',
        'Pick Public or Private',
        'Public: accessible by URL to anyone, good for avatars',
        'Private: only authenticated users, via signed URLs',
        'Control upload / download access with RLS policies',
        'Image transformation is a Pro-plan feature',
      ] },
      { no: '07', title: 'Deploy Edge Functions', tag: 'FUNCTIONS', iconKey: 'zap', desc: 'Build custom APIs with serverless functions.', details: [
        'Deno runtime with TypeScript support',
        'supabase init → supabase functions new my-func',
        'supabase functions deploy my-func',
        'Great for external API calls, complex logic, and webhooks',
        'Set env vars with `supabase secrets set`',
        'Free plan limit: 500K invocations/month',
      ] },
      { no: '08', title: 'Team invites & backups', tag: 'OPS', iconKey: 'users', desc: 'Mandatory operational setup.', details: [
        'Invite members under Organization Settings > Team',
        'Roles: Owner / Developer (fine-grained roles on Pro+)',
        'Database > Backups: automatic daily backups',
        'Free plan retains 7 days, Pro keeps 30',
        'Point-in-time Recovery requires the Team plan',
        'Disable automatic Postgres upgrades is recommended',
      ] },
    ],
    pitfalls: [
      { title: 'Shipping with RLS disabled', desc: 'With Row Level Security off, the anon key can read and write every table. This is the top cause of data leaks.' },
      { title: 'Leaking service_role to frontend', desc: 'service_role is the admin key that bypasses RLS. Never prefix it with NEXT_PUBLIC_.' },
      { title: 'Free plan auto-pauses', desc: 'After 1 week of inactivity the project is paused and APIs return 404. Production should run on Pro.' },
      { title: 'Region is permanent', desc: 'The region is fixed at project creation. A mistake means creating a new project and migrating.' },
      { title: 'Lost Database Password', desc: 'It cannot be recovered. Store it in a password manager; otherwise you have to recreate the project.' },
    ],
    resources: [
      { title: 'Supabase Dashboard', desc: 'Project management', href: 'https://supabase.com/dashboard' },
      { title: 'Pricing', desc: 'Plan comparison', href: 'https://supabase.com/pricing' },
      { title: 'Auth docs', desc: 'Sign-in implementation guide', href: 'https://supabase.com/docs/guides/auth' },
      { title: 'Row Level Security', desc: 'How to write RLS policies', href: 'https://supabase.com/docs/guides/auth/row-level-security' },
      { title: 'JavaScript client', desc: '@supabase/supabase-js', href: 'https://supabase.com/docs/reference/javascript/introduction' },
      { title: 'Edge Functions', desc: 'Deno serverless', href: 'https://supabase.com/docs/guides/functions' },
    ],
  },
  ja: {
    badgeText: 'SUPABASE',
    titleTop: 'Supabase',
    titleBottom: 'プロジェクト作成 & キー設定',
    description: `オープンソースの Firebase 代替 Supabase でバックエンドを素早く立ち上げるガイドです。\nPostgreSQL・Auth・Storage・Realtime・Edge Functions を一度にセットアップします。`,
    ctaLabel: 'Supabase ダッシュボードを開く',
    stats: [
      { label: '無料プラン', value: '2 プロジェクト' },
      { label: '有料移行', value: 'Pro $25/月〜' },
      { label: '必要情報', value: 'GitHub アカウント推奨' },
    ],
    overviewTitle: '始める前に確認してください',
    overviewDesc: 'Supabase の無料プランは 1 週間の非アクティブでプロジェクトが一時停止されます。本番サービスは Pro プラン($25/月〜)へ移行しないと安定稼働が難しいです。Row Level Security(RLS)は必ず有効化して始めてください — 既定では無効で、すべてのデータが公開状態になります。',
    overviewItems: [
      { iconKey: 'user', title: 'GitHub アカウント', desc: 'Supabase は GitHub OAuth 基盤です。' },
      { iconKey: 'settings', title: 'リージョン選択', desc: '韓国は Tokyo(ap-northeast-1)。' },
      { iconKey: 'shield', title: 'RLS ポリシー設計', desc: 'Row Level Security は既定で無効。' },
      { iconKey: 'key', title: '2 種類のキーの違い', desc: 'anon と service_role。' },
    ],
    steps: [
      { no: '01', title: 'アカウント登録 & 組織作成', tag: 'SIGNUP', iconKey: 'user', desc: 'supabase.com に GitHub で登録します。', details: [
        'Sign in with GitHub を推奨(メールも可)',
        '組織(Organization)が自動作成 — チーム単位でプロジェクトをまとめる',
        'メンバー招待は組織単位で管理',
        '無料プラン: 組織あたりプロジェクト 2 つまで',
      ] },
      { no: '02', title: '新規プロジェクト作成', tag: 'PROJECT', iconKey: 'database', desc: 'データベースとリージョンを決定します。', details: [
        'New Project をクリック',
        'プロジェクト名(URL スラッグとして使用)',
        'Database Password を強固な値で設定し安全に保管',
        'Region: Northeast Asia(Tokyo)が韓国から最速',
        'Pricing Plan: Free / Pro / Team',
        'プロビジョニングに 2〜3 分',
      ] },
      { no: '03', title: 'API キーの確認', tag: 'KEYS', iconKey: 'key', desc: '2 種類のキーの役割を明確に理解してください。', details: [
        'Settings > API メニュー',
        'Project URL: https://${id}.supabase.co',
        'anon public key: フロントエンドで使用可、RLS で保護',
        'service_role key: サーバー専用、RLS を回避 — 絶対に公開禁止',
        'JWT Secret: カスタムトークン発行時に使用',
        '.env.local に NEXT_PUBLIC_SUPABASE_URL / ANON_KEY を保存',
      ] },
      { no: '04', title: 'Authentication 設定', tag: 'AUTH', iconKey: 'shield', desc: 'ログイン方法を有効化します。', details: [
        'Authentication > Providers メニュー',
        'Email(既定で有効)、Phone、Google、Apple、Kakao など',
        '各 OAuth プロバイダーには個別設定が必要(Client ID / Secret)',
        'Redirect URL: https://${id}.supabase.co/auth/v1/callback',
        'Email Templates を日本語などへカスタマイズ',
        'Rate Limits を確認(無料プランは時間単位で制限)',
      ] },
      { no: '05', title: 'テーブル作成 & RLS ポリシー', tag: 'DATABASE', iconKey: 'database', desc: 'Postgres テーブルを作成しセキュリティポリシーを設定します。', details: [
        'Table Editor で GUI 作成、または SQL Editor で DDL 実行',
        '新規テーブルは必ず Enable RLS にチェック',
        'RLS ポリシー例: "auth.uid() = user_id"(本人のみ閲覧)',
        'Realtime を有効化 — INSERT / UPDATE / DELETE イベントを購読',
        'Foreign Key を設定(auth.users との連携を推奨)',
      ] },
      { no: '06', title: 'Storage バケット設定', tag: 'STORAGE', iconKey: 'drive', desc: 'ファイルアップロード用のバケットを作成します。', details: [
        'Storage > New Bucket',
        'Public / Private を選択',
        'Public: URL で誰でもアクセス可、プロフィール画像などに最適',
        'Private: 認証済みユーザーのみ、signed URL でアクセス',
        'アップロード・ダウンロード権限は RLS ポリシーで制御',
        '画像変換(image transformation)は Pro プラン',
      ] },
      { no: '07', title: 'Edge Functions デプロイ', tag: 'FUNCTIONS', iconKey: 'zap', desc: 'サーバーレス関数でカスタム API を実装します。', details: [
        'Deno ランタイムベース、TypeScript 対応',
        'supabase init → supabase functions new my-func',
        'supabase functions deploy my-func',
        '外部 API 呼び出し、複雑なロジック、Webhook 処理に便利',
        '環境変数は `supabase secrets set` コマンドで設定',
        '無料プラン上限: 500K invocations / 月',
      ] },
      { no: '08', title: 'チーム招待 & バックアップ', tag: 'OPS', iconKey: 'users', desc: '運用で必須の設定です。', details: [
        'Organization Settings > Team からメンバーを招待',
        'ロール: Owner / Developer(細かな権限は Pro 以上)',
        'Database > Backups: 日次自動バックアップ',
        'Free プランは 7 日保持、Pro は 30 日',
        'Point-in-time Recovery は Team プラン以上',
        'Postgres の自動アップグレードを無効化することを推奨',
      ] },
    ],
    pitfalls: [
      { title: 'RLS 無効のままリリース', desc: 'Row Level Security がオフだと anon キーであらゆるテーブルを読み書きできます。データ漏洩事故の最大要因です。' },
      { title: 'service_role キーをフロントに露出', desc: 'service_role は RLS を回避する管理者キーです。NEXT_PUBLIC_ プレフィックスを絶対に付けないでください。' },
      { title: '無料プランの自動一時停止', desc: '1 週間の非アクティブでプロジェクトが paused になり、API は 404 を返します。本番は Pro 必須です。' },
      { title: 'リージョンは変更不可', desc: 'プロジェクト作成時にリージョンが固定されます。間違えた場合は新規プロジェクトを作って移行する必要があります。' },
      { title: 'Database Password の紛失', desc: '復旧できません。必ずパスワードマネージャーに保存してください。失うと新しいプロジェクトを作るしかありません。' },
    ],
    resources: [
      { title: 'Supabase Dashboard', desc: 'プロジェクト管理', href: 'https://supabase.com/dashboard' },
      { title: 'Pricing', desc: 'プラン比較', href: 'https://supabase.com/pricing' },
      { title: 'Auth ドキュメント', desc: 'ログイン実装ガイド', href: 'https://supabase.com/docs/guides/auth' },
      { title: 'Row Level Security', desc: 'RLS ポリシーの書き方', href: 'https://supabase.com/docs/guides/auth/row-level-security' },
      { title: 'JavaScript クライアント', desc: '@supabase/supabase-js', href: 'https://supabase.com/docs/reference/javascript/introduction' },
      { title: 'Edge Functions', desc: 'Deno サーバーレス', href: 'https://supabase.com/docs/guides/functions' },
    ],
  },
  zh: {
    badgeText: 'SUPABASE',
    titleTop: 'Supabase',
    titleBottom: '项目创建 & 密钥配置',
    description: `使用开源 Firebase 替代品 Supabase 快速搭建后端的指南。\n一次性配置 PostgreSQL、Auth、Storage、Realtime 与 Edge Functions。`,
    ctaLabel: '打开 Supabase 仪表盘',
    stats: [
      { label: '免费套餐', value: '2 个项目' },
      { label: '付费升级', value: 'Pro $25/月起' },
      { label: '所需信息', value: '推荐 GitHub 账户' },
    ],
    overviewTitle: '开始前请确认',
    overviewDesc: 'Supabase 免费套餐在项目闲置 1 周后会被暂停。生产环境建议升级到 Pro 套餐($25/月起)以保持稳定。请务必在开始时启用 Row Level Security(RLS)—— 默认关闭状态下,所有数据都是公开可访问的。',
    overviewItems: [
      { iconKey: 'user', title: 'GitHub 账户', desc: 'Supabase 基于 GitHub OAuth。' },
      { iconKey: 'settings', title: '区域选择', desc: '韩国用户选 Tokyo(ap-northeast-1)。' },
      { iconKey: 'shield', title: 'RLS 策略设计', desc: 'Row Level Security 默认关闭。' },
      { iconKey: 'key', title: '两种密钥的区别', desc: 'anon 与 service_role。' },
    ],
    steps: [
      { no: '01', title: '注册 & 创建组织', tag: 'SIGNUP', iconKey: 'user', desc: '在 supabase.com 使用 GitHub 注册。', details: [
        '推荐 Sign in with GitHub(邮箱也可)',
        '自动创建组织(Organization)—— 按团队聚合项目',
        '成员邀请按组织维度管理',
        '免费套餐: 每个组织 2 个项目',
      ] },
      { no: '02', title: '创建新项目', tag: 'PROJECT', iconKey: 'database', desc: '确定数据库与区域。', details: [
        '点击 New Project',
        '项目名称(将作为 URL slug)',
        '设置强度高的 Database Password 并妥善保存',
        '区域: Northeast Asia(Tokyo)对韩国用户延迟最低',
        'Pricing Plan: Free / Pro / Team',
        '配置耗时约 2–3 分钟',
      ] },
      { no: '03', title: '确认 API 密钥', tag: 'KEYS', iconKey: 'key', desc: '请清楚区分两种密钥的职责。', details: [
        'Settings > API 菜单',
        'Project URL: https://${id}.supabase.co',
        'anon public key: 可用于前端,受 RLS 保护',
        'service_role key: 仅服务器使用,绕过 RLS,绝不可暴露',
        'JWT Secret: 签发自定义令牌时使用',
        '在 .env.local 中保存 NEXT_PUBLIC_SUPABASE_URL / ANON_KEY',
      ] },
      { no: '04', title: 'Authentication 配置', tag: 'AUTH', iconKey: 'shield', desc: '开启登录方式。', details: [
        'Authentication > Providers 菜单',
        '邮箱(默认启用)、手机号、Google、Apple、Kakao 等',
        '每个 OAuth 提供方需单独配置(Client ID / Secret)',
        'Redirect URL: https://${id}.supabase.co/auth/v1/callback',
        '自定义邮件模板(可本地化为中文等)',
        '查看速率限制(免费套餐按小时限流)',
      ] },
      { no: '05', title: '创建表与 RLS 策略', tag: 'DATABASE', iconKey: 'database', desc: '创建 Postgres 表并配置安全策略。', details: [
        '使用 Table Editor 的 GUI 或在 SQL Editor 中执行 DDL',
        '新建表务必勾选 Enable RLS',
        'RLS 策略示例: "auth.uid() = user_id"(仅本人可读)',
        '启用 Realtime — 订阅 INSERT / UPDATE / DELETE 事件',
        '配置外键关系(建议与 auth.users 关联)',
      ] },
      { no: '06', title: 'Storage 存储桶配置', tag: 'STORAGE', iconKey: 'drive', desc: '为文件上传创建存储桶。', details: [
        'Storage > New Bucket',
        '选择 Public / Private',
        'Public: 任何人都可通过 URL 访问,适合头像等',
        'Private: 仅认证用户可访问,通过 signed URL',
        '通过 RLS 策略控制上传 / 下载权限',
        '图片变换(image transformation)为 Pro 套餐功能',
      ] },
      { no: '07', title: '部署 Edge Functions', tag: 'FUNCTIONS', iconKey: 'zap', desc: '用无服务器函数实现自定义 API。', details: [
        '基于 Deno 运行时,支持 TypeScript',
        'supabase init → supabase functions new my-func',
        'supabase functions deploy my-func',
        '适合调用外部 API、复杂逻辑与 Webhook 处理',
        '环境变量通过 `supabase secrets set` 设置',
        '免费套餐额度: 每月 500K 次调用',
      ] },
      { no: '08', title: '邀请团队 & 备份', tag: 'OPS', iconKey: 'users', desc: '运营必备配置。', details: [
        '在 Organization Settings > Team 邀请成员',
        '角色: Owner / Developer(更细粒度权限需 Pro 及以上)',
        'Database > Backups: 每日自动备份',
        'Free 套餐保留 7 天,Pro 保留 30 天',
        'Point-in-time Recovery 需 Team 套餐及以上',
        '建议禁用自动 Postgres 升级',
      ] },
    ],
    pitfalls: [
      { title: '未开启 RLS 便上线', desc: '关闭 Row Level Security 时,anon 密钥可读写所有表,这是数据泄露的首要原因。' },
      { title: 'service_role 密钥被前端暴露', desc: 'service_role 是绕过 RLS 的管理员密钥,绝对不能加 NEXT_PUBLIC_ 前缀。' },
      { title: '免费套餐自动暂停', desc: '闲置 1 周后项目会转为 paused,API 返回 404。生产环境必须使用 Pro。' },
      { title: '区域不可变更', desc: '项目创建后区域无法更改,一旦选错必须新建项目并迁移。' },
      { title: 'Database Password 丢失', desc: '无法恢复,务必用密码管理器保存。否则只能新建项目。' },
    ],
    resources: [
      { title: 'Supabase Dashboard', desc: '项目管理', href: 'https://supabase.com/dashboard' },
      { title: 'Pricing', desc: '套餐对比', href: 'https://supabase.com/pricing' },
      { title: 'Auth 文档', desc: '登录实现指南', href: 'https://supabase.com/docs/guides/auth' },
      { title: 'Row Level Security', desc: 'RLS 策略编写', href: 'https://supabase.com/docs/guides/auth/row-level-security' },
      { title: 'JavaScript 客户端', desc: '@supabase/supabase-js', href: 'https://supabase.com/docs/reference/javascript/introduction' },
      { title: 'Edge Functions', desc: 'Deno 无服务器', href: 'https://supabase.com/docs/guides/functions' },
    ],
  },
}

export default function SupabaseGuidePage() {
  const locale = useLocale() as Locale
  const d = DATA[locale] ?? DATA.ko
  return (
    <GuideTemplate
      badge={{ icon: badgeIcon, text: d.badgeText }}
      titleTop={d.titleTop}
      titleBottom={d.titleBottom}
      description={d.description}
      primaryCta={{ label: d.ctaLabel, href: 'https://supabase.com/dashboard' }}
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
