'use client'

import { GuideTemplate } from '@/components/GuideTemplate'
import { Globe, User, Shield, FileText, Key, Settings, MapPin, Search } from 'lucide-react'

export default function NaverDevelopersGuidePage() {
  return (
    <GuideTemplate
      badge={{ icon: <Globe className="h-3.5 w-3.5 text-white/80" />, text: 'NAVER DEVELOPERS' }}
      titleTop="Naver Developers"
      titleBottom="애플리케이션 등록"
      description={`네이버 로그인·검색·Papago·지도·지역검색 등 네이버 오픈 API를 사용하려면 Naver Developers에 앱을 등록해야 합니다.\n앱 등록부터 키 발급, 멤버 관리까지 안내합니다.`}
      primaryCta={{ label: 'Naver Developers 열기', href: 'https://developers.naver.com' }}
      stats={[
        { label: '가입비', value: '무료' },
        { label: '심사 기간', value: '즉시 (일부 API 심사)' },
        { label: '필요 정보', value: '네이버 계정' },
      ]}
      overviewTitle="시작 전에 확인하세요"
      overviewDesc="Naver Developers는 무료로 앱 등록이 가능하며, 대부분의 API는 즉시 사용 가능합니다. 네이버 지도(NAVER Maps)는 Naver Cloud Platform으로 이전되어 별도 가입이 필요합니다 — 여기 가이드와 혼동하지 마세요."
      overviewItems={[
        { icon: <User className="h-5 w-5" />, title: '네이버 계정 준비', desc: '실명 인증 완료 계정 권장.' },
        { icon: <Globe className="h-5 w-5" />, title: '서비스 URL 결정', desc: '웹 서비스 도메인 미리 확정.' },
        { icon: <Shield className="h-5 w-5" />, title: '개인정보 처리방침', desc: '네이버 로그인 검수에 필수.' },
        { icon: <FileText className="h-5 w-5" />, title: 'API별 차이 인지', desc: '지도 API는 NCP 별도 가입.' },
      ]}
      steps={[
        { no: '01', title: '네이버 계정 + 개발자 등록', tag: 'SIGNUP', icon: <User className="h-5 w-5" />, desc: 'developers.naver.com에 네이버 계정으로 로그인합니다.', details: [
          '실명인증이 완료된 계정으로 접속',
          '최초 로그인 시 개발자 이용약관 동의',
          '개발자 센터가 활성화됨',
        ] },
        { no: '02', title: '애플리케이션 등록', tag: 'CREATE APP', icon: <Settings className="h-5 w-5" />, desc: '내 애플리케이션 > 애플리케이션 등록.', details: [
          '애플리케이션 이름 입력',
          '사용 API 체크박스로 선택 (검색/네이버 로그인/Papago/캘린더 등)',
          '비로그인 오픈 API 서비스 환경 등록',
          '환경: WEB / Android / iOS 중 해당 플랫폼 선택',
        ] },
        { no: '03', title: 'Client ID / Secret 확인', tag: 'KEYS', icon: <Key className="h-5 w-5" />, desc: '등록 완료 시 앱 키 자동 발급.', details: [
          'Client ID: 공개 가능 (프론트에서 사용 가능)',
          'Client Secret: 서버 전용 · 절대 노출 금지',
          '애플리케이션 정보에서 확인 및 재발급 가능',
          '.env 파일로 분리 관리',
        ] },
        { no: '04', title: '플랫폼 / Callback URL 등록', tag: 'PLATFORM', icon: <Globe className="h-5 w-5" />, desc: '선택한 플랫폼별 정보 등록.', details: [
          'WEB: 서비스 URL + Callback URL 등록 (네이버 로그인 시)',
          'Android: 패키지명 + 다운로드 URL',
          'iOS: Bundle ID + App Store URL',
          'Callback URL 미일치 시 401 오류',
        ] },
        { no: '05', title: '네이버 로그인 사용 권한 설정', tag: 'AUTH', icon: <Shield className="h-5 w-5" />, desc: '네이버 로그인을 쓰는 경우 필수 항목 설정.', details: [
          '필수/선택 제공 정보 지정 (이름·이메일·별명·프로필 사진 등)',
          '연락처·생일·성별 등은 검수 요청 필요',
          '검수 요청 시 이용 목적 및 개인정보 처리방침 URL 제출',
          '검수 기간: 영업일 기준 1–3일',
        ] },
        { no: '06', title: '검색 · Papago · Clova API 호출', tag: 'API', icon: <Search className="h-5 w-5" />, desc: '일반 오픈 API는 Client ID/Secret 헤더만으로 즉시 호출 가능.', details: [
          '요청 헤더: X-Naver-Client-Id, X-Naver-Client-Secret',
          '검색 API (블로그·카페·뉴스·이미지 등) 일 25,000건 무료',
          'Papago 번역: 월 10,000자 무료, 초과 시 유료',
          '개발 시 rate limit 주의 (초당 10회 권장)',
        ] },
        { no: '07', title: '네이버 지도 (NCP 별도 가입)', tag: 'MAP', icon: <MapPin className="h-5 w-5" />, desc: '지도 API는 Naver Cloud Platform으로 이관되었습니다.', details: [
          'https://console.ncloud.com 별도 가입 필요',
          'AI·NAVER API 상품 > Maps > 이용 신청',
          'Geocoding / Reverse Geocoding / Directions / Static Maps',
          'Client ID 발급 후 Web Dynamic Map JS SDK에서 사용',
          '무료 한도: 월 100만 호출 (상품별 상이)',
        ] },
        { no: '08', title: '팀 멤버 초대 & 사용량 모니터링', tag: 'MANAGE', icon: <Settings className="h-5 w-5" />, desc: '앱 설정에서 팀 관리 및 모니터링.', details: [
          '애플리케이션 정보 > 멤버 관리 > 초대',
          '멤버는 해당 네이버 계정으로 로그인하면 앱 조회 가능',
          '일일 API 호출량 그래프 확인',
          '한도 초과 시 API 호출 실패 — 여유있게 설정',
        ] },
      ]}
      pitfalls={[
        { title: '네이버 지도 ≠ Naver Developers', desc: '지도는 Naver Cloud Platform(console.ncloud.com)에서 가입해야 합니다. 같은 Naver Developers에서 지도를 찾으면 안 나옵니다.' },
        { title: 'Client Secret 프론트 노출', desc: '예제 코드에 Client Secret을 그대로 넣어 배포하는 실수가 많습니다. 반드시 서버에서 호출하거나 프록시 사용.' },
        { title: '검수 필요 항목을 필수로 설정', desc: '연락처·주소·생일 등은 검수 완료 전에는 응답에 포함되지 않습니다. 필수 체크 전에 검수 요청부터.' },
        { title: 'Callback URL 불일치', desc: '등록된 URL과 실제 리다이렉트 URL이 정확히 일치해야 합니다. 프로토콜(http/https)·trailing slash도 구분.' },
        { title: 'API 일일 한도 초과', desc: '무료 한도 초과 시 호출이 차단됩니다. Papago·검색은 유료 전환 신청 필요.' },
      ]}
      resources={[
        { title: 'Naver Developers 콘솔', desc: '앱 등록·키 관리', href: 'https://developers.naver.com' },
        { title: '네이버 로그인 문서', desc: 'OAuth 2.0 가이드', href: 'https://developers.naver.com/docs/login/api/api.md' },
        { title: '검색 API 문서', desc: '블로그·뉴스·카페 검색', href: 'https://developers.naver.com/docs/serviceapi/search/blog/blog.md' },
        { title: 'Papago 번역 API', desc: '번역 API 가이드', href: 'https://developers.naver.com/docs/papago/papago-nmt-overview.md' },
        { title: 'NCP 콘솔 (지도)', desc: 'Naver Cloud Platform 지도 API', href: 'https://console.ncloud.com' },
        { title: 'NAVER Maps API', desc: '지도 Web Dynamic Map', href: 'https://navermaps.github.io/maps.js.ncp/' },
      ]}
    />
  )
}
