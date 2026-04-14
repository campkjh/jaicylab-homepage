'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Check, ArrowRight, ChevronDown, Send, AlertCircle, Smartphone, Apple, Globe, Settings, Palette, ShieldCheck, CreditCard, Bell, MessageSquare, Image as ImgIcon, MapPin, Sparkles, CalendarCheck, BarChart3, Lock, Server, Package } from 'lucide-react'
import { toast } from 'sonner'
import { Logo } from '@/components/Logo'

// ───────────────────────────── DATA ─────────────────────────────

type Item = { id: string; label: string; price: number; desc?: string }
type Category = { id: string; title: string; icon: React.ReactNode; tag: string; items: Item[] }

const CATEGORIES: Category[] = [
  {
    id: 'platform', title: '플랫폼 / 기반', tag: 'PLATFORM', icon: <Smartphone className="h-4 w-4" />, items: [
      { id: 'ios', label: 'iOS 네이티브 앱 (Swift / SwiftUI)', price: 800 },
      { id: 'android', label: 'Android 네이티브 앱 (Kotlin / Compose)', price: 800 },
      { id: 'rn', label: '크로스플랫폼 앱 (React Native)', price: 1200 },
      { id: 'flutter', label: '크로스플랫폼 앱 (Flutter)', price: 1200 },
      { id: 'web', label: '반응형 웹 (Next.js 기본 골격)', price: 500 },
      { id: 'pwa', label: 'PWA 오프라인 캐싱', price: 120 },
      { id: 'admin', label: '관리자 어드민 (기본 CRUD)', price: 600 },
      { id: 'landing', label: '랜딩페이지 1페이지', price: 80 },
      { id: 'corp-site', label: '회사 소개 사이트 (3–5페이지)', price: 200 },
      { id: 'tabbar', label: '탭바 네비게이션', price: 25 },
      { id: 'drawer', label: '드로어 메뉴', price: 25 },
      { id: 'onboarding', label: '온보딩 튜토리얼 (3–5스크린)', price: 60 },
      { id: 'splash', label: '스플래시 스크린 + 앱 아이콘 적용', price: 15 },
      { id: 'deeplink', label: '딥링크 / 유니버설 링크', price: 80 },
    ],
  },
  {
    id: 'design', title: '디자인 / UX', tag: 'DESIGN', icon: <Palette className="h-4 w-4" />, items: [
      { id: 'research', label: '경쟁사 / 레퍼런스 조사', price: 40 },
      { id: 'ux-interview', label: 'UX 리서치 / 사용자 인터뷰', price: 150 },
      { id: 'userflow', label: '유저 플로우 설계', price: 50 },
      { id: 'ia', label: '정보 구조(IA) 설계', price: 60 },
      { id: 'wf-small', label: '와이어프레임 (~10화면)', price: 80 },
      { id: 'wf-large', label: '와이어프레임 (~25화면)', price: 180 },
      { id: 'ui-key', label: 'UI 키 스크린 시안 (5화면)', price: 120 },
      { id: 'ui-full', label: 'UI 전체 시안 (~30화면)', price: 400 },
      { id: 'design-system', label: '디자인 시스템 (토큰 + 컴포넌트)', price: 300 },
      { id: 'darkmode', label: '다크모드 지원', price: 60 },
      { id: 'micro', label: '마이크로 인터랙션 / 전환 애니메이션', price: 120 },
      { id: 'lottie', label: 'Lottie 애니메이션 적용', price: 25 },
      { id: 'spline', label: 'Spline 3D 임베드', price: 60 },
      { id: 'threejs', label: 'Three.js 인터랙티브 3D', price: 250 },
      { id: 'a11y', label: '접근성 대응 (WCAG AA)', price: 120 },
      { id: 'responsive', label: '반응형 (모바일/태블릿/데스크탑)', price: 60 },
      { id: 'rtl', label: 'RTL (아랍어 등) 레이아웃', price: 80 },
    ],
  },
  {
    id: 'auth', title: '회원 / 인증', tag: 'AUTH', icon: <ShieldCheck className="h-4 w-4" />, items: [
      { id: 'auth-signup', label: '이메일 회원가입', price: 30 },
      { id: 'auth-login', label: '이메일 로그인', price: 20 },
      { id: 'auth-pwreset', label: '비밀번호 찾기 / 재설정', price: 30 },
      { id: 'auth-emailverify', label: '이메일 인증 (링크)', price: 20 },
      { id: 'auth-remember', label: '자동 로그인 (Remember me)', price: 15 },
      { id: 'auth-kakao', label: '카카오 소셜 로그인', price: 30 },
      { id: 'auth-naver', label: '네이버 소셜 로그인', price: 30 },
      { id: 'auth-google', label: '구글 소셜 로그인', price: 25 },
      { id: 'auth-apple', label: '애플 소셜 로그인', price: 35 },
      { id: 'auth-facebook', label: '페이스북 소셜 로그인', price: 25 },
      { id: 'auth-pass', label: '휴대폰 본인인증 (PASS)', price: 120 },
      { id: 'auth-2fa', label: '2단계 인증 (TOTP)', price: 80 },
      { id: 'auth-bio', label: '생체인증 (Face ID / 지문)', price: 60 },
      { id: 'auth-profile', label: '프로필 편집', price: 30 },
      { id: 'auth-avatar', label: '프로필 이미지 업로드 / 크롭', price: 40 },
      { id: 'auth-withdraw', label: '회원 탈퇴 + 30일 보관', price: 30 },
      { id: 'auth-suspend', label: '계정 정지 / 복구 (관리자)', price: 40 },
      { id: 'auth-rbac', label: '권한·역할 관리 (RBAC)', price: 120 },
      { id: 'auth-invite', label: '초대 코드 / 초대 링크', price: 40 },
    ],
  },
  {
    id: 'pay', title: '결제 / 정산', tag: 'PAYMENT', icon: <CreditCard className="h-4 w-4" />, items: [
      { id: 'pay-toss', label: '토스페이먼츠 PG 연동', price: 120 },
      { id: 'pay-iamport', label: '포트원(아임포트) 연동', price: 100 },
      { id: 'pay-kakao', label: '카카오페이 직연동', price: 80 },
      { id: 'pay-naver', label: '네이버페이 직연동', price: 80 },
      { id: 'pay-card', label: '신용카드 간편결제 (빌링키)', price: 100 },
      { id: 'pay-iap-ios', label: 'iOS 인앱결제 (StoreKit)', price: 150 },
      { id: 'pay-iap-aos', label: 'Android 인앱결제 (Billing)', price: 150 },
      { id: 'pay-subscription', label: '정기결제 / 월 구독 모델', price: 200 },
      { id: 'pay-annual', label: '연간 결제 + 할인', price: 40 },
      { id: 'pay-trial', label: '무료 체험 기간', price: 40 },
      { id: 'pay-refund-form', label: '환불 요청 폼', price: 30 },
      { id: 'pay-refund-auto', label: '환불 처리 자동화 (PG 연동)', price: 120 },
      { id: 'pay-point-earn', label: '포인트 적립 로직', price: 120 },
      { id: 'pay-point-use', label: '포인트 사용 / 차감', price: 60 },
      { id: 'pay-coupon', label: '쿠폰 / 할인코드 발급·사용', price: 100 },
      { id: 'pay-tax-bill', label: '세금계산서 자동발행 (팝빌)', price: 120 },
      { id: 'pay-cash-receipt', label: '현금영수증 발급', price: 80 },
      { id: 'pay-dashboard', label: '매출 대시보드 (일/월/연)', price: 120 },
      { id: 'pay-settle', label: '판매자별 정산 / 이체', price: 180 },
      { id: 'pay-excel', label: '정산 리포트 엑셀 다운', price: 60 },
    ],
  },
  {
    id: 'noti', title: '알림 / 메시징', tag: 'NOTIFICATION', icon: <Bell className="h-4 w-4" />, items: [
      { id: 'noti-fcm', label: '푸시 알림 (FCM) - Android 셋업', price: 60 },
      { id: 'noti-apns', label: '푸시 알림 (APNs) - iOS 셋업', price: 50 },
      { id: 'noti-targeting', label: '푸시 타겟팅 / 예약 발송', price: 80 },
      { id: 'noti-katalk-alert', label: '카카오 알림톡 API 연동', price: 100 },
      { id: 'noti-katalk-friend', label: '카카오 친구톡 연동', price: 80 },
      { id: 'noti-sms', label: 'SMS 발송 (NHN / 알리고)', price: 40 },
      { id: 'noti-lms', label: 'LMS (장문 메시지) 발송', price: 30 },
      { id: 'noti-email', label: '이메일 발송 셋업 (Resend / SES)', price: 30 },
      { id: 'noti-email-tpl', label: 'HTML 이메일 템플릿 제작', price: 50 },
      { id: 'noti-chat-1on1', label: '1:1 실시간 채팅 (Socket.IO)', price: 300 },
      { id: 'noti-chat-group', label: '그룹 채팅방', price: 200 },
      { id: 'noti-chat-media', label: '채팅 이미지 / 파일 전송', price: 70 },
      { id: 'noti-chat-read', label: '채팅 읽음 표시 · 전송 상태', price: 30 },
      { id: 'noti-chat-search', label: '채팅 검색', price: 50 },
      { id: 'noti-notice', label: '공지사항 CRUD', price: 60 },
      { id: 'noti-inapp', label: '인앱 배너 / 토스트', price: 60 },
      { id: 'noti-pref', label: '알림 수신 설정 페이지', price: 40 },
    ],
  },
  {
    id: 'social', title: '커뮤니티 / SNS', tag: 'COMMUNITY', icon: <MessageSquare className="h-4 w-4" />, items: [
      { id: 'soc-board-list', label: '게시판 목록', price: 40 },
      { id: 'soc-board-crud', label: '게시글 작성 · 수정 · 삭제', price: 70 },
      { id: 'soc-board-cat', label: '카테고리별 게시판', price: 40 },
      { id: 'soc-comment', label: '댓글 기능', price: 60 },
      { id: 'soc-reply', label: '대댓글 (1-depth)', price: 50 },
      { id: 'soc-reply-tree', label: '무한 대댓글 트리', price: 100 },
      { id: 'soc-like', label: '좋아요 (게시글 / 댓글)', price: 30 },
      { id: 'soc-bookmark', label: '북마크 / 스크랩', price: 50 },
      { id: 'soc-follow', label: '팔로우 / 팔로워', price: 100 },
      { id: 'soc-hashtag', label: '해시태그 파싱 & 검색', price: 80 },
      { id: 'soc-search', label: '통합 검색 (게시글 / 유저)', price: 100 },
      { id: 'soc-report', label: '신고 기능', price: 40 },
      { id: 'soc-block', label: '유저 차단 / 블락', price: 40 },
      { id: 'soc-filter', label: '금지어 필터링', price: 30 },
      { id: 'soc-feed-time', label: '피드 (시간순)', price: 60 },
      { id: 'soc-feed-follow', label: '피드 (팔로우 기반)', price: 100 },
      { id: 'soc-feed-rank', label: '피드 (랭킹 알고리즘)', price: 250 },
      { id: 'soc-story', label: '스토리 (24시간 자동삭제)', price: 250 },
      { id: 'soc-review', label: '리뷰 작성 (텍스트·사진)', price: 80 },
      { id: 'soc-rating', label: '별점 평점', price: 30 },
      { id: 'soc-dm', label: 'DM (1:1 다이렉트 메시지)', price: 160 },
      { id: 'soc-share', label: '소셜 공유 (카카오 / 라인)', price: 30 },
    ],
  },
  {
    id: 'media', title: '미디어 / 콘텐츠', tag: 'MEDIA', icon: <ImgIcon className="h-4 w-4" />, items: [
      { id: 'med-upload', label: '이미지 업로드 (S3 / R2)', price: 50 },
      { id: 'med-cdn', label: '이미지 CDN 연결', price: 25 },
      { id: 'med-resize', label: '이미지 리사이징 (Sharp)', price: 40 },
      { id: 'med-crop', label: '이미지 크롭 / 회전', price: 35 },
      { id: 'med-thumb', label: '썸네일 자동 생성', price: 30 },
      { id: 'med-exif', label: 'EXIF 데이터 제거 (프라이버시)', price: 20 },
      { id: 'med-video-up', label: '동영상 업로드', price: 70 },
      { id: 'med-video-compress', label: '동영상 서버 압축', price: 100 },
      { id: 'med-hls', label: 'HLS 스트리밍 (MediaConvert)', price: 250 },
      { id: 'med-live', label: '라이브 스트리밍 (RTMP + HLS)', price: 600 },
      { id: 'med-webrtc-1on1', label: 'WebRTC 1:1 영상통화', price: 400 },
      { id: 'med-webrtc-group', label: 'WebRTC 다자 영상통화', price: 900 },
      { id: 'med-filter', label: '이미지 필터 (감성 필터)', price: 120 },
      { id: 'med-audio', label: '음악 / 오디오 플레이어', price: 120 },
      { id: 'med-file', label: '파일 업로드 / 다운로드', price: 40 },
    ],
  },
  {
    id: 'loc', title: '위치 / 지도', tag: 'LOCATION', icon: <MapPin className="h-4 w-4" />, items: [
      { id: 'loc-kakao', label: 'Kakao 지도 임베드', price: 50 },
      { id: 'loc-naver', label: 'Naver 지도 임베드', price: 50 },
      { id: 'loc-google', label: 'Google Maps 임베드', price: 50 },
      { id: 'loc-gps', label: 'GPS 현재 위치 조회', price: 40 },
      { id: 'loc-perm', label: '위치 권한 요청 UX', price: 15 },
      { id: 'loc-track', label: '실시간 위치 추적 (배달앱류)', price: 250 },
      { id: 'loc-route', label: '경로 탐색 (Tmap / Google)', price: 180 },
      { id: 'loc-geofence', label: '지오펜싱 (영역 진입·이탈)', price: 120 },
      { id: 'loc-address', label: '주소 검색 (다음 우편번호)', price: 30 },
      { id: 'loc-reverse', label: '좌표 → 주소 역지오코딩', price: 30 },
      { id: 'loc-cluster', label: '마커 클러스터링', price: 60 },
      { id: 'loc-autocomplete', label: '장소 검색 자동완성', price: 70 },
      { id: 'loc-overlay', label: '지도 커스텀 오버레이', price: 70 },
    ],
  },
  {
    id: 'ai', title: 'AI / 머신러닝', tag: 'AI · ML', icon: <Sparkles className="h-4 w-4" />, items: [
      { id: 'ai-api-basic', label: 'ChatGPT / Claude API 단순 연동', price: 80 },
      { id: 'ai-chatbot', label: 'LLM 챗봇 (컨텍스트 관리)', price: 250 },
      { id: 'ai-rag', label: 'RAG (벡터 DB + 검색)', price: 450 },
      { id: 'ai-sd', label: 'Stable Diffusion 이미지 생성', price: 120 },
      { id: 'ai-dalle', label: 'DALL·E 이미지 생성 API', price: 60 },
      { id: 'ai-upscale', label: '이미지 업스케일 (Real-ESRGAN)', price: 150 },
      { id: 'ai-ocr-clova', label: 'OCR 간단 (네이버 CLOVA)', price: 80 },
      { id: 'ai-ocr-custom', label: 'OCR 고정밀 (커스텀 학습)', price: 250 },
      { id: 'ai-stt', label: 'STT 음성인식 (Whisper)', price: 80 },
      { id: 'ai-tts', label: 'TTS 음성합성 (ElevenLabs)', price: 100 },
      { id: 'ai-translate', label: '번역 API (DeepL / Papago)', price: 40 },
      { id: 'ai-vision', label: '이미지 분류 (Vision API)', price: 100 },
      { id: 'ai-face', label: '얼굴 인식 / 탐지', price: 250 },
      { id: 'ai-reco-rule', label: '추천 시스템 (룰 기반)', price: 120 },
      { id: 'ai-reco-ml', label: '추천 시스템 (ML 모델)', price: 500 },
      { id: 'ai-sentiment', label: '감성 분석', price: 80 },
    ],
  },
  {
    id: 'sched', title: '예약 / 매칭 / 스케줄', tag: 'SCHEDULE', icon: <CalendarCheck className="h-4 w-4" />, items: [
      { id: 'sch-cal', label: '캘린더 UI (월/주/일)', price: 120 },
      { id: 'sch-booking', label: '예약 생성 / 취소', price: 100 },
      { id: 'sch-slot', label: '예약 시간 슬롯 관리', price: 120 },
      { id: 'sch-noshow', label: '노쇼 방지 (선결제 + 수수료)', price: 80 },
      { id: 'sch-match', label: '실시간 매칭 알고리즘', price: 450 },
      { id: 'sch-shift', label: '근무 스케줄 관리', price: 160 },
      { id: 'sch-auto-shift', label: '교대 근무 자동 배정', price: 250 },
      { id: 'sch-qr-gen', label: 'QR 코드 생성', price: 20 },
      { id: 'sch-qr-scan', label: 'QR 코드 스캔', price: 50 },
      { id: 'sch-barcode', label: '바코드 스캔', price: 50 },
      { id: 'sch-attendance', label: '출퇴근 기록 (GPS 기반)', price: 120 },
    ],
  },
  {
    id: 'data', title: '데이터 / 분석', tag: 'ANALYTICS', icon: <BarChart3 className="h-4 w-4" />, items: [
      { id: 'data-kpi', label: '통계 대시보드 (기본 KPI)', price: 160 },
      { id: 'data-charts', label: '차트 시각화 (Recharts 5종)', price: 80 },
      { id: 'data-realtime', label: '실시간 대시보드 (WebSocket)', price: 180 },
      { id: 'data-ga', label: 'GA4 연동', price: 30 },
      { id: 'data-amplitude', label: 'Amplitude 연동', price: 40 },
      { id: 'data-mixpanel', label: 'Mixpanel 연동', price: 40 },
      { id: 'data-event', label: '이벤트 로깅 설계', price: 70 },
      { id: 'data-funnel', label: '퍼널 분석', price: 100 },
      { id: 'data-segment', label: '유저 세그먼트', price: 120 },
      { id: 'data-ab', label: 'A/B 테스트 인프라', price: 250 },
      { id: 'data-excel', label: '엑셀 다운로드 (xlsx)', price: 60 },
      { id: 'data-pdf', label: 'PDF 리포트 생성', price: 120 },
      { id: 'data-scheduled', label: '이메일 리포트 정기 발송', price: 80 },
    ],
  },
  {
    id: 'sec', title: '보안 / 약관 / 컴플라이언스', tag: 'SECURITY', icon: <Lock className="h-4 w-4" />, items: [
      { id: 'sec-privacy', label: '개인정보처리방침 페이지 (템플릿)', price: 10 },
      { id: 'sec-terms', label: '이용약관 페이지 (템플릿)', price: 10 },
      { id: 'sec-privacy-custom', label: '개인정보처리방침 (맞춤 작성)', price: 60 },
      { id: 'sec-terms-custom', label: '이용약관 (맞춤 작성)', price: 60 },
      { id: 'sec-consent', label: '개인정보 수집 동의 모달', price: 15 },
      { id: 'sec-marketing', label: '마케팅 수신 동의', price: 10 },
      { id: 'sec-thirdparty', label: '제3자 제공 동의', price: 10 },
      { id: 'sec-cookie', label: '쿠키 동의 배너 (GDPR)', price: 25 },
      { id: 'sec-youth', label: '청소년 보호정책', price: 10 },
      { id: 'sec-encrypt', label: '데이터 암호화 (DB + 전송)', price: 80 },
      { id: 'sec-audit', label: '접속 로그 / 감사 로그', price: 80 },
      { id: 'sec-2fa', label: '2FA / TOTP 인증', price: 100 },
      { id: 'sec-rate', label: 'IP 차단 / Rate Limit', price: 60 },
      { id: 'sec-captcha', label: 'CAPTCHA (Turnstile / reCAPTCHA)', price: 25 },
      { id: 'sec-ismsp', label: 'ISMS-P 준수 설계', price: 600 },
      { id: 'sec-pia', label: '개인정보 영향평가 대응', price: 400 },
    ],
  },
  {
    id: 'infra', title: '인프라 / 운영', tag: 'INFRA · DEVOPS', icon: <Server className="h-4 w-4" />, items: [
      { id: 'inf-vercel', label: 'Vercel 배포 셋업', price: 20 },
      { id: 'inf-supabase', label: 'Supabase 셋업 + 스키마', price: 60 },
      { id: 'inf-aws', label: 'AWS 서버 구축 (EC2 / ECS)', price: 300 },
      { id: 'inf-gcp', label: 'GCP 서버 구축', price: 300 },
      { id: 'inf-k8s', label: 'Kubernetes 클러스터 구성', price: 500 },
      { id: 'inf-db-rdb', label: 'DB 설계 (PostgreSQL / MySQL)', price: 150 },
      { id: 'inf-db-nosql', label: 'DB 설계 (MongoDB / DynamoDB)', price: 150 },
      { id: 'inf-redis', label: 'Redis 캐싱 셋업', price: 80 },
      { id: 'inf-cdn', label: 'CloudFront / Cloudflare CDN', price: 40 },
      { id: 'inf-s3', label: 'S3 / R2 스토리지 셋업', price: 30 },
      { id: 'inf-domain', label: '도메인 연결 + SSL', price: 15 },
      { id: 'inf-sentry', label: '모니터링 (Sentry) 셋업', price: 40 },
      { id: 'inf-apm', label: 'APM (Datadog / New Relic)', price: 120 },
      { id: 'inf-log', label: '로그 수집 (CloudWatch / Logtail)', price: 70 },
      { id: 'inf-cicd', label: 'CI/CD (GitHub Actions) 파이프라인', price: 120 },
      { id: 'inf-backup', label: '백업 자동화', price: 60 },
      { id: 'inf-staging', label: '스테이징 환경 구성', price: 80 },
    ],
  },
  {
    id: 'extra', title: '부가 서비스 / 스토어', tag: 'EXTRA', icon: <Package className="h-4 w-4" />, items: [
      { id: 'ext-i18n-setup', label: 'i18n 프레임워크 셋업', price: 60 },
      { id: 'ext-lang-en', label: '영어 번역 적용', price: 80 },
      { id: 'ext-lang-jp', label: '일본어 번역 적용', price: 100 },
      { id: 'ext-lang-cn', label: '중국어 번역 적용', price: 100 },
      { id: 'ext-appstore', label: '앱스토어 등록 대행 (Apple)', price: 70 },
      { id: 'ext-playstore', label: '플레이스토어 등록 대행 (Google)', price: 50 },
      { id: 'ext-reject', label: '앱 심사 Rejection 대응', price: 50 },
      { id: 'ext-screenshot', label: '스토어 스크린샷 제작 (6장)', price: 50 },
      { id: 'ext-icon', label: '앱 아이콘 디자인', price: 40 },
      { id: 'ext-seo-basic', label: 'SEO 기본 (메타 / OG / sitemap)', price: 40 },
      { id: 'ext-seo-pro', label: 'SEO 고도화 (구조화 데이터 / 속도)', price: 100 },
      { id: 'ext-user-manual', label: '사용자 매뉴얼 작성', price: 80 },
      { id: 'ext-admin-manual', label: '관리자 매뉴얼 작성', price: 60 },
      { id: 'ext-faq', label: 'FAQ 페이지', price: 25 },
      { id: 'ext-cs', label: '고객센터 1:1 문의 채널', price: 70 },
      { id: 'ext-maintenance-1m', label: '출시 후 1개월 무상 유지보수', price: 200 },
      { id: 'ext-maintenance-3m', label: '출시 후 3개월 유지보수 계약', price: 550 },
    ],
  },
]

// 디자인/일정 보정
const DESIGNS = [
  { id: 'template', label: '템플릿 기반', mult: 1.0 },
  { id: 'custom', label: '커스텀 디자인', mult: 1.25 },
  { id: 'premium', label: '프리미엄', mult: 1.5 },
]
const TIMELINES = [
  { id: 'normal', label: '일반 (3 – 6개월)', mult: 1.0 },
  { id: 'fast', label: '단축 (2개월 이내)', mult: 1.2 },
  { id: 'urgent', label: '긴급 (1개월 이내)', mult: 1.4 },
]

const MM_RATE = 600 // 만원 / man-month (혼합 인력 평균: 주니어~중급 기준)

// 카테고리 → 어떤 역할이 투입되는지
const ROLE_BY_CAT: Record<string, string[]> = {
  platform: ['pm', 'designer'],
  design: ['designer', 'pm'],
  auth: ['backend', 'mobile'],
  pay: ['backend', 'mobile'],
  noti: ['backend', 'mobile'],
  social: ['backend', 'mobile', 'frontend'],
  media: ['backend', 'mobile', 'devops'],
  loc: ['mobile', 'backend'],
  ai: ['ai', 'backend'],
  sched: ['backend', 'mobile'],
  data: ['frontend', 'backend'],
  sec: ['backend', 'devops'],
  infra: ['devops', 'backend'],
  extra: ['pm', 'frontend'],
}

const ROLE_LABEL: Record<string, string> = {
  pm: '프로젝트 매니저 (PM)',
  designer: '프로덕트 디자이너',
  mobile: '모바일 개발자',
  frontend: '프론트엔드 개발자',
  backend: '백엔드 개발자',
  ai: 'AI / ML 엔지니어',
  devops: '데브옵스 엔지니어',
}

function fmt(manwon: number) {
  if (manwon >= 10000) return `${(manwon / 10000).toFixed(2)}억 ${(manwon % 10000).toLocaleString()}만`
  return `${Math.round(manwon).toLocaleString()}만`
}

// ───────────────────────────── PAGE ─────────────────────────────

export default function EstimatePage() {
  const [selected, setSelected] = useState<Set<string>>(new Set(['rn', 'admin', 'splash', 'tabbar', 'ui-key', 'design-system', 'auth-signup', 'auth-login', 'auth-kakao', 'auth-pwreset', 'auth-profile', 'noti-fcm', 'noti-apns', 'sec-privacy', 'sec-terms', 'inf-vercel', 'inf-supabase', 'inf-domain']))
  const [open, setOpen] = useState<Set<string>>(new Set(CATEGORIES.map(c => c.id)))
  const [design, setDesign] = useState('custom')
  const [timeline, setTimeline] = useState('normal')
  const [contact, setContact] = useState({ company: '', name: '', phone: '', email: '', memo: '' })
  const [sending, setSending] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const h = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  function toggle(id: string) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function toggleCat(catId: string) {
    setOpen(prev => { const n = new Set(prev); n.has(catId) ? n.delete(catId) : n.add(catId); return n })
  }
  function selectAllInCat(catId: string) {
    const cat = CATEGORIES.find(c => c.id === catId)!
    setSelected(prev => { const n = new Set(prev); cat.items.forEach(i => n.add(i.id)); return n })
  }
  function clearCat(catId: string) {
    const cat = CATEGORIES.find(c => c.id === catId)!
    setSelected(prev => { const n = new Set(prev); cat.items.forEach(i => n.delete(i.id)); return n })
  }

  const calc = useMemo(() => {
    // 선택 항목별 합계 + 카테고리별 사용량
    let baseSum = 0
    const catSum: Record<string, number> = {}
    CATEGORIES.forEach(cat => {
      let s = 0
      cat.items.forEach(it => {
        if (selected.has(it.id)) s += it.price
      })
      if (s > 0) catSum[cat.id] = s
      baseSum += s
    })

    const designMult = DESIGNS.find(d => d.id === design)?.mult ?? 1
    const timeMult = TIMELINES.find(t => t.id === timeline)?.mult ?? 1
    const designAdd = baseSum * (designMult - 1)
    const afterDesign = baseSum + designAdd
    const timeAdd = afterDesign * (timeMult - 1)
    const subtotal = Math.round(afterDesign + timeAdd)
    const vat = Math.round(subtotal * 0.1)
    const total = subtotal + vat
    const totalMM = subtotal / MM_RATE

    // 역할 가중치 계산: 카테고리별 cost 비중을 역할에 분배
    const roleWeight: Record<string, number> = {}
    Object.entries(catSum).forEach(([catId, s]) => {
      const roles = ROLE_BY_CAT[catId] || []
      const share = s / roles.length
      roles.forEach(r => { roleWeight[r] = (roleWeight[r] || 0) + share })
    })
    // PM은 모든 프로젝트에 기본 투입
    if (baseSum > 0) roleWeight.pm = (roleWeight.pm || 0) + baseSum * 0.15
    // 디자이너는 design 보정만큼 추가 비중
    if (baseSum > 0) roleWeight.designer = (roleWeight.designer || 0) + baseSum * 0.15

    const wSum = Object.values(roleWeight).reduce((a, b) => a + b, 0) || 1
    const teamMM: Record<string, number> = {}
    Object.entries(roleWeight).forEach(([r, w]) => { teamMM[r] = (w / wSum) * totalMM })
    const team = Object.entries(teamMM)
      .filter(([, mm]) => mm >= 0.05)
      .sort(([, a], [, b]) => b - a)
      .map(([role, mm]) => ({ role, mm }))

    // 예상 기간(개월): 평균 3.5명 동시 투입 가정
    const parallel = Math.max(2.5, Math.min(6, team.length * 0.7))
    const calMonths = totalMM / parallel
    const tMult = TIMELINES.find(t => t.id === timeline)?.mult ?? 1
    const calAdjusted = calMonths / (tMult > 1 ? tMult * 0.9 : 1)

    return { baseSum, designAdd, timeAdd, subtotal, vat, total, totalMM, team, calMonths: calAdjusted, designMult, timeMult }
  }, [selected, design, timeline])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!contact.name || !contact.phone) { toast.error('담당자명과 연락처를 입력해주세요'); return }
    if (selected.size === 0) { toast.error('견적 항목을 1개 이상 선택해주세요'); return }
    setSending(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('견적서 요청이 접수되었습니다. 영업일 기준 1일 내 회신드릴게요.')
    setContact({ company: '', name: '', phone: '', email: '', memo: '' })
    setSending(false)
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-black/60 backdrop-blur-2xl border-b border-white/5' : 'bg-transparent'}`}>
        <div className="mx-auto flex h-[60px] max-w-[1280px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <Logo height={22} className="text-white" />
            <span className="text-[12px] font-normal text-white/30">제이씨랩</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/about" className="text-[13px] font-medium text-white/40 transition-all hover:text-white">회사소개</Link>
            <Link href="/estimate" className="text-[13px] font-medium text-white transition-all">자가견적</Link>
            <Link href="/about#문의" className="text-[13px] font-medium text-white/40 transition-all hover:text-white">문의</Link>
          </nav>
          <Link href="/about#문의" className="bg-white px-5 py-2 text-[13px] font-bold text-black transition-all hover:bg-white/90 active:scale-95">프로젝트 의뢰</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-white/5 pt-[110px] pb-12">
        <div className="mx-auto max-w-[1280px] px-6">
          <p className="text-[11px] font-bold tracking-[0.4em] text-[#2979FF]">SELF ESTIMATE</p>
          <h1 className="mt-3 text-[36px] font-black leading-[1.1] tracking-tight md:text-[48px]">
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">상세 항목별 자가견적</span>
          </h1>
          <p className="mt-4 max-w-[600px] text-[14px] leading-relaxed text-white/40">
            14개 카테고리 · 170여 개 세부 항목에서 필요한 것만 체크하세요. 예상 견적, 부가세, 투입 인력, 맨먼스, 작업 기간이 실시간으로 계산됩니다. 가격은 기능 단위 실 공수 기준입니다.
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="py-12">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-6 lg:grid-cols-[1fr_400px]">

          {/* LEFT — checklist */}
          <div className="space-y-4">

            {/* 디자인/일정 토글 */}
            <div className="border border-white/8 bg-white/[0.02] p-5">
              <p className="text-[11px] font-bold tracking-[0.3em] text-white/40">PROJECT CONDITION</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] text-white/40 mb-2">디자인 수준</p>
                  <div className="flex gap-2">
                    {DESIGNS.map(d => (
                      <button key={d.id} type="button" onClick={() => setDesign(d.id)}
                        className={`flex-1 border px-3 py-2 text-[12px] font-bold transition-all ${design === d.id ? 'border-[#2979FF] bg-[#2979FF]/10 text-white' : 'border-white/8 text-white/40 hover:border-white/20'}`}>
                        {d.label}
                        <span className="ml-1 text-[10px] text-[#2979FF]">×{d.mult.toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-white/40 mb-2">일정</p>
                  <div className="flex gap-2">
                    {TIMELINES.map(t => (
                      <button key={t.id} type="button" onClick={() => setTimeline(t.id)}
                        className={`flex-1 border px-3 py-2 text-[12px] font-bold transition-all ${timeline === t.id ? 'border-[#2979FF] bg-[#2979FF]/10 text-white' : 'border-white/8 text-white/40 hover:border-white/20'}`}>
                        {t.label}
                        <span className="ml-1 text-[10px] text-[#2979FF]">×{t.mult.toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 카테고리별 리스트 */}
            {CATEGORIES.map(cat => {
              const isOpen = open.has(cat.id)
              const selCount = cat.items.filter(i => selected.has(i.id)).length
              const catTotal = cat.items.filter(i => selected.has(i.id)).reduce((a, b) => a + b.price, 0)
              return (
                <div key={cat.id} className="border border-white/8 bg-white/[0.02]">
                  <div className="flex items-center justify-between px-5 py-4">
                    <button type="button" onClick={() => toggleCat(cat.id)} className="flex flex-1 items-center gap-3 text-left">
                      <div className="flex h-9 w-9 items-center justify-center bg-[#2979FF]/10 text-[#2979FF]">{cat.icon}</div>
                      <div>
                        <p className="text-[11px] tracking-[0.25em] text-white/30">{cat.tag}</p>
                        <p className="text-[15px] font-black">{cat.title}</p>
                      </div>
                    </button>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-white/30">{selCount}/{cat.items.length}</span>
                      {catTotal > 0 && <span className="text-[12px] font-bold text-[#2979FF]">+{catTotal.toLocaleString()}만</span>}
                      <button type="button" onClick={() => toggleCat(cat.id)} className="text-white/30 hover:text-white">
                        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="border-t border-white/5">
                      <div className="flex items-center justify-end gap-3 px-5 py-2 text-[10px] text-white/30">
                        <button type="button" onClick={() => selectAllInCat(cat.id)} className="hover:text-white/60">전체 선택</button>
                        <span className="text-white/10">|</span>
                        <button type="button" onClick={() => clearCat(cat.id)} className="hover:text-white/60">전체 해제</button>
                      </div>
                      <ul>
                        {cat.items.map(item => {
                          const active = selected.has(item.id)
                          return (
                            <li key={item.id}>
                              <button type="button" onClick={() => toggle(item.id)}
                                className={`flex w-full items-center gap-3 border-t border-white/5 px-5 py-3 text-left transition-all ${active ? 'bg-[#2979FF]/[0.06]' : 'hover:bg-white/[0.02]'}`}>
                                <div className={`flex h-4 w-4 shrink-0 items-center justify-center border ${active ? 'border-[#2979FF] bg-[#2979FF]' : 'border-white/20'}`}>
                                  {active && <Check className="h-3 w-3 text-white" />}
                                </div>
                                <span className={`flex-1 text-[13px] ${active ? 'text-white' : 'text-white/50'}`}>{item.label}</span>
                                <span className={`text-[12px] tracking-wider ${active ? 'text-[#2979FF]' : 'text-white/25'}`}>+{item.price.toLocaleString()}만</span>
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })}

            {/* 견적서 요청 */}
            <div className="mt-12 border border-white/10 bg-white/[0.03] p-7">
              <p className="text-[11px] font-bold tracking-[0.3em] text-[#2979FF]">REQUEST QUOTATION</p>
              <h2 className="mt-2 text-[22px] font-black">상세 견적서 요청</h2>
              <p className="mt-2 text-[13px] text-white/40">현재 선택 내용을 기반으로 담당 PM이 영업일 기준 1일 내 정식 견적서와 일정 제안을 드립니다.</p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input className="h-12 w-full border border-white/8 bg-white/[0.03] px-4 text-[14px] text-white outline-none transition-all placeholder-white/20 focus:border-[#2979FF]" placeholder="회사명 / 소속" value={contact.company} onChange={e => setContact({ ...contact, company: e.target.value })} />
                  <input className="h-12 w-full border border-white/8 bg-white/[0.03] px-4 text-[14px] text-white outline-none transition-all placeholder-white/20 focus:border-[#2979FF]" placeholder="담당자명 *" value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })} required />
                  <input className="h-12 w-full border border-white/8 bg-white/[0.03] px-4 text-[14px] text-white outline-none transition-all placeholder-white/20 focus:border-[#2979FF]" placeholder="연락처 *" value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} required />
                  <input className="h-12 w-full border border-white/8 bg-white/[0.03] px-4 text-[14px] text-white outline-none transition-all placeholder-white/20 focus:border-[#2979FF]" placeholder="이메일" type="email" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} />
                </div>
                <textarea className="h-28 w-full resize-none border border-white/8 bg-white/[0.03] px-4 py-3 text-[14px] text-white outline-none transition-all placeholder-white/20 focus:border-[#2979FF]" placeholder="추가 전달사항 (참고 서비스, 예상 사용자 수, 특별 요구사항 등)" value={contact.memo} onChange={e => setContact({ ...contact, memo: e.target.value })} />
                <button type="submit" disabled={sending} className="flex w-full items-center justify-center gap-2 bg-white py-3.5 text-[15px] font-bold text-black transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-50">
                  <Send className="h-4 w-4" /> {sending ? '전송 중...' : '상세 견적서 받기'}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT — sticky summary */}
          <aside>
            <div className="sticky top-[80px] space-y-4">
              {/* 견적 금액 */}
              <div className="border border-[#2979FF]/30 bg-gradient-to-b from-[#2979FF]/10 to-transparent p-6">
                <p className="text-[11px] font-bold tracking-[0.3em] text-[#2979FF]">TOTAL ESTIMATE</p>
                <p className="mt-3 text-[11px] text-white/40">총 금액 (VAT 포함)</p>
                <p className="mt-1 text-[34px] font-black leading-tight">
                  <span className="bg-gradient-to-r from-white to-[#82b1ff] bg-clip-text text-transparent">{fmt(calc.total)}</span>
                  <span className="ml-1 text-[14px] text-white/40">원</span>
                </p>

                <div className="mt-5 space-y-1.5 border-t border-white/10 pt-4 text-[12px]">
                  <div className="flex justify-between text-white/50"><span>항목 합계</span><span className="text-white/80">{calc.baseSum.toLocaleString()}만</span></div>
                  {calc.designAdd > 0 && (
                    <div className="flex justify-between text-white/50"><span>디자인 보정 (×{calc.designMult.toFixed(2)})</span><span className="text-white/80">+{Math.round(calc.designAdd).toLocaleString()}만</span></div>
                  )}
                  {calc.timeAdd > 0 && (
                    <div className="flex justify-between text-white/50"><span>일정 보정 (×{calc.timeMult.toFixed(2)})</span><span className="text-white/80">+{Math.round(calc.timeAdd).toLocaleString()}만</span></div>
                  )}
                  <div className="flex justify-between border-t border-white/5 pt-2 text-white"><span className="font-bold">소계 (공급가)</span><span className="font-black">{calc.subtotal.toLocaleString()}만</span></div>
                  <div className="flex justify-between text-white/50"><span>부가세 (10%)</span><span className="text-white/80">{calc.vat.toLocaleString()}만</span></div>
                  <div className="flex justify-between border-t border-white/10 pt-2 text-[13px] text-white"><span className="font-bold">합계</span><span className="font-black text-[#82b1ff]">{(calc.subtotal + calc.vat).toLocaleString()}만</span></div>
                </div>
              </div>

              {/* 투입 인력 / 맨먼스 */}
              <div className="border border-white/8 bg-white/[0.02] p-6">
                <p className="text-[11px] font-bold tracking-[0.3em] text-white/40">TEAM ALLOCATION</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] text-white/40">총 맨먼스</p>
                    <p className="mt-1 text-[22px] font-black"><span className="text-[#82b1ff]">{calc.totalMM.toFixed(1)}</span> <span className="text-[12px] text-white/40">MM</span></p>
                  </div>
                  <div>
                    <p className="text-[11px] text-white/40">예상 기간</p>
                    <p className="mt-1 text-[22px] font-black"><span className="text-[#82b1ff]">{Math.max(0.5, calc.calMonths).toFixed(1)}</span> <span className="text-[12px] text-white/40">개월</span></p>
                  </div>
                </div>

                {calc.team.length > 0 ? (
                  <ul className="mt-5 space-y-2 border-t border-white/5 pt-4">
                    {calc.team.map(({ role, mm }) => (
                      <li key={role} className="flex items-center justify-between text-[12px]">
                        <span className="text-white/60">{ROLE_LABEL[role] || role}</span>
                        <span className="font-mono text-white/80">{mm.toFixed(1)} MM</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-5 flex items-start gap-2 border border-amber-500/30 bg-amber-500/5 p-3 text-[12px] text-amber-400/80">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>좌측에서 항목을 선택해주세요.</span>
                  </div>
                )}

                <p className="mt-4 text-[10px] leading-relaxed text-white/30">맨먼스 단가 평균 {MM_RATE.toLocaleString()}만원 (혼합 인력 기준) 적용. 시니어 비중에 따라 변동될 수 있습니다.</p>
              </div>

              {/* CTA */}
              <div className="space-y-2">
                <button type="button" onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="flex w-full items-center justify-center gap-2 bg-[#2979FF] py-3 text-[13px] font-bold text-white transition-all hover:bg-[#1E6AE1]">
                  상세 견적서 받기 <ArrowRight className="h-4 w-4" />
                </button>
                <Link href="/about#문의" className="flex w-full items-center justify-center border border-white/15 py-3 text-[13px] font-bold text-white/60 transition-all hover:bg-white/5 hover:text-white">
                  직접 상담 요청
                </Link>
              </div>

              <p className="text-[10px] leading-relaxed text-white/25">
                본 견적은 자동 계산된 참고 금액이며 실제 계약 금액과 다를 수 있습니다. 정확한 견적은 기능 명세서 기반의 상세 상담 후 확정됩니다.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Logo height={20} className="text-white" />
                <span className="text-[13px] text-white/30">제이씨랩</span>
              </div>
              <p className="mt-2 text-[11px] text-white/15">App Development Studio · contact@jaicylab.com</p>
              <p className="text-[10px] text-white/10">Copyright &copy; JAICYLAB. All rights reserved.</p>
            </div>
            <div className="flex gap-4 text-[12px] text-white/25">
              <Link href="/" className="transition-colors hover:text-white/50">홈</Link>
              <Link href="/about" className="transition-colors hover:text-white/50">회사소개</Link>
              <Link href="/about#문의" className="transition-colors hover:text-white/50">문의</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
