// Estimate page i18n content
// Korean is source; English, Japanese (です・ます), Simplified Chinese.

export type Locale = 'ko' | 'en' | 'ja' | 'zh'

type UI = {
  // Header / nav
  brand: string
  navAbout: string
  navEstimate: string
  navContact: string
  ctaProject: string

  // Hero
  heroEyebrow: string
  heroTitle: string
  heroDescTemplate: (totalItems: number, packages: number) => string

  // Packages carousel
  quickStartEyebrow: string
  packageCountTitle: (n: number) => string
  packageDesc: string
  resetSelection: string
  prev: string
  next: string

  // Package card
  avgDevPeriod: string
  basicReference: string
  monthsSuffix: string
  similarService: string
  includedItems: (n: number) => string
  moreItems: (n: number) => string
  pricingItemsCount: (count: number, price: string) => string
  manwonSuffix: string // "만" suffix

  // Sticky preset bar
  presets: string

  // Categories section
  projectCondition: string
  devModeLabel: string
  devModeBothNative: string
  devModeSingleNative: string
  devModeCross: string
  devModeBothNativeDesc: string
  devModeSingleNativeDesc: string
  devModeCrossDesc: string
  designLevel: string
  timeline: string

  searchPlaceholder: string
  searchMatchesTemplate: (n: number, q: string) => string // HTML-ish; we'll render tokens separately

  selectAll: string
  clearAll: string

  // Categories + items locale-specific labels
  categoryTitles: Record<string, { title: string; tag: string }>
  itemLabels: Record<string, string>

  // Designs / timelines labels
  designs: { template: string; custom: string; premium: string }
  timelines: { normal: string; fast: string; urgent: string }

  // Request quotation
  requestEyebrow: string
  requestTitle: string
  requestDesc: string
  company: string
  manager: string
  phone: string
  email: string
  extraMemo: string
  submitDiscountCta: string
  sending: string

  // Right summary card
  totalEstimate: string
  supplyPrice: string
  vatExcluded: string
  wonSuffix: string
  itemsTotal: string
  nativeAdjust: string
  designAdjust: string
  timelineAdjust: string
  supplyPriceBold: string
  vatLine: string
  vatIncludedFinal: string

  teamAllocation: string
  totalMM: string
  estDuration: string
  monthsUnit: string
  selectItemsNotice: string
  mmFootnote: (rate: string) => string

  // CTAs below summary
  ctaGetDiscount: string
  ctaDirectConsult: string
  disclaimer: string

  // Roles
  roleLabels: Record<string, string>

  // Quick modal
  close: string
  limitedOfferTemplate: (price: string) => string
  modalTitle: string
  modalSubtitle: string // uses <b> tags
  selectedItemsTemplate: (n: number) => string
  quickName: string
  quickNamePh: string
  quickPhone: string
  quickPhonePh: string
  quickEmail: string
  quickEmailPh: string
  requestNote: string
  aiDraftTitle: string
  aiDraftLabel: string
  aiDraftWriting: string
  submitQuickCta: string
  quickSending: string
  quickConsent: string

  // Toasts
  toastNeedName: string
  toastNeedItem: string
  toastInquiryReceived: (fileNote: string) => string
  toastFileNote: (n: number) => string
  toastSendFailed: string
  toastQuickOk: string
  toastNeedItemFirst: string
  toastAiOk: string
  toastAiTemplateOk: string
  toastAiFail: string
  errSendFail: string

  // Footer
  footerTag: string
  footerTagline: string
  footerCopyright: string
  footerHome: string
  footerAbout: string
  footerContact: string

  // aria labels
  ariaPrev: string
  ariaNext: string
  ariaClose: string
}

// ─────────── Korean (source) ───────────
const ko: UI = {
  brand: '제이씨랩',
  navAbout: '회사소개',
  navEstimate: '자가견적',
  navContact: '문의',
  ctaProject: '프로젝트 의뢰',

  heroEyebrow: 'Self Estimate',
  heroTitle: '상세 항목별 자가견적',
  heroDescTemplate: (total, pkgs) =>
    `17개 카테고리 · ${total}개 세부 항목 · ${pkgs}가지 패키지 × 5단계 티어. 네이티브/크로스, 디자인 수준, 일정 보정, 부가세까지 실시간 계산됩니다.`,

  quickStartEyebrow: 'Quick Start',
  packageCountTitle: (n) => `${n}개 패키지 프리셋`,
  packageDesc: '서비스 유형과 5단계 티어 중 원하는 조합을 선택하면 자동으로 체크됩니다.',
  resetSelection: '선택 초기화',
  prev: '이전',
  next: '다음',

  avgDevPeriod: '평균 개발 기간',
  basicReference: '(Basic 기준)',
  monthsSuffix: '개월',
  similarService: '비슷한 서비스',
  includedItems: (n) => `포함 항목 (${n}개)`,
  moreItems: (n) => `…외 ${n}개`,
  pricingItemsCount: (count, price) => `${count}개 · ${price}만`,
  manwonSuffix: '만',

  presets: 'PRESETS',

  projectCondition: 'Project Condition',
  devModeLabel: '개발 방식 (자동 감지)',
  devModeBothNative: 'iOS + Android 양쪽 네이티브',
  devModeSingleNative: '단일 네이티브',
  devModeCross: '크로스플랫폼 / 단일 OS',
  devModeBothNativeDesc: 'iOS+Android 네이티브 양쪽 → 앱 기능 항목에 ×1.6 가중',
  devModeSingleNativeDesc: '단일 네이티브 → 앱 기능 항목에 ×1.1 가중',
  devModeCrossDesc: '크로스플랫폼 또는 단일 OS → 가중 없음',
  designLevel: '디자인 수준',
  timeline: '일정',

  searchPlaceholder: '항목 검색 (예: 결제, 로그인, 채팅, 푸시…)',
  searchMatchesTemplate: (n, q) => `${n}개 항목이 "${q}"와 일치합니다.`,

  selectAll: '전체 선택',
  clearAll: '전체 해제',

  categoryTitles: {
    platform: { title: '플랫폼 / 기반', tag: 'PLATFORM' },
    design: { title: '디자인 / UX', tag: 'DESIGN' },
    anim: { title: '인터랙션 / 애니메이션', tag: 'INTERACTION' },
    auth: { title: '회원 / 인증', tag: 'AUTH' },
    pay: { title: '결제 / 정산', tag: 'PAYMENT' },
    noti: { title: '알림 / 메시징', tag: 'NOTIFICATION' },
    social: { title: '커뮤니티 / SNS', tag: 'COMMUNITY' },
    media: { title: '미디어 / 콘텐츠', tag: 'MEDIA' },
    commerce: { title: '쇼핑몰 / 커머스', tag: 'COMMERCE' },
    loc: { title: '위치 / 지도 / 배달', tag: 'LOCATION' },
    ai: { title: 'AI / 머신러닝', tag: 'AI · ML' },
    sched: { title: '예약 / 매칭 / 스케줄', tag: 'SCHEDULE' },
    data: { title: '데이터 / 분석', tag: 'ANALYTICS' },
    gam: { title: '게이미피케이션', tag: 'GAMIFICATION' },
    sec: { title: '보안 / 약관 / 컴플라이언스', tag: 'SECURITY' },
    infra: { title: '인프라 / 운영', tag: 'INFRA · DEVOPS' },
    extra: { title: '부가 서비스 / 스토어', tag: 'EXTRA' },
  },

  itemLabels: {}, // filled below (we keep originals)

  designs: { template: '템플릿 기반', custom: '커스텀 디자인', premium: '프리미엄' },
  timelines: { normal: '일반 (3 – 6개월)', fast: '단축 (2개월 이내)', urgent: '긴급 (1개월 이내)' },

  requestEyebrow: 'Request Quotation',
  requestTitle: '상세 견적서 요청',
  requestDesc: '현재 선택 내용을 기반으로 담당 PM이 영업일 기준 1일 내 정식 견적서와 일정 제안을 드립니다.',
  company: '회사명 / 소속',
  manager: '담당자명 *',
  phone: '연락처 *',
  email: '이메일',
  extraMemo: '추가 전달사항 (참고 서비스, 예상 사용자 수, 특별 요구사항 등)',
  submitDiscountCta: '견적받고 할인받기',
  sending: '전송 중...',

  totalEstimate: 'Total Estimate',
  supplyPrice: '공급가',
  vatExcluded: '· VAT 별도',
  wonSuffix: '원',
  itemsTotal: '항목 합계',
  nativeAdjust: '네이티브 보정',
  designAdjust: '디자인 보정',
  timelineAdjust: '일정 보정',
  supplyPriceBold: '공급가',
  vatLine: '부가세 (10%)',
  vatIncludedFinal: 'VAT 포함 최종',

  teamAllocation: 'Team Allocation',
  totalMM: '총 맨먼스',
  estDuration: '예상 기간',
  monthsUnit: '개월',
  selectItemsNotice: '좌측에서 항목을 선택해주세요.',
  mmFootnote: (rate) => `맨먼스 단가 평균 ${rate}만원 (혼합 인력 기준) 적용.`,

  ctaGetDiscount: '견적받고 할인받기',
  ctaDirectConsult: '직접 상담 요청',
  disclaimer:
    '본 견적은 자동 계산된 참고 금액이며 실제 계약 금액과 다를 수 있습니다. 정확한 견적은 기능 명세서 기반의 상세 상담 후 확정됩니다.',

  roleLabels: {
    pm: '프로젝트 매니저 (PM)',
    designer: '프로덕트 디자이너',
    mobile: '모바일 개발자',
    frontend: '프론트엔드 개발자',
    backend: '백엔드 개발자',
    ai: 'AI / ML 엔지니어',
    devops: '데브옵스 엔지니어',
  },

  close: '닫기',
  limitedOfferTemplate: (price) => `LIMITED OFFER · 공급가 ${price}만원`,
  modalTitle: '견적받고 할인받기',
  modalSubtitle: '<b>1영업일 내 맞춤 견적서</b>와 <b>최대 15% 할인 제안</b>을 함께 드려요.',
  selectedItemsTemplate: (n) => `선택한 항목 · ${n}개`,
  quickName: '이름',
  quickNamePh: '홍길동',
  quickPhone: '연락처',
  quickPhonePh: '010-0000-0000',
  quickEmail: '이메일',
  quickEmailPh: 'you@example.com',
  requestNote: '요청사항',
  aiDraftTitle: '선택한 항목 기반으로 요청사항 초안을 생성합니다',
  aiDraftLabel: 'AI로 작성',
  aiDraftWriting: '작성 중...',
  submitQuickCta: '제출하고 할인 받기',
  quickSending: '전송 중...',
  quickConsent: '제출 시 개인정보 수집·이용에 동의하는 것으로 간주됩니다.',

  toastNeedName: '담당자명과 연락처를 입력해주세요',
  toastNeedItem: '견적 항목을 1개 이상 선택해주세요',
  toastInquiryReceived: (fileNote) => `견적 신청이 접수되었습니다.${fileNote}`,
  toastFileNote: (n) => ` (첨부 ${n}개는 회신 메일로 전달 부탁드려요)`,
  toastSendFailed: '전송에 실패했어요.',
  toastQuickOk: '신청 완료! 영업일 기준 1일 내 연락드릴게요.',
  toastNeedItemFirst: '견적 항목을 먼저 선택해주세요',
  toastAiOk: 'AI가 요청사항을 작성했어요.',
  toastAiTemplateOk: '템플릿으로 초안을 작성했어요.',
  toastAiFail: '생성에 실패했어요. 직접 작성 부탁드려요.',
  errSendFail: '전송 실패',

  footerTag: '제이씨랩',
  footerTagline: 'App Development Studio · jaicylab2009@gmail.com',
  footerCopyright: 'Copyright © JAICYLAB. All rights reserved.',
  footerHome: '홈',
  footerAbout: '회사소개',
  footerContact: '문의',

  ariaPrev: '이전',
  ariaNext: '다음',
  ariaClose: '닫기',
}

// ─────────── English ───────────
const en: UI = {
  ...ko,
  brand: 'JAICYLAB',
  navAbout: 'About',
  navEstimate: 'Estimate',
  navContact: 'Contact',
  ctaProject: 'Start a Project',

  heroEyebrow: 'Self Estimate',
  heroTitle: 'Itemized Self-Estimate',
  heroDescTemplate: (total, pkgs) =>
    `17 categories · ${total} line items · ${pkgs} packages × 5 tiers. Native/cross-platform, design level, schedule adjustments, and VAT — all calculated in real time.`,

  quickStartEyebrow: 'Quick Start',
  packageCountTitle: (n) => `${n} Package Presets`,
  packageDesc: 'Pick a service type and one of 5 tiers — items auto-select.',
  resetSelection: 'Reset selection',
  prev: 'Previous',
  next: 'Next',

  avgDevPeriod: 'Avg. dev time',
  basicReference: '(Basic tier)',
  monthsSuffix: ' mo',
  similarService: 'Similar services',
  includedItems: (n) => `Included items (${n})`,
  moreItems: (n) => `…and ${n} more`,
  pricingItemsCount: (count, price) => `${count} items · ${price}만`,
  manwonSuffix: '만',

  presets: 'PRESETS',

  projectCondition: 'Project Conditions',
  devModeLabel: 'Dev approach (auto-detected)',
  devModeBothNative: 'iOS + Android dual native',
  devModeSingleNative: 'Single native',
  devModeCross: 'Cross-platform / single OS',
  devModeBothNativeDesc: 'iOS + Android native both → ×1.6 on app feature items',
  devModeSingleNativeDesc: 'Single native → ×1.1 on app feature items',
  devModeCrossDesc: 'Cross-platform or single OS → no multiplier',
  designLevel: 'Design level',
  timeline: 'Timeline',

  searchPlaceholder: 'Search items (e.g. payments, login, chat, push…)',
  searchMatchesTemplate: (n, q) => `${n} items match "${q}".`,

  selectAll: 'Select all',
  clearAll: 'Clear all',

  categoryTitles: {
    platform: { title: 'Platform / Foundation', tag: 'PLATFORM' },
    design: { title: 'Design / UX', tag: 'DESIGN' },
    anim: { title: 'Interaction / Animation', tag: 'INTERACTION' },
    auth: { title: 'Auth / Membership', tag: 'AUTH' },
    pay: { title: 'Payments / Billing', tag: 'PAYMENT' },
    noti: { title: 'Notifications / Messaging', tag: 'NOTIFICATION' },
    social: { title: 'Community / Social', tag: 'COMMUNITY' },
    media: { title: 'Media / Content', tag: 'MEDIA' },
    commerce: { title: 'Shop / Commerce', tag: 'COMMERCE' },
    loc: { title: 'Location / Maps / Delivery', tag: 'LOCATION' },
    ai: { title: 'AI / Machine Learning', tag: 'AI · ML' },
    sched: { title: 'Booking / Matching / Schedule', tag: 'SCHEDULE' },
    data: { title: 'Data / Analytics', tag: 'ANALYTICS' },
    gam: { title: 'Gamification', tag: 'GAMIFICATION' },
    sec: { title: 'Security / Terms / Compliance', tag: 'SECURITY' },
    infra: { title: 'Infrastructure / Ops', tag: 'INFRA · DEVOPS' },
    extra: { title: 'Add-ons / Store', tag: 'EXTRA' },
  },

  itemLabels: {},

  designs: { template: 'Template-based', custom: 'Custom design', premium: 'Premium' },
  timelines: { normal: 'Normal (3–6 months)', fast: 'Fast (within 2 months)', urgent: 'Urgent (within 1 month)' },

  requestEyebrow: 'Request Quotation',
  requestTitle: 'Request a detailed quote',
  requestDesc: 'Based on your selection, a dedicated PM will send a formal quote and schedule within one business day.',
  company: 'Company / Affiliation',
  manager: 'Contact name *',
  phone: 'Phone *',
  email: 'Email',
  extraMemo: 'Additional notes (reference services, expected users, special requirements, etc.)',
  submitDiscountCta: 'Get quote & discount',
  sending: 'Sending...',

  totalEstimate: 'Total Estimate',
  supplyPrice: 'Subtotal',
  vatExcluded: '· VAT excluded',
  wonSuffix: ' KRW',
  itemsTotal: 'Items subtotal',
  nativeAdjust: 'Native adjustment',
  designAdjust: 'Design adjustment',
  timelineAdjust: 'Timeline adjustment',
  supplyPriceBold: 'Subtotal',
  vatLine: 'VAT (10%)',
  vatIncludedFinal: 'Final (incl. VAT)',

  teamAllocation: 'Team Allocation',
  totalMM: 'Total man-months',
  estDuration: 'Est. duration',
  monthsUnit: ' mo',
  selectItemsNotice: 'Please select items on the left.',
  mmFootnote: (rate) => `Man-month rate averages ${rate}만원 (mixed-team basis).`,

  ctaGetDiscount: 'Get quote & discount',
  ctaDirectConsult: 'Request direct consultation',
  disclaimer:
    'This is an auto-calculated reference quote and may differ from the actual contract. A precise quote is confirmed after a detailed consultation based on a feature spec.',

  roleLabels: {
    pm: 'Project Manager (PM)',
    designer: 'Product Designer',
    mobile: 'Mobile Developer',
    frontend: 'Frontend Developer',
    backend: 'Backend Developer',
    ai: 'AI / ML Engineer',
    devops: 'DevOps Engineer',
  },

  close: 'Close',
  limitedOfferTemplate: (price) => `LIMITED OFFER · Subtotal ${price}만원`,
  modalTitle: 'Get a quote & a discount',
  modalSubtitle: "We'll send you a <b>custom quote within 1 business day</b> along with <b>up to 15% off</b>.",
  selectedItemsTemplate: (n) => `Selected · ${n} items`,
  quickName: 'Name',
  quickNamePh: 'Jane Doe',
  quickPhone: 'Phone',
  quickPhonePh: '010-0000-0000',
  quickEmail: 'Email',
  quickEmailPh: 'you@example.com',
  requestNote: 'Notes',
  aiDraftTitle: 'Generate a draft based on your selection',
  aiDraftLabel: 'Draft with AI',
  aiDraftWriting: 'Writing...',
  submitQuickCta: 'Submit & get discount',
  quickSending: 'Sending...',
  quickConsent: 'By submitting you agree to our collection and use of personal information.',

  toastNeedName: 'Please enter your name and phone number',
  toastNeedItem: 'Please select at least one item',
  toastInquiryReceived: (fileNote) => `Inquiry received.${fileNote}`,
  toastFileNote: (n) => ` (Please send your ${n} attachment(s) via reply email)`,
  toastSendFailed: 'Failed to send.',
  toastQuickOk: 'Submitted! We\'ll reach out within 1 business day.',
  toastNeedItemFirst: 'Please select items first',
  toastAiOk: 'AI drafted your notes.',
  toastAiTemplateOk: 'Drafted from a template.',
  toastAiFail: 'Generation failed. Please write manually.',
  errSendFail: 'Send failed',

  footerTag: 'JAICYLAB',
  footerTagline: 'App Development Studio · jaicylab2009@gmail.com',
  footerCopyright: 'Copyright © JAICYLAB. All rights reserved.',
  footerHome: 'Home',
  footerAbout: 'About',
  footerContact: 'Contact',

  ariaPrev: 'Previous',
  ariaNext: 'Next',
  ariaClose: 'Close',
}

// ─────────── Japanese (です・ます) ───────────
const ja: UI = {
  ...ko,
  brand: 'JAICYLAB',
  navAbout: '会社紹介',
  navEstimate: '自動見積り',
  navContact: 'お問い合わせ',
  ctaProject: 'プロジェクト依頼',

  heroEyebrow: 'Self Estimate',
  heroTitle: '項目別セルフ見積り',
  heroDescTemplate: (total, pkgs) =>
    `17カテゴリー・${total}項目・${pkgs}パッケージ×5ティア。ネイティブ/クロス、デザインレベル、スケジュール補正、消費税までリアルタイムで計算いたします。`,

  quickStartEyebrow: 'Quick Start',
  packageCountTitle: (n) => `${n} パッケージプリセット`,
  packageDesc: 'サービス種別と5段階ティアから組み合わせを選ぶと、自動で項目が選択されます。',
  resetSelection: '選択をリセット',
  prev: '前へ',
  next: '次へ',

  avgDevPeriod: '平均開発期間',
  basicReference: '(Basic 基準)',
  monthsSuffix: 'ヶ月',
  similarService: '類似サービス',
  includedItems: (n) => `含まれる項目 (${n}件)`,
  moreItems: (n) => `…他${n}件`,
  pricingItemsCount: (count, price) => `${count}件・${price}万`,
  manwonSuffix: '万',

  presets: 'PRESETS',

  projectCondition: 'Project Condition',
  devModeLabel: '開発方式 (自動判定)',
  devModeBothNative: 'iOS + Android 両方ネイティブ',
  devModeSingleNative: '単一ネイティブ',
  devModeCross: 'クロスプラットフォーム / 単一OS',
  devModeBothNativeDesc: 'iOS+Android ネイティブ両方 → アプリ機能に ×1.6 加重',
  devModeSingleNativeDesc: '単一ネイティブ → アプリ機能に ×1.1 加重',
  devModeCrossDesc: 'クロスプラットフォームまたは単一OS → 加重なし',
  designLevel: 'デザインレベル',
  timeline: 'スケジュール',

  searchPlaceholder: '項目を検索 (例: 決済、ログイン、チャット、プッシュ…)',
  searchMatchesTemplate: (n, q) => `「${q}」に一致する項目が${n}件あります。`,

  selectAll: 'すべて選択',
  clearAll: 'すべて解除',

  categoryTitles: {
    platform: { title: 'プラットフォーム / 基盤', tag: 'PLATFORM' },
    design: { title: 'デザイン / UX', tag: 'DESIGN' },
    anim: { title: 'インタラクション / アニメ', tag: 'INTERACTION' },
    auth: { title: '会員 / 認証', tag: 'AUTH' },
    pay: { title: '決済 / 精算', tag: 'PAYMENT' },
    noti: { title: '通知 / メッセージ', tag: 'NOTIFICATION' },
    social: { title: 'コミュニティ / SNS', tag: 'COMMUNITY' },
    media: { title: 'メディア / コンテンツ', tag: 'MEDIA' },
    commerce: { title: 'ショップ / コマース', tag: 'COMMERCE' },
    loc: { title: '位置 / 地図 / 配達', tag: 'LOCATION' },
    ai: { title: 'AI / 機械学習', tag: 'AI · ML' },
    sched: { title: '予約 / マッチング / スケジュール', tag: 'SCHEDULE' },
    data: { title: 'データ / 分析', tag: 'ANALYTICS' },
    gam: { title: 'ゲーミフィケーション', tag: 'GAMIFICATION' },
    sec: { title: 'セキュリティ / 規約 / コンプラ', tag: 'SECURITY' },
    infra: { title: 'インフラ / 運用', tag: 'INFRA · DEVOPS' },
    extra: { title: '付加サービス / ストア', tag: 'EXTRA' },
  },

  itemLabels: {},

  designs: { template: 'テンプレートベース', custom: 'カスタムデザイン', premium: 'プレミアム' },
  timelines: { normal: '通常 (3 – 6ヶ月)', fast: '短縮 (2ヶ月以内)', urgent: '緊急 (1ヶ月以内)' },

  requestEyebrow: 'Request Quotation',
  requestTitle: '詳細見積書のご依頼',
  requestDesc: '現在の選択内容をもとに、担当PMが営業日1日以内に正式な見積書とスケジュールをご提案いたします。',
  company: '会社名 / 所属',
  manager: 'ご担当者名 *',
  phone: '連絡先 *',
  email: 'メール',
  extraMemo: 'その他ご要望 (参考サービス、想定ユーザー数、特殊要件など)',
  submitDiscountCta: '見積りと割引を受け取る',
  sending: '送信中...',

  totalEstimate: 'Total Estimate',
  supplyPrice: '税抜金額',
  vatExcluded: '· 税別',
  wonSuffix: 'ウォン',
  itemsTotal: '項目合計',
  nativeAdjust: 'ネイティブ補正',
  designAdjust: 'デザイン補正',
  timelineAdjust: 'スケジュール補正',
  supplyPriceBold: '税抜金額',
  vatLine: '消費税 (10%)',
  vatIncludedFinal: '税込最終金額',

  teamAllocation: 'Team Allocation',
  totalMM: '総マンマンス',
  estDuration: '想定期間',
  monthsUnit: 'ヶ月',
  selectItemsNotice: '左側から項目を選択してください。',
  mmFootnote: (rate) => `マンマンス単価 平均${rate}万ウォン (混成チーム基準) を適用しております。`,

  ctaGetDiscount: '見積りと割引を受け取る',
  ctaDirectConsult: '直接ご相談する',
  disclaimer:
    '本見積りは自動計算された参考金額であり、実際のご契約金額と異なる場合がございます。正確な見積りは仕様書に基づく詳細ご相談後に確定いたします。',

  roleLabels: {
    pm: 'プロジェクトマネージャー (PM)',
    designer: 'プロダクトデザイナー',
    mobile: 'モバイル開発者',
    frontend: 'フロントエンド開発者',
    backend: 'バックエンド開発者',
    ai: 'AI / ML エンジニア',
    devops: 'DevOps エンジニア',
  },

  close: '閉じる',
  limitedOfferTemplate: (price) => `LIMITED OFFER · 税抜${price}万ウォン`,
  modalTitle: '見積りと割引を受け取る',
  modalSubtitle: '<b>1営業日以内のカスタム見積書</b>と<b>最大15%割引のご提案</b>をお届けいたします。',
  selectedItemsTemplate: (n) => `選択した項目・${n}件`,
  quickName: 'お名前',
  quickNamePh: '山田 太郎',
  quickPhone: '連絡先',
  quickPhonePh: '090-0000-0000',
  quickEmail: 'メール',
  quickEmailPh: 'you@example.com',
  requestNote: 'ご要望',
  aiDraftTitle: '選択した項目に基づいて要望の下書きを生成します',
  aiDraftLabel: 'AIで作成',
  aiDraftWriting: '作成中...',
  submitQuickCta: '送信して割引を受ける',
  quickSending: '送信中...',
  quickConsent: '送信により個人情報の収集・利用に同意したものとみなされます。',

  toastNeedName: 'ご担当者名と連絡先を入力してください',
  toastNeedItem: '見積り項目を1つ以上選択してください',
  toastInquiryReceived: (fileNote) => `お見積りのご依頼を受け付けました。${fileNote}`,
  toastFileNote: (n) => ` (添付${n}件は返信メールでお送りください)`,
  toastSendFailed: '送信に失敗しました。',
  toastQuickOk: '送信完了しました。営業日1日以内にご連絡いたします。',
  toastNeedItemFirst: 'まず見積り項目を選択してください',
  toastAiOk: 'AIがご要望を作成しました。',
  toastAiTemplateOk: 'テンプレートで下書きを作成しました。',
  toastAiFail: '生成に失敗しました。お手数ですがご記入ください。',
  errSendFail: '送信失敗',

  footerTag: 'JAICYLAB',
  footerTagline: 'App Development Studio · jaicylab2009@gmail.com',
  footerCopyright: 'Copyright © JAICYLAB. All rights reserved.',
  footerHome: 'ホーム',
  footerAbout: '会社紹介',
  footerContact: 'お問い合わせ',

  ariaPrev: '前へ',
  ariaNext: '次へ',
  ariaClose: '閉じる',
}

// ─────────── Simplified Chinese ───────────
const zh: UI = {
  ...ko,
  brand: 'JAICYLAB',
  navAbout: '公司介绍',
  navEstimate: '自助报价',
  navContact: '联系我们',
  ctaProject: '项目委托',

  heroEyebrow: 'Self Estimate',
  heroTitle: '按项目自助报价',
  heroDescTemplate: (total, pkgs) =>
    `17 个类别 · ${total} 个细分项目 · ${pkgs} 种套餐 × 5 档。原生/跨平台、设计等级、工期调整、增值税均实时计算。`,

  quickStartEyebrow: 'Quick Start',
  packageCountTitle: (n) => `${n} 款套餐预设`,
  packageDesc: '选择服务类型和 5 档中的组合,即可自动勾选相关项目。',
  resetSelection: '清空选择',
  prev: '上一个',
  next: '下一个',

  avgDevPeriod: '平均开发周期',
  basicReference: '(以 Basic 档为准)',
  monthsSuffix: '个月',
  similarService: '类似服务',
  includedItems: (n) => `包含项目 (${n} 项)`,
  moreItems: (n) => `…另有 ${n} 项`,
  pricingItemsCount: (count, price) => `${count} 项 · ${price}万`,
  manwonSuffix: '万',

  presets: 'PRESETS',

  projectCondition: 'Project Condition',
  devModeLabel: '开发方式 (自动识别)',
  devModeBothNative: 'iOS + Android 双原生',
  devModeSingleNative: '单一原生',
  devModeCross: '跨平台 / 单一 OS',
  devModeBothNativeDesc: 'iOS+Android 双原生 → App 功能项目 ×1.6 加权',
  devModeSingleNativeDesc: '单一原生 → App 功能项目 ×1.1 加权',
  devModeCrossDesc: '跨平台或单一 OS → 无加权',
  designLevel: '设计等级',
  timeline: '工期',

  searchPlaceholder: '搜索项目 (例:支付、登录、聊天、推送…)',
  searchMatchesTemplate: (n, q) => `${n} 个项目匹配 "${q}"。`,

  selectAll: '全选',
  clearAll: '全部取消',

  categoryTitles: {
    platform: { title: '平台 / 基础', tag: 'PLATFORM' },
    design: { title: '设计 / UX', tag: 'DESIGN' },
    anim: { title: '交互 / 动效', tag: 'INTERACTION' },
    auth: { title: '会员 / 认证', tag: 'AUTH' },
    pay: { title: '支付 / 结算', tag: 'PAYMENT' },
    noti: { title: '通知 / 消息', tag: 'NOTIFICATION' },
    social: { title: '社区 / 社交', tag: 'COMMUNITY' },
    media: { title: '媒体 / 内容', tag: 'MEDIA' },
    commerce: { title: '商城 / 电商', tag: 'COMMERCE' },
    loc: { title: '位置 / 地图 / 配送', tag: 'LOCATION' },
    ai: { title: 'AI / 机器学习', tag: 'AI · ML' },
    sched: { title: '预约 / 匹配 / 排程', tag: 'SCHEDULE' },
    data: { title: '数据 / 分析', tag: 'ANALYTICS' },
    gam: { title: '游戏化', tag: 'GAMIFICATION' },
    sec: { title: '安全 / 协议 / 合规', tag: 'SECURITY' },
    infra: { title: '基础设施 / 运维', tag: 'INFRA · DEVOPS' },
    extra: { title: '增值服务 / 商店', tag: 'EXTRA' },
  },

  itemLabels: {},

  designs: { template: '模板化', custom: '定制设计', premium: '高端' },
  timelines: { normal: '常规 (3 – 6 个月)', fast: '加急 (2 个月内)', urgent: '紧急 (1 个月内)' },

  requestEyebrow: 'Request Quotation',
  requestTitle: '申请详细报价',
  requestDesc: '基于您当前的选择,负责 PM 将在 1 个工作日内提供正式报价及排期建议。',
  company: '公司名称 / 所属',
  manager: '联系人 *',
  phone: '联系电话 *',
  email: '邮箱',
  extraMemo: '补充说明 (参考服务、预计用户量、特殊需求等)',
  submitDiscountCta: '获取报价并领取折扣',
  sending: '发送中...',

  totalEstimate: 'Total Estimate',
  supplyPrice: '不含税金额',
  vatExcluded: '· 不含增值税',
  wonSuffix: '韩元',
  itemsTotal: '项目合计',
  nativeAdjust: '原生修正',
  designAdjust: '设计修正',
  timelineAdjust: '工期修正',
  supplyPriceBold: '不含税金额',
  vatLine: '增值税 (10%)',
  vatIncludedFinal: '含税最终金额',

  teamAllocation: 'Team Allocation',
  totalMM: '总人月',
  estDuration: '预计周期',
  monthsUnit: '个月',
  selectItemsNotice: '请在左侧选择项目。',
  mmFootnote: (rate) => `按人月平均单价 ${rate}万韩元 (混合团队基准) 计算。`,

  ctaGetDiscount: '获取报价并领取折扣',
  ctaDirectConsult: '直接咨询',
  disclaimer: '本报价为自动计算的参考金额,与实际合同金额可能有所不同。准确报价以功能说明书为基础的详细咨询后确定。',

  roleLabels: {
    pm: '项目经理 (PM)',
    designer: '产品设计师',
    mobile: '移动端开发工程师',
    frontend: '前端开发工程师',
    backend: '后端开发工程师',
    ai: 'AI / ML 工程师',
    devops: 'DevOps 工程师',
  },

  close: '关闭',
  limitedOfferTemplate: (price) => `LIMITED OFFER · 不含税 ${price}万韩元`,
  modalTitle: '获取报价并领取折扣',
  modalSubtitle: '我们将在 <b>1 个工作日内提供定制报价</b>,并附上 <b>最高 15% 的折扣</b>。',
  selectedItemsTemplate: (n) => `已选项目 · ${n} 项`,
  quickName: '姓名',
  quickNamePh: '张三',
  quickPhone: '联系电话',
  quickPhonePh: '138-0000-0000',
  quickEmail: '邮箱',
  quickEmailPh: 'you@example.com',
  requestNote: '需求说明',
  aiDraftTitle: '基于所选项目生成需求初稿',
  aiDraftLabel: 'AI 生成',
  aiDraftWriting: '生成中...',
  submitQuickCta: '提交并领取折扣',
  quickSending: '发送中...',
  quickConsent: '提交即视为同意我们收集和使用您的个人信息。',

  toastNeedName: '请输入联系人姓名和电话',
  toastNeedItem: '请至少选择 1 个报价项目',
  toastInquiryReceived: (fileNote) => `报价申请已收到。${fileNote}`,
  toastFileNote: (n) => ` (请通过回复邮件发送 ${n} 个附件)`,
  toastSendFailed: '发送失败。',
  toastQuickOk: '提交成功!我们将在 1 个工作日内联系您。',
  toastNeedItemFirst: '请先选择报价项目',
  toastAiOk: 'AI 已生成需求说明。',
  toastAiTemplateOk: '已使用模板生成初稿。',
  toastAiFail: '生成失败,请手动填写。',
  errSendFail: '发送失败',

  footerTag: 'JAICYLAB',
  footerTagline: 'App Development Studio · jaicylab2009@gmail.com',
  footerCopyright: 'Copyright © JAICYLAB. All rights reserved.',
  footerHome: '首页',
  footerAbout: '公司介绍',
  footerContact: '联系我们',

  ariaPrev: '上一个',
  ariaNext: '下一个',
  ariaClose: '关闭',
}

export const ESTIMATE_CONTENT: Record<Locale, UI> = { ko, en, ja, zh }
