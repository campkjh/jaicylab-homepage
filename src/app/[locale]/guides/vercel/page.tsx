'use client'

import { useLocale } from 'next-intl'
import { GuideTemplate } from '@/components/GuideTemplate'
import { Triangle, User, GitBranch, Globe, Key, Settings, Shield, Zap } from 'lucide-react'

type Locale = 'ko' | 'en' | 'ja' | 'zh'

const badgeIcon = <Triangle className="h-3.5 w-3.5 text-white/80" />
const iconGitBranch = <GitBranch className="h-5 w-5" />
const iconGlobe = <Globe className="h-5 w-5" />
const iconShield = <Shield className="h-5 w-5" />
const iconSettings = <Settings className="h-5 w-5" />
const iconUser = <User className="h-5 w-5" />
const iconKey = <Key className="h-5 w-5" />
const iconZap = <Zap className="h-5 w-5" />

type Data = {
  titleTop: string
  titleBottom: string
  description: string
  primaryCtaLabel: string
  stats: { label: string; value: string }[]
  overviewTitle: string
  overviewDesc: string
  overviewItems: { title: string; desc: string }[]
  steps: { no: string; title: string; tag: string; desc: string; details: string[] }[]
  pitfalls: { title: string; desc: string }[]
  resources: { title: string; desc: string; href: string }[]
}

const DATA: Record<Locale, Data> = {
  ko: {
    titleTop: 'Vercel',
    titleBottom: '배포 & 도메인 연결',
    description: `Next.js를 만든 Vercel로 프론트엔드를 배포하는 가이드입니다.\nGitHub 연동, 환경변수, 커스텀 도메인, Preview 배포, Functions까지 실무 중심으로 정리했습니다.`,
    primaryCtaLabel: 'Vercel 대시보드 열기',
    stats: [
      { label: 'Hobby 플랜', value: '개인·비상업 무료' },
      { label: 'Pro 플랜', value: '$20/월/사용자' },
      { label: '필요 정보', value: 'GitHub 계정' },
    ],
    overviewTitle: '시작 전에 확인하세요',
    overviewDesc: 'Hobby 플랜은 상업적 용도 금지입니다. 회사 프로젝트는 Pro 이상을 사용해야 ToS 위반이 아닙니다. 커스텀 도메인 연결은 무료 플랜에서도 가능하지만, 팀 협업·분석·보안 기능은 Pro부터 제공됩니다.',
    overviewItems: [
      { title: 'GitHub 레포', desc: '배포할 프로젝트 저장소.' },
      { title: '도메인 구매처', desc: '후이즈·가비아·Cloudflare 등.' },
      { title: '환경변수 분리', desc: '.env.local은 커밋 금지.' },
      { title: '리전 선택', desc: 'Functions는 icn1(서울) 기본.' },
    ],
    steps: [
      { no: '01', title: '계정 가입', tag: 'SIGNUP', desc: 'vercel.com에서 가입합니다.', details: [
        'Sign Up with GitHub 권장 (가장 매끄러운 연동)',
        'GitLab·Bitbucket·이메일도 가능',
        'Hobby 플랜으로 자동 시작',
        '팀(Team) 필요 시 조직 생성',
      ] },
      { no: '02', title: 'Git 저장소 연결', tag: 'CONNECT', desc: 'GitHub와 Vercel을 연동합니다.', details: [
        'Import Git Repository 클릭',
        'Vercel GitHub App 설치 (전체 또는 선택 저장소)',
        '저장소 선택 → 프레임워크 자동 감지',
        'Next.js / Nuxt / Vite / SvelteKit 등 주요 프레임워크 지원',
      ] },
      { no: '03', title: '환경변수 설정', tag: 'ENV', desc: '배포 전 필수 환경변수 등록.', details: [
        'Settings > Environment Variables',
        '3개 환경 구분: Production / Preview / Development',
        'NEXT_PUBLIC_ 접두사는 클라이언트 번들에 포함됨 (민감정보 금지)',
        '서버 전용 변수는 접두사 없이 (DATABASE_URL·API_SECRET 등)',
        'vercel env pull로 로컬 .env.local에 동기화 가능',
      ] },
      { no: '04', title: '첫 배포 & Preview URL', tag: 'DEPLOY', desc: 'main 브랜치 푸시 → 자동 Production 배포.', details: [
        'main(또는 Production Branch) 푸시 시 자동 배포',
        '다른 브랜치·PR은 자동으로 Preview URL 생성',
        'Preview URL: https://${프로젝트}-${브랜치}-${팀}.vercel.app',
        '배포 상태는 GitHub PR에 코멘트로 자동 표시',
        'vercel CLI로 수동 배포도 가능',
      ] },
      { no: '05', title: '커스텀 도메인 연결', tag: 'DOMAIN', desc: '구매한 도메인을 프로젝트에 연결.', details: [
        'Project Settings > Domains',
        '도메인 입력 → Vercel이 필요한 DNS 레코드 안내',
        'apex 도메인: A 레코드 76.76.21.21',
        'www 서브도메인: CNAME cname.vercel-dns.com',
        '또는 네임서버를 Vercel로 변경 (ns1.vercel-dns.com / ns2.vercel-dns.com)',
        'SSL 인증서(Let\'s Encrypt) 자동 발급 · 자동 갱신',
      ] },
      { no: '06', title: '배포 보호 (선택)', tag: 'SECURITY', desc: '프리뷰 URL을 외부에서 못 보게 막기.', details: [
        'Settings > Deployment Protection',
        'Vercel Authentication (팀원만 접근)',
        'Password Protection (Pro 이상)',
        'Bypass Token으로 E2E 테스트·에이전트 접근 허용',
        '스테이징/릴리즈 전 검토에 유용',
      ] },
      { no: '07', title: 'Functions & 리전 설정', tag: 'FUNCTIONS', desc: 'Serverless/Edge Functions 배포 설정.', details: [
        '기본 리전: icn1 (서울) — 한국 서비스에 권장',
        'next.config.js의 runtime export 또는 vercel.json 설정',
        'Fluid Compute: 긴 I/O 작업(LLM·API)에 최적화',
        'maxDuration / memory / CPU 조정 가능',
        'Edge Runtime은 Node.js API 일부 미지원 — 확인 필요',
      ] },
      { no: '08', title: '분석 & 모니터링', tag: 'ANALYTICS', desc: '방문자·성능 지표 활성화.', details: [
        'Web Analytics: 방문자·페이지뷰 (쿠키리스)',
        'Speed Insights: Core Web Vitals 실사용자 측정',
        'Vercel Logs에서 Functions 로그 확인',
        'OpenTelemetry로 외부 APM 연동 가능',
        '둘 다 Hobby에서도 제한 사용량 무료',
      ] },
    ],
    pitfalls: [
      { title: 'Hobby 플랜 상업적 사용', desc: '회사 웹사이트·유료 서비스를 Hobby로 운영하면 ToS 위반. 최소 Pro($20/월)로 전환하세요.' },
      { title: 'NEXT_PUBLIC_ 접두사 오남용', desc: '이 접두사가 붙으면 브라우저 번들에 포함됩니다. DATABASE_URL·API_SECRET은 절대 NEXT_PUBLIC_ 붙이지 마세요.' },
      { title: 'Edge Runtime 호환성', desc: 'pg·bcrypt·fs 등 Node.js 전용 모듈은 Edge에서 동작 안 함. Node.js runtime 지정하거나 serverless로 변경.' },
      { title: '.env.local 커밋', desc: '.gitignore에 포함되어 있지만 한 번 커밋하면 히스토리에 남습니다. 즉시 키 순환 필요.' },
      { title: 'Production 브랜치 변경', desc: 'Production Branch를 main에서 다른 것으로 바꾸면 도메인이 해당 브랜치 배포로 이동. 실수 주의.' },
    ],
    resources: [
      { title: 'Vercel Dashboard', desc: '프로젝트 관리', href: 'https://vercel.com/dashboard' },
      { title: 'Pricing', desc: 'Hobby / Pro / Enterprise', href: 'https://vercel.com/pricing' },
      { title: 'Custom Domains', desc: '도메인 연결 가이드', href: 'https://vercel.com/docs/projects/domains' },
      { title: 'Environment Variables', desc: '환경변수 관리', href: 'https://vercel.com/docs/projects/environment-variables' },
      { title: 'Functions', desc: 'Serverless · Edge · Fluid', href: 'https://vercel.com/docs/functions' },
      { title: 'AI Gateway', desc: '모델 라우팅 게이트웨이', href: 'https://vercel.com/docs/ai-gateway' },
    ],
  },
  en: {
    titleTop: 'Vercel',
    titleBottom: 'Deploy & Custom Domain',
    description: `A guide to deploying your frontend on Vercel, the company behind Next.js.\nCovers GitHub integration, environment variables, custom domains, Preview deployments, and Functions — all focused on real-world workflows.`,
    primaryCtaLabel: 'Open Vercel Dashboard',
    stats: [
      { label: 'Hobby plan', value: 'Free for personal use' },
      { label: 'Pro plan', value: '$20/mo/user' },
      { label: 'Requirements', value: 'GitHub account' },
    ],
    overviewTitle: 'Check before you start',
    overviewDesc: 'The Hobby plan prohibits commercial use. Company projects must use Pro or higher to stay compliant with the ToS. Custom domains work on the free plan, but team collaboration, analytics, and security features start with Pro.',
    overviewItems: [
      { title: 'GitHub repo', desc: 'The project repository to deploy.' },
      { title: 'Domain registrar', desc: 'Whois, Gabia, Cloudflare, etc.' },
      { title: 'Separate env vars', desc: 'Never commit .env.local.' },
      { title: 'Region selection', desc: 'Functions default to icn1 (Seoul).' },
    ],
    steps: [
      { no: '01', title: 'Sign up', tag: 'SIGNUP', desc: 'Create an account at vercel.com.', details: [
        'Sign Up with GitHub is recommended (smoothest integration)',
        'GitLab, Bitbucket, and email also work',
        'Starts automatically on the Hobby plan',
        'Create an organization if you need a Team',
      ] },
      { no: '02', title: 'Connect Git repository', tag: 'CONNECT', desc: 'Link GitHub with Vercel.', details: [
        'Click Import Git Repository',
        'Install the Vercel GitHub App (all or selected repos)',
        'Select a repo — framework is auto-detected',
        'Supports Next.js, Nuxt, Vite, SvelteKit, and more',
      ] },
      { no: '03', title: 'Configure environment variables', tag: 'ENV', desc: 'Register required env vars before deploy.', details: [
        'Settings > Environment Variables',
        'Three scopes: Production / Preview / Development',
        'The NEXT_PUBLIC_ prefix bundles the value into the client (never put secrets here)',
        'Server-only vars have no prefix (DATABASE_URL, API_SECRET, etc.)',
        'Sync to local .env.local with vercel env pull',
      ] },
      { no: '04', title: 'First deploy & Preview URL', tag: 'DEPLOY', desc: 'Push to main for an automatic Production deploy.', details: [
        'Pushing to main (or the Production Branch) triggers an auto-deploy',
        'Other branches and PRs automatically get a Preview URL',
        'Preview URL: https://${project}-${branch}-${team}.vercel.app',
        'Deploy status is posted as a comment on GitHub PRs',
        'You can also deploy manually with the vercel CLI',
      ] },
      { no: '05', title: 'Connect custom domain', tag: 'DOMAIN', desc: 'Attach your domain to the project.', details: [
        'Project Settings > Domains',
        'Enter the domain — Vercel shows the required DNS records',
        'Apex domain: A record 76.76.21.21',
        'www subdomain: CNAME cname.vercel-dns.com',
        'Or switch nameservers to Vercel (ns1.vercel-dns.com / ns2.vercel-dns.com)',
        'SSL certificates (Let\'s Encrypt) are issued and renewed automatically',
      ] },
      { no: '06', title: 'Deployment Protection (optional)', tag: 'SECURITY', desc: 'Hide preview URLs from the public.', details: [
        'Settings > Deployment Protection',
        'Vercel Authentication (team-only access)',
        'Password Protection (Pro and above)',
        'Use a Bypass Token for E2E tests and agent access',
        'Useful for staging and pre-release reviews',
      ] },
      { no: '07', title: 'Functions & regions', tag: 'FUNCTIONS', desc: 'Configure Serverless and Edge Functions.', details: [
        'Default region: icn1 (Seoul) — recommended for Korean services',
        'Configure via runtime export in next.config.js or vercel.json',
        'Fluid Compute is tuned for long I/O work (LLMs, APIs)',
        'Tune maxDuration, memory, and CPU',
        'The Edge Runtime does not support all Node.js APIs — verify compatibility',
      ] },
      { no: '08', title: 'Analytics & monitoring', tag: 'ANALYTICS', desc: 'Enable visitor and performance metrics.', details: [
        'Web Analytics: visitors and pageviews (cookieless)',
        'Speed Insights: real-user Core Web Vitals',
        'Check Function logs in Vercel Logs',
        'Forward to external APMs via OpenTelemetry',
        'Both are free with limited quotas, even on Hobby',
      ] },
    ],
    pitfalls: [
      { title: 'Commercial use on Hobby', desc: 'Running a company site or paid service on Hobby violates the ToS. Upgrade to at least Pro ($20/mo).' },
      { title: 'Misusing NEXT_PUBLIC_', desc: 'Anything with this prefix ends up in the browser bundle. Never prefix DATABASE_URL or API_SECRET with NEXT_PUBLIC_.' },
      { title: 'Edge Runtime compatibility', desc: 'Node-only modules like pg, bcrypt, and fs do not run on the Edge. Use the Node.js runtime or switch to serverless.' },
      { title: 'Committing .env.local', desc: 'It is in .gitignore, but once committed it stays in history. Rotate keys immediately.' },
      { title: 'Changing the Production Branch', desc: 'Switching the Production Branch away from main moves your domain to that branch. Avoid mistakes.' },
    ],
    resources: [
      { title: 'Vercel Dashboard', desc: 'Project management', href: 'https://vercel.com/dashboard' },
      { title: 'Pricing', desc: 'Hobby / Pro / Enterprise', href: 'https://vercel.com/pricing' },
      { title: 'Custom Domains', desc: 'Domain setup guide', href: 'https://vercel.com/docs/projects/domains' },
      { title: 'Environment Variables', desc: 'Manage env vars', href: 'https://vercel.com/docs/projects/environment-variables' },
      { title: 'Functions', desc: 'Serverless · Edge · Fluid', href: 'https://vercel.com/docs/functions' },
      { title: 'AI Gateway', desc: 'Model routing gateway', href: 'https://vercel.com/docs/ai-gateway' },
    ],
  },
  ja: {
    titleTop: 'Vercel',
    titleBottom: 'デプロイ & ドメイン接続',
    description: `Next.jsを開発するVercelでフロントエンドをデプロイするガイドです。\nGitHub連携、環境変数、カスタムドメイン、Previewデプロイ、Functionsまで実務目線でまとめています。`,
    primaryCtaLabel: 'Vercelダッシュボードを開く',
    stats: [
      { label: 'Hobbyプラン', value: '個人・非商用は無料' },
      { label: 'Proプラン', value: '$20/月/ユーザー' },
      { label: '必要なもの', value: 'GitHubアカウント' },
    ],
    overviewTitle: '始める前にご確認ください',
    overviewDesc: 'Hobbyプランは商用利用が禁止です。会社のプロジェクトはPro以上を利用しないとToS違反となります。カスタムドメイン接続は無料プランでも可能ですが、チーム協業・分析・セキュリティ機能はProから提供されます。',
    overviewItems: [
      { title: 'GitHubリポジトリ', desc: 'デプロイ対象のプロジェクト。' },
      { title: 'ドメイン購入元', desc: 'お名前.com・Gabia・Cloudflareなど。' },
      { title: '環境変数の分離', desc: '.env.localはコミット禁止。' },
      { title: 'リージョン選択', desc: 'Functionsはicn1(ソウル)が既定。' },
    ],
    steps: [
      { no: '01', title: 'アカウント登録', tag: 'SIGNUP', desc: 'vercel.comで登録します。', details: [
        'Sign Up with GitHubを推奨(最も滑らかな連携)',
        'GitLab・Bitbucket・メールも可能',
        'Hobbyプランで自動的に開始',
        'チームが必要な場合は組織を作成',
      ] },
      { no: '02', title: 'Gitリポジトリ接続', tag: 'CONNECT', desc: 'GitHubとVercelを連携します。', details: [
        'Import Git Repositoryをクリック',
        'Vercel GitHub Appをインストール(全体または選択リポジトリ)',
        'リポジトリを選択 → フレームワークを自動検出',
        'Next.js / Nuxt / Vite / SvelteKitなど主要フレームワーク対応',
      ] },
      { no: '03', title: '環境変数の設定', tag: 'ENV', desc: 'デプロイ前に必須の環境変数を登録します。', details: [
        'Settings > Environment Variables',
        '3環境を区別: Production / Preview / Development',
        'NEXT_PUBLIC_接頭辞はクライアントバンドルに含まれる(機密情報は禁止)',
        'サーバー専用変数は接頭辞なし(DATABASE_URL・API_SECRETなど)',
        'vercel env pullでローカル.env.localに同期可能',
      ] },
      { no: '04', title: '初回デプロイ & Preview URL', tag: 'DEPLOY', desc: 'mainブランチpushで自動Productionデプロイ。', details: [
        'main(またはProduction Branch)push時に自動デプロイ',
        '他ブランチ・PRは自動でPreview URLを生成',
        'Preview URL: https://${プロジェクト}-${ブランチ}-${チーム}.vercel.app',
        'デプロイ状態はGitHub PRにコメントで自動表示',
        'vercel CLIで手動デプロイも可能',
      ] },
      { no: '05', title: 'カスタムドメイン接続', tag: 'DOMAIN', desc: '購入したドメインをプロジェクトに接続します。', details: [
        'Project Settings > Domains',
        'ドメインを入力 → 必要なDNSレコードが表示される',
        'apexドメイン: Aレコード 76.76.21.21',
        'wwwサブドメイン: CNAME cname.vercel-dns.com',
        'またはネームサーバーをVercelに変更(ns1.vercel-dns.com / ns2.vercel-dns.com)',
        'SSL証明書(Let\'s Encrypt)は自動発行・自動更新',
      ] },
      { no: '06', title: 'デプロイ保護(任意)', tag: 'SECURITY', desc: 'Preview URLを外部から見えないようにします。', details: [
        'Settings > Deployment Protection',
        'Vercel Authentication(チームメンバーのみアクセス)',
        'Password Protection(Pro以上)',
        'Bypass TokenでE2Eテスト・エージェントのアクセスを許可',
        'ステージング/リリース前のレビューに便利',
      ] },
      { no: '07', title: 'Functions & リージョン設定', tag: 'FUNCTIONS', desc: 'Serverless/Edge Functionsの配置設定。', details: [
        '既定リージョン: icn1(ソウル) — 韓国向けサービスに推奨',
        'next.config.jsのruntime exportまたはvercel.jsonで設定',
        'Fluid Compute: 長いI/O処理(LLM・API)に最適化',
        'maxDuration / memory / CPUの調整が可能',
        'Edge RuntimeはNode.js APIの一部が非対応 — 要確認',
      ] },
      { no: '08', title: '分析 & モニタリング', tag: 'ANALYTICS', desc: '訪問者・パフォーマンス指標を有効化。', details: [
        'Web Analytics: 訪問者・ページビュー(Cookieレス)',
        'Speed Insights: Core Web Vitalsの実ユーザー計測',
        'Vercel LogsでFunctionsのログを確認',
        'OpenTelemetryで外部APMへ連携可能',
        '両方ともHobbyでも制限付きで無料利用可能',
      ] },
    ],
    pitfalls: [
      { title: 'Hobbyプランの商用利用', desc: '会社サイト・有料サービスをHobbyで運営するとToS違反です。最低Pro($20/月)に切り替えてください。' },
      { title: 'NEXT_PUBLIC_接頭辞の誤用', desc: 'この接頭辞が付くとブラウザバンドルに含まれます。DATABASE_URL・API_SECRETには絶対にNEXT_PUBLIC_を付けないでください。' },
      { title: 'Edge Runtime互換性', desc: 'pg・bcrypt・fsなどNode.js専用モジュールはEdgeで動作しません。Node.js runtimeを指定するかserverlessへ変更してください。' },
      { title: '.env.localのコミット', desc: '.gitignoreに含まれていても一度コミットすると履歴に残ります。即座にキーを回転してください。' },
      { title: 'Production Branch変更', desc: 'Production Branchをmainから別のものに変えるとドメインがそのブランチのデプロイへ移動します。ミスに注意。' },
    ],
    resources: [
      { title: 'Vercel Dashboard', desc: 'プロジェクト管理', href: 'https://vercel.com/dashboard' },
      { title: 'Pricing', desc: 'Hobby / Pro / Enterprise', href: 'https://vercel.com/pricing' },
      { title: 'Custom Domains', desc: 'ドメイン接続ガイド', href: 'https://vercel.com/docs/projects/domains' },
      { title: 'Environment Variables', desc: '環境変数管理', href: 'https://vercel.com/docs/projects/environment-variables' },
      { title: 'Functions', desc: 'Serverless · Edge · Fluid', href: 'https://vercel.com/docs/functions' },
      { title: 'AI Gateway', desc: 'モデルルーティングゲートウェイ', href: 'https://vercel.com/docs/ai-gateway' },
    ],
  },
  zh: {
    titleTop: 'Vercel',
    titleBottom: '部署与域名接入',
    description: `使用 Next.js 团队打造的 Vercel 部署前端的指南。\n涵盖 GitHub 接入、环境变量、自定义域名、Preview 部署与 Functions,聚焦实战场景。`,
    primaryCtaLabel: '打开 Vercel 控制台',
    stats: [
      { label: 'Hobby 套餐', value: '个人非商用免费' },
      { label: 'Pro 套餐', value: '$20/月/用户' },
      { label: '准备条件', value: 'GitHub 账号' },
    ],
    overviewTitle: '开始前请确认',
    overviewDesc: 'Hobby 套餐禁止商业用途。公司项目需使用 Pro 及以上套餐,否则违反 ToS。自定义域名在免费套餐也可使用,但团队协作、分析与安全功能需要 Pro 起。',
    overviewItems: [
      { title: 'GitHub 仓库', desc: '要部署的项目仓库。' },
      { title: '域名注册商', desc: 'Whois、Gabia、Cloudflare 等。' },
      { title: '环境变量隔离', desc: '.env.local 禁止提交。' },
      { title: '区域选择', desc: 'Functions 默认 icn1(首尔)。' },
    ],
    steps: [
      { no: '01', title: '注册账号', tag: 'SIGNUP', desc: '在 vercel.com 注册。', details: [
        '推荐 Sign Up with GitHub(衔接最顺畅)',
        '也支持 GitLab、Bitbucket、邮箱',
        '自动进入 Hobby 套餐',
        '需要团队时创建组织',
      ] },
      { no: '02', title: '连接 Git 仓库', tag: 'CONNECT', desc: '将 GitHub 与 Vercel 对接。', details: [
        '点击 Import Git Repository',
        '安装 Vercel GitHub App(全部或指定仓库)',
        '选择仓库 → 自动识别框架',
        '支持 Next.js / Nuxt / Vite / SvelteKit 等主流框架',
      ] },
      { no: '03', title: '配置环境变量', tag: 'ENV', desc: '部署前登记必备的环境变量。', details: [
        'Settings > Environment Variables',
        '三套环境: Production / Preview / Development',
        'NEXT_PUBLIC_ 前缀会进入客户端打包(敏感信息禁用)',
        '仅服务端变量不加前缀(DATABASE_URL、API_SECRET 等)',
        '使用 vercel env pull 同步到本地 .env.local',
      ] },
      { no: '04', title: '首次部署与 Preview URL', tag: 'DEPLOY', desc: '推送 main → 自动 Production 部署。', details: [
        '推送 main(或 Production Branch)时自动部署',
        '其他分支与 PR 自动生成 Preview URL',
        'Preview URL: https://${项目}-${分支}-${团队}.vercel.app',
        '部署状态会自动评论到 GitHub PR',
        '也可使用 vercel CLI 手动部署',
      ] },
      { no: '05', title: '接入自定义域名', tag: 'DOMAIN', desc: '将已购域名绑定到项目。', details: [
        'Project Settings > Domains',
        '输入域名 → Vercel 给出所需 DNS 记录',
        'apex 域名: A 记录 76.76.21.21',
        'www 子域名: CNAME cname.vercel-dns.com',
        '或将 NS 切换到 Vercel(ns1.vercel-dns.com / ns2.vercel-dns.com)',
        'SSL 证书(Let\'s Encrypt)自动签发与续期',
      ] },
      { no: '06', title: '部署保护(可选)', tag: 'SECURITY', desc: '防止预览 URL 被外部访问。', details: [
        'Settings > Deployment Protection',
        'Vercel Authentication(仅团队成员可访问)',
        'Password Protection(Pro 起)',
        '使用 Bypass Token 放行 E2E 测试与 Agent',
        '适合发布前的 staging 审阅',
      ] },
      { no: '07', title: 'Functions 与区域配置', tag: 'FUNCTIONS', desc: 'Serverless/Edge Functions 部署设置。', details: [
        '默认区域: icn1(首尔) — 推荐给面向韩国的服务',
        '在 next.config.js 的 runtime export 或 vercel.json 中配置',
        'Fluid Compute: 针对长 I/O(LLM、API)优化',
        '可调整 maxDuration / memory / CPU',
        'Edge Runtime 对部分 Node.js API 不兼容 — 需核查',
      ] },
      { no: '08', title: '分析与监控', tag: 'ANALYTICS', desc: '启用访客与性能指标。', details: [
        'Web Analytics: 访客与 PV(无 Cookie)',
        'Speed Insights: 真实用户 Core Web Vitals',
        '在 Vercel Logs 查看 Functions 日志',
        '通过 OpenTelemetry 接入外部 APM',
        '两者在 Hobby 也有免费额度',
      ] },
    ],
    pitfalls: [
      { title: 'Hobby 用于商业场景', desc: '用 Hobby 运营公司官网或付费服务违反 ToS,至少升级到 Pro($20/月)。' },
      { title: '滥用 NEXT_PUBLIC_ 前缀', desc: '加了此前缀就会打进浏览器包。DATABASE_URL、API_SECRET 绝不能加 NEXT_PUBLIC_。' },
      { title: 'Edge Runtime 兼容性', desc: 'pg、bcrypt、fs 等仅 Node.js 的模块在 Edge 无法运行,请改用 Node.js runtime 或 serverless。' },
      { title: '误提交 .env.local', desc: '即便 .gitignore 已配置,一旦提交就会留在历史中,需立即轮换密钥。' },
      { title: '切换 Production Branch', desc: '将 Production Branch 从 main 改成别的分支,域名就会指向该分支的部署,请谨慎操作。' },
    ],
    resources: [
      { title: 'Vercel Dashboard', desc: '项目管理', href: 'https://vercel.com/dashboard' },
      { title: 'Pricing', desc: 'Hobby / Pro / Enterprise', href: 'https://vercel.com/pricing' },
      { title: 'Custom Domains', desc: '域名接入指南', href: 'https://vercel.com/docs/projects/domains' },
      { title: 'Environment Variables', desc: '环境变量管理', href: 'https://vercel.com/docs/projects/environment-variables' },
      { title: 'Functions', desc: 'Serverless · Edge · Fluid', href: 'https://vercel.com/docs/functions' },
      { title: 'AI Gateway', desc: '模型路由网关', href: 'https://vercel.com/docs/ai-gateway' },
    ],
  },
}

const OVERVIEW_ICONS = [iconGitBranch, iconGlobe, iconShield, iconSettings]
const STEP_ICONS = [iconUser, iconGitBranch, iconKey, iconZap, iconGlobe, iconShield, iconZap, iconSettings]

export default function VercelGuidePage() {
  const locale = useLocale() as Locale
  const d = DATA[locale] ?? DATA.ko
  return (
    <GuideTemplate
      badge={{ icon: badgeIcon, text: 'VERCEL' }}
      titleTop={d.titleTop}
      titleBottom={d.titleBottom}
      description={d.description}
      primaryCta={{ label: d.primaryCtaLabel, href: 'https://vercel.com/dashboard' }}
      stats={d.stats}
      overviewTitle={d.overviewTitle}
      overviewDesc={d.overviewDesc}
      overviewItems={d.overviewItems.map((it, i) => ({ ...it, icon: OVERVIEW_ICONS[i] }))}
      steps={d.steps.map((s, i) => ({ ...s, icon: STEP_ICONS[i] }))}
      pitfalls={d.pitfalls}
      resources={d.resources}
    />
  )
}
