'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Check, ArrowRight, ChevronDown, Send, AlertCircle, Smartphone, Palette, ShieldCheck, CreditCard, Bell, MessageSquare, Image as ImgIcon, MapPin, Sparkles, CalendarCheck, BarChart3, Lock, Server, Package, Wand2, ShoppingBag, Trophy, Briefcase, Home, Users2, UtensilsCrossed, BookOpen, Heart } from 'lucide-react'
import { toast } from 'sonner'
import { Logo } from '@/components/Logo'

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
      { id: 'ds-userflow', label: '유저 플로우 설계', price: 40 },
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
      { id: 'au-remember', label: '자동 로그인', price: 15 },
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
      { id: 'no-apns', label: '푸시 알림 (APNs) - iOS 셋업', price: 40 },
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
      { id: 'lo-perm', label: '위치 권한 요청 UX', price: 15 },
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
    id: 'extra', title: '부가 서비스 / 스토어', tag: 'EXTRA', icon: <Package className="h-4 w-4" />, items: [
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
      { id: 'ex-maintenance-3m', label: '출시 후 3개월 유지보수 계약', price: 470 },
      { id: 'ex-maintenance-6m', label: '출시 후 6개월 유지보수 계약', price: 850 },
      { id: 'ex-handover', label: '소스 인수인계 / 기술 이전', price: 130 },
    ],
  },
]

// ───── 패키지 + 5단계 티어 ─────
type TierId = 'mvp' | 'basic' | 'premium' | 'deluxe' | 'enterprise'
const TIER_ORDER: TierId[] = ['mvp', 'basic', 'premium', 'deluxe', 'enterprise']
const TIER_META: Record<TierId, { label: string; desc: string; color: string }> = {
  mvp:        { label: 'MVP',        desc: '최소 검증',     color: 'bg-slate-400' },
  basic:      { label: 'Basic',      desc: '표준 출시',     color: 'bg-sky-500' },
  premium:    { label: 'Premium',    desc: '완성도 +α',    color: 'bg-blue-600' },
  deluxe:     { label: 'Deluxe',     desc: '고도화 기능',   color: 'bg-indigo-600' },
  enterprise: { label: 'Enterprise', desc: '대규모·컴플',   color: 'bg-slate-900' },
}

type Pkg = { id: string; label: string; sub: string; icon: React.ReactNode; tiers: Record<TierId, string[]> }

// 누적식 정의: 각 티어는 이전 티어 항목을 모두 포함하고 추가 항목만 명시
function build(base: string[], add: Partial<Record<TierId, string[]>>): Record<TierId, string[]> {
  const r: Record<TierId, string[]> = { mvp: [], basic: [], premium: [], deluxe: [], enterprise: [] }
  let cur = [...base]
  r.mvp = [...cur]
  for (const t of ['basic', 'premium', 'deluxe', 'enterprise'] as TierId[]) {
    cur = [...cur, ...(add[t] ?? [])]
    r[t] = [...cur]
  }
  return r
}

const PACKAGES: Pkg[] = [
  {
    id: 'corp', label: '회사 홈페이지', sub: '소개 / 채용 / 문의', icon: <Home className="h-4 w-4" />,
    tiers: build(
      ['pf-landing', 'se-privacy', 'se-terms', 'in-vercel', 'in-domain', 'ex-cs'],
      {
        basic: ['pf-corp-site', 'ds-research', 'ds-ui-key', 'ds-responsive', 'an-page', 'an-scroll-reveal', 'ex-seo-basic', 'ex-faq'],
        premium: ['ds-ui-mid', 'ds-system', 'ds-darkmode', 'an-hero', 'an-parallax', 'an-skeleton', 'an-tap', 'ex-seo-pro', 'ex-channel-talk', 'in-sentry', 'in-cdn'],
        deluxe: ['ds-ui-full', 'an-spline', 'an-3d-tilt', 'an-cursor', 'an-blur', 'an-particle', 'ex-i18n-setup', 'ex-lang-en', 'da-ga', 'no-email'],
        enterprise: ['ds-ui-xl', 'ds-illustration', 'ds-figma', 'ex-lang-jp', 'ex-lang-cn', 'da-amplitude', 'da-funnel', 'da-ab', 'se-privacy-custom', 'se-terms-custom', 'se-cookie', 'in-cicd'],
      },
    ),
  },
  {
    id: 'shop', label: '쇼핑몰', sub: '상품 · 결제 · 배송', icon: <ShoppingBag className="h-4 w-4" />,
    tiers: build(
      ['pf-rn', 'pf-splash', 'pf-tabbar', 'au-signup', 'au-login', 'au-kakao', 'cm-catalog', 'cm-detail', 'cm-cart', 'cm-order', 'py-toss', 'se-privacy', 'se-terms', 'in-supabase', 'in-domain'],
      {
        basic: ['pf-admin', 'ds-ui-key', 'ds-system', 'au-pwreset', 'au-profile', 'cm-options', 'cm-search', 'cm-filter', 'cm-sort', 'cm-stock', 'cm-order-history', 'cm-shipping-addr', 'cm-shipping-track', 'py-iap-ios', 'py-iap-aos', 'no-fcm', 'no-apns', 'cm-admin-product', 'cm-admin-order'],
        premium: ['ds-ui-mid', 'an-page', 'an-skeleton', 'an-like', 'an-snap', 'cm-wishlist', 'cm-recent', 'cm-review', 'cm-qna', 'cm-section', 'cm-order-cancel', 'py-coupon', 'py-point-earn', 'py-point-use', 'py-tax-bill', 'py-cash-receipt', 'no-katalk-alert', 'no-email', 'se-consent', 'in-cdn', 'in-sentry', 'ex-appstore', 'ex-playstore', 'ex-icon'],
        deluxe: ['ds-ui-full', 'cm-event', 'cm-flash', 'cm-grade', 'cm-gift', 'cm-options-comb', 'cm-search-image', 'cm-soldout', 'py-naverpay', 'py-kakaopay', 'py-applepay', 'py-samsungpay', 'py-card', 'py-subscription', 'py-refund-auto', 'so-review', 'so-share', 'no-rich', 'no-chat-1on1', 'da-kpi', 'da-charts', 'da-ga', 'ex-screenshot', 'in-cicd', 'in-backup'],
        enterprise: ['ds-ui-xl', 'ds-motion-spec', 'cm-multiseller', 'cm-subscribe-box', 'py-stripe', 'py-paypal', 'py-escrow', 'py-corp', 'py-settle', 'py-dashboard', 'py-excel', 'da-realtime', 'da-amplitude', 'da-funnel', 'da-cohort', 'da-segment', 'da-ab', 'da-bigquery', 'se-encrypt', 'se-audit', 'se-2fa', 'se-waf', 'se-ismsp', 'se-pen-test', 'in-aws', 'in-db-rdb', 'in-redis', 'in-k8s', 'in-apm', 'in-loadtest', 'ex-maintenance-3m'],
      },
    ),
  },
  {
    id: 'freelance', label: '프리랜서 매칭', sub: '몰앤몰 / 인력 매칭', icon: <Briefcase className="h-4 w-4" />,
    tiers: build(
      ['pf-rn', 'pf-splash', 'au-signup', 'au-login', 'au-kakao', 'sc-booking', 'sc-match', 'no-chat-1on1', 'py-toss', 'se-privacy', 'se-terms', 'in-supabase', 'in-domain'],
      {
        basic: ['pf-admin', 'pf-tabbar', 'ds-ui-key', 'ds-system', 'au-profile', 'au-avatar', 'au-pass', 'sc-cal', 'sc-slot', 'sc-shift', 'so-review', 'so-rating', 'no-fcm', 'no-apns', 'lo-kakao', 'lo-address'],
        premium: ['ds-ui-mid', 'an-page', 'an-skeleton', 'au-rbac', 'sc-noshow', 'sc-bid', 'sc-attendance', 'so-report', 'so-block', 'no-katalk-alert', 'no-chat-media', 'no-chat-read', 'lo-gps', 'lo-autocomplete', 'py-escrow', 'py-coupon', 'ex-appstore', 'ex-playstore', 'ex-icon'],
        deluxe: ['ds-ui-full', 'au-team', 'au-invite', 'sc-auto-shift', 'sc-google-cal', 'sc-waiting', 'no-chat-typing', 'no-chat-emoji', 'py-settle', 'py-tax-bill', 'py-cash-receipt', 'py-point-earn', 'da-kpi', 'da-charts', 'ai-chatbot', 'ai-reco-rule', 'in-cdn', 'in-sentry', 'ex-i18n-setup', 'ex-seo-basic'],
        enterprise: ['ds-ui-xl', 'au-sso', 'au-device', 'au-session', 'py-dashboard', 'py-excel', 'da-realtime', 'da-funnel', 'da-cohort', 'se-encrypt', 'se-audit', 'se-ismsp', 'in-aws', 'in-redis', 'in-apm', 'in-loadtest', 'in-cicd', 'ex-maintenance-3m'],
      },
    ),
  },
  {
    id: 'community', label: '커뮤니티 / SNS', sub: '게시판 + 피드 + DM', icon: <Users2 className="h-4 w-4" />,
    tiers: build(
      ['pf-rn', 'pf-splash', 'pf-tabbar', 'au-signup', 'au-login', 'au-kakao', 'so-board-list', 'so-board-crud', 'so-comment', 'so-like', 'no-fcm', 'no-apns', 'se-privacy', 'se-terms', 'in-supabase', 'in-domain'],
      {
        basic: ['ds-ui-key', 'ds-system', 'ds-darkmode', 'an-page', 'an-pull', 'an-skeleton', 'an-like', 'au-google', 'au-apple', 'au-profile', 'au-avatar', 'au-nickname', 'so-board-cat', 'so-board-image', 'so-reply', 'so-bookmark', 'so-follow', 'so-hashtag', 'so-search', 'so-report', 'so-block'],
        premium: ['ds-ui-mid', 'an-stagger', 'an-scroll-reveal', 'an-shared', 'an-modal', 'so-mention', 'so-dm', 'so-filter', 'so-feed-time', 'so-feed-follow', 'so-share', 'me-upload', 'me-cdn', 'me-resize', 'me-thumb', 'no-targeting', 'no-rich', 'ex-appstore', 'ex-playstore', 'ex-icon'],
        deluxe: ['ds-ui-full', 'an-particle', 'an-confetti', 'an-blur', 'so-reply-tree', 'so-feed-rank', 'so-story', 'so-shorts', 'so-review', 'so-search-elastic', 'so-filter-ai', 'me-video-up', 'me-hls', 'me-filter', 'me-webrtc-1on1', 'gm-badge', 'gm-level', 'gm-streak', 'da-kpi', 'da-ga'],
        enterprise: ['ds-ui-xl', 'ai-chatbot', 'ai-reco-ml', 'ai-sentiment', 'me-webrtc-group', 'me-live', 'me-drm', 'au-sso', 'au-passkey', 'se-encrypt', 'se-audit', 'se-ismsp', 'in-aws', 'in-redis', 'in-db-rdb', 'in-k8s', 'in-apm', 'in-loadtest', 'ex-maintenance-3m'],
      },
    ),
  },
  {
    id: 'delivery', label: '배달 / O2O', sub: '주문 + 위치 + 라이더', icon: <UtensilsCrossed className="h-4 w-4" />,
    tiers: build(
      ['pf-rn', 'pf-splash', 'pf-tabbar', 'au-signup', 'au-kakao', 'cm-catalog', 'cm-detail', 'cm-cart', 'cm-order', 'lo-kakao', 'lo-gps', 'lo-address', 'py-toss', 'no-fcm', 'no-apns', 'se-privacy', 'se-terms', 'in-supabase', 'in-domain'],
      {
        basic: ['pf-admin', 'ds-ui-key', 'ds-system', 'au-pass', 'au-profile', 'cm-options', 'cm-order-history', 'cm-shipping-addr', 'lo-track', 'lo-route', 'lo-eta', 'lo-geofence', 'py-kakaopay', 'py-naverpay', 'no-katalk-alert', 'so-review', 'so-rating'],
        premium: ['ds-ui-mid', 'an-page', 'an-skeleton', 'au-google', 'cm-admin-product', 'cm-admin-order', 'cm-review', 'cm-section', 'lo-route-opt', 'lo-rider-match', 'lo-pickup', 'lo-autocomplete', 'lo-reverse', 'py-coupon', 'py-point-earn', 'no-rich', 'ex-appstore', 'ex-playstore', 'ex-icon'],
        deluxe: ['ds-ui-full', 'cm-event', 'cm-flash', 'cm-grade', 'py-card', 'py-settle', 'py-dashboard', 'ai-chatbot', 'ai-reco-rule', 'no-chat-1on1', 'sc-attendance', 'da-kpi', 'da-charts', 'da-realtime', 'se-encrypt', 'in-redis', 'in-cicd', 'in-backup'],
        enterprise: ['ds-ui-xl', 'ds-motion-spec', 'cm-multiseller', 'cm-subscribe-box', 'py-escrow', 'py-tax-bill', 'py-corp', 'py-stripe', 'ai-reco-ml', 'da-funnel', 'da-cohort', 'da-bigquery', 'se-audit', 'se-waf', 'se-ismsp', 'in-aws', 'in-k8s', 'in-apm', 'in-loadtest', 'ex-maintenance-3m'],
      },
    ),
  },
  {
    id: 'edu', label: '교육 / LMS', sub: '강의 + 진도 + 결제', icon: <BookOpen className="h-4 w-4" />,
    tiers: build(
      ['pf-rn', 'pf-splash', 'pf-tabbar', 'au-signup', 'au-login', 'au-google', 'me-video-up', 'me-hls', 'py-toss', 'no-fcm', 'no-apns', 'se-privacy', 'se-terms', 'in-supabase', 'in-domain'],
      {
        basic: ['pf-web', 'pf-admin', 'ds-ui-key', 'ds-system', 'au-profile', 'au-pwreset', 'me-podcast', 'me-pdf-view', 'so-comment', 'so-rating', 'py-subscription', 'py-coupon', 'gm-attendance', 'gm-streak'],
        premium: ['ds-ui-mid', 'an-page', 'an-skeleton', 'an-progress', 'me-drm', 'me-audio', 'so-review', 'so-report', 'gm-badge', 'gm-level', 'gm-mission', 'gm-leaderboard', 'py-tax-bill', 'no-katalk-alert', 'no-email', 'da-kpi', 'da-funnel', 'ex-appstore', 'ex-playstore', 'ex-icon'],
        deluxe: ['ds-ui-full', 'an-count', 'an-confetti', 'me-webrtc-1on1', 'me-recording', 'me-screenshare', 'so-feed-follow', 'so-search', 'gm-challenge', 'gm-reward', 'gm-referral', 'ai-chatbot', 'ai-stt', 'ai-summary', 'da-charts', 'da-ga', 'da-amplitude', 'se-consent', 'in-cdn', 'ex-seo-basic'],
        enterprise: ['ds-ui-xl', 'ai-rag', 'ai-tts', 'ai-translate', 'ai-reco-ml', 'me-webrtc-group', 'me-live', 'au-sso', 'au-passkey', 'se-encrypt', 'se-audit', 'se-ismsp', 'in-aws', 'in-redis', 'in-k8s', 'in-apm', 'ex-lang-en', 'ex-lang-jp', 'ex-maintenance-3m', 'ex-aso'],
      },
    ),
  },
  {
    id: 'fitness', label: '헬스 / 피트니스', sub: '운동 기록 + 챌린지', icon: <Heart className="h-4 w-4" />,
    tiers: build(
      ['pf-rn', 'pf-splash', 'pf-tabbar', 'au-signup', 'au-google', 'au-apple', 'lo-gps', 'gm-attendance', 'gm-streak', 'no-fcm', 'no-apns', 'se-privacy', 'se-terms', 'in-supabase', 'in-domain'],
      {
        basic: ['ds-ui-key', 'ds-system', 'au-profile', 'au-avatar', 'lo-route', 'me-upload', 'me-cdn', 'gm-badge', 'gm-mission', 'so-follow', 'so-feed-follow', 'so-like', 'da-kpi'],
        premium: ['ds-ui-mid', 'an-page', 'an-progress', 'an-count', 'an-confetti', 'pf-widget-ios', 'pf-watch', 'gm-level', 'gm-leaderboard', 'gm-challenge', 'gm-reward', 'so-share', 'no-rich', 'da-charts', 'da-ga', 'ex-appstore', 'ex-playstore', 'ex-icon'],
        deluxe: ['ds-ui-full', 'an-particle', 'pf-widget-android', 'ai-pose', 'ai-tts', 'ai-stt', 'so-dm', 'so-review', 'py-toss', 'py-subscription', 'no-chat-1on1', 'da-amplitude', 'da-funnel', 'in-cdn', 'in-sentry'],
        enterprise: ['ds-ui-xl', 'ai-reco-ml', 'ai-face', 'me-webrtc-1on1', 'me-live', 'au-sso', 'se-encrypt', 'se-audit', 'se-ismsp', 'in-aws', 'in-redis', 'in-apm', 'in-loadtest', 'ex-lang-en', 'ex-maintenance-3m', 'ex-aso'],
      },
    ),
  },
]

// ───── 옵션 ─────
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
  platform: ['pm', 'designer', 'mobile'],
  design: ['designer', 'pm'],
  anim: ['designer', 'mobile', 'frontend'],
  auth: ['backend', 'mobile'],
  pay: ['backend', 'mobile'],
  noti: ['backend', 'mobile'],
  social: ['backend', 'mobile', 'frontend'],
  media: ['backend', 'mobile', 'devops'],
  commerce: ['backend', 'mobile', 'frontend'],
  loc: ['mobile', 'backend'],
  ai: ['ai', 'backend'],
  sched: ['backend', 'mobile'],
  data: ['frontend', 'backend'],
  gam: ['mobile', 'backend', 'designer'],
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

const PLATFORM_ITEM_IDS = new Set(CATEGORIES.find(c => c.id === 'platform')!.items.map(i => i.id))

function fmt(manwon: number) {
  if (manwon >= 10000) return `${(manwon / 10000).toFixed(2)}억 ${(manwon % 10000).toLocaleString()}만`
  return `${Math.round(manwon).toLocaleString()}만`
}

// 카테고리 기반 가격 합산 (티어 미리보기용)
function priceOf(ids: string[]) {
  let s = 0
  CATEGORIES.forEach(cat => cat.items.forEach(it => { if (ids.includes(it.id)) s += it.price }))
  return s
}

// ───────────────────────────── PAGE ─────────────────────────────

export default function EstimatePage() {
  const [selected, setSelected] = useState<Set<string>>(new Set(PACKAGES[1].tiers.basic))
  const [open, setOpen] = useState<Set<string>>(new Set(['platform', 'anim']))
  const [design, setDesign] = useState('custom')
  const [timeline, setTimeline] = useState('normal')
  const [contact, setContact] = useState({ company: '', name: '', phone: '', email: '', memo: '' })
  const [sending, setSending] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [activePkg, setActivePkg] = useState<string | null>('shop')
  const [activeTier, setActiveTier] = useState<TierId | null>('basic')

  useEffect(() => {
    const h = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', h, { passive: true })
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
    ids.forEach(id => CATEGORIES.forEach(c => { if (c.items.find(i => i.id === id)) cats.add(c.id) }))
    setOpen(cats)
  }
  function clearAll() {
    setSelected(new Set()); setActivePkg(null); setActiveTier(null)
  }

  const nativeMode = useMemo(() => {
    const ios = selected.has('pf-ios')
    const aos = selected.has('pf-android')
    const cross = selected.has('pf-rn') || selected.has('pf-flutter')
    if (ios && aos && !cross) return { id: 'both-native', mult: 1.6, label: 'iOS + Android 양쪽 네이티브' }
    if ((ios || aos) && !cross) return { id: 'single-native', mult: 1.1, label: '단일 네이티브' }
    return { id: 'cross', mult: 1.0, label: '크로스플랫폼 / 단일 OS' }
  }, [selected])

  const calc = useMemo(() => {
    let baseSum = 0
    let appSum = 0
    const catSum: Record<string, number> = {}
    CATEGORIES.forEach(cat => {
      let s = 0
      cat.items.forEach(it => {
        if (selected.has(it.id)) {
          s += it.price
          if (!PLATFORM_ITEM_IDS.has(it.id)) appSum += it.price
        }
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
    <div className="min-h-screen bg-[#fafafa] text-slate-900">

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-white/80 backdrop-blur-2xl border-b border-slate-200' : 'bg-transparent'}`}>
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
          <Link href="/about#문의" className="bg-slate-900 px-5 py-2 text-[13px] font-bold text-white transition-all hover:bg-slate-800 active:scale-95">프로젝트 의뢰</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-slate-200 pt-[110px] pb-10">
        <div className="mx-auto max-w-[1320px] animate-[fadeUp_0.6s_ease-out] px-6">
          <p className="text-[11px] font-bold tracking-[0.15em] text-[#2979FF]">SELF ESTIMATE</p>
          <h1 className="mt-3 text-[36px] font-bold leading-[1.1] tracking-tight text-slate-900 md:text-[44px]">
            상세 항목별 자가견적
          </h1>
          <p className="mt-4 max-w-[640px] text-[14px] leading-relaxed text-slate-500">
            17개 카테고리 · 약 {totalItems}개 세부 항목 · 7가지 패키지 × 5단계 티어. 네이티브/크로스, 디자인 수준, 일정 보정, 부가세까지 실시간 계산됩니다.
          </p>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="border-b border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-[1320px] px-6">
          <div className="flex items-baseline justify-between">
            <p className="text-[11px] font-bold tracking-[0.12em] text-[#2979FF]">QUICK START · 패키지 프리셋</p>
            {activePkg && <button onClick={clearAll} className="text-[11px] text-slate-400 hover:text-slate-700">전체 초기화</button>}
          </div>
          <p className="mt-2 text-[13px] text-slate-500">서비스 유형을 고르고 5단계 중 원하는 티어를 선택하면 항목이 자동 체크됩니다. 이후 좌측에서 자유롭게 추가/제거 하세요.</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {PACKAGES.map(p => {
              const isActivePkg = activePkg === p.id
              return (
                <div key={p.id} className={`flex flex-col border bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(15,23,42,0.06)] ${isActivePkg ? 'border-[#2979FF] shadow-[0_4px_24px_rgba(41,121,255,0.12)]' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center ${isActivePkg ? 'bg-[#2979FF] text-white' : 'bg-slate-100 text-slate-600'}`}>{p.icon}</div>
                    <div className="flex-1">
                      <p className="text-[14px] font-bold text-slate-900">{p.label}</p>
                      <p className="mt-0.5 text-[11px] text-slate-500">{p.sub}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-5 gap-1">
                    {TIER_ORDER.map(t => {
                      const ids = p.tiers[t]
                      const tierActive = isActivePkg && activeTier === t
                      const meta = TIER_META[t]
                      const tierPrice = priceOf(ids)
                      return (
                        <button
                          key={t} type="button" onClick={() => applyTier(p, t)}
                          title={`${meta.label} · ${ids.length}개 항목 · ${tierPrice.toLocaleString()}만`}
                          className={`group relative flex flex-col items-center justify-center border py-2 text-[10px] font-bold transition-all duration-200 hover:scale-[1.04] active:scale-95 ${tierActive ? 'border-[#2979FF] bg-[#2979FF]/10 text-[#2979FF]' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-white'}`}
                        >
                          <span className={`absolute left-0 top-0 h-[2px] w-full ${meta.color}`} />
                          <span className="mt-0.5">{meta.label}</span>
                          <span className="mt-0.5 text-[9px] font-normal opacity-60">{ids.length}항목</span>
                        </button>
                      )
                    })}
                  </div>
                  {isActivePkg && activeTier && (
                    <p className="mt-2 text-[11px] text-[#2979FF]">
                      <span className="font-bold">{TIER_META[activeTier].label}</span>
                      <span className="ml-1 text-slate-400">· {TIER_META[activeTier].desc} · {priceOf(p.tiers[activeTier]).toLocaleString()}만 (보정 전)</span>
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-12">
        <div className="mx-auto grid max-w-[1320px] gap-8 px-6 lg:grid-cols-[1fr_400px]">

          {/* LEFT */}
          <div className="space-y-4">

            {/* 프로젝트 조건 */}
            <div className="border border-slate-200 bg-white p-5">
              <p className="text-[11px] font-bold tracking-[0.12em] text-slate-400">PROJECT CONDITION</p>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-[11px] text-slate-500 mb-2">개발 방식 (자동 감지)</p>
                  <div className={`flex items-center justify-between border px-4 py-3 ${nativeMode.id === 'both-native' ? 'border-[#2979FF]/40 bg-[#2979FF]/5' : 'border-slate-200 bg-slate-50'}`}>
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
                    <p className="text-[11px] text-slate-500 mb-2">디자인 수준</p>
                    <div className="flex gap-2">
                      {DESIGNS.map(d => (
                        <button key={d.id} type="button" onClick={() => setDesign(d.id)}
                          className={`flex-1 border px-3 py-2 text-[11px] font-bold transition-all ${design === d.id ? 'border-[#2979FF] bg-[#2979FF]/10 text-[#2979FF]' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}>
                          {d.label}
                          <span className="ml-1 text-[10px] opacity-60">×{d.mult.toFixed(2)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 mb-2">일정</p>
                    <div className="flex gap-2">
                      {TIMELINES.map(t => (
                        <button key={t.id} type="button" onClick={() => setTimeline(t.id)}
                          className={`flex-1 border px-3 py-2 text-[11px] font-bold transition-all ${timeline === t.id ? 'border-[#2979FF] bg-[#2979FF]/10 text-[#2979FF]' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}>
                          {t.label}
                          <span className="ml-1 text-[10px] opacity-60">×{t.mult.toFixed(2)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 카테고리 */}
            {CATEGORIES.map(cat => {
              const isOpen = open.has(cat.id)
              const selCount = cat.items.filter(i => selected.has(i.id)).length
              const catTotal = cat.items.filter(i => selected.has(i.id)).reduce((a, b) => a + b.price, 0)
              return (
                <div key={cat.id} className="border border-slate-200 bg-white transition-shadow duration-300 hover:shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
                  <div className="flex items-center justify-between px-5 py-4">
                    <button type="button" onClick={() => toggleCat(cat.id)} className="flex flex-1 items-center gap-3 text-left">
                      <div className="flex h-9 w-9 items-center justify-center bg-[#2979FF]/10 text-[#2979FF]">{cat.icon}</div>
                      <div>
                        <p className="text-[11px] tracking-[0.1em] text-slate-400">{cat.tag}</p>
                        <p className="text-[15px] font-bold text-slate-900">{cat.title}</p>
                      </div>
                    </button>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400">{selCount}/{cat.items.length}</span>
                      {catTotal > 0 && <span className="text-[12px] font-bold text-[#2979FF]">+{catTotal.toLocaleString()}만</span>}
                      <button type="button" onClick={() => toggleCat(cat.id)} className="text-slate-400 hover:text-slate-700">
                        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="animate-[fadeUp_0.3s_ease-out] border-t border-slate-100">
                      <div className="flex items-center justify-end gap-3 px-5 py-2 text-[10px] text-slate-400">
                        <button type="button" onClick={() => selectAllInCat(cat.id)} className="hover:text-slate-700">전체 선택</button>
                        <span className="text-slate-200">|</span>
                        <button type="button" onClick={() => clearCat(cat.id)} className="hover:text-slate-700">전체 해제</button>
                      </div>
                      <ul>
                        {cat.items.map(item => {
                          const active = selected.has(item.id)
                          return (
                            <li key={item.id}>
                              <button type="button" onClick={() => toggle(item.id)}
                                className={`flex w-full items-center gap-3 border-t border-slate-100 px-5 py-3 text-left transition-all ${active ? 'bg-[#2979FF]/[0.06]' : 'hover:bg-slate-50'}`}>
                                <div className={`flex h-4 w-4 shrink-0 items-center justify-center border ${active ? 'border-[#2979FF] bg-[#2979FF]' : 'border-slate-300 bg-white'}`}>
                                  {active && <Check className="h-3 w-3 text-white" />}
                                </div>
                                <span className={`flex-1 text-[13px] ${active ? 'text-slate-900' : 'text-slate-600'}`}>{item.label}</span>
                                <span className={`text-[12px] tracking-wider ${active ? 'text-[#2979FF] font-bold' : 'text-slate-400'}`}>+{item.price.toLocaleString()}만</span>
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
            <div className="mt-12 border border-slate-200 bg-white p-7">
              <p className="text-[11px] font-bold tracking-[0.12em] text-[#2979FF]">REQUEST QUOTATION</p>
              <h2 className="mt-2 text-[22px] font-bold text-slate-900">상세 견적서 요청</h2>
              <p className="mt-2 text-[13px] text-slate-500">현재 선택 내용을 기반으로 담당 PM이 영업일 기준 1일 내 정식 견적서와 일정 제안을 드립니다.</p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input className="h-12 w-full border border-slate-200 bg-slate-50 px-4 text-[14px] text-slate-900 outline-none transition-all placeholder-slate-400 focus:border-[#2979FF] focus:bg-white" placeholder="회사명 / 소속" value={contact.company} onChange={e => setContact({ ...contact, company: e.target.value })} />
                  <input className="h-12 w-full border border-slate-200 bg-slate-50 px-4 text-[14px] text-slate-900 outline-none transition-all placeholder-slate-400 focus:border-[#2979FF] focus:bg-white" placeholder="담당자명 *" value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })} required />
                  <input className="h-12 w-full border border-slate-200 bg-slate-50 px-4 text-[14px] text-slate-900 outline-none transition-all placeholder-slate-400 focus:border-[#2979FF] focus:bg-white" placeholder="연락처 *" value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} required />
                  <input className="h-12 w-full border border-slate-200 bg-slate-50 px-4 text-[14px] text-slate-900 outline-none transition-all placeholder-slate-400 focus:border-[#2979FF] focus:bg-white" placeholder="이메일" type="email" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} />
                </div>
                <textarea className="h-28 w-full resize-none border border-slate-200 bg-slate-50 px-4 py-3 text-[14px] text-slate-900 outline-none transition-all placeholder-slate-400 focus:border-[#2979FF] focus:bg-white" placeholder="추가 전달사항 (참고 서비스, 예상 사용자 수, 특별 요구사항 등)" value={contact.memo} onChange={e => setContact({ ...contact, memo: e.target.value })} />
                <button type="submit" disabled={sending} className="flex w-full items-center justify-center gap-2 bg-slate-900 py-3.5 text-[15px] font-bold text-white transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50">
                  <Send className="h-4 w-4" /> {sending ? '전송 중...' : '상세 견적서 받기'}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT */}
          <aside>
            <div className="sticky top-[80px] space-y-4">
              <div className="border-2 border-[#2979FF] bg-white p-6 shadow-[0_8px_32px_rgba(41,121,255,0.08)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(41,121,255,0.15)]">
                <p className="text-[11px] font-bold tracking-[0.12em] text-[#2979FF]">TOTAL ESTIMATE</p>
                <p className="mt-3 text-[11px] text-slate-500">공급가 <span className="text-slate-400">· VAT 별도</span></p>
                <p key={calc.subtotal} className="mt-1 animate-[priceBump_0.35s_ease-out] text-[40px] font-bold leading-tight tracking-tight text-slate-900">
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

              <div className="border border-slate-200 bg-white p-6">
                <p className="text-[11px] font-bold tracking-[0.12em] text-slate-400">TEAM ALLOCATION</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] text-slate-500">총 맨먼스</p>
                    <p className="mt-1 text-[22px] font-bold text-[#2979FF]">{calc.totalMM.toFixed(1)}<span className="ml-1 text-[12px] font-normal text-slate-400">MM</span></p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500">예상 기간</p>
                    <p className="mt-1 text-[22px] font-bold text-[#2979FF]">{Math.max(0.5, calc.calMonths).toFixed(1)}<span className="ml-1 text-[12px] font-normal text-slate-400">개월</span></p>
                  </div>
                </div>

                {calc.team.length > 0 ? (
                  <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                    {calc.team.map(({ role, mm }) => (
                      <li key={role} className="flex items-center justify-between text-[12px]">
                        <span className="text-slate-600">{ROLE_LABEL[role] || role}</span>
                        <span className="font-mono text-slate-900">{mm.toFixed(1)} MM</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-5 flex items-start gap-2 border border-amber-200 bg-amber-50 p-3 text-[12px] text-amber-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>좌측에서 항목을 선택해주세요.</span>
                  </div>
                )}

                <p className="mt-4 text-[10px] leading-relaxed text-slate-400">맨먼스 단가 평균 {MM_RATE.toLocaleString()}만원 (혼합 인력 기준) 적용. 시니어 비중에 따라 변동될 수 있습니다.</p>
              </div>

              <div className="space-y-2">
                <button type="button" onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="flex w-full items-center justify-center gap-2 bg-[#2979FF] py-3 text-[13px] font-bold text-white transition-all hover:bg-[#1E6AE1]">
                  상세 견적서 받기 <ArrowRight className="h-4 w-4" />
                </button>
                <Link href="/about#문의" className="flex w-full items-center justify-center border border-slate-300 bg-white py-3 text-[13px] font-bold text-slate-700 transition-all hover:bg-slate-50">
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
      <footer className="border-t border-slate-200 bg-white py-12">
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
