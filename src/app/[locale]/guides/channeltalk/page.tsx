'use client'

import { useLocale } from 'next-intl'
import { GuideTemplate } from '@/components/GuideTemplate'
import { MessageCircle, User, Settings, Key, Users, Bell, Shield, Zap } from 'lucide-react'

type Locale = 'ko' | 'en' | 'ja' | 'zh'

const badgeIcon = <MessageCircle className="h-3.5 w-3.5 text-white/80" />
const iconUser = <User className="h-5 w-5" />
const iconUsers = <Users className="h-5 w-5" />
const iconShield = <Shield className="h-5 w-5" />
const iconKey = <Key className="h-5 w-5" />
const iconZap = <Zap className="h-5 w-5" />
const iconMessageCircle = <MessageCircle className="h-5 w-5" />
const iconSettings = <Settings className="h-5 w-5" />
const iconBell = <Bell className="h-5 w-5" />

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
    titleTop: '채널톡',
    titleBottom: '고객센터 챗 연동',
    description: `국내 대표 고객 상담 채널 "채널톡" 연동 가이드입니다.\n채널 개설, 웹/앱 SDK 설치, 상담 운영, 자동화까지 한번에 정리합니다.`,
    primaryCtaLabel: '채널톡 채널 만들기',
    stats: [
      { label: '무료 플랜', value: '3인 상담원' },
      { label: '유료 전환', value: 'Pro 약 ₩39,000/상담원' },
      { label: '필요 정보', value: '이메일·휴대폰' },
    ],
    overviewTitle: '시작 전에 확인하세요',
    overviewDesc: '채널톡은 라이브 채팅 + 고객 DB + 마케팅 자동화를 한 번에 제공합니다. 단순 문의만 받는다면 무료 플랜으로 충분하고, 상담 이력·통계·API 자동화가 필요하면 Pro 이상을 고려하세요. 유저 식별(member_id) 연동을 해야 상담 이력이 사용자별로 쌓입니다.',
    overviewItems: [
      { title: '대표 운영자 지정', desc: '이메일 인증 필수.' },
      { title: '상담원 인원 산정', desc: '무료는 3인까지.' },
      { title: '개인정보 방침 업데이트', desc: '3rd party 명시 필요.' },
      { title: '유저 연동 계획', desc: 'member_id · 프로필 매핑.' },
    ],
    steps: [
      { no: '01', title: '채널 가입 & 만들기', tag: 'SIGNUP', desc: 'channel.io에서 채널을 생성합니다.', details: [
        '이메일·휴대폰 가입 (Google OAuth도 가능)',
        '채널 이름 · 로고 · 업종 선택',
        '무료 Startup 플랜으로 시작',
        '채널 URL 슬러그 결정 (URL에 사용됨)',
      ] },
      { no: '02', title: '상담팀·운영시간 설정', tag: 'TEAM', desc: '상담 라우팅을 위한 기본 세팅.', details: [
        '상담팀 만들기 (CS · 영업 · 기술지원 등)',
        '상담원 초대 (이메일 링크)',
        '각 팀의 운영시간·자동응답 설정',
        '운영시간 외 "자리비움" 메시지 · 티켓 전환',
      ] },
      { no: '03', title: '웹 SDK 설치', tag: 'WEB', desc: '홈페이지에 채팅 버튼을 띄웁니다.', details: [
        'Channel Settings > Installation',
        '플러그인 키(Plugin Key) 확인',
        '<head>에 ChannelIO() 함수 스크립트 삽입',
        'SPA는 페이지 전환 시 ChannelIO("updateUser") 호출',
        'Next.js: app/layout.tsx에서 Script 컴포넌트로 로드',
      ] },
      { no: '04', title: '유저 식별 (Boot)', tag: 'IDENTIFY', desc: '로그인 사용자를 채널톡에 식별합니다.', details: [
        'ChannelIO("boot", { pluginKey, memberId, profile })',
        'memberId: 내부 고유 ID (이메일 권장)',
        'profile: name · email · mobileNumber · avatarUrl',
        'memberHash: HMAC-SHA256(secret, memberId) 서버 계산',
        'memberHash를 넣으면 타 사용자 사칭 방지',
        '로그아웃 시 ChannelIO("shutdown") 호출',
      ] },
      { no: '05', title: '모바일 앱 SDK (iOS·Android·RN)', tag: 'APP', desc: '네이티브/크로스플랫폼 앱에 연동.', details: [
        'iOS: CocoaPods(ChannelIOFront) / SPM 설치',
        'Android: Maven Central(io.channel:plugin-android)',
        'React Native: @channel.io/react-native-channel-plugin',
        '앱 실행 시 ChannelIO.boot(...) 호출',
        'Push 알림을 위한 FCM·APNs 토큰 등록',
      ] },
      { no: '06', title: '팀 챗·팝업·마케팅 (선택)', tag: 'FEATURES', desc: '추가 기능 활성화.', details: [
        '팀 챗(Team Chat): 내부 메신저로도 활용',
        '마케팅 팝업: 특정 페이지 진입 시 유도 메시지',
        'Support Bot: 키워드 기반 자동 응답 (LLM 연결 가능)',
        '이메일 캠페인 · SMS 발송 (Pro 이상)',
      ] },
      { no: '07', title: '웹훅 · API 연동', tag: 'WEBHOOK', desc: 'CRM·Slack·업무 툴과 연결.', details: [
        'Integration > Webhook에서 엔드포인트 등록',
        '이벤트: new_user_chat, user_chat_assigned, review_submitted 등',
        'X-Channel-Signature 헤더로 서명 검증',
        'Slack·Jira·Zapier는 내장 통합',
        'Open API(REST): 상담 조회·매니저 관리 자동화',
      ] },
      { no: '08', title: '알림·GDPR·모니터링', tag: 'OPS', desc: '운영 관점 설정.', details: [
        '상담원별 브라우저·이메일·모바일 알림 설정',
        '개인정보 처리방침에 채널톡 명시 (DataWall)',
        '30일 이상 미접속 유저 자동 정리(옵션)',
        '상담 만족도 조사 후 CSAT 확인',
        '월별 통계·리포트 대시보드 활용',
      ] },
    ],
    pitfalls: [
      { title: 'memberHash 미사용', desc: 'memberHash 없이 memberId만 쓰면 타 사용자로 위장 가능. 서버 HMAC 필수.' },
      { title: 'SPA에서 updateUser 누락', desc: 'Next.js/React에서 라우팅이 바뀌어도 채널톡은 상태를 유지합니다. 로그인/로그아웃 시 boot/shutdown 호출 안 하면 이전 사용자로 남습니다.' },
      { title: '개인정보 처리방침 누락', desc: '채널톡은 개인정보를 처리하는 3rd party입니다. 방침에 명시하지 않으면 감사 이슈.' },
      { title: '푸시 알림 토큰 미등록', desc: '앱에서 FCM/APNs 토큰을 채널톡에 등록하지 않으면 상담원 응답 푸시를 받지 못합니다.' },
      { title: '무료 플랜 상담원 한도', desc: '3인 초과 시 자동 결제가 아닌 기능 제한. 필요 시 즉시 Pro 전환.' },
    ],
    resources: [
      { title: 'Channel Talk', desc: '채널 개설·가격', href: 'https://channel.io' },
      { title: 'Developers 문서', desc: '설치·API·SDK', href: 'https://developers.channel.io' },
      { title: 'Web SDK 가이드', desc: 'JavaScript 설치', href: 'https://developers.channel.io/docs/web-channelio' },
      { title: 'Mobile SDK', desc: 'iOS·Android·RN', href: 'https://developers.channel.io/docs/mobile-channelio' },
      { title: 'Open API', desc: 'REST · 자동화', href: 'https://developers.channel.io/reference' },
      { title: 'Webhook', desc: '이벤트 수신', href: 'https://developers.channel.io/docs/webhook' },
    ],
  },
  en: {
    titleTop: 'ChannelTalk',
    titleBottom: 'Support Chat Integration',
    description: `A guide to integrating ChannelTalk, Korea\'s leading customer support chat.\nCovers channel creation, web and app SDK installation, operations, and automation.`,
    primaryCtaLabel: 'Create a ChannelTalk channel',
    stats: [
      { label: 'Free plan', value: '3 operators' },
      { label: 'Paid upgrade', value: 'Pro ~ ₩39,000/operator' },
      { label: 'Requirements', value: 'Email · phone' },
    ],
    overviewTitle: 'Check before you start',
    overviewDesc: 'ChannelTalk bundles live chat, a customer database, and marketing automation. If you only handle basic inquiries the free plan is enough; for conversation history, analytics, and API automation, consider Pro or higher. User identification (member_id) is what ties conversation history to each user.',
    overviewItems: [
      { title: 'Assign a primary admin', desc: 'Email verification required.' },
      { title: 'Plan operator count', desc: 'Free covers up to 3.' },
      { title: 'Update privacy policy', desc: 'Disclose the third party.' },
      { title: 'User integration plan', desc: 'Map member_id and profile.' },
    ],
    steps: [
      { no: '01', title: 'Sign up & create a channel', tag: 'SIGNUP', desc: 'Create your channel at channel.io.', details: [
        'Sign up with email or phone (Google OAuth also works)',
        'Choose a channel name, logo, and industry',
        'Start on the free Startup plan',
        'Pick a channel URL slug (used in the URL)',
      ] },
      { no: '02', title: 'Configure teams and hours', tag: 'TEAM', desc: 'Basic setup for conversation routing.', details: [
        'Create teams (CS, sales, technical support, etc.)',
        'Invite operators via email links',
        'Set hours and auto-replies for each team',
        'Configure "away" messages and ticket conversion for out-of-hours',
      ] },
      { no: '03', title: 'Install the web SDK', tag: 'WEB', desc: 'Show the chat button on your site.', details: [
        'Channel Settings > Installation',
        'Copy the Plugin Key',
        'Insert the ChannelIO() script into <head>',
        'SPAs should call ChannelIO("updateUser") on route changes',
        'Next.js: load it via the Script component in app/layout.tsx',
      ] },
      { no: '04', title: 'Identify users (Boot)', tag: 'IDENTIFY', desc: 'Identify logged-in users to ChannelTalk.', details: [
        'ChannelIO("boot", { pluginKey, memberId, profile })',
        'memberId: your internal unique ID (email recommended)',
        'profile: name, email, mobileNumber, avatarUrl',
        'memberHash: compute HMAC-SHA256(secret, memberId) on the server',
        'memberHash prevents user impersonation',
        'Call ChannelIO("shutdown") on logout',
      ] },
      { no: '05', title: 'Mobile SDK (iOS · Android · RN)', tag: 'APP', desc: 'Integrate with native or cross-platform apps.', details: [
        'iOS: install via CocoaPods (ChannelIOFront) or SPM',
        'Android: Maven Central (io.channel:plugin-android)',
        'React Native: @channel.io/react-native-channel-plugin',
        'Call ChannelIO.boot(...) at app launch',
        'Register FCM and APNs tokens for push notifications',
      ] },
      { no: '06', title: 'Team Chat, popups, marketing (optional)', tag: 'FEATURES', desc: 'Enable extra features.', details: [
        'Team Chat: use it as an internal messenger',
        'Marketing popups: trigger messages on specific pages',
        'Support Bot: keyword-based auto replies (can plug into an LLM)',
        'Email campaigns and SMS (Pro and above)',
      ] },
      { no: '07', title: 'Webhooks & API integration', tag: 'WEBHOOK', desc: 'Connect to CRMs, Slack, and other tools.', details: [
        'Integration > Webhook to register endpoints',
        'Events: new_user_chat, user_chat_assigned, review_submitted, and more',
        'Verify signatures via the X-Channel-Signature header',
        'Slack, Jira, and Zapier have built-in integrations',
        'Open API (REST): automate chat queries and manager operations',
      ] },
      { no: '08', title: 'Notifications, GDPR, monitoring', tag: 'OPS', desc: 'Operations-side configuration.', details: [
        'Per-operator browser, email, and mobile notifications',
        'Disclose ChannelTalk in your privacy policy (DataWall)',
        'Optional: auto-clean users inactive for 30+ days',
        'Run satisfaction surveys and check CSAT',
        'Use the monthly analytics and reporting dashboard',
      ] },
    ],
    pitfalls: [
      { title: 'Skipping memberHash', desc: 'Using only memberId without memberHash allows impersonation. Server-side HMAC is mandatory.' },
      { title: 'Forgetting updateUser in SPAs', desc: 'ChannelTalk preserves state across Next.js/React route changes. Skipping boot/shutdown on login/logout leaves the previous user attached.' },
      { title: 'Missing privacy disclosure', desc: 'ChannelTalk is a third party that processes personal data. Failing to disclose it leads to audit issues.' },
      { title: 'Push tokens not registered', desc: 'Without FCM/APNs tokens registered with ChannelTalk, operator replies will not trigger app push notifications.' },
      { title: 'Free-plan operator limit', desc: 'Exceeding 3 operators restricts features rather than auto-billing. Upgrade to Pro when you need more.' },
    ],
    resources: [
      { title: 'ChannelTalk', desc: 'Create a channel · pricing', href: 'https://channel.io' },
      { title: 'Developer docs', desc: 'Install · API · SDK', href: 'https://developers.channel.io' },
      { title: 'Web SDK guide', desc: 'JavaScript install', href: 'https://developers.channel.io/docs/web-channelio' },
      { title: 'Mobile SDK', desc: 'iOS · Android · RN', href: 'https://developers.channel.io/docs/mobile-channelio' },
      { title: 'Open API', desc: 'REST · automation', href: 'https://developers.channel.io/reference' },
      { title: 'Webhook', desc: 'Receive events', href: 'https://developers.channel.io/docs/webhook' },
    ],
  },
  ja: {
    titleTop: 'ChannelTalk',
    titleBottom: 'カスタマーサポートチャット連携',
    description: `韓国の代表的なカスタマーサポートチャット「ChannelTalk」の連携ガイドです。\nチャンネル開設、Web/アプリSDKの導入、運用、自動化まで一括でまとめています。`,
    primaryCtaLabel: 'ChannelTalkチャンネルを作成',
    stats: [
      { label: '無料プラン', value: '相談員3人' },
      { label: '有料移行', value: 'Pro 約₩39,000/相談員' },
      { label: '必要情報', value: 'メール・電話番号' },
    ],
    overviewTitle: '始める前にご確認ください',
    overviewDesc: 'ChannelTalkはライブチャット+顧客DB+マーケティングオートメーションを一括で提供します。単純な問い合わせ対応なら無料プランで十分、相談履歴・統計・API自動化が必要ならPro以上を検討してください。ユーザー識別(member_id)連携を行うとユーザーごとに履歴が蓄積されます。',
    overviewItems: [
      { title: '代表運営者の指定', desc: 'メール認証必須。' },
      { title: '相談員人数の見積もり', desc: '無料は3人まで。' },
      { title: 'プライバシーポリシー更新', desc: '3rd partyの明示が必要。' },
      { title: 'ユーザー連携計画', desc: 'member_id・プロフィールのマッピング。' },
    ],
    steps: [
      { no: '01', title: 'チャンネル登録 & 作成', tag: 'SIGNUP', desc: 'channel.ioでチャンネルを作成します。', details: [
        'メール・電話番号で登録(Google OAuthも可)',
        'チャンネル名・ロゴ・業種を選択',
        '無料Startupプランで開始',
        'チャンネルURLスラッグを決定(URLに使用)',
      ] },
      { no: '02', title: '相談チーム・営業時間の設定', tag: 'TEAM', desc: 'ルーティングのための基本設定。', details: [
        '相談チームを作成(CS・営業・技術支援など)',
        '相談員をメールリンクで招待',
        '各チームの営業時間・自動応答を設定',
        '営業時間外の「離席」メッセージ・チケット化',
      ] },
      { no: '03', title: 'Web SDKの導入', tag: 'WEB', desc: 'サイトにチャットボタンを表示します。', details: [
        'Channel Settings > Installation',
        'Plugin Keyを確認',
        '<head>にChannelIO()関数のスクリプトを挿入',
        'SPAはルート変更時にChannelIO("updateUser")を呼び出す',
        'Next.js: app/layout.tsxでScriptコンポーネントから読み込む',
      ] },
      { no: '04', title: 'ユーザー識別(Boot)', tag: 'IDENTIFY', desc: 'ログイン済みユーザーをChannelTalkに識別させます。', details: [
        'ChannelIO("boot", { pluginKey, memberId, profile })',
        'memberId: 内部固有ID(メール推奨)',
        'profile: name・email・mobileNumber・avatarUrl',
        'memberHash: HMAC-SHA256(secret, memberId)をサーバーで計算',
        'memberHashを入れると成りすましを防止',
        'ログアウト時にChannelIO("shutdown")を呼び出す',
      ] },
      { no: '05', title: 'モバイルアプリSDK(iOS・Android・RN)', tag: 'APP', desc: 'ネイティブ/クロスプラットフォームアプリに連携します。', details: [
        'iOS: CocoaPods(ChannelIOFront) / SPMで導入',
        'Android: Maven Central(io.channel:plugin-android)',
        'React Native: @channel.io/react-native-channel-plugin',
        'アプリ起動時にChannelIO.boot(...)を呼び出す',
        'Push通知のためにFCM・APNsトークンを登録',
      ] },
      { no: '06', title: 'Team Chat・ポップアップ・マーケティング(任意)', tag: 'FEATURES', desc: '追加機能を有効化します。', details: [
        'Team Chat: 社内メッセンジャーとしても活用',
        'マーケティングポップアップ: 特定ページ進入時に誘導',
        'Support Bot: キーワードベースの自動応答(LLM連携可)',
        'メールキャンペーン・SMS送信(Pro以上)',
      ] },
      { no: '07', title: 'Webhook・API連携', tag: 'WEBHOOK', desc: 'CRM・Slack・業務ツールと接続します。', details: [
        'Integration > Webhookでエンドポイントを登録',
        'イベント: new_user_chat, user_chat_assigned, review_submittedなど',
        'X-Channel-Signatureヘッダーで署名検証',
        'Slack・Jira・Zapierは組み込み連携あり',
        'Open API(REST): 相談照会・マネージャー管理を自動化',
      ] },
      { no: '08', title: '通知・GDPR・モニタリング', tag: 'OPS', desc: '運用観点の設定。', details: [
        '相談員別にブラウザ・メール・モバイル通知を設定',
        'プライバシーポリシーにChannelTalkを明示(DataWall)',
        '30日以上未接続ユーザーの自動整理(任意)',
        '満足度アンケートでCSATを確認',
        '月次統計・レポートダッシュボードを活用',
      ] },
    ],
    pitfalls: [
      { title: 'memberHash未使用', desc: 'memberHashなしでmemberIdだけ使うと他ユーザーに成りすまし可能。サーバーHMAC必須。' },
      { title: 'SPAでupdateUser忘れ', desc: 'Next.js/Reactでルーティングが変わってもChannelTalkは状態を保持します。ログイン/ログアウト時にboot/shutdownを呼ばないと前ユーザーが残ります。' },
      { title: 'プライバシーポリシー未更新', desc: 'ChannelTalkは個人情報を扱う3rd partyです。ポリシーに明示しないと監査で問題になります。' },
      { title: 'プッシュトークン未登録', desc: 'アプリでFCM/APNsトークンをChannelTalkへ登録しないと相談員の返信プッシュが届きません。' },
      { title: '無料プランの相談員上限', desc: '3人を超えると自動課金ではなく機能制限になります。必要に応じて即Proへ移行を。' },
    ],
    resources: [
      { title: 'ChannelTalk', desc: 'チャンネル開設・料金', href: 'https://channel.io' },
      { title: '開発者ドキュメント', desc: '導入・API・SDK', href: 'https://developers.channel.io' },
      { title: 'Web SDKガイド', desc: 'JavaScript導入', href: 'https://developers.channel.io/docs/web-channelio' },
      { title: 'Mobile SDK', desc: 'iOS・Android・RN', href: 'https://developers.channel.io/docs/mobile-channelio' },
      { title: 'Open API', desc: 'REST・自動化', href: 'https://developers.channel.io/reference' },
      { title: 'Webhook', desc: 'イベント受信', href: 'https://developers.channel.io/docs/webhook' },
    ],
  },
  zh: {
    titleTop: 'ChannelTalk',
    titleBottom: '客服聊天接入',
    description: `韩国主流客服聊天 ChannelTalk 的接入指南。\n涵盖频道创建、Web/App SDK 安装、坐席运营与自动化。`,
    primaryCtaLabel: '创建 ChannelTalk 频道',
    stats: [
      { label: '免费套餐', value: '3 位坐席' },
      { label: '付费升级', value: 'Pro 约 ₩39,000/坐席' },
      { label: '准备信息', value: '邮箱、手机号' },
    ],
    overviewTitle: '开始前请确认',
    overviewDesc: 'ChannelTalk 集在线聊天、客户数据库与营销自动化于一体。只做基础咨询,免费套餐即可;需要会话历史、统计和 API 自动化则考虑 Pro 起。做好用户识别(member_id)对接后,会话历史才能按用户积累。',
    overviewItems: [
      { title: '指定主运营者', desc: '需邮箱验证。' },
      { title: '估算坐席人数', desc: '免费套餐至多 3 人。' },
      { title: '更新隐私政策', desc: '需声明第三方。' },
      { title: '用户对接方案', desc: 'member_id 与资料映射。' },
    ],
    steps: [
      { no: '01', title: '注册并创建频道', tag: 'SIGNUP', desc: '在 channel.io 创建频道。', details: [
        '邮箱或手机号注册(亦支持 Google OAuth)',
        '选择频道名称、Logo、行业',
        '从免费 Startup 套餐开始',
        '确定频道 URL slug(用于链接)',
      ] },
      { no: '02', title: '坐席团队与营业时间', tag: 'TEAM', desc: '用于会话分派的基础配置。', details: [
        '创建坐席团队(客服、销售、技术支持等)',
        '通过邮件链接邀请坐席',
        '为每个团队设置营业时间与自动回复',
        '非工作时间的「离线」提示 · 转工单',
      ] },
      { no: '03', title: '安装 Web SDK', tag: 'WEB', desc: '在网站上展示聊天按钮。', details: [
        'Channel Settings > Installation',
        '获取 Plugin Key',
        '将 ChannelIO() 脚本插入 <head>',
        'SPA 路由切换时调用 ChannelIO("updateUser")',
        'Next.js:在 app/layout.tsx 使用 Script 组件加载',
      ] },
      { no: '04', title: '用户识别(Boot)', tag: 'IDENTIFY', desc: '向 ChannelTalk 标识已登录用户。', details: [
        'ChannelIO("boot", { pluginKey, memberId, profile })',
        'memberId:内部唯一 ID(建议用邮箱)',
        'profile:name、email、mobileNumber、avatarUrl',
        'memberHash:在服务端计算 HMAC-SHA256(secret, memberId)',
        '传入 memberHash 可防止他人冒充',
        '退出登录时调用 ChannelIO("shutdown")',
      ] },
      { no: '05', title: '移动应用 SDK(iOS / Android / RN)', tag: 'APP', desc: '接入原生或跨平台 App。', details: [
        'iOS:通过 CocoaPods(ChannelIOFront)或 SPM 安装',
        'Android:Maven Central(io.channel:plugin-android)',
        'React Native:@channel.io/react-native-channel-plugin',
        'App 启动时调用 ChannelIO.boot(...)',
        '注册 FCM / APNs 令牌以接收推送',
      ] },
      { no: '06', title: 'Team Chat、弹窗、营销(可选)', tag: 'FEATURES', desc: '启用附加功能。', details: [
        'Team Chat:可当作内部通讯使用',
        '营销弹窗:在特定页面触发引导消息',
        'Support Bot:基于关键词的自动回复(可接 LLM)',
        '邮件 Campaign、SMS 发送(Pro 起)',
      ] },
      { no: '07', title: 'Webhook 与 API 对接', tag: 'WEBHOOK', desc: '连接 CRM、Slack 与业务工具。', details: [
        '在 Integration > Webhook 注册端点',
        '事件:new_user_chat、user_chat_assigned、review_submitted 等',
        '使用 X-Channel-Signature 头部进行签名校验',
        'Slack、Jira、Zapier 提供内置集成',
        'Open API(REST):自动化查询会话与管理坐席',
      ] },
      { no: '08', title: '通知、GDPR、监控', tag: 'OPS', desc: '运营层面的设置。', details: [
        '为每位坐席配置浏览器、邮件、移动端通知',
        '在隐私政策中声明 ChannelTalk(DataWall)',
        '可选:自动清理 30 天以上未登录用户',
        '开展满意度调查并关注 CSAT',
        '使用月度统计与报表看板',
      ] },
    ],
    pitfalls: [
      { title: '未启用 memberHash', desc: '仅使用 memberId 而不传 memberHash,可被他人冒充,务必在服务端生成 HMAC。' },
      { title: 'SPA 忘记 updateUser', desc: 'Next.js/React 路由切换时 ChannelTalk 仍保持状态,登录/登出时若不调用 boot/shutdown,会保留上一位用户。' },
      { title: '隐私政策未更新', desc: 'ChannelTalk 属于处理个人信息的第三方,政策中未声明将引发合规问题。' },
      { title: '未注册推送令牌', desc: 'App 中若没有把 FCM/APNs 令牌注册到 ChannelTalk,无法收到坐席回复的推送。' },
      { title: '免费套餐坐席上限', desc: '超出 3 人不会自动扣费,而是限制功能,需要时请立即升级 Pro。' },
    ],
    resources: [
      { title: 'ChannelTalk', desc: '创建频道与价格', href: 'https://channel.io' },
      { title: '开发者文档', desc: '安装、API、SDK', href: 'https://developers.channel.io' },
      { title: 'Web SDK 指南', desc: 'JavaScript 安装', href: 'https://developers.channel.io/docs/web-channelio' },
      { title: 'Mobile SDK', desc: 'iOS、Android、RN', href: 'https://developers.channel.io/docs/mobile-channelio' },
      { title: 'Open API', desc: 'REST 与自动化', href: 'https://developers.channel.io/reference' },
      { title: 'Webhook', desc: '接收事件', href: 'https://developers.channel.io/docs/webhook' },
    ],
  },
}

const OVERVIEW_ICONS = [iconUser, iconUsers, iconShield, iconKey]
const STEP_ICONS = [iconUser, iconUsers, iconZap, iconKey, iconZap, iconMessageCircle, iconSettings, iconBell]

export default function ChannelTalkGuidePage() {
  const locale = useLocale() as Locale
  const d = DATA[locale] ?? DATA.ko
  return (
    <GuideTemplate
      badge={{ icon: badgeIcon, text: 'CHANNEL TALK' }}
      titleTop={d.titleTop}
      titleBottom={d.titleBottom}
      description={d.description}
      primaryCta={{ label: d.primaryCtaLabel, href: 'https://channel.io' }}
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
