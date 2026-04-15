'use client'

import { GuideTemplate } from '@/components/GuideTemplate'
import { CreditCard, User, FileText, Settings, Key, Shield, Store, Zap } from 'lucide-react'

export default function PortoneGuidePage() {
  return (
    <GuideTemplate
      badge={{ icon: <CreditCard className="h-3.5 w-3.5 text-white/80" />, text: 'PORTONE (구 아임포트)' }}
      titleTop="포트원"
      titleBottom="통합 PG 연동"
      description={`국내 여러 PG(토스·KG이니시스·NICE·카카오페이·네이버페이 등)를 하나의 API로 연결해주는 포트원 연동 가이드입니다.\n계정 가입부터 PG사 계약, 채널 등록, V2 API 호출까지 안내합니다.`}
      primaryCta={{ label: '포트원 콘솔 열기', href: 'https://admin.portone.io' }}
      stats={[
        { label: '수수료', value: '무료 (PG 수수료만)' },
        { label: '지원 PG', value: '15개 이상' },
        { label: '필요 서류', value: '사업자등록증·PG 계약' },
      ]}
      overviewTitle="시작 전에 확인하세요"
      overviewDesc="포트원(구 아임포트)은 여러 PG를 하나의 API로 추상화해주는 서비스입니다. 포트원 자체는 무료지만, 각 PG와 별도 계약이 필요합니다. 신규 프로젝트는 V2(GraphQL/REST)를 권장하며, 기존 V1도 계속 지원됩니다."
      overviewItems={[
        { icon: <FileText className="h-5 w-5" />, title: '사업자등록 완료', desc: '개인·법인 모두 가능.' },
        { icon: <Store className="h-5 w-5" />, title: 'PG 선택', desc: '토스·KG이니시스·NICE 등.' },
        { icon: <Settings className="h-5 w-5" />, title: 'V2 vs V1 결정', desc: '신규는 V2 권장.' },
        { icon: <Shield className="h-5 w-5" />, title: '웹훅 수신 서버', desc: 'HTTPS 엔드포인트 필요.' },
      ]}
      steps={[
        { no: '01', title: '포트원 계정 생성', tag: 'SIGNUP', icon: <User className="h-5 w-5" />, desc: 'admin.portone.io에서 가입.', details: [
          '이메일 가입 또는 카카오 로그인',
          '사업자 정보 입력 (사업자번호·대표자명·주소)',
          '계약 담당자 정보 등록',
          '심사 없이 즉시 테스트 환경 사용 가능',
        ] },
        { no: '02', title: 'PG사 선택 & 계약', tag: 'PG', icon: <Store className="h-5 w-5" />, desc: '실결제를 위한 PG사 계약. 포트원 콘솔에서 신청 가능.', details: [
          '지원 PG: 토스·KG이니시스·NICE·카카오페이·네이버페이·페이팔 등',
          '포트원 콘솔 > PG 신청에서 간편 접수',
          'PG사 심사 2–5영업일 소요',
          '수수료는 PG별 상이 (일반 카드 2.5~3.5%)',
          '정산 주기 선택 (D+1 / D+3 등)',
        ] },
        { no: '03', title: '테스트 스토어 설정', tag: 'TEST', icon: <Settings className="h-5 w-5" />, desc: '실계약 전에 테스트로 연동을 완성합니다.', details: [
          '테스트 상점 기본 제공 (KCP·이니시스·토스 테스트 키)',
          '테스트 카드번호 문서 제공 (docs.portone.io)',
          '실 계좌이체·가상계좌·휴대폰 결제 등 방식별 테스트',
          '프론트·서버 플로우 전체를 테스트 환경에서 완성',
        ] },
        { no: '04', title: 'V2 API 키 발급', tag: 'KEYS', icon: <Key className="h-5 w-5" />, desc: '신규 프로젝트는 V2를 사용하세요.', details: [
          'Store ID: 상점 식별자 (공개 가능)',
          'API Secret: 서버 전용 · 절대 노출 금지',
          '.env로 분리 저장',
          'V2는 GraphQL + REST 모두 제공',
          '채널 키(Channel Key): PG·결제수단 조합별 식별',
        ] },
        { no: '05', title: '결제 채널 등록', tag: 'CHANNEL', icon: <Settings className="h-5 w-5" />, desc: '실결제로 전환할 때 실 채널 등록.', details: [
          '콘솔 > 결제 연동 > 채널 추가',
          'PG사·MID(상점 ID)·PG 제공 키 입력',
          '카드·계좌이체·간편결제별로 각각 채널 등록',
          '라이브·테스트 채널을 분리',
          '채널 별칭으로 프론트에서 선택 가능',
        ] },
        { no: '06', title: '결제 요청 구현', tag: 'CLIENT', icon: <Zap className="h-5 w-5" />, desc: '프론트엔드에서 결제창 호출.', details: [
          '브라우저 SDK: @portone/browser-sdk',
          'PortOne.requestPayment({ storeId, channelKey, paymentId, ... })',
          'paymentId: 주문 고유 ID (내부에서 생성, UUID 권장)',
          '결제 완료 시 프론트로 결과 콜백',
          'React Native: @portone/react-native-sdk',
        ] },
        { no: '07', title: '서버 검증 & 주문 확정', tag: 'VERIFY', icon: <Shield className="h-5 w-5" />, desc: '프론트 결과만 믿지 말고 서버에서 재확인.', details: [
          '프론트 결제 완료 → 서버에 paymentId 전송',
          '서버에서 포트원 API로 결제 정보 조회',
          'amount·currency·paymentStatus 검증',
          '예상 금액과 일치하면 주문 확정',
          '금액 조작 시도를 막는 핵심 단계',
        ] },
        { no: '08', title: '웹훅 등록', tag: 'WEBHOOK', icon: <Settings className="h-5 w-5" />, desc: '결제 상태 변경을 즉시 수신.', details: [
          '콘솔 > 웹훅 > 엔드포인트 추가',
          'HTTPS URL 필수, 3초 이내 200 응답',
          '이벤트: Paid · Cancelled · Failed · VirtualAccountIssued',
          'X-PortOne-Signature 서명 검증 필수',
          '취소·환불 흐름은 웹훅 기반으로 처리 권장',
        ] },
      ]}
      pitfalls={[
        { title: '프론트 결제 결과만 신뢰', desc: '브라우저 콘솔에서 결과를 조작할 수 있으니, 반드시 서버에서 포트원 API로 재조회해 금액을 검증하세요.' },
        { title: 'API Secret 노출', desc: '.env 대신 하드코딩했다가 GitHub에 올리는 사고가 자주 있습니다. 노출 시 즉시 재발급.' },
        { title: '테스트·라이브 채널 혼용', desc: '테스트 키로 라이브 채널을 호출하면 실패, 반대도 마찬가지. 환경변수로 구분.' },
        { title: '웹훅 서명 검증 생략', desc: '누구나 웹훅 엔드포인트에 POST를 쏠 수 있습니다. 서명 검증 없이 상태 업데이트하면 주문 위조 가능.' },
        { title: 'V1 문서만 보고 개발', desc: '인터넷에 있는 자료 중 다수가 V1 기준입니다. 신규 프로젝트는 V2 문서를 우선 보세요.' },
      ]}
      resources={[
        { title: '포트원 콘솔', desc: '채널·키·웹훅 관리', href: 'https://admin.portone.io' },
        { title: 'V2 문서', desc: '신규 개발용', href: 'https://developers.portone.io' },
        { title: 'V1 문서 (레거시)', desc: '기존 연동 유지', href: 'https://portone.gitbook.io/v1-docs/' },
        { title: 'Browser SDK', desc: '@portone/browser-sdk', href: 'https://developers.portone.io/sdk/ko/v2-sdk/javascript-sdk-old/readme' },
        { title: 'React Native SDK', desc: '앱 결제 연동', href: 'https://github.com/portone-io/portone-react-native-sdk' },
        { title: '웹훅 가이드', desc: '서명 검증 예제', href: 'https://developers.portone.io/docs/ko/v2-payment/webhook' },
      ]}
    />
  )
}
