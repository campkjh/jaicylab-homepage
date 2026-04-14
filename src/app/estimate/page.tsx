'use client'

import { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react'
import Link from 'next/link'
import {
  Check, ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Send, AlertCircle, Search, X,
  Smartphone, Palette, ShieldCheck, CreditCard, Bell, MessageSquare, Image as ImgIcon, MapPin,
  Sparkles, CalendarCheck, BarChart3, Lock, Server, Package as PackageIcon, Wand2, ShoppingBag,
  Trophy, Briefcase, Home, Users2, UtensilsCrossed, BookOpen, Heart,
  User, Scale, Building2, Calendar, Building, Calculator, HardHat,
  Shirt, ShoppingCart, Leaf, Gem, Repeat, Factory, Gavel, TrendingUp,
  Receipt, Coffee, ChefHat, Utensils, Soup, Baby, Languages, Terminal, GraduationCap, Award,
  Dumbbell, Brain, Apple, Dog, Stethoscope, PartyPopper, Church,
  CheckSquare, NotebookPen, Users, Kanban, FileText, MessageCircle,
  SprayCan, Truck, Wrench, Plane,
} from 'lucide-react'
import { toast } from 'sonner'
import { Logo } from '@/components/Logo'
import { PACKAGES, PACKAGE_CATEGORIES, PACKAGE_EXAMPLES, TIER_ORDER, TIER_META, type TierId, type Pkg } from '@/data/packages'

// ───────────────────────────── DATA ─────────────────────────────

type Item = { id: string; label: string; price: number }
type Category = { id: string; title: string; icon: React.ReactNode; tag: string; items: Item[] }

const CATEGORIES: Category[] = [
  {
    id: 'platform', title: '플랫폼 / 기반', tag: 'PLATFORM', icon: <Smartphone className="h-4 w-4" />, items: [
      { id: 'pf-ios', label: 'iOS 네이티브 앱 (Swift / SwiftUI)', price: 680 },
      { id: 'pf-android', label: 'Android 네이티브 앱 (Kotlin / Compose)', price: 680 },
      { id: 'pf-rn', label: '크로스플랫폼 앱 (React Native)', price: 1020 },
      { id: 'pf-flutter', label: '크로스플랫폼 앱 (Flutter)', price: 1020 },
      { id: 'pf-web', label: '반응형 웹 (Next.js 기본 골격)', price: 425 },
      { id: 'pf-pwa', label: 'PWA 오프라인 캐싱', price: 100 },
      { id: 'pf-admin', label: '관리자 어드민 (기본 CRUD)', price: 510 },
      { id: 'pf-landing', label: '랜딩페이지 1페이지', price: 70 },
      { id: 'pf-corp-site', label: '회사 소개 사이트 (3–5페이지)', price: 170 },
      { id: 'pf-watch', label: 'WatchOS / WearOS 컴패니언', price: 340 },
      { id: 'pf-tv', label: 'tvOS / Android TV 앱', price: 510 },
      { id: 'pf-desktop', label: '데스크탑 앱 (Electron / Tauri)', price: 595 },
      { id: 'pf-tabbar', label: '탭바 네비게이션', price: 20 },
      { id: 'pf-drawer', label: '드로어 메뉴', price: 20 },
      { id: 'pf-onboarding', label: '온보딩 튜토리얼 (3–5스크린)', price: 50 },
      { id: 'pf-splash', label: '스플래시 + 앱 아이콘 적용', price: 15 },
      { id: 'pf-deeplink', label: '딥링크 / 유니버설 링크', price: 70 },
      { id: 'pf-appshortcut', label: '앱 단축어 (3D Touch / 위젯 진입)', price: 35 },
      { id: 'pf-widget-ios', label: 'iOS 위젯 (홈 / 잠금화면)', price: 170 },
      { id: 'pf-widget-android', label: 'Android 홈 위젯', price: 155 },
    ],
  },
  {
    id: 'design', title: '디자인 / UX', tag: 'DESIGN', icon: <Palette className="h-4 w-4" />, items: [
      { id: 'ds-research', label: '경쟁사 / 레퍼런스 조사', price: 35 },
      { id: 'ds-interview', label: 'UX 리서치 / 사용자 인터뷰', price: 130 },
      { id: 'ds-userflow', label: '유저 플로우 설계', price: 45 },
      { id: 'ds-ia', label: '정보 구조(IA) 설계', price: 50 },
      { id: 'ds-wf-s', label: '와이어프레임 (~10화면)', price: 70 },
      { id: 'ds-wf-m', label: '와이어프레임 (~25화면)', price: 155 },
      { id: 'ds-wf-l', label: '와이어프레임 (~50화면)', price: 270 },
      { id: 'ds-ui-key', label: 'UI 키 스크린 시안 (5화면)', price: 100 },
      { id: 'ds-ui-mid', label: 'UI 시안 (~15화면)', price: 240 },
      { id: 'ds-ui-full', label: 'UI 전체 시안 (~30화면)', price: 340 },
      { id: 'ds-ui-xl', label: 'UI 전체 시안 (~60화면)', price: 595 },
      { id: 'ds-system', label: '디자인 시스템 (토큰 + 컴포넌트)', price: 255 },
      { id: 'ds-figma', label: 'Figma 컴포넌트 라이브러리 정리', price: 85 },
      { id: 'ds-darkmode', label: '다크모드 지원', price: 50 },
      { id: 'ds-themes', label: '다중 테마 / 컬러 커스터마이즈', price: 100 },
      { id: 'ds-a11y', label: '접근성 대응 (WCAG AA)', price: 100 },
      { id: 'ds-a11y-aaa', label: '접근성 강화 (스크린리더 최적화)', price: 170 },
      { id: 'ds-responsive', label: '반응형 (모바일/태블릿/데스크탑)', price: 50 },
      { id: 'ds-rtl', label: 'RTL (아랍어 등) 레이아웃', price: 70 },
      { id: 'ds-illustration', label: '일러스트 / 캐릭터 디자인 (10종)', price: 170 },
      { id: 'ds-motion-spec', label: '모션 가이드라인 문서화', price: 70 },
    ],
  },
  {
    id: 'anim', title: '인터랙션 / 애니메이션', tag: 'INTERACTION', icon: <Wand2 className="h-4 w-4" />, items: [
      { id: 'an-page', label: '페이지 전환 애니메이션', price: 35 },
      { id: 'an-shared', label: 'Shared Element 전환', price: 70 },
      { id: 'an-tap', label: '버튼 탭 피드백 (스케일/리플)', price: 15 },
      { id: 'an-haptic', label: '햅틱 피드백', price: 20 },
      { id: 'an-sound', label: '사운드 이펙트', price: 25 },
      { id: 'an-pull', label: '풀 투 리프레시 (커스텀)', price: 30 },
      { id: 'an-swipe', label: '스와이프 액션 (삭제 / 답장)', price: 40 },
      { id: 'an-parallax', label: '스크롤 패럴랙스', price: 50 },
      { id: 'an-scroll-reveal', label: '스크롤 등장 애니메이션 (Reveal)', price: 40 },
      { id: 'an-hero', label: '히어로 섹션 모션', price: 70 },
      { id: 'an-stagger', label: 'Stagger 리스트 등장', price: 35 },
      { id: 'an-spinner', label: '커스텀 로딩 스피너', price: 20 },
      { id: 'an-skeleton', label: '스켈레톤 UI', price: 35 },
      { id: 'an-progress', label: '프로그레스 바 / 링 애니메이션', price: 30 },
      { id: 'an-tooltip', label: '툴팁 / 팝오버 애니메이션', price: 25 },
      { id: 'an-drag-stack', label: 'Draggable 카드 스택', price: 100 },
      { id: 'an-tinder', label: '스와이프 카드 (Tinder식)', price: 170 },
      { id: 'an-particle', label: '파티클 이펙트', price: 70 },
      { id: 'an-confetti', label: '컨페티 / 축하 애니메이션', price: 25 },
      { id: 'an-modal', label: '모달 / 바텀시트 슬라이드', price: 35 },
      { id: 'an-tab-indicator', label: '탭 인디케이터 슬라이드', price: 25 },
      { id: 'an-count', label: '숫자 카운트업 애니메이션', price: 20 },
      { id: 'an-typing', label: '타이핑 애니메이션', price: 20 },
      { id: 'an-fab', label: 'FAB 확장 (Speed Dial)', price: 35 },
      { id: 'an-toggle', label: '체크박스 / 토글 모션', price: 20 },
      { id: 'an-check', label: '체크박스 체크 애니메이션', price: 15 },
      { id: 'an-like', label: '좋아요 하트 파티클', price: 30 },
      { id: 'an-snap', label: '스크롤 스냅 캐러셀', price: 40 },
      { id: 'an-blur', label: '글래스모피즘 / 블러 효과', price: 25 },
      { id: 'an-cursor', label: '커스텀 커서 (웹)', price: 35 },
      { id: 'an-3d-tilt', label: '3D 틸트 / 마우스 추적', price: 50 },
      { id: 'an-spline', label: 'Spline 3D 임베드', price: 50 },
    ],
  },
  {
    id: 'auth', title: '회원 / 인증', tag: 'AUTH', icon: <ShieldCheck className="h-4 w-4" />, items: [
      { id: 'au-signup', label: '이메일 회원가입', price: 25 },
      { id: 'au-login', label: '이메일 로그인', price: 15 },
      { id: 'au-pwreset', label: '비밀번호 찾기 / 재설정', price: 25 },
      { id: 'au-emailverify', label: '이메일 인증 (링크)', price: 15 },
      { id: 'au-remember', label: '자동 로그인', price: 10 },
      { id: 'au-kakao', label: '카카오 소셜 로그인', price: 25 },
      { id: 'au-naver', label: '네이버 소셜 로그인', price: 25 },
      { id: 'au-google', label: '구글 소셜 로그인', price: 20 },
      { id: 'au-apple', label: '애플 소셜 로그인', price: 30 },
      { id: 'au-facebook', label: '페이스북 소셜 로그인', price: 20 },
      { id: 'au-line', label: '라인 소셜 로그인', price: 25 },
      { id: 'au-twitter', label: 'X (트위터) 소셜 로그인', price: 25 },
      { id: 'au-pass', label: '휴대폰 본인인증 (PASS)', price: 100 },
      { id: 'au-2fa', label: '2단계 인증 (TOTP)', price: 70 },
      { id: 'au-bio', label: '생체인증 (Face ID / 지문)', price: 50 },
      { id: 'au-passkey', label: '패스키 (WebAuthn)', price: 130 },
      { id: 'au-magic', label: '매직 링크 로그인', price: 40 },
      { id: 'au-sso', label: 'SSO (SAML / OIDC)', price: 210 },
      { id: 'au-profile', label: '프로필 편집', price: 25 },
      { id: 'au-avatar', label: '프로필 이미지 업로드 / 크롭', price: 35 },
      { id: 'au-nickname', label: '닉네임 중복 체크', price: 15 },
      { id: 'au-withdraw', label: '회원 탈퇴 + 30일 보관', price: 25 },
      { id: 'au-suspend', label: '계정 정지 / 복구 (관리자)', price: 35 },
      { id: 'au-rbac', label: '권한·역할 관리 (RBAC)', price: 100 },
      { id: 'au-team', label: '팀 / 워크스페이스 멤버 초대', price: 130 },
      { id: 'au-invite', label: '초대 코드 / 초대 링크', price: 35 },
      { id: 'au-session', label: '세션 관리 / 강제 로그아웃', price: 50 },
      { id: 'au-device', label: '디바이스 관리 (동시 로그인 제한)', price: 70 },
    ],
  },
  {
    id: 'pay', title: '결제 / 정산', tag: 'PAYMENT', icon: <CreditCard className="h-4 w-4" />, items: [
      { id: 'py-toss', label: '토스페이먼츠 PG 연동', price: 100 },
      { id: 'py-iamport', label: '포트원(아임포트) 연동', price: 85 },
      { id: 'py-kakaopay', label: '카카오페이 직연동', price: 70 },
      { id: 'py-naverpay', label: '네이버페이 직연동', price: 70 },
      { id: 'py-applepay', label: 'Apple Pay 연동', price: 70 },
      { id: 'py-samsungpay', label: '삼성페이 연동', price: 70 },
      { id: 'py-card', label: '신용카드 간편결제 (빌링키)', price: 85 },
      { id: 'py-account', label: '실시간 계좌이체', price: 70 },
      { id: 'py-virtualacc', label: '가상계좌 발급', price: 85 },
      { id: 'py-stripe', label: 'Stripe (해외결제)', price: 170 },
      { id: 'py-paypal', label: 'PayPal 연동', price: 130 },
      { id: 'py-iap-ios', label: 'iOS 인앱결제 (StoreKit)', price: 130 },
      { id: 'py-iap-aos', label: 'Android 인앱결제 (Billing)', price: 130 },
      { id: 'py-subscription', label: '정기결제 / 월 구독 모델', price: 170 },
      { id: 'py-installment', label: '카드 할부 / 분할결제', price: 60 },
      { id: 'py-annual', label: '연간 결제 + 할인', price: 35 },
      { id: 'py-trial', label: '무료 체험 기간', price: 35 },
      { id: 'py-refund-form', label: '환불 요청 폼', price: 25 },
      { id: 'py-refund-auto', label: '환불 처리 자동화 (PG 연동)', price: 100 },
      { id: 'py-escrow', label: '에스크로 결제', price: 170 },
      { id: 'py-prepaid', label: '선불 충전금', price: 130 },
      { id: 'py-corp', label: '법인 결제 (세금계산서 자동)', price: 155 },
      { id: 'py-point-earn', label: '포인트 적립 로직', price: 100 },
      { id: 'py-point-use', label: '포인트 사용 / 차감', price: 50 },
      { id: 'py-coupon', label: '쿠폰 / 할인코드 발급·사용', price: 85 },
      { id: 'py-coupon-target', label: '쿠폰 타겟팅 (등급/상품)', price: 70 },
      { id: 'py-tax-bill', label: '세금계산서 자동발행 (팝빌)', price: 100 },
      { id: 'py-cash-receipt', label: '현금영수증 발급', price: 70 },
      { id: 'py-dashboard', label: '매출 대시보드 (일/월/연)', price: 100 },
      { id: 'py-settle', label: '판매자별 정산 / 자동이체', price: 210 },
      { id: 'py-excel', label: '정산 리포트 엑셀 다운', price: 50 },
    ],
  },
  {
    id: 'noti', title: '알림 / 메시징', tag: 'NOTIFICATION', icon: <Bell className="h-4 w-4" />, items: [
      { id: 'no-fcm', label: '푸시 알림 (FCM) - Android 셋업', price: 50 },
      { id: 'no-apns', label: '푸시 알림 (APNs) - iOS 셋업', price: 45 },
      { id: 'no-targeting', label: '푸시 타겟팅 / 예약 발송', price: 70 },
      { id: 'no-badge', label: '앱 뱃지 카운트', price: 25 },
      { id: 'no-rich', label: 'Rich 푸시 (이미지 / 액션)', price: 70 },
      { id: 'no-silent', label: '사일런트 푸시 (백그라운드 동기화)', price: 50 },
      { id: 'no-katalk-alert', label: '카카오 알림톡 API 연동', price: 85 },
      { id: 'no-katalk-friend', label: '카카오 친구톡 연동', price: 70 },
      { id: 'no-sms', label: 'SMS 발송 (NHN / 알리고)', price: 35 },
      { id: 'no-lms', label: 'LMS (장문 메시지) 발송', price: 25 },
      { id: 'no-mms', label: 'MMS (이미지 첨부) 발송', price: 35 },
      { id: 'no-email', label: '이메일 발송 셋업 (Resend / SES)', price: 25 },
      { id: 'no-email-tpl', label: 'HTML 이메일 템플릿 제작', price: 40 },
      { id: 'no-chat-1on1', label: '1:1 실시간 채팅 (Socket.IO)', price: 255 },
      { id: 'no-chat-group', label: '그룹 채팅방', price: 170 },
      { id: 'no-chat-media', label: '채팅 이미지 / 파일 전송', price: 60 },
      { id: 'no-chat-read', label: '채팅 읽음 표시 · 전송 상태', price: 25 },
      { id: 'no-chat-typing', label: '입력 중 표시 (Typing indicator)', price: 20 },
      { id: 'no-chat-search', label: '채팅 검색', price: 40 },
      { id: 'no-chat-emoji', label: '이모지 / 반응 (Reaction)', price: 40 },
      { id: 'no-chat-translate', label: '채팅 자동 번역', price: 85 },
      { id: 'no-notice', label: '공지사항 CRUD', price: 50 },
      { id: 'no-inapp', label: '인앱 배너 / 토스트', price: 50 },
      { id: 'no-pref', label: '알림 수신 설정 페이지', price: 35 },
    ],
  },
  {
    id: 'social', title: '커뮤니티 / SNS', tag: 'COMMUNITY', icon: <MessageSquare className="h-4 w-4" />, items: [
      { id: 'so-board-list', label: '게시판 목록', price: 35 },
      { id: 'so-board-crud', label: '게시글 작성 · 수정 · 삭제', price: 60 },
      { id: 'so-board-cat', label: '카테고리별 게시판', price: 35 },
      { id: 'so-board-md', label: '마크다운 / 리치 에디터', price: 85 },
      { id: 'so-board-image', label: '게시글 이미지 첨부', price: 35 },
      { id: 'so-board-poll', label: '투표 / 폴', price: 70 },
      { id: 'so-comment', label: '댓글 기능', price: 50 },
      { id: 'so-reply', label: '대댓글 (1-depth)', price: 40 },
      { id: 'so-reply-tree', label: '무한 대댓글 트리', price: 85 },
      { id: 'so-mention', label: '@멘션 기능', price: 50 },
      { id: 'so-like', label: '좋아요 (게시글 / 댓글)', price: 25 },
      { id: 'so-bookmark', label: '북마크 / 스크랩', price: 40 },
      { id: 'so-follow', label: '팔로우 / 팔로워', price: 85 },
      { id: 'so-friend', label: '친구 신청 / 수락', price: 100 },
      { id: 'so-hashtag', label: '해시태그 파싱 & 검색', price: 70 },
      { id: 'so-search', label: '통합 검색 (게시글 / 유저)', price: 85 },
      { id: 'so-search-elastic', label: 'ElasticSearch 풀텍스트 검색', price: 210 },
      { id: 'so-report', label: '신고 기능', price: 35 },
      { id: 'so-block', label: '유저 차단 / 블락', price: 35 },
      { id: 'so-filter', label: '금지어 필터링', price: 25 },
      { id: 'so-filter-ai', label: 'AI 비속어 / 혐오발언 탐지', price: 170 },
      { id: 'so-feed-time', label: '피드 (시간순)', price: 50 },
      { id: 'so-feed-follow', label: '피드 (팔로우 기반)', price: 85 },
      { id: 'so-feed-rank', label: '피드 (랭킹 알고리즘)', price: 210 },
      { id: 'so-story', label: '스토리 (24시간 자동삭제)', price: 210 },
      { id: 'so-shorts', label: '쇼츠 / 릴스 (세로 영상 피드)', price: 340 },
      { id: 'so-review', label: '리뷰 작성 (텍스트·사진)', price: 70 },
      { id: 'so-rating', label: '별점 평점', price: 25 },
      { id: 'so-dm', label: 'DM (1:1 다이렉트 메시지)', price: 135 },
      { id: 'so-share', label: '소셜 공유 (카카오 / 라인)', price: 25 },
      { id: 'so-quote', label: '인용 / 공유 (퀘오트)', price: 40 },
    ],
  },
  {
    id: 'media', title: '미디어 / 콘텐츠', tag: 'MEDIA', icon: <ImgIcon className="h-4 w-4" />, items: [
      { id: 'me-upload', label: '이미지 업로드 (S3 / R2)', price: 40 },
      { id: 'me-cdn', label: '이미지 CDN 연결', price: 20 },
      { id: 'me-resize', label: '이미지 리사이징 (Sharp)', price: 35 },
      { id: 'me-crop', label: '이미지 크롭 / 회전', price: 30 },
      { id: 'me-thumb', label: '썸네일 자동 생성', price: 25 },
      { id: 'me-exif', label: 'EXIF 데이터 제거 (프라이버시)', price: 15 },
      { id: 'me-watermark', label: '워터마크 합성', price: 35 },
      { id: 'me-video-up', label: '동영상 업로드', price: 60 },
      { id: 'me-video-compress', label: '동영상 서버 압축', price: 85 },
      { id: 'me-hls', label: 'HLS 스트리밍 (MediaConvert)', price: 210 },
      { id: 'me-drm', label: 'DRM 콘텐츠 보호 (Widevine)', price: 510 },
      { id: 'me-live', label: '라이브 스트리밍 (RTMP + HLS)', price: 510 },
      { id: 'me-webrtc-1on1', label: 'WebRTC 1:1 영상통화', price: 340 },
      { id: 'me-webrtc-group', label: 'WebRTC 다자 영상통화', price: 765 },
      { id: 'me-screenshare', label: '화면 공유', price: 170 },
      { id: 'me-recording', label: '영상 녹화 / 저장', price: 130 },
      { id: 'me-filter', label: '이미지 필터 (감성 필터)', price: 100 },
      { id: 'me-ar', label: 'AR 필터 (얼굴 인식)', price: 510 },
      { id: 'me-audio', label: '음악 / 오디오 플레이어', price: 100 },
      { id: 'me-podcast', label: '팟캐스트 백그라운드 재생', price: 85 },
      { id: 'me-file', label: '파일 업로드 / 다운로드', price: 35 },
      { id: 'me-pdf-view', label: 'PDF 뷰어', price: 70 },
    ],
  },
  {
    id: 'commerce', title: '쇼핑몰 / 커머스', tag: 'COMMERCE', icon: <ShoppingBag className="h-4 w-4" />, items: [
      { id: 'cm-catalog', label: '상품 카탈로그 (목록)', price: 70 },
      { id: 'cm-detail', label: '상품 상세 페이지', price: 85 },
      { id: 'cm-options', label: '상품 옵션 (사이즈 / 색상)', price: 70 },
      { id: 'cm-options-comb', label: '옵션 조합 재고 관리', price: 130 },
      { id: 'cm-cart', label: '장바구니', price: 85 },
      { id: 'cm-cart-shared', label: '장바구니 공유 / 저장', price: 40 },
      { id: 'cm-wishlist', label: '위시리스트', price: 50 },
      { id: 'cm-recent', label: '최근 본 상품', price: 35 },
      { id: 'cm-search', label: '상품 검색', price: 70 },
      { id: 'cm-search-image', label: '이미지 검색 (유사 상품)', price: 255 },
      { id: 'cm-filter', label: '상품 필터 (가격 / 카테고리 / 브랜드)', price: 85 },
      { id: 'cm-sort', label: '정렬 옵션 (인기 / 가격 / 신상)', price: 25 },
      { id: 'cm-stock', label: '재고 관리', price: 85 },
      { id: 'cm-soldout', label: '품절 / 입고 알림 신청', price: 50 },
      { id: 'cm-order', label: '주문하기 / 결제 플로우', price: 170 },
      { id: 'cm-order-history', label: '주문 내역 / 상세', price: 70 },
      { id: 'cm-order-cancel', label: '주문 취소 / 반품 / 교환', price: 130 },
      { id: 'cm-shipping-track', label: '배송 추적 (택배 API)', price: 85 },
      { id: 'cm-shipping-addr', label: '배송 주소 관리', price: 50 },
      { id: 'cm-shipping-time', label: '배송 일시 지정', price: 40 },
      { id: 'cm-admin-product', label: '관리자 상품 등록 / 수정', price: 130 },
      { id: 'cm-admin-stock', label: '관리자 재고 관리', price: 70 },
      { id: 'cm-admin-order', label: '관리자 주문 관리', price: 100 },
      { id: 'cm-multiseller', label: '판매자 센터 (멀티 셀러)', price: 510 },
      { id: 'cm-review', label: '상품 리뷰 + 사진', price: 85 },
      { id: 'cm-qna', label: '상품 Q&A 게시판', price: 70 },
      { id: 'cm-section', label: '베스트 / 신상품 / 기획전', price: 70 },
      { id: 'cm-event', label: '기획전 / 이벤트 페이지 관리', price: 100 },
      { id: 'cm-flash', label: '타임딜 / 플래시 세일', price: 85 },
      { id: 'cm-grade', label: '회원 등급별 혜택', price: 85 },
      { id: 'cm-gift', label: '선물하기', price: 70 },
      { id: 'cm-subscribe-box', label: '구독박스 (정기배송)', price: 170 },
    ],
  },
  {
    id: 'loc', title: '위치 / 지도 / 배달', tag: 'LOCATION', icon: <MapPin className="h-4 w-4" />, items: [
      { id: 'lo-kakao', label: 'Kakao 지도 임베드', price: 40 },
      { id: 'lo-naver', label: 'Naver 지도 임베드', price: 40 },
      { id: 'lo-google', label: 'Google Maps 임베드', price: 40 },
      { id: 'lo-gps', label: 'GPS 현재 위치 조회', price: 35 },
      { id: 'lo-perm', label: '위치 권한 요청 UX', price: 10 },
      { id: 'lo-track', label: '실시간 위치 추적 (배달앱류)', price: 210 },
      { id: 'lo-route', label: '경로 탐색 (Tmap / Google)', price: 155 },
      { id: 'lo-route-opt', label: '배달 경로 최적화 (TSP)', price: 300 },
      { id: 'lo-eta', label: '예상 도착시간 (ETA) 계산', price: 85 },
      { id: 'lo-geofence', label: '지오펜싱 (영역 진입·이탈)', price: 100 },
      { id: 'lo-address', label: '주소 검색 (다음 우편번호)', price: 25 },
      { id: 'lo-reverse', label: '좌표 → 주소 역지오코딩', price: 25 },
      { id: 'lo-cluster', label: '마커 클러스터링', price: 50 },
      { id: 'lo-autocomplete', label: '장소 검색 자동완성', price: 60 },
      { id: 'lo-overlay', label: '지도 커스텀 오버레이', price: 60 },
      { id: 'lo-rider-match', label: '배달기사 매칭 시스템', price: 340 },
      { id: 'lo-pickup', label: '픽업 사진 / 완료 인증', price: 70 },
    ],
  },
  {
    id: 'ai', title: 'AI / 머신러닝', tag: 'AI · ML', icon: <Sparkles className="h-4 w-4" />, items: [
      { id: 'ai-api-basic', label: 'ChatGPT / Claude API 단순 연동', price: 70 },
      { id: 'ai-chatbot', label: 'LLM 챗봇 (컨텍스트 관리)', price: 210 },
      { id: 'ai-rag', label: 'RAG (벡터 DB + 검색)', price: 380 },
      { id: 'ai-agent', label: 'Tool-use 에이전트', price: 510 },
      { id: 'ai-prompt-mgmt', label: '프롬프트 관리 / 버전 관리', price: 130 },
      { id: 'ai-sd', label: 'Stable Diffusion 이미지 생성', price: 100 },
      { id: 'ai-dalle', label: 'DALL·E 이미지 생성 API', price: 50 },
      { id: 'ai-upscale', label: '이미지 업스케일 (Real-ESRGAN)', price: 130 },
      { id: 'ai-removebg', label: '배경 제거 (Remove.bg API)', price: 40 },
      { id: 'ai-ocr-clova', label: 'OCR 간단 (네이버 CLOVA)', price: 70 },
      { id: 'ai-ocr-custom', label: 'OCR 고정밀 (커스텀 학습)', price: 210 },
      { id: 'ai-stt', label: 'STT 음성인식 (Whisper)', price: 70 },
      { id: 'ai-tts', label: 'TTS 음성합성 (ElevenLabs)', price: 85 },
      { id: 'ai-translate', label: '번역 API (DeepL / Papago)', price: 35 },
      { id: 'ai-vision', label: '이미지 분류 (Vision API)', price: 85 },
      { id: 'ai-face', label: '얼굴 인식 / 탐지', price: 210 },
      { id: 'ai-pose', label: '자세 추정 (Pose Estimation)', price: 255 },
      { id: 'ai-reco-rule', label: '추천 시스템 (룰 기반)', price: 100 },
      { id: 'ai-reco-ml', label: '추천 시스템 (ML 모델)', price: 425 },
      { id: 'ai-sentiment', label: '감성 분석', price: 70 },
      { id: 'ai-summary', label: '문서 자동 요약', price: 85 },
    ],
  },
  {
    id: 'sched', title: '예약 / 매칭 / 스케줄', tag: 'SCHEDULE', icon: <CalendarCheck className="h-4 w-4" />, items: [
      { id: 'sc-cal', label: '캘린더 UI (월/주/일)', price: 100 },
      { id: 'sc-booking', label: '예약 생성 / 취소', price: 85 },
      { id: 'sc-slot', label: '예약 시간 슬롯 관리', price: 100 },
      { id: 'sc-noshow', label: '노쇼 방지 (선결제 + 수수료)', price: 70 },
      { id: 'sc-recurring', label: '반복 예약 (주간 / 월간)', price: 85 },
      { id: 'sc-waiting', label: '대기열 / 줄서기 시스템', price: 170 },
      { id: 'sc-match', label: '실시간 매칭 알고리즘', price: 380 },
      { id: 'sc-bid', label: '입찰 / 견적 매칭', price: 255 },
      { id: 'sc-shift', label: '근무 스케줄 관리', price: 135 },
      { id: 'sc-auto-shift', label: '교대 근무 자동 배정', price: 210 },
      { id: 'sc-qr-gen', label: 'QR 코드 생성', price: 15 },
      { id: 'sc-qr-scan', label: 'QR 코드 스캔', price: 40 },
      { id: 'sc-barcode', label: '바코드 스캔', price: 40 },
      { id: 'sc-attendance', label: '출퇴근 기록 (GPS 기반)', price: 100 },
      { id: 'sc-google-cal', label: 'Google Calendar 동기화', price: 85 },
    ],
  },
  {
    id: 'data', title: '데이터 / 분석', tag: 'ANALYTICS', icon: <BarChart3 className="h-4 w-4" />, items: [
      { id: 'da-kpi', label: '통계 대시보드 (기본 KPI)', price: 135 },
      { id: 'da-charts', label: '차트 시각화 (Recharts 5종)', price: 70 },
      { id: 'da-realtime', label: '실시간 대시보드 (WebSocket)', price: 155 },
      { id: 'da-ga', label: 'GA4 연동', price: 25 },
      { id: 'da-amplitude', label: 'Amplitude 연동', price: 35 },
      { id: 'da-mixpanel', label: 'Mixpanel 연동', price: 35 },
      { id: 'da-event', label: '이벤트 로깅 설계', price: 60 },
      { id: 'da-funnel', label: '퍼널 분석', price: 85 },
      { id: 'da-cohort', label: '코호트 분석', price: 100 },
      { id: 'da-segment', label: '유저 세그먼트', price: 100 },
      { id: 'da-ab', label: 'A/B 테스트 인프라', price: 210 },
      { id: 'da-feature-flag', label: '기능 플래그 (Feature flag)', price: 100 },
      { id: 'da-excel', label: '엑셀 다운로드 (xlsx)', price: 50 },
      { id: 'da-pdf', label: 'PDF 리포트 생성', price: 100 },
      { id: 'da-scheduled', label: '이메일 리포트 정기 발송', price: 70 },
      { id: 'da-bigquery', label: 'BigQuery / 데이터 웨어하우스 연동', price: 210 },
    ],
  },
  {
    id: 'gam', title: '게이미피케이션', tag: 'GAMIFICATION', icon: <Trophy className="h-4 w-4" />, items: [
      { id: 'gm-badge', label: '뱃지 / 업적 시스템', price: 130 },
      { id: 'gm-level', label: '레벨 / 경험치', price: 100 },
      { id: 'gm-mission', label: '데일리 미션 / 퀘스트', price: 170 },
      { id: 'gm-attendance', label: '출석 체크 / 보상', price: 70 },
      { id: 'gm-leaderboard', label: '리더보드 / 랭킹', price: 130 },
      { id: 'gm-challenge', label: '챌린지 / 경쟁 모드', price: 210 },
      { id: 'gm-reward', label: '리워드 샵 (포인트 교환)', price: 130 },
      { id: 'gm-streak', label: '연속 출석 스트릭', price: 50 },
      { id: 'gm-roulette', label: '룰렛 / 뽑기', price: 85 },
      { id: 'gm-referral', label: '친구 추천 / 리워드', price: 100 },
      { id: 'gm-collection', label: '컬렉션 / 도감', price: 130 },
    ],
  },
  {
    id: 'sec', title: '보안 / 약관 / 컴플라이언스', tag: 'SECURITY', icon: <Lock className="h-4 w-4" />, items: [
      { id: 'se-privacy', label: '개인정보처리방침 페이지 (템플릿)', price: 10 },
      { id: 'se-terms', label: '이용약관 페이지 (템플릿)', price: 10 },
      { id: 'se-privacy-custom', label: '개인정보처리방침 (맞춤 작성)', price: 50 },
      { id: 'se-terms-custom', label: '이용약관 (맞춤 작성)', price: 50 },
      { id: 'se-consent', label: '개인정보 수집 동의 모달', price: 15 },
      { id: 'se-marketing', label: '마케팅 수신 동의', price: 10 },
      { id: 'se-thirdparty', label: '제3자 제공 동의', price: 10 },
      { id: 'se-cookie', label: '쿠키 동의 배너 (GDPR)', price: 20 },
      { id: 'se-youth', label: '청소년 보호정책', price: 10 },
      { id: 'se-encrypt', label: '데이터 암호화 (DB + 전송)', price: 70 },
      { id: 'se-audit', label: '접속 로그 / 감사 로그', price: 70 },
      { id: 'se-2fa', label: '2FA / TOTP 인증', price: 85 },
      { id: 'se-rate', label: 'IP 차단 / Rate Limit', price: 50 },
      { id: 'se-captcha', label: 'CAPTCHA (Turnstile / reCAPTCHA)', price: 20 },
      { id: 'se-waf', label: 'WAF (Cloudflare / AWS WAF)', price: 70 },
      { id: 'se-ismsp', label: 'ISMS-P 준수 설계', price: 510 },
      { id: 'se-pia', label: '개인정보 영향평가 대응', price: 340 },
      { id: 'se-pen-test', label: '모의해킹 보고 대응', price: 255 },
    ],
  },
  {
    id: 'infra', title: '인프라 / 운영', tag: 'INFRA · DEVOPS', icon: <Server className="h-4 w-4" />, items: [
      { id: 'in-vercel', label: 'Vercel 배포 셋업', price: 15 },
      { id: 'in-supabase', label: 'Supabase 셋업 + 스키마', price: 50 },
      { id: 'in-aws', label: 'AWS 서버 구축 (EC2 / ECS)', price: 255 },
      { id: 'in-gcp', label: 'GCP 서버 구축', price: 255 },
      { id: 'in-azure', label: 'Azure 서버 구축', price: 255 },
      { id: 'in-k8s', label: 'Kubernetes 클러스터 구성', price: 425 },
      { id: 'in-serverless', label: 'Serverless (Lambda / Functions)', price: 170 },
      { id: 'in-db-rdb', label: 'DB 설계 (PostgreSQL / MySQL)', price: 130 },
      { id: 'in-db-nosql', label: 'DB 설계 (MongoDB / DynamoDB)', price: 130 },
      { id: 'in-db-replica', label: 'DB Read Replica / 샤딩', price: 210 },
      { id: 'in-redis', label: 'Redis 캐싱 셋업', price: 70 },
      { id: 'in-queue', label: '메시지 큐 (SQS / Kafka)', price: 170 },
      { id: 'in-cdn', label: 'CloudFront / Cloudflare CDN', price: 35 },
      { id: 'in-s3', label: 'S3 / R2 스토리지 셋업', price: 25 },
      { id: 'in-domain', label: '도메인 연결 + SSL', price: 15 },
      { id: 'in-sentry', label: '모니터링 (Sentry) 셋업', price: 35 },
      { id: 'in-apm', label: 'APM (Datadog / New Relic)', price: 100 },
      { id: 'in-log', label: '로그 수집 (CloudWatch / Logtail)', price: 60 },
      { id: 'in-cicd', label: 'CI/CD (GitHub Actions) 파이프라인', price: 100 },
      { id: 'in-backup', label: '백업 자동화', price: 50 },
      { id: 'in-staging', label: '스테이징 환경 구성', price: 70 },
      { id: 'in-loadtest', label: '부하 테스트 (k6 / JMeter)', price: 130 },
    ],
  },
  {
    id: 'extra', title: '부가 서비스 / 스토어', tag: 'EXTRA', icon: <PackageIcon className="h-4 w-4" />, items: [
      { id: 'ex-i18n-setup', label: 'i18n 프레임워크 셋업', price: 50 },
      { id: 'ex-lang-en', label: '영어 번역 적용', price: 70 },
      { id: 'ex-lang-jp', label: '일본어 번역 적용', price: 85 },
      { id: 'ex-lang-cn', label: '중국어 번역 적용', price: 85 },
      { id: 'ex-lang-vi', label: '베트남어 번역 적용', price: 85 },
      { id: 'ex-appstore', label: '앱스토어 등록 대행 (Apple)', price: 60 },
      { id: 'ex-playstore', label: '플레이스토어 등록 대행 (Google)', price: 40 },
      { id: 'ex-onestore', label: '원스토어 등록 대행', price: 50 },
      { id: 'ex-reject', label: '앱 심사 Rejection 대응', price: 40 },
      { id: 'ex-screenshot', label: '스토어 스크린샷 제작 (6장)', price: 40 },
      { id: 'ex-icon', label: '앱 아이콘 디자인', price: 35 },
      { id: 'ex-seo-basic', label: 'SEO 기본 (메타 / OG / sitemap)', price: 35 },
      { id: 'ex-seo-pro', label: 'SEO 고도화 (구조화 데이터 / 속도)', price: 85 },
      { id: 'ex-aso', label: 'ASO (앱 스토어 최적화)', price: 85 },
      { id: 'ex-user-manual', label: '사용자 매뉴얼 작성', price: 70 },
      { id: 'ex-admin-manual', label: '관리자 매뉴얼 작성', price: 50 },
      { id: 'ex-faq', label: 'FAQ 페이지', price: 20 },
      { id: 'ex-cs', label: '고객센터 1:1 문의 채널', price: 60 },
      { id: 'ex-channel-talk', label: '채널톡 / 인터컴 위젯 연동', price: 25 },
      { id: 'ex-maintenance-1m', label: '출시 후 1개월 무상 유지보수', price: 170 },
      { id: 'ex-maintenance-3m', label: '출시 후 3개월 유지보수 계약', price: 465 },
      { id: 'ex-maintenance-6m', label: '출시 후 6개월 유지보수 계약', price: 850 },
      { id: 'ex-handover', label: '소스 인수인계 / 기술 이전', price: 130 },
    ],
  },
]

// 커스텀 Toss식 SVG 아이콘
import * as Pi from '@/components/PackageIcons'

const PKG_ICON: Record<string, (p: { className?: string }) => React.JSX.Element> = {
  // BUSINESS
  corp: Pi.IconCorp, portfolio: Pi.IconUser, law: Pi.IconLaw,
  hospital: Pi.IconHospital, clinic: Pi.IconHospital,
  'real-estate': Pi.IconHome, consulting: Pi.IconBriefcase,
  accounting: Pi.IconCalc, construction: Pi.IconHome, 'edu-biz': Pi.IconCorp,
  // COMMERCE
  shop: Pi.IconShop, fashion: Pi.IconShirt, grocery: Pi.IconGrocery,
  farm: Pi.IconLeaf, luxury: Pi.IconGem, used: Pi.IconRefresh,
  'b2b-market': Pi.IconCorp, auction: Pi.IconAuction,
  subscription: Pi.IconRefresh, crowdfunding: Pi.IconTrending,
  // FOOD
  delivery: Pi.IconDelivery, reservation: Pi.IconCalendar,
  pos: Pi.IconReceipt, cafe: Pi.IconCoffee,
  'ghost-kitchen': Pi.IconChef, catering: Pi.IconChef,
  'home-meal': Pi.IconSoup, chef: Pi.IconChef,
  // EDUCATION
  edu: Pi.IconBook, 'kids-edu': Pi.IconBaby,
  language: Pi.IconBook, bootcamp: Pi.IconGrad,
  tutor: Pi.IconGrad, cert: Pi.IconAward,
  // HEALTH
  fitness: Pi.IconFitness, yoga: Pi.IconFitness,
  mental: Pi.IconMental, diet: Pi.IconDiet,
  pet: Pi.IconPet, medical: Pi.IconHospital,
  // COMMUNITY
  community: Pi.IconChat, dating: Pi.IconDating,
  hobby: Pi.IconParty, local: Pi.IconMapPin,
  religious: Pi.IconChurch, parents: Pi.IconBaby, senior: Pi.IconUser,
  // PRODUCTIVITY
  todo: Pi.IconTodo, note: Pi.IconNote, crm: Pi.IconCrm,
  'project-mgmt': Pi.IconKanban, hr: Pi.IconCrm, invoice: Pi.IconFile,
  'team-chat': Pi.IconChat,
  // LIFESTYLE
  freelance: Pi.IconBriefcase, cleaning: Pi.IconSpray,
  laundry: Pi.IconShirt, moving: Pi.IconTruck,
  repair: Pi.IconWrench, 'lawyer-match': Pi.IconLaw,
  'doctor-match': Pi.IconHospital, travel: Pi.IconPlane,
}

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

const MM_RATE = 600

const ROLE_BY_CAT: Record<string, string[]> = {
  platform: ['pm', 'designer', 'mobile'], design: ['designer', 'pm'], anim: ['designer', 'mobile', 'frontend'],
  auth: ['backend', 'mobile'], pay: ['backend', 'mobile'], noti: ['backend', 'mobile'],
  social: ['backend', 'mobile', 'frontend'], media: ['backend', 'mobile', 'devops'],
  commerce: ['backend', 'mobile', 'frontend'], loc: ['mobile', 'backend'], ai: ['ai', 'backend'],
  sched: ['backend', 'mobile'], data: ['frontend', 'backend'], gam: ['mobile', 'backend', 'designer'],
  sec: ['backend', 'devops'], infra: ['devops', 'backend'], extra: ['pm', 'frontend'],
}
const ROLE_LABEL: Record<string, string> = {
  pm: '프로젝트 매니저 (PM)', designer: '프로덕트 디자이너', mobile: '모바일 개발자',
  frontend: '프론트엔드 개발자', backend: '백엔드 개발자', ai: 'AI / ML 엔지니어', devops: '데브옵스 엔지니어',
}
const PLATFORM_ITEM_IDS = new Set(CATEGORIES.find(c => c.id === 'platform')!.items.map(i => i.id))

// 모든 항목을 id로 찾기 위한 lookup
const ITEM_LOOKUP: Record<string, Item & { catId: string }> = {}
CATEGORIES.forEach(cat => cat.items.forEach(it => { ITEM_LOOKUP[it.id] = { ...it, catId: cat.id } }))

function fmt(manwon: number) {
  if (manwon >= 10000) return `${(manwon / 10000).toFixed(2)}억 ${(manwon % 10000).toLocaleString()}만`
  return `${Math.round(manwon).toLocaleString()}만`
}
function priceOf(ids: string[]) { return ids.reduce((s, id) => s + (ITEM_LOOKUP[id]?.price ?? 0), 0) }

const TIER_HEX: Record<TierId, string> = {
  mvp: '#64748B', basic: '#0EA5E9', premium: '#2563EB', deluxe: '#4F46E5', enterprise: '#0F172A',
}

// ───────────────────────────── PackageCard ─────────────────────────────

function PackageCard({
  p, idx, isActivePkg, activeTier, applyTier, onHoverEnter, onHoverLeave,
}: {
  p: Pkg; idx: number; isActivePkg: boolean; activeTier: TierId | null;
  applyTier: (pkg: Pkg, tier: TierId) => void;
  onHoverEnter: (tier: TierId, rect: DOMRect) => void;
  onHoverLeave: (tier: TierId) => void;
}) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [pill, setPill] = useState<{ left: number; width: number; color: string } | null>(null)

  useLayoutEffect(() => {
    function measure() {
      if (!isActivePkg || !activeTier) { setPill(null); return }
      const grid = gridRef.current
      if (!grid) return
      const btn = grid.querySelector<HTMLElement>(`[data-tier="${activeTier}"]`)
      if (!btn) return
      const gr = grid.getBoundingClientRect()
      const br = btn.getBoundingClientRect()
      setPill({ left: br.left - gr.left, width: br.width, color: TIER_HEX[activeTier] })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [isActivePkg, activeTier])

  const IconCmp = PKG_ICON[p.id]

  return (
    <div
      style={{ animationDelay: `${idx * 40}ms` }}
      className="group relative flex w-[300px] shrink-0 animate-[fadeUp_0.5s_ease-out_both] snap-start flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)]"
    >
      <div className="flex items-start gap-3">
        <div className={`shrink-0 transition-transform duration-300 group-hover:scale-[1.08] group-hover:-rotate-3 ${isActivePkg ? 'drop-shadow-[0_6px_16px_rgba(41,121,255,0.35)]' : ''}`}>
          {IconCmp ? <IconCmp className="h-12 w-12" /> : <div className="h-12 w-12 rounded-[12px] bg-slate-100" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-[14px] font-bold text-slate-900">{p.label}</p>
          <p className="mt-0.5 truncate text-[12px] text-slate-500">{p.sub}</p>
        </div>
      </div>

      {/* 알약 티어 버튼 + 슬라이딩 색상 인디케이터 */}
      <div ref={gridRef} className="relative mt-4 grid grid-cols-5 gap-1.5">
        {pill && (
          <span
            aria-hidden
            className="absolute top-0 z-0 h-[36px] rounded-full transition-all duration-[550ms]"
            style={{
              left: pill.left,
              width: pill.width,
              backgroundColor: pill.color,
              boxShadow: `0 6px 18px ${pill.color}55, 0 2px 4px ${pill.color}33`,
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {/* 자연스럽게 일렁이는 하이라이트 (라디얼 + 브리드) */}
            <span
              className="absolute inset-0 rounded-full animate-[pillWave_3.2s_ease-in-out_infinite]"
              style={{
                background: 'radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.45), rgba(255,255,255,0) 60%)',
                backgroundSize: '220% 120%',
              }}
            />
            <span
              className="absolute inset-0 rounded-full animate-[pillBreath_2.6s_ease-in-out_infinite]"
              style={{
                background: 'radial-gradient(circle at 70% 60%, rgba(255,255,255,0.25), rgba(255,255,255,0) 55%)',
              }}
            />
          </span>
        )}
        {TIER_ORDER.map(t => {
          const meta = TIER_META[t]
          const tierActive = isActivePkg && activeTier === t
          return (
            <div key={t} data-tier={t} className="relative z-10"
              onMouseEnter={e => onHoverEnter(t, (e.currentTarget as HTMLElement).getBoundingClientRect())}
              onMouseLeave={() => onHoverLeave(t)}>
              <button type="button" onClick={() => applyTier(p, t)}
                className={`relative flex h-[36px] w-full items-center justify-center rounded-full text-[11px] font-bold transition-colors duration-500 active:scale-95 ${tierActive ? 'text-white' : `${meta.soft} hover:brightness-105`}`}>
                {meta.label.charAt(0)}
              </button>
            </div>
          )
        })}
      </div>

      {isActivePkg && activeTier && (
        <div className="mt-3 flex items-center gap-1.5 text-[11px]">
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white ${TIER_META[activeTier].color}`}>{TIER_META[activeTier].label}</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500">{p.tiers[activeTier].length}개 · {priceOf(p.tiers[activeTier]).toLocaleString()}만</span>
        </div>
      )}

      {PACKAGE_EXAMPLES[p.id] && (
        <div className="mt-3 border-t border-slate-100 pt-3">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">비슷한 서비스</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {PACKAGE_EXAMPLES[p.id].map(ex => (
              <div key={ex.domain} className="flex items-center gap-1.5 transition-transform duration-200 group-hover:-translate-y-px">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://www.google.com/s2/favicons?domain=${ex.domain}&sz=64`}
                  alt={ex.name}
                  width={16} height={16}
                  className="h-4 w-4 rounded-sm bg-slate-100 object-contain"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden' }}
                />
                <span className="text-[11px] font-medium text-slate-600">{ex.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ───────────────────────────── PAGE ─────────────────────────────

export default function EstimatePage() {
  const [selected, setSelected] = useState<Set<string>>(new Set(PACKAGES.find(p => p.id === 'shop')!.tiers.basic))
  const [open, setOpen] = useState<Set<string>>(new Set(['platform']))
  const [design, setDesign] = useState('custom')
  const [timeline, setTimeline] = useState('normal')
  const [contact, setContact] = useState({ company: '', name: '', phone: '', email: '', memo: '' })
  const [sending, setSending] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [activePkg, setActivePkg] = useState<string | null>('shop')
  const [activeTier, setActiveTier] = useState<TierId | null>('basic')
  const [pkgCategory, setPkgCategory] = useState<string>('all')
  const [hoverPkgTier, setHoverPkgTier] = useState<{ pkg: string; tier: TierId } | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null)
  const [query, setQuery] = useState('')
  const [mounted, setMounted] = useState(false)

  const carouselRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const [pill, setPill] = useState<{ left: number; top: number; width: number; height: number } | null>(null)

  useLayoutEffect(() => {
    function update() {
      const container = tabsRef.current
      if (!container) return
      const active = container.querySelector<HTMLElement>(`[data-tab-id="${pkgCategory}"]`)
      if (!active) return
      const cr = container.getBoundingClientRect()
      const r = active.getBoundingClientRect()
      setPill({ left: r.left - cr.left, top: r.top - cr.top, width: r.width, height: r.height })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [pkgCategory])

  useEffect(() => {
    const h = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', h, { passive: true })
    setMounted(true)
    return () => window.removeEventListener('scroll', h)
  }, [])

  function toggle(id: string) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
    setActivePkg(null); setActiveTier(null)
  }
  function toggleCat(catId: string) {
    setOpen(prev => { const n = new Set(prev); n.has(catId) ? n.delete(catId) : n.add(catId); return n })
  }
  function selectAllInCat(catId: string) {
    const cat = CATEGORIES.find(c => c.id === catId)!
    setSelected(prev => { const n = new Set(prev); cat.items.forEach(i => n.add(i.id)); return n })
    setActivePkg(null); setActiveTier(null)
  }
  function clearCat(catId: string) {
    const cat = CATEGORIES.find(c => c.id === catId)!
    setSelected(prev => { const n = new Set(prev); cat.items.forEach(i => n.delete(i.id)); return n })
    setActivePkg(null); setActiveTier(null)
  }
  function applyTier(pkg: Pkg, tier: TierId) {
    const ids = pkg.tiers[tier]
    setSelected(new Set(ids))
    setActivePkg(pkg.id); setActiveTier(tier)
    const cats = new Set<string>()
    ids.forEach(id => { const e = ITEM_LOOKUP[id]; if (e) cats.add(e.catId) })
    setOpen(cats)
    document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  function clearAll() { setSelected(new Set()); setActivePkg(null); setActiveTier(null) }

  function scrollCarousel(dir: 'left' | 'right') {
    const el = carouselRef.current
    if (!el) return
    const w = el.clientWidth * 0.85
    el.scrollBy({ left: dir === 'right' ? w : -w, behavior: 'smooth' })
  }

  const filteredPackages = useMemo(
    () => pkgCategory === 'all' ? PACKAGES : PACKAGES.filter(p => p.category === pkgCategory),
    [pkgCategory],
  )

  // 검색 필터
  const q = query.trim().toLowerCase()
  const searchMatches = useMemo(() => {
    if (!q) return null
    const matches: Record<string, Set<string>> = {}
    CATEGORIES.forEach(cat => {
      const hits = cat.items.filter(it => it.label.toLowerCase().includes(q) || cat.title.toLowerCase().includes(q) || cat.tag.toLowerCase().includes(q))
      if (hits.length) matches[cat.id] = new Set(hits.map(h => h.id))
    })
    return matches
  }, [q])

  const nativeMode = useMemo(() => {
    const ios = selected.has('pf-ios')
    const aos = selected.has('pf-android')
    const cross = selected.has('pf-rn') || selected.has('pf-flutter')
    if (ios && aos && !cross) return { id: 'both-native', mult: 1.6, label: 'iOS + Android 양쪽 네이티브' }
    if ((ios || aos) && !cross) return { id: 'single-native', mult: 1.1, label: '단일 네이티브' }
    return { id: 'cross', mult: 1.0, label: '크로스플랫폼 / 단일 OS' }
  }, [selected])

  const calc = useMemo(() => {
    let baseSum = 0, appSum = 0
    const catSum: Record<string, number> = {}
    CATEGORIES.forEach(cat => {
      let s = 0
      cat.items.forEach(it => {
        if (selected.has(it.id)) { s += it.price; if (!PLATFORM_ITEM_IDS.has(it.id)) appSum += it.price }
      })
      if (s > 0) catSum[cat.id] = s
      baseSum += s
    })
    const nativeAdd = appSum * (nativeMode.mult - 1)
    const afterNative = baseSum + nativeAdd
    const designMult = DESIGNS.find(d => d.id === design)?.mult ?? 1
    const timeMult = TIMELINES.find(t => t.id === timeline)?.mult ?? 1
    const designAdd = afterNative * (designMult - 1)
    const afterDesign = afterNative + designAdd
    const timeAdd = afterDesign * (timeMult - 1)
    const subtotal = Math.round(afterDesign + timeAdd)
    const vat = Math.round(subtotal * 0.1)
    const total = subtotal + vat
    const totalMM = subtotal / MM_RATE
    const roleWeight: Record<string, number> = {}
    Object.entries(catSum).forEach(([catId, s]) => {
      const roles = ROLE_BY_CAT[catId] || []
      const share = s / roles.length
      roles.forEach(r => { roleWeight[r] = (roleWeight[r] || 0) + share })
    })
    if (baseSum > 0) {
      roleWeight.pm = (roleWeight.pm || 0) + baseSum * 0.15
      roleWeight.designer = (roleWeight.designer || 0) + baseSum * 0.12
    }
    const wSum = Object.values(roleWeight).reduce((a, b) => a + b, 0) || 1
    const teamMM: Record<string, number> = {}
    Object.entries(roleWeight).forEach(([r, w]) => { teamMM[r] = (w / wSum) * totalMM })
    const team = Object.entries(teamMM).filter(([, mm]) => mm >= 0.05).sort(([, a], [, b]) => b - a).map(([role, mm]) => ({ role, mm }))
    const parallel = Math.max(2.5, Math.min(6, team.length * 0.7))
    const calMonths = totalMM / parallel
    const tMult = TIMELINES.find(t => t.id === timeline)?.mult ?? 1
    const calAdjusted = calMonths / (tMult > 1 ? tMult * 0.9 : 1)
    return { baseSum, nativeAdd, designAdd, timeAdd, subtotal, vat, total, totalMM, team, calMonths: calAdjusted, designMult, timeMult }
  }, [selected, design, timeline, nativeMode])

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

  const totalItems = CATEGORIES.reduce((a, c) => a + c.items.length, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafafa] to-[#f0f4f9] text-slate-900">

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-white/70 backdrop-blur-2xl border-b border-slate-200/60' : 'bg-transparent'}`}>
        <div className="mx-auto flex h-[60px] max-w-[1320px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <Logo height={22} className="text-slate-900" />
            <span className="text-[12px] font-normal text-slate-500">제이씨랩</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/about" className="text-[13px] font-medium text-slate-500 transition-all hover:text-slate-900">회사소개</Link>
            <Link href="/estimate" className="text-[13px] font-bold text-slate-900 transition-all">자가견적</Link>
            <Link href="/about#문의" className="text-[13px] font-medium text-slate-500 transition-all hover:text-slate-900">문의</Link>
          </nav>
          <Link href="/about#문의" className="rounded-xl bg-slate-900 px-5 py-2 text-[13px] font-bold text-white transition-all hover:bg-slate-800 active:scale-95">프로젝트 의뢰</Link>
        </div>
      </header>

      {/* Hero */}
      <section className={`border-b border-slate-200/70 pt-[110px] pb-10 transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="mx-auto max-w-[1320px] px-6">
          <p className="text-[12px] font-semibold text-[#2979FF]">Self Estimate</p>
          <h1 className="mt-2 text-[38px] font-bold leading-[1.05] tracking-tight text-slate-900 md:text-[48px]">
            상세 항목별 자가견적
          </h1>
          <p className="mt-4 max-w-[640px] text-[14px] leading-relaxed text-slate-500">
            17개 카테고리 · {totalItems}개 세부 항목 · {PACKAGES.length}가지 패키지 × 5단계 티어. 네이티브/크로스, 디자인 수준, 일정 보정, 부가세까지 실시간 계산됩니다.
          </p>
        </div>
      </section>

      {/* PACKAGES CAROUSEL */}
      <section className="relative border-b border-slate-200/70 bg-white py-12">
        <div className="mx-auto max-w-[1320px] px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[12px] font-semibold text-[#2979FF]">Quick Start</p>
              <h2 className="mt-1 text-[22px] font-bold tracking-tight text-slate-900">{PACKAGES.length}개 패키지 프리셋</h2>
              <p className="mt-2 text-[13px] text-slate-500">서비스 유형과 5단계 티어 중 원하는 조합을 선택하면 자동으로 체크됩니다.</p>
            </div>
            {activePkg && <button onClick={clearAll} className="text-[12px] text-slate-400 hover:text-slate-700">선택 초기화</button>}
          </div>

          {/* 카테고리 필터 — 슬라이딩 알약 인디케이터 */}
          <div ref={tabsRef} className="relative mt-6 flex flex-wrap gap-2">
            {pill && (
              <span
                aria-hidden
                className="pointer-events-none absolute z-0 rounded-full bg-slate-900 shadow-[0_4px_16px_rgba(15,23,42,0.25)] transition-all duration-[450ms]"
                style={{
                  left: pill.left, top: pill.top, width: pill.width, height: pill.height,
                  transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
            )}
            {PACKAGE_CATEGORIES.map(c => {
              const active = pkgCategory === c.id
              return (
                <button
                  key={c.id} type="button" data-tab-id={c.id}
                  onClick={() => setPkgCategory(c.id)}
                  className={`relative z-10 rounded-full border px-4 py-2 text-[12px] font-semibold transition-colors duration-300 active:scale-95 ${active ? 'border-transparent text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900'}`}
                >
                  {c.label}
                </button>
              )
            })}
          </div>

          {/* Carousel */}
          <div className="relative mt-6">
            <button type="button" onClick={() => scrollCarousel('left')} aria-label="이전"
              className="group absolute left-0 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.6)] transition-all duration-300 hover:scale-110 hover:bg-white/60 hover:shadow-[0_12px_40px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.8)] active:scale-95 md:flex"
              style={{ width: 48, height: 48 }}>
              <ChevronLeft className="h-5 w-5 text-slate-800 transition-transform duration-200 group-hover:-translate-x-0.5" />
            </button>
            <button type="button" onClick={() => scrollCarousel('right')} aria-label="다음"
              className="group absolute right-0 top-1/2 z-20 hidden translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.6)] transition-all duration-300 hover:scale-110 hover:bg-white/60 hover:shadow-[0_12px_40px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.8)] active:scale-95 md:flex"
              style={{ width: 48, height: 48 }}>
              <ChevronRight className="h-5 w-5 text-slate-800 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>

            <div ref={carouselRef} key={pkgCategory}
              className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-visible scroll-smooth px-1 py-6"
              style={{ scrollbarWidth: 'none' }}>
              {filteredPackages.map((p, idx) => (
                <PackageCard key={p.id} p={p} idx={idx}
                  isActivePkg={activePkg === p.id}
                  activeTier={activeTier}
                  applyTier={applyTier}
                  onHoverEnter={(tier, rect) => { setHoverPkgTier({ pkg: p.id, tier }); setTooltipPos({ top: rect.bottom + 10, left: rect.left + rect.width / 2 }) }}
                  onHoverLeave={(tier) => { setHoverPkgTier(prev => prev?.pkg === p.id && prev.tier === tier ? null : prev); setTooltipPos(null) }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Floating Tooltip (fixed — carousel overflow 바깥) */}
      {hoverPkgTier && tooltipPos && (() => {
        const pkg = PACKAGES.find(p => p.id === hoverPkgTier.pkg)!
        const tierIds = pkg.tiers[hoverPkgTier.tier]
        const meta = TIER_META[hoverPkgTier.tier]
        // 뷰포트 우측 초과 방지
        const width = 320
        const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
        const leftClamped = Math.min(Math.max(tooltipPos.left, width / 2 + 16), vw - width / 2 - 16)
        return (
          <div
            className="pointer-events-none fixed z-[100] w-[320px] -translate-x-1/2 animate-[tooltipIn_0.15s_ease-out] rounded-xl border border-slate-200 bg-white p-4 text-left shadow-[0_16px_48px_rgba(15,23,42,0.18)]"
            style={{ top: tooltipPos.top, left: leftClamped }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold text-white ${meta.color}`}>{meta.label}</span>
                <span className="text-[11px] text-slate-500">{meta.desc}</span>
              </div>
              <span className="text-[11px] font-bold text-[#2979FF]">{priceOf(tierIds).toLocaleString()}만</span>
            </div>
            <p className="mt-2 text-[12px] font-bold text-slate-900">{pkg.label}</p>
            <div className="mt-3">
              <p className="mb-1.5 text-[10px] font-bold text-slate-400">포함 항목 ({tierIds.length}개)</p>
              <ul className="space-y-1">
                {tierIds.slice(0, 10).map(id => {
                  const item = ITEM_LOOKUP[id]
                  return item ? (
                    <li key={id} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <Check className="h-3 w-3 shrink-0 text-emerald-500" />
                      <span className="truncate">{item.label}</span>
                    </li>
                  ) : null
                })}
                {tierIds.length > 10 && (
                  <li className="pl-5 text-[10px] text-slate-400">…외 {tierIds.length - 10}개</li>
                )}
              </ul>
            </div>
          </div>
        )
      })()}

      {/* Body */}
      <section className="py-12" id="categories-section">
        <div className="mx-auto grid max-w-[1320px] gap-8 px-6 lg:grid-cols-[1fr_400px]">

          {/* LEFT */}
          <div className="space-y-4">

            {/* 프로젝트 조건 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_16px_rgba(15,23,42,0.03)]">
              <p className="text-[12px] font-semibold text-slate-400">Project Condition</p>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="mb-2 text-[11px] font-medium text-slate-500">개발 방식 (자동 감지)</p>
                  <div className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${nativeMode.id === 'both-native' ? 'border-[#2979FF]/40 bg-[#2979FF]/5' : 'border-slate-200 bg-slate-50'}`}>
                    <div>
                      <p className="text-[13px] font-bold text-slate-900">{nativeMode.label}</p>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {nativeMode.id === 'both-native' && 'iOS+Android 네이티브 양쪽 → 앱 기능 항목에 ×1.6 가중'}
                        {nativeMode.id === 'single-native' && '단일 네이티브 → 앱 기능 항목에 ×1.1 가중'}
                        {nativeMode.id === 'cross' && '크로스플랫폼 또는 단일 OS → 가중 없음'}
                      </p>
                    </div>
                    <span className="text-[14px] font-bold text-[#2979FF]">×{nativeMode.mult.toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-[11px] font-medium text-slate-500">디자인 수준</p>
                    <div className="flex gap-2">
                      {DESIGNS.map(d => (
                        <button key={d.id} type="button" onClick={() => setDesign(d.id)}
                          className={`flex-1 rounded-lg border px-3 py-2 text-[11px] font-bold transition-all duration-200 hover:scale-[1.02] ${design === d.id ? 'border-[#2979FF] bg-[#2979FF]/10 text-[#2979FF]' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}>
                          {d.label}
                          <span className="ml-1 text-[10px] opacity-60">×{d.mult.toFixed(2)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-[11px] font-medium text-slate-500">일정</p>
                    <div className="flex gap-2">
                      {TIMELINES.map(t => (
                        <button key={t.id} type="button" onClick={() => setTimeline(t.id)}
                          className={`flex-1 rounded-lg border px-3 py-2 text-[11px] font-bold transition-all duration-200 hover:scale-[1.02] ${timeline === t.id ? 'border-[#2979FF] bg-[#2979FF]/10 text-[#2979FF]' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}>
                          {t.label}
                          <span className="ml-1 text-[10px] opacity-60">×{t.mult.toFixed(2)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 검색 */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="항목 검색 (예: 결제, 로그인, 채팅, 푸시…)"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-11 text-[14px] text-slate-900 outline-none shadow-[0_2px_8px_rgba(15,23,42,0.03)] transition-all placeholder-slate-400 focus:border-[#2979FF] focus:shadow-[0_4px_16px_rgba(41,121,255,0.1)]"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
                  <X className="h-4 w-4" />
                </button>
              )}
              {q && (
                <p className="mt-2 pl-2 text-[11px] text-slate-500">
                  {Object.values(searchMatches ?? {}).reduce((a, s) => a + s.size, 0)}개 항목이 &ldquo;<span className="font-semibold text-[#2979FF]">{query}</span>&rdquo;와 일치합니다.
                </p>
              )}
            </div>

            {/* 카테고리 */}
            {CATEGORIES.map((cat, catIdx) => {
              if (searchMatches && !searchMatches[cat.id]) return null
              const isOpen = searchMatches ? true : open.has(cat.id)
              const selCount = cat.items.filter(i => selected.has(i.id)).length
              const catTotal = cat.items.filter(i => selected.has(i.id)).reduce((a, b) => a + b.price, 0)
              const visibleItems = searchMatches ? cat.items.filter(i => searchMatches[cat.id].has(i.id)) : cat.items
              return (
                <div key={cat.id} style={{ animationDelay: `${catIdx * 30}ms` }} className="animate-[fadeUp_0.5s_ease-out_both] rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-slate-300 hover:shadow-[0_6px_24px_rgba(15,23,42,0.04)]">
                  <div className="flex items-center justify-between px-5 py-4">
                    <button type="button" onClick={() => toggleCat(cat.id)} className="flex flex-1 items-center gap-3 text-left">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2979FF]/10 text-[#2979FF] transition-transform duration-300 hover:scale-110">{cat.icon}</div>
                      <div>
                        <p className="text-[11px] font-medium text-slate-400">{cat.tag}</p>
                        <p className="text-[15px] font-bold text-slate-900">{cat.title}</p>
                      </div>
                    </button>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400">{selCount}/{cat.items.length}</span>
                      {catTotal > 0 && <span className="text-[12px] font-bold text-[#2979FF]">+{catTotal.toLocaleString()}만</span>}
                      {!searchMatches && (
                        <button type="button" onClick={() => toggleCat(cat.id)} className="text-slate-400 hover:text-slate-700">
                          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="animate-[fadeUp_0.3s_ease-out] border-t border-slate-100">
                      {!searchMatches && (
                        <div className="flex items-center justify-end gap-3 px-5 py-2 text-[10px] text-slate-400">
                          <button type="button" onClick={() => selectAllInCat(cat.id)} className="transition-colors hover:text-slate-700">전체 선택</button>
                          <span className="text-slate-200">|</span>
                          <button type="button" onClick={() => clearCat(cat.id)} className="transition-colors hover:text-slate-700">전체 해제</button>
                        </div>
                      )}
                      <ul>
                        {visibleItems.map(item => {
                          const active = selected.has(item.id)
                          return (
                            <li key={item.id}>
                              <button type="button" onClick={() => toggle(item.id)}
                                className={`group flex w-full items-center gap-3 border-t border-slate-100 px-5 py-3 text-left transition-all duration-200 ${active ? 'bg-[#2979FF]/[0.06]' : 'hover:bg-slate-50'}`}>
                                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200 ${active ? 'border-[#2979FF] bg-[#2979FF]' : 'border-slate-300 bg-white group-hover:border-slate-500'}`}>
                                  {active && <Check className="h-3.5 w-3.5 animate-[checkIn_0.25s_ease-out] text-white" />}
                                </div>
                                <span className={`flex-1 text-[13px] ${active ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>{item.label}</span>
                                <span className={`text-[12px] ${active ? 'font-bold text-[#2979FF]' : 'text-slate-400'}`}>+{item.price.toLocaleString()}만</span>
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
            <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-7">
              <p className="text-[12px] font-semibold text-[#2979FF]">Request Quotation</p>
              <h2 className="mt-1 text-[22px] font-bold tracking-tight text-slate-900">상세 견적서 요청</h2>
              <p className="mt-2 text-[13px] text-slate-500">현재 선택 내용을 기반으로 담당 PM이 영업일 기준 1일 내 정식 견적서와 일정 제안을 드립니다.</p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[14px] text-slate-900 outline-none transition-all placeholder-slate-400 focus:border-[#2979FF] focus:bg-white" placeholder="회사명 / 소속" value={contact.company} onChange={e => setContact({ ...contact, company: e.target.value })} />
                  <input className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[14px] text-slate-900 outline-none transition-all placeholder-slate-400 focus:border-[#2979FF] focus:bg-white" placeholder="담당자명 *" value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })} required />
                  <input className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[14px] text-slate-900 outline-none transition-all placeholder-slate-400 focus:border-[#2979FF] focus:bg-white" placeholder="연락처 *" value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} required />
                  <input className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[14px] text-slate-900 outline-none transition-all placeholder-slate-400 focus:border-[#2979FF] focus:bg-white" placeholder="이메일" type="email" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} />
                </div>
                <textarea className="h-28 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[14px] text-slate-900 outline-none transition-all placeholder-slate-400 focus:border-[#2979FF] focus:bg-white" placeholder="추가 전달사항 (참고 서비스, 예상 사용자 수, 특별 요구사항 등)" value={contact.memo} onChange={e => setContact({ ...contact, memo: e.target.value })} />
                <button type="submit" disabled={sending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-[15px] font-bold text-white transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50">
                  <Send className="h-4 w-4" /> {sending ? '전송 중...' : '상세 견적서 받기'}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT */}
          <aside>
            <div className="sticky top-[80px] space-y-4">
              <div className="relative overflow-hidden rounded-2xl border-2 border-[#2979FF] bg-gradient-to-br from-white to-[#f0f7ff] p-6 shadow-[0_12px_40px_rgba(41,121,255,0.12)] transition-all duration-300 hover:shadow-[0_16px_56px_rgba(41,121,255,0.18)]">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#2979FF]/10 blur-3xl" />
                <div className="relative">
                  <p className="text-[12px] font-semibold text-[#2979FF]">Total Estimate</p>
                  <p className="mt-3 text-[11px] text-slate-500">공급가 <span className="text-slate-400">· VAT 별도</span></p>
                  <p key={calc.subtotal} className="mt-1 animate-[priceBump_0.35s_ease-out] bg-gradient-to-r from-slate-900 to-[#2979FF] bg-clip-text text-[42px] font-bold leading-tight tracking-tight text-transparent">
                    {fmt(calc.subtotal)}<span className="ml-1 text-[14px] font-medium text-slate-400">원</span>
                  </p>

                  <div className="mt-5 space-y-1.5 border-t border-slate-100 pt-4 text-[12px]">
                    <div className="flex justify-between text-slate-500"><span>항목 합계</span><span className="text-slate-900">{calc.baseSum.toLocaleString()}만</span></div>
                    {calc.nativeAdd > 0 && (
                      <div className="flex justify-between text-slate-500"><span>네이티브 보정 (×{nativeMode.mult.toFixed(2)})</span><span className="text-slate-900">+{Math.round(calc.nativeAdd).toLocaleString()}만</span></div>
                    )}
                    {calc.designAdd > 0 && (
                      <div className="flex justify-between text-slate-500"><span>디자인 보정 (×{calc.designMult.toFixed(2)})</span><span className="text-slate-900">+{Math.round(calc.designAdd).toLocaleString()}만</span></div>
                    )}
                    {calc.timeAdd > 0 && (
                      <div className="flex justify-between text-slate-500"><span>일정 보정 (×{calc.timeMult.toFixed(2)})</span><span className="text-slate-900">+{Math.round(calc.timeAdd).toLocaleString()}만</span></div>
                    )}
                    <div className="flex justify-between border-t border-slate-100 pt-2 text-[13px]"><span className="font-bold text-slate-900">공급가</span><span className="font-bold text-[#2979FF]">{calc.subtotal.toLocaleString()}만</span></div>
                    <div className="flex justify-between text-slate-500"><span>부가세 (10%)</span><span className="text-slate-900">+{calc.vat.toLocaleString()}만</span></div>
                    <div className="flex justify-between text-slate-500"><span>VAT 포함 최종</span><span className="text-slate-700">{(calc.subtotal + calc.vat).toLocaleString()}만</span></div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_16px_rgba(15,23,42,0.03)]">
                <p className="text-[12px] font-semibold text-slate-400">Team Allocation</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] text-slate-500">총 맨먼스</p>
                    <p className="mt-1 text-[24px] font-bold text-[#2979FF]">{calc.totalMM.toFixed(1)}<span className="ml-1 text-[12px] font-normal text-slate-400">MM</span></p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500">예상 기간</p>
                    <p className="mt-1 text-[24px] font-bold text-[#2979FF]">{Math.max(0.5, calc.calMonths).toFixed(1)}<span className="ml-1 text-[12px] font-normal text-slate-400">개월</span></p>
                  </div>
                </div>

                {calc.team.length > 0 ? (
                  <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                    {calc.team.map(({ role, mm }, i) => (
                      <li key={role} style={{ animationDelay: `${i * 40}ms` }} className="flex animate-[fadeUp_0.4s_ease-out_both] items-center justify-between text-[12px]">
                        <span className="text-slate-600">{ROLE_LABEL[role] || role}</span>
                        <span className="font-mono text-slate-900">{mm.toFixed(1)} MM</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-5 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[12px] text-amber-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>좌측에서 항목을 선택해주세요.</span>
                  </div>
                )}

                <p className="mt-4 text-[10px] leading-relaxed text-slate-400">맨먼스 단가 평균 {MM_RATE.toLocaleString()}만원 (혼합 인력 기준) 적용.</p>
              </div>

              <div className="space-y-2">
                <button type="button" onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#2979FF] py-3 text-[13px] font-bold text-white transition-all duration-200 hover:bg-[#1E6AE1] hover:shadow-[0_8px_24px_rgba(41,121,255,0.35)] active:scale-[0.98]">
                  상세 견적서 받기 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <Link href="/about#문의" className="flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white py-3 text-[13px] font-bold text-slate-700 transition-all hover:bg-slate-50">
                  직접 상담 요청
                </Link>
              </div>

              <p className="text-[10px] leading-relaxed text-slate-400">
                본 견적은 자동 계산된 참고 금액이며 실제 계약 금액과 다를 수 있습니다. 정확한 견적은 기능 명세서 기반의 상세 상담 후 확정됩니다.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/70 bg-white py-12">
        <div className="mx-auto max-w-[1320px] px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Logo height={20} className="text-slate-900" />
                <span className="text-[13px] text-slate-500">제이씨랩</span>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">App Development Studio · contact@jaicylab.com</p>
              <p className="text-[10px] text-slate-300">Copyright &copy; JAICYLAB. All rights reserved.</p>
            </div>
            <div className="flex gap-4 text-[12px] text-slate-400">
              <Link href="/" className="transition-colors hover:text-slate-700">홈</Link>
              <Link href="/about" className="transition-colors hover:text-slate-700">회사소개</Link>
              <Link href="/about#문의" className="transition-colors hover:text-slate-700">문의</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
