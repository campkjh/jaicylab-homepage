'use client'

import { GuideTemplate } from '@/components/GuideTemplate'
import { MessageCircle, User, Settings, Key, Users, Bell, Shield, Zap } from 'lucide-react'

export default function ChannelTalkGuidePage() {
  return (
    <GuideTemplate
      badge={{ icon: <MessageCircle className="h-3.5 w-3.5 text-white/80" />, text: 'CHANNEL TALK' }}
      titleTop="채널톡"
      titleBottom="고객센터 챗 연동"
      description={`국내 대표 고객 상담 채널 "채널톡" 연동 가이드입니다.\n채널 개설, 웹/앱 SDK 설치, 상담 운영, 자동화까지 한번에 정리합니다.`}
      primaryCta={{ label: '채널톡 채널 만들기', href: 'https://channel.io' }}
      stats={[
        { label: '무료 플랜', value: '3인 상담원' },
        { label: '유료 전환', value: 'Pro 약 ₩39,000/상담원' },
        { label: '필요 정보', value: '이메일·휴대폰' },
      ]}
      overviewTitle="시작 전에 확인하세요"
      overviewDesc="채널톡은 라이브 채팅 + 고객 DB + 마케팅 자동화를 한 번에 제공합니다. 단순 문의만 받는다면 무료 플랜으로 충분하고, 상담 이력·통계·API 자동화가 필요하면 Pro 이상을 고려하세요. 유저 식별(member_id) 연동을 해야 상담 이력이 사용자별로 쌓입니다."
      overviewItems={[
        { icon: <User className="h-5 w-5" />, title: '대표 운영자 지정', desc: '이메일 인증 필수.' },
        { icon: <Users className="h-5 w-5" />, title: '상담원 인원 산정', desc: '무료는 3인까지.' },
        { icon: <Shield className="h-5 w-5" />, title: '개인정보 방침 업데이트', desc: '3rd party 명시 필요.' },
        { icon: <Key className="h-5 w-5" />, title: '유저 연동 계획', desc: 'member_id · 프로필 매핑.' },
      ]}
      steps={[
        { no: '01', title: '채널 가입 & 만들기', tag: 'SIGNUP', icon: <User className="h-5 w-5" />, desc: 'channel.io에서 채널을 생성합니다.', details: [
          '이메일·휴대폰 가입 (Google OAuth도 가능)',
          '채널 이름 · 로고 · 업종 선택',
          '무료 Startup 플랜으로 시작',
          '채널 URL 슬러그 결정 (URL에 사용됨)',
        ] },
        { no: '02', title: '상담팀·운영시간 설정', tag: 'TEAM', icon: <Users className="h-5 w-5" />, desc: '상담 라우팅을 위한 기본 세팅.', details: [
          '상담팀 만들기 (CS · 영업 · 기술지원 등)',
          '상담원 초대 (이메일 링크)',
          '각 팀의 운영시간·자동응답 설정',
          '운영시간 외 "자리비움" 메시지 · 티켓 전환',
        ] },
        { no: '03', title: '웹 SDK 설치', tag: 'WEB', icon: <Zap className="h-5 w-5" />, desc: '홈페이지에 채팅 버튼을 띄웁니다.', details: [
          'Channel Settings > Installation',
          '플러그인 키(Plugin Key) 확인',
          '<head>에 ChannelIO() 함수 스크립트 삽입',
          'SPA는 페이지 전환 시 ChannelIO("updateUser") 호출',
          'Next.js: app/layout.tsx에서 Script 컴포넌트로 로드',
        ] },
        { no: '04', title: '유저 식별 (Boot)', tag: 'IDENTIFY', icon: <Key className="h-5 w-5" />, desc: '로그인 사용자를 채널톡에 식별합니다.', details: [
          'ChannelIO("boot", { pluginKey, memberId, profile })',
          'memberId: 내부 고유 ID (이메일 권장)',
          'profile: name · email · mobileNumber · avatarUrl',
          'memberHash: HMAC-SHA256(secret, memberId) 서버 계산',
          'memberHash를 넣으면 타 사용자 사칭 방지',
          '로그아웃 시 ChannelIO("shutdown") 호출',
        ] },
        { no: '05', title: '모바일 앱 SDK (iOS·Android·RN)', tag: 'APP', icon: <Zap className="h-5 w-5" />, desc: '네이티브/크로스플랫폼 앱에 연동.', details: [
          'iOS: CocoaPods(ChannelIOFront) / SPM 설치',
          'Android: Maven Central(io.channel:plugin-android)',
          'React Native: @channel.io/react-native-channel-plugin',
          '앱 실행 시 ChannelIO.boot(...) 호출',
          'Push 알림을 위한 FCM·APNs 토큰 등록',
        ] },
        { no: '06', title: '팀 챗·팝업·마케팅 (선택)', tag: 'FEATURES', icon: <MessageCircle className="h-5 w-5" />, desc: '추가 기능 활성화.', details: [
          '팀 챗(Team Chat): 내부 메신저로도 활용',
          '마케팅 팝업: 특정 페이지 진입 시 유도 메시지',
          'Support Bot: 키워드 기반 자동 응답 (LLM 연결 가능)',
          '이메일 캠페인 · SMS 발송 (Pro 이상)',
        ] },
        { no: '07', title: '웹훅 · API 연동', tag: 'WEBHOOK', icon: <Settings className="h-5 w-5" />, desc: 'CRM·Slack·업무 툴과 연결.', details: [
          'Integration > Webhook에서 엔드포인트 등록',
          '이벤트: new_user_chat, user_chat_assigned, review_submitted 등',
          'X-Channel-Signature 헤더로 서명 검증',
          'Slack·Jira·Zapier는 내장 통합',
          'Open API(REST): 상담 조회·매니저 관리 자동화',
        ] },
        { no: '08', title: '알림·GDPR·모니터링', tag: 'OPS', icon: <Bell className="h-5 w-5" />, desc: '운영 관점 설정.', details: [
          '상담원별 브라우저·이메일·모바일 알림 설정',
          '개인정보 처리방침에 채널톡 명시 (DataWall)',
          '30일 이상 미접속 유저 자동 정리(옵션)',
          '상담 만족도 조사 후 CSAT 확인',
          '월별 통계·리포트 대시보드 활용',
        ] },
      ]}
      pitfalls={[
        { title: 'memberHash 미사용', desc: 'memberHash 없이 memberId만 쓰면 타 사용자로 위장 가능. 서버 HMAC 필수.' },
        { title: 'SPA에서 updateUser 누락', desc: 'Next.js/React에서 라우팅이 바뀌어도 채널톡은 상태를 유지합니다. 로그인/로그아웃 시 boot/shutdown 호출 안 하면 이전 사용자로 남습니다.' },
        { title: '개인정보 처리방침 누락', desc: '채널톡은 개인정보를 처리하는 3rd party입니다. 방침에 명시하지 않으면 감사 이슈.' },
        { title: '푸시 알림 토큰 미등록', desc: '앱에서 FCM/APNs 토큰을 채널톡에 등록하지 않으면 상담원 응답 푸시를 받지 못합니다.' },
        { title: '무료 플랜 상담원 한도', desc: '3인 초과 시 자동 결제가 아닌 기능 제한. 필요 시 즉시 Pro 전환.' },
      ]}
      resources={[
        { title: 'Channel Talk', desc: '채널 개설·가격', href: 'https://channel.io' },
        { title: 'Developers 문서', desc: '설치·API·SDK', href: 'https://developers.channel.io' },
        { title: 'Web SDK 가이드', desc: 'JavaScript 설치', href: 'https://developers.channel.io/docs/web-channelio' },
        { title: 'Mobile SDK', desc: 'iOS·Android·RN', href: 'https://developers.channel.io/docs/mobile-channelio' },
        { title: 'Open API', desc: 'REST · 자동화', href: 'https://developers.channel.io/reference' },
        { title: 'Webhook', desc: '이벤트 수신', href: 'https://developers.channel.io/docs/webhook' },
      ]}
    />
  )
}
