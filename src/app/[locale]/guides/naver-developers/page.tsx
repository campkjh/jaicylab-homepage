'use client'

import { useLocale } from 'next-intl'
import { GuideTemplate, type GuideProps } from '@/components/GuideTemplate'
import { Globe, User, Shield, FileText, Key, Settings, MapPin, Search } from 'lucide-react'

type Locale = 'ko' | 'en' | 'ja' | 'zh'

const ICONS = {
  user: <User className="h-5 w-5" />,
  settings: <Settings className="h-5 w-5" />,
  key: <Key className="h-5 w-5" />,
  globe: <Globe className="h-5 w-5" />,
  shield: <Shield className="h-5 w-5" />,
  file: <FileText className="h-5 w-5" />,
  map: <MapPin className="h-5 w-5" />,
  search: <Search className="h-5 w-5" />,
}

type Data = Omit<GuideProps, 'badge'> & { badge: { text: string } }

function getData(): Record<Locale, Data> {
  return {
    ko: {
      badge: { text: 'NAVER DEVELOPERS' },
      titleTop: 'Naver Developers',
      titleBottom: '애플리케이션 등록',
      description: `네이버 로그인·검색·Papago·지도·지역검색 등 네이버 오픈 API를 사용하려면 Naver Developers에 앱을 등록해야 합니다.\n앱 등록부터 키 발급, 멤버 관리까지 안내합니다.`,
      primaryCta: { label: 'Naver Developers 열기', href: 'https://developers.naver.com' },
      stats: [
        { label: '가입비', value: '무료' },
        { label: '심사 기간', value: '즉시 (일부 API 심사)' },
        { label: '필요 정보', value: '네이버 계정' },
      ],
      overviewTitle: '시작 전에 확인하세요',
      overviewDesc: 'Naver Developers는 무료로 앱 등록이 가능하며, 대부분의 API는 즉시 사용 가능합니다. 네이버 지도(NAVER Maps)는 Naver Cloud Platform으로 이전되어 별도 가입이 필요합니다 — 여기 가이드와 혼동하지 마세요.',
      overviewItems: [
        { icon: ICONS.user, title: '네이버 계정 준비', desc: '실명 인증 완료 계정 권장.' },
        { icon: ICONS.globe, title: '서비스 URL 결정', desc: '웹 서비스 도메인 미리 확정.' },
        { icon: ICONS.shield, title: '개인정보 처리방침', desc: '네이버 로그인 검수에 필수.' },
        { icon: ICONS.file, title: 'API별 차이 인지', desc: '지도 API는 NCP 별도 가입.' },
      ],
      steps: [
        { no: '01', title: '네이버 계정 + 개발자 등록', tag: 'SIGNUP', icon: ICONS.user, desc: 'developers.naver.com에 네이버 계정으로 로그인합니다.', details: [
          '실명인증이 완료된 계정으로 접속',
          '최초 로그인 시 개발자 이용약관 동의',
          '개발자 센터가 활성화됨',
        ] },
        { no: '02', title: '애플리케이션 등록', tag: 'CREATE APP', icon: ICONS.settings, desc: '내 애플리케이션 > 애플리케이션 등록.', details: [
          '애플리케이션 이름 입력',
          '사용 API 체크박스로 선택 (검색/네이버 로그인/Papago/캘린더 등)',
          '비로그인 오픈 API 서비스 환경 등록',
          '환경: WEB / Android / iOS 중 해당 플랫폼 선택',
        ] },
        { no: '03', title: 'Client ID / Secret 확인', tag: 'KEYS', icon: ICONS.key, desc: '등록 완료 시 앱 키 자동 발급.', details: [
          'Client ID: 공개 가능 (프론트에서 사용 가능)',
          'Client Secret: 서버 전용 · 절대 노출 금지',
          '애플리케이션 정보에서 확인 및 재발급 가능',
          '.env 파일로 분리 관리',
        ] },
        { no: '04', title: '플랫폼 / Callback URL 등록', tag: 'PLATFORM', icon: ICONS.globe, desc: '선택한 플랫폼별 정보 등록.', details: [
          'WEB: 서비스 URL + Callback URL 등록 (네이버 로그인 시)',
          'Android: 패키지명 + 다운로드 URL',
          'iOS: Bundle ID + App Store URL',
          'Callback URL 미일치 시 401 오류',
        ] },
        { no: '05', title: '네이버 로그인 사용 권한 설정', tag: 'AUTH', icon: ICONS.shield, desc: '네이버 로그인을 쓰는 경우 필수 항목 설정.', details: [
          '필수/선택 제공 정보 지정 (이름·이메일·별명·프로필 사진 등)',
          '연락처·생일·성별 등은 검수 요청 필요',
          '검수 요청 시 이용 목적 및 개인정보 처리방침 URL 제출',
          '검수 기간: 영업일 기준 1–3일',
        ] },
        { no: '06', title: '검색 · Papago · Clova API 호출', tag: 'API', icon: ICONS.search, desc: '일반 오픈 API는 Client ID/Secret 헤더만으로 즉시 호출 가능.', details: [
          '요청 헤더: X-Naver-Client-Id, X-Naver-Client-Secret',
          '검색 API (블로그·카페·뉴스·이미지 등) 일 25,000건 무료',
          'Papago 번역: 월 10,000자 무료, 초과 시 유료',
          '개발 시 rate limit 주의 (초당 10회 권장)',
        ] },
        { no: '07', title: '네이버 지도 (NCP 별도 가입)', tag: 'MAP', icon: ICONS.map, desc: '지도 API는 Naver Cloud Platform으로 이관되었습니다.', details: [
          'https://console.ncloud.com 별도 가입 필요',
          'AI·NAVER API 상품 > Maps > 이용 신청',
          'Geocoding / Reverse Geocoding / Directions / Static Maps',
          'Client ID 발급 후 Web Dynamic Map JS SDK에서 사용',
          '무료 한도: 월 100만 호출 (상품별 상이)',
        ] },
        { no: '08', title: '팀 멤버 초대 & 사용량 모니터링', tag: 'MANAGE', icon: ICONS.settings, desc: '앱 설정에서 팀 관리 및 모니터링.', details: [
          '애플리케이션 정보 > 멤버 관리 > 초대',
          '멤버는 해당 네이버 계정으로 로그인하면 앱 조회 가능',
          '일일 API 호출량 그래프 확인',
          '한도 초과 시 API 호출 실패 — 여유있게 설정',
        ] },
      ],
      pitfalls: [
        { title: '네이버 지도 ≠ Naver Developers', desc: '지도는 Naver Cloud Platform(console.ncloud.com)에서 가입해야 합니다. 같은 Naver Developers에서 지도를 찾으면 안 나옵니다.' },
        { title: 'Client Secret 프론트 노출', desc: '예제 코드에 Client Secret을 그대로 넣어 배포하는 실수가 많습니다. 반드시 서버에서 호출하거나 프록시 사용.' },
        { title: '검수 필요 항목을 필수로 설정', desc: '연락처·주소·생일 등은 검수 완료 전에는 응답에 포함되지 않습니다. 필수 체크 전에 검수 요청부터.' },
        { title: 'Callback URL 불일치', desc: '등록된 URL과 실제 리다이렉트 URL이 정확히 일치해야 합니다. 프로토콜(http/https)·trailing slash도 구분.' },
        { title: 'API 일일 한도 초과', desc: '무료 한도 초과 시 호출이 차단됩니다. Papago·검색은 유료 전환 신청 필요.' },
      ],
      resources: [
        { title: 'Naver Developers 콘솔', desc: '앱 등록·키 관리', href: 'https://developers.naver.com' },
        { title: '네이버 로그인 문서', desc: 'OAuth 2.0 가이드', href: 'https://developers.naver.com/docs/login/api/api.md' },
        { title: '검색 API 문서', desc: '블로그·뉴스·카페 검색', href: 'https://developers.naver.com/docs/serviceapi/search/blog/blog.md' },
        { title: 'Papago 번역 API', desc: '번역 API 가이드', href: 'https://developers.naver.com/docs/papago/papago-nmt-overview.md' },
        { title: 'NCP 콘솔 (지도)', desc: 'Naver Cloud Platform 지도 API', href: 'https://console.ncloud.com' },
        { title: 'NAVER Maps API', desc: '지도 Web Dynamic Map', href: 'https://navermaps.github.io/maps.js.ncp/' },
      ],
    },
    en: {
      badge: { text: 'NAVER DEVELOPERS' },
      titleTop: 'Naver Developers',
      titleBottom: 'Application Registration',
      description: `To use Naver open APIs such as Naver Login, Search, Papago, Maps, and Local Search, you must register an app on Naver Developers.\nWe walk through app registration, key issuance, and team management.`,
      primaryCta: { label: 'Open Naver Developers', href: 'https://developers.naver.com' },
      stats: [
        { label: 'Signup fee', value: 'Free' },
        { label: 'Review', value: 'Instant (some APIs reviewed)' },
        { label: 'Needed', value: 'Naver account' },
      ],
      overviewTitle: 'Check before you start',
      overviewDesc: 'Naver Developers lets you register apps for free, and most APIs are usable immediately. NAVER Maps has moved to Naver Cloud Platform and needs a separate signup — do not confuse it with this guide.',
      overviewItems: [
        { icon: ICONS.user, title: 'Prepare a Naver account', desc: 'Name-verified account recommended.' },
        { icon: ICONS.globe, title: 'Decide the service URL', desc: 'Lock down the web domain first.' },
        { icon: ICONS.shield, title: 'Privacy policy', desc: 'Required for Naver Login review.' },
        { icon: ICONS.file, title: 'Know per-API differences', desc: 'Maps API requires NCP signup.' },
      ],
      steps: [
        { no: '01', title: 'Naver account + developer registration', tag: 'SIGNUP', icon: ICONS.user, desc: 'Sign in to developers.naver.com with your Naver account.', details: [
          'Use a real-name verified account',
          'Accept the developer terms on first login',
          'The developer center is then activated',
        ] },
        { no: '02', title: 'Register an application', tag: 'CREATE APP', icon: ICONS.settings, desc: 'My Applications > Register application.', details: [
          'Enter the application name',
          'Pick APIs via checkboxes (Search / Naver Login / Papago / Calendar, etc.)',
          'Register the non-login open API service environment',
          'Environment: WEB / Android / iOS — choose your platform',
        ] },
        { no: '03', title: 'Check Client ID / Secret', tag: 'KEYS', icon: ICONS.key, desc: 'App keys are issued on registration.', details: [
          'Client ID: safe to expose (usable on the frontend)',
          'Client Secret: server-only — never expose',
          'Viewable and regeneratable from application info',
          'Keep them in a .env file',
        ] },
        { no: '04', title: 'Register platforms and Callback URL', tag: 'PLATFORM', icon: ICONS.globe, desc: 'Register info for each platform you selected.', details: [
          'WEB: service URL + Callback URL (for Naver Login)',
          'Android: package name + download URL',
          'iOS: Bundle ID + App Store URL',
          'Callback URL mismatch returns 401',
        ] },
        { no: '05', title: 'Configure Naver Login permissions', tag: 'AUTH', icon: ICONS.shield, desc: 'If using Naver Login, configure required items.', details: [
          'Choose required/optional fields (name, email, nickname, profile picture, etc.)',
          'Phone, birthday, and gender need a review request',
          'During review, submit the use purpose and privacy policy URL',
          'Review takes 1–3 business days',
        ] },
        { no: '06', title: 'Call Search / Papago / Clova APIs', tag: 'API', icon: ICONS.search, desc: 'General open APIs work immediately with just Client ID/Secret headers.', details: [
          'Headers: X-Naver-Client-Id, X-Naver-Client-Secret',
          'Search API (blog, cafe, news, images, etc.): 25,000/day free',
          'Papago translate: 10,000 chars/month free, paid beyond',
          'Mind the rate limit during development (~10 req/s)',
        ] },
        { no: '07', title: 'NAVER Maps (separate NCP signup)', tag: 'MAP', icon: ICONS.map, desc: 'The Maps API has moved to Naver Cloud Platform.', details: [
          'Sign up separately at https://console.ncloud.com',
          'AI·NAVER API products > Maps > apply',
          'Geocoding / Reverse Geocoding / Directions / Static Maps',
          'Use the Client ID with the Web Dynamic Map JS SDK',
          'Free tier: ~1M calls/month (varies by product)',
        ] },
        { no: '08', title: 'Invite team and monitor usage', tag: 'MANAGE', icon: ICONS.settings, desc: 'Manage the team and monitoring from app settings.', details: [
          'Application info > Member management > Invite',
          'Members can view the app once they log in with their Naver account',
          'Check the daily API call graph',
          'Calls fail once you exceed the limit — set it with headroom',
        ] },
      ],
      pitfalls: [
        { title: 'NAVER Maps is not Naver Developers', desc: 'Maps lives on Naver Cloud Platform (console.ncloud.com). You will not find it on Naver Developers.' },
        { title: 'Client Secret exposed on the frontend', desc: 'It is common to ship sample code with Client Secret baked in. Always call from the server or use a proxy.' },
        { title: 'Marking review-required fields as required', desc: 'Phone, address, and birthday are excluded from responses until review is complete. Request review before marking them required.' },
        { title: 'Callback URL mismatch', desc: 'The registered URL must match the actual redirect URL exactly, including protocol (http/https) and trailing slash.' },
        { title: 'Exceeding the daily API quota', desc: 'Calls are blocked beyond the free tier. Papago and Search need a paid tier upgrade.' },
      ],
      resources: [
        { title: 'Naver Developers console', desc: 'App registration and keys', href: 'https://developers.naver.com' },
        { title: 'Naver Login docs', desc: 'OAuth 2.0 guide', href: 'https://developers.naver.com/docs/login/api/api.md' },
        { title: 'Search API docs', desc: 'Blog, news, cafe search', href: 'https://developers.naver.com/docs/serviceapi/search/blog/blog.md' },
        { title: 'Papago Translate API', desc: 'Translate API guide', href: 'https://developers.naver.com/docs/papago/papago-nmt-overview.md' },
        { title: 'NCP console (Maps)', desc: 'Naver Cloud Platform Maps API', href: 'https://console.ncloud.com' },
        { title: 'NAVER Maps API', desc: 'Web Dynamic Map', href: 'https://navermaps.github.io/maps.js.ncp/' },
      ],
    },
    ja: {
      badge: { text: 'NAVER DEVELOPERS' },
      titleTop: 'Naver Developers',
      titleBottom: 'アプリケーション登録',
      description: `Naverログイン・検索・Papago・マップ・地域検索等のNaverオープンAPIを利用するには、Naver Developersにアプリを登録する必要があります。\nアプリ登録からキー発行、メンバー管理までご案内します。`,
      primaryCta: { label: 'Naver Developersを開く', href: 'https://developers.naver.com' },
      stats: [
        { label: '登録料', value: '無料' },
        { label: '審査', value: '即時(一部API審査)' },
        { label: '必要', value: 'Naverアカウント' },
      ],
      overviewTitle: '開始前にご確認ください',
      overviewDesc: 'Naver Developersは無料でアプリ登録でき、ほとんどのAPIは即時利用可能です。NAVER Mapsは Naver Cloud Platformに移行済みで別途登録が必要です — 本ガイドと混同しないでください。',
      overviewItems: [
        { icon: ICONS.user, title: 'Naverアカウント準備', desc: '実名認証済みアカウント推奨。' },
        { icon: ICONS.globe, title: 'サービスURL決定', desc: 'Webサービスのドメインを先に確定。' },
        { icon: ICONS.shield, title: 'プライバシーポリシー', desc: 'Naverログイン審査に必須。' },
        { icon: ICONS.file, title: 'APIごとの差異を把握', desc: 'マップAPIはNCPで別途登録。' },
      ],
      steps: [
        { no: '01', title: 'Naverアカウント + 開発者登録', tag: 'SIGNUP', icon: ICONS.user, desc: 'developers.naver.comにNaverアカウントでログイン。', details: [
          '実名認証済みアカウントでアクセス',
          '初回ログイン時に開発者利用規約に同意',
          '開発者センターが有効化される',
        ] },
        { no: '02', title: 'アプリケーション登録', tag: 'CREATE APP', icon: ICONS.settings, desc: 'マイアプリケーション > アプリケーション登録。', details: [
          'アプリケーション名を入力',
          '使用APIをチェックボックスで選択(検索/Naverログイン/Papago/カレンダー等)',
          '非ログインオープンAPIサービス環境を登録',
          '環境: WEB / Android / iOS から該当プラットフォームを選択',
        ] },
        { no: '03', title: 'Client ID / Secret確認', tag: 'KEYS', icon: ICONS.key, desc: '登録完了時にアプリキーが自動発行されます。', details: [
          'Client ID: 公開可能(フロントで利用可)',
          'Client Secret: サーバー専用・絶対に露出禁止',
          'アプリケーション情報から確認・再発行可',
          '.envファイルで分離管理',
        ] },
        { no: '04', title: 'プラットフォーム / Callback URL登録', tag: 'PLATFORM', icon: ICONS.globe, desc: '選択したプラットフォーム別の情報を登録。', details: [
          'WEB: サービスURL + Callback URL登録(Naverログイン時)',
          'Android: パッケージ名 + ダウンロードURL',
          'iOS: Bundle ID + App Store URL',
          'Callback URL不一致は401エラー',
        ] },
        { no: '05', title: 'Naverログイン権限設定', tag: 'AUTH', icon: ICONS.shield, desc: 'Naverログイン利用時は必須項目を設定。', details: [
          '必須/任意の提供情報を指定(名前・メール・ニックネーム・プロフィール画像等)',
          '連絡先・誕生日・性別等は審査申請が必要',
          '審査時に利用目的とプライバシーポリシーURLを提出',
          '審査期間: 営業日1–3日',
        ] },
        { no: '06', title: '検索 · Papago · Clova API呼び出し', tag: 'API', icon: ICONS.search, desc: '一般オープンAPIはClient ID/Secretヘッダだけで即時呼び出し可能。', details: [
          'リクエストヘッダ: X-Naver-Client-Id, X-Naver-Client-Secret',
          '検索API(ブログ・カフェ・ニュース・画像等)1日25,000件まで無料',
          'Papago翻訳: 月10,000文字無料、超過は有料',
          '開発時はrate limit注意(毎秒10回推奨)',
        ] },
        { no: '07', title: 'NAVERマップ(NCPに別途登録)', tag: 'MAP', icon: ICONS.map, desc: 'マップAPIはNaver Cloud Platformに移行済みです。', details: [
          'https://console.ncloud.com に別途登録が必要',
          'AI·NAVER API商品 > Maps > 利用申請',
          'Geocoding / Reverse Geocoding / Directions / Static Maps',
          'Client ID発行後Web Dynamic Map JS SDKで使用',
          '無料枠: 月100万呼び出し(商品別に異なる)',
        ] },
        { no: '08', title: 'チームメンバー招待と使用量モニタリング', tag: 'MANAGE', icon: ICONS.settings, desc: 'アプリ設定でチーム管理とモニタリング。', details: [
          'アプリケーション情報 > メンバー管理 > 招待',
          'メンバーは該当Naverアカウントでログインするとアプリ閲覧可能',
          '日次API呼び出しグラフを確認',
          '超過すると呼び出しが失敗 — 余裕を持って設定',
        ] },
      ],
      pitfalls: [
        { title: 'NAVERマップ ≠ Naver Developers', desc: 'マップはNaver Cloud Platform(console.ncloud.com)で登録する必要があります。Naver Developersでは見つかりません。' },
        { title: 'Client Secretのフロント露出', desc: 'サンプルコードにClient Secretをそのまま埋め込んで配布する誤りが多いです。必ずサーバーから呼び出すかプロキシを使用。' },
        { title: '審査必要項目を必須に設定', desc: '連絡先・住所・誕生日等は審査完了までレスポンスに含まれません。必須チェック前に審査を依頼。' },
        { title: 'Callback URL不一致', desc: '登録URLと実際のリダイレクトURLが正確に一致する必要。プロトコル(http/https)・末尾スラッシュも区別されます。' },
        { title: 'API日次上限超過', desc: '無料枠超過で呼び出しがブロックされます。Papago・検索は有料プラン申請が必要。' },
      ],
      resources: [
        { title: 'Naver Developersコンソール', desc: 'アプリ登録・キー管理', href: 'https://developers.naver.com' },
        { title: 'Naverログインドキュメント', desc: 'OAuth 2.0ガイド', href: 'https://developers.naver.com/docs/login/api/api.md' },
        { title: '検索APIドキュメント', desc: 'ブログ・ニュース・カフェ検索', href: 'https://developers.naver.com/docs/serviceapi/search/blog/blog.md' },
        { title: 'Papago翻訳API', desc: '翻訳APIガイド', href: 'https://developers.naver.com/docs/papago/papago-nmt-overview.md' },
        { title: 'NCPコンソール(マップ)', desc: 'Naver Cloud Platformマップ', href: 'https://console.ncloud.com' },
        { title: 'NAVER Maps API', desc: 'Web Dynamic Map', href: 'https://navermaps.github.io/maps.js.ncp/' },
      ],
    },
    zh: {
      badge: { text: 'NAVER DEVELOPERS' },
      titleTop: 'Naver Developers',
      titleBottom: '应用注册',
      description: `要使用 Naver 登录、搜索、Papago、地图、本地搜索等 Naver 开放 API,需要在 Naver Developers 注册应用。\n从应用注册、密钥发放到成员管理为您指导。`,
      primaryCta: { label: '打开 Naver Developers', href: 'https://developers.naver.com' },
      stats: [
        { label: '注册费', value: '免费' },
        { label: '审核', value: '即时(部分 API 需审核)' },
        { label: '所需', value: 'Naver 账号' },
      ],
      overviewTitle: '开始前请先确认',
      overviewDesc: 'Naver Developers 免费注册应用,大多数 API 可立即使用。NAVER Maps 已迁移至 Naver Cloud Platform,需要单独注册 — 请不要与本指南混淆。',
      overviewItems: [
        { icon: ICONS.user, title: '准备 Naver 账号', desc: '建议使用实名认证账号。' },
        { icon: ICONS.globe, title: '确定服务 URL', desc: '先确定网页服务域名。' },
        { icon: ICONS.shield, title: '隐私政策', desc: 'Naver 登录审核必备。' },
        { icon: ICONS.file, title: '了解各 API 差异', desc: '地图 API 需 NCP 单独注册。' },
      ],
      steps: [
        { no: '01', title: 'Naver 账号 + 开发者注册', tag: 'SIGNUP', icon: ICONS.user, desc: '在 developers.naver.com 用 Naver 账号登录。', details: [
          '使用已实名认证的账号登录',
          '首次登录需同意开发者使用条款',
          '开发者中心随即启用',
        ] },
        { no: '02', title: '注册应用', tag: 'CREATE APP', icon: ICONS.settings, desc: '我的应用 > 注册应用。', details: [
          '填写应用名称',
          '勾选所用 API(搜索/Naver 登录/Papago/日历 等)',
          '注册非登录开放 API 服务环境',
          '环境:WEB / Android / iOS 选择对应平台',
        ] },
        { no: '03', title: '查看 Client ID / Secret', tag: 'KEYS', icon: ICONS.key, desc: '注册完成后自动发放应用密钥。', details: [
          'Client ID:可公开(可在前端使用)',
          'Client Secret:仅限服务端 · 严禁暴露',
          '可在应用信息中查看或重新发放',
          '建议放入 .env 文件管理',
        ] },
        { no: '04', title: '注册平台 / Callback URL', tag: 'PLATFORM', icon: ICONS.globe, desc: '按所选平台分别填写信息。', details: [
          'WEB:服务 URL + Callback URL(Naver 登录时)',
          'Android:包名 + 下载 URL',
          'iOS:Bundle ID + App Store URL',
          'Callback URL 不匹配将返回 401',
        ] },
        { no: '05', title: '配置 Naver 登录权限', tag: 'AUTH', icon: ICONS.shield, desc: '使用 Naver 登录时设置必要项。', details: [
          '指定必填/可选提供信息(姓名、邮箱、昵称、头像等)',
          '联系方式、生日、性别等需要提交审核',
          '审核时需提交使用目的与隐私政策 URL',
          '审核周期:工作日 1–3 天',
        ] },
        { no: '06', title: '调用 搜索 · Papago · Clova API', tag: 'API', icon: ICONS.search, desc: '普通开放 API 仅需 Client ID/Secret 头部即可立即调用。', details: [
          '请求头:X-Naver-Client-Id、X-Naver-Client-Secret',
          '搜索 API(博客·咖啡·新闻·图片等)日免费 25,000 次',
          'Papago 翻译:每月 10,000 字符免费,超出需付费',
          '开发时注意 rate limit(建议每秒 10 次)',
        ] },
        { no: '07', title: 'NAVER 地图(NCP 单独注册)', tag: 'MAP', icon: ICONS.map, desc: '地图 API 已迁移到 Naver Cloud Platform。', details: [
          '需在 https://console.ncloud.com 单独注册',
          'AI·NAVER API 产品 > Maps > 申请使用',
          'Geocoding / Reverse Geocoding / Directions / Static Maps',
          '发放 Client ID 后在 Web Dynamic Map JS SDK 使用',
          '免费额度:每月 100 万次(产品各异)',
        ] },
        { no: '08', title: '邀请成员与用量监控', tag: 'MANAGE', icon: ICONS.settings, desc: '在应用设置中管理团队与监控。', details: [
          '应用信息 > 成员管理 > 邀请',
          '成员用对应 Naver 账号登录后可访问应用',
          '查看每日 API 调用量图表',
          '超额会导致调用失败 — 请预留余量',
        ] },
      ],
      pitfalls: [
        { title: 'NAVER 地图 ≠ Naver Developers', desc: '地图需要在 Naver Cloud Platform(console.ncloud.com)注册。在 Naver Developers 找不到地图入口。' },
        { title: 'Client Secret 暴露在前端', desc: '把 Client Secret 直接写入示例代码并发布的错误很常见。请务必通过服务端或代理调用。' },
        { title: '将需审核字段设为必填', desc: '联系方式、地址、生日等在审核完成前不会出现在响应中。勾选必填前请先申请审核。' },
        { title: 'Callback URL 不一致', desc: '注册 URL 与实际重定向 URL 必须完全一致,协议(http/https)与末尾斜杠也会被区分。' },
        { title: '超出 API 日额度', desc: '超过免费额度后调用会被阻断。Papago、搜索需升级付费套餐。' },
      ],
      resources: [
        { title: 'Naver Developers 控制台', desc: '应用注册·密钥管理', href: 'https://developers.naver.com' },
        { title: 'Naver 登录文档', desc: 'OAuth 2.0 指南', href: 'https://developers.naver.com/docs/login/api/api.md' },
        { title: '搜索 API 文档', desc: '博客·新闻·咖啡搜索', href: 'https://developers.naver.com/docs/serviceapi/search/blog/blog.md' },
        { title: 'Papago 翻译 API', desc: '翻译 API 指南', href: 'https://developers.naver.com/docs/papago/papago-nmt-overview.md' },
        { title: 'NCP 控制台(地图)', desc: 'Naver Cloud Platform 地图', href: 'https://console.ncloud.com' },
        { title: 'NAVER Maps API', desc: 'Web Dynamic Map', href: 'https://navermaps.github.io/maps.js.ncp/' },
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
      badge={{ icon: <Globe className="h-3.5 w-3.5 text-white/80" />, text: d.badge.text }}
    />
  )
}
