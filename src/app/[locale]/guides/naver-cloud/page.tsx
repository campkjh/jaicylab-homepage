'use client'

import { GuideTemplate } from '@/components/GuideTemplate'
import { Cloud, User, CreditCard, Settings, Key, MapPin, MessageSquare, Shield } from 'lucide-react'

export default function NaverCloudGuidePage() {
  return (
    <GuideTemplate
      badge={{ icon: <Cloud className="h-3.5 w-3.5 text-white/80" />, text: 'NAVER CLOUD PLATFORM' }}
      titleTop="Naver Cloud Platform"
      titleBottom="계정 생성 & 인증 키 발급"
      description={`네이버 지도·Clova·SMS·CLOVA OCR 등 NCP 상품을 사용하려면 Naver Cloud Platform(console.ncloud.com) 별도 가입이 필요합니다.\n계정 생성, 결제 수단, Access Key 발급까지 안내합니다.`}
      primaryCta={{ label: 'NCP 콘솔 열기', href: 'https://www.ncloud.com' }}
      stats={[
        { label: '가입비', value: '무료' },
        { label: '결제', value: '한국 카드·계좌 OK' },
        { label: '첫 가입 혜택', value: '크레딧 지급' },
      ]}
      overviewTitle="시작 전에 확인하세요"
      overviewDesc="NCP는 Naver Developers(네이버 로그인·검색 API)와는 완전히 다른 서비스입니다. 지도(Maps)·CLOVA·SMS·IoT 등이 여기 있습니다. 국내 사업자는 NCP가 AWS보다 정산·세금계산서 발행 면에서 편리합니다."
      overviewItems={[
        { icon: <User className="h-5 w-5" />, title: '개인 vs 기업 회원', desc: '사업자는 기업 회원 권장.' },
        { icon: <CreditCard className="h-5 w-5" />, title: '결제 수단', desc: '카드·계좌이체·법인카드 모두 가능.' },
        { icon: <Shield className="h-5 w-5" />, title: '휴대폰 본인인증', desc: '가입 시 실명 인증 필수.' },
        { icon: <Settings className="h-5 w-5" />, title: '상품별 이용 신청', desc: 'Maps·SMS 등 개별 활성화.' },
      ]}
      steps={[
        { no: '01', title: 'NCP 회원가입', tag: 'SIGNUP', icon: <User className="h-5 w-5" />, desc: 'www.ncloud.com에서 회원가입 진행.', details: [
          '개인회원 / 기업회원(법인 사업자번호) 중 선택',
          '실명 인증(휴대폰 본인인증) 필수',
          '이메일 인증 완료',
          '기업회원은 사업자등록증 이미지 업로드',
        ] },
        { no: '02', title: '결제 수단 등록', tag: 'BILLING', icon: <CreditCard className="h-5 w-5" />, desc: '유료 상품 사용 전 결제 수단을 먼저 등록.', details: [
          '마이페이지 > 결제수단 관리',
          '신용카드 / 체크카드 / 계좌이체 / 법인카드',
          '기업회원은 세금계산서 자동 발행 (월 정산)',
          '첫 가입 시 크레딧 지급 (금액은 이벤트별 상이)',
        ] },
        { no: '03', title: '콘솔 접속 & Access Key 발급', tag: 'KEY', icon: <Key className="h-5 w-5" />, desc: 'API 호출용 인증 키를 발급받습니다.', details: [
          'console.ncloud.com 접속 (별도 로그인)',
          '마이페이지 > 계정 관리 > 인증키 관리',
          'Access Key ID + Secret Key 생성',
          'Secret Key는 최초 1회만 표시됨 — 안전하게 보관',
          '환경별로 키를 분리 발급 권장 (dev / prod)',
        ] },
        { no: '04', title: 'Maps (지도) 이용 신청', tag: 'MAPS', icon: <MapPin className="h-5 w-5" />, desc: '네이버 지도 API를 프로젝트에 사용.', details: [
          '콘솔 > AI·NAVER API > Maps > 이용 신청',
          'Application 등록 (서비스 명 + 웹/앱 Origin)',
          '발급된 Client ID를 JS SDK에 주입',
          '제공 API: Web Dynamic Map / Static Map / Geocoding / Directions',
          '무료 한도: Web Dynamic Map 월 100만 호출',
        ] },
        { no: '05', title: 'SENS (SMS / LMS / 알림톡) 신청', tag: 'SMS', icon: <MessageSquare className="h-5 w-5" />, desc: '문자 발송 서비스 이용.', details: [
          'AI·NAVER API는 아닌 Application Services > SENS',
          '발신번호 사전 등록 (전파관리소 인증 필요)',
          '프로젝트 생성 후 Service Key 발급',
          'SMS 건당 약 8원, LMS 약 30원',
          '알림톡 발송도 SENS에서 가능 (카카오 채널 연동 필요)',
        ] },
        { no: '06', title: 'CLOVA API 이용 신청', tag: 'CLOVA', icon: <Settings className="h-5 w-5" />, desc: 'OCR·Speech·Premium Voice 등 AI 서비스.', details: [
          'AI·NAVER API > CLOVA 상품군',
          'OCR(명함·신분증·일반)·Speech(STT·CSS) 등',
          '상품별 사용량 과금 — 첫 가입 크레딧으로 테스트 가능',
          'API Gateway를 통해 호출 (Invoke URL 발급)',
          'Secret Key 헤더 필수',
        ] },
        { no: '07', title: '리소스 & 알림 설정', tag: 'OPS', icon: <Shield className="h-5 w-5" />, desc: '요금 폭탄을 방지하기 위한 알림을 설정.', details: [
          '마이페이지 > 비용·이용정보 > 이용 요금',
          '예산 임계치 알림(SMS/이메일) 설정',
          'Cloud Insight 모니터링 대시보드 생성',
          'Sub Account로 팀원별 권한 분리',
        ] },
        { no: '08', title: '서브계정 & 권한 관리', tag: 'IAM', icon: <User className="h-5 w-5" />, desc: '팀원에게 최소 권한을 부여.', details: [
          'Sub Account 생성 후 정책(Policy) 할당',
          '읽기 전용 / 상품별 관리자 등 정책 조합',
          'MFA 강제 설정 권장',
          '로그인 이력은 Cloud Activity Tracer에서 확인',
        ] },
      ]}
      pitfalls={[
        { title: 'Naver Developers와 혼동', desc: '네이버 로그인은 Naver Developers, 지도·SMS·CLOVA는 NCP. 접속 URL도 다릅니다.' },
        { title: 'Secret Key 노출', desc: '최초 발급 시만 표시되는 Secret Key를 저장해두지 않으면 재발급해야 합니다. 키 노출 의심 시 즉시 폐기+재발급.' },
        { title: '발신번호 미등록 SMS 발송 불가', desc: 'SENS는 반드시 전파관리소에 등록된 발신번호만 사용 가능. 등록까지 1–3일 걸립니다.' },
        { title: '예상치 못한 과금', desc: '지도 Static Map·Directions 호출이 많으면 무료 한도 초과. 알림 설정 필수.' },
        { title: '리전 이슈', desc: 'KR(서울) 외 리전 서비스도 있지만, 국내 서비스는 KR 리전이 네트워크 비용·지연 모두 유리합니다.' },
      ]}
      resources={[
        { title: 'NCP 메인 사이트', desc: '회원가입·요금제 안내', href: 'https://www.ncloud.com' },
        { title: 'NCP 콘솔', desc: '상품 관리·Access Key', href: 'https://console.ncloud.com' },
        { title: 'NAVER Maps API', desc: '지도 Web Dynamic Map', href: 'https://www.ncloud.com/product/applicationService/maps' },
        { title: 'SENS (SMS/알림톡)', desc: '문자·카카오 알림톡 발송', href: 'https://www.ncloud.com/product/applicationService/sens' },
        { title: 'CLOVA AI 상품', desc: 'OCR·STT·TTS 등', href: 'https://www.ncloud.com/product/aiService' },
        { title: 'API Gateway', desc: '인증 키 사용 가이드', href: 'https://api.ncloud-docs.com/docs/common-ncpapi' },
      ]}
    />
  )
}
