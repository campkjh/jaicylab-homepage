'use client'

import { GuideTemplate } from '@/components/GuideTemplate'
import { Play, User, Shield, CreditCard, FileText, Building2, Mail, Key, ExternalLink } from 'lucide-react'

export default function GooglePlayGuidePage() {
  return (
    <GuideTemplate
      badge={{ icon: <Play className="h-3.5 w-3.5 text-white/80" />, text: 'GOOGLE PLAY CONSOLE' }}
      titleTop="Google Play Console"
      titleBottom="개발자 계정 만들기"
      description={`Android 앱을 Play 스토어에 출시하려면 Google Play Console 가입이 필요합니다.\n개인·법인 구분, 신원 확인, 결제까지 순서대로 안내해 드립니다.`}
      primaryCta={{ label: 'Play Console 가입 열기', href: 'https://play.google.com/console/signup' }}
      stats={[
        { label: '등록비', value: '$25 (1회)' },
        { label: '심사 기간', value: '1–3일' },
        { label: '필요 문서', value: '신분증·카드' },
      ]}
      overviewTitle="출시 전에 확인하세요"
      overviewDesc="개인·법인 유형 선택은 앱 표기 주체와 세금계산에 영향을 주며, 중간 변경이 제한적입니다. 2023년 정책 변경 이후 법인(조직) 계정은 D-U-N-S 번호가 필수이므로 가입 전 미리 발급받아 두는 것이 가장 빠른 길입니다."
      overviewItems={[
        { icon: <User className="h-5 w-5" />, title: '개인 vs 법인 결정', desc: '앱 이름·스토어 노출 주체가 달라집니다.' },
        { icon: <Shield className="h-5 w-5" />, title: '2단계 인증 Google 계정', desc: '출시 전 필수, 도메인 이메일 권장.' },
        { icon: <Building2 className="h-5 w-5" />, title: '법인 등록 준비 (법인만)', desc: '사업자등록증·D-U-N-S 번호(필수).' },
        { icon: <CreditCard className="h-5 w-5" />, title: '해외 결제 카드', desc: '$25 일회성 등록비 결제용.' },
      ]}
      steps={[
        { no: '01', title: 'Google 계정 준비', tag: 'PREREQUISITE', icon: <User className="h-5 w-5" />, desc: 'Play Console 가입에 사용할 Google 계정을 결정합니다.', details: [
          '개인 Gmail보다 조직 도메인 Workspace 계정 권장',
          '2단계 인증 필수',
          '추후 소유권 이전이 까다로우므로 신중하게 선택',
        ] },
        { no: '02', title: 'Play Console 가입 시작', tag: 'SIGNUP', icon: <ExternalLink className="h-5 w-5" />, desc: 'play.google.com/console/signup 접속 후 안내대로 진행.', details: [
          '계정 유형: 자신(개인) / 조직(법인) 선택',
          'Play Console 이용약관 동의',
          '국가 / 개발자 이름 / 연락처 이메일 입력',
        ] },
        { no: '03', title: '개발자 프로필 작성', tag: 'PROFILE', icon: <FileText className="h-5 w-5" />, desc: '스토어 노출 정보를 입력합니다.', details: [
          '개발자 이름 (스토어에 표시됨, 추후 변경 신청 가능)',
          '연락처 이메일 (사용자 문의용) · 지원 웹사이트 URL',
          '프로필은 언제든 수정 가능하지만 이름 변경은 검토 필요',
        ] },
        { no: '04', title: 'D-U-N-S 번호 발급 (법인만)', tag: 'DUNS', icon: <Building2 className="h-5 w-5" />, desc: '법인(조직) 계정은 D&B에서 발급하는 D-U-N-S 9자리 번호가 필수입니다. 무료이며 한국 기업은 한국기업데이터(KED)에서 발급합니다.', details: [
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
        { no: '05', title: '신원·전화번호 확인', tag: 'VERIFICATION', icon: <Shield className="h-5 w-5" />, desc: '계정 진위 확인을 위한 검증 단계.', details: [
          '개인: 정부 발급 신분증(여권/주민증) 사진 제출',
          '법인: D-U-N-S 번호 + 대표자 신분증 + 사업자등록증',
          '주소 증빙(최근 공과금·카드명세서 등) 요청될 수 있음',
          '모든 정보는 영문/한국어 모두 가능',
        ] },
        { no: '06', title: '등록비 결제 ($25)', tag: 'PAYMENT', icon: <CreditCard className="h-5 w-5" />, desc: '일회성 등록비를 결제합니다. Apple과 달리 매년 갱신 없음.', details: [
          'Visa / Master / Amex 해외결제 가능 카드',
          '법인 카드 사용 시 법인명 일치 권장',
          '결제 영수증 이메일로 자동 발송',
        ] },
        { no: '07', title: 'Google 검토 대기', tag: 'REVIEW', icon: <Mail className="h-5 w-5" />, desc: 'Google이 신원·결제 정보를 검토합니다.', details: [
          '보통 24–72시간 소요 (법인은 최대 7일)',
          '검토 중 추가 서류 요청 이메일이 올 수 있음',
          '승인 완료되면 "개발자 계정이 생성되었습니다" 메일 수신',
        ] },
        { no: '08', title: '결제 프로필 설정', tag: 'PAYOUT', icon: <CreditCard className="h-5 w-5" />, desc: '유료 앱·인앱결제·광고 매출을 수령하려면 결제 프로필을 추가합니다.', details: [
          'Play Console > 설정 > 결제 프로필',
          '세금 정보(W-8BEN 해외, 한국 사업자번호) 입력',
          '은행 계좌 연결 (한국 원화 수령 가능)',
          'US 세금 정보는 법인 유형에 따라 다름',
        ] },
        { no: '09', title: '팀 멤버 초대 및 앱 등록', tag: 'POST', icon: <Key className="h-5 w-5" />, desc: '출시 준비. 팀 역할을 나누고 첫 앱을 생성.', details: [
          '사용자 및 권한 > 새 사용자 초대',
          '역할: Owner / Admin / Developer / Marketing 등',
          '앱 만들기 > 기본 정보 입력 후 번들 업로드',
          'Closed Testing → Open Testing → Production 순 권장',
        ] },
      ]}
      pitfalls={[
        { title: '신원 확인 서류 불일치', desc: '신분증 이름·생년월일이 Google 계정 정보와 정확히 일치해야 통과됩니다.' },
        { title: 'D-U-N-S 영문 표기 불일치', desc: 'D-U-N-S에 등록된 영문 법인명·주소가 사업자등록증 영문 표기·Play Console 입력값과 한 글자라도 다르면 검증 반려됩니다.' },
        { title: 'D-U-N-S 발급 지연', desc: '무료 신청은 14–30일이 걸려 출시 일정에 치명적. 법인 계정은 가입 최소 1개월 전 미리 신청하세요.' },
        { title: '14일 테스트 요구사항 (2023년 도입)', desc: '개인 신규 계정은 최소 20명으로 14일간 Closed Testing 후에야 Production 출시 가능.' },
        { title: '2단계 인증 미설정', desc: '가입 중 2FA 설정 요구로 중단되는 경우가 많습니다. 먼저 켜두세요.' },
        { title: 'Google Play 결제 정책', desc: '앱 내 디지털 상품은 반드시 Google Play Billing을 사용해야 합니다. 외부 PG 사용 시 삭제될 수 있어요.' },
        { title: '개발자 이름 변경 지연', desc: '최초 설정한 개발자 이름 변경은 Google 승인이 필요하며 몇 주 걸립니다.' },
      ]}
      resources={[
        { title: 'Play Console 가입', desc: '개발자 계정 만들기 시작', href: 'https://play.google.com/console/signup' },
        { title: 'Play Console 홈', desc: '앱 등록·관리', href: 'https://play.google.com/console' },
        { title: 'Developer Policy Center', desc: '정책 가이드라인', href: 'https://support.google.com/googleplay/android-developer/topic/9858052' },
        { title: 'Play 결제 시스템', desc: 'Google Play Billing', href: 'https://developer.android.com/google/play/billing' },
        { title: 'Closed Testing 요구사항', desc: '14일 테스트 가이드', href: 'https://support.google.com/googleplay/android-developer/answer/14151465' },
        { title: 'D-U-N-S 번호 조회 (UPIK)', desc: '한국기업데이터 D&B Lookup', href: 'https://www.upik.de/en/upik_search.cgi' },
        { title: 'D-U-N-S 신규 신청', desc: 'D&B 공식 신청 (무료)', href: 'https://www.dnb.com/duns/get-a-duns.html' },
        { title: '결제 프로필 설정', desc: '세금·은행 정보 입력', href: 'https://support.google.com/googleplay/android-developer/answer/9859751' },
      ]}
    />
  )
}
