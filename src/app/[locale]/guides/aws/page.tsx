'use client'

import { GuideTemplate } from '@/components/GuideTemplate'
import { Cloud, User, CreditCard, Shield, Key, Settings, Bell, Server } from 'lucide-react'

export default function AwsGuidePage() {
  return (
    <GuideTemplate
      badge={{ icon: <Cloud className="h-3.5 w-3.5 text-white/80" />, text: 'AMAZON WEB SERVICES' }}
      titleTop="AWS"
      titleBottom="계정 생성 & 초기 셋업"
      description={`글로벌 최대 클라우드 AWS 계정 생성 가이드입니다.\n루트 계정 보호, IAM 사용자 생성, 결제 알림, 리전 선택까지 실수 없이 시작할 수 있도록 정리했습니다.`}
      primaryCta={{ label: 'AWS 가입 시작', href: 'https://aws.amazon.com/ko/free/' }}
      stats={[
        { label: '가입비', value: '무료' },
        { label: '프리티어', value: '12개월 주요 상품 무료' },
        { label: '필요 정보', value: '이메일·카드·휴대폰' },
      ]}
      overviewTitle="시작 전에 확인하세요"
      overviewDesc="AWS는 국내 서비스면 'ap-northeast-2(서울)' 리전을 기본으로 하세요. 루트 계정은 절대 일상 작업에 쓰지 말고, IAM 사용자 + MFA로 보호하는 것이 표준입니다. 프리티어가 끝나는 시점에 과금이 급증하지 않도록 예산 알림을 반드시 설정하세요."
      overviewItems={[
        { icon: <User className="h-5 w-5" />, title: '조직 도메인 이메일', desc: '일상용 개인 메일 권장하지 않음.' },
        { icon: <CreditCard className="h-5 w-5" />, title: '해외결제 가능 카드', desc: '달러 청구, VAT 별도.' },
        { icon: <Shield className="h-5 w-5" />, title: 'MFA(2FA) 앱', desc: '루트 계정 필수 설정.' },
        { icon: <Server className="h-5 w-5" />, title: '서울 리전 기준', desc: 'ap-northeast-2 권장.' },
      ]}
      steps={[
        { no: '01', title: 'AWS 계정 만들기', tag: 'SIGNUP', icon: <User className="h-5 w-5" />, desc: 'aws.amazon.com에서 계정을 생성합니다.', details: [
          '이메일·비밀번호·계정 이름 입력',
          '계정 유형: 개인 / 비즈니스',
          '주소·휴대폰은 영문 표기 (예: 123, Sejong-daero, Jung-gu, Seoul)',
          '휴대폰 SMS 인증 완료',
        ] },
        { no: '02', title: '결제 수단 등록', tag: 'BILLING', icon: <CreditCard className="h-5 w-5" />, desc: '$1 가승인 결제로 카드 유효성 확인.', details: [
          'Visa / Master / Amex 해외결제 가능 카드',
          '한국 카드 대부분 사용 가능 (체크카드도 OK)',
          '$1 결제 후 자동 취소 (2–7일 내)',
          'KRW 청구서 옵션도 있음 (설정 > 결제 기본 설정)',
        ] },
        { no: '03', title: '지원 플랜 선택', tag: 'SUPPORT', icon: <Settings className="h-5 w-5" />, desc: '최초엔 기본(무료) Basic Support로 시작.', details: [
          'Basic: 무료, 계정·청구 문의만',
          'Developer: $29/월~, 기술 문의 가능',
          'Business / Enterprise: 프로덕션 운영 권장',
          '프로덕션 출시 전 Developer 이상으로 업그레이드 추천',
        ] },
        { no: '04', title: '루트 계정 MFA 설정', tag: 'SECURITY', icon: <Shield className="h-5 w-5" />, desc: '루트 계정 탈취를 막기 위한 필수 단계.', details: [
          'IAM 콘솔 > 보안 자격 증명 > MFA 활성화',
          '가상 MFA 디바이스 (Google Authenticator / Authy / 1Password)',
          'QR 코드 스캔 → 6자리 코드 2번 입력',
          '복구 코드를 물리적으로 안전하게 보관',
          'MFA 없이 루트 로그인하는 것은 위험 — 사용 금지',
        ] },
        { no: '05', title: 'IAM 관리자 사용자 생성', tag: 'IAM', icon: <User className="h-5 w-5" />, desc: '일상 작업은 IAM 사용자로 수행합니다.', details: [
          'IAM > 사용자 > 사용자 추가',
          '사용자 이름 (예: admin-$이름)',
          '액세스 방식: AWS Management Console + 프로그래밍 방식(선택)',
          '권한: AdministratorAccess 정책 직접 연결 (또는 그룹에 넣기)',
          '로그인 URL: https://${계정ID}.signin.aws.amazon.com/console',
          '이후 루트 로그인은 금지, IAM 사용자 로그인만 사용',
        ] },
        { no: '06', title: '액세스 키 / 프로그래밍 접근', tag: 'KEYS', icon: <Key className="h-5 w-5" />, desc: 'CLI·SDK 사용 시 액세스 키 발급.', details: [
          'IAM > 사용자 > 보안 자격 증명 > 액세스 키 만들기',
          'Access Key ID + Secret Access Key 발급 (한 번만 표시)',
          'Secret은 절대 Git 커밋 금지 → .env 또는 Secret Manager',
          'aws configure 명령으로 CLI에 저장',
          '주기적으로 순환 (90일마다 권장)',
          'EC2/Lambda는 IAM Role 사용 — 액세스 키 저장 불필요',
        ] },
        { no: '07', title: '예산 알림 설정', tag: 'BUDGET', icon: <Bell className="h-5 w-5" />, desc: '프리티어 졸업 후 과금 폭탄 방지.', details: [
          'Billing > 예산 > 예산 만들기',
          '월 $10·$50·$100 등 단계별 알림',
          '예상 사용량·실제 사용량 각각 이메일 알림',
          'Cost Explorer로 월별 추이 확인',
          '미사용 리소스 주기적으로 정리',
        ] },
        { no: '08', title: '리전 선택 & 기본 서비스 활성화', tag: 'REGION', icon: <Server className="h-5 w-5" />, desc: '리전 단위로 서비스가 분리됩니다.', details: [
          '한국 서비스: ap-northeast-2 (서울) 기본',
          '글로벌: us-east-1(버지니아북부) 기본 — IAM·CloudFront는 여기',
          '리전마다 가격·지연·서비스 제공 여부 다름',
          '리전 간 데이터 전송은 유료',
          '기본 VPC·서브넷 확인 후 보안 그룹 설정',
        ] },
      ]}
      pitfalls={[
        { title: '루트 계정 일상 사용', desc: '루트 계정은 생성·삭제·결제 등 소수 작업만 사용하세요. 탈취 시 모든 것을 잃습니다. 보안 문제 1순위.' },
        { title: '액세스 키 GitHub 노출', desc: 'Public 저장소에 Secret Access Key가 올라가면 봇이 수초 내에 채굴·암호화폐 봇에 악용. 수십만 원 과금 사고 가능.' },
        { title: '프리티어 오해', desc: '"1년 무료"는 일부 상품·사용량 한도 내입니다. EBS 30GB·EC2 t2.micro 750시간 등. 초과분은 즉시 과금.' },
        { title: '리전 오인 설정', desc: '서울이 아닌 us-east-1에 EC2를 띄우면 한국 사용자 응답이 150ms+ 느려집니다. 최초 생성 시 리전 확인 필수.' },
        { title: 'NAT Gateway·EBS 잊힌 리소스', desc: 'NAT Gateway는 시간당 과금, 삭제된 EC2의 EBS는 남아 계속 과금. 월말 Cost Explorer로 점검.' },
      ]}
      resources={[
        { title: 'AWS 가입', desc: '계정 만들기', href: 'https://aws.amazon.com/ko/free/' },
        { title: 'AWS Management Console', desc: '관리 콘솔', href: 'https://console.aws.amazon.com' },
        { title: 'IAM 모범 사례', desc: '권한·MFA·키 관리', href: 'https://docs.aws.amazon.com/ko_kr/IAM/latest/UserGuide/best-practices.html' },
        { title: '예산 가이드', desc: 'Billing Budgets 설정', href: 'https://docs.aws.amazon.com/ko_kr/cost-management/latest/userguide/budgets-managing-costs.html' },
        { title: '프리티어 상세', desc: '무료 사용량 한도', href: 'https://aws.amazon.com/ko/free/' },
        { title: 'AWS CLI 설정', desc: 'aws configure', href: 'https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/cli-configure-quickstart.html' },
      ]}
    />
  )
}
