'use client'

import { useLocale } from 'next-intl'
import { GuideTemplate, type GuideProps } from '@/components/GuideTemplate'
import { Play, User, Shield, CreditCard, FileText, Building2, Mail, Key, ExternalLink } from 'lucide-react'

type Locale = 'ko' | 'en' | 'ja' | 'zh'

const ICONS = {
  user: <User className="h-5 w-5" />,
  shield: <Shield className="h-5 w-5" />,
  card: <CreditCard className="h-5 w-5" />,
  file: <FileText className="h-5 w-5" />,
  building: <Building2 className="h-5 w-5" />,
  mail: <Mail className="h-5 w-5" />,
  key: <Key className="h-5 w-5" />,
  external: <ExternalLink className="h-5 w-5" />,
  settings: <Play className="h-5 w-5" />,
}

type Data = Omit<GuideProps, 'badge'> & { badge: { text: string } }

function getData(): Record<Locale, Data> {
  return {
    ko: {
      badge: { text: 'GOOGLE PLAY CONSOLE' },
      titleTop: 'Google Play Console',
      titleBottom: '개발자 계정 만들기',
      description: `Android 앱을 Play 스토어에 출시하려면 Google Play Console 가입이 필요합니다.\n개인·법인 구분, 신원 확인, 결제까지 순서대로 안내해 드립니다.`,
      primaryCta: { label: 'Play Console 가입 열기', href: 'https://play.google.com/console/signup' },
      stats: [
        { label: '등록비', value: '$25 (1회)' },
        { label: '심사 기간', value: '1–3일' },
        { label: '필요 문서', value: '신분증·카드' },
      ],
      overviewTitle: '출시 전에 확인하세요',
      overviewDesc: '개인·법인 유형 선택은 앱 표기 주체와 세금계산에 영향을 주며, 중간 변경이 제한적입니다. 2023년 정책 변경 이후 법인(조직) 계정은 D-U-N-S 번호가 필수이므로 가입 전 미리 발급받아 두는 것이 가장 빠른 길입니다.',
      overviewItems: [
        { icon: ICONS.user, title: '개인 vs 법인 결정', desc: '앱 이름·스토어 노출 주체가 달라집니다.' },
        { icon: ICONS.shield, title: '2단계 인증 Google 계정', desc: '출시 전 필수, 도메인 이메일 권장.' },
        { icon: ICONS.building, title: '법인 등록 준비 (법인만)', desc: '사업자등록증·D-U-N-S 번호(필수).' },
        { icon: ICONS.card, title: '해외 결제 카드', desc: '$25 일회성 등록비 결제용.' },
      ],
      steps: [
        { no: '01', title: 'Google 계정 준비', tag: 'PREREQUISITE', icon: ICONS.user, desc: 'Play Console 가입에 사용할 Google 계정을 결정합니다.', details: [
          '개인 Gmail보다 조직 도메인 Workspace 계정 권장',
          '2단계 인증 필수',
          '추후 소유권 이전이 까다로우므로 신중하게 선택',
        ] },
        { no: '02', title: 'Play Console 가입 시작', tag: 'SIGNUP', icon: ICONS.external, desc: 'play.google.com/console/signup 접속 후 안내대로 진행.', details: [
          '계정 유형: 자신(개인) / 조직(법인) 선택',
          'Play Console 이용약관 동의',
          '국가 / 개발자 이름 / 연락처 이메일 입력',
        ] },
        { no: '03', title: '개발자 프로필 작성', tag: 'PROFILE', icon: ICONS.file, desc: '스토어 노출 정보를 입력합니다.', details: [
          '개발자 이름 (스토어에 표시됨, 추후 변경 신청 가능)',
          '연락처 이메일 (사용자 문의용) · 지원 웹사이트 URL',
          '프로필은 언제든 수정 가능하지만 이름 변경은 검토 필요',
        ] },
        { no: '04', title: 'D-U-N-S 번호 발급 (법인만)', tag: 'DUNS', icon: ICONS.building, desc: '법인(조직) 계정은 D&B에서 발급하는 D-U-N-S 9자리 번호가 필수입니다. 무료이며 한국 기업은 한국기업데이터(KED)에서 발급합니다.', details: [
          'D-U-N-S = Data Universal Numbering System, 전 세계 기업 고유 식별번호 (9자리)',
          '① 기존 번호 조회: upik.dnb.co.kr 접속 → "D-U-N-S Number Lookup" → 사업자명/사업자번호로 검색',
          '이미 발급된 번호가 있다면 조회 결과에서 확인 가능 (중복 신청 불필요)',
          '② 미발급 시 신규 신청: upik.dnb.co.kr > "D-U-N-S 번호 신청" 또는 developer.apple.com/enroll/duns-lookup (Apple 경로도 동일 DB 사용)',
          '신청서 입력: 영문 법인명(사업자등록증 영문과 정확히 일치) · 영문 주소 · 대표자명 · 설립일 · 업종 · 연락처',
          '사업자등록증(국세청 발급, 발급일 3개월 이내) PDF 또는 스캔본 업로드',
          '③ 검증 절차: D&B 한국 지사(한국기업데이터)에서 등기부등본·사업자등록 정보 교차검증',
          '검증 중 전화 또는 이메일로 정보 확인 연락 → 반드시 즉시 응답 (무응답 시 반려)',
          '④ 발급 기간: 무료 신청 시 통상 14–30일 소요, 급하면 유료 Expedited(약 $229) 5영업일 내',
          '발급 완료 시 이메일로 9자리 D-U-N-S 번호 통지 (예: 123456789)',
          '⑤ Google Play 입력: Play Console 조직 설정 > 조직 세부정보 > D-U-N-S 번호 필드에 입력',
          '주의: 영문 법인명·주소가 사업자등록증 영문 표기·Google Play 입력값과 완전히 일치해야 검증 통과',
          '주의: 개인사업자도 D-U-N-S 발급 가능하나 Google Play 개인 계정은 불필요',
        ] },
        { no: '05', title: '신원·전화번호 확인', tag: 'VERIFICATION', icon: ICONS.shield, desc: '계정 진위 확인을 위한 검증 단계.', details: [
          '개인: 정부 발급 신분증(여권/주민증) 사진 제출',
          '법인: D-U-N-S 번호 + 대표자 신분증 + 사업자등록증',
          '주소 증빙(최근 공과금·카드명세서 등) 요청될 수 있음',
          '모든 정보는 영문/한국어 모두 가능',
        ] },
        { no: '06', title: '등록비 결제 ($25)', tag: 'PAYMENT', icon: ICONS.card, desc: '일회성 등록비를 결제합니다. Apple과 달리 매년 갱신 없음.', details: [
          'Visa / Master / Amex 해외결제 가능 카드',
          '법인 카드 사용 시 법인명 일치 권장',
          '결제 영수증 이메일로 자동 발송',
        ] },
        { no: '07', title: 'Google 검토 대기', tag: 'REVIEW', icon: ICONS.mail, desc: 'Google이 신원·결제 정보를 검토합니다.', details: [
          '보통 24–72시간 소요 (법인은 최대 7일)',
          '검토 중 추가 서류 요청 이메일이 올 수 있음',
          '승인 완료되면 "개발자 계정이 생성되었습니다" 메일 수신',
        ] },
        { no: '08', title: '결제 프로필 설정', tag: 'PAYOUT', icon: ICONS.card, desc: '유료 앱·인앱결제·광고 매출을 수령하려면 결제 프로필을 추가합니다.', details: [
          'Play Console > 설정 > 결제 프로필',
          '세금 정보(W-8BEN 해외, 한국 사업자번호) 입력',
          '은행 계좌 연결 (한국 원화 수령 가능)',
          'US 세금 정보는 법인 유형에 따라 다름',
        ] },
        { no: '09', title: '팀 멤버 초대 및 앱 등록', tag: 'POST', icon: ICONS.key, desc: '출시 준비. 팀 역할을 나누고 첫 앱을 생성.', details: [
          '사용자 및 권한 > 새 사용자 초대',
          '역할: Owner / Admin / Developer / Marketing 등',
          '앱 만들기 > 기본 정보 입력 후 번들 업로드',
          'Closed Testing → Open Testing → Production 순 권장',
        ] },
      ],
      pitfalls: [
        { title: '신원 확인 서류 불일치', desc: '신분증 이름·생년월일이 Google 계정 정보와 정확히 일치해야 통과됩니다.' },
        { title: 'D-U-N-S 영문 표기 불일치', desc: 'D-U-N-S에 등록된 영문 법인명·주소가 사업자등록증 영문 표기·Play Console 입력값과 한 글자라도 다르면 검증 반려됩니다.' },
        { title: 'D-U-N-S 발급 지연', desc: '무료 신청은 14–30일이 걸려 출시 일정에 치명적. 법인 계정은 가입 최소 1개월 전 미리 신청하세요.' },
        { title: '14일 테스트 요구사항 (2023년 도입)', desc: '개인 신규 계정은 최소 20명으로 14일간 Closed Testing 후에야 Production 출시 가능.' },
        { title: '2단계 인증 미설정', desc: '가입 중 2FA 설정 요구로 중단되는 경우가 많습니다. 먼저 켜두세요.' },
        { title: 'Google Play 결제 정책', desc: '앱 내 디지털 상품은 반드시 Google Play Billing을 사용해야 합니다. 외부 PG 사용 시 삭제될 수 있어요.' },
        { title: '개발자 이름 변경 지연', desc: '최초 설정한 개발자 이름 변경은 Google 승인이 필요하며 몇 주 걸립니다.' },
      ],
      resources: [
        { title: 'Play Console 가입', desc: '개발자 계정 만들기 시작', href: 'https://play.google.com/console/signup' },
        { title: 'Play Console 홈', desc: '앱 등록·관리', href: 'https://play.google.com/console' },
        { title: 'Developer Policy Center', desc: '정책 가이드라인', href: 'https://support.google.com/googleplay/android-developer/topic/9858052' },
        { title: 'Play 결제 시스템', desc: 'Google Play Billing', href: 'https://developer.android.com/google/play/billing' },
        { title: 'Closed Testing 요구사항', desc: '14일 테스트 가이드', href: 'https://support.google.com/googleplay/android-developer/answer/14151465' },
        { title: 'D-U-N-S 번호 조회 (UPIK)', desc: '한국기업데이터 D&B Lookup', href: 'https://www.upik.de/en/upik_search.cgi' },
        { title: 'D-U-N-S 신규 신청', desc: 'D&B 공식 신청 (무료)', href: 'https://www.dnb.com/duns/get-a-duns.html' },
        { title: '결제 프로필 설정', desc: '세금·은행 정보 입력', href: 'https://support.google.com/googleplay/android-developer/answer/9859751' },
      ],
    },
    en: {
      badge: { text: 'GOOGLE PLAY CONSOLE' },
      titleTop: 'Google Play Console',
      titleBottom: 'Developer Account Setup',
      description: `To ship an Android app on Google Play, you need to sign up for Play Console.\nWe walk through entity type, identity verification, and payment in order.`,
      primaryCta: { label: 'Open Play Console signup', href: 'https://play.google.com/console/signup' },
      stats: [
        { label: 'Registration fee', value: '$25 (one-time)' },
        { label: 'Review time', value: '1–3 days' },
        { label: 'Documents', value: 'ID, card' },
      ],
      overviewTitle: 'Check before you ship',
      overviewDesc: 'The Individual vs Organization choice drives your display name and tax handling, and is hard to change later. Since the 2023 policy update, Organization accounts require a D-U-N-S number — apply for it before signing up for the fastest path.',
      overviewItems: [
        { icon: ICONS.user, title: 'Decide Individual vs Organization', desc: 'Affects the store display name.' },
        { icon: ICONS.shield, title: 'Google account with 2FA', desc: 'Required; domain email recommended.' },
        { icon: ICONS.building, title: 'Organization docs (Org only)', desc: 'Business registration + D-U-N-S (required).' },
        { icon: ICONS.card, title: 'International card', desc: 'For the $25 one-time fee.' },
      ],
      steps: [
        { no: '01', title: 'Prepare a Google account', tag: 'PREREQUISITE', icon: ICONS.user, desc: 'Decide which Google account to use for Play Console.', details: [
          'Prefer a Workspace account on your org domain over personal Gmail',
          '2FA required',
          'Ownership transfer is tricky later, so choose carefully',
        ] },
        { no: '02', title: 'Start Play Console signup', tag: 'SIGNUP', icon: ICONS.external, desc: 'Go to play.google.com/console/signup and follow the flow.', details: [
          'Pick account type: yourself (Individual) / organization',
          'Accept Play Console terms',
          'Enter country, developer name, and contact email',
        ] },
        { no: '03', title: 'Fill in the developer profile', tag: 'PROFILE', icon: ICONS.file, desc: 'Enter what will show on the store.', details: [
          'Developer name (shown on the store; can request changes later)',
          'Contact email (for user inquiries) and support website URL',
          'The profile is editable anytime, but name changes need review',
        ] },
        { no: '04', title: 'Get a D-U-N-S number (Organization only)', tag: 'DUNS', icon: ICONS.building, desc: 'Organization accounts require a 9-digit D-U-N-S from D&B. It is free; Korean companies get it via KED (Korea Enterprise Data).', details: [
          'D-U-N-S = Data Universal Numbering System, a unique 9-digit global business identifier',
          '(1) Look up existing number: upik.dnb.co.kr → "D-U-N-S Number Lookup" → search by company name/registration number',
          'If a number already exists, you can find it in the lookup results (no need to re-apply)',
          '(2) Apply for a new one: upik.dnb.co.kr > "Apply for D-U-N-S", or developer.apple.com/enroll/duns-lookup (shares the same DB)',
          'Application fields: English legal name (exactly matching English business registration) · English address · representative · establishment date · industry · contact',
          'Upload business registration PDF or scan (issued by the tax office, within 3 months)',
          '(3) Verification: D&B Korea (KED) cross-checks corporate registry and business registration',
          'You may get a verification call or email — respond immediately (no response = rejected)',
          '(4) Lead time: ~14–30 days for the free track; paid Expedited (~$229) completes within 5 business days',
          'You receive the 9-digit D-U-N-S by email once issued (e.g. 123456789)',
          '(5) Enter on Google Play: Play Console > Organization settings > Organization details > D-U-N-S field',
          'Note: English legal name/address must exactly match the English business registration and the Play Console input',
          'Note: Sole proprietors can get a D-U-N-S too, but Play Individual accounts do not need one',
        ] },
        { no: '05', title: 'Identity and phone verification', tag: 'VERIFICATION', icon: ICONS.shield, desc: 'Verification step to confirm the account is real.', details: [
          'Individual: submit a photo of a government ID (passport/national ID)',
          'Organization: D-U-N-S + representative ID + business registration',
          'Address proof (recent utility bill/card statement) may be requested',
          'Information can be submitted in English or Korean',
        ] },
        { no: '06', title: 'Pay the $25 registration fee', tag: 'PAYMENT', icon: ICONS.card, desc: 'Pay the one-time registration fee. Unlike Apple, there is no annual renewal.', details: [
          'Visa / Master / Amex card that supports international payments',
          'For corporate cards, matching the legal name is recommended',
          'Payment receipt is emailed automatically',
        ] },
        { no: '07', title: 'Wait for Google review', tag: 'REVIEW', icon: ICONS.mail, desc: 'Google reviews your identity and payment info.', details: [
          'Usually 24–72 hours (up to 7 days for Organization)',
          'You may receive emails requesting extra documents during review',
          'On approval, you receive an "account created" email',
        ] },
        { no: '08', title: 'Set up the payments profile', tag: 'PAYOUT', icon: ICONS.card, desc: 'To collect revenue from paid apps, IAP, and ads, add a payments profile.', details: [
          'Play Console > Settings > Payments profile',
          'Enter tax info (W-8BEN for non-US, Korean business number)',
          'Link a bank account (can receive KRW in Korea)',
          'US tax info depends on your entity type',
        ] },
        { no: '09', title: 'Invite team and create your app', tag: 'POST', icon: ICONS.key, desc: 'Prep for launch. Split team roles and create your first app.', details: [
          'Users and permissions > Invite new user',
          'Roles: Owner / Admin / Developer / Marketing, etc.',
          'Create app > fill in basics and upload the bundle',
          'Closed Testing → Open Testing → Production is the recommended flow',
        ] },
      ],
      pitfalls: [
        { title: 'Identity document mismatch', desc: 'ID name and date of birth must exactly match your Google account to pass verification.' },
        { title: 'D-U-N-S English spelling mismatch', desc: 'If the English legal name/address registered on D-U-N-S differs from the business registration or Play Console input by even a single character, verification fails.' },
        { title: 'D-U-N-S processing delay', desc: 'The free track takes 14–30 days and can wreck a launch schedule. For Organization accounts, apply at least one month in advance.' },
        { title: '14-day testing requirement (added in 2023)', desc: 'New Individual accounts must run Closed Testing with at least 20 testers for 14 days before Production release is allowed.' },
        { title: '2FA not enabled', desc: 'Signups often stall when 2FA is required mid-flow. Turn it on first.' },
        { title: 'Google Play billing policy', desc: 'In-app digital goods must use Google Play Billing — using external PGs can get your app pulled.' },
        { title: 'Developer name change delay', desc: 'Changing the initial developer name requires Google approval and can take weeks.' },
      ],
      resources: [
        { title: 'Play Console signup', desc: 'Start creating a developer account', href: 'https://play.google.com/console/signup' },
        { title: 'Play Console home', desc: 'App registration and management', href: 'https://play.google.com/console' },
        { title: 'Developer Policy Center', desc: 'Policy guidelines', href: 'https://support.google.com/googleplay/android-developer/topic/9858052' },
        { title: 'Play Billing System', desc: 'Google Play Billing', href: 'https://developer.android.com/google/play/billing' },
        { title: 'Closed Testing requirements', desc: '14-day testing guide', href: 'https://support.google.com/googleplay/android-developer/answer/14151465' },
        { title: 'D-U-N-S lookup (UPIK)', desc: 'KED / D&B lookup', href: 'https://www.upik.de/en/upik_search.cgi' },
        { title: 'Apply for a new D-U-N-S', desc: 'Official D&B application (free)', href: 'https://www.dnb.com/duns/get-a-duns.html' },
        { title: 'Payments profile setup', desc: 'Tax and bank info', href: 'https://support.google.com/googleplay/android-developer/answer/9859751' },
      ],
    },
    ja: {
      badge: { text: 'GOOGLE PLAY CONSOLE' },
      titleTop: 'Google Play Console',
      titleBottom: '開発者アカウント作成',
      description: `AndroidアプリをPlayストアに公開するにはGoogle Play Consoleへの登録が必要です。\n個人・法人区分、本人確認、決済まで順を追ってご案内します。`,
      primaryCta: { label: 'Play Console登録を開く', href: 'https://play.google.com/console/signup' },
      stats: [
        { label: '登録料', value: '$25(1回)' },
        { label: '審査期間', value: '1–3日' },
        { label: '必要書類', value: '身分証・カード' },
      ],
      overviewTitle: '公開前にご確認ください',
      overviewDesc: '個人・法人の選択は表示名義と税務に影響し、途中変更が難しいです。2023年のポリシー変更以降、法人(組織)アカウントにはD-U-N-S番号が必須となったため、登録前に取得しておくのが最短ルートです。',
      overviewItems: [
        { icon: ICONS.user, title: '個人か法人かを決定', desc: 'ストアの表示名義が変わります。' },
        { icon: ICONS.shield, title: '2FA有効のGoogleアカウント', desc: '必須。ドメインメール推奨。' },
        { icon: ICONS.building, title: '法人書類の準備(法人のみ)', desc: '事業者登録証・D-U-N-S(必須)。' },
        { icon: ICONS.card, title: '海外決済カード', desc: '$25の一回限り登録料用。' },
      ],
      steps: [
        { no: '01', title: 'Googleアカウントの準備', tag: 'PREREQUISITE', icon: ICONS.user, desc: 'Play Console登録に使うGoogleアカウントを決定します。', details: [
          '個人GmailよりWorkspace(組織ドメイン)アカウントを推奨',
          '2FAは必須',
          '後からの所有権移管が面倒なので慎重に選択',
        ] },
        { no: '02', title: 'Play Console登録を開始', tag: 'SIGNUP', icon: ICONS.external, desc: 'play.google.com/console/signupにアクセスし案内に従って進行。', details: [
          'アカウント種類: 自分(個人)/ 組織(法人)を選択',
          'Play Console利用規約に同意',
          '国 / 開発者名 / 連絡先メールを入力',
        ] },
        { no: '03', title: '開発者プロフィール作成', tag: 'PROFILE', icon: ICONS.file, desc: 'ストアに表示される情報を入力します。', details: [
          '開発者名(ストア表示・後で変更申請可)',
          '連絡先メール(ユーザー問い合わせ用)・サポートサイトURL',
          'プロフィールはいつでも編集可能ですが名称変更は審査が必要',
        ] },
        { no: '04', title: 'D-U-N-S番号発行(法人のみ)', tag: 'DUNS', icon: ICONS.building, desc: '法人(組織)アカウントはD&B発行の9桁D-U-N-S番号が必須。無料で、韓国企業はKED(韓国企業データ)経由で発行。', details: [
          'D-U-N-S = Data Universal Numbering System、全世界の企業固有識別番号(9桁)',
          '(1) 既存番号の照会: upik.dnb.co.kr → "D-U-N-S Number Lookup" → 法人名/事業者番号で検索',
          'すでに発行済みであれば照会結果で確認可能(重複申請不要)',
          '(2) 未発行の場合は新規申請: upik.dnb.co.kr > "D-U-N-S番号申請" または developer.apple.com/enroll/duns-lookup(同じDBを使用)',
          '申請項目: 英文法人名(事業者登録証の英文と完全一致)・英文住所・代表者名・設立日・業種・連絡先',
          '事業者登録証(発行から3ヶ月以内のPDFまたはスキャン)をアップロード',
          '(3) 検証: D&B韓国支社(KED)が登記簿・事業者登録情報を照合',
          '検証中に電話またはメールで情報確認があれば即時返信(無応答は却下)',
          '(4) 発行期間: 無料申請は通常14–30日、有料Expedited(約$229)なら5営業日以内',
          '発行完了時に9桁のD-U-N-S番号がメール通知(例: 123456789)',
          '(5) Google Playへの入力: Play Console 組織設定 > 組織詳細 > D-U-N-Sフィールドに入力',
          '注意: 英文法人名・住所が事業者登録証の英文表記・Play Console入力値と完全一致していること',
          '注意: 個人事業主もD-U-N-Sを取得可能だが、Play個人アカウントには不要',
        ] },
        { no: '05', title: '本人・電話番号確認', tag: 'VERIFICATION', icon: ICONS.shield, desc: 'アカウントの真正性を確認する検証ステップ。', details: [
          '個人: 政府発行身分証(パスポート/住民証)の写真を提出',
          '法人: D-U-N-S番号 + 代表者身分証 + 事業者登録証',
          '住所証明(公共料金・カード明細など)を求められる場合あり',
          '情報は英語/韓国語いずれも提出可',
        ] },
        { no: '06', title: '登録料$25の決済', tag: 'PAYMENT', icon: ICONS.card, desc: '一回限りの登録料を決済。Appleと違い年次更新はありません。', details: [
          'Visa / Master / Amex 海外決済可能カード',
          '法人カード利用時は法人名の一致を推奨',
          '決済領収書は自動でメール送信',
        ] },
        { no: '07', title: 'Googleの審査待ち', tag: 'REVIEW', icon: ICONS.mail, desc: 'Googleが本人・決済情報を審査します。', details: [
          '通常24–72時間(法人は最大7日)',
          '審査中に追加書類を求めるメールが届く場合あり',
          '承認完了で「開発者アカウントが作成されました」メール受信',
        ] },
        { no: '08', title: '支払いプロファイルの設定', tag: 'PAYOUT', icon: ICONS.card, desc: '有料アプリ・IAP・広告収益を受け取るには支払いプロファイルを追加。', details: [
          'Play Console > 設定 > 支払いプロファイル',
          '税務情報(非米国はW-8BEN、韓国事業者番号)を入力',
          '銀行口座を連携(韓国円での受取可)',
          '米国税務情報は法人種別により異なる',
        ] },
        { no: '09', title: 'チーム招待とアプリ登録', tag: 'POST', icon: ICONS.key, desc: '公開準備。チームの役割を分担し最初のアプリを作成。', details: [
          'ユーザーと権限 > 新規ユーザー招待',
          '役割: Owner / Admin / Developer / Marketing 等',
          'アプリ作成 > 基本情報入力後にバンドルをアップロード',
          'Closed Testing → Open Testing → Production の順を推奨',
        ] },
      ],
      pitfalls: [
        { title: '本人確認書類の不一致', desc: '身分証の氏名・生年月日がGoogleアカウント情報と完全一致している必要があります。' },
        { title: 'D-U-N-S英文表記の不一致', desc: 'D-U-N-S登録の英文法人名・住所が事業者登録証の英文表記・Play Console入力値と1文字でも違うと差し戻されます。' },
        { title: 'D-U-N-S発行遅延', desc: '無料申請は14–30日かかり公開スケジュールに致命的。法人アカウントは登録の最低1ヶ月前に申請を。' },
        { title: '14日間テスト要件(2023年導入)', desc: '新規個人アカウントは最低20名で14日間Closed Testing後にのみProductionリリース可能。' },
        { title: '2FA未設定', desc: '登録中に2FA設定を求められ中断するケースが多いです。先に有効化を。' },
        { title: 'Google Play決済ポリシー', desc: 'アプリ内デジタル商品はGoogle Play Billingの利用が必須。外部PG利用はアプリ削除対象になる可能性があります。' },
        { title: '開発者名の変更遅延', desc: '初回設定した開発者名の変更はGoogleの承認が必要で数週間かかります。' },
      ],
      resources: [
        { title: 'Play Console登録', desc: '開発者アカウント作成開始', href: 'https://play.google.com/console/signup' },
        { title: 'Play Consoleホーム', desc: 'アプリ登録・管理', href: 'https://play.google.com/console' },
        { title: 'Developer Policy Center', desc: 'ポリシーガイドライン', href: 'https://support.google.com/googleplay/android-developer/topic/9858052' },
        { title: 'Play Billing System', desc: 'Google Play Billing', href: 'https://developer.android.com/google/play/billing' },
        { title: 'Closed Testing要件', desc: '14日間テストガイド', href: 'https://support.google.com/googleplay/android-developer/answer/14151465' },
        { title: 'D-U-N-S照会(UPIK)', desc: 'KED / D&B Lookup', href: 'https://www.upik.de/en/upik_search.cgi' },
        { title: 'D-U-N-S新規申請', desc: 'D&B公式申請(無料)', href: 'https://www.dnb.com/duns/get-a-duns.html' },
        { title: '支払いプロファイル設定', desc: '税務・銀行情報入力', href: 'https://support.google.com/googleplay/android-developer/answer/9859751' },
      ],
    },
    zh: {
      badge: { text: 'GOOGLE PLAY CONSOLE' },
      titleTop: 'Google Play Console',
      titleBottom: '开发者账号创建',
      description: `要将 Android 应用发布到 Play 商店,需要注册 Google Play Console。\n从个人/法人区分、身份核验到付款,我们按顺序指导。`,
      primaryCta: { label: '打开 Play Console 注册', href: 'https://play.google.com/console/signup' },
      stats: [
        { label: '注册费', value: '$25(一次性)' },
        { label: '审核周期', value: '1–3 天' },
        { label: '所需材料', value: '身份证·银行卡' },
      ],
      overviewTitle: '发布前请先确认',
      overviewDesc: '个人/法人选择会影响署名主体与税务处理,且中途更改受限。自 2023 年政策变更后,法人(组织)账号必须持有 D-U-N-S 编号,因此在注册前先申请是最省时的做法。',
      overviewItems: [
        { icon: ICONS.user, title: '决定个人或法人', desc: '影响商店中的署名。' },
        { icon: ICONS.shield, title: '开启 2FA 的 Google 账号', desc: '必须,建议使用企业域名邮箱。' },
        { icon: ICONS.building, title: '法人材料(仅法人)', desc: '营业执照·D-U-N-S 编号(必填)。' },
        { icon: ICONS.card, title: '国际支付卡', desc: '用于支付 $25 一次性注册费。' },
      ],
      steps: [
        { no: '01', title: '准备 Google 账号', tag: 'PREREQUISITE', icon: ICONS.user, desc: '确定用于 Play Console 注册的 Google 账号。', details: [
          '相比个人 Gmail,更推荐使用公司域名的 Workspace 账号',
          '必须开启 2FA',
          '日后转移所有权较麻烦,请慎重选择',
        ] },
        { no: '02', title: '开始 Play Console 注册', tag: 'SIGNUP', icon: ICONS.external, desc: '访问 play.google.com/console/signup,按提示进行。', details: [
          '账号类型:选择自己(个人)或组织(法人)',
          '同意 Play Console 使用条款',
          '填写国家 / 开发者名称 / 联系邮箱',
        ] },
        { no: '03', title: '填写开发者资料', tag: 'PROFILE', icon: ICONS.file, desc: '填写将显示在商店的信息。', details: [
          '开发者名称(商店可见,后续可申请变更)',
          '联系邮箱(用于用户咨询)与支持网站 URL',
          '资料随时可修改,但名称变更需审核',
        ] },
        { no: '04', title: '申请 D-U-N-S 编号(仅法人)', tag: 'DUNS', icon: ICONS.building, desc: '法人(组织)账号必须持有 D&B 颁发的 9 位 D-U-N-S 编号,免费申请,中国/韩国企业通过当地分支机构办理。', details: [
          'D-U-N-S = Data Universal Numbering System,全球企业唯一识别编号(9 位)',
          '(1) 查询现有编号:upik.dnb.co.kr → "D-U-N-S Number Lookup" → 按公司名/工商编号搜索',
          '如已存在编号,可在查询结果中看到(无需重复申请)',
          '(2) 若未申请则新增:upik.dnb.co.kr > "D-U-N-S 申请",或 developer.apple.com/enroll/duns-lookup(数据库相同)',
          '申请项:英文法人名(需与营业执照英文完全一致)·英文地址·法人代表·成立日期·行业·联系方式',
          '上传营业执照 PDF 或扫描件(税务机关签发,3 个月内)',
          '(3) 审核:D&B 本地分支与工商/税务数据交叉核验',
          '审核期间可能电话或邮件核实,请立即回复(无回复将被驳回)',
          '(4) 发放周期:免费申请通常 14–30 天,加急 Expedited(约 $229)5 个工作日内完成',
          '发放后通过邮件告知 9 位 D-U-N-S 编号(示例:123456789)',
          '(5) 在 Google Play 输入:Play Console 组织设置 > 组织详情 > D-U-N-S 字段',
          '注意:英文法人名/地址必须与营业执照英文及 Play Console 输入完全一致',
          '注意:个体工商户也可申请 D-U-N-S,但 Play 个人账号不需要',
        ] },
        { no: '05', title: '身份与电话核验', tag: 'VERIFICATION', icon: ICONS.shield, desc: '确认账号真实性的核验环节。', details: [
          '个人:提交政府颁发的身份证件(护照/身份证)照片',
          '法人:D-U-N-S 编号 + 法人代表身份证 + 营业执照',
          '可能要求补充地址证明(近期水电单/银行账单)',
          '资料支持英文或本地语言',
        ] },
        { no: '06', title: '支付 $25 注册费', tag: 'PAYMENT', icon: ICONS.card, desc: '一次性注册费,与 Apple 不同,没有年度续费。', details: [
          'Visa / Master / Amex 可进行海外支付',
          '使用法人卡时建议持卡人与法人名一致',
          '付款收据自动邮件发送',
        ] },
        { no: '07', title: '等待 Google 审核', tag: 'REVIEW', icon: ICONS.mail, desc: 'Google 审核身份与付款信息。', details: [
          '通常 24–72 小时(法人最长 7 天)',
          '审核期间可能会收到补件邮件',
          '通过后会收到"开发者账号已创建"邮件',
        ] },
        { no: '08', title: '配置结算资料', tag: 'PAYOUT', icon: ICONS.card, desc: '要收取付费应用、IAP、广告收入,需添加结算资料。', details: [
          'Play Console > 设置 > 结算资料',
          '填写税务信息(非美国 W-8BEN,当地工商号)',
          '绑定银行账户(可接收本币)',
          '美国税务信息根据法人类型而异',
        ] },
        { no: '09', title: '邀请团队并创建应用', tag: 'POST', icon: ICONS.key, desc: '上线准备。划分团队角色并创建首个应用。', details: [
          '用户和权限 > 邀请新用户',
          '角色:Owner / Admin / Developer / Marketing 等',
          '创建应用 > 填写基础信息并上传 Bundle',
          '推荐 Closed Testing → Open Testing → Production 顺序',
        ] },
      ],
      pitfalls: [
        { title: '身份证件信息不一致', desc: '证件姓名和出生日期需与 Google 账号完全一致方可通过。' },
        { title: 'D-U-N-S 英文表述不一致', desc: 'D-U-N-S 登记的英文法人名/地址与营业执照英文或 Play Console 输入哪怕一字不同,核验都会被驳回。' },
        { title: 'D-U-N-S 发放延迟', desc: '免费申请需要 14–30 天,会严重影响发版节奏。法人账号请在注册前至少一个月提前申请。' },
        { title: '14 天测试要求(2023 年起)', desc: '新建个人账号须至少 20 名测试者、连续 14 天 Closed Testing 后,方可 Production 发布。' },
        { title: '未开启 2FA', desc: '注册中途被要求配置 2FA 而中断的情况较多,请先开启。' },
        { title: 'Google Play 结算政策', desc: '应用内数字商品必须使用 Google Play Billing,使用外部支付可能导致下架。' },
        { title: '开发者名称变更滞后', desc: '首次设定的开发者名称修改需 Google 审批,通常需要数周。' },
      ],
      resources: [
        { title: 'Play Console 注册', desc: '开始创建开发者账号', href: 'https://play.google.com/console/signup' },
        { title: 'Play Console 首页', desc: '应用注册与管理', href: 'https://play.google.com/console' },
        { title: 'Developer Policy Center', desc: '政策指南', href: 'https://support.google.com/googleplay/android-developer/topic/9858052' },
        { title: 'Play 结算系统', desc: 'Google Play Billing', href: 'https://developer.android.com/google/play/billing' },
        { title: 'Closed Testing 要求', desc: '14 天测试指南', href: 'https://support.google.com/googleplay/android-developer/answer/14151465' },
        { title: 'D-U-N-S 查询(UPIK)', desc: 'KED / D&B 查询', href: 'https://www.upik.de/en/upik_search.cgi' },
        { title: '新增 D-U-N-S 申请', desc: 'D&B 官方申请(免费)', href: 'https://www.dnb.com/duns/get-a-duns.html' },
        { title: '结算资料设置', desc: '税务与银行信息', href: 'https://support.google.com/googleplay/android-developer/answer/9859751' },
      ],
    },
  }
}

export default function Page() {
  const locale = useLocale() as Locale
  const data = getData()
  const d = data[locale] ?? data.ko
  return (
    <GuideTemplate
      {...d}
      badge={{ icon: <Play className="h-3.5 w-3.5 text-white/80" />, text: d.badge.text }}
    />
  )
}
