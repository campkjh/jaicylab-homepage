'use client'

import { GuideTemplate } from '@/components/GuideTemplate'
import { MessageCircle, User, Shield, FileText, Key, ExternalLink, Settings, Globe } from 'lucide-react'

export default function KakaoDevelopersGuidePage() {
  return (
    <GuideTemplate
      badge={{ icon: <MessageCircle className="h-3.5 w-3.5 text-white/80" />, text: 'KAKAO DEVELOPERS' }}
      titleTop="Kakao Developers"
      titleBottom="앱 등록 & 키 발급"
      description={`카카오 로그인·지도·알림톡·공유하기 등 카카오 API를 사용하려면 Kakao Developers에 앱을 등록해야 합니다.\n앱 생성부터 키 발급, 플랫폼 설정까지 순서대로 안내합니다.`}
      primaryCta={{ label: 'Kakao Developers 열기', href: 'https://developers.kakao.com' }}
      stats={[
        { label: '가입비', value: '무료' },
        { label: '심사 기간', value: '즉시' },
        { label: '필요 정보', value: '카카오 계정' },
      ]}
      overviewTitle="시작 전에 확인하세요"
      overviewDesc="Kakao Developers는 무료로 가입 가능하지만, 일부 기능(카카오 로그인 동의 항목·알림톡·비즈메시지)은 추가 신청·심사가 필요합니다. 앱 키는 절대 클라이언트에 노출하지 마세요 — Admin 키는 서버 전용입니다."
      overviewItems={[
        { icon: <User className="h-5 w-5" />, title: '카카오 계정 준비', desc: '이메일/휴대폰 인증된 계정 필요.' },
        { icon: <Globe className="h-5 w-5" />, title: '서비스 도메인 결정', desc: '웹 서비스면 도메인 미리 확정.' },
        { icon: <Shield className="h-5 w-5" />, title: '개인정보 처리방침 URL', desc: '카카오 로그인 심사에 필수.' },
        { icon: <FileText className="h-5 w-5" />, title: '비즈니스 계정 (선택)', desc: '알림톡·비즈메시지 필요 시.' },
      ]}
      steps={[
        { no: '01', title: '카카오 계정 + 개발자 등록', tag: 'SIGNUP', icon: <User className="h-5 w-5" />, desc: 'Kakao Developers에 로그인하고 개발자로 등록합니다.', details: [
          'developers.kakao.com 접속 → 우측 상단 로그인',
          '최초 로그인 시 개발자 이용약관 동의',
          '이메일/휴대폰 인증 완료 필수',
        ] },
        { no: '02', title: '내 애플리케이션 생성', tag: 'CREATE APP', icon: <Settings className="h-5 w-5" />, desc: '앱 기본 정보를 입력합니다.', details: [
          '내 애플리케이션 > 애플리케이션 추가하기',
          '앱 아이콘 (최소 128×128, PNG 권장)',
          '앱 이름 (카카오톡 공유·로그인 화면에 노출)',
          '사업자명 / 카테고리 선택',
        ] },
        { no: '03', title: '앱 키 확인 & 보안 관리', tag: 'KEYS', icon: <Key className="h-5 w-5" />, desc: '4종 앱 키가 자동 발급됩니다.', details: [
          '네이티브 앱 키: iOS/Android 네이티브 SDK에서 사용',
          'JavaScript 키: 웹 JS SDK에서 사용 (도메인 제한 필수)',
          'REST API 키: 서버에서 REST 호출 시 사용',
          'Admin 키: 사용자 관리 API · 절대 클라이언트 노출 금지',
          '키가 노출되면 앱 설정에서 재발급 가능',
        ] },
        { no: '04', title: '플랫폼 등록', tag: 'PLATFORM', icon: <Globe className="h-5 w-5" />, desc: '앱이 구동될 플랫폼 정보를 등록합니다.', details: [
          'Android: 패키지명 + 키 해시 등록 (keystore SHA1 → Base64)',
          'iOS: 번들 ID 등록',
          '웹: 사이트 도메인 (http://localhost 포함 여러 개 가능)',
          'SDK에서 플랫폼 미등록이면 호출 실패',
        ] },
        { no: '05', title: '카카오 로그인 활성화', tag: 'AUTH', icon: <Shield className="h-5 w-5" />, desc: '카카오 로그인을 사용할 경우 활성화 + Redirect URI 등록.', details: [
          '제품 설정 > 카카오 로그인 > 활성화 ON',
          'OpenID Connect 활성화 (JWT 토큰 필요 시)',
          'Redirect URI 등록 (웹만 필요, 네이티브는 앱 키 기반)',
          '동의 항목 설정 (닉네임·프로필·이메일·연령대 등)',
          '필수 동의는 심사 필요 · 선택 동의는 즉시 사용 가능',
        ] },
        { no: '06', title: '동의 항목 심사 요청 (필요 시)', tag: 'REVIEW', icon: <FileText className="h-5 w-5" />, desc: '이메일·생일·성별 등 일부 항목은 비즈 앱으로 전환 후 심사를 받아야 합니다.', details: [
          '비즈 앱 전환: 사업자등록증 업로드',
          '개인정보 처리방침 URL 등록 필수',
          '심사 항목: 이메일·생일·출생연도·성별·연락처·주소 등',
          '심사 기간: 영업일 기준 1–5일',
        ] },
        { no: '07', title: '카카오톡 메시지 / 공유하기', tag: 'MESSAGE', icon: <MessageCircle className="h-5 w-5" />, desc: '메시지 API 설정. 알림톡과는 별도.', details: [
          '제품 설정 > 카카오톡 메시지 > 활성화',
          '템플릿 빌더에서 공유·메시지 템플릿 제작',
          '템플릿 ID로 네이티브/JS SDK에서 전송',
          '실제 메시지 전송은 수신자 동의(talk_message) 스코프 필요',
        ] },
        { no: '08', title: '알림톡 (선택·별도 신청)', tag: 'ALIMTALK', icon: <MessageCircle className="h-5 w-5" />, desc: '알림톡은 Kakao Developers가 아닌 비즈메시지 플랫폼(NHN·Aligo 등)을 통해 발송.', details: [
          'Kakao Business > 카카오톡 채널 개설 먼저',
          '채널 비즈 인증 완료',
          'NHN Cloud · Aligo · 스윙팜 등 발송대행사 계약',
          '템플릿은 카카오 직접 심사 (영업일 기준 1–2일)',
          '건당 8~10원 과금',
        ] },
      ]}
      pitfalls={[
        { title: '키 해시 불일치 (Android)', desc: 'debug keystore와 release keystore SHA1이 다릅니다. 두 해시 모두 등록해야 배포 앱에서도 카카오 로그인이 동작합니다.' },
        { title: 'JavaScript 키 도메인 제한 미설정', desc: '모든 도메인 허용 상태로 두면 타인이 키를 도용할 수 있어요. 플랫폼 > 웹에서 허용 도메인 명시.' },
        { title: 'Admin 키 클라이언트 노출', desc: 'GitHub Public 저장소에 Admin 키가 올라가는 사고가 빈번합니다. .env로 분리하고 gitignore 확인.' },
        { title: '이메일 필수 동의 항목 사용', desc: '심사 없이 이메일을 필수 동의로 설정하면 로그인 시 오류. 비즈 앱 전환 + 심사 완료 후 사용하세요.' },
        { title: '알림톡과 친구톡 혼동', desc: '알림톡은 정보성(동의 불필요)·친구톡은 광고성(채널 친구만). 용도에 맞게 선택.' },
      ]}
      resources={[
        { title: 'Kakao Developers 콘솔', desc: '앱 등록·키 관리', href: 'https://developers.kakao.com' },
        { title: '카카오 로그인 문서', desc: 'REST · 네이티브 · JS SDK', href: 'https://developers.kakao.com/docs/latest/ko/kakaologin/common' },
        { title: '카카오맵 Web SDK', desc: 'JS 지도 API', href: 'https://apis.map.kakao.com/web/' },
        { title: '동의 항목 심사 가이드', desc: '비즈 앱 전환 방법', href: 'https://developers.kakao.com/docs/latest/ko/app-register/how-to#consent-item' },
        { title: '카카오 비즈니스', desc: '채널·알림톡 신청', href: 'https://business.kakao.com' },
        { title: 'Android 키 해시 생성', desc: 'keystore → 키 해시', href: 'https://developers.kakao.com/docs/latest/ko/android/getting-started#add-sdk' },
      ]}
    />
  )
}
