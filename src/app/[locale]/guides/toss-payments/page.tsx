'use client'

import { useLocale } from 'next-intl'
import { GuideTemplate } from '@/components/GuideTemplate'
import { CreditCard, FileText, Settings, Key, Shield, Store, Receipt } from 'lucide-react'

type Locale = 'ko' | 'en' | 'ja' | 'zh'

const badgeIcon = <CreditCard className="h-3.5 w-3.5 text-white/80" />
const iconFileText = <FileText className="h-5 w-5" />
const iconStore = <Store className="h-5 w-5" />
const iconReceipt = <Receipt className="h-5 w-5" />
const iconShield = <Shield className="h-5 w-5" />
const iconKey = <Key className="h-5 w-5" />
const iconSettings = <Settings className="h-5 w-5" />

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
    titleTop: '토스페이먼츠',
    titleBottom: '가맹점 계약 & 연동',
    description: `앱·웹에서 결제를 받으려면 PG사 가맹점 계약이 필요합니다.\n토스페이먼츠 신청부터 심사, 테스트 키 → 실서비스 키 전환까지 안내합니다.`,
    primaryCtaLabel: '토스페이먼츠 신청',
    stats: [
      { label: '가맹점 계약', value: '무료' },
      { label: '심사 기간', value: '2–5영업일' },
      { label: '필요 서류', value: '사업자등록증·통장' },
    ],
    overviewTitle: '시작 전에 확인하세요',
    overviewDesc: 'PG 가맹점 계약은 사업자등록이 전제입니다. 개인 사업자도 가능하지만 업종에 따라 추가 서류(통신판매업 신고증·의료·금융 관련 인허가)가 필요할 수 있습니다. 테스트 키로 먼저 연동을 끝내고, 실서비스 키는 가맹점 심사 완료 후 발급됩니다.',
    overviewItems: [
      { title: '사업자등록 필수', desc: '개인·법인 모두 가능.' },
      { title: '통신판매업 신고', desc: '일반 판매업은 필수 (서울 구청).' },
      { title: '정산 통장', desc: '사업자명과 일치한 계좌 준비.' },
      { title: '서비스 URL/앱', desc: '심사 대상이 실재해야 함.' },
    ],
    steps: [
      { no: '01', title: '테스트 키로 먼저 연동', tag: 'DEV FIRST', desc: '계약 전에 테스트 키로 결제 플로우를 완성해두면 출시 일정이 당겨집니다.', details: [
        'docs.tosspayments.com에 바로 공개되어 있는 테스트 키 사용',
        '결제 위젯 / 결제 창 / 브랜드페이 등 방식 선택',
        '성공/실패/취소 콜백 URL 구현',
        '국내 카드·해외 카드·계좌이체·간편결제 테스트 가능',
      ] },
      { no: '02', title: '가맹점 신청서 작성', tag: 'APPLY', desc: 'tosspayments.com에서 가맹점 계약 신청.', details: [
        '상호·대표자명·사업자등록번호·업종',
        '판매 품목 및 예상 월 거래액',
        '서비스 URL (출시 전이면 "준비 중" + 스크린샷 별첨 가능)',
        '정산 계좌 정보 (사업자명 일치)',
      ] },
      { no: '03', title: '필요 서류 업로드', tag: 'DOCS', desc: '기본 + 업종별 추가 서류.', details: [
        '기본: 사업자등록증·대표자 신분증·통장 사본',
        '일반 판매: 통신판매업 신고증',
        '의료·의약품: 관련 허가증 / 면허증',
        '음식점: 영업신고증',
        '서비스 스크린샷 2–3장 (결제 흐름 확인용)',
      ] },
      { no: '04', title: '수수료 협의', tag: 'FEE', desc: '카드·간편결제별 수수료율을 계약서에서 확인.', details: [
        '일반 카드: 2.5–3.5% 수준 (거래액·업종별 상이)',
        '간편결제(카카오페이·네이버페이 등): 추가 수수료',
        '정산 주기: D+1 (다음 영업일) · D+3 · D+7 중 선택',
        '월 거래액이 크면 수수료 인하 협상 가능',
      ] },
      { no: '05', title: '심사 & 승인', tag: 'REVIEW', desc: '영업일 기준 2~5일 소요.', details: [
        '서류 보완 요청은 이메일로 발송',
        '일부 업종(보험·투자·게임·주류)은 추가 심사',
        '승인 시 가맹점 관리자 계정 발급',
        '계약서 전자서명(카카오 인증 등)으로 체결',
      ] },
      { no: '06', title: '실서비스 키 발급', tag: 'LIVE KEYS', desc: '승인 완료 후 실제 결제가 가능한 키를 발급받습니다.', details: [
        '상점 관리자 페이지 > API 키',
        '클라이언트 키: 프론트 결제창 호출용 (공개 OK)',
        '시크릿 키: 서버 승인·취소 호출용 (절대 노출 금지)',
        '.env로 분리하고 서버에서만 사용',
        '테스트 키와 실서비스 키는 prefix로 구분됨 (test_* / live_*)',
      ] },
      { no: '07', title: '웹훅 (Webhook) 등록', tag: 'WEBHOOK', desc: '결제 상태 변경을 서버에서 즉시 수신.', details: [
        '상점 관리자 > 개발자 센터 > 웹훅',
        '이벤트: PAYMENT_STATUS_CHANGED, CANCEL_STATUS_CHANGED 등',
        '엔드포인트 URL 등록 (HTTPS 필수)',
        '서명 검증(Signature) 로직 구현 — 위조 방지',
      ] },
      { no: '08', title: '정산·세금계산서 자동화', tag: 'SETTLEMENT', desc: '정산 내역과 세금계산서 확인·다운로드.', details: [
        '정산 내역: 상점 관리자 페이지에서 일/월별 확인',
        '세금계산서는 토스페이먼츠에서 자동 발행',
        '현금영수증은 결제 승인 시 자동 처리 가능',
        '엑셀 다운로드 또는 API로 정산 자동화',
      ] },
    ],
    pitfalls: [
      { title: '서비스 미완성 상태로 심사 요청', desc: '최소한 결제 플로우 스크린샷이나 테스트 URL이 있어야 통과됩니다. "준비 중"만으로는 반려되기 쉬워요.' },
      { title: '정산 계좌 명의 불일치', desc: '사업자등록증의 상호·대표자명과 통장 명의가 달라 반려되는 경우가 많습니다.' },
      { title: '시크릿 키 프론트 노출', desc: '결제 승인·취소 API는 반드시 서버에서 호출해야 합니다. 프론트에서 직접 호출하면 모든 거래가 조작 가능.' },
      { title: '웹훅 서명 검증 누락', desc: '웹훅 엔드포인트에 누구나 POST를 보낼 수 있습니다. 서명 검증 없이 상태를 믿으면 결제 우회 취약점.' },
      { title: '인앱결제 정책', desc: 'iOS·Android 앱에서 디지털 상품 결제는 각 스토어의 인앱결제만 허용. 외부 PG 사용 시 앱 거부 위험.' },
    ],
    resources: [
      { title: '토스페이먼츠 메인', desc: '가맹점 신청', href: 'https://www.tosspayments.com' },
      { title: '개발자 문서', desc: '연동 가이드·API 레퍼런스', href: 'https://docs.tosspayments.com' },
      { title: '결제 위젯 가이드', desc: '가장 빠른 연동 방법', href: 'https://docs.tosspayments.com/guides/payment/integration' },
      { title: '웹훅 가이드', desc: '이벤트·서명 검증', href: 'https://docs.tosspayments.com/guides/webhook' },
      { title: '상점 관리자 로그인', desc: 'API 키·정산 관리', href: 'https://app.tosspayments.com' },
      { title: '브랜드페이', desc: '원클릭 결제 (간편결제)', href: 'https://docs.tosspayments.com/guides/brandpay/integration' },
    ],
  },
  en: {
    titleTop: 'Toss Payments',
    titleBottom: 'Merchant Contract & Integration',
    description: `Accepting payments in apps and on the web requires a PG merchant contract.\nThis guide covers the Toss Payments application, review, and the transition from test keys to live keys.`,
    primaryCtaLabel: 'Apply to Toss Payments',
    stats: [
      { label: 'Merchant contract', value: 'Free' },
      { label: 'Review time', value: '2–5 business days' },
      { label: 'Required docs', value: 'Business registration · bank account' },
    ],
    overviewTitle: 'Check before you start',
    overviewDesc: 'A PG merchant contract requires a business registration. Sole proprietors qualify, but depending on your industry you may need extra documents (mail-order filing, medical or financial licenses). Finish the integration with test keys first — live keys are issued after merchant review.',
    overviewItems: [
      { title: 'Business registration required', desc: 'Both individuals and corporations qualify.' },
      { title: 'Mail-order filing', desc: 'Required for general retail (district office).' },
      { title: 'Settlement account', desc: 'Account name must match the business.' },
      { title: 'Service URL / app', desc: 'The product under review must exist.' },
    ],
    steps: [
      { no: '01', title: 'Integrate with test keys first', tag: 'DEV FIRST', desc: 'Completing the payment flow on test keys before signing speeds up your launch.', details: [
        'Use the test keys openly published on docs.tosspayments.com',
        'Choose a method: Payment Widget, Payment Window, or BrandPay',
        'Implement success, failure, and cancel callback URLs',
        'Test domestic and international cards, bank transfers, and easy pay',
      ] },
      { no: '02', title: 'Fill out the merchant application', tag: 'APPLY', desc: 'Apply for a merchant contract on tosspayments.com.', details: [
        'Business name, representative, registration number, industry',
        'Product catalog and expected monthly volume',
        'Service URL (pre-launch sites can mark "coming soon" with screenshots attached)',
        'Settlement account info (name must match the business)',
      ] },
      { no: '03', title: 'Upload required documents', tag: 'DOCS', desc: 'Standard plus industry-specific documents.', details: [
        'Standard: business registration, representative ID, bank book copy',
        'General retail: mail-order filing certificate',
        'Medical or pharmaceutical: relevant permit or license',
        'Food service: business operation license',
        '2–3 service screenshots (to verify the payment flow)',
      ] },
      { no: '04', title: 'Negotiate fees', tag: 'FEE', desc: 'Confirm card and easy-pay rates in the contract.', details: [
        'Regular cards: around 2.5–3.5% (varies by volume and industry)',
        'Easy pay (Kakao Pay, Naver Pay, etc.): additional fees',
        'Settlement cycle: choose D+1 (next business day), D+3, or D+7',
        'Higher monthly volume can justify lower rates',
      ] },
      { no: '05', title: 'Review & approval', tag: 'REVIEW', desc: 'Takes about 2–5 business days.', details: [
        'Requests for additional documents arrive by email',
        'Some industries (insurance, investment, games, alcohol) get extra review',
        'On approval, you receive a merchant admin account',
        'The contract is signed electronically (KakaoTalk authentication, etc.)',
      ] },
      { no: '06', title: 'Issue live keys', tag: 'LIVE KEYS', desc: 'After approval, receive the keys that enable real payments.', details: [
        'Merchant admin page > API keys',
        'Client key: for calling the frontend payment window (safe to expose)',
        'Secret key: for server-side approvals and cancellations (never expose)',
        'Keep it in .env and use it only on the server',
        'Test and live keys are distinguished by prefix (test_* / live_*)',
      ] },
      { no: '07', title: 'Register the webhook', tag: 'WEBHOOK', desc: 'Receive payment status changes instantly on your server.', details: [
        'Merchant admin > Developer Center > Webhook',
        'Events: PAYMENT_STATUS_CHANGED, CANCEL_STATUS_CHANGED, and more',
        'Register an endpoint URL (HTTPS required)',
        'Implement signature verification to prevent forgery',
      ] },
      { no: '08', title: 'Automate settlement & tax invoices', tag: 'SETTLEMENT', desc: 'Review and download settlement records and tax invoices.', details: [
        'Settlement records: daily and monthly views in the merchant admin',
        'Toss Payments issues tax invoices automatically',
        'Cash receipts can be processed automatically on approval',
        'Automate settlement via Excel export or API',
      ] },
    ],
    pitfalls: [
      { title: 'Applying with an incomplete service', desc: 'You need at least payment-flow screenshots or a test URL to pass. "Coming soon" alone usually gets rejected.' },
      { title: 'Mismatched settlement account name', desc: 'Applications frequently get rejected when the bank account name does not match the business registration.' },
      { title: 'Exposing the secret key on the frontend', desc: 'Approval and cancellation APIs must be called from the server. Calling them from the frontend lets anyone tamper with transactions.' },
      { title: 'Skipping webhook signature verification', desc: 'Anyone can POST to your webhook endpoint. Trusting the state without signature checks opens a payment bypass.' },
      { title: 'In-app purchase policy', desc: 'Digital goods in iOS and Android apps must use each store\'s in-app purchase. Using an external PG risks app rejection.' },
    ],
    resources: [
      { title: 'Toss Payments home', desc: 'Merchant application', href: 'https://www.tosspayments.com' },
      { title: 'Developer docs', desc: 'Integration guide · API reference', href: 'https://docs.tosspayments.com' },
      { title: 'Payment Widget guide', desc: 'Fastest way to integrate', href: 'https://docs.tosspayments.com/guides/payment/integration' },
      { title: 'Webhook guide', desc: 'Events · signature verification', href: 'https://docs.tosspayments.com/guides/webhook' },
      { title: 'Merchant admin login', desc: 'API keys · settlement', href: 'https://app.tosspayments.com' },
      { title: 'BrandPay', desc: 'One-click payments (easy pay)', href: 'https://docs.tosspayments.com/guides/brandpay/integration' },
    ],
  },
  ja: {
    titleTop: 'Toss Payments',
    titleBottom: '加盟店契約 & 連携',
    description: `アプリ・ウェブで決済を受けるにはPG加盟店契約が必要です。\nToss Paymentsの申請から審査、テストキー → 本番キーへの切り替えまでご案内します。`,
    primaryCtaLabel: 'Toss Paymentsに申請する',
    stats: [
      { label: '加盟店契約', value: '無料' },
      { label: '審査期間', value: '2–5営業日' },
      { label: '必要書類', value: '事業者登録証・通帳' },
    ],
    overviewTitle: '始める前にご確認ください',
    overviewDesc: 'PG加盟店契約は事業者登録が前提です。個人事業主も可能ですが、業種によっては追加書類(通信販売業申告証・医療・金融関連許認可)が必要になることがあります。まずテストキーで連携を完成させ、本番キーは加盟店審査完了後に発行されます。',
    overviewItems: [
      { title: '事業者登録が必須', desc: '個人・法人いずれも可。' },
      { title: '通信販売業申告', desc: '一般販売業は必須(区役所)。' },
      { title: '精算口座', desc: '事業者名と一致した口座を準備。' },
      { title: 'サービスURL/アプリ', desc: '審査対象が実在している必要あり。' },
    ],
    steps: [
      { no: '01', title: 'まずテストキーで連携', tag: 'DEV FIRST', desc: '契約前にテストキーで決済フローを完成させると公開スケジュールを前倒しできます。', details: [
        'docs.tosspayments.comに公開されているテストキーを利用',
        '決済ウィジェット / 決済ウィンドウ / BrandPayなどから方式を選択',
        '成功/失敗/キャンセルのコールバックURLを実装',
        '国内カード・海外カード・口座振替・簡単決済をテスト可能',
      ] },
      { no: '02', title: '加盟店申請書の作成', tag: 'APPLY', desc: 'tosspayments.comで加盟店契約を申請します。', details: [
        '商号・代表者名・事業者登録番号・業種',
        '販売品目と想定月間取引額',
        'サービスURL(公開前なら「準備中」+ スクリーンショットで可)',
        '精算口座情報(事業者名と一致)',
      ] },
      { no: '03', title: '必要書類のアップロード', tag: 'DOCS', desc: '基本+業種別の追加書類。', details: [
        '基本: 事業者登録証・代表者身分証・通帳の写し',
        '一般販売: 通信販売業申告証',
        '医療・医薬品: 関連許可証 / 免許証',
        '飲食店: 営業申告証',
        'サービスのスクリーンショット2–3枚(決済フロー確認用)',
      ] },
      { no: '04', title: '手数料の協議', tag: 'FEE', desc: 'カード・簡単決済別の手数料率を契約書で確認します。', details: [
        '一般カード: 2.5–3.5%前後(取引額・業種で異なる)',
        '簡単決済(Kakao Pay・Naver Payなど): 追加手数料',
        '精算サイクル: D+1(翌営業日) / D+3 / D+7から選択',
        '月間取引額が大きい場合は手数料の引き下げ交渉が可能',
      ] },
      { no: '05', title: '審査 & 承認', tag: 'REVIEW', desc: '営業日で2〜5日ほどかかります。', details: [
        '書類補足依頼はメールで送信',
        '一部業種(保険・投資・ゲーム・酒類)は追加審査',
        '承認時に加盟店管理者アカウントが発行される',
        '契約書は電子署名(Kakao認証など)で締結',
      ] },
      { no: '06', title: '本番キーの発行', tag: 'LIVE KEYS', desc: '承認後に実決済が可能なキーを受け取ります。', details: [
        '加盟店管理ページ > APIキー',
        'クライアントキー: フロントの決済ウィンドウ呼び出し用(公開OK)',
        'シークレットキー: サーバーの承認・取消呼び出し用(絶対に公開しない)',
        '.envに分離してサーバーのみで使用',
        'テストキーと本番キーはprefixで区別される(test_* / live_*)',
      ] },
      { no: '07', title: 'Webhookの登録', tag: 'WEBHOOK', desc: '決済ステータスの変化をサーバーで即座に受信します。', details: [
        '加盟店管理 > 開発者センター > Webhook',
        'イベント: PAYMENT_STATUS_CHANGED, CANCEL_STATUS_CHANGEDなど',
        'エンドポイントURLを登録(HTTPS必須)',
        '署名検証(Signature)ロジックを実装 — 偽造防止',
      ] },
      { no: '08', title: '精算・税金計算書の自動化', tag: 'SETTLEMENT', desc: '精算明細と税金計算書を確認・ダウンロードします。', details: [
        '精算明細: 加盟店管理ページで日/月別に確認',
        '税金計算書はToss Paymentsで自動発行',
        '現金領収証は決済承認時に自動処理が可能',
        'Excelダウンロードまたは APIで精算を自動化',
      ] },
    ],
    pitfalls: [
      { title: 'サービス未完成で審査依頼', desc: '最低でも決済フローのスクリーンショットかテストURLがないと通りません。「準備中」だけでは差し戻されやすいです。' },
      { title: '精算口座名義の不一致', desc: '事業者登録証の商号・代表者名と通帳名義が違い差し戻されるケースが多いです。' },
      { title: 'シークレットキーのフロント露出', desc: '決済の承認・取消APIは必ずサーバーから呼び出してください。フロントから直接呼ぶと全取引が改ざん可能です。' },
      { title: 'Webhook署名検証の欠落', desc: 'Webhookエンドポイントには誰でもPOSTできます。署名検証なしで状態を信じると決済回避の脆弱性になります。' },
      { title: 'アプリ内課金ポリシー', desc: 'iOS・Androidアプリのデジタル商品は各ストアの IAP のみ許可。外部PGを使うとアプリがリジェクトされる可能性があります。' },
    ],
    resources: [
      { title: 'Toss Payments トップ', desc: '加盟店申請', href: 'https://www.tosspayments.com' },
      { title: '開発者ドキュメント', desc: '連携ガイド・APIリファレンス', href: 'https://docs.tosspayments.com' },
      { title: '決済ウィジェットガイド', desc: '最速の連携方法', href: 'https://docs.tosspayments.com/guides/payment/integration' },
      { title: 'Webhookガイド', desc: 'イベント・署名検証', href: 'https://docs.tosspayments.com/guides/webhook' },
      { title: '加盟店管理ログイン', desc: 'APIキー・精算管理', href: 'https://app.tosspayments.com' },
      { title: 'BrandPay', desc: 'ワンクリック決済(簡単決済)', href: 'https://docs.tosspayments.com/guides/brandpay/integration' },
    ],
  },
  zh: {
    titleTop: 'Toss Payments',
    titleBottom: '商户签约 & 接入',
    description: `在 App 与网站上收款需要签订 PG 商户合同。\n本指南介绍 Toss Payments 的申请、审核流程,以及测试密钥到正式密钥的切换。`,
    primaryCtaLabel: '申请 Toss Payments',
    stats: [
      { label: '商户签约', value: '免费' },
      { label: '审核周期', value: '2–5 个工作日' },
      { label: '所需材料', value: '营业执照、银行账户' },
    ],
    overviewTitle: '开始前请确认',
    overviewDesc: 'PG 商户签约以事业者登记为前提。个体户亦可,但根据行业可能需要补充材料(通信销售申报、医疗、金融相关许可证)。先用测试密钥完成对接,正式密钥会在商户审核通过后发放。',
    overviewItems: [
      { title: '需事业者登记', desc: '个人与法人均可。' },
      { title: '通信销售申报', desc: '一般零售业必备(区厅办理)。' },
      { title: '结算账户', desc: '账户名需与事业者一致。' },
      { title: '服务 URL / App', desc: '审核对象必须真实存在。' },
    ],
    steps: [
      { no: '01', title: '先用测试密钥接入', tag: 'DEV FIRST', desc: '签约前用测试密钥跑通支付流程,上线节奏会更快。', details: [
        '使用 docs.tosspayments.com 公开的测试密钥',
        '选择接入方式:支付组件 / 支付窗口 / BrandPay',
        '实现成功/失败/取消的回调 URL',
        '可测试国内卡、海外卡、账户转账、简易支付',
      ] },
      { no: '02', title: '填写商户申请表', tag: 'APPLY', desc: '在 tosspayments.com 申请商户合同。', details: [
        '商号、法人代表、事业者登记号、行业',
        '销售商品与预计月交易额',
        '服务 URL(上线前可填「准备中」并附截图)',
        '结算账户信息(名义与事业者一致)',
      ] },
      { no: '03', title: '上传必备材料', tag: 'DOCS', desc: '基础材料 + 行业补充。', details: [
        '基础:营业执照、法人身份证、银行账户影本',
        '一般零售:通信销售申报证',
        '医疗医药:相关许可证 / 执照',
        '餐饮:营业申报证',
        '服务截图 2–3 张(核对支付流程)',
      ] },
      { no: '04', title: '费率谈判', tag: 'FEE', desc: '在合同中确认卡类、简易支付的费率。', details: [
        '普通卡:约 2.5–3.5%(因额度、行业而异)',
        '简易支付(Kakao Pay、Naver Pay 等):额外手续费',
        '结算周期:D+1(下一个工作日)/ D+3 / D+7 可选',
        '月交易额较大时可谈判下调费率',
      ] },
      { no: '05', title: '审核与批准', tag: 'REVIEW', desc: '通常 2–5 个工作日。', details: [
        '材料补件请求通过邮件发送',
        '部分行业(保险、投资、游戏、酒类)需额外审核',
        '批准后颁发商户后台账号',
        '通过电子签名(Kakao 认证等)签订合同',
      ] },
      { no: '06', title: '正式密钥发放', tag: 'LIVE KEYS', desc: '审核通过后获取可实际收款的密钥。', details: [
        '商户后台 > API 密钥',
        '客户端密钥:用于前端支付窗口(可公开)',
        'Secret 密钥:用于服务端的受理与取消(严禁泄露)',
        '放入 .env,仅在服务端使用',
        '测试密钥与正式密钥以前缀区分(test_* / live_*)',
      ] },
      { no: '07', title: '注册 Webhook', tag: 'WEBHOOK', desc: '在服务端即时接收支付状态变更。', details: [
        '商户后台 > 开发者中心 > Webhook',
        '事件:PAYMENT_STATUS_CHANGED、CANCEL_STATUS_CHANGED 等',
        '登记接口 URL(必须 HTTPS)',
        '实现签名(Signature)校验 — 防伪造',
      ] },
      { no: '08', title: '结算与税票自动化', tag: 'SETTLEMENT', desc: '查看并下载结算与税票。', details: [
        '结算明细:在商户后台按日/月查看',
        '税票由 Toss Payments 自动开具',
        '现金收据可在支付成功时自动处理',
        '通过 Excel 下载或 API 自动化结算',
      ] },
    ],
    pitfalls: [
      { title: '服务尚未完成就申请审核', desc: '至少要有支付流程截图或测试 URL 才能通过,仅写「准备中」容易被打回。' },
      { title: '结算账户名义不符', desc: '营业执照的商号/法人与账户名义不一致是最常见的退回原因。' },
      { title: 'Secret 密钥暴露在前端', desc: '支付受理与取消 API 必须从服务端调用,放在前端会让所有交易可被篡改。' },
      { title: '缺少 Webhook 签名校验', desc: '任何人都能往 Webhook 端点 POST,不做签名校验就直接更新状态会造成支付绕过漏洞。' },
      { title: 'App 内购政策', desc: 'iOS/Android 应用内的数字商品仅允许使用各商店的 IAP,使用外部 PG 可能导致应用被拒。' },
    ],
    resources: [
      { title: 'Toss Payments 主页', desc: '商户申请', href: 'https://www.tosspayments.com' },
      { title: '开发者文档', desc: '接入指南与 API 参考', href: 'https://docs.tosspayments.com' },
      { title: '支付组件指南', desc: '最快的接入方式', href: 'https://docs.tosspayments.com/guides/payment/integration' },
      { title: 'Webhook 指南', desc: '事件与签名校验', href: 'https://docs.tosspayments.com/guides/webhook' },
      { title: '商户后台登录', desc: 'API 密钥与结算管理', href: 'https://app.tosspayments.com' },
      { title: 'BrandPay', desc: '一键支付(简易支付)', href: 'https://docs.tosspayments.com/guides/brandpay/integration' },
    ],
  },
}

const OVERVIEW_ICONS = [iconFileText, iconStore, iconReceipt, iconShield]
const STEP_ICONS = [iconKey, iconFileText, iconFileText, iconReceipt, iconShield, iconKey, iconSettings, iconReceipt]

export default function TossPaymentsGuidePage() {
  const locale = useLocale() as Locale
  const d = DATA[locale] ?? DATA.ko
  return (
    <GuideTemplate
      badge={{ icon: badgeIcon, text: 'TOSS PAYMENTS' }}
      titleTop={d.titleTop}
      titleBottom={d.titleBottom}
      description={d.description}
      primaryCta={{ label: d.primaryCtaLabel, href: 'https://www.tosspayments.com' }}
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
