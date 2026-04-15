'use client'

import { useLocale } from 'next-intl'
import { GuideTemplate } from '@/components/GuideTemplate'
import { CreditCard, User, FileText, Settings, Key, Shield, Store, Zap } from 'lucide-react'

type Locale = 'ko' | 'en' | 'ja' | 'zh'

const badgeIcon = <CreditCard className="h-3.5 w-3.5 text-white/80" />
const iconFileText = <FileText className="h-5 w-5" />
const iconStore = <Store className="h-5 w-5" />
const iconSettings = <Settings className="h-5 w-5" />
const iconShield = <Shield className="h-5 w-5" />
const iconUser = <User className="h-5 w-5" />
const iconKey = <Key className="h-5 w-5" />
const iconZap = <Zap className="h-5 w-5" />

type Data = {
  titleTop: string
  titleBottom: string
  description: string
  primaryCtaLabel: string
  badgeText: string
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
    titleTop: '포트원',
    titleBottom: '통합 PG 연동',
    badgeText: 'PORTONE (구 아임포트)',
    description: `국내 여러 PG(토스·KG이니시스·NICE·카카오페이·네이버페이 등)를 하나의 API로 연결해주는 포트원 연동 가이드입니다.\n계정 가입부터 PG사 계약, 채널 등록, V2 API 호출까지 안내합니다.`,
    primaryCtaLabel: '포트원 콘솔 열기',
    stats: [
      { label: '수수료', value: '무료 (PG 수수료만)' },
      { label: '지원 PG', value: '15개 이상' },
      { label: '필요 서류', value: '사업자등록증·PG 계약' },
    ],
    overviewTitle: '시작 전에 확인하세요',
    overviewDesc: '포트원(구 아임포트)은 여러 PG를 하나의 API로 추상화해주는 서비스입니다. 포트원 자체는 무료지만, 각 PG와 별도 계약이 필요합니다. 신규 프로젝트는 V2(GraphQL/REST)를 권장하며, 기존 V1도 계속 지원됩니다.',
    overviewItems: [
      { title: '사업자등록 완료', desc: '개인·법인 모두 가능.' },
      { title: 'PG 선택', desc: '토스·KG이니시스·NICE 등.' },
      { title: 'V2 vs V1 결정', desc: '신규는 V2 권장.' },
      { title: '웹훅 수신 서버', desc: 'HTTPS 엔드포인트 필요.' },
    ],
    steps: [
      { no: '01', title: '포트원 계정 생성', tag: 'SIGNUP', desc: 'admin.portone.io에서 가입.', details: [
        '이메일 가입 또는 카카오 로그인',
        '사업자 정보 입력 (사업자번호·대표자명·주소)',
        '계약 담당자 정보 등록',
        '심사 없이 즉시 테스트 환경 사용 가능',
      ] },
      { no: '02', title: 'PG사 선택 & 계약', tag: 'PG', desc: '실결제를 위한 PG사 계약. 포트원 콘솔에서 신청 가능.', details: [
        '지원 PG: 토스·KG이니시스·NICE·카카오페이·네이버페이·페이팔 등',
        '포트원 콘솔 > PG 신청에서 간편 접수',
        'PG사 심사 2–5영업일 소요',
        '수수료는 PG별 상이 (일반 카드 2.5~3.5%)',
        '정산 주기 선택 (D+1 / D+3 등)',
      ] },
      { no: '03', title: '테스트 스토어 설정', tag: 'TEST', desc: '실계약 전에 테스트로 연동을 완성합니다.', details: [
        '테스트 상점 기본 제공 (KCP·이니시스·토스 테스트 키)',
        '테스트 카드번호 문서 제공 (docs.portone.io)',
        '실 계좌이체·가상계좌·휴대폰 결제 등 방식별 테스트',
        '프론트·서버 플로우 전체를 테스트 환경에서 완성',
      ] },
      { no: '04', title: 'V2 API 키 발급', tag: 'KEYS', desc: '신규 프로젝트는 V2를 사용하세요.', details: [
        'Store ID: 상점 식별자 (공개 가능)',
        'API Secret: 서버 전용 · 절대 노출 금지',
        '.env로 분리 저장',
        'V2는 GraphQL + REST 모두 제공',
        '채널 키(Channel Key): PG·결제수단 조합별 식별',
      ] },
      { no: '05', title: '결제 채널 등록', tag: 'CHANNEL', desc: '실결제로 전환할 때 실 채널 등록.', details: [
        '콘솔 > 결제 연동 > 채널 추가',
        'PG사·MID(상점 ID)·PG 제공 키 입력',
        '카드·계좌이체·간편결제별로 각각 채널 등록',
        '라이브·테스트 채널을 분리',
        '채널 별칭으로 프론트에서 선택 가능',
      ] },
      { no: '06', title: '결제 요청 구현', tag: 'CLIENT', desc: '프론트엔드에서 결제창 호출.', details: [
        '브라우저 SDK: @portone/browser-sdk',
        'PortOne.requestPayment({ storeId, channelKey, paymentId, ... })',
        'paymentId: 주문 고유 ID (내부에서 생성, UUID 권장)',
        '결제 완료 시 프론트로 결과 콜백',
        'React Native: @portone/react-native-sdk',
      ] },
      { no: '07', title: '서버 검증 & 주문 확정', tag: 'VERIFY', desc: '프론트 결과만 믿지 말고 서버에서 재확인.', details: [
        '프론트 결제 완료 → 서버에 paymentId 전송',
        '서버에서 포트원 API로 결제 정보 조회',
        'amount·currency·paymentStatus 검증',
        '예상 금액과 일치하면 주문 확정',
        '금액 조작 시도를 막는 핵심 단계',
      ] },
      { no: '08', title: '웹훅 등록', tag: 'WEBHOOK', desc: '결제 상태 변경을 즉시 수신.', details: [
        '콘솔 > 웹훅 > 엔드포인트 추가',
        'HTTPS URL 필수, 3초 이내 200 응답',
        '이벤트: Paid · Cancelled · Failed · VirtualAccountIssued',
        'X-PortOne-Signature 서명 검증 필수',
        '취소·환불 흐름은 웹훅 기반으로 처리 권장',
      ] },
    ],
    pitfalls: [
      { title: '프론트 결제 결과만 신뢰', desc: '브라우저 콘솔에서 결과를 조작할 수 있으니, 반드시 서버에서 포트원 API로 재조회해 금액을 검증하세요.' },
      { title: 'API Secret 노출', desc: '.env 대신 하드코딩했다가 GitHub에 올리는 사고가 자주 있습니다. 노출 시 즉시 재발급.' },
      { title: '테스트·라이브 채널 혼용', desc: '테스트 키로 라이브 채널을 호출하면 실패, 반대도 마찬가지. 환경변수로 구분.' },
      { title: '웹훅 서명 검증 생략', desc: '누구나 웹훅 엔드포인트에 POST를 쏠 수 있습니다. 서명 검증 없이 상태 업데이트하면 주문 위조 가능.' },
      { title: 'V1 문서만 보고 개발', desc: '인터넷에 있는 자료 중 다수가 V1 기준입니다. 신규 프로젝트는 V2 문서를 우선 보세요.' },
    ],
    resources: [
      { title: '포트원 콘솔', desc: '채널·키·웹훅 관리', href: 'https://admin.portone.io' },
      { title: 'V2 문서', desc: '신규 개발용', href: 'https://developers.portone.io' },
      { title: 'V1 문서 (레거시)', desc: '기존 연동 유지', href: 'https://portone.gitbook.io/v1-docs/' },
      { title: 'Browser SDK', desc: '@portone/browser-sdk', href: 'https://developers.portone.io/sdk/ko/v2-sdk/javascript-sdk-old/readme' },
      { title: 'React Native SDK', desc: '앱 결제 연동', href: 'https://github.com/portone-io/portone-react-native-sdk' },
      { title: '웹훅 가이드', desc: '서명 검증 예제', href: 'https://developers.portone.io/docs/ko/v2-payment/webhook' },
    ],
  },
  en: {
    titleTop: 'PortOne',
    titleBottom: 'Unified PG Integration',
    badgeText: 'PORTONE (formerly Iamport)',
    description: `PortOne connects multiple Korean PGs (Toss, KG Inicis, NICE, Kakao Pay, Naver Pay, and more) through a single API.\nThis guide covers signup, PG contracts, channel registration, and V2 API calls.`,
    primaryCtaLabel: 'Open PortOne console',
    stats: [
      { label: 'Platform fee', value: 'Free (PG fees only)' },
      { label: 'Supported PGs', value: '15+' },
      { label: 'Required docs', value: 'Business registration · PG contract' },
    ],
    overviewTitle: 'Check before you start',
    overviewDesc: 'PortOne (formerly Iamport) abstracts multiple PGs behind one API. PortOne itself is free, but you need a separate contract with each PG. For new projects, use V2 (GraphQL/REST); V1 is still supported.',
    overviewItems: [
      { title: 'Business registration', desc: 'Both individuals and corporations qualify.' },
      { title: 'Pick a PG', desc: 'Toss, KG Inicis, NICE, and more.' },
      { title: 'V2 vs V1', desc: 'V2 recommended for new projects.' },
      { title: 'Webhook server', desc: 'Requires an HTTPS endpoint.' },
    ],
    steps: [
      { no: '01', title: 'Create a PortOne account', tag: 'SIGNUP', desc: 'Sign up at admin.portone.io.', details: [
        'Sign up with email or Kakao login',
        'Enter business info (registration number, representative, address)',
        'Register a contract contact',
        'Test environment is available immediately without review',
      ] },
      { no: '02', title: 'Choose a PG & sign a contract', tag: 'PG', desc: 'Sign a PG contract to enable live payments. You can apply from the PortOne console.', details: [
        'Supported PGs: Toss, KG Inicis, NICE, Kakao Pay, Naver Pay, PayPal, and more',
        'Apply easily via PortOne console > PG application',
        'PG review takes 2–5 business days',
        'Fees vary by PG (regular cards around 2.5–3.5%)',
        'Choose a settlement cycle (D+1, D+3, etc.)',
      ] },
      { no: '03', title: 'Set up a test store', tag: 'TEST', desc: 'Finish the integration in test mode before signing.', details: [
        'Test store is provided by default (KCP, Inicis, Toss test keys)',
        'Test card numbers are documented (docs.portone.io)',
        'Test bank transfer, virtual account, mobile payment, and other methods',
        'Complete the full frontend and server flow in the test environment',
      ] },
      { no: '04', title: 'Issue V2 API keys', tag: 'KEYS', desc: 'Use V2 for new projects.', details: [
        'Store ID: store identifier (safe to expose)',
        'API Secret: server-only — never expose',
        'Keep it in .env',
        'V2 offers both GraphQL and REST',
        'Channel Key: identifies a PG and payment-method combination',
      ] },
      { no: '05', title: 'Register payment channels', tag: 'CHANNEL', desc: 'Register live channels when switching to real payments.', details: [
        'Console > Payment integration > Add channel',
        'Enter the PG, MID (store ID), and PG-issued keys',
        'Register separate channels for card, bank transfer, and easy pay',
        'Keep live and test channels separate',
        'Channel aliases let the frontend select them',
      ] },
      { no: '06', title: 'Implement the payment request', tag: 'CLIENT', desc: 'Open the payment window from the frontend.', details: [
        'Browser SDK: @portone/browser-sdk',
        'PortOne.requestPayment({ storeId, channelKey, paymentId, ... })',
        'paymentId: unique order ID (generate internally, UUID recommended)',
        'Result is returned to the frontend on completion',
        'React Native: @portone/react-native-sdk',
      ] },
      { no: '07', title: 'Server verification & order confirmation', tag: 'VERIFY', desc: 'Never trust the frontend alone — re-verify on the server.', details: [
        'Frontend finishes payment → sends paymentId to the server',
        'Server queries the PortOne API for payment details',
        'Verify amount, currency, and paymentStatus',
        'Confirm the order only if amounts match',
        'This is the key step that blocks amount tampering',
      ] },
      { no: '08', title: 'Register webhooks', tag: 'WEBHOOK', desc: 'Receive payment state changes instantly.', details: [
        'Console > Webhooks > Add endpoint',
        'HTTPS URL required; respond with 200 within 3 seconds',
        'Events: Paid, Cancelled, Failed, VirtualAccountIssued',
        'X-PortOne-Signature verification is required',
        'Handle cancellation and refund flows via webhooks',
      ] },
    ],
    pitfalls: [
      { title: 'Trusting only the frontend result', desc: 'Results can be manipulated from the browser console. Always re-query the PortOne API on the server and verify amounts.' },
      { title: 'Leaked API Secret', desc: 'Hardcoding secrets and pushing them to GitHub happens often. Rotate immediately if exposed.' },
      { title: 'Mixing test and live channels', desc: 'Test keys fail against live channels and vice versa. Separate them with environment variables.' },
      { title: 'Skipping webhook signature verification', desc: 'Anyone can POST to your webhook endpoint. Updating state without verification allows order forgery.' },
      { title: 'Building from V1 docs only', desc: 'Most online material targets V1. For new projects, start with the V2 docs.' },
    ],
    resources: [
      { title: 'PortOne console', desc: 'Manage channels, keys, webhooks', href: 'https://admin.portone.io' },
      { title: 'V2 docs', desc: 'For new development', href: 'https://developers.portone.io' },
      { title: 'V1 docs (legacy)', desc: 'For existing integrations', href: 'https://portone.gitbook.io/v1-docs/' },
      { title: 'Browser SDK', desc: '@portone/browser-sdk', href: 'https://developers.portone.io/sdk/ko/v2-sdk/javascript-sdk-old/readme' },
      { title: 'React Native SDK', desc: 'App payment integration', href: 'https://github.com/portone-io/portone-react-native-sdk' },
      { title: 'Webhook guide', desc: 'Signature verification example', href: 'https://developers.portone.io/docs/ko/v2-payment/webhook' },
    ],
  },
  ja: {
    titleTop: 'PortOne',
    titleBottom: '統合PG連携',
    badgeText: 'PORTONE (旧 Iamport)',
    description: `韓国国内の複数PG(Toss・KG Inicis・NICE・Kakao Pay・Naver Payなど)を1つのAPIでつなぐPortOne連携ガイドです。\nアカウント作成からPG契約、チャンネル登録、V2 API呼び出しまでご案内します。`,
    primaryCtaLabel: 'PortOneコンソールを開く',
    stats: [
      { label: '利用料', value: '無料(PG手数料のみ)' },
      { label: '対応PG', value: '15以上' },
      { label: '必要書類', value: '事業者登録証・PG契約' },
    ],
    overviewTitle: '始める前にご確認ください',
    overviewDesc: 'PortOne(旧 Iamport)は複数のPGを1つのAPIで抽象化するサービスです。PortOne自体は無料ですが、各PGとの個別契約が必要です。新規プロジェクトはV2(GraphQL/REST)を推奨し、V1も継続サポートされています。',
    overviewItems: [
      { title: '事業者登録が完了', desc: '個人・法人いずれも可。' },
      { title: 'PGを選択', desc: 'Toss・KG Inicis・NICEなど。' },
      { title: 'V2 vs V1の判断', desc: '新規はV2推奨。' },
      { title: 'Webhook受信サーバー', desc: 'HTTPSエンドポイントが必要。' },
    ],
    steps: [
      { no: '01', title: 'PortOneアカウント作成', tag: 'SIGNUP', desc: 'admin.portone.ioで登録します。', details: [
        'メール登録またはKakaoログイン',
        '事業者情報を入力(事業者番号・代表者名・住所)',
        '契約担当者情報を登録',
        '審査なしで即テスト環境を利用可能',
      ] },
      { no: '02', title: 'PGの選択 & 契約', tag: 'PG', desc: '実決済のためのPG契約。PortOneコンソールから申請できます。', details: [
        '対応PG: Toss・KG Inicis・NICE・Kakao Pay・Naver Pay・PayPalなど',
        'PortOneコンソール > PG申請から手軽に提出',
        'PG審査は2–5営業日',
        '手数料はPGにより異なる(一般カードで2.5–3.5%)',
        '精算サイクルを選択(D+1 / D+3など)',
      ] },
      { no: '03', title: 'テストストアの設定', tag: 'TEST', desc: '本契約前にテストで連携を完成させます。', details: [
        'テスト店舗が標準で提供される(KCP・Inicis・Tossのテストキー)',
        'テストカード番号のドキュメントあり(docs.portone.io)',
        '実口座振替・仮想口座・携帯電話決済などの方式別テスト',
        'フロントとサーバーのフロー全体をテスト環境で完成させる',
      ] },
      { no: '04', title: 'V2 APIキー発行', tag: 'KEYS', desc: '新規プロジェクトはV2を使ってください。', details: [
        'Store ID: 店舗識別子(公開OK)',
        'API Secret: サーバー専用・絶対に公開しない',
        '.envに分離して保存',
        'V2はGraphQL + RESTの両方を提供',
        'Channel Key: PGと決済手段の組み合わせを識別',
      ] },
      { no: '05', title: '決済チャンネル登録', tag: 'CHANNEL', desc: '実決済への切り替え時に実チャンネルを登録します。', details: [
        'コンソール > 決済連携 > チャンネル追加',
        'PG・MID(店舗ID)・PG発行キーを入力',
        'カード・口座振替・簡単決済ごとにチャンネルを登録',
        'ライブとテストのチャンネルを分離',
        'チャンネルエイリアスでフロントから選択可能',
      ] },
      { no: '06', title: '決済リクエストの実装', tag: 'CLIENT', desc: 'フロントエンドから決済ウィンドウを呼び出します。', details: [
        'Browser SDK: @portone/browser-sdk',
        'PortOne.requestPayment({ storeId, channelKey, paymentId, ... })',
        'paymentId: 注文の固有ID(内部で生成、UUID推奨)',
        '決済完了時にフロントへ結果コールバック',
        'React Native: @portone/react-native-sdk',
      ] },
      { no: '07', title: 'サーバー検証 & 注文確定', tag: 'VERIFY', desc: 'フロントの結果だけを信じず、サーバーで再確認します。', details: [
        'フロント決済完了 → サーバーにpaymentIdを送信',
        'サーバーからPortOne APIで決済情報を取得',
        'amount・currency・paymentStatusを検証',
        '想定金額と一致すれば注文を確定',
        '金額改ざんを防ぐ核となる工程',
      ] },
      { no: '08', title: 'Webhook登録', tag: 'WEBHOOK', desc: '決済ステータスの変化を即座に受信します。', details: [
        'コンソール > Webhook > エンドポイント追加',
        'HTTPS URL必須、3秒以内に200応答',
        'イベント: Paid・Cancelled・Failed・VirtualAccountIssued',
        'X-PortOne-Signatureの署名検証が必須',
        '取消・返金フローはWebhookベースで処理を推奨',
      ] },
    ],
    pitfalls: [
      { title: 'フロントの結果のみ信頼', desc: 'ブラウザコンソールで結果を改ざんできるので、必ずサーバーからPortOne APIで再照会して金額を検証してください。' },
      { title: 'API Secretの露出', desc: '.env代わりにハードコードしてGitHubへ上げる事故が多発します。露出時は即再発行。' },
      { title: 'テストとライブのチャンネル混在', desc: 'テストキーでライブチャンネルを呼ぶと失敗、逆も同じ。環境変数で区別してください。' },
      { title: 'Webhook署名検証の省略', desc: '誰でもWebhookエンドポイントへPOSTできます。署名検証なしに状態を更新すると注文偽造が可能です。' },
      { title: 'V1文書のみで開発', desc: 'ネット上の情報は多くがV1基準です。新規プロジェクトはV2文書を優先してください。' },
    ],
    resources: [
      { title: 'PortOneコンソール', desc: 'チャンネル・キー・Webhook管理', href: 'https://admin.portone.io' },
      { title: 'V2ドキュメント', desc: '新規開発向け', href: 'https://developers.portone.io' },
      { title: 'V1ドキュメント(レガシー)', desc: '既存連携の維持', href: 'https://portone.gitbook.io/v1-docs/' },
      { title: 'Browser SDK', desc: '@portone/browser-sdk', href: 'https://developers.portone.io/sdk/ko/v2-sdk/javascript-sdk-old/readme' },
      { title: 'React Native SDK', desc: 'アプリ決済連携', href: 'https://github.com/portone-io/portone-react-native-sdk' },
      { title: 'Webhookガイド', desc: '署名検証のサンプル', href: 'https://developers.portone.io/docs/ko/v2-payment/webhook' },
    ],
  },
  zh: {
    titleTop: 'PortOne',
    titleBottom: '统一 PG 接入',
    badgeText: 'PORTONE (原 Iamport)',
    description: `PortOne 通过一套 API 对接韩国多个 PG(Toss、KG Inicis、NICE、Kakao Pay、Naver Pay 等)。\n本指南覆盖注册、PG 签约、渠道登记与 V2 API 调用。`,
    primaryCtaLabel: '打开 PortOne 控制台',
    stats: [
      { label: '平台费用', value: '免费(仅 PG 手续费)' },
      { label: '支持 PG', value: '15+' },
      { label: '所需材料', value: '营业执照、PG 合同' },
    ],
    overviewTitle: '开始前请确认',
    overviewDesc: 'PortOne(原 Iamport)用一套 API 抽象了多家 PG。PortOne 自身免费,但需分别与各 PG 签约。新项目建议使用 V2(GraphQL/REST),V1 也仍在支持。',
    overviewItems: [
      { title: '已完成事业者登记', desc: '个人与法人均可。' },
      { title: '选择 PG', desc: 'Toss、KG Inicis、NICE 等。' },
      { title: 'V2 还是 V1', desc: '新项目建议 V2。' },
      { title: 'Webhook 接收服务器', desc: '需 HTTPS 接口。' },
    ],
    steps: [
      { no: '01', title: '注册 PortOne 账号', tag: 'SIGNUP', desc: '在 admin.portone.io 注册。', details: [
        '邮箱注册或 Kakao 登录',
        '填写事业者信息(营业号、法人、地址)',
        '登记合同联系人',
        '无需审核即可立即使用测试环境',
      ] },
      { no: '02', title: '选择 PG 并签约', tag: 'PG', desc: '正式收款需要 PG 合同,可在 PortOne 控制台申请。', details: [
        '支持 PG:Toss、KG Inicis、NICE、Kakao Pay、Naver Pay、PayPal 等',
        '在 PortOne 控制台 > PG 申请便捷提交',
        'PG 审核 2–5 个工作日',
        '费率因 PG 而异(普通卡约 2.5–3.5%)',
        '结算周期可选 D+1 / D+3 等',
      ] },
      { no: '03', title: '配置测试商户', tag: 'TEST', desc: '正式签约前先在测试环境跑通接入。', details: [
        '默认提供测试商户(KCP、Inicis、Toss 测试密钥)',
        '测试卡号在文档中公开(docs.portone.io)',
        '可测试账户转账、虚拟账户、手机支付等方式',
        '在测试环境完整跑通前端与服务端流程',
      ] },
      { no: '04', title: '签发 V2 API 密钥', tag: 'KEYS', desc: '新项目请使用 V2。', details: [
        'Store ID:商户标识(可公开)',
        'API Secret:仅服务端使用,严禁泄露',
        '放入 .env 隔离保存',
        'V2 同时提供 GraphQL 与 REST',
        'Channel Key:区分 PG 与支付方式的组合',
      ] },
      { no: '05', title: '注册支付渠道', tag: 'CHANNEL', desc: '切换到正式收款时登记真实渠道。', details: [
        '控制台 > 支付接入 > 添加渠道',
        '填写 PG、MID(商户号)、PG 颁发的密钥',
        '按卡、账户转账、简易支付分别登记渠道',
        '区分 Live 与 Test 渠道',
        '通过渠道别名让前端选择',
      ] },
      { no: '06', title: '实现支付请求', tag: 'CLIENT', desc: '从前端调起支付窗口。', details: [
        'Browser SDK:@portone/browser-sdk',
        'PortOne.requestPayment({ storeId, channelKey, paymentId, ... })',
        'paymentId:订单唯一 ID(内部生成,建议 UUID)',
        '支付完成后回调到前端',
        'React Native:@portone/react-native-sdk',
      ] },
      { no: '07', title: '服务端校验与订单确认', tag: 'VERIFY', desc: '不能只信前端,要在服务端复核。', details: [
        '前端支付完成 → 向服务端发送 paymentId',
        '服务端通过 PortOne API 查询支付信息',
        '校验 amount、currency、paymentStatus',
        '金额与预期一致才确认订单',
        '阻止金额篡改的关键步骤',
      ] },
      { no: '08', title: '注册 Webhook', tag: 'WEBHOOK', desc: '即时接收支付状态变化。', details: [
        '控制台 > Webhook > 添加端点',
        '必须为 HTTPS URL,3 秒内返回 200',
        '事件:Paid、Cancelled、Failed、VirtualAccountIssued',
        '必须校验 X-PortOne-Signature',
        '取消和退款流程建议基于 Webhook 处理',
      ] },
    ],
    pitfalls: [
      { title: '只信前端支付结果', desc: '浏览器控制台可以篡改结果,务必在服务端通过 PortOne API 再次查询并校验金额。' },
      { title: 'API Secret 泄露', desc: '常见事故是硬编码后推到 GitHub,一旦泄露请立即重新签发。' },
      { title: '混用测试与正式渠道', desc: '测试密钥调用正式渠道会失败,反之亦然,请用环境变量区分。' },
      { title: '跳过 Webhook 签名校验', desc: '任何人都能向 Webhook 端点 POST,未校验签名直接更新状态可能被伪造订单。' },
      { title: '只看 V1 文档开发', desc: '网上资料多以 V1 为主,新项目请优先查看 V2 文档。' },
    ],
    resources: [
      { title: 'PortOne 控制台', desc: '渠道、密钥、Webhook 管理', href: 'https://admin.portone.io' },
      { title: 'V2 文档', desc: '新项目使用', href: 'https://developers.portone.io' },
      { title: 'V1 文档(历史版本)', desc: '用于维护既有接入', href: 'https://portone.gitbook.io/v1-docs/' },
      { title: 'Browser SDK', desc: '@portone/browser-sdk', href: 'https://developers.portone.io/sdk/ko/v2-sdk/javascript-sdk-old/readme' },
      { title: 'React Native SDK', desc: 'App 支付接入', href: 'https://github.com/portone-io/portone-react-native-sdk' },
      { title: 'Webhook 指南', desc: '签名校验示例', href: 'https://developers.portone.io/docs/ko/v2-payment/webhook' },
    ],
  },
}

const OVERVIEW_ICONS = [iconFileText, iconStore, iconSettings, iconShield]
const STEP_ICONS = [iconUser, iconStore, iconSettings, iconKey, iconSettings, iconZap, iconShield, iconSettings]

export default function PortoneGuidePage() {
  const locale = useLocale() as Locale
  const d = DATA[locale] ?? DATA.ko
  return (
    <GuideTemplate
      badge={{ icon: badgeIcon, text: d.badgeText }}
      titleTop={d.titleTop}
      titleBottom={d.titleBottom}
      description={d.description}
      primaryCta={{ label: d.primaryCtaLabel, href: 'https://admin.portone.io' }}
      heroImage="/cb.png"
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
