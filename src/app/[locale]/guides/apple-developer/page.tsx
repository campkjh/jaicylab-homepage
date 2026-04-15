'use client'

import { useLocale } from 'next-intl'
import { GuideTemplate, type GuideProps } from '@/components/GuideTemplate'
import { CreditCard, Shield, FileText, Mail, Apple, Building2, User, Key, ExternalLink } from 'lucide-react'

type Locale = 'ko' | 'en' | 'ja' | 'zh'

const ICONS = {
  user: <User className="h-5 w-5" />,
  shield: <Shield className="h-5 w-5" />,
  external: <ExternalLink className="h-5 w-5" />,
  building: <Building2 className="h-5 w-5" />,
  file: <FileText className="h-5 w-5" />,
  card: <CreditCard className="h-5 w-5" />,
  mail: <Mail className="h-5 w-5" />,
  key: <Key className="h-5 w-5" />,
}

type Data = Omit<GuideProps, 'badge'> & { badge: { text: string } }

function getData(): Record<Locale, Data> {
  return {
    ko: {
      badge: { text: 'DEVELOPER ACCOUNT GUIDE' },
      titleTop: 'Apple Developer',
      titleBottom: '계정 생성하기',
      description: `iOS 앱을 App Store에 출시하려면 Apple Developer Program 등록이 필요합니다.\n개인·법인 구분부터 결제, 승인까지 순서대로 안내해 드립니다.`,
      primaryCta: { label: 'Enroll 페이지 열기', href: 'https://developer.apple.com/programs/enroll/' },
      splineUrl: 'https://my.spline.design/appleproductannouncementanimation-9CEboyMmBCKPi0a1OrpYzr2L/',
      stats: [
        { label: '연회비', value: '$99' },
        { label: '심사 기간', value: '1–7일' },
        { label: '필요 문서', value: 'DUNS·카드' },
      ],
      overviewTitle: '앱 출시 전에 확인하세요',
      overviewDesc: 'Apple Developer Program 등록은 단순한 계정 가입 이상의 절차를 포함합니다. 개인/법인 유형은 앱 표기 주체를 결정하고 추후 변경이 어려우므로, 아래 체크리스트를 먼저 점검해 주세요.',
      overviewItems: [
        { icon: ICONS.user, title: '개인 vs 법인 명확히 결정', desc: '앱 이름·스토어 노출 주체가 달라집니다.' },
        { icon: ICONS.shield, title: 'Apple ID + 2FA 준비', desc: '도메인 이메일, 2단계 인증 활성화.' },
        { icon: ICONS.building, title: 'DUNS 번호 (법인)', desc: '무료 발급, 영업일 기준 3~7일 소요.' },
        { icon: ICONS.card, title: '해외결제 카드', desc: '연회비 $99 결제용 Visa/Master/Amex.' },
      ],
      steps: [
        { no: '01', title: 'Apple ID 준비', tag: 'PREREQUISITE', icon: ICONS.user, desc: '없으면 먼저 Apple ID를 생성합니다. 회사 이메일 사용을 권장합니다.', details: [
          'appleid.apple.com에서 가입',
          '개인 이메일이 아닌 도메인 이메일 권장 (예: dev@yourcompany.com)',
          '추후 이관이 거의 불가하므로 신중히 선택',
        ] },
        { no: '02', title: '2단계 인증 활성화', tag: 'SECURITY', icon: ICONS.shield, desc: '개발자 프로그램 가입 전 반드시 2FA가 켜져 있어야 합니다.', details: [
          'iPhone/iPad에서 설정 > Apple ID > 암호 및 보안 > 2단계 인증 켜기',
          '신뢰할 수 있는 전화번호 2개 이상 등록 권장',
          '복구 연락처(Recovery Contact) 설정',
        ] },
        { no: '03', title: 'Apple Developer Program 접속', tag: 'PORTAL', icon: ICONS.external, desc: 'developer.apple.com/programs 에서 Enroll 버튼을 누릅니다.', details: [
          '로그인 후 Enrollment 페이지로 이동',
          '약관 동의 및 등록 유형 선택으로 진행',
          '가입 도중 이탈해도 세션이 유지됨',
        ] },
        { no: '04', title: '등록 유형 선택 (개인 vs 법인)', tag: 'ENTITY', icon: ICONS.building, desc: '앱 스토어 표기 주체에 따라 신중히 선택. 중간 변경이 까다롭습니다.', details: [
          '개인 (Individual): 실명으로 앱 등록, 한국 거주자 주민등록번호 불필요',
          '법인 (Organization): 회사명으로 앱 등록, DUNS 번호 필수',
          'DUNS 번호는 developer.apple.com/enroll/duns-lookup/ 에서 무료 조회·발급',
          'DUNS 신청 후 Apple 연동까지 영업일 기준 3~7일 소요',
        ] },
        { no: '05', title: '법인 정보 입력 (법인만)', tag: 'ORGANIZATION', icon: ICONS.file, desc: '법인 등록의 경우 추가 정보가 필요합니다.', details: [
          '법인명 (DUNS와 정확히 일치해야 함)',
          '법인 주소·대표자·대표 연락처',
          '계약 체결 권한 보유 증명 (필요 시)',
          'Apple이 전화로 실재 확인 (한국어 가능, 영업일 기준 1~5일)',
        ] },
        { no: '06', title: '약관 동의 및 결제', tag: 'PAYMENT', icon: ICONS.card, desc: '연회비 $99(개인/법인 동일)를 신용카드로 결제합니다.', details: [
          'Apple Developer Program License Agreement 동의',
          'Visa / Mastercard / Amex 등 해외 결제 가능 카드 필요',
          '법인 카드 사용 시 법인명 일치 권장',
          '결제 후 영수증 이메일 자동 발송',
        ] },
        { no: '07', title: 'Apple 승인 대기', tag: 'WAITING', icon: ICONS.mail, desc: '심사가 완료되면 승인 메일이 발송됩니다.', details: [
          '개인: 보통 24시간 이내 (최대 2일)',
          '법인: 보통 2~7일 (DUNS 검증·전화 확인 포함)',
          '접수 이메일과 승인 완료 이메일을 반드시 보관',
          '심사 중 developer.apple.com 헤더에 상태 표시됨',
        ] },
        { no: '08', title: 'App Store Connect 셋업', tag: 'POST', icon: ICONS.key, desc: '승인 후 App Store Connect에 접속해 앱 등록 준비.', details: [
          'appstoreconnect.apple.com 로그인',
          '세금/은행 정보 입력 (Paid Apps 계약 필요)',
          '팀 멤버 초대 (Developer / App Manager / Admin 역할)',
          'Xcode에서 동일 Apple ID로 로그인 후 Signing 구성',
        ] },
      ],
      pitfalls: [
        { title: '개인 → 법인 전환은 사실상 불가', desc: '앱 소유권·리뷰·매출이 모두 연결되어 있어 이관이 매우 제한적. 처음부터 올바른 유형 선택이 중요합니다.' },
        { title: 'DUNS 정보 불일치', desc: '법인명·주소가 DUNS와 한 글자라도 다르면 반려됩니다. 사업자등록증 정보와 DUNS를 먼저 일치시키세요.' },
        { title: '2FA 미활성 Apple ID 사용', desc: 'Enrollment 도중 2FA 설정 요구로 중단되는 경우가 많습니다. 가입 전에 먼저 켜두세요.' },
        { title: '법인 카드 소유자 불일치', desc: '대표자 명의가 아닌 경우 전화 확인 시 질문이 길어질 수 있습니다.' },
        { title: '세금/은행 정보 누락', desc: '유료 앱이나 인앱결제를 운영하려면 Paid Apps 계약 완료 후 매출 정산이 가능합니다.' },
      ],
      resources: [
        { title: 'Apple Developer Enrollment', desc: '개발자 프로그램 가입 시작', href: 'https://developer.apple.com/programs/enroll/' },
        { title: 'DUNS Number Lookup', desc: '법인 DUNS 번호 조회·발급', href: 'https://developer.apple.com/enroll/duns-lookup/' },
        { title: 'App Store Connect', desc: '앱 등록 및 관리 콘솔', href: 'https://appstoreconnect.apple.com/' },
        { title: 'Apple ID 관리', desc: '2FA 설정·비밀번호 변경', href: 'https://appleid.apple.com/' },
        { title: 'Developer Program License', desc: '공식 약관 전문', href: 'https://developer.apple.com/support/terms/' },
        { title: 'App Review Guidelines', desc: '심사 가이드라인', href: 'https://developer.apple.com/app-store/review/guidelines/' },
      ],
    },
    en: {
      badge: { text: 'DEVELOPER ACCOUNT GUIDE' },
      titleTop: 'Apple Developer',
      titleBottom: 'Account Setup',
      description: `To ship an iOS app on the App Store, you must enroll in the Apple Developer Program.\nWe walk you through entity type, payment, and approval in order.`,
      primaryCta: { label: 'Open Enroll page', href: 'https://developer.apple.com/programs/enroll/' },
      splineUrl: 'https://my.spline.design/appleproductannouncementanimation-9CEboyMmBCKPi0a1OrpYzr2L/',
      stats: [
        { label: 'Annual fee', value: '$99' },
        { label: 'Review time', value: '1–7 days' },
        { label: 'Documents', value: 'DUNS, card' },
      ],
      overviewTitle: 'Check before you ship',
      overviewDesc: 'Enrolling in the Apple Developer Program involves more than just signing up. The Individual vs Organization choice defines who ships your app and is hard to change later, so run through the checklist first.',
      overviewItems: [
        { icon: ICONS.user, title: 'Decide Individual vs Organization', desc: 'This determines the name displayed on the store.' },
        { icon: ICONS.shield, title: 'Apple ID + 2FA ready', desc: 'Domain email recommended, 2FA enabled.' },
        { icon: ICONS.building, title: 'DUNS number (Organization)', desc: 'Free, 3–7 business days to issue.' },
        { icon: ICONS.card, title: 'International card', desc: 'Visa/Master/Amex for the $99 fee.' },
      ],
      steps: [
        { no: '01', title: 'Prepare your Apple ID', tag: 'PREREQUISITE', icon: ICONS.user, desc: 'Create an Apple ID first if you do not have one. A company email is strongly recommended.', details: [
          'Sign up at appleid.apple.com',
          'Prefer a domain email over a personal one (e.g. dev@yourcompany.com)',
          'Transfers are nearly impossible later, so choose carefully',
        ] },
        { no: '02', title: 'Enable two-factor auth', tag: 'SECURITY', icon: ICONS.shield, desc: '2FA must be enabled on the Apple ID before enrolling.', details: [
          'On iPhone/iPad: Settings > Apple ID > Password & Security > Two-Factor Authentication',
          'Register at least two trusted phone numbers',
          'Set up a Recovery Contact',
        ] },
        { no: '03', title: 'Go to the Developer Program', tag: 'PORTAL', icon: ICONS.external, desc: 'Hit the Enroll button on developer.apple.com/programs.', details: [
          'Log in and move to the Enrollment page',
          'Accept the terms and pick an entity type',
          'The session survives if you step away mid-flow',
        ] },
        { no: '04', title: 'Pick entity type (Individual vs Organization)', tag: 'ENTITY', icon: ICONS.building, desc: 'Choose carefully based on how you want to appear on the App Store — changing later is painful.', details: [
          'Individual: app ships under your real name; no resident number needed for Korean residents',
          'Organization: app ships under the company name; DUNS required',
          'Look up or apply for DUNS for free at developer.apple.com/enroll/duns-lookup/',
          'DUNS-to-Apple sync takes 3–7 business days after application',
        ] },
        { no: '05', title: 'Enter organization info (Organization only)', tag: 'ORGANIZATION', icon: ICONS.file, desc: 'Organization enrollment needs extra details.', details: [
          'Legal entity name (must match DUNS exactly)',
          'Organization address, representative, and contact',
          'Proof of authority to enter contracts (if requested)',
          'Apple will phone-verify the entity (Korean supported, 1–5 business days)',
        ] },
        { no: '06', title: 'Accept terms and pay', tag: 'PAYMENT', icon: ICONS.card, desc: 'Pay the $99 annual fee (same for Individual and Organization) by credit card.', details: [
          'Accept the Apple Developer Program License Agreement',
          'Use a card that supports international payments (Visa / Mastercard / Amex)',
          'For Organization, match the card holder to the legal name when possible',
          'Receipt is emailed automatically after payment',
        ] },
        { no: '07', title: 'Wait for Apple approval', tag: 'WAITING', icon: ICONS.mail, desc: 'Once review completes, an approval email is sent.', details: [
          'Individual: usually within 24 hours (up to 2 days)',
          'Organization: typically 2–7 days (includes DUNS checks and phone verification)',
          'Keep both the intake and approval emails',
          'Status is shown in the developer.apple.com header during review',
        ] },
        { no: '08', title: 'Set up App Store Connect', tag: 'POST', icon: ICONS.key, desc: 'After approval, open App Store Connect to prep your app.', details: [
          'Log in at appstoreconnect.apple.com',
          'Fill in tax and banking info (Paid Apps agreement required)',
          'Invite teammates (Developer / App Manager / Admin roles)',
          'Sign in Xcode with the same Apple ID and configure Signing',
        ] },
      ],
      pitfalls: [
        { title: 'Individual → Organization is practically impossible', desc: 'App ownership, reviews, and revenue are all tied together — transfers are very limited. Picking the right type up front matters.' },
        { title: 'DUNS mismatch', desc: 'A single character difference between your DUNS and registered company name/address causes rejection. Align your business registration info with DUNS first.' },
        { title: 'Apple ID without 2FA', desc: 'Many enrollments stall when 2FA setup is demanded mid-flow. Turn it on beforehand.' },
        { title: 'Corporate card holder mismatch', desc: 'If the card is not in the representative\'s name, phone verification may run longer.' },
        { title: 'Missing tax/bank info', desc: 'Paid apps and IAP revenue only disburse after the Paid Apps agreement is fully signed.' },
      ],
      resources: [
        { title: 'Apple Developer Enrollment', desc: 'Start enrolling in the program', href: 'https://developer.apple.com/programs/enroll/' },
        { title: 'DUNS Number Lookup', desc: 'Look up or apply for a DUNS', href: 'https://developer.apple.com/enroll/duns-lookup/' },
        { title: 'App Store Connect', desc: 'App submission and management console', href: 'https://appstoreconnect.apple.com/' },
        { title: 'Apple ID management', desc: 'Set up 2FA, change passwords', href: 'https://appleid.apple.com/' },
        { title: 'Developer Program License', desc: 'Official full license terms', href: 'https://developer.apple.com/support/terms/' },
        { title: 'App Review Guidelines', desc: 'Official review guidelines', href: 'https://developer.apple.com/app-store/review/guidelines/' },
      ],
    },
    ja: {
      badge: { text: 'DEVELOPER ACCOUNT GUIDE' },
      titleTop: 'Apple Developer',
      titleBottom: 'アカウント作成',
      description: `iOSアプリをApp Storeに公開するには、Apple Developer Programへの登録が必要です。\n個人・法人の区分から決済、承認まで順を追ってご案内します。`,
      primaryCta: { label: 'Enrollページを開く', href: 'https://developer.apple.com/programs/enroll/' },
      splineUrl: 'https://my.spline.design/appleproductannouncementanimation-9CEboyMmBCKPi0a1OrpYzr2L/',
      stats: [
        { label: '年会費', value: '$99' },
        { label: '審査期間', value: '1–7日' },
        { label: '必要書類', value: 'DUNS・カード' },
      ],
      overviewTitle: 'アプリ公開前にご確認ください',
      overviewDesc: 'Apple Developer Programの登録は単なるアカウント作成以上の手続きを含みます。個人/法人の区分はストアでの表示名を決め、後から変更するのが難しいため、まずは下のチェックリストを確認してください。',
      overviewItems: [
        { icon: ICONS.user, title: '個人か法人かを明確に決める', desc: 'ストアに表示される名義が変わります。' },
        { icon: ICONS.shield, title: 'Apple ID + 2FA準備', desc: 'ドメインメールと2段階認証を有効化。' },
        { icon: ICONS.building, title: 'DUNS番号(法人)', desc: '無料発行、営業日で3~7日かかります。' },
        { icon: ICONS.card, title: '海外決済対応カード', desc: '年会費$99の決済用Visa/Master/Amex。' },
      ],
      steps: [
        { no: '01', title: 'Apple IDの準備', tag: 'PREREQUISITE', icon: ICONS.user, desc: 'まだなければApple IDを作成します。会社のメールアドレス利用を推奨します。', details: [
          'appleid.apple.comで登録',
          '個人メールではなくドメインメール推奨(例: dev@yourcompany.com)',
          '後から移管がほぼ不可なので慎重に選択',
        ] },
        { no: '02', title: '2段階認証の有効化', tag: 'SECURITY', icon: ICONS.shield, desc: 'Developer Program登録前に必ず2FAが有効になっている必要があります。', details: [
          'iPhone/iPadで 設定 > Apple ID > パスワードとセキュリティ > 2ファクタ認証をオン',
          '信頼できる電話番号を2つ以上登録推奨',
          'リカバリ連絡先(Recovery Contact)を設定',
        ] },
        { no: '03', title: 'Apple Developer Programへアクセス', tag: 'PORTAL', icon: ICONS.external, desc: 'developer.apple.com/programsでEnrollボタンをクリック。', details: [
          'ログイン後Enrollmentページへ移動',
          '規約に同意し登録タイプを選択',
          '途中で離脱してもセッションは維持されます',
        ] },
        { no: '04', title: '登録タイプの選択(個人 vs 法人)', tag: 'ENTITY', icon: ICONS.building, desc: 'App Storeの表示名義によって慎重に選択。途中変更は困難です。', details: [
          '個人(Individual): 実名でアプリを登録、韓国居住者の住民登録番号は不要',
          '法人(Organization): 会社名で登録、DUNS番号が必須',
          'DUNS番号はdeveloper.apple.com/enroll/duns-lookup/で無料照会・発行',
          'DUNS申請後Apple連携まで営業日で3~7日',
        ] },
        { no: '05', title: '法人情報の入力(法人のみ)', tag: 'ORGANIZATION', icon: ICONS.file, desc: '法人登録の場合は追加情報が必要です。', details: [
          '法人名(DUNSと完全一致する必要あり)',
          '法人住所・代表者・代表連絡先',
          '契約締結権限の証明(要求時)',
          'Appleが電話で実在確認(日本語対応可、営業日1~5日)',
        ] },
        { no: '06', title: '規約同意と決済', tag: 'PAYMENT', icon: ICONS.card, desc: '年会費$99(個人・法人同額)をクレジットカードで決済します。', details: [
          'Apple Developer Program License Agreementに同意',
          'Visa / Mastercard / Amex等、海外決済可能なカードが必要',
          '法人カード利用時は法人名の一致を推奨',
          '決済後に領収書が自動でメール送信されます',
        ] },
        { no: '07', title: 'Apple承認待ち', tag: 'WAITING', icon: ICONS.mail, desc: '審査が完了すると承認メールが送信されます。', details: [
          '個人: 通常24時間以内(最大2日)',
          '法人: 通常2~7日(DUNS検証・電話確認含む)',
          '受付メールと承認完了メールは必ず保管',
          '審査中はdeveloper.apple.comのヘッダにステータス表示',
        ] },
        { no: '08', title: 'App Store Connectのセットアップ', tag: 'POST', icon: ICONS.key, desc: '承認後、App Store Connectにアクセスしアプリ登録の準備。', details: [
          'appstoreconnect.apple.comにログイン',
          '税務・銀行情報を入力(Paid Apps契約が必要)',
          'チームメンバー招待(Developer / App Manager / Admin)',
          'Xcodeで同じApple IDにログインしSigningを構成',
        ] },
      ],
      pitfalls: [
        { title: '個人 → 法人への変更は事実上不可', desc: 'アプリの所有権・レビュー・売上が紐づいており移管は非常に限定的。最初から正しいタイプを選ぶことが重要です。' },
        { title: 'DUNS情報の不一致', desc: '法人名・住所がDUNSと1文字でも異なると差し戻されます。事業者登録情報とDUNSを先に一致させてください。' },
        { title: '2FA未設定のApple ID利用', desc: 'Enrollment中に2FA設定を求められ中断するケースが多いです。事前に有効化を。' },
        { title: '法人カード名義の不一致', desc: '代表者名義でない場合、電話確認で質問が長引くことがあります。' },
        { title: '税務・銀行情報の未入力', desc: '有料アプリやIAPを運用するにはPaid Apps契約完了後に売上精算が可能になります。' },
      ],
      resources: [
        { title: 'Apple Developer Enrollment', desc: 'Developer Program登録開始', href: 'https://developer.apple.com/programs/enroll/' },
        { title: 'DUNS Number Lookup', desc: '法人DUNS番号の照会・発行', href: 'https://developer.apple.com/enroll/duns-lookup/' },
        { title: 'App Store Connect', desc: 'アプリ登録・管理コンソール', href: 'https://appstoreconnect.apple.com/' },
        { title: 'Apple ID管理', desc: '2FA設定・パスワード変更', href: 'https://appleid.apple.com/' },
        { title: 'Developer Program License', desc: '公式規約全文', href: 'https://developer.apple.com/support/terms/' },
        { title: 'App Review Guidelines', desc: '審査ガイドライン', href: 'https://developer.apple.com/app-store/review/guidelines/' },
      ],
    },
    zh: {
      badge: { text: 'DEVELOPER ACCOUNT GUIDE' },
      titleTop: 'Apple Developer',
      titleBottom: '账号创建',
      description: `要将 iOS 应用发布到 App Store,必须注册 Apple Developer Program。\n从个人/法人区分到付款、审核,我们按顺序为您指导。`,
      primaryCta: { label: '打开 Enroll 页面', href: 'https://developer.apple.com/programs/enroll/' },
      splineUrl: 'https://my.spline.design/appleproductannouncementanimation-9CEboyMmBCKPi0a1OrpYzr2L/',
      stats: [
        { label: '年费', value: '$99' },
        { label: '审核周期', value: '1–7 天' },
        { label: '所需材料', value: 'DUNS·银行卡' },
      ],
      overviewTitle: '发布前请先确认',
      overviewDesc: '注册 Apple Developer Program 不只是开通账号那么简单。个人/法人类型决定了应用在商店的署名主体,事后几乎无法更改,请先对照下方清单自查。',
      overviewItems: [
        { icon: ICONS.user, title: '明确选择个人或法人', desc: '应用名称与商店署名会不同。' },
        { icon: ICONS.shield, title: '准备 Apple ID 与 2FA', desc: '推荐域名邮箱并开启两步验证。' },
        { icon: ICONS.building, title: 'DUNS 编号(法人)', desc: '免费申请,工作日 3~7 天。' },
        { icon: ICONS.card, title: '国际支付卡', desc: '用于支付 $99 年费的 Visa/Master/Amex。' },
      ],
      steps: [
        { no: '01', title: '准备 Apple ID', tag: 'PREREQUISITE', icon: ICONS.user, desc: '没有的话先创建 Apple ID,建议使用公司邮箱。', details: [
          '在 appleid.apple.com 注册',
          '建议用企业域名邮箱而非个人邮箱(如 dev@yourcompany.com)',
          '后续几乎无法转移,请谨慎选择',
        ] },
        { no: '02', title: '开启两步验证', tag: 'SECURITY', icon: ICONS.shield, desc: '在加入开发者计划前必须开启 2FA。', details: [
          'iPhone/iPad 上:设置 > Apple ID > 密码与安全性 > 开启两步验证',
          '建议注册至少两个可信电话号码',
          '设置恢复联系人(Recovery Contact)',
        ] },
        { no: '03', title: '进入 Apple Developer Program', tag: 'PORTAL', icon: ICONS.external, desc: '在 developer.apple.com/programs 点击 Enroll。', details: [
          '登录后进入 Enrollment 页面',
          '同意协议并选择注册类型',
          '中途离开会话仍会保留',
        ] },
        { no: '04', title: '选择注册类型(个人 vs 法人)', tag: 'ENTITY', icon: ICONS.building, desc: '请根据 App Store 署名主体谨慎选择,中途更改非常困难。', details: [
          '个人(Individual):以实名注册应用,韩国居民无需身份证号',
          '法人(Organization):以公司名义注册,必须提供 DUNS 编号',
          'DUNS 可在 developer.apple.com/enroll/duns-lookup/ 免费查询或申请',
          'DUNS 申请到与 Apple 对接,工作日约 3~7 天',
        ] },
        { no: '05', title: '填写法人信息(仅法人)', tag: 'ORGANIZATION', icon: ICONS.file, desc: '法人注册需要额外信息。', details: [
          '法人名称(须与 DUNS 完全一致)',
          '法人地址、代表人及联系方式',
          '签约权限证明(如有需要)',
          'Apple 会电话核实(支持中文,工作日 1~5 天)',
        ] },
        { no: '06', title: '同意条款并付款', tag: 'PAYMENT', icon: ICONS.card, desc: '使用信用卡支付 $99 年费(个人/法人同价)。', details: [
          '同意 Apple Developer Program License Agreement',
          '需要支持海外结算的 Visa / Mastercard / Amex 等',
          '使用法人卡时建议持卡人与法人名一致',
          '付款后自动发送电子收据',
        ] },
        { no: '07', title: '等待 Apple 审核', tag: 'WAITING', icon: ICONS.mail, desc: '审核完成后会发送批准邮件。', details: [
          '个人:通常 24 小时内(最多 2 天)',
          '法人:通常 2~7 天(含 DUNS 验证与电话核实)',
          '受理邮件与批准邮件务必保存',
          '审核期间 developer.apple.com 顶部会显示状态',
        ] },
        { no: '08', title: '配置 App Store Connect', tag: 'POST', icon: ICONS.key, desc: '批准后登录 App Store Connect 准备上架。', details: [
          '登录 appstoreconnect.apple.com',
          '填写税务与银行信息(需签 Paid Apps 协议)',
          '邀请团队成员(Developer / App Manager / Admin)',
          '在 Xcode 使用同一 Apple ID 登录并配置 Signing',
        ] },
      ],
      pitfalls: [
        { title: '个人 → 法人实际上无法切换', desc: '应用的所有权、评论和营收全部绑定,迁移非常受限。从一开始就选对类型至关重要。' },
        { title: 'DUNS 信息不一致', desc: '法人名/地址与 DUNS 哪怕只有一个字不同也会被驳回。请先使营业执照与 DUNS 完全一致。' },
        { title: '使用未开启 2FA 的 Apple ID', desc: 'Enrollment 中途被要求设置 2FA 而中断的情况很多,请事先开启。' },
        { title: '法人卡持卡人不一致', desc: '持卡人非代表人时,电话核实环节可能被追问更多细节。' },
        { title: '税务/银行信息未填', desc: '若要运营付费应用或 IAP,需完成 Paid Apps 协议后方可结算收入。' },
      ],
      resources: [
        { title: 'Apple Developer Enrollment', desc: '开始注册开发者计划', href: 'https://developer.apple.com/programs/enroll/' },
        { title: 'DUNS Number Lookup', desc: '法人 DUNS 编号查询/申请', href: 'https://developer.apple.com/enroll/duns-lookup/' },
        { title: 'App Store Connect', desc: '应用提交与管理控制台', href: 'https://appstoreconnect.apple.com/' },
        { title: 'Apple ID 管理', desc: '2FA 设置与密码修改', href: 'https://appleid.apple.com/' },
        { title: 'Developer Program License', desc: '官方协议全文', href: 'https://developer.apple.com/support/terms/' },
        { title: 'App Review Guidelines', desc: '审核指南', href: 'https://developer.apple.com/app-store/review/guidelines/' },
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
      badge={{ icon: <Apple className="h-3.5 w-3.5 text-white/80" />, text: d.badge.text }}
    />
  )
}
