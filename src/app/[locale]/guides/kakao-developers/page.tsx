'use client'

import { useLocale } from 'next-intl'
import { GuideTemplate, type GuideProps } from '@/components/GuideTemplate'
import { MessageCircle, User, Shield, FileText, Key, Settings, Globe } from 'lucide-react'

type Locale = 'ko' | 'en' | 'ja' | 'zh'

const ICONS = {
  user: <User className="h-5 w-5" />,
  settings: <Settings className="h-5 w-5" />,
  key: <Key className="h-5 w-5" />,
  globe: <Globe className="h-5 w-5" />,
  shield: <Shield className="h-5 w-5" />,
  file: <FileText className="h-5 w-5" />,
  msg: <MessageCircle className="h-5 w-5" />,
}

type Data = Omit<GuideProps, 'badge'> & { badge: { text: string } }

function getData(): Record<Locale, Data> {
  return {
    ko: {
      badge: { text: 'KAKAO DEVELOPERS' },
      titleTop: 'Kakao Developers',
      titleBottom: '앱 등록 & 키 발급',
      description: `카카오 로그인·지도·알림톡·공유하기 등 카카오 API를 사용하려면 Kakao Developers에 앱을 등록해야 합니다.\n앱 생성부터 키 발급, 플랫폼 설정까지 순서대로 안내합니다.`,
      primaryCta: { label: 'Kakao Developers 열기', href: 'https://developers.kakao.com' },
      stats: [
        { label: '가입비', value: '무료' },
        { label: '심사 기간', value: '즉시' },
        { label: '필요 정보', value: '카카오 계정' },
      ],
      overviewTitle: '시작 전에 확인하세요',
      overviewDesc: 'Kakao Developers는 무료로 가입 가능하지만, 일부 기능(카카오 로그인 동의 항목·알림톡·비즈메시지)은 추가 신청·심사가 필요합니다. 앱 키는 절대 클라이언트에 노출하지 마세요 — Admin 키는 서버 전용입니다.',
      overviewItems: [
        { icon: ICONS.user, title: '카카오 계정 준비', desc: '이메일/휴대폰 인증된 계정 필요.' },
        { icon: ICONS.globe, title: '서비스 도메인 결정', desc: '웹 서비스면 도메인 미리 확정.' },
        { icon: ICONS.shield, title: '개인정보 처리방침 URL', desc: '카카오 로그인 심사에 필수.' },
        { icon: ICONS.file, title: '비즈니스 계정 (선택)', desc: '알림톡·비즈메시지 필요 시.' },
      ],
      steps: [
        { no: '01', title: '카카오 계정 + 개발자 등록', tag: 'SIGNUP', icon: ICONS.user, desc: 'Kakao Developers에 로그인하고 개발자로 등록합니다.', details: [
          'developers.kakao.com 접속 → 우측 상단 로그인',
          '최초 로그인 시 개발자 이용약관 동의',
          '이메일/휴대폰 인증 완료 필수',
        ] },
        { no: '02', title: '내 애플리케이션 생성', tag: 'CREATE APP', icon: ICONS.settings, desc: '앱 기본 정보를 입력합니다.', details: [
          '내 애플리케이션 > 애플리케이션 추가하기',
          '앱 아이콘 (최소 128×128, PNG 권장)',
          '앱 이름 (카카오톡 공유·로그인 화면에 노출)',
          '사업자명 / 카테고리 선택',
        ] },
        { no: '03', title: '앱 키 확인 & 보안 관리', tag: 'KEYS', icon: ICONS.key, desc: '4종 앱 키가 자동 발급됩니다.', details: [
          '네이티브 앱 키: iOS/Android 네이티브 SDK에서 사용',
          'JavaScript 키: 웹 JS SDK에서 사용 (도메인 제한 필수)',
          'REST API 키: 서버에서 REST 호출 시 사용',
          'Admin 키: 사용자 관리 API · 절대 클라이언트 노출 금지',
          '키가 노출되면 앱 설정에서 재발급 가능',
        ] },
        { no: '04', title: '플랫폼 등록', tag: 'PLATFORM', icon: ICONS.globe, desc: '앱이 구동될 플랫폼 정보를 등록합니다.', details: [
          'Android: 패키지명 + 키 해시 등록 (keystore SHA1 → Base64)',
          'iOS: 번들 ID 등록',
          '웹: 사이트 도메인 (http://localhost 포함 여러 개 가능)',
          'SDK에서 플랫폼 미등록이면 호출 실패',
        ] },
        { no: '05', title: '카카오 로그인 활성화', tag: 'AUTH', icon: ICONS.shield, desc: '카카오 로그인을 사용할 경우 활성화 + Redirect URI 등록.', details: [
          '제품 설정 > 카카오 로그인 > 활성화 ON',
          'OpenID Connect 활성화 (JWT 토큰 필요 시)',
          'Redirect URI 등록 (웹만 필요, 네이티브는 앱 키 기반)',
          '동의 항목 설정 (닉네임·프로필·이메일·연령대 등)',
          '필수 동의는 심사 필요 · 선택 동의는 즉시 사용 가능',
        ] },
        { no: '06', title: '동의 항목 심사 요청 (필요 시)', tag: 'REVIEW', icon: ICONS.file, desc: '이메일·생일·성별 등 일부 항목은 비즈 앱으로 전환 후 심사를 받아야 합니다.', details: [
          '비즈 앱 전환: 사업자등록증 업로드',
          '개인정보 처리방침 URL 등록 필수',
          '심사 항목: 이메일·생일·출생연도·성별·연락처·주소 등',
          '심사 기간: 영업일 기준 1–5일',
        ] },
        { no: '07', title: '카카오톡 메시지 / 공유하기', tag: 'MESSAGE', icon: ICONS.msg, desc: '메시지 API 설정. 알림톡과는 별도.', details: [
          '제품 설정 > 카카오톡 메시지 > 활성화',
          '템플릿 빌더에서 공유·메시지 템플릿 제작',
          '템플릿 ID로 네이티브/JS SDK에서 전송',
          '실제 메시지 전송은 수신자 동의(talk_message) 스코프 필요',
        ] },
        { no: '08', title: '알림톡 (선택·별도 신청)', tag: 'ALIMTALK', icon: ICONS.msg, desc: '알림톡은 Kakao Developers가 아닌 비즈메시지 플랫폼(NHN·Aligo 등)을 통해 발송.', details: [
          'Kakao Business > 카카오톡 채널 개설 먼저',
          '채널 비즈 인증 완료',
          'NHN Cloud · Aligo · 스윙팜 등 발송대행사 계약',
          '템플릿은 카카오 직접 심사 (영업일 기준 1–2일)',
          '건당 8~10원 과금',
        ] },
      ],
      pitfalls: [
        { title: '키 해시 불일치 (Android)', desc: 'debug keystore와 release keystore SHA1이 다릅니다. 두 해시 모두 등록해야 배포 앱에서도 카카오 로그인이 동작합니다.' },
        { title: 'JavaScript 키 도메인 제한 미설정', desc: '모든 도메인 허용 상태로 두면 타인이 키를 도용할 수 있어요. 플랫폼 > 웹에서 허용 도메인 명시.' },
        { title: 'Admin 키 클라이언트 노출', desc: 'GitHub Public 저장소에 Admin 키가 올라가는 사고가 빈번합니다. .env로 분리하고 gitignore 확인.' },
        { title: '이메일 필수 동의 항목 사용', desc: '심사 없이 이메일을 필수 동의로 설정하면 로그인 시 오류. 비즈 앱 전환 + 심사 완료 후 사용하세요.' },
        { title: '알림톡과 친구톡 혼동', desc: '알림톡은 정보성(동의 불필요)·친구톡은 광고성(채널 친구만). 용도에 맞게 선택.' },
      ],
      resources: [
        { title: 'Kakao Developers 콘솔', desc: '앱 등록·키 관리', href: 'https://developers.kakao.com' },
        { title: '카카오 로그인 문서', desc: 'REST · 네이티브 · JS SDK', href: 'https://developers.kakao.com/docs/latest/ko/kakaologin/common' },
        { title: '카카오맵 Web SDK', desc: 'JS 지도 API', href: 'https://apis.map.kakao.com/web/' },
        { title: '동의 항목 심사 가이드', desc: '비즈 앱 전환 방법', href: 'https://developers.kakao.com/docs/latest/ko/app-register/how-to#consent-item' },
        { title: '카카오 비즈니스', desc: '채널·알림톡 신청', href: 'https://business.kakao.com' },
        { title: 'Android 키 해시 생성', desc: 'keystore → 키 해시', href: 'https://developers.kakao.com/docs/latest/ko/android/getting-started#add-sdk' },
      ],
    },
    en: {
      badge: { text: 'KAKAO DEVELOPERS' },
      titleTop: 'Kakao Developers',
      titleBottom: 'App & Key Setup',
      description: `To use Kakao APIs such as Kakao Login, Maps, AlimTalk, and Share, you must register an app on Kakao Developers.\nWe walk you through app creation, key issuance, and platform config in order.`,
      primaryCta: { label: 'Open Kakao Developers', href: 'https://developers.kakao.com' },
      stats: [
        { label: 'Signup fee', value: 'Free' },
        { label: 'Review', value: 'Instant' },
        { label: 'Needed', value: 'Kakao account' },
      ],
      overviewTitle: 'Check before you start',
      overviewDesc: 'Kakao Developers is free to join, but some features (Kakao Login consent items, AlimTalk, Biz Message) require extra application and review. Never expose app keys on the client — the Admin key is server-only.',
      overviewItems: [
        { icon: ICONS.user, title: 'Prepare a Kakao account', desc: 'Must have email/phone verification.' },
        { icon: ICONS.globe, title: 'Decide the service domain', desc: 'Lock down the domain for web first.' },
        { icon: ICONS.shield, title: 'Privacy policy URL', desc: 'Required for Kakao Login review.' },
        { icon: ICONS.file, title: 'Business account (optional)', desc: 'If you need AlimTalk/Biz Message.' },
      ],
      steps: [
        { no: '01', title: 'Kakao account + developer registration', tag: 'SIGNUP', icon: ICONS.user, desc: 'Log in to Kakao Developers and register as a developer.', details: [
          'Go to developers.kakao.com and log in (top right)',
          'Accept the developer terms on first login',
          'Email/phone verification is required',
        ] },
        { no: '02', title: 'Create an application', tag: 'CREATE APP', icon: ICONS.settings, desc: 'Enter basic app info.', details: [
          'My Applications > Add an application',
          'App icon (at least 128×128, PNG recommended)',
          'App name (shown on Kakao Talk share and login screens)',
          'Business name / category',
        ] },
        { no: '03', title: 'Check app keys and secure them', tag: 'KEYS', icon: ICONS.key, desc: 'Four app keys are issued automatically.', details: [
          'Native app key: used by iOS/Android native SDKs',
          'JavaScript key: used by the Web JS SDK (must be domain-restricted)',
          'REST API key: used for REST calls from the server',
          'Admin key: user-admin API — never expose to clients',
          'If a key leaks, regenerate it in app settings',
        ] },
        { no: '04', title: 'Register platforms', tag: 'PLATFORM', icon: ICONS.globe, desc: 'Register the platforms your app will run on.', details: [
          'Android: package name + key hash (keystore SHA1 → Base64)',
          'iOS: bundle ID',
          'Web: site domains (you can register multiple, including http://localhost)',
          'Unregistered platforms will fail all SDK calls',
        ] },
        { no: '05', title: 'Enable Kakao Login', tag: 'AUTH', icon: ICONS.shield, desc: 'Enable and register Redirect URIs if you use Kakao Login.', details: [
          'Product settings > Kakao Login > toggle ON',
          'Enable OpenID Connect (if you need JWT tokens)',
          'Register Redirect URI (web only; native uses the app key)',
          'Configure consent items (nickname, profile, email, age range, etc.)',
          'Required consent needs review; optional consent is usable immediately',
        ] },
        { no: '06', title: 'Submit consent items for review (if needed)', tag: 'REVIEW', icon: ICONS.file, desc: 'Items like email, birthday, and gender require switching to a Biz App and passing review.', details: [
          'Convert to Biz App: upload business registration',
          'Registering a privacy policy URL is required',
          'Reviewable items: email, birthday, year of birth, gender, phone, address, etc.',
          'Review takes 1–5 business days',
        ] },
        { no: '07', title: 'Kakao Talk Message / Share', tag: 'MESSAGE', icon: ICONS.msg, desc: 'Message API config. Separate from AlimTalk.', details: [
          'Product settings > Kakao Talk Message > enable',
          'Build share/message templates in the Template Builder',
          'Send via Native/JS SDK using the template ID',
          'Actually sending messages requires the recipient\'s talk_message scope',
        ] },
        { no: '08', title: 'AlimTalk (optional, separate signup)', tag: 'ALIMTALK', icon: ICONS.msg, desc: 'AlimTalk is delivered via Biz Message partners (NHN, Aligo, etc.), not Kakao Developers.', details: [
          'Kakao Business > open a Kakao Talk Channel first',
          'Complete channel biz verification',
          'Contract with a delivery partner (NHN Cloud, Aligo, Swingpham, etc.)',
          'Kakao reviews templates directly (1–2 business days)',
          'Billed at roughly 8–10 KRW per message',
        ] },
      ],
      pitfalls: [
        { title: 'Key hash mismatch (Android)', desc: 'The debug keystore SHA1 differs from the release keystore. Register both hashes so Kakao Login works in the released build.' },
        { title: 'Unrestricted JavaScript key', desc: 'Leaving the JS key open to all domains lets anyone steal it. Specify allowed domains under Platform > Web.' },
        { title: 'Admin key exposed on the client', desc: 'Admin keys leak to public GitHub repos often. Move them to .env and check your gitignore.' },
        { title: 'Email as a required consent item without review', desc: 'Setting email as required without passing review breaks login. Convert to Biz App and finish review first.' },
        { title: 'AlimTalk vs FriendTalk confusion', desc: 'AlimTalk is informational (no consent needed); FriendTalk is promotional (channel friends only). Pick based on use case.' },
      ],
      resources: [
        { title: 'Kakao Developers console', desc: 'App registration and keys', href: 'https://developers.kakao.com' },
        { title: 'Kakao Login docs', desc: 'REST / Native / JS SDK', href: 'https://developers.kakao.com/docs/latest/ko/kakaologin/common' },
        { title: 'Kakao Map Web SDK', desc: 'JS Maps API', href: 'https://apis.map.kakao.com/web/' },
        { title: 'Consent item review guide', desc: 'How to convert to Biz App', href: 'https://developers.kakao.com/docs/latest/ko/app-register/how-to#consent-item' },
        { title: 'Kakao Business', desc: 'Channel & AlimTalk signup', href: 'https://business.kakao.com' },
        { title: 'Android key hash', desc: 'keystore → key hash', href: 'https://developers.kakao.com/docs/latest/ko/android/getting-started#add-sdk' },
      ],
    },
    ja: {
      badge: { text: 'KAKAO DEVELOPERS' },
      titleTop: 'Kakao Developers',
      titleBottom: 'アプリ登録とキー発行',
      description: `Kakaoログイン・マップ・アルリムトク・シェア等のKakao APIを利用するには、Kakao Developersにアプリを登録する必要があります。\nアプリ作成からキー発行、プラットフォーム設定まで順を追って説明します。`,
      primaryCta: { label: 'Kakao Developersを開く', href: 'https://developers.kakao.com' },
      stats: [
        { label: '登録料', value: '無料' },
        { label: '審査', value: '即時' },
        { label: '必要', value: 'Kakaoアカウント' },
      ],
      overviewTitle: '開始前にご確認ください',
      overviewDesc: 'Kakao Developersは無料で登録可能ですが、一部機能(Kakaoログイン同意項目・アルリムトク・ビズメッセージ)は追加申請・審査が必要です。アプリキーは絶対にクライアントに露出させないでください — Adminキーはサーバー専用です。',
      overviewItems: [
        { icon: ICONS.user, title: 'Kakaoアカウント準備', desc: 'メール/携帯認証済みアカウントが必要。' },
        { icon: ICONS.globe, title: 'サービスドメイン決定', desc: 'Webサービスならドメインを先に確定。' },
        { icon: ICONS.shield, title: 'プライバシーポリシーURL', desc: 'Kakaoログイン審査に必須。' },
        { icon: ICONS.file, title: 'ビジネスアカウント(任意)', desc: 'アルリムトク・ビズメッセージが必要な場合。' },
      ],
      steps: [
        { no: '01', title: 'Kakaoアカウント + 開発者登録', tag: 'SIGNUP', icon: ICONS.user, desc: 'Kakao Developersにログインし、開発者として登録します。', details: [
          'developers.kakao.comにアクセス → 右上ログイン',
          '初回ログイン時に開発者利用規約に同意',
          'メール/携帯認証の完了が必須',
        ] },
        { no: '02', title: 'マイアプリケーション作成', tag: 'CREATE APP', icon: ICONS.settings, desc: 'アプリの基本情報を入力します。', details: [
          'マイアプリケーション > アプリケーションを追加',
          'アプリアイコン(最小128×128、PNG推奨)',
          'アプリ名(KakaoTalkシェア・ログイン画面に表示)',
          '事業者名 / カテゴリを選択',
        ] },
        { no: '03', title: 'アプリキー確認とセキュリティ', tag: 'KEYS', icon: ICONS.key, desc: '4種のアプリキーが自動発行されます。', details: [
          'ネイティブアプリキー: iOS/Androidネイティブ SDKで使用',
          'JavaScriptキー: Web JS SDKで使用(ドメイン制限必須)',
          'REST APIキー: サーバーからのREST呼び出し',
          'Adminキー: ユーザー管理 API・クライアント露出厳禁',
          'キー漏洩時はアプリ設定から再発行可能',
        ] },
        { no: '04', title: 'プラットフォーム登録', tag: 'PLATFORM', icon: ICONS.globe, desc: 'アプリが動作するプラットフォーム情報を登録します。', details: [
          'Android: パッケージ名 + キーハッシュ(keystore SHA1 → Base64)',
          'iOS: バンドルID登録',
          'Web: サイトドメイン(http://localhost含め複数可)',
          '未登録のプラットフォームはSDK呼び出しが失敗',
        ] },
        { no: '05', title: 'Kakaoログイン有効化', tag: 'AUTH', icon: ICONS.shield, desc: 'Kakaoログインを使う場合は有効化とRedirect URI登録。', details: [
          '製品設定 > Kakaoログイン > 有効化 ON',
          'OpenID Connect有効化(JWTトークンが必要な場合)',
          'Redirect URI登録(Webのみ、ネイティブはアプリキー)',
          '同意項目設定(ニックネーム・プロフィール・メール・年代等)',
          '必須同意は審査が必要・任意同意は即時利用可能',
        ] },
        { no: '06', title: '同意項目の審査依頼(必要時)', tag: 'REVIEW', icon: ICONS.file, desc: 'メール・誕生日・性別など一部項目はビズアプリ転換後に審査が必要です。', details: [
          'ビズアプリ転換: 事業者登録証アップロード',
          'プライバシーポリシーURL登録必須',
          '審査項目: メール・誕生日・出生年・性別・連絡先・住所等',
          '審査期間: 営業日1–5日',
        ] },
        { no: '07', title: 'KakaoTalkメッセージ / シェア', tag: 'MESSAGE', icon: ICONS.msg, desc: 'メッセージAPI設定。アルリムトクとは別。', details: [
          '製品設定 > KakaoTalkメッセージ > 有効化',
          'テンプレートビルダーでシェア/メッセージテンプレートを作成',
          'テンプレートIDでネイティブ/JS SDKから送信',
          '実際の送信には受信者同意(talk_message)スコープが必要',
        ] },
        { no: '08', title: 'アルリムトク(任意・別途申請)', tag: 'ALIMTALK', icon: ICONS.msg, desc: 'アルリムトクはKakao Developersではなくビズメッセージプラットフォーム(NHN・Aligo等)経由で送信。', details: [
          'Kakao Business > KakaoTalkチャンネル開設が先',
          'チャンネルのビズ認証完了',
          'NHN Cloud・Aligo・スイングファーム等の発送代行契約',
          'テンプレートはKakaoが直接審査(営業日1–2日)',
          '件単価はおよそ8~10ウォン',
        ] },
      ],
      pitfalls: [
        { title: 'キーハッシュ不一致(Android)', desc: 'debug keystoreとrelease keystoreのSHA1は異なります。両方のハッシュを登録しないとリリースアプリでKakaoログインが動きません。' },
        { title: 'JavaScriptキーのドメイン制限未設定', desc: '全ドメイン許可のままだと他人にキーを盗まれる可能性があります。プラットフォーム > Webで許可ドメインを明示。' },
        { title: 'Adminキーのクライアント露出', desc: 'GitHubパブリックリポジトリにAdminキーが上がる事故が頻発します。.envに分離しgitignoreを確認。' },
        { title: 'メールを未審査で必須同意', desc: '審査なしでメールを必須同意に設定するとログイン時にエラー。ビズアプリ転換+審査完了後に利用してください。' },
        { title: 'アルリムトクとフレンドトクの混同', desc: 'アルリムトクは情報性(同意不要)・フレンドトクは広告性(チャンネル友だちのみ)。用途に合わせて選択。' },
      ],
      resources: [
        { title: 'Kakao Developersコンソール', desc: 'アプリ登録・キー管理', href: 'https://developers.kakao.com' },
        { title: 'Kakaoログインドキュメント', desc: 'REST・ネイティブ・JS SDK', href: 'https://developers.kakao.com/docs/latest/ko/kakaologin/common' },
        { title: 'Kakaoマップ Web SDK', desc: 'JSマップAPI', href: 'https://apis.map.kakao.com/web/' },
        { title: '同意項目審査ガイド', desc: 'ビズアプリ転換方法', href: 'https://developers.kakao.com/docs/latest/ko/app-register/how-to#consent-item' },
        { title: 'Kakao Business', desc: 'チャンネル・アルリムトク申請', href: 'https://business.kakao.com' },
        { title: 'Androidキーハッシュ生成', desc: 'keystore → キーハッシュ', href: 'https://developers.kakao.com/docs/latest/ko/android/getting-started#add-sdk' },
      ],
    },
    zh: {
      badge: { text: 'KAKAO DEVELOPERS' },
      titleTop: 'Kakao Developers',
      titleBottom: '应用注册与密钥发放',
      description: `要使用 Kakao 登录、地图、AlimTalk、分享等 Kakao API,需要在 Kakao Developers 注册应用。\n从应用创建、密钥发放到平台配置,按顺序为您指导。`,
      primaryCta: { label: '打开 Kakao Developers', href: 'https://developers.kakao.com' },
      stats: [
        { label: '注册费', value: '免费' },
        { label: '审核', value: '即时' },
        { label: '所需', value: 'Kakao 账号' },
      ],
      overviewTitle: '开始前请先确认',
      overviewDesc: 'Kakao Developers 免费注册,但部分功能(Kakao 登录同意项、AlimTalk、Biz Message)需要额外申请与审核。应用密钥千万不要暴露在客户端 — Admin 密钥仅限服务端使用。',
      overviewItems: [
        { icon: ICONS.user, title: '准备 Kakao 账号', desc: '需完成邮箱/手机验证。' },
        { icon: ICONS.globe, title: '确定服务域名', desc: '网页服务请先确定域名。' },
        { icon: ICONS.shield, title: '隐私政策 URL', desc: 'Kakao 登录审核必填。' },
        { icon: ICONS.file, title: '企业账号(可选)', desc: '如需 AlimTalk/Biz Message。' },
      ],
      steps: [
        { no: '01', title: 'Kakao 账号 + 开发者注册', tag: 'SIGNUP', icon: ICONS.user, desc: '登录 Kakao Developers 并注册为开发者。', details: [
          '访问 developers.kakao.com → 右上角登录',
          '首次登录需同意开发者使用条款',
          '必须完成邮箱/手机验证',
        ] },
        { no: '02', title: '创建我的应用', tag: 'CREATE APP', icon: ICONS.settings, desc: '填写应用基本信息。', details: [
          '我的应用 > 添加应用',
          '应用图标(至少 128×128,建议 PNG)',
          '应用名称(显示在 KakaoTalk 分享与登录界面)',
          '企业名称 / 分类',
        ] },
        { no: '03', title: '查看应用密钥并做好保护', tag: 'KEYS', icon: ICONS.key, desc: '系统自动发放 4 种应用密钥。', details: [
          'Native 应用密钥:iOS/Android 原生 SDK 使用',
          'JavaScript 密钥:Web JS SDK 使用(必须限制域名)',
          'REST API 密钥:服务端 REST 调用使用',
          'Admin 密钥:用户管理 API · 严禁暴露到客户端',
          '密钥泄露后可在应用设置中重新发放',
        ] },
        { no: '04', title: '注册平台', tag: 'PLATFORM', icon: ICONS.globe, desc: '注册应用运行平台信息。', details: [
          'Android:包名 + 密钥哈希(keystore SHA1 → Base64)',
          'iOS:Bundle ID',
          'Web:站点域名(可注册多个,含 http://localhost)',
          '未注册的平台 SDK 调用会失败',
        ] },
        { no: '05', title: '启用 Kakao 登录', tag: 'AUTH', icon: ICONS.shield, desc: '使用 Kakao 登录时需启用并注册 Redirect URI。', details: [
          '产品设置 > Kakao 登录 > 启用',
          '启用 OpenID Connect(需要 JWT 令牌时)',
          '注册 Redirect URI(仅网页需要,原生依赖应用密钥)',
          '设置同意项(昵称、头像、邮箱、年龄段等)',
          '必需同意需审核,可选同意可立即使用',
        ] },
        { no: '06', title: '同意项审核申请(如需)', tag: 'REVIEW', icon: ICONS.file, desc: '邮箱、生日、性别等部分项需转为 Biz 应用并通过审核后方可使用。', details: [
          '转为 Biz 应用:上传营业执照',
          '必须注册隐私政策 URL',
          '可审核项:邮箱、生日、出生年、性别、联系方式、地址等',
          '审核周期:工作日 1–5 天',
        ] },
        { no: '07', title: 'KakaoTalk 消息 / 分享', tag: 'MESSAGE', icon: ICONS.msg, desc: '消息 API 设置,与 AlimTalk 不同。', details: [
          '产品设置 > KakaoTalk 消息 > 启用',
          '模板构建器创建分享/消息模板',
          '使用模板 ID 通过原生/JS SDK 发送',
          '实际发送消息需要接收方同意(talk_message)权限',
        ] },
        { no: '08', title: 'AlimTalk(可选·单独申请)', tag: 'ALIMTALK', icon: ICONS.msg, desc: 'AlimTalk 不通过 Kakao Developers,需通过 Biz Message 平台(NHN、Aligo 等)发送。', details: [
          'Kakao Business > 先开通 KakaoTalk 频道',
          '完成频道企业认证',
          '与 NHN Cloud、Aligo、Swingpham 等发送代理签约',
          '模板由 Kakao 直接审核(工作日 1–2 天)',
          '按条计费约 8~10 韩元',
        ] },
      ],
      pitfalls: [
        { title: '密钥哈希不一致(Android)', desc: 'debug 与 release keystore 的 SHA1 不同。必须同时注册两个哈希,发布版的 Kakao 登录才能正常。' },
        { title: 'JavaScript 密钥未限制域名', desc: '开放所有域名会被他人盗用。请在平台 > 网页处明确允许的域名。' },
        { title: 'Admin 密钥暴露到客户端', desc: 'Admin 密钥被上传到 GitHub 公共仓库的事故频发。请放到 .env 并确认 gitignore。' },
        { title: '未审核即将邮箱设为必需同意', desc: '未审核将邮箱设为必需会导致登录报错。请先转 Biz 应用并完成审核。' },
        { title: 'AlimTalk 与 FriendTalk 混淆', desc: 'AlimTalk 为信息性(无需同意);FriendTalk 为广告性(仅限频道好友)。按场景选择。' },
      ],
      resources: [
        { title: 'Kakao Developers 控制台', desc: '应用注册·密钥管理', href: 'https://developers.kakao.com' },
        { title: 'Kakao 登录文档', desc: 'REST · 原生 · JS SDK', href: 'https://developers.kakao.com/docs/latest/ko/kakaologin/common' },
        { title: 'Kakao 地图 Web SDK', desc: 'JS 地图 API', href: 'https://apis.map.kakao.com/web/' },
        { title: '同意项审核指南', desc: 'Biz 应用转换方法', href: 'https://developers.kakao.com/docs/latest/ko/app-register/how-to#consent-item' },
        { title: 'Kakao Business', desc: '频道·AlimTalk 申请', href: 'https://business.kakao.com' },
        { title: 'Android 密钥哈希生成', desc: 'keystore → 密钥哈希', href: 'https://developers.kakao.com/docs/latest/ko/android/getting-started#add-sdk' },
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
      badge={{ icon: <MessageCircle className="h-3.5 w-3.5 text-white/80" />, text: d.badge.text }}
    />
  )
}
