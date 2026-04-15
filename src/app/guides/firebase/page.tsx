'use client'

import { GuideTemplate } from '@/components/GuideTemplate'
import { Flame, User, CreditCard, Settings, Key, Database, Bell, Shield } from 'lucide-react'

export default function FirebaseGuidePage() {
  return (
    <GuideTemplate
      badge={{ icon: <Flame className="h-3.5 w-3.5 text-white/80" />, text: 'FIREBASE · GOOGLE CLOUD' }}
      titleTop="Firebase / GCP"
      titleBottom="프로젝트 & 키 셋업"
      description={`앱 개발에서 가장 많이 쓰는 Firebase(FCM 푸시·Auth·Firestore·Analytics)와 Google Cloud 프로젝트 초기 셋업 가이드입니다.\n결제 프로필 연결부터 iOS/Android SDK 키까지 한 번에 정리합니다.`}
      primaryCta={{ label: 'Firebase 콘솔 열기', href: 'https://console.firebase.google.com' }}
      stats={[
        { label: '가입비', value: '무료 (Spark)' },
        { label: '유료 전환', value: '필요 시 Blaze' },
        { label: '필요 정보', value: 'Google 계정·카드' },
      ]}
      overviewTitle="시작 전에 확인하세요"
      overviewDesc="Firebase는 Google Cloud 프로젝트 위에 올라가는 제품군입니다. Spark(무료) 요금제로 시작하되, Cloud Functions·Storage 사용량이 늘면 Blaze(종량제)로 업그레이드가 필요합니다. FCM 푸시 자체는 Spark에서도 무제한 무료입니다."
      overviewItems={[
        { icon: <User className="h-5 w-5" />, title: 'Google 계정 + 2FA', desc: '조직 Workspace 계정 권장.' },
        { icon: <CreditCard className="h-5 w-5" />, title: '결제 수단 (Blaze)', desc: '해외결제 가능 카드 필요.' },
        { icon: <Shield className="h-5 w-5" />, title: '프로젝트 명 정하기', desc: '일부 리소스에 고정 포함됨.' },
        { icon: <Settings className="h-5 w-5" />, title: '리전 결정 (Asia-Northeast3)', desc: '한국 서비스는 서울 리전.' },
      ]}
      steps={[
        { no: '01', title: 'Google Cloud 프로젝트 생성', tag: 'PROJECT', icon: <Settings className="h-5 w-5" />, desc: 'Firebase는 내부적으로 GCP 프로젝트를 생성합니다.', details: [
          'console.cloud.google.com 접속',
          '새 프로젝트 만들기 (프로젝트 ID는 전역 고유)',
          '조직 없음 또는 조직 선택',
          '이후 Firebase 콘솔에서도 자동 연동됨',
        ] },
        { no: '02', title: 'Firebase 프로젝트 추가', tag: 'FIREBASE', icon: <Flame className="h-5 w-5" />, desc: '기존 GCP 프로젝트에 Firebase 기능을 활성화합니다.', details: [
          'console.firebase.google.com > 프로젝트 추가',
          '기존 GCP 프로젝트 선택',
          'Google Analytics 사용 여부 선택 (권장: 사용)',
          'Analytics 계정 연결 (신규 생성 or 기존)',
        ] },
        { no: '03', title: '요금제 업그레이드 (필요 시)', tag: 'BILLING', icon: <CreditCard className="h-5 w-5" />, desc: '외부 API 호출·Storage 사용은 Blaze 필요.', details: [
          '요금제 > 업그레이드 > Blaze 종량제',
          '결제 계정 연결 (카드 등록)',
          '예산 알림 설정 (월 $10·$50·$100 등)',
          'Spark에서도 FCM·Auth·Firestore 무료 한도는 유지',
        ] },
        { no: '04', title: 'iOS / Android 앱 등록', tag: 'APP', icon: <Key className="h-5 w-5" />, desc: '각 플랫폼용 설정 파일을 다운로드합니다.', details: [
          'iOS: 번들 ID 입력 → GoogleService-Info.plist 다운로드',
          'Android: 패키지명 + SHA-1(keystore) → google-services.json 다운로드',
          'Web: 앱 별칭 입력 → firebaseConfig 스크립트 복사',
          '설정 파일은 프로젝트 루트/Android app/ 폴더에 배치',
        ] },
        { no: '05', title: 'FCM 푸시 셋업', tag: 'PUSH', icon: <Bell className="h-5 w-5" />, desc: '푸시 알림은 FCM(Firebase Cloud Messaging) 무료.', details: [
          'iOS: APNs 인증 키(.p8) 업로드 — Apple Developer 계정 필요',
          '  Key ID + Team ID도 함께 입력',
          'Android: FCM은 별도 설정 없이 google-services.json으로 동작',
          '서버 키는 Cloud Messaging 설정에서 확인',
        ] },
        { no: '06', title: 'Authentication 활성화', tag: 'AUTH', icon: <Shield className="h-5 w-5" />, desc: '로그인 방식을 활성화합니다.', details: [
          '이메일/비밀번호 · Google · Apple · Facebook · 전화번호 등',
          '각 제공자별 OAuth 설정 (Apple은 Apple Developer에서 Service ID 발급)',
          '승인된 도메인 등록 (로컬 테스트는 localhost 자동 포함)',
          '보안 규칙 기본값 확인',
        ] },
        { no: '07', title: 'Firestore / Realtime DB', tag: 'DATABASE', icon: <Database className="h-5 w-5" />, desc: '데이터 저장소 선택 및 생성.', details: [
          'Firestore: 문서 기반, 대부분 서비스에 권장',
          'Realtime Database: 실시간 동기화가 핵심인 경우',
          '리전 선택: asia-northeast3 (서울) 권장',
          '시작 모드: 프로덕션(권한 엄격) / 테스트(공개) — 반드시 프로덕션',
          '보안 규칙(Security Rules) 작성 필수',
        ] },
        { no: '08', title: '서비스 계정 / Admin SDK 키', tag: 'ADMIN', icon: <Key className="h-5 w-5" />, desc: '서버에서 Admin SDK를 쓰려면 서비스 계정 키 발급.', details: [
          '프로젝트 설정 > 서비스 계정 > 새 비공개 키 생성',
          '.json 파일 다운로드 (한 번만 표시됨)',
          '절대 Git에 커밋 금지 · .env 또는 Secret Manager 사용',
          'Vercel이면 JSON 전체를 base64로 env에 저장하거나 개별 필드 분리',
        ] },
      ]}
      pitfalls={[
        { title: 'Spark → Blaze 강제 전환', desc: 'Cloud Functions 배포·외부 API 호출 시 Blaze가 필수. 카드 등록이 안 된 상태로 배포하면 실패합니다.' },
        { title: 'APNs 키 미등록 iOS 푸시 실패', desc: 'iOS에서 FCM은 APNs(Apple Push Notification) 토큰을 FCM 토큰으로 변환해 사용합니다. Apple Developer에서 APNs 인증 키(.p8)를 먼저 발급하세요.' },
        { title: 'google-services.json 보안', desc: '자체는 공개 가능하지만 Android SHA-1이 포함되어 있어 함께 관리되는 값과 연결됩니다. 대신 서비스 계정 JSON은 절대 공개 금지.' },
        { title: 'Security Rules 기본값 방치', desc: '테스트 모드(공개) 상태로 두면 누구나 DB 조회 가능. 프로덕션 규칙으로 즉시 전환.' },
        { title: '리전 변경 불가', desc: 'Firestore/Storage 리전은 프로젝트 생성 시 한 번 결정하면 변경 불가. 서울 리전 선택 권장.' },
      ]}
      resources={[
        { title: 'Firebase Console', desc: '프로젝트 관리', href: 'https://console.firebase.google.com' },
        { title: 'Google Cloud Console', desc: 'GCP 프로젝트 / 결제', href: 'https://console.cloud.google.com' },
        { title: 'Firebase 요금제', desc: 'Spark vs Blaze 비교', href: 'https://firebase.google.com/pricing' },
        { title: 'FCM 설정 가이드', desc: 'iOS/Android 푸시', href: 'https://firebase.google.com/docs/cloud-messaging' },
        { title: 'Firestore 보안 규칙', desc: 'Rules 언어 가이드', href: 'https://firebase.google.com/docs/firestore/security/get-started' },
        { title: 'Admin SDK 문서', desc: '서버 SDK 사용법', href: 'https://firebase.google.com/docs/admin/setup' },
      ]}
    />
  )
}
