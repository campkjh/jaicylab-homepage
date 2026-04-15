'use client'

import { useLocale } from 'next-intl'
import { GuideTemplate } from '@/components/GuideTemplate'
import { Cloud, User, CreditCard, Shield, Key, Settings, Bell, Server } from 'lucide-react'

type Locale = 'ko' | 'en' | 'ja' | 'zh'

const badgeIcon = <Cloud className="h-3.5 w-3.5 text-white/80" />
const icons = {
  user: <User className="h-5 w-5" />,
  card: <CreditCard className="h-5 w-5" />,
  shield: <Shield className="h-5 w-5" />,
  settings: <Settings className="h-5 w-5" />,
  key: <Key className="h-5 w-5" />,
  bell: <Bell className="h-5 w-5" />,
  server: <Server className="h-5 w-5" />,
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
    badgeText: 'AMAZON WEB SERVICES',
    titleTop: 'AWS',
    titleBottom: '계정 생성 & 초기 셋업',
    description: `글로벌 최대 클라우드 AWS 계정 생성 가이드입니다.\n루트 계정 보호, IAM 사용자 생성, 결제 알림, 리전 선택까지 실수 없이 시작할 수 있도록 정리했습니다.`,
    ctaLabel: 'AWS 가입 시작',
    stats: [
      { label: '가입비', value: '무료' },
      { label: '프리티어', value: '12개월 주요 상품 무료' },
      { label: '필요 정보', value: '이메일·카드·휴대폰' },
    ],
    overviewTitle: '시작 전에 확인하세요',
    overviewDesc: "AWS는 국내 서비스면 'ap-northeast-2(서울)' 리전을 기본으로 하세요. 루트 계정은 절대 일상 작업에 쓰지 말고, IAM 사용자 + MFA로 보호하는 것이 표준입니다. 프리티어가 끝나는 시점에 과금이 급증하지 않도록 예산 알림을 반드시 설정하세요.",
    overviewItems: [
      { iconKey: 'user', title: '조직 도메인 이메일', desc: '일상용 개인 메일 권장하지 않음.' },
      { iconKey: 'card', title: '해외결제 가능 카드', desc: '달러 청구, VAT 별도.' },
      { iconKey: 'shield', title: 'MFA(2FA) 앱', desc: '루트 계정 필수 설정.' },
      { iconKey: 'server', title: '서울 리전 기준', desc: 'ap-northeast-2 권장.' },
    ],
    steps: [
      { no: '01', title: 'AWS 계정 만들기', tag: 'SIGNUP', iconKey: 'user', desc: 'aws.amazon.com에서 계정을 생성합니다.', details: [
        '이메일·비밀번호·계정 이름 입력',
        '계정 유형: 개인 / 비즈니스',
        '주소·휴대폰은 영문 표기 (예: 123, Sejong-daero, Jung-gu, Seoul)',
        '휴대폰 SMS 인증 완료',
      ] },
      { no: '02', title: '결제 수단 등록', tag: 'BILLING', iconKey: 'card', desc: '$1 가승인 결제로 카드 유효성 확인.', details: [
        'Visa / Master / Amex 해외결제 가능 카드',
        '한국 카드 대부분 사용 가능 (체크카드도 OK)',
        '$1 결제 후 자동 취소 (2–7일 내)',
        'KRW 청구서 옵션도 있음 (설정 > 결제 기본 설정)',
      ] },
      { no: '03', title: '지원 플랜 선택', tag: 'SUPPORT', iconKey: 'settings', desc: '최초엔 기본(무료) Basic Support로 시작.', details: [
        'Basic: 무료, 계정·청구 문의만',
        'Developer: $29/월~, 기술 문의 가능',
        'Business / Enterprise: 프로덕션 운영 권장',
        '프로덕션 출시 전 Developer 이상으로 업그레이드 추천',
      ] },
      { no: '04', title: '루트 계정 MFA 설정', tag: 'SECURITY', iconKey: 'shield', desc: '루트 계정 탈취를 막기 위한 필수 단계.', details: [
        'IAM 콘솔 > 보안 자격 증명 > MFA 활성화',
        '가상 MFA 디바이스 (Google Authenticator / Authy / 1Password)',
        'QR 코드 스캔 → 6자리 코드 2번 입력',
        '복구 코드를 물리적으로 안전하게 보관',
        'MFA 없이 루트 로그인하는 것은 위험 — 사용 금지',
      ] },
      { no: '05', title: 'IAM 관리자 사용자 생성', tag: 'IAM', iconKey: 'user', desc: '일상 작업은 IAM 사용자로 수행합니다.', details: [
        'IAM > 사용자 > 사용자 추가',
        '사용자 이름 (예: admin-$이름)',
        '액세스 방식: AWS Management Console + 프로그래밍 방식(선택)',
        '권한: AdministratorAccess 정책 직접 연결 (또는 그룹에 넣기)',
        '로그인 URL: https://${계정ID}.signin.aws.amazon.com/console',
        '이후 루트 로그인은 금지, IAM 사용자 로그인만 사용',
      ] },
      { no: '06', title: '액세스 키 / 프로그래밍 접근', tag: 'KEYS', iconKey: 'key', desc: 'CLI·SDK 사용 시 액세스 키 발급.', details: [
        'IAM > 사용자 > 보안 자격 증명 > 액세스 키 만들기',
        'Access Key ID + Secret Access Key 발급 (한 번만 표시)',
        'Secret은 절대 Git 커밋 금지 → .env 또는 Secret Manager',
        'aws configure 명령으로 CLI에 저장',
        '주기적으로 순환 (90일마다 권장)',
        'EC2/Lambda는 IAM Role 사용 — 액세스 키 저장 불필요',
      ] },
      { no: '07', title: '예산 알림 설정', tag: 'BUDGET', iconKey: 'bell', desc: '프리티어 졸업 후 과금 폭탄 방지.', details: [
        'Billing > 예산 > 예산 만들기',
        '월 $10·$50·$100 등 단계별 알림',
        '예상 사용량·실제 사용량 각각 이메일 알림',
        'Cost Explorer로 월별 추이 확인',
        '미사용 리소스 주기적으로 정리',
      ] },
      { no: '08', title: '리전 선택 & 기본 서비스 활성화', tag: 'REGION', iconKey: 'server', desc: '리전 단위로 서비스가 분리됩니다.', details: [
        '한국 서비스: ap-northeast-2 (서울) 기본',
        '글로벌: us-east-1(버지니아북부) 기본 — IAM·CloudFront는 여기',
        '리전마다 가격·지연·서비스 제공 여부 다름',
        '리전 간 데이터 전송은 유료',
        '기본 VPC·서브넷 확인 후 보안 그룹 설정',
      ] },
    ],
    pitfalls: [
      { title: '루트 계정 일상 사용', desc: '루트 계정은 생성·삭제·결제 등 소수 작업만 사용하세요. 탈취 시 모든 것을 잃습니다. 보안 문제 1순위.' },
      { title: '액세스 키 GitHub 노출', desc: 'Public 저장소에 Secret Access Key가 올라가면 봇이 수초 내에 채굴·암호화폐 봇에 악용. 수십만 원 과금 사고 가능.' },
      { title: '프리티어 오해', desc: '"1년 무료"는 일부 상품·사용량 한도 내입니다. EBS 30GB·EC2 t2.micro 750시간 등. 초과분은 즉시 과금.' },
      { title: '리전 오인 설정', desc: '서울이 아닌 us-east-1에 EC2를 띄우면 한국 사용자 응답이 150ms+ 느려집니다. 최초 생성 시 리전 확인 필수.' },
      { title: 'NAT Gateway·EBS 잊힌 리소스', desc: 'NAT Gateway는 시간당 과금, 삭제된 EC2의 EBS는 남아 계속 과금. 월말 Cost Explorer로 점검.' },
    ],
    resources: [
      { title: 'AWS 가입', desc: '계정 만들기', href: 'https://aws.amazon.com/ko/free/' },
      { title: 'AWS Management Console', desc: '관리 콘솔', href: 'https://console.aws.amazon.com' },
      { title: 'IAM 모범 사례', desc: '권한·MFA·키 관리', href: 'https://docs.aws.amazon.com/ko_kr/IAM/latest/UserGuide/best-practices.html' },
      { title: '예산 가이드', desc: 'Billing Budgets 설정', href: 'https://docs.aws.amazon.com/ko_kr/cost-management/latest/userguide/budgets-managing-costs.html' },
      { title: '프리티어 상세', desc: '무료 사용량 한도', href: 'https://aws.amazon.com/ko/free/' },
      { title: 'AWS CLI 설정', desc: 'aws configure', href: 'https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/cli-configure-quickstart.html' },
    ],
  },
  en: {
    badgeText: 'AMAZON WEB SERVICES',
    titleTop: 'AWS',
    titleBottom: 'Account Creation & Initial Setup',
    description: `A signup guide for AWS, the world's largest cloud.\nCovers root-account hardening, IAM user creation, billing alerts, and region selection so you start without mistakes.`,
    ctaLabel: 'Start AWS signup',
    stats: [
      { label: 'Signup fee', value: 'Free' },
      { label: 'Free Tier', value: '12 months on key services' },
      { label: 'Requirements', value: 'Email · card · phone' },
    ],
    overviewTitle: 'Before you begin',
    overviewDesc: "For Korean workloads on AWS, default to the 'ap-northeast-2 (Seoul)' region. Never use the root account for daily work — protect it with an IAM user and MFA. Always set budget alerts so charges don't spike when Free Tier ends.",
    overviewItems: [
      { iconKey: 'user', title: 'Organization email', desc: 'Avoid personal inboxes.' },
      { iconKey: 'card', title: 'International-capable card', desc: 'Billed in USD, VAT extra.' },
      { iconKey: 'shield', title: 'MFA (2FA) app', desc: 'Required on the root account.' },
      { iconKey: 'server', title: 'Seoul as baseline', desc: 'ap-northeast-2 recommended.' },
    ],
    steps: [
      { no: '01', title: 'Create an AWS account', tag: 'SIGNUP', iconKey: 'user', desc: 'Sign up at aws.amazon.com.', details: [
        'Enter email, password, and account name',
        'Account type: Personal or Business',
        'Address and phone in English (e.g., 123, Sejong-daero, Jung-gu, Seoul)',
        'Complete SMS verification',
      ] },
      { no: '02', title: 'Register payment method', tag: 'BILLING', iconKey: 'card', desc: 'AWS validates the card with a $1 pre-auth.', details: [
        'Visa / Mastercard / Amex with international use enabled',
        'Most Korean cards work (debit cards too)',
        'The $1 auth is auto-voided in 2–7 days',
        'KRW invoicing is available (Settings > Billing preferences)',
      ] },
      { no: '03', title: 'Pick a support plan', tag: 'SUPPORT', iconKey: 'settings', desc: 'Start with the free Basic plan.', details: [
        'Basic: free, account and billing questions only',
        'Developer: from $29/mo, technical Q&A',
        'Business / Enterprise: recommended for production',
        'Upgrade to Developer or higher before production launch',
      ] },
      { no: '04', title: 'Enable MFA on root', tag: 'SECURITY', iconKey: 'shield', desc: 'Mandatory step to prevent root account takeover.', details: [
        'IAM Console > Security credentials > Assign MFA device',
        'Virtual MFA device (Google Authenticator / Authy / 1Password)',
        'Scan the QR code, enter two consecutive 6-digit codes',
        'Store recovery codes offline in a safe place',
        'Never sign in to root without MFA',
      ] },
      { no: '05', title: 'Create IAM admin user', tag: 'IAM', iconKey: 'user', desc: 'Perform daily work as an IAM user.', details: [
        'IAM > Users > Add user',
        'Username (e.g., admin-$name)',
        'Access type: AWS Management Console + programmatic (optional)',
        'Permissions: attach AdministratorAccess directly (or via group)',
        'Sign-in URL: https://${accountId}.signin.aws.amazon.com/console',
        'Afterwards, do not sign in as root — use the IAM user',
      ] },
      { no: '06', title: 'Access keys / programmatic access', tag: 'KEYS', iconKey: 'key', desc: 'Issue access keys for CLI and SDK usage.', details: [
        'IAM > Users > Security credentials > Create access key',
        'Access Key ID + Secret Access Key (shown once)',
        'Never commit Secret to Git — use .env or Secret Manager',
        'Save to CLI with `aws configure`',
        'Rotate regularly (every 90 days recommended)',
        'For EC2/Lambda use IAM Roles — no keys stored',
      ] },
      { no: '07', title: 'Set budget alerts', tag: 'BUDGET', iconKey: 'bell', desc: 'Prevent bill shock after Free Tier ends.', details: [
        'Billing > Budgets > Create budget',
        'Tiered monthly alerts ($10 / $50 / $100, etc.)',
        'Email alerts for forecasted and actual usage',
        'Use Cost Explorer to track monthly trends',
        'Clean up unused resources regularly',
      ] },
      { no: '08', title: 'Region selection & default services', tag: 'REGION', iconKey: 'server', desc: 'Resources are scoped per region.', details: [
        'Korea: default to ap-northeast-2 (Seoul)',
        'Global: us-east-1 (N. Virginia) — IAM and CloudFront live there',
        'Prices, latency, and availability differ by region',
        'Cross-region data transfer is billable',
        'Check default VPC/subnet and configure security groups',
      ] },
    ],
    pitfalls: [
      { title: 'Daily use of the root account', desc: 'Use root only for tasks like account creation, deletion, and billing. If compromised, you lose everything. This is the #1 security risk.' },
      { title: 'Access keys leaked on GitHub', desc: 'Secret Access Keys pushed to public repos are mined within seconds by bots — often used for crypto mining. Expect runaway charges.' },
      { title: 'Misreading Free Tier', desc: '"Free for 12 months" is scoped to select services and usage caps (EBS 30GB, EC2 t2.micro 750h, etc.). Overages bill immediately.' },
      { title: 'Wrong region', desc: 'Launching EC2 in us-east-1 instead of Seoul adds 150ms+ for Korean users. Always verify the region when creating resources.' },
      { title: 'Forgotten NAT Gateway / EBS', desc: 'NAT Gateway bills hourly, and orphaned EBS volumes from deleted EC2s keep charging. Audit with Cost Explorer each month.' },
    ],
    resources: [
      { title: 'AWS signup', desc: 'Create an account', href: 'https://aws.amazon.com/ko/free/' },
      { title: 'AWS Management Console', desc: 'Admin console', href: 'https://console.aws.amazon.com' },
      { title: 'IAM best practices', desc: 'Permissions, MFA, keys', href: 'https://docs.aws.amazon.com/ko_kr/IAM/latest/UserGuide/best-practices.html' },
      { title: 'Budgets guide', desc: 'Set up Billing Budgets', href: 'https://docs.aws.amazon.com/ko_kr/cost-management/latest/userguide/budgets-managing-costs.html' },
      { title: 'Free Tier details', desc: 'Free usage limits', href: 'https://aws.amazon.com/ko/free/' },
      { title: 'AWS CLI setup', desc: 'aws configure', href: 'https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/cli-configure-quickstart.html' },
    ],
  },
  ja: {
    badgeText: 'AMAZON WEB SERVICES',
    titleTop: 'AWS',
    titleBottom: 'アカウント作成 & 初期セットアップ',
    description: `世界最大のクラウド AWS のアカウント作成ガイドです。\nルートアカウントの保護、IAM ユーザー作成、請求アラート、リージョン選択までミスなく始められるよう整理しました。`,
    ctaLabel: 'AWS 登録を開始',
    stats: [
      { label: '登録費用', value: '無料' },
      { label: '無料利用枠', value: '主要サービスは 12 か月無料' },
      { label: '必要情報', value: 'メール・カード・携帯' },
    ],
    overviewTitle: '始める前に確認してください',
    overviewDesc: '国内向けのサービスであれば、AWS では「ap-northeast-2(ソウル)」リージョンを基本にしてください。ルートアカウントは日常作業に絶対に使わず、IAM ユーザー + MFA で保護するのが標準です。無料利用枠が終わる時点で課金が跳ね上がらないよう、必ず予算アラートを設定してください。',
    overviewItems: [
      { iconKey: 'user', title: '組織ドメインメール', desc: '個人用メールは推奨しません。' },
      { iconKey: 'card', title: '海外決済可能なカード', desc: 'USD 請求、VAT 別途。' },
      { iconKey: 'shield', title: 'MFA(2FA)アプリ', desc: 'ルートアカウントに必須。' },
      { iconKey: 'server', title: 'ソウルリージョン基準', desc: 'ap-northeast-2 を推奨。' },
    ],
    steps: [
      { no: '01', title: 'AWS アカウントの作成', tag: 'SIGNUP', iconKey: 'user', desc: 'aws.amazon.com でアカウントを作成します。', details: [
        'メール・パスワード・アカウント名を入力',
        'アカウント種別: 個人 / ビジネス',
        '住所・電話番号は英字表記(例: 123, Sejong-daero, Jung-gu, Seoul)',
        '携帯電話 SMS 認証を完了',
      ] },
      { no: '02', title: '支払い方法の登録', tag: 'BILLING', iconKey: 'card', desc: '$1 の仮決済でカードを検証します。', details: [
        'Visa / Mastercard / Amex の海外決済対応カード',
        '韓国カードの多くが利用可能(デビットカードも可)',
        '$1 決済は 2〜7 日以内に自動キャンセル',
        'KRW 請求オプションもあります(設定 > 請求設定)',
      ] },
      { no: '03', title: 'サポートプランの選択', tag: 'SUPPORT', iconKey: 'settings', desc: '最初は無料の Basic Support から始めます。', details: [
        'Basic: 無料、アカウントと請求に関する問い合わせのみ',
        'Developer: $29/月〜、技術問い合わせ可',
        'Business / Enterprise: 本番運用に推奨',
        '本番リリース前に Developer 以上へのアップグレードを推奨',
      ] },
      { no: '04', title: 'ルートアカウントへの MFA 設定', tag: 'SECURITY', iconKey: 'shield', desc: 'ルート乗っ取りを防ぐ必須ステップ。', details: [
        'IAM コンソール > セキュリティ認証情報 > MFA 有効化',
        '仮想 MFA デバイス(Google Authenticator / Authy / 1Password)',
        'QR コードをスキャン → 6 桁コードを 2 回入力',
        '復旧コードは物理的に安全な場所へ保管',
        'MFA なしでのルートログインは危険 — 禁止',
      ] },
      { no: '05', title: 'IAM 管理者ユーザーの作成', tag: 'IAM', iconKey: 'user', desc: '日常作業は IAM ユーザーで行います。', details: [
        'IAM > ユーザー > ユーザーを追加',
        'ユーザー名(例: admin-$名前)',
        'アクセス方式: AWS Management Console + プログラム(任意)',
        '権限: AdministratorAccess ポリシーを直接付与(またはグループ経由)',
        'ログイン URL: https://${accountId}.signin.aws.amazon.com/console',
        '以降はルートログイン禁止、IAM ユーザーでのみログイン',
      ] },
      { no: '06', title: 'アクセスキー / プログラムアクセス', tag: 'KEYS', iconKey: 'key', desc: 'CLI / SDK を使う際にアクセスキーを発行します。', details: [
        'IAM > ユーザー > セキュリティ認証情報 > アクセスキーの作成',
        'Access Key ID + Secret Access Key を発行(表示は一度だけ)',
        'Secret を Git にコミットしない → .env または Secret Manager',
        '`aws configure` コマンドで CLI に保存',
        '定期的にローテーション(90 日ごと推奨)',
        'EC2 / Lambda は IAM Role を使用 — アクセスキー不要',
      ] },
      { no: '07', title: '予算アラート設定', tag: 'BUDGET', iconKey: 'bell', desc: '無料利用枠終了後の請求急増を防ぎます。', details: [
        'Billing > 予算 > 予算の作成',
        '月 $10 / $50 / $100 などの段階的アラート',
        '予想使用量と実使用量をそれぞれメール通知',
        'Cost Explorer で月次推移を確認',
        '未使用リソースを定期的に整理',
      ] },
      { no: '08', title: 'リージョン選択 & 既定サービスの有効化', tag: 'REGION', iconKey: 'server', desc: 'サービスはリージョン単位で分離されます。', details: [
        '国内向け: ap-northeast-2(ソウル)を基本に',
        'グローバル: us-east-1(バージニア北部)— IAM / CloudFront はここ',
        'リージョンごとに料金・遅延・提供サービスが異なる',
        'リージョン間のデータ転送は有料',
        'デフォルト VPC / サブネットを確認しセキュリティグループを設定',
      ] },
    ],
    pitfalls: [
      { title: 'ルートアカウントの日常利用', desc: 'ルートは作成・削除・請求など少数の作業にだけ使ってください。奪われればすべてを失います。セキュリティリスクの第一位です。' },
      { title: 'アクセスキーの GitHub 公開', desc: 'パブリックリポジトリに Secret Access Key が上がるとボットが数秒で発見し、暗号資産マイニングなどに悪用されます。数十万円規模の請求事故になり得ます。' },
      { title: '無料利用枠の誤解', desc: '「1 年間無料」は一部サービスと上限内に限られます(EBS 30GB、EC2 t2.micro 750 時間など)。超過分はすぐに課金されます。' },
      { title: 'リージョンの設定ミス', desc: 'ソウルではなく us-east-1 に EC2 を立ち上げると、韓国ユーザー向けのレスポンスが 150ms 以上遅くなります。作成時にリージョンを必ず確認してください。' },
      { title: '忘れられた NAT Gateway / EBS', desc: 'NAT Gateway は時間課金、削除した EC2 の EBS は残って課金され続けます。月末に Cost Explorer でチェックしましょう。' },
    ],
    resources: [
      { title: 'AWS 登録', desc: 'アカウントを作成', href: 'https://aws.amazon.com/ko/free/' },
      { title: 'AWS Management Console', desc: '管理コンソール', href: 'https://console.aws.amazon.com' },
      { title: 'IAM ベストプラクティス', desc: '権限・MFA・キー管理', href: 'https://docs.aws.amazon.com/ko_kr/IAM/latest/UserGuide/best-practices.html' },
      { title: '予算ガイド', desc: 'Billing Budgets の設定', href: 'https://docs.aws.amazon.com/ko_kr/cost-management/latest/userguide/budgets-managing-costs.html' },
      { title: '無料利用枠詳細', desc: '無料利用の上限', href: 'https://aws.amazon.com/ko/free/' },
      { title: 'AWS CLI 設定', desc: 'aws configure', href: 'https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/cli-configure-quickstart.html' },
    ],
  },
  zh: {
    badgeText: 'AMAZON WEB SERVICES',
    titleTop: 'AWS',
    titleBottom: '账户开通与初始化',
    description: `全球最大云服务商 AWS 的账户开通指南。\n涵盖根账户防护、IAM 用户创建、账单提醒、区域选择,帮助你从一开始就不踩坑。`,
    ctaLabel: '开始 AWS 注册',
    stats: [
      { label: '注册费用', value: '免费' },
      { label: '免费套餐', value: '主要服务 12 个月免费' },
      { label: '所需信息', value: '邮箱 · 信用卡 · 手机号' },
    ],
    overviewTitle: '开始前请确认',
    overviewDesc: '面向韩国用户的服务请默认选择 AWS 的 ap-northeast-2(首尔)区域。根账户绝对不要用于日常操作,标准做法是使用 IAM 用户 + MFA 保护。务必设置预算提醒,避免免费套餐结束时账单飙升。',
    overviewItems: [
      { iconKey: 'user', title: '组织域邮箱', desc: '不建议使用个人邮箱。' },
      { iconKey: 'card', title: '支持境外支付的信用卡', desc: '美元结算,税费另计。' },
      { iconKey: 'shield', title: 'MFA(2FA)应用', desc: '根账户必须设置。' },
      { iconKey: 'server', title: '默认首尔区域', desc: '建议 ap-northeast-2。' },
    ],
    steps: [
      { no: '01', title: '创建 AWS 账户', tag: 'SIGNUP', iconKey: 'user', desc: '在 aws.amazon.com 完成注册。', details: [
        '填写邮箱、密码和账户名称',
        '账户类型: 个人 / 企业',
        '地址与手机号使用英文填写(例: 123, Sejong-daero, Jung-gu, Seoul)',
        '完成短信验证',
      ] },
      { no: '02', title: '登记支付方式', tag: 'BILLING', iconKey: 'card', desc: 'AWS 会以 $1 预授权校验信用卡。', details: [
        '支持境外支付的 Visa / Mastercard / Amex',
        '大多数韩国信用卡可用(借记卡也可)',
        '$1 预授权通常在 2–7 天内自动取消',
        '也可切换为韩元账单(设置 > 结算首选项)',
      ] },
      { no: '03', title: '选择支持计划', tag: 'SUPPORT', iconKey: 'settings', desc: '初期从免费的 Basic 计划开始即可。', details: [
        'Basic: 免费,仅账户与账单咨询',
        'Developer: $29/月起,可提技术问题',
        'Business / Enterprise: 生产环境推荐',
        '正式上线前建议升级到 Developer 或以上',
      ] },
      { no: '04', title: '为根账户启用 MFA', tag: 'SECURITY', iconKey: 'shield', desc: '防止根账户被盗的关键一步。', details: [
        'IAM 控制台 > 安全凭证 > 启用 MFA',
        '虚拟 MFA 设备(Google Authenticator / Authy / 1Password)',
        '扫描二维码并连续输入两次 6 位验证码',
        '恢复代码请离线保存在安全场所',
        '绝不能在没有 MFA 的情况下以根账户登录',
      ] },
      { no: '05', title: '创建 IAM 管理员用户', tag: 'IAM', iconKey: 'user', desc: '日常操作均使用 IAM 用户。', details: [
        'IAM > 用户 > 添加用户',
        '用户名(例: admin-$姓名)',
        '访问方式: AWS Management Console + 编程访问(可选)',
        '权限: 直接附加 AdministratorAccess 策略(或加入用户组)',
        '登录 URL: https://${accountId}.signin.aws.amazon.com/console',
        '之后禁止以根账户登录,仅使用 IAM 用户',
      ] },
      { no: '06', title: '访问密钥 / 编程访问', tag: 'KEYS', iconKey: 'key', desc: '使用 CLI 或 SDK 时签发访问密钥。', details: [
        'IAM > 用户 > 安全凭证 > 创建访问密钥',
        '签发 Access Key ID + Secret Access Key(仅显示一次)',
        'Secret 绝不提交 Git,使用 .env 或 Secret Manager',
        '通过 `aws configure` 保存到 CLI',
        '定期轮换(建议每 90 天一次)',
        'EC2 / Lambda 使用 IAM Role — 无需存储密钥',
      ] },
      { no: '07', title: '设置预算提醒', tag: 'BUDGET', iconKey: 'bell', desc: '免费套餐结束后防止账单暴涨。', details: [
        'Billing > 预算 > 创建预算',
        '分级提醒,如每月 $10 / $50 / $100',
        '分别针对预测用量与实际用量发送邮件提醒',
        '使用 Cost Explorer 查看月度趋势',
        '定期清理不再使用的资源',
      ] },
      { no: '08', title: '区域选择与基础服务', tag: 'REGION', iconKey: 'server', desc: '资源按区域隔离。', details: [
        '韩国业务: 默认 ap-northeast-2(首尔)',
        '全球: us-east-1(弗吉尼亚北部)— IAM 与 CloudFront 位于此区域',
        '各区域的价格、延迟、可用服务不同',
        '跨区域数据传输需付费',
        '检查默认 VPC / 子网并配置安全组',
      ] },
    ],
    pitfalls: [
      { title: '日常使用根账户', desc: '根账户应仅用于创建、删除、账单等少数操作。一旦被盗,你将失去一切。这是安全问题的第一大隐患。' },
      { title: '访问密钥泄露到 GitHub', desc: 'Secret Access Key 推送至公开仓库会在数秒内被机器人发现,常被用于挖矿,产生数万元级账单。' },
      { title: '误解免费套餐', desc: '所谓"一年免费"仅限于部分服务与用量上限(EBS 30GB、EC2 t2.micro 750 小时等),超出部分立即计费。' },
      { title: '区域配置错误', desc: '把 EC2 部署在 us-east-1 而非首尔,会给韩国用户增加 150ms 以上的延迟。创建资源时务必确认区域。' },
      { title: '被遗忘的 NAT Gateway / EBS', desc: 'NAT Gateway 按小时计费,已删除 EC2 遗留的 EBS 会持续产生费用。每月用 Cost Explorer 检查一次。' },
    ],
    resources: [
      { title: 'AWS 注册', desc: '创建账户', href: 'https://aws.amazon.com/ko/free/' },
      { title: 'AWS Management Console', desc: '管理控制台', href: 'https://console.aws.amazon.com' },
      { title: 'IAM 最佳实践', desc: '权限 · MFA · 密钥管理', href: 'https://docs.aws.amazon.com/ko_kr/IAM/latest/UserGuide/best-practices.html' },
      { title: '预算指南', desc: '配置 Billing Budgets', href: 'https://docs.aws.amazon.com/ko_kr/cost-management/latest/userguide/budgets-managing-costs.html' },
      { title: '免费套餐详情', desc: '免费额度说明', href: 'https://aws.amazon.com/ko/free/' },
      { title: 'AWS CLI 配置', desc: 'aws configure', href: 'https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/cli-configure-quickstart.html' },
    ],
  },
}

export default function AwsGuidePage() {
  const locale = useLocale() as Locale
  const d = DATA[locale] ?? DATA.ko
  return (
    <GuideTemplate
      badge={{ icon: badgeIcon, text: d.badgeText }}
      titleTop={d.titleTop}
      titleBottom={d.titleBottom}
      description={d.description}
      primaryCta={{ label: d.ctaLabel, href: 'https://aws.amazon.com/ko/free/' }}
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
