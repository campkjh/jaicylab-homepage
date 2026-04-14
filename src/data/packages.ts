// 패키지 프리셋 데이터 (67개)
// 각 패키지는 MVP / Basic / Premium / Deluxe / Enterprise 5단계 누적식 구성

export type TierId = 'mvp' | 'basic' | 'premium' | 'deluxe' | 'enterprise'
export const TIER_ORDER: TierId[] = ['mvp', 'basic', 'premium', 'deluxe', 'enterprise']

export const TIER_META: Record<TierId, { label: string; desc: string; color: string; ring: string; soft: string }> = {
  mvp:        { label: 'MVP',        desc: '최소 검증',     color: 'bg-slate-600',  ring: 'ring-slate-400/50',  soft: 'bg-slate-100 text-slate-700' },
  basic:      { label: 'Basic',      desc: '표준 출시',     color: 'bg-sky-500',    ring: 'ring-sky-400/60',    soft: 'bg-sky-50 text-sky-700' },
  premium:    { label: 'Premium',    desc: '완성도 +α',    color: 'bg-blue-600',   ring: 'ring-blue-500/60',   soft: 'bg-blue-50 text-blue-700' },
  deluxe:     { label: 'Deluxe',     desc: '고도화 기능',   color: 'bg-indigo-600', ring: 'ring-indigo-500/60', soft: 'bg-indigo-50 text-indigo-700' },
  enterprise: { label: 'Enterprise', desc: '대규모·컴플',   color: 'bg-slate-900',  ring: 'ring-slate-700/60',  soft: 'bg-slate-900 text-white' },
}

export type Pkg = { id: string; label: string; sub: string; category: string; iconKey: string; tiers: Record<TierId, string[]> }

// 누적식 빌더
function b(base: string[], add: Partial<Record<TierId, string[]>>): Record<TierId, string[]> {
  const r: Record<TierId, string[]> = { mvp: [], basic: [], premium: [], deluxe: [], enterprise: [] }
  let cur = [...base]
  r.mvp = [...cur]
  for (const t of ['basic', 'premium', 'deluxe', 'enterprise'] as TierId[]) {
    cur = [...cur, ...(add[t] ?? [])]
    r[t] = [...cur]
  }
  return r
}

// 공통 프리셋 조각
const LEGAL = ['se-privacy', 'se-terms']
const LEGAL_CUSTOM = ['se-privacy-custom', 'se-terms-custom', 'se-consent']
const INFRA_MIN = ['in-vercel', 'in-supabase', 'in-domain']
const INFRA_SCALE = ['in-aws', 'in-redis', 'in-k8s', 'in-apm', 'in-loadtest']
const AUTH_BASIC = ['au-signup', 'au-login', 'au-kakao']
const AUTH_MID = ['au-google', 'au-apple', 'au-pwreset', 'au-profile', 'au-avatar']
const AUTH_MORE = ['au-pass', 'au-nickname', 'au-withdraw']
const AUTH_PRO = ['au-rbac', 'au-session', 'au-device', 'au-team', 'au-invite']
const AUTH_ENT = ['au-sso', 'au-passkey', 'au-2fa']
const PUSH = ['no-fcm', 'no-apns']
const PUSH_RICH = ['no-targeting', 'no-rich', 'no-katalk-alert', 'no-email']
const CHAT_BASIC = ['no-chat-1on1', 'no-chat-read', 'no-chat-media']
const CHAT_PRO = ['no-chat-group', 'no-chat-typing', 'no-chat-emoji', 'no-chat-search']
const DS_BASIC = ['ds-ui-key', 'ds-system']
const DS_MID = ['ds-ui-mid']
const DS_PRO = ['ds-ui-full', 'ds-darkmode']
const DS_XL = ['ds-ui-xl', 'ds-motion-spec', 'ds-illustration']
const ANIM_BASIC = ['an-page', 'an-skeleton', 'an-tap']
const ANIM_MID = ['an-stagger', 'an-scroll-reveal', 'an-pull', 'an-modal']
const ANIM_RICH = ['an-parallax', 'an-hero', 'an-particle', 'an-blur', 'an-confetti']
const STORE = ['ex-appstore', 'ex-playstore', 'ex-icon']
const STORE_PRO = ['ex-screenshot', 'ex-aso', 'ex-reject']
const ANALYTICS_BASIC = ['da-kpi', 'da-charts', 'da-ga']
const ANALYTICS_PRO = ['da-funnel', 'da-cohort', 'da-segment', 'da-amplitude', 'da-ab']
const SEC_MID = ['se-encrypt', 'se-audit', 'se-2fa']
const SEC_ENT = ['se-waf', 'se-ismsp', 'se-pen-test']
const WEB_BASIC = ['pf-web', 'ds-responsive']
const APP_RN = ['pf-rn', 'pf-splash', 'pf-tabbar']

// ───────────────────────────── PACKAGES ─────────────────────────────

export const PACKAGES: Pkg[] = [
  // ─── BUSINESS / B2B (10) ───
  {
    id: 'corp', label: '회사 홈페이지', sub: '소개 · 채용 · 문의', category: 'business', iconKey: 'Home',
    tiers: b(
      ['pf-landing', ...LEGAL, ...INFRA_MIN, 'ex-cs'],
      {
        basic: ['pf-corp-site', 'ds-research', 'ds-ui-key', 'ds-responsive', 'an-page', 'an-scroll-reveal', 'ex-seo-basic', 'ex-faq'],
        premium: [...DS_MID, ...DS_BASIC.slice(1), 'ds-darkmode', 'an-hero', 'an-parallax', 'an-skeleton', 'an-tap', 'ex-seo-pro', 'ex-channel-talk', 'in-sentry', 'in-cdn'],
        deluxe: [...DS_PRO, 'an-spline', 'an-3d-tilt', 'an-cursor', 'an-blur', 'an-particle', 'ex-i18n-setup', 'ex-lang-en', 'da-ga', 'no-email'],
        enterprise: [...DS_XL, 'ds-figma', 'ex-lang-jp', 'ex-lang-cn', 'da-amplitude', 'da-funnel', 'da-ab', ...LEGAL_CUSTOM, 'se-cookie', 'in-cicd'],
      },
    ),
  },
  {
    id: 'portfolio', label: '포트폴리오 / 개인 사이트', sub: '크리에이터 · 디자이너', category: 'business', iconKey: 'User',
    tiers: b(
      ['pf-landing', ...INFRA_MIN],
      {
        basic: ['pf-corp-site', 'ds-ui-key', 'ds-responsive', 'an-page', 'an-scroll-reveal', 'ex-seo-basic'],
        premium: ['ds-ui-mid', 'ds-darkmode', 'an-hero', 'an-parallax', 'an-spline', 'an-cursor', ...LEGAL, 'in-sentry'],
        deluxe: ['ds-ui-full', 'an-3d-tilt', 'an-blur', 'an-particle', 'me-upload', 'me-cdn', 'ex-seo-pro'],
        enterprise: ['ds-ui-xl', 'ds-illustration', 'ex-i18n-setup', 'ex-lang-en', 'da-ga', 'in-cicd'],
      },
    ),
  },
  {
    id: 'law', label: '법무법인 홈페이지', sub: '상담 · 블로그 · 채용', category: 'business', iconKey: 'Scale',
    tiers: b(
      ['pf-corp-site', ...LEGAL, ...INFRA_MIN, 'ex-cs'],
      {
        basic: ['ds-ui-key', 'ds-responsive', 'an-page', 'ex-seo-basic', 'ex-faq', 'no-email', 'so-board-list', 'so-board-crud'],
        premium: ['ds-ui-mid', 'ds-system', 'ds-darkmode', 'an-scroll-reveal', 'an-hero', 'an-skeleton', ...LEGAL_CUSTOM, 'ex-seo-pro', 'ex-channel-talk', 'da-ga'],
        deluxe: ['ds-ui-full', ...AUTH_BASIC, 'au-pwreset', 'au-profile', 'no-chat-1on1', 'py-toss', 'sc-booking', 'ex-i18n-setup', 'ex-lang-en'],
        enterprise: ['ds-ui-xl', ...SEC_MID, 'in-sentry', 'in-cdn', 'da-amplitude'],
      },
    ),
  },
  {
    id: 'hospital', label: '병원 홈페이지', sub: '진료 안내 · 예약', category: 'business', iconKey: 'Hospital',
    tiers: b(
      ['pf-corp-site', 'ds-ui-key', ...LEGAL, ...INFRA_MIN, 'no-email', 'ex-cs'],
      {
        basic: ['ds-responsive', 'ds-system', 'an-page', 'an-scroll-reveal', 'ex-seo-basic', 'ex-faq', 'sc-cal', 'sc-booking', 'sc-slot'],
        premium: ['ds-ui-mid', ...AUTH_BASIC, 'au-pass', 'no-katalk-alert', 'no-sms', 'sc-recurring', 'sc-noshow', ...LEGAL_CUSTOM, 'se-consent'],
        deluxe: ['ds-ui-full', 'au-pwreset', 'au-profile', 'me-upload', 'me-pdf-view', 'no-chat-1on1', 'da-kpi', 'ex-i18n-setup'],
        enterprise: ['ds-ui-xl', 'py-toss', ...SEC_MID, 'se-ismsp', 'in-aws', 'in-cicd'],
      },
    ),
  },
  {
    id: 'clinic', label: '치과 / 의원 예약앱', sub: '예약 · 알림 · 차트', category: 'business', iconKey: 'Calendar',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-pass', ...PUSH, 'sc-cal', 'sc-booking', ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-pwreset', 'au-profile', 'sc-slot', 'sc-noshow', 'sc-recurring', 'no-katalk-alert', 'no-sms'],
        premium: [...DS_MID, ...ANIM_BASIC, 'no-chat-1on1', 'no-chat-media', 'me-upload', 'me-cdn', 'sc-qr-scan', 'sc-attendance', 'py-toss', 'py-tax-bill', ...STORE],
        deluxe: [...DS_PRO, 'py-subscription', 'py-coupon', 'py-point-earn', 'da-kpi', 'ai-ocr-clova', 'ai-chatbot', 'in-sentry', 'in-cdn'],
        enterprise: [...DS_XL, ...SEC_MID, 'se-ismsp', 'in-aws', 'in-redis', 'ex-maintenance-3m'],
      },
    ),
  },
  {
    id: 'real-estate', label: '부동산 중개 플랫폼', sub: '매물 · 지도 · 중개사', category: 'business', iconKey: 'Building',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'cm-catalog', 'cm-detail', 'lo-kakao', 'lo-gps', 'lo-address', ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-pwreset', 'au-profile', 'cm-search', 'cm-filter', 'cm-sort', 'cm-wishlist', 'lo-cluster', 'lo-autocomplete', ...PUSH],
        premium: [...DS_MID, ...ANIM_BASIC, 'au-pass', 'cm-admin-product', 'no-chat-1on1', 'no-katalk-alert', 'me-upload', 'me-cdn', 'me-video-up', 'so-report', ...STORE],
        deluxe: [...DS_PRO, 'lo-overlay', 'ai-reco-rule', 'ai-chatbot', 'sc-booking', 'py-toss', 'so-review', 'so-rating', 'da-kpi', 'da-charts'],
        enterprise: [...DS_XL, 'ai-reco-ml', ...SEC_MID, 'se-ismsp', ...INFRA_SCALE, 'ex-maintenance-3m'],
      },
    ),
  },
  {
    id: 'consulting', label: '컨설팅 / 에이전시', sub: '소개 · 케이스 스터디', category: 'business', iconKey: 'Briefcase',
    tiers: b(
      ['pf-corp-site', ...LEGAL, ...INFRA_MIN, 'ex-cs'],
      {
        basic: ['ds-ui-key', 'ds-responsive', 'an-page', 'an-scroll-reveal', 'ex-seo-basic', 'ex-faq', 'no-email'],
        premium: ['ds-ui-mid', 'ds-system', 'an-hero', 'an-parallax', 'so-board-list', 'so-board-crud', 'ex-seo-pro', 'ex-channel-talk'],
        deluxe: ['ds-ui-full', 'an-3d-tilt', 'an-spline', 'sc-booking', 'no-chat-1on1', 'ex-i18n-setup', 'ex-lang-en', 'da-ga'],
        enterprise: ['ds-ui-xl', 'au-sso', ...SEC_MID, 'in-aws', 'in-cicd'],
      },
    ),
  },
  {
    id: 'accounting', label: '세무 · 회계 서비스', sub: '고객 관리 · 세금계산서', category: 'business', iconKey: 'Calculator',
    tiers: b(
      ['pf-web', 'pf-admin', ...AUTH_BASIC, 'au-pwreset', 'au-profile', ...LEGAL, ...INFRA_MIN],
      {
        basic: ['ds-ui-key', 'ds-system', 'ds-responsive', 'pf-corp-site', 'no-email', 'no-sms', 'me-file', 'me-pdf-view'],
        premium: ['ds-ui-mid', ...ANIM_BASIC, 'au-pass', 'py-tax-bill', 'py-cash-receipt', 'da-excel', 'da-pdf', 'no-chat-1on1', ...LEGAL_CUSTOM],
        deluxe: ['ds-ui-full', 'py-toss', 'py-subscription', 'da-kpi', 'da-charts', 'ai-ocr-custom', 'ai-summary', 'in-sentry'],
        enterprise: ['ds-ui-xl', 'au-sso', 'au-rbac', ...SEC_MID, 'se-ismsp', ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'construction', label: '건설 / 시공 회사', sub: '프로젝트 갤러리 · 견적', category: 'business', iconKey: 'HardHat',
    tiers: b(
      ['pf-corp-site', ...LEGAL, ...INFRA_MIN, 'ex-cs'],
      {
        basic: ['ds-ui-key', 'ds-responsive', 'an-page', 'an-scroll-reveal', 'me-upload', 'me-cdn', 'ex-seo-basic'],
        premium: ['ds-ui-mid', 'ds-system', 'an-hero', 'an-parallax', 'an-skeleton', 'me-video-up', 'me-hls', 'sc-booking', 'no-email', 'no-sms'],
        deluxe: ['ds-ui-full', 'an-3d-tilt', 'an-spline', 'ai-chatbot', 'no-chat-1on1', 'ex-i18n-setup', 'ex-lang-en', 'da-ga'],
        enterprise: ['ds-ui-xl', ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'edu-biz', label: '학원 운영 관리', sub: '학생 · 출결 · 결제', category: 'business', iconKey: 'BookOpen',
    tiers: b(
      [...APP_RN, 'pf-admin', ...AUTH_BASIC, ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: [...DS_BASIC, 'au-pwreset', 'au-profile', 'au-pass', 'sc-cal', 'sc-attendance', 'sc-shift', 'no-katalk-alert', 'no-sms'],
        premium: [...DS_MID, ...ANIM_BASIC, 'sc-qr-scan', 'py-toss', 'py-subscription', 'py-coupon', 'no-chat-1on1', 'da-kpi', ...STORE],
        deluxe: [...DS_PRO, 'sc-auto-shift', 'gm-attendance', 'gm-badge', 'py-tax-bill', 'ai-chatbot', 'da-charts', 'da-funnel'],
        enterprise: [...DS_XL, 'au-rbac', ...SEC_MID, ...INFRA_SCALE, 'ex-maintenance-3m'],
      },
    ),
  },

  // ─── COMMERCE (10) ───
  {
    id: 'shop', label: '쇼핑몰 (종합)', sub: '상품 · 결제 · 배송', category: 'commerce', iconKey: 'ShoppingBag',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'cm-catalog', 'cm-detail', 'cm-cart', 'cm-order', 'py-toss', ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-pwreset', 'au-profile', 'cm-options', 'cm-search', 'cm-filter', 'cm-sort', 'cm-stock', 'cm-order-history', 'cm-shipping-addr', 'cm-shipping-track', 'py-iap-ios', 'py-iap-aos', ...PUSH, 'cm-admin-product', 'cm-admin-order'],
        premium: [...DS_MID, ...ANIM_BASIC, 'an-like', 'an-snap', 'cm-wishlist', 'cm-recent', 'cm-review', 'cm-qna', 'cm-section', 'cm-order-cancel', 'py-coupon', 'py-point-earn', 'py-point-use', 'py-tax-bill', 'py-cash-receipt', 'no-katalk-alert', 'no-email', 'se-consent', 'in-cdn', 'in-sentry', ...STORE],
        deluxe: [...DS_PRO, 'cm-event', 'cm-flash', 'cm-grade', 'cm-gift', 'cm-options-comb', 'cm-search-image', 'cm-soldout', 'py-naverpay', 'py-kakaopay', 'py-applepay', 'py-samsungpay', 'py-card', 'py-subscription', 'py-refund-auto', 'so-review', 'so-share', 'no-rich', 'no-chat-1on1', ...ANALYTICS_BASIC, 'in-cicd', 'in-backup'],
        enterprise: [...DS_XL, 'cm-multiseller', 'cm-subscribe-box', 'py-stripe', 'py-paypal', 'py-escrow', 'py-corp', 'py-settle', 'py-dashboard', 'py-excel', ...ANALYTICS_PRO, 'da-realtime', 'da-bigquery', ...SEC_MID, ...SEC_ENT, ...INFRA_SCALE, 'ex-maintenance-3m'],
      },
    ),
  },
  {
    id: 'fashion', label: '패션 브랜드 쇼핑몰', sub: '룩북 · 스타일링', category: 'commerce', iconKey: 'Shirt',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'cm-catalog', 'cm-detail', 'cm-cart', 'cm-order', 'py-toss', ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'ds-darkmode', 'au-profile', 'cm-options', 'cm-search', 'cm-filter', 'cm-wishlist', 'cm-order-history', 'cm-shipping-addr', ...PUSH, 'cm-admin-product'],
        premium: [...DS_MID, ...ANIM_MID, 'an-parallax', 'an-hero', 'cm-section', 'cm-review', 'cm-event', 'me-upload', 'me-cdn', 'me-video-up', 'py-coupon', 'py-point-earn', 'py-kakaopay', 'py-naverpay', 'no-katalk-alert', ...STORE],
        deluxe: [...DS_PRO, 'cm-flash', 'cm-grade', 'cm-gift', 'cm-options-comb', 'cm-search-image', 'py-subscription', 'so-review', 'so-share', 'so-follow', 'ai-reco-rule', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, 'cm-multiseller', 'ai-reco-ml', 'py-stripe', 'py-settle', ...ANALYTICS_PRO, ...SEC_MID, ...INFRA_SCALE, 'ex-maintenance-3m'],
      },
    ),
  },
  {
    id: 'grocery', label: '식료품 / 새벽배송', sub: '신선 · 타임세일 · 배송', category: 'commerce', iconKey: 'ShoppingCart',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'cm-catalog', 'cm-detail', 'cm-cart', 'cm-order', 'py-toss', 'lo-kakao', 'lo-address', ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-profile', 'au-pass', 'cm-options', 'cm-search', 'cm-filter', 'cm-order-history', 'cm-shipping-addr', 'cm-shipping-time', ...PUSH, 'cm-stock', 'cm-admin-product', 'cm-admin-order'],
        premium: [...DS_MID, ...ANIM_BASIC, 'cm-soldout', 'cm-recent', 'cm-section', 'cm-flash', 'py-coupon', 'py-point-earn', 'py-kakaopay', 'py-naverpay', 'lo-track', 'lo-geofence', 'no-katalk-alert', 'no-rich', ...STORE],
        deluxe: [...DS_PRO, 'cm-subscribe-box', 'cm-grade', 'cm-gift', 'py-subscription', 'py-card', 'lo-route-opt', 'lo-eta', 'ai-reco-rule', ...ANALYTICS_BASIC, 'in-redis'],
        enterprise: [...DS_XL, 'lo-rider-match', 'cm-multiseller', 'py-settle', ...ANALYTICS_PRO, ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'farm', label: '농산물 직거래', sub: '산지 · 생산자 · 후기', category: 'commerce', iconKey: 'Leaf',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'cm-catalog', 'cm-detail', 'cm-cart', 'cm-order', 'py-toss', ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-profile', 'cm-options', 'cm-search', 'cm-filter', 'cm-order-history', 'cm-shipping-addr', 'cm-shipping-track', ...PUSH, 'so-review', 'so-rating'],
        premium: [...DS_MID, ...ANIM_BASIC, 'lo-kakao', 'lo-address', 'cm-section', 'cm-event', 'me-upload', 'me-cdn', 'me-video-up', 'py-coupon', 'py-point-earn', 'no-katalk-alert', ...STORE],
        deluxe: [...DS_PRO, 'cm-subscribe-box', 'cm-grade', 'py-subscription', 'py-tax-bill', 'so-follow', 'so-feed-follow', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, 'cm-multiseller', 'py-settle', 'py-corp', ...ANALYTICS_PRO, ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'luxury', label: '명품 · 프리미엄', sub: '큐레이션 · 정품인증', category: 'commerce', iconKey: 'Gem',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-pass', 'cm-catalog', 'cm-detail', 'cm-cart', 'cm-order', 'py-toss', ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'ds-darkmode', 'au-profile', 'au-bio', 'cm-options', 'cm-search', 'cm-filter', 'cm-wishlist', 'cm-order-history', 'cm-shipping-addr', ...PUSH],
        premium: [...DS_MID, ...ANIM_MID, 'an-hero', 'an-parallax', 'an-3d-tilt', 'cm-section', 'cm-review', 'me-upload', 'me-cdn', 'me-video-up', 'py-coupon', 'py-kakaopay', 'py-applepay', ...STORE],
        deluxe: [...DS_PRO, 'an-spline', 'cm-flash', 'cm-grade', 'cm-gift', 'cm-search-image', 'py-subscription', 'py-stripe', 'ai-vision', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, 'cm-multiseller', 'ai-reco-ml', 'py-paypal', 'py-corp', ...ANALYTICS_PRO, ...SEC_MID, ...SEC_ENT, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'used', label: '중고거래 C2C', sub: '동네 · 채팅 · 직거래', category: 'commerce', iconKey: 'Repeat',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-profile', 'au-pass', 'cm-catalog', 'cm-detail', 'lo-kakao', 'lo-gps', 'lo-address', 'no-chat-1on1', ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-avatar', 'au-nickname', 'cm-search', 'cm-filter', 'cm-wishlist', 'cm-recent', 'lo-autocomplete', 'lo-reverse', 'no-chat-media', 'so-review', 'so-rating', 'so-report', 'so-block'],
        premium: [...DS_MID, ...ANIM_BASIC, 'an-like', 'au-suspend', 'lo-geofence', 'cm-section', 'me-upload', 'me-cdn', 'me-resize', 'me-crop', 'no-katalk-alert', ...STORE],
        deluxe: [...DS_PRO, 'cm-search-image', 'py-toss', 'py-escrow', 'py-coupon', 'ai-vision', 'so-follow', 'gm-badge', 'gm-level', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, 'ai-reco-ml', 'so-filter-ai', ...SEC_MID, 'se-waf', ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'b2b-market', label: 'B2B 마켓플레이스', sub: '법인 · 대량주문 · 세금계산서', category: 'commerce', iconKey: 'Factory',
    tiers: b(
      [...APP_RN, 'pf-admin', ...AUTH_BASIC, 'au-pwreset', 'au-profile', 'au-pass', 'cm-catalog', 'cm-detail', 'cm-cart', 'cm-order', 'py-toss', ...LEGAL, ...INFRA_MIN],
      {
        basic: [...DS_BASIC, 'au-rbac', 'au-team', 'cm-options', 'cm-options-comb', 'cm-search', 'cm-filter', 'cm-stock', 'cm-order-history', 'cm-shipping-addr', ...PUSH, 'cm-admin-product', 'cm-admin-order'],
        premium: [...DS_MID, ...ANIM_BASIC, 'py-tax-bill', 'py-cash-receipt', 'py-corp', 'py-account', 'py-virtualacc', 'no-email', 'no-chat-1on1', ...STORE],
        deluxe: [...DS_PRO, 'py-settle', 'py-coupon-target', 'py-dashboard', 'py-excel', 'cm-multiseller', ...ANALYTICS_BASIC, 'da-excel', 'da-pdf', 'in-cicd'],
        enterprise: [...DS_XL, 'au-sso', ...ANALYTICS_PRO, ...SEC_MID, 'se-ismsp', ...INFRA_SCALE, 'ex-maintenance-3m'],
      },
    ),
  },
  {
    id: 'auction', label: '경매 플랫폼', sub: '실시간 입찰 · 낙찰', category: 'commerce', iconKey: 'Gavel',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-pass', 'cm-catalog', 'cm-detail', 'py-toss', ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-profile', 'sc-bid', 'cm-stock', 'cm-order', 'cm-order-history', 'no-katalk-alert', 'no-rich'],
        premium: [...DS_MID, ...ANIM_BASIC, 'da-realtime', 'me-upload', 'me-cdn', 'me-video-up', 'py-escrow', 'py-refund-auto', 'so-review', 'so-rating', ...STORE, 'in-redis'],
        deluxe: [...DS_PRO, 'py-point-earn', 'cm-event', 'cm-flash', 'ai-vision', 'so-follow', 'gm-badge', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, 'py-stripe', 'ai-reco-ml', ...ANALYTICS_PRO, ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'subscription', label: '구독 커머스', sub: '정기배송 · 큐레이션', category: 'commerce', iconKey: 'Repeat',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'cm-catalog', 'cm-detail', 'cm-cart', 'cm-order', 'py-toss', 'py-subscription', ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-profile', 'cm-options', 'cm-order-history', 'cm-shipping-addr', 'cm-shipping-time', 'py-card', 'py-trial', 'py-refund-auto', ...PUSH],
        premium: [...DS_MID, ...ANIM_BASIC, 'cm-subscribe-box', 'cm-grade', 'cm-section', 'py-annual', 'py-coupon', 'py-point-earn', 'no-katalk-alert', 'no-rich', ...STORE],
        deluxe: [...DS_PRO, 'cm-review', 'cm-gift', 'py-refund-form', 'py-tax-bill', 'ai-reco-rule', 'so-follow', ...ANALYTICS_BASIC, 'da-funnel', 'da-cohort'],
        enterprise: [...DS_XL, 'py-stripe', 'py-paypal', ...ANALYTICS_PRO, ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'crowdfunding', label: '크라우드펀딩', sub: '프로젝트 · 후원 · 리워드', category: 'commerce', iconKey: 'TrendingUp',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'cm-catalog', 'cm-detail', 'py-toss', ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-profile', 'au-pass', 'cm-options', 'cm-search', 'cm-filter', 'cm-order', 'cm-order-history', ...PUSH, 'cm-admin-product', 'so-comment', 'so-like'],
        premium: [...DS_MID, ...ANIM_BASIC, 'an-progress', 'an-count', 'me-upload', 'me-cdn', 'me-video-up', 'me-hls', 'py-coupon', 'py-point-earn', 'no-katalk-alert', ...STORE],
        deluxe: [...DS_PRO, 'py-escrow', 'py-tax-bill', 'so-follow', 'so-feed-follow', 'so-share', 'so-review', ...ANALYTICS_BASIC, 'gm-referral'],
        enterprise: [...DS_XL, 'cm-multiseller', 'py-settle', ...ANALYTICS_PRO, ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },

  // ─── FOOD & O2O (8) ───
  {
    id: 'delivery', label: '배달 앱', sub: '음식 · 위치 · 라이더', category: 'food', iconKey: 'UtensilsCrossed',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'cm-catalog', 'cm-detail', 'cm-cart', 'cm-order', 'lo-kakao', 'lo-gps', 'lo-address', 'py-toss', ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-pass', 'au-profile', 'cm-options', 'cm-order-history', 'cm-shipping-addr', 'lo-track', 'lo-route', 'lo-eta', 'lo-geofence', 'py-kakaopay', 'py-naverpay', 'no-katalk-alert', 'so-review', 'so-rating'],
        premium: [...DS_MID, ...ANIM_BASIC, 'au-google', 'cm-admin-product', 'cm-admin-order', 'cm-review', 'cm-section', 'lo-route-opt', 'lo-rider-match', 'lo-pickup', 'lo-autocomplete', 'lo-reverse', 'py-coupon', 'py-point-earn', 'no-rich', ...STORE],
        deluxe: [...DS_PRO, 'cm-event', 'cm-flash', 'cm-grade', 'py-card', 'py-settle', 'py-dashboard', 'ai-chatbot', 'ai-reco-rule', 'no-chat-1on1', 'sc-attendance', 'da-kpi', 'da-charts', 'da-realtime', 'se-encrypt', 'in-redis', 'in-cicd', 'in-backup'],
        enterprise: [...DS_XL, 'cm-multiseller', 'cm-subscribe-box', 'py-escrow', 'py-tax-bill', 'py-corp', 'py-stripe', 'ai-reco-ml', 'da-funnel', 'da-cohort', 'da-bigquery', 'se-audit', 'se-waf', 'se-ismsp', ...INFRA_SCALE, 'ex-maintenance-3m'],
      },
    ),
  },
  {
    id: 'reservation', label: '맛집 예약', sub: '실시간 예약 · 노쇼 방지', category: 'food', iconKey: 'CalendarCheck',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-pass', 'sc-cal', 'sc-booking', 'sc-slot', 'lo-kakao', 'lo-address', ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-profile', 'sc-noshow', 'no-katalk-alert', 'no-sms', 'cm-search', 'cm-filter', 'so-review', 'so-rating'],
        premium: [...DS_MID, ...ANIM_BASIC, 'sc-recurring', 'sc-waiting', 'me-upload', 'me-cdn', 'py-toss', 'py-coupon', 'lo-cluster', 'lo-autocomplete', ...STORE],
        deluxe: [...DS_PRO, 'sc-qr-scan', 'py-point-earn', 'gm-attendance', 'ai-chatbot', 'ai-reco-rule', 'so-follow', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, 'ai-reco-ml', ...ANALYTICS_PRO, ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'pos', label: '매장 POS / 오더', sub: '주문 · 결제 · 주방전달', category: 'food', iconKey: 'Receipt',
    tiers: b(
      ['pf-web', 'pf-admin', ...AUTH_BASIC, 'au-pwreset', 'cm-catalog', 'cm-detail', 'cm-options', 'cm-cart', 'cm-order', 'py-toss', ...LEGAL, ...INFRA_MIN],
      {
        basic: [...DS_BASIC, 'au-profile', 'au-rbac', 'cm-stock', 'cm-admin-product', 'cm-admin-order', 'sc-qr-gen', 'sc-qr-scan', 'no-sms'],
        premium: [...DS_MID, ...ANIM_BASIC, 'py-cash-receipt', 'py-tax-bill', 'da-kpi', 'da-charts', 'da-realtime', 'me-file', 'me-pdf-view', 'in-sentry'],
        deluxe: [...DS_PRO, 'py-settle', 'py-point-earn', 'py-coupon', 'da-excel', 'da-pdf', 'sc-shift', 'sc-attendance'],
        enterprise: [...DS_XL, 'cm-multiseller', 'au-sso', ...SEC_MID, 'se-ismsp', ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'cafe', label: '카페 / 스탬프 적립', sub: '도장 · 쿠폰 · 리오더', category: 'food', iconKey: 'Coffee',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-profile', 'cm-catalog', 'cm-detail', 'cm-cart', 'cm-order', 'py-toss', 'sc-qr-scan', ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'cm-options', 'cm-order-history', 'gm-attendance', 'gm-streak', 'py-coupon', 'py-point-earn', 'no-katalk-alert'],
        premium: [...DS_MID, ...ANIM_BASIC, 'gm-badge', 'gm-level', 'gm-reward', 'lo-kakao', 'lo-gps', 'me-upload', 'me-cdn', ...STORE],
        deluxe: [...DS_PRO, 'sc-qr-gen', 'cm-section', 'cm-grade', 'cm-flash', 'ai-reco-rule', 'so-review', 'so-share', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, 'cm-multiseller', 'py-settle', ...ANALYTICS_PRO, ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'ghost-kitchen', label: '공유주방', sub: '브랜드 · 주방 · 예약', category: 'food', iconKey: 'ChefHat',
    tiers: b(
      [...APP_RN, 'pf-admin', ...AUTH_BASIC, 'au-pass', 'sc-cal', 'sc-booking', 'sc-slot', 'py-toss', ...LEGAL, ...INFRA_MIN],
      {
        basic: [...DS_BASIC, 'au-rbac', 'au-team', 'sc-shift', 'cm-catalog', 'cm-detail', 'no-katalk-alert', 'no-sms', 'lo-kakao'],
        premium: [...DS_MID, ...ANIM_BASIC, 'py-subscription', 'py-tax-bill', 'me-upload', 'me-video-up', 'sc-qr-scan', 'da-kpi', 'da-charts'],
        deluxe: [...DS_PRO, 'py-settle', 'cm-admin-order', 'ai-chatbot', 'da-funnel', 'no-chat-1on1'],
        enterprise: [...DS_XL, 'cm-multiseller', 'au-sso', ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'catering', label: '케이터링 / 출장요리', sub: '견적 · 메뉴 선택', category: 'food', iconKey: 'Utensils',
    tiers: b(
      ['pf-web', ...APP_RN, ...AUTH_BASIC, 'cm-catalog', 'cm-detail', 'sc-booking', 'py-toss', ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-profile', 'cm-options', 'cm-cart', 'cm-order', 'cm-order-history', 'sc-cal', 'sc-slot', ...PUSH, 'no-email'],
        premium: [...DS_MID, ...ANIM_BASIC, 'sc-noshow', 'no-chat-1on1', 'me-upload', 'me-cdn', 'py-coupon', 'so-review', 'so-rating', ...STORE],
        deluxe: [...DS_PRO, 'py-tax-bill', 'py-corp', 'lo-address', 'lo-route', 'ai-chatbot', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, 'py-settle', ...ANALYTICS_PRO, ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'home-meal', label: '반찬가게 / 가정간편식', sub: '밀키트 · 정기배송', category: 'food', iconKey: 'Soup',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'cm-catalog', 'cm-detail', 'cm-cart', 'cm-order', 'py-toss', ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-profile', 'cm-options', 'cm-search', 'cm-filter', 'cm-order-history', 'cm-shipping-addr', 'cm-shipping-time', ...PUSH, 'cm-admin-product', 'cm-admin-order'],
        premium: [...DS_MID, ...ANIM_BASIC, 'cm-stock', 'cm-subscribe-box', 'cm-section', 'py-subscription', 'py-coupon', 'py-point-earn', 'no-katalk-alert', ...STORE],
        deluxe: [...DS_PRO, 'cm-review', 'cm-flash', 'cm-grade', 'me-upload', 'me-cdn', 'me-video-up', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, 'py-settle', ...ANALYTICS_PRO, ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'chef', label: '쉐프 매칭', sub: '요리사 · 출장 · 클래스', category: 'food', iconKey: 'ChefHat',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-profile', 'au-avatar', 'sc-booking', 'sc-cal', 'sc-match', 'no-chat-1on1', 'py-toss', ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-pass', 'sc-slot', 'sc-noshow', 'so-review', 'so-rating', ...PUSH, 'no-katalk-alert'],
        premium: [...DS_MID, ...ANIM_BASIC, 'lo-kakao', 'lo-gps', 'lo-address', 'me-upload', 'me-cdn', 'me-video-up', 'py-escrow', 'py-coupon', ...STORE],
        deluxe: [...DS_PRO, 'py-settle', 'py-tax-bill', 'ai-chatbot', 'so-follow', 'gm-badge', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, ...ANALYTICS_PRO, ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },

  // ─── EDUCATION (6) ───
  {
    id: 'edu', label: '교육 / LMS', sub: '강의 · 진도 · 결제', category: 'education', iconKey: 'BookOpen',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-google', 'me-video-up', 'me-hls', 'py-toss', ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-web', 'pf-admin', ...DS_BASIC, 'au-profile', 'au-pwreset', 'me-podcast', 'me-pdf-view', 'so-comment', 'so-rating', 'py-subscription', 'py-coupon', 'gm-attendance', 'gm-streak'],
        premium: [...DS_MID, ...ANIM_BASIC, 'an-progress', 'me-drm', 'me-audio', 'so-review', 'so-report', 'gm-badge', 'gm-level', 'gm-mission', 'gm-leaderboard', 'py-tax-bill', 'no-katalk-alert', 'no-email', 'da-kpi', 'da-funnel', ...STORE],
        deluxe: [...DS_PRO, 'an-count', 'an-confetti', 'me-webrtc-1on1', 'me-recording', 'me-screenshare', 'so-feed-follow', 'so-search', 'gm-challenge', 'gm-reward', 'gm-referral', 'ai-chatbot', 'ai-stt', 'ai-summary', 'da-charts', 'da-ga', 'da-amplitude', 'se-consent', 'in-cdn', 'ex-seo-basic'],
        enterprise: [...DS_XL, 'ai-rag', 'ai-tts', 'ai-translate', 'ai-reco-ml', 'me-webrtc-group', 'me-live', 'au-sso', 'au-passkey', 'se-encrypt', 'se-audit', 'se-ismsp', ...INFRA_SCALE, 'ex-lang-en', 'ex-lang-jp', 'ex-maintenance-3m', 'ex-aso'],
      },
    ),
  },
  {
    id: 'kids-edu', label: '키즈 교육', sub: '게이미피케이션 · 부모', category: 'education', iconKey: 'Baby',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-profile', 'me-video-up', 'me-hls', ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-avatar', 'me-audio', 'so-comment', 'gm-attendance', 'gm-badge', 'gm-streak', 'se-youth'],
        premium: [...DS_MID, ...ANIM_MID, 'an-confetti', 'an-particle', 'gm-level', 'gm-mission', 'gm-leaderboard', 'gm-collection', 'py-toss', 'py-subscription', 'no-katalk-alert', ...STORE],
        deluxe: [...DS_PRO, 'gm-challenge', 'gm-reward', 'gm-roulette', 'ai-stt', 'ai-tts', 'me-webrtc-1on1', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, 'ai-reco-ml', ...SEC_MID, ...INFRA_SCALE, 'ex-maintenance-3m'],
      },
    ),
  },
  {
    id: 'language', label: '어학 / 언어교환', sub: '스피킹 · 튜터 매칭', category: 'education', iconKey: 'Languages',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-profile', 'au-avatar', 'no-chat-1on1', 'me-webrtc-1on1', ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-google', 'au-apple', 'so-follow', 'so-rating', 'so-review', 'gm-streak', 'gm-attendance'],
        premium: [...DS_MID, ...ANIM_BASIC, 'sc-booking', 'sc-match', 'ai-stt', 'ai-tts', 'ai-translate', 'py-toss', 'py-subscription', 'no-katalk-alert', ...STORE],
        deluxe: [...DS_PRO, 'ai-chatbot', 'ai-rag', 'me-webrtc-group', 'gm-leaderboard', 'gm-badge', ...ANALYTICS_BASIC, 'ex-i18n-setup', 'ex-lang-en', 'ex-lang-jp'],
        enterprise: [...DS_XL, 'ai-reco-ml', 'me-live', ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'bootcamp', label: '코딩 부트캠프', sub: '과정 · 과제 · 취업', category: 'education', iconKey: 'Terminal',
    tiers: b(
      ['pf-web', 'pf-admin', ...AUTH_BASIC, 'au-google', 'au-profile', 'me-video-up', 'me-hls', 'py-toss', ...LEGAL, ...INFRA_MIN],
      {
        basic: [...DS_BASIC, 'me-pdf-view', 'me-file', 'so-comment', 'so-like', 'gm-attendance', 'gm-streak', ...PUSH, 'no-email'],
        premium: [...DS_MID, ...ANIM_BASIC, 'gm-badge', 'gm-level', 'py-subscription', 'py-installment', 'no-chat-1on1', 'no-chat-group', 'so-board-list', 'so-board-crud', 'so-comment', ...STORE],
        deluxe: [...DS_PRO, 'me-webrtc-1on1', 'me-screenshare', 'me-recording', 'ai-chatbot', 'ai-summary', 'gm-challenge', ...ANALYTICS_BASIC, 'da-funnel'],
        enterprise: [...DS_XL, 'au-sso', ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'tutor', label: '과외 매칭', sub: '선생님 · 학생 · 정산', category: 'education', iconKey: 'GraduationCap',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-profile', 'au-avatar', 'sc-booking', 'sc-match', 'no-chat-1on1', 'py-toss', ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-pass', 'sc-cal', 'sc-slot', 'sc-noshow', 'so-review', 'so-rating', 'lo-kakao', 'lo-address', 'no-katalk-alert'],
        premium: [...DS_MID, ...ANIM_BASIC, 'me-upload', 'me-cdn', 'me-video-up', 'py-escrow', 'py-coupon', 'py-point-earn', 'lo-autocomplete', ...STORE],
        deluxe: [...DS_PRO, 'me-webrtc-1on1', 'me-screenshare', 'py-settle', 'py-tax-bill', 'ai-chatbot', 'gm-badge', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, 'ai-reco-ml', ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'cert', label: '자격증 / 시험 강의', sub: '문제 은행 · 모의고사', category: 'education', iconKey: 'Award',
    tiers: b(
      [...APP_RN, 'pf-web', ...AUTH_BASIC, 'au-profile', 'me-video-up', 'me-hls', ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'me-pdf-view', 'me-file', 'py-toss', 'py-subscription', 'py-coupon', 'so-comment', 'so-rating'],
        premium: [...DS_MID, ...ANIM_BASIC, 'an-progress', 'gm-attendance', 'gm-streak', 'gm-badge', 'gm-level', 'me-drm', 'me-audio', ...STORE],
        deluxe: [...DS_PRO, 'ai-chatbot', 'ai-summary', 'gm-challenge', 'gm-leaderboard', 'so-follow', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, 'ai-rag', 'ai-reco-ml', ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },

  // ─── HEALTH & WELLNESS (6) ───
  {
    id: 'fitness', label: '헬스 / 피트니스', sub: '운동 기록 · 챌린지', category: 'health', iconKey: 'Dumbbell',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-google', 'au-apple', 'lo-gps', 'gm-attendance', 'gm-streak', ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: [...DS_BASIC, 'au-profile', 'au-avatar', 'lo-route', 'me-upload', 'me-cdn', 'gm-badge', 'gm-mission', 'so-follow', 'so-feed-follow', 'so-like', 'da-kpi'],
        premium: [...DS_MID, ...ANIM_BASIC, 'an-progress', 'an-count', 'an-confetti', 'pf-widget-ios', 'pf-watch', 'gm-level', 'gm-leaderboard', 'gm-challenge', 'gm-reward', 'so-share', 'no-rich', 'da-charts', 'da-ga', ...STORE],
        deluxe: [...DS_PRO, 'an-particle', 'pf-widget-android', 'ai-pose', 'ai-tts', 'ai-stt', 'so-dm', 'so-review', 'py-toss', 'py-subscription', 'no-chat-1on1', 'da-amplitude', 'da-funnel', 'in-cdn', 'in-sentry'],
        enterprise: [...DS_XL, 'ai-reco-ml', 'ai-face', 'me-webrtc-1on1', 'me-live', 'au-sso', 'se-encrypt', 'se-audit', 'se-ismsp', ...INFRA_SCALE, 'ex-lang-en', 'ex-maintenance-3m', 'ex-aso'],
      },
    ),
  },
  {
    id: 'yoga', label: '요가 / 필라테스', sub: '클래스 · 비디오 · 기록', category: 'health', iconKey: 'Heart',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-profile', 'me-video-up', 'me-hls', 'gm-attendance', ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-apple', 'au-google', 'me-audio', 'gm-streak', 'gm-badge', 'sc-cal', 'sc-booking'],
        premium: [...DS_MID, ...ANIM_BASIC, 'an-progress', 'pf-widget-ios', 'gm-level', 'gm-leaderboard', 'gm-reward', 'py-toss', 'py-subscription', 'so-follow', 'so-like', ...STORE],
        deluxe: [...DS_PRO, 'ai-pose', 'me-webrtc-1on1', 'me-live', 'so-review', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, 'ai-reco-ml', ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'mental', label: '멘탈 헬스 / 명상', sub: 'CBT · 일기 · 가이드', category: 'health', iconKey: 'Brain',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-profile', 'me-audio', 'me-podcast', ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: [...DS_BASIC, 'ds-darkmode', 'au-apple', 'au-google', 'gm-streak', 'gm-attendance', 'se-consent', 'so-board-list'],
        premium: [...DS_MID, ...ANIM_MID, 'an-particle', 'an-blur', 'gm-badge', 'gm-mission', 'py-toss', 'py-subscription', 'so-comment', ...STORE],
        deluxe: [...DS_PRO, 'ai-chatbot', 'ai-sentiment', 'ai-tts', 'me-live', 'me-webrtc-1on1', 'so-follow', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, 'ai-rag', 'ai-reco-ml', 'se-encrypt', 'se-audit', 'se-ismsp', ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'diet', label: '다이어트 / 식단', sub: '칼로리 · 식단 기록', category: 'health', iconKey: 'Apple',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-profile', 'gm-attendance', 'gm-streak', ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: [...DS_BASIC, 'au-google', 'au-apple', 'me-upload', 'me-cdn', 'me-resize', 'gm-badge', 'gm-mission', 'da-kpi'],
        premium: [...DS_MID, ...ANIM_BASIC, 'an-progress', 'an-count', 'pf-widget-ios', 'ai-ocr-clova', 'ai-vision', 'py-toss', 'py-subscription', 'so-follow', 'so-feed-follow', ...STORE],
        deluxe: [...DS_PRO, 'ai-chatbot', 'ai-summary', 'gm-challenge', 'gm-leaderboard', 'so-dm', 'so-review', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, 'ai-reco-ml', ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'pet', label: '반려동물 케어', sub: '산책 · 병원 · 커뮤니티', category: 'health', iconKey: 'Dog',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-profile', 'au-avatar', 'lo-kakao', 'lo-gps', ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'lo-route', 'lo-address', 'me-upload', 'me-cdn', 'so-follow', 'so-feed-follow', 'so-like', 'sc-cal', 'sc-booking', 'gm-attendance'],
        premium: [...DS_MID, ...ANIM_BASIC, 'gm-badge', 'gm-streak', 'cm-catalog', 'cm-detail', 'cm-cart', 'cm-order', 'py-toss', 'no-chat-1on1', 'so-dm', ...STORE],
        deluxe: [...DS_PRO, 'sc-match', 'ai-chatbot', 'ai-vision', 'me-video-up', 'so-review', 'so-rating', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, 'ai-reco-ml', ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'medical', label: '의료 상담', sub: '원격진료 · 처방 · 약국', category: 'health', iconKey: 'Stethoscope',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-pass', 'au-profile', 'no-chat-1on1', 'me-webrtc-1on1', 'py-toss', ...PUSH, ...LEGAL_CUSTOM, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-pwreset', 'au-bio', 'sc-cal', 'sc-booking', 'sc-slot', 'no-katalk-alert', 'me-pdf-view', 'se-encrypt'],
        premium: [...DS_MID, ...ANIM_BASIC, 'me-screenshare', 'me-file', 'py-tax-bill', 'py-refund-auto', 'ai-ocr-custom', 'ai-chatbot', 'lo-kakao', 'lo-address', ...STORE],
        deluxe: [...DS_PRO, 'ai-summary', 'ai-vision', 'se-audit', 'se-2fa', ...ANALYTICS_BASIC, 'in-sentry'],
        enterprise: [...DS_XL, 'au-sso', 'au-passkey', 'se-ismsp', 'se-pen-test', ...INFRA_SCALE, 'ex-maintenance-3m'],
      },
    ),
  },

  // ─── COMMUNITY & SOCIAL (7) ───
  {
    id: 'community', label: '커뮤니티 / SNS', sub: '게시판 · 피드 · DM', category: 'community', iconKey: 'Users2',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'so-board-list', 'so-board-crud', 'so-comment', 'so-like', ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: [...DS_BASIC, 'ds-darkmode', 'an-page', 'an-pull', 'an-skeleton', 'an-like', 'au-google', 'au-apple', 'au-profile', 'au-avatar', 'au-nickname', 'so-board-cat', 'so-board-image', 'so-reply', 'so-bookmark', 'so-follow', 'so-hashtag', 'so-search', 'so-report', 'so-block'],
        premium: [...DS_MID, 'an-stagger', 'an-scroll-reveal', 'an-shared', 'an-modal', 'so-mention', 'so-dm', 'so-filter', 'so-feed-time', 'so-feed-follow', 'so-share', 'me-upload', 'me-cdn', 'me-resize', 'me-thumb', 'no-targeting', 'no-rich', ...STORE],
        deluxe: [...DS_PRO, 'an-particle', 'an-confetti', 'an-blur', 'so-reply-tree', 'so-feed-rank', 'so-story', 'so-shorts', 'so-review', 'so-search-elastic', 'so-filter-ai', 'me-video-up', 'me-hls', 'me-filter', 'me-webrtc-1on1', 'gm-badge', 'gm-level', 'gm-streak', 'da-kpi', 'da-ga'],
        enterprise: [...DS_XL, 'ai-chatbot', 'ai-reco-ml', 'ai-sentiment', 'me-webrtc-group', 'me-live', 'me-drm', 'au-sso', 'au-passkey', 'se-encrypt', 'se-audit', 'se-ismsp', ...INFRA_SCALE, 'ex-maintenance-3m'],
      },
    ),
  },
  {
    id: 'dating', label: '데이팅 / 매칭', sub: '프로필 · 스와이프 · 채팅', category: 'community', iconKey: 'Heart',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-pass', 'au-profile', 'au-avatar', 'an-tinder', 'no-chat-1on1', ...PUSH, ...LEGAL_CUSTOM, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-nickname', 'au-withdraw', 'au-suspend', 'au-bio', 'so-like', 'so-block', 'so-report', 'me-upload', 'me-cdn', 'me-resize', 'me-exif', 'lo-gps', 'lo-address'],
        premium: [...DS_MID, ...ANIM_MID, 'an-like', 'an-confetti', 'so-follow', 'so-hashtag', 'no-chat-media', 'no-chat-read', 'no-katalk-alert', 'py-toss', 'py-subscription', 'py-coupon', ...STORE, 'ai-face'],
        deluxe: [...DS_PRO, 'an-particle', 'an-drag-stack', 'so-feed-follow', 'so-story', 'ai-reco-rule', 'me-webrtc-1on1', 'gm-badge', 'gm-level', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, 'ai-reco-ml', 'so-filter-ai', ...SEC_MID, ...SEC_ENT, ...INFRA_SCALE, 'ex-maintenance-3m'],
      },
    ),
  },
  {
    id: 'hobby', label: '취미 모임', sub: '원데이 · 소모임', category: 'community', iconKey: 'PartyPopper',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-profile', 'au-avatar', 'sc-booking', 'so-board-list', 'so-comment', ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'cm-catalog', 'cm-detail', 'sc-cal', 'sc-slot', 'lo-kakao', 'lo-address', 'so-like', 'so-bookmark', 'py-toss'],
        premium: [...DS_MID, ...ANIM_BASIC, 'so-follow', 'so-hashtag', 'so-review', 'so-rating', 'me-upload', 'me-cdn', 'py-coupon', 'no-katalk-alert', ...STORE],
        deluxe: [...DS_PRO, 'no-chat-1on1', 'no-chat-group', 'gm-badge', 'ai-reco-rule', 'lo-geofence', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, 'ai-reco-ml', ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'local', label: '동네 기반 커뮤니티', sub: '당근식 · 지역 · 정보', category: 'community', iconKey: 'MapPin',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-pass', 'au-profile', 'au-nickname', 'lo-kakao', 'lo-gps', 'lo-address', 'so-board-list', 'so-board-crud', 'so-comment', ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-avatar', 'so-like', 'so-follow', 'so-report', 'so-block', 'no-chat-1on1', 'no-chat-media', 'me-upload', 'me-cdn', 'lo-geofence', 'lo-reverse'],
        premium: [...DS_MID, ...ANIM_BASIC, 'so-feed-time', 'so-feed-follow', 'so-hashtag', 'so-search', 'cm-catalog', 'cm-detail', 'py-toss', 'py-escrow', ...STORE],
        deluxe: [...DS_PRO, 'so-story', 'gm-badge', 'gm-level', 'ai-vision', 'so-filter', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, 'ai-reco-ml', 'so-filter-ai', ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'religious', label: '종교 / 신앙 커뮤니티', sub: '예배 · 기도 · 성경', category: 'community', iconKey: 'Church',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-profile', 'so-board-list', 'so-comment', 'me-audio', 'me-video-up', 'me-hls', ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: [...DS_BASIC, 'ds-darkmode', 'me-pdf-view', 'me-podcast', 'gm-attendance', 'gm-streak', 'sc-cal', 'so-like', 'so-follow'],
        premium: [...DS_MID, ...ANIM_BASIC, 'no-chat-1on1', 'no-chat-group', 'no-katalk-alert', 'py-toss', ...STORE],
        deluxe: [...DS_PRO, 'me-live', 'so-feed-follow', 'ai-summary', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'parents', label: '부모 / 육아', sub: '정보 · 커뮤니티 · 커머스', category: 'community', iconKey: 'Baby',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-profile', 'so-board-list', 'so-comment', 'so-like', ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'so-board-cat', 'so-board-image', 'so-hashtag', 'so-search', 'so-bookmark', 'me-upload', 'me-cdn', 'se-youth'],
        premium: [...DS_MID, ...ANIM_BASIC, 'so-follow', 'so-feed-follow', 'cm-catalog', 'cm-detail', 'cm-cart', 'py-toss', 'no-katalk-alert', ...STORE],
        deluxe: [...DS_PRO, 'no-chat-1on1', 'ai-chatbot', 'gm-badge', 'gm-streak', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, 'ai-reco-ml', ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'senior', label: '시니어 / 5060+', sub: '큰 글씨 · 쉬운 UI', category: 'community', iconKey: 'User',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-pass', 'au-profile', 'no-sms', 'no-katalk-alert', ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: [...DS_BASIC, 'ds-a11y', 'ds-a11y-aaa', 'so-board-list', 'so-comment', 'so-like', 'me-video-up', 'me-hls', 'ex-faq', 'ex-cs'],
        premium: [...DS_MID, ...ANIM_BASIC, 'an-tap', 'no-chat-1on1', 'ai-stt', 'ai-tts', 'lo-kakao', 'lo-address', 'py-toss', ...STORE],
        deluxe: [...DS_PRO, 'ai-chatbot', 'ai-summary', 'ai-translate', 'me-webrtc-1on1', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },

  // ─── PRODUCTIVITY (7) ───
  {
    id: 'todo', label: '할일 / GTD 관리', sub: '태스크 · 습관 · 리마인더', category: 'productivity', iconKey: 'CheckSquare',
    tiers: b(
      [...APP_RN, 'pf-web', ...AUTH_BASIC, 'au-profile', ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: [...DS_BASIC, 'ds-darkmode', 'au-google', 'au-apple', 'gm-attendance', 'gm-streak', 'sc-cal', 'sc-recurring'],
        premium: [...DS_MID, ...ANIM_BASIC, 'an-check', 'an-drag-stack', 'pf-widget-ios', 'pf-widget-android', 'gm-badge', 'gm-level', 'py-toss', 'py-subscription', ...STORE],
        deluxe: [...DS_PRO, 'ai-chatbot', 'ai-summary', 'au-team', 'au-invite', 'no-chat-1on1', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, 'au-sso', 'au-rbac', ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'note', label: '노트 / 지식관리', sub: '마크다운 · 태그 · 검색', category: 'productivity', iconKey: 'NotebookPen',
    tiers: b(
      [...APP_RN, 'pf-web', ...AUTH_BASIC, 'au-profile', 'so-board-md', ...LEGAL, ...INFRA_MIN],
      {
        basic: [...DS_BASIC, 'ds-darkmode', 'au-google', 'au-apple', 'so-hashtag', 'so-search', 'me-upload', 'me-cdn', 'me-file'],
        premium: [...DS_MID, ...ANIM_BASIC, 'pf-widget-ios', 'so-search-elastic', 'me-pdf-view', 'py-toss', 'py-subscription', ...STORE],
        deluxe: [...DS_PRO, 'ai-chatbot', 'ai-rag', 'ai-summary', 'au-team', 'au-invite', 'no-chat-1on1', 'ex-i18n-setup', 'ex-lang-en'],
        enterprise: [...DS_XL, 'au-sso', ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'crm', label: 'CRM / 고객관리', sub: '리드 · 파이프라인 · 자동화', category: 'productivity', iconKey: 'Users',
    tiers: b(
      ['pf-web', 'pf-admin', ...AUTH_BASIC, 'au-pwreset', 'au-profile', 'au-rbac', ...LEGAL, ...INFRA_MIN],
      {
        basic: [...DS_BASIC, 'ds-responsive', 'au-team', 'au-invite', 'da-kpi', 'da-charts', 'no-email', 'me-file', 'me-pdf-view'],
        premium: [...DS_MID, ...ANIM_BASIC, 'no-katalk-alert', 'no-sms', 'py-tax-bill', 'da-excel', 'da-pdf', 'da-ga', 'in-sentry', 'sc-cal', 'sc-booking'],
        deluxe: [...DS_PRO, 'da-funnel', 'da-cohort', 'da-segment', 'da-realtime', 'ai-chatbot', 'ai-summary', 'no-email-tpl', 'da-amplitude'],
        enterprise: [...DS_XL, 'au-sso', 'au-passkey', ...SEC_MID, ...SEC_ENT, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'project-mgmt', label: '프로젝트 관리', sub: '칸반 · 간트 · 이슈', category: 'productivity', iconKey: 'Kanban',
    tiers: b(
      ['pf-web', 'pf-admin', ...AUTH_BASIC, 'au-profile', 'au-rbac', 'au-team', 'au-invite', ...LEGAL, ...INFRA_MIN],
      {
        basic: [...DS_BASIC, 'au-google', 'an-drag-stack', 'sc-cal', 'no-email', 'me-file', 'me-upload', 'me-cdn'],
        premium: [...DS_MID, ...ANIM_BASIC, 'no-chat-1on1', 'no-chat-group', 'so-mention', 'so-comment', 'da-kpi', 'da-charts', 'py-toss', 'py-subscription', ...STORE],
        deluxe: [...DS_PRO, 'ai-chatbot', 'ai-summary', 'da-realtime', 'da-funnel', 'in-sentry', 'in-cicd'],
        enterprise: [...DS_XL, 'au-sso', 'au-device', ...SEC_MID, 'se-waf', ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'hr', label: 'HR / 급여 관리', sub: '근태 · 급여 · 복지', category: 'productivity', iconKey: 'Building',
    tiers: b(
      ['pf-web', 'pf-admin', ...APP_RN, ...AUTH_BASIC, 'au-pwreset', 'au-profile', 'au-rbac', ...LEGAL, ...INFRA_MIN],
      {
        basic: [...DS_BASIC, 'au-team', 'au-invite', 'sc-shift', 'sc-attendance', 'sc-qr-scan', ...PUSH, 'no-sms', 'no-email'],
        premium: [...DS_MID, ...ANIM_BASIC, 'sc-auto-shift', 'py-tax-bill', 'py-cash-receipt', 'da-kpi', 'da-charts', 'da-excel', 'da-pdf', 'me-file', 'me-pdf-view'],
        deluxe: [...DS_PRO, 'no-chat-1on1', 'ai-chatbot', 'ai-summary', 'gm-attendance', 'gm-badge', 'da-funnel'],
        enterprise: [...DS_XL, 'au-sso', 'au-passkey', ...SEC_MID, 'se-ismsp', ...INFRA_SCALE, 'ex-maintenance-3m'],
      },
    ),
  },
  {
    id: 'invoice', label: '인보이스 / 청구', sub: '발행 · 수금 · 자동화', category: 'productivity', iconKey: 'FileText',
    tiers: b(
      ['pf-web', 'pf-admin', ...AUTH_BASIC, 'au-pwreset', 'au-profile', 'me-pdf-view', ...LEGAL, ...INFRA_MIN],
      {
        basic: [...DS_BASIC, 'py-toss', 'py-tax-bill', 'py-cash-receipt', 'py-virtualacc', 'no-email', 'no-sms', 'da-excel'],
        premium: [...DS_MID, ...ANIM_BASIC, 'py-refund-auto', 'py-account', 'py-corp', 'da-pdf', 'da-kpi', 'da-charts', 'no-katalk-alert'],
        deluxe: [...DS_PRO, 'py-settle', 'py-dashboard', 'ai-ocr-custom', 'au-team', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, 'au-sso', ...SEC_MID, 'se-ismsp', ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'team-chat', label: '사내 메신저', sub: '팀 채팅 · 채널 · 파일', category: 'productivity', iconKey: 'MessageCircle',
    tiers: b(
      [...APP_RN, 'pf-web', ...AUTH_BASIC, 'au-profile', 'au-team', 'au-invite', 'no-chat-1on1', 'no-chat-group', 'no-chat-media', ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: [...DS_BASIC, 'ds-darkmode', 'au-google', 'no-chat-read', 'no-chat-typing', 'no-chat-emoji', 'so-mention', 'me-upload', 'me-file'],
        premium: [...DS_MID, ...ANIM_BASIC, 'no-chat-search', 'no-chat-translate', 'au-rbac', 'me-webrtc-1on1', 'me-screenshare', 'py-toss', 'py-subscription', ...STORE],
        deluxe: [...DS_PRO, 'me-webrtc-group', 'me-recording', 'ai-summary', 'ai-chatbot', ...ANALYTICS_BASIC, 'in-redis'],
        enterprise: [...DS_XL, 'au-sso', 'au-passkey', 'au-device', 'au-session', ...SEC_MID, 'se-audit', 'se-ismsp', ...INFRA_SCALE],
      },
    ),
  },

  // ─── LIFESTYLE & SERVICES (7) ───
  {
    id: 'freelance', label: '프리랜서 매칭', sub: '몰앤몰 · 인력 매칭', category: 'lifestyle', iconKey: 'Briefcase',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'sc-booking', 'sc-match', 'no-chat-1on1', 'py-toss', ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-profile', 'au-avatar', 'au-pass', 'sc-cal', 'sc-slot', 'sc-shift', 'so-review', 'so-rating', ...PUSH, 'lo-kakao', 'lo-address'],
        premium: [...DS_MID, ...ANIM_BASIC, 'au-rbac', 'sc-noshow', 'sc-bid', 'sc-attendance', 'so-report', 'so-block', 'no-katalk-alert', 'no-chat-media', 'no-chat-read', 'lo-gps', 'lo-autocomplete', 'py-escrow', 'py-coupon', ...STORE],
        deluxe: [...DS_PRO, 'au-team', 'au-invite', 'sc-auto-shift', 'sc-google-cal', 'sc-waiting', 'no-chat-typing', 'no-chat-emoji', 'py-settle', 'py-tax-bill', 'py-cash-receipt', 'py-point-earn', ...ANALYTICS_BASIC, 'ai-chatbot', 'ai-reco-rule', 'in-cdn', 'in-sentry', 'ex-i18n-setup', 'ex-seo-basic'],
        enterprise: [...DS_XL, 'au-sso', 'au-device', 'au-session', 'py-dashboard', 'py-excel', 'da-realtime', 'da-funnel', 'da-cohort', ...SEC_MID, 'se-ismsp', ...INFRA_SCALE, 'ex-maintenance-3m'],
      },
    ),
  },
  {
    id: 'cleaning', label: '청소 서비스 매칭', sub: '매니저 매칭 · 결제', category: 'lifestyle', iconKey: 'SprayCan',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-profile', 'sc-booking', 'sc-cal', 'py-toss', 'lo-kakao', 'lo-address', ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-pass', 'sc-slot', 'sc-noshow', 'sc-match', 'no-chat-1on1', 'no-katalk-alert', 'so-review', 'so-rating'],
        premium: [...DS_MID, ...ANIM_BASIC, 'lo-gps', 'lo-route', 'lo-autocomplete', 'me-upload', 'me-cdn', 'py-subscription', 'py-coupon', 'py-point-earn', ...STORE],
        deluxe: [...DS_PRO, 'py-escrow', 'py-settle', 'py-tax-bill', 'ai-chatbot', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'laundry', label: '세탁 수거 / 배달', sub: '수거 · 세탁 · 배송', category: 'lifestyle', iconKey: 'Shirt',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-profile', 'cm-catalog', 'cm-order', 'lo-kakao', 'lo-address', 'py-toss', ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-pass', 'sc-booking', 'sc-slot', 'lo-track', 'no-katalk-alert', 'so-review', 'so-rating'],
        premium: [...DS_MID, ...ANIM_BASIC, 'lo-gps', 'lo-geofence', 'lo-route-opt', 'lo-rider-match', 'py-subscription', 'py-coupon', 'py-point-earn', ...STORE],
        deluxe: [...DS_PRO, 'py-settle', 'py-tax-bill', 'no-chat-1on1', 'ai-vision', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'moving', label: '이사 견적 / 매칭', sub: '견적 · 일정 · 업체', category: 'lifestyle', iconKey: 'Truck',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-profile', 'sc-bid', 'sc-booking', 'lo-kakao', 'lo-address', 'py-toss', ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-pass', 'sc-cal', 'sc-slot', 'me-upload', 'me-cdn', 'so-review', 'so-rating', ...PUSH],
        premium: [...DS_MID, ...ANIM_BASIC, 'no-chat-1on1', 'no-katalk-alert', 'lo-route', 'lo-eta', 'py-escrow', 'py-coupon', ...STORE],
        deluxe: [...DS_PRO, 'py-settle', 'py-tax-bill', 'ai-chatbot', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'repair', label: '수리 / 핸디맨', sub: '긴급 출동 · 견적', category: 'lifestyle', iconKey: 'Wrench',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-profile', 'sc-match', 'sc-booking', 'lo-kakao', 'lo-gps', 'py-toss', ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-pass', 'sc-bid', 'sc-slot', 'no-chat-1on1', 'no-chat-media', 'me-upload', 'me-cdn', 'so-review', 'so-rating'],
        premium: [...DS_MID, ...ANIM_BASIC, 'lo-route', 'lo-eta', 'lo-geofence', 'no-katalk-alert', 'py-escrow', 'py-coupon', ...STORE],
        deluxe: [...DS_PRO, 'py-settle', 'py-tax-bill', 'ai-chatbot', 'ai-vision', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'lawyer-match', label: '변호사 / 법률 상담', sub: '상담 · 수임 · 계약서', category: 'lifestyle', iconKey: 'Gavel',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-pass', 'au-profile', 'no-chat-1on1', 'py-toss', ...PUSH, ...LEGAL_CUSTOM, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'sc-cal', 'sc-booking', 'sc-slot', 'me-pdf-view', 'me-file', 'so-review', 'so-rating'],
        premium: [...DS_MID, ...ANIM_BASIC, 'me-webrtc-1on1', 'no-katalk-alert', 'no-email', 'py-escrow', 'py-tax-bill', 'se-encrypt', ...STORE],
        deluxe: [...DS_PRO, 'ai-chatbot', 'ai-summary', 'ai-ocr-custom', 'se-audit', 'se-2fa', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, 'au-sso', 'se-ismsp', 'se-pen-test', ...INFRA_SCALE],
      },
    ),
  },
  {
    id: 'doctor-match', label: '의사 상담 매칭', sub: '비대면 · 처방전', category: 'lifestyle', iconKey: 'Stethoscope',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-pass', 'au-bio', 'au-profile', 'no-chat-1on1', 'me-webrtc-1on1', 'py-toss', ...PUSH, ...LEGAL_CUSTOM, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-pwreset', 'sc-cal', 'sc-booking', 'sc-slot', 'so-review', 'so-rating', 'no-katalk-alert'],
        premium: [...DS_MID, ...ANIM_BASIC, 'me-screenshare', 'me-pdf-view', 'me-file', 'py-tax-bill', 'py-refund-auto', 'ai-ocr-custom', 'se-encrypt', ...STORE],
        deluxe: [...DS_PRO, 'ai-chatbot', 'ai-summary', 'se-audit', 'se-2fa', ...ANALYTICS_BASIC, 'in-sentry'],
        enterprise: [...DS_XL, 'au-sso', 'au-passkey', 'se-ismsp', 'se-pen-test', ...INFRA_SCALE, 'ex-maintenance-3m'],
      },
    ),
  },
  {
    id: 'travel', label: '여행 / 숙박 예약', sub: '항공 · 호텔 · 액티비티', category: 'lifestyle', iconKey: 'Plane',
    tiers: b(
      [...APP_RN, ...AUTH_BASIC, 'au-profile', 'cm-catalog', 'cm-detail', 'sc-booking', 'sc-cal', 'py-toss', 'lo-kakao', ...PUSH, ...LEGAL, ...INFRA_MIN],
      {
        basic: ['pf-admin', ...DS_BASIC, 'au-pass', 'cm-search', 'cm-filter', 'cm-wishlist', 'cm-order-history', 'lo-address', 'no-katalk-alert', 'no-email', 'so-review', 'so-rating'],
        premium: [...DS_MID, ...ANIM_MID, 'an-hero', 'an-parallax', 'me-upload', 'me-cdn', 'py-coupon', 'py-kakaopay', 'py-naverpay', 'py-applepay', 'py-subscription', ...STORE, 'ex-i18n-setup', 'ex-lang-en'],
        deluxe: [...DS_PRO, 'an-spline', 'cm-section', 'cm-event', 'cm-flash', 'ai-chatbot', 'ai-reco-rule', 'lo-overlay', ...ANALYTICS_BASIC],
        enterprise: [...DS_XL, 'ai-reco-ml', 'py-stripe', 'py-paypal', ...ANALYTICS_PRO, ...SEC_MID, ...INFRA_SCALE],
      },
    ),
  },
]

export const PACKAGE_CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'business', label: '비즈니스 / B2B' },
  { id: 'commerce', label: '쇼핑 / 커머스' },
  { id: 'food', label: '음식 / O2O' },
  { id: 'education', label: '교육 / LMS' },
  { id: 'health', label: '헬스 / 웰빙' },
  { id: 'community', label: '커뮤니티 / SNS' },
  { id: 'productivity', label: '생산성 / 업무' },
  { id: 'lifestyle', label: '생활 / 전문서비스' },
]
