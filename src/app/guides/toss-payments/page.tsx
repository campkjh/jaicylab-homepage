'use client'

import { GuideTemplate } from '@/components/GuideTemplate'
import { CreditCard, User, FileText, Settings, Key, Shield, Store, Receipt } from 'lucide-react'

export default function TossPaymentsGuidePage() {
  return (
    <GuideTemplate
      badge={{ icon: <CreditCard className="h-3.5 w-3.5 text-white/80" />, text: 'TOSS PAYMENTS' }}
      titleTop="토스페이먼츠"
      titleBottom="가맹점 계약 & 연동"
      description={`앱·웹에서 결제를 받으려면 PG사 가맹점 계약이 필요합니다.\n토스페이먼츠 신청부터 심사, 테스트 키 → 실서비스 키 전환까지 안내합니다.`}
      primaryCta={{ label: '토스페이먼츠 신청', href: 'https://www.tosspayments.com' }}
      stats={[
        { label: '가맹점 계약', value: '무료' },
        { label: '심사 기간', value: '2–5영업일' },
        { label: '필요 서류', value: '사업자등록증·통장' },
      ]}
      overviewTitle="시작 전에 확인하세요"
      overviewDesc="PG 가맹점 계약은 사업자등록이 전제입니다. 개인 사업자도 가능하지만 업종에 따라 추가 서류(통신판매업 신고증·의료·금융 관련 인허가)가 필요할 수 있습니다. 테스트 키로 먼저 연동을 끝내고, 실서비스 키는 가맹점 심사 완료 후 발급됩니다."
      overviewItems={[
        { icon: <FileText className="h-5 w-5" />, title: '사업자등록 필수', desc: '개인·법인 모두 가능.' },
        { icon: <Store className="h-5 w-5" />, title: '통신판매업 신고', desc: '일반 판매업은 필수 (서울 구청).' },
        { icon: <Receipt className="h-5 w-5" />, title: '정산 통장', desc: '사업자명과 일치한 계좌 준비.' },
        { icon: <Shield className="h-5 w-5" />, title: '서비스 URL/앱', desc: '심사 대상이 실재해야 함.' },
      ]}
      steps={[
        { no: '01', title: '테스트 키로 먼저 연동', tag: 'DEV FIRST', icon: <Key className="h-5 w-5" />, desc: '계약 전에 테스트 키로 결제 플로우를 완성해두면 출시 일정이 당겨집니다.', details: [
          'docs.tosspayments.com에 바로 공개되어 있는 테스트 키 사용',
          '결제 위젯 / 결제 창 / 브랜드페이 등 방식 선택',
          '성공/실패/취소 콜백 URL 구현',
          '국내 카드·해외 카드·계좌이체·간편결제 테스트 가능',
        ] },
        { no: '02', title: '가맹점 신청서 작성', tag: 'APPLY', icon: <FileText className="h-5 w-5" />, desc: 'tosspayments.com에서 가맹점 계약 신청.', details: [
          '상호·대표자명·사업자등록번호·업종',
          '판매 품목 및 예상 월 거래액',
          '서비스 URL (출시 전이면 "준비 중" + 스크린샷 별첨 가능)',
          '정산 계좌 정보 (사업자명 일치)',
        ] },
        { no: '03', title: '필요 서류 업로드', tag: 'DOCS', icon: <FileText className="h-5 w-5" />, desc: '기본 + 업종별 추가 서류.', details: [
          '기본: 사업자등록증·대표자 신분증·통장 사본',
          '일반 판매: 통신판매업 신고증',
          '의료·의약품: 관련 허가증 / 면허증',
          '음식점: 영업신고증',
          '서비스 스크린샷 2–3장 (결제 흐름 확인용)',
        ] },
        { no: '04', title: '수수료 협의', tag: 'FEE', icon: <Receipt className="h-5 w-5" />, desc: '카드·간편결제별 수수료율을 계약서에서 확인.', details: [
          '일반 카드: 2.5–3.5% 수준 (거래액·업종별 상이)',
          '간편결제(카카오페이·네이버페이 등): 추가 수수료',
          '정산 주기: D+1 (다음 영업일) · D+3 · D+7 중 선택',
          '월 거래액이 크면 수수료 인하 협상 가능',
        ] },
        { no: '05', title: '심사 & 승인', tag: 'REVIEW', icon: <Shield className="h-5 w-5" />, desc: '영업일 기준 2~5일 소요.', details: [
          '서류 보완 요청은 이메일로 발송',
          '일부 업종(보험·투자·게임·주류)은 추가 심사',
          '승인 시 가맹점 관리자 계정 발급',
          '계약서 전자서명(카카오 인증 등)으로 체결',
        ] },
        { no: '06', title: '실서비스 키 발급', tag: 'LIVE KEYS', icon: <Key className="h-5 w-5" />, desc: '승인 완료 후 실제 결제가 가능한 키를 발급받습니다.', details: [
          '상점 관리자 페이지 > API 키',
          '클라이언트 키: 프론트 결제창 호출용 (공개 OK)',
          '시크릿 키: 서버 승인·취소 호출용 (절대 노출 금지)',
          '.env로 분리하고 서버에서만 사용',
          '테스트 키와 실서비스 키는 prefix로 구분됨 (test_* / live_*)',
        ] },
        { no: '07', title: '웹훅 (Webhook) 등록', tag: 'WEBHOOK', icon: <Settings className="h-5 w-5" />, desc: '결제 상태 변경을 서버에서 즉시 수신.', details: [
          '상점 관리자 > 개발자 센터 > 웹훅',
          '이벤트: PAYMENT_STATUS_CHANGED, CANCEL_STATUS_CHANGED 등',
          '엔드포인트 URL 등록 (HTTPS 필수)',
          '서명 검증(Signature) 로직 구현 — 위조 방지',
        ] },
        { no: '08', title: '정산·세금계산서 자동화', tag: 'SETTLEMENT', icon: <Receipt className="h-5 w-5" />, desc: '정산 내역과 세금계산서 확인·다운로드.', details: [
          '정산 내역: 상점 관리자 페이지에서 일/월별 확인',
          '세금계산서는 토스페이먼츠에서 자동 발행',
          '현금영수증은 결제 승인 시 자동 처리 가능',
          '엑셀 다운로드 또는 API로 정산 자동화',
        ] },
      ]}
      pitfalls={[
        { title: '서비스 미완성 상태로 심사 요청', desc: '최소한 결제 플로우 스크린샷이나 테스트 URL이 있어야 통과됩니다. "준비 중"만으로는 반려되기 쉬워요.' },
        { title: '정산 계좌 명의 불일치', desc: '사업자등록증의 상호·대표자명과 통장 명의가 달라 반려되는 경우가 많습니다.' },
        { title: '시크릿 키 프론트 노출', desc: '결제 승인·취소 API는 반드시 서버에서 호출해야 합니다. 프론트에서 직접 호출하면 모든 거래가 조작 가능.' },
        { title: '웹훅 서명 검증 누락', desc: '웹훅 엔드포인트에 누구나 POST를 보낼 수 있습니다. 서명 검증 없이 상태를 믿으면 결제 우회 취약점.' },
        { title: '인앱결제 정책', desc: 'iOS·Android 앱에서 디지털 상품 결제는 각 스토어의 인앱결제만 허용. 외부 PG 사용 시 앱 거부 위험.' },
      ]}
      resources={[
        { title: '토스페이먼츠 메인', desc: '가맹점 신청', href: 'https://www.tosspayments.com' },
        { title: '개발자 문서', desc: '연동 가이드·API 레퍼런스', href: 'https://docs.tosspayments.com' },
        { title: '결제 위젯 가이드', desc: '가장 빠른 연동 방법', href: 'https://docs.tosspayments.com/guides/payment/integration' },
        { title: '웹훅 가이드', desc: '이벤트·서명 검증', href: 'https://docs.tosspayments.com/guides/webhook' },
        { title: '상점 관리자 로그인', desc: 'API 키·정산 관리', href: 'https://app.tosspayments.com' },
        { title: '브랜드페이', desc: '원클릭 결제 (간편결제)', href: 'https://docs.tosspayments.com/guides/brandpay/integration' },
      ]}
    />
  )
}
