'use client'

import { useLocale } from 'next-intl'
import { GuideTemplate } from '@/components/GuideTemplate'
import { Cloud, User, CreditCard, Settings, Key, MapPin, MessageSquare, Shield } from 'lucide-react'

type Locale = 'ko' | 'en' | 'ja' | 'zh'

const badgeIcon = <Cloud className="h-3.5 w-3.5 text-white/80" />
const icons = {
  user: <User className="h-5 w-5" />,
  card: <CreditCard className="h-5 w-5" />,
  shield: <Shield className="h-5 w-5" />,
  settings: <Settings className="h-5 w-5" />,
  key: <Key className="h-5 w-5" />,
  map: <MapPin className="h-5 w-5" />,
  msg: <MessageSquare className="h-5 w-5" />,
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
    badgeText: 'NAVER CLOUD PLATFORM',
    titleTop: 'Naver Cloud Platform',
    titleBottom: '계정 생성 & 인증 키 발급',
    description: `네이버 지도·Clova·SMS·CLOVA OCR 등 NCP 상품을 사용하려면 Naver Cloud Platform(console.ncloud.com) 별도 가입이 필요합니다.\n계정 생성, 결제 수단, Access Key 발급까지 안내합니다.`,
    ctaLabel: 'NCP 콘솔 열기',
    stats: [
      { label: '가입비', value: '무료' },
      { label: '결제', value: '한국 카드·계좌 OK' },
      { label: '첫 가입 혜택', value: '크레딧 지급' },
    ],
    overviewTitle: '시작 전에 확인하세요',
    overviewDesc: 'NCP는 Naver Developers(네이버 로그인·검색 API)와는 완전히 다른 서비스입니다. 지도(Maps)·CLOVA·SMS·IoT 등이 여기 있습니다. 국내 사업자는 NCP가 AWS보다 정산·세금계산서 발행 면에서 편리합니다.',
    overviewItems: [
      { iconKey: 'user', title: '개인 vs 기업 회원', desc: '사업자는 기업 회원 권장.' },
      { iconKey: 'card', title: '결제 수단', desc: '카드·계좌이체·법인카드 모두 가능.' },
      { iconKey: 'shield', title: '휴대폰 본인인증', desc: '가입 시 실명 인증 필수.' },
      { iconKey: 'settings', title: '상품별 이용 신청', desc: 'Maps·SMS 등 개별 활성화.' },
    ],
    steps: [
      { no: '01', title: 'NCP 회원가입', tag: 'SIGNUP', iconKey: 'user', desc: 'www.ncloud.com에서 회원가입 진행.', details: [
        '개인회원 / 기업회원(법인 사업자번호) 중 선택',
        '실명 인증(휴대폰 본인인증) 필수',
        '이메일 인증 완료',
        '기업회원은 사업자등록증 이미지 업로드',
      ] },
      { no: '02', title: '결제 수단 등록', tag: 'BILLING', iconKey: 'card', desc: '유료 상품 사용 전 결제 수단을 먼저 등록.', details: [
        '마이페이지 > 결제수단 관리',
        '신용카드 / 체크카드 / 계좌이체 / 법인카드',
        '기업회원은 세금계산서 자동 발행 (월 정산)',
        '첫 가입 시 크레딧 지급 (금액은 이벤트별 상이)',
      ] },
      { no: '03', title: '콘솔 접속 & Access Key 발급', tag: 'KEY', iconKey: 'key', desc: 'API 호출용 인증 키를 발급받습니다.', details: [
        'console.ncloud.com 접속 (별도 로그인)',
        '마이페이지 > 계정 관리 > 인증키 관리',
        'Access Key ID + Secret Key 생성',
        'Secret Key는 최초 1회만 표시됨 — 안전하게 보관',
        '환경별로 키를 분리 발급 권장 (dev / prod)',
      ] },
      { no: '04', title: 'Maps (지도) 이용 신청', tag: 'MAPS', iconKey: 'map', desc: '네이버 지도 API를 프로젝트에 사용.', details: [
        '콘솔 > AI·NAVER API > Maps > 이용 신청',
        'Application 등록 (서비스 명 + 웹/앱 Origin)',
        '발급된 Client ID를 JS SDK에 주입',
        '제공 API: Web Dynamic Map / Static Map / Geocoding / Directions',
        '무료 한도: Web Dynamic Map 월 100만 호출',
      ] },
      { no: '05', title: 'SENS (SMS / LMS / 알림톡) 신청', tag: 'SMS', iconKey: 'msg', desc: '문자 발송 서비스 이용.', details: [
        'AI·NAVER API는 아닌 Application Services > SENS',
        '발신번호 사전 등록 (전파관리소 인증 필요)',
        '프로젝트 생성 후 Service Key 발급',
        'SMS 건당 약 8원, LMS 약 30원',
        '알림톡 발송도 SENS에서 가능 (카카오 채널 연동 필요)',
      ] },
      { no: '06', title: 'CLOVA API 이용 신청', tag: 'CLOVA', iconKey: 'settings', desc: 'OCR·Speech·Premium Voice 등 AI 서비스.', details: [
        'AI·NAVER API > CLOVA 상품군',
        'OCR(명함·신분증·일반)·Speech(STT·CSS) 등',
        '상품별 사용량 과금 — 첫 가입 크레딧으로 테스트 가능',
        'API Gateway를 통해 호출 (Invoke URL 발급)',
        'Secret Key 헤더 필수',
      ] },
      { no: '07', title: '리소스 & 알림 설정', tag: 'OPS', iconKey: 'shield', desc: '요금 폭탄을 방지하기 위한 알림을 설정.', details: [
        '마이페이지 > 비용·이용정보 > 이용 요금',
        '예산 임계치 알림(SMS/이메일) 설정',
        'Cloud Insight 모니터링 대시보드 생성',
        'Sub Account로 팀원별 권한 분리',
      ] },
      { no: '08', title: '서브계정 & 권한 관리', tag: 'IAM', iconKey: 'user', desc: '팀원에게 최소 권한을 부여.', details: [
        'Sub Account 생성 후 정책(Policy) 할당',
        '읽기 전용 / 상품별 관리자 등 정책 조합',
        'MFA 강제 설정 권장',
        '로그인 이력은 Cloud Activity Tracer에서 확인',
      ] },
    ],
    pitfalls: [
      { title: 'Naver Developers와 혼동', desc: '네이버 로그인은 Naver Developers, 지도·SMS·CLOVA는 NCP. 접속 URL도 다릅니다.' },
      { title: 'Secret Key 노출', desc: '최초 발급 시만 표시되는 Secret Key를 저장해두지 않으면 재발급해야 합니다. 키 노출 의심 시 즉시 폐기+재발급.' },
      { title: '발신번호 미등록 SMS 발송 불가', desc: 'SENS는 반드시 전파관리소에 등록된 발신번호만 사용 가능. 등록까지 1–3일 걸립니다.' },
      { title: '예상치 못한 과금', desc: '지도 Static Map·Directions 호출이 많으면 무료 한도 초과. 알림 설정 필수.' },
      { title: '리전 이슈', desc: 'KR(서울) 외 리전 서비스도 있지만, 국내 서비스는 KR 리전이 네트워크 비용·지연 모두 유리합니다.' },
    ],
    resources: [
      { title: 'NCP 메인 사이트', desc: '회원가입·요금제 안내', href: 'https://www.ncloud.com' },
      { title: 'NCP 콘솔', desc: '상품 관리·Access Key', href: 'https://console.ncloud.com' },
      { title: 'NAVER Maps API', desc: '지도 Web Dynamic Map', href: 'https://www.ncloud.com/product/applicationService/maps' },
      { title: 'SENS (SMS/알림톡)', desc: '문자·카카오 알림톡 발송', href: 'https://www.ncloud.com/product/applicationService/sens' },
      { title: 'CLOVA AI 상품', desc: 'OCR·STT·TTS 등', href: 'https://www.ncloud.com/product/aiService' },
      { title: 'API Gateway', desc: '인증 키 사용 가이드', href: 'https://api.ncloud-docs.com/docs/common-ncpapi' },
    ],
  },
  en: {
    badgeText: 'NAVER CLOUD PLATFORM',
    titleTop: 'Naver Cloud Platform',
    titleBottom: 'Account & Access Key',
    description: `To use NCP products like Naver Maps, CLOVA, SMS, and CLOVA OCR, you need a separate Naver Cloud Platform account at console.ncloud.com.\nThis guide walks through signup, payment method, and Access Key issuance.`,
    ctaLabel: 'Open NCP Console',
    stats: [
      { label: 'Signup fee', value: 'Free' },
      { label: 'Billing', value: 'KR cards & bank OK' },
      { label: 'New-user perk', value: 'Welcome credits' },
    ],
    overviewTitle: 'Before you begin',
    overviewDesc: 'NCP is completely distinct from Naver Developers (Naver Login and search APIs). Maps, CLOVA, SMS, and IoT live here. For Korean businesses, NCP is easier than AWS for settlement and issuing VAT invoices.',
    overviewItems: [
      { iconKey: 'user', title: 'Individual vs business', desc: 'Businesses should register as corporate members.' },
      { iconKey: 'card', title: 'Payment methods', desc: 'Cards, bank transfer, and corporate cards all accepted.' },
      { iconKey: 'shield', title: 'Phone identity check', desc: 'Real-name verification is required at signup.' },
      { iconKey: 'settings', title: 'Per-product activation', desc: 'Maps, SMS, and others are enabled individually.' },
    ],
    steps: [
      { no: '01', title: 'NCP signup', tag: 'SIGNUP', iconKey: 'user', desc: 'Register at www.ncloud.com.', details: [
        'Choose individual or corporate (with business registration number)',
        'Real-name verification via phone is required',
        'Complete email verification',
        'Corporate members upload a business registration certificate',
      ] },
      { no: '02', title: 'Register payment method', tag: 'BILLING', iconKey: 'card', desc: 'Add a payment method before using paid products.', details: [
        'My page > Payment method management',
        'Credit card / debit card / bank transfer / corporate card',
        'Corporate members get auto-issued VAT invoices (monthly settlement)',
        'Welcome credits granted on signup (amount varies by campaign)',
      ] },
      { no: '03', title: 'Console access & Access Key issuance', tag: 'KEY', iconKey: 'key', desc: 'Issue auth keys used to call the APIs.', details: [
        'Open console.ncloud.com (separate login)',
        'My page > Account management > Authentication key management',
        'Generate Access Key ID + Secret Key',
        'Secret Key is shown only once — store it safely',
        'Issue separate keys per environment (dev / prod)',
      ] },
      { no: '04', title: 'Apply for Maps', tag: 'MAPS', iconKey: 'map', desc: 'Use the Naver Maps API in your project.', details: [
        'Console > AI · NAVER API > Maps > Apply',
        'Register an Application (service name + web/app origin)',
        'Inject the issued Client ID into the JS SDK',
        'APIs: Web Dynamic Map / Static Map / Geocoding / Directions',
        'Free tier: 1M Web Dynamic Map calls per month',
      ] },
      { no: '05', title: 'SENS (SMS / LMS / AlimTalk)', tag: 'SMS', iconKey: 'msg', desc: 'Use the text messaging service.', details: [
        'Not under AI · NAVER API — under Application Services > SENS',
        'Pre-register sender number (KCC approval required)',
        'Create a project and issue a Service Key',
        'SMS around 8 KRW/msg, LMS around 30 KRW/msg',
        'AlimTalk is also supported via SENS (requires Kakao Channel integration)',
      ] },
      { no: '06', title: 'Apply for CLOVA APIs', tag: 'CLOVA', iconKey: 'settings', desc: 'AI services such as OCR, Speech, and Premium Voice.', details: [
        'AI · NAVER API > CLOVA product family',
        'OCR (business card / ID / general), Speech (STT / CSS), etc.',
        'Per-product usage billing — trial with welcome credits first',
        'Invoked via API Gateway (Invoke URL issued)',
        'Secret Key header is required',
      ] },
      { no: '07', title: 'Resources & alerts', tag: 'OPS', iconKey: 'shield', desc: 'Set alerts to avoid runaway charges.', details: [
        'My page > Cost & usage > Usage fees',
        'Budget threshold alerts (SMS / email)',
        'Create a Cloud Insight monitoring dashboard',
        'Separate team permissions with Sub Accounts',
      ] },
      { no: '08', title: 'Sub accounts & permissions', tag: 'IAM', iconKey: 'user', desc: 'Grant least privilege to teammates.', details: [
        'Create Sub Accounts and attach policies',
        'Combine read-only, per-product admin, and other policies',
        'Enforce MFA',
        'Check sign-in history via Cloud Activity Tracer',
      ] },
    ],
    pitfalls: [
      { title: 'Confusing NCP with Naver Developers', desc: 'Naver Login belongs to Naver Developers; Maps, SMS, and CLOVA are on NCP. The URLs are different.' },
      { title: 'Lost Secret Key', desc: 'The Secret Key is shown only once at issuance. Lose it and you must reissue. If you suspect it leaked, revoke and reissue immediately.' },
      { title: 'Unregistered sender number', desc: 'SENS only sends from numbers pre-registered with KCC. Registration takes 1–3 days.' },
      { title: 'Unexpected charges', desc: 'Heavy Static Map / Directions usage can blow past the free tier. Set alerts.' },
      { title: 'Region considerations', desc: 'Regions other than KR (Seoul) exist, but for Korean services the KR region wins on both network cost and latency.' },
    ],
    resources: [
      { title: 'NCP home', desc: 'Signup and pricing', href: 'https://www.ncloud.com' },
      { title: 'NCP Console', desc: 'Products & Access Key', href: 'https://console.ncloud.com' },
      { title: 'NAVER Maps API', desc: 'Web Dynamic Map', href: 'https://www.ncloud.com/product/applicationService/maps' },
      { title: 'SENS (SMS / AlimTalk)', desc: 'SMS & Kakao AlimTalk', href: 'https://www.ncloud.com/product/applicationService/sens' },
      { title: 'CLOVA AI products', desc: 'OCR / STT / TTS, etc.', href: 'https://www.ncloud.com/product/aiService' },
      { title: 'API Gateway', desc: 'Auth key usage guide', href: 'https://api.ncloud-docs.com/docs/common-ncpapi' },
    ],
  },
  ja: {
    badgeText: 'NAVER CLOUD PLATFORM',
    titleTop: 'Naver Cloud Platform',
    titleBottom: 'アカウント作成 & 認証キー発行',
    description: `NAVER 地図・Clova・SMS・CLOVA OCR などの NCP 製品を利用するには、Naver Cloud Platform(console.ncloud.com)への別途登録が必要です。\nアカウント作成から支払い方法、Access Key 発行まで解説します。`,
    ctaLabel: 'NCP コンソールを開く',
    stats: [
      { label: '登録費用', value: '無料' },
      { label: '支払い', value: '韓国カード・口座 OK' },
      { label: '初回特典', value: 'クレジット付与' },
    ],
    overviewTitle: '始める前に確認してください',
    overviewDesc: 'NCP は Naver Developers(NAVER ログイン・検索 API)とはまったく別のサービスです。地図(Maps)、CLOVA、SMS、IoT などはこちらにあります。韓国国内の事業者にとっては、精算や税金計算書の発行の面で AWS よりも NCP が便利です。',
    overviewItems: [
      { iconKey: 'user', title: '個人 vs 法人会員', desc: '事業者は法人会員を推奨します。' },
      { iconKey: 'card', title: '支払い方法', desc: 'カード・口座振替・法人カードが利用できます。' },
      { iconKey: 'shield', title: '携帯電話本人確認', desc: '登録時に実名認証が必須です。' },
      { iconKey: 'settings', title: '製品ごとの利用申請', desc: 'Maps や SMS などは個別に有効化します。' },
    ],
    steps: [
      { no: '01', title: 'NCP 会員登録', tag: 'SIGNUP', iconKey: 'user', desc: 'www.ncloud.com で会員登録を行います。', details: [
        '個人会員 / 法人会員(法人事業者番号)を選択',
        '実名認証(携帯電話による本人確認)が必須',
        'メール認証を完了',
        '法人会員は事業者登録証の画像をアップロード',
      ] },
      { no: '02', title: '支払い方法の登録', tag: 'BILLING', iconKey: 'card', desc: '有料製品を利用する前に支払い方法を登録します。', details: [
        'マイページ > 支払い方法管理',
        'クレジット / デビット / 口座振替 / 法人カード',
        '法人会員は税金計算書を自動発行(月次精算)',
        '初回登録時にクレジット付与(金額はキャンペーンにより異なります)',
      ] },
      { no: '03', title: 'コンソール接続 & Access Key 発行', tag: 'KEY', iconKey: 'key', desc: 'API 呼び出し用の認証キーを発行します。', details: [
        'console.ncloud.com にアクセス(別ログイン)',
        'マイページ > アカウント管理 > 認証キー管理',
        'Access Key ID + Secret Key を生成',
        'Secret Key は初回のみ表示 — 厳重に保管',
        '環境ごとにキーを分けて発行することを推奨(dev / prod)',
      ] },
      { no: '04', title: 'Maps 利用申請', tag: 'MAPS', iconKey: 'map', desc: 'NAVER 地図 API をプロジェクトで使用します。', details: [
        'コンソール > AI · NAVER API > Maps > 利用申請',
        'Application 登録(サービス名 + Web / アプリ Origin)',
        '発行された Client ID を JS SDK に注入',
        '提供 API: Web Dynamic Map / Static Map / Geocoding / Directions',
        '無料枠: Web Dynamic Map は月 100 万コール',
      ] },
      { no: '05', title: 'SENS(SMS / LMS / AlimTalk)申請', tag: 'SMS', iconKey: 'msg', desc: 'メッセージ送信サービスを利用します。', details: [
        'AI · NAVER API ではなく Application Services > SENS',
        '送信番号の事前登録(電波管理所の認可が必要)',
        'プロジェクト作成後に Service Key を発行',
        'SMS 約 8 ウォン / 件、LMS 約 30 ウォン / 件',
        'AlimTalk 送信も SENS から可能(Kakao チャネル連携が必要)',
      ] },
      { no: '06', title: 'CLOVA API 利用申請', tag: 'CLOVA', iconKey: 'settings', desc: 'OCR・Speech・Premium Voice などの AI サービス。', details: [
        'AI · NAVER API > CLOVA 製品群',
        'OCR(名刺・身分証・一般)、Speech(STT / CSS)など',
        '製品ごとに利用量課金 — 初回クレジットでテスト可能',
        'API Gateway 経由で呼び出し(Invoke URL 発行)',
        'Secret Key ヘッダーが必須',
      ] },
      { no: '07', title: 'リソース & 通知設定', tag: 'OPS', iconKey: 'shield', desc: '料金の暴騰を防ぐため通知を設定します。', details: [
        'マイページ > 費用 · 利用情報 > 利用料金',
        '予算しきい値通知(SMS / メール)を設定',
        'Cloud Insight モニタリングダッシュボードを作成',
        'Sub Account でチームメンバーごとに権限を分離',
      ] },
      { no: '08', title: 'サブアカウント & 権限管理', tag: 'IAM', iconKey: 'user', desc: 'チームメンバーに最小権限を付与します。', details: [
        'Sub Account を作成し Policy を割り当てる',
        '読み取り専用、製品別管理者などのポリシーを組み合わせる',
        'MFA の強制を推奨',
        'ログイン履歴は Cloud Activity Tracer で確認',
      ] },
    ],
    pitfalls: [
      { title: 'Naver Developers との混同', desc: 'NAVER ログインは Naver Developers、地図・SMS・CLOVA は NCP です。接続 URL も異なります。' },
      { title: 'Secret Key の紛失', desc: '初回発行時のみ表示される Secret Key を保管しなければ再発行が必要です。漏洩の疑いがあれば即廃棄・再発行してください。' },
      { title: '送信番号未登録で SMS 送信不可', desc: 'SENS は電波管理所に登録された送信番号のみ利用可能です。登録には 1〜3 日かかります。' },
      { title: '想定外の課金', desc: 'Static Map や Directions の呼び出しが多いと無料枠を超過します。通知を必ず設定してください。' },
      { title: 'リージョンの考慮', desc: 'KR(ソウル)以外のリージョンもありますが、国内向けサービスではネットワーク費用と遅延の両面で KR が有利です。' },
    ],
    resources: [
      { title: 'NCP メインサイト', desc: '会員登録・料金案内', href: 'https://www.ncloud.com' },
      { title: 'NCP コンソール', desc: '製品管理・Access Key', href: 'https://console.ncloud.com' },
      { title: 'NAVER Maps API', desc: '地図 Web Dynamic Map', href: 'https://www.ncloud.com/product/applicationService/maps' },
      { title: 'SENS(SMS / AlimTalk)', desc: 'SMS・Kakao AlimTalk 送信', href: 'https://www.ncloud.com/product/applicationService/sens' },
      { title: 'CLOVA AI 製品', desc: 'OCR・STT・TTS など', href: 'https://www.ncloud.com/product/aiService' },
      { title: 'API Gateway', desc: '認証キー利用ガイド', href: 'https://api.ncloud-docs.com/docs/common-ncpapi' },
    ],
  },
  zh: {
    badgeText: 'NAVER CLOUD PLATFORM',
    titleTop: 'Naver Cloud Platform',
    titleBottom: '账户开通 & 密钥签发',
    description: `使用 Naver 地图、Clova、SMS、CLOVA OCR 等 NCP 产品前,需要在 Naver Cloud Platform(console.ncloud.com)单独注册账户。\n本指南从账户创建、支付方式到 Access Key 签发,一站式说明。`,
    ctaLabel: '打开 NCP 控制台',
    stats: [
      { label: '注册费用', value: '免费' },
      { label: '结算', value: '韩国银行卡·账户均可' },
      { label: '首次注册福利', value: '赠送信用额度' },
    ],
    overviewTitle: '开始前请确认',
    overviewDesc: 'NCP 与 Naver Developers(Naver 登录与搜索 API)完全是两套服务。地图(Maps)、CLOVA、SMS、IoT 都在 NCP。对韩国本地企业而言,NCP 在结算与开具税金计算书方面比 AWS 更便利。',
    overviewItems: [
      { iconKey: 'user', title: '个人 vs 企业会员', desc: '工商企业建议注册为企业会员。' },
      { iconKey: 'card', title: '支付方式', desc: '银行卡、转账、公司卡均可。' },
      { iconKey: 'shield', title: '手机实名认证', desc: '注册时必须完成实名认证。' },
      { iconKey: 'settings', title: '逐个产品申请', desc: 'Maps、SMS 等需单独启用。' },
    ],
    steps: [
      { no: '01', title: 'NCP 注册', tag: 'SIGNUP', iconKey: 'user', desc: '在 www.ncloud.com 完成注册。', details: [
        '选择个人会员或企业会员(需法人工商登记号)',
        '通过手机完成实名认证',
        '完成邮箱验证',
        '企业会员需上传营业执照图片',
      ] },
      { no: '02', title: '登记支付方式', tag: 'BILLING', iconKey: 'card', desc: '使用付费产品前先登记支付方式。', details: [
        '个人中心 > 支付方式管理',
        '信用卡 / 借记卡 / 银行转账 / 公司卡',
        '企业会员每月自动开具税金计算书',
        '首次注册会赠送信用额度(金额依活动而定)',
      ] },
      { no: '03', title: '进入控制台 & 签发 Access Key', tag: 'KEY', iconKey: 'key', desc: '签发用于调用 API 的认证密钥。', details: [
        '访问 console.ncloud.com(独立登录)',
        '个人中心 > 账户管理 > 认证密钥管理',
        '生成 Access Key ID + Secret Key',
        'Secret Key 仅首次显示一次,请妥善保管',
        '建议按环境分别签发密钥(dev / prod)',
      ] },
      { no: '04', title: '申请 Maps(地图)', tag: 'MAPS', iconKey: 'map', desc: '在项目中使用 Naver 地图 API。', details: [
        '控制台 > AI · NAVER API > Maps > 申请使用',
        '注册 Application(服务名 + Web / App Origin)',
        '将签发的 Client ID 注入 JS SDK',
        '可用 API: Web Dynamic Map / Static Map / Geocoding / Directions',
        '免费额度: Web Dynamic Map 每月 100 万次调用',
      ] },
      { no: '05', title: '申请 SENS(SMS / LMS / AlimTalk)', tag: 'SMS', iconKey: 'msg', desc: '短信发送服务。', details: [
        '并不在 AI · NAVER API,而位于 Application Services > SENS',
        '预先登记发信号码(需通过电波管理所审核)',
        '创建项目后签发 Service Key',
        'SMS 约 8 韩元 / 条,LMS 约 30 韩元 / 条',
        'AlimTalk 也可通过 SENS 发送(需联动 Kakao 频道)',
      ] },
      { no: '06', title: '申请 CLOVA API', tag: 'CLOVA', iconKey: 'settings', desc: 'OCR、Speech、Premium Voice 等 AI 服务。', details: [
        'AI · NAVER API > CLOVA 产品族',
        'OCR(名片 / 证件 / 通用)、Speech(STT / CSS)等',
        '按产品用量计费,首次赠送的信用额度可用于测试',
        '通过 API Gateway 调用(签发 Invoke URL)',
        '必须携带 Secret Key 请求头',
      ] },
      { no: '07', title: '资源与通知设置', tag: 'OPS', iconKey: 'shield', desc: '设置通知以防止费用飙升。', details: [
        '个人中心 > 费用 · 使用信息 > 使用费用',
        '配置预算阈值提醒(短信 / 邮件)',
        '创建 Cloud Insight 监控仪表盘',
        '通过 Sub Account 为成员分配权限',
      ] },
      { no: '08', title: '子账户与权限管理', tag: 'IAM', iconKey: 'user', desc: '为团队成员授予最小权限。', details: [
        '创建 Sub Account 并分配策略(Policy)',
        '组合只读、单产品管理员等策略',
        '建议强制启用 MFA',
        '通过 Cloud Activity Tracer 查看登录记录',
      ] },
    ],
    pitfalls: [
      { title: '混淆 Naver Developers 与 NCP', desc: 'Naver 登录属于 Naver Developers,地图 / SMS / CLOVA 在 NCP,URL 完全不同。' },
      { title: 'Secret Key 泄露或丢失', desc: 'Secret Key 仅首次显示,没有保存则只能重新签发。一旦怀疑泄露应立即吊销并重新签发。' },
      { title: '未登记发信号码无法发短信', desc: 'SENS 必须使用在电波管理所登记过的发信号码,登记需要 1–3 天。' },
      { title: '意料之外的费用', desc: '如 Static Map 或 Directions 调用量大,易超出免费额度。请务必设置通知。' },
      { title: '区域选择', desc: '除 KR(首尔)外也有其他区域,但面向韩国用户时 KR 在网络费用和延迟方面都更有优势。' },
    ],
    resources: [
      { title: 'NCP 官网', desc: '注册与资费说明', href: 'https://www.ncloud.com' },
      { title: 'NCP 控制台', desc: '产品管理与 Access Key', href: 'https://console.ncloud.com' },
      { title: 'NAVER Maps API', desc: 'Web Dynamic Map', href: 'https://www.ncloud.com/product/applicationService/maps' },
      { title: 'SENS(SMS / AlimTalk)', desc: '短信与 Kakao AlimTalk', href: 'https://www.ncloud.com/product/applicationService/sens' },
      { title: 'CLOVA AI 产品', desc: 'OCR / STT / TTS 等', href: 'https://www.ncloud.com/product/aiService' },
      { title: 'API Gateway', desc: '认证密钥使用指南', href: 'https://api.ncloud-docs.com/docs/common-ncpapi' },
    ],
  },
}

export default function NaverCloudGuidePage() {
  const locale = useLocale() as Locale
  const d = DATA[locale] ?? DATA.ko
  return (
    <GuideTemplate
      badge={{ icon: badgeIcon, text: d.badgeText }}
      titleTop={d.titleTop}
      titleBottom={d.titleBottom}
      description={d.description}
      primaryCta={{ label: d.ctaLabel, href: 'https://www.ncloud.com' }}
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
