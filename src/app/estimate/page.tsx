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
      { id: 'pf-ios', label: 'iOS 네이티브 앱 (Swift / SwiftUI)', price: 800 },
      { id: 'pf-android', label: 'Android 네이티브 앱 (Kotlin / Compose)', price: 800 },
      { id: 'pf-rn', label: '크로스플랫폼 앱 (React Native)', price: 1200 },
      { id: 'pf-flutter', label: '크로스플랫폼 앱 (Flutter)', price: 1200 },
      { id: 'pf-web', label: '반응형 웹 (Next.js 기본 골격)', price: 500 },
      { id: 'pf-pwa', label: 'PWA 오프라인 캐싱', price: 120 },
      { id: 'pf-admin', label: '관리자 어드민 (기본 CRUD)', price: 600 },
      { id: 'pf-landing', label: '랜딩페이지 1페이지', price: 80 },
      { id: 'pf-corp-site', label: '회사 소개 사이트 (3–5페이지)', price: 200 },
      { id: 'pf-watch', label: 'WatchOS / WearOS 컴패니언', price: 400 },
      { id: 'pf-tv', label: 'tvOS / Android TV 앱', price: 600 },
      { id: 'pf-desktop', label: '데스크탑 앱 (Electron / Tauri)', price: 700 },
      { id: 'pf-tabbar', label: '탭바 네비게이션', price: 25 },
      { id: 'pf-drawer', label: '드로어 메뉴', price: 25 },
      { id: 'pf-onboarding', label: '온보딩 튜토리얼 (3–5스크린)', price: 60 },
      { id: 'pf-splash', label: '스플래시 + 앱 아이콘 적용', price: 15 },
      { id: 'pf-deeplink', label: '딥링크 / 유니버설 링크', price: 80 },
      { id: 'pf-appshortcut', label: '앱 단축어 (3D Touch / 위젯 진입)', price: 40 },
      { id: 'pf-widget-ios', label: 'iOS 위젯 (홈 / 잠금화면)', price: 200 },
      { id: 'pf-widget-android', label: 'Android 홈 위젯', price: 180 },
    ],
  },
  {
    id: 'design', title: '디자인 / UX', tag: 'DESIGN', icon: <Palette className="h-4 w-4" />, items: [
      { id: 'ds-research', label: '경쟁사 / 레퍼런스 조사', price: 40 },
      { id: 'ds-interview', label: 'UX 리서치 / 사용자 인터뷰', price: 150 },
      { id: 'ds-userflow', label: '유저 플로우 설계', price: 50 },
      { id: 'ds-ia', label: '정보 구조(IA) 설계', price: 60 },
      { id: 'ds-wf-s', label: '와이어프레임 (~10화면)', price: 80 },
      { id: 'ds-wf-m', label: '와이어프레임 (~25화면)', price: 180 },
      { id: 'ds-wf-l', label: '와이어프레임 (~50화면)', price: 320 },
      { id: 'ds-ui-key', label: 'UI 키 스크린 시안 (5화면)', price: 120 },
      { id: 'ds-ui-mid', label: 'UI 시안 (~15화면)', price: 280 },
      { id: 'ds-ui-full', label: 'UI 전체 시안 (~30화면)', price: 400 },
      { id: 'ds-ui-xl', label: 'UI 전체 시안 (~60화면)', price: 700 },
      { id: 'ds-system', label: '디자인 시스템 (토큰 + 컴포넌트)', price: 300 },
      { id: 'ds-figma', label: 'Figma 컴포넌트 라이브러리 정리', price: 100 },
      { id: 'ds-darkmode', label: '다크모드 지원', price: 60 },
      { id: 'ds-themes', label: '다중 테마 / 컬러 커스터마이즈', price: 120 },
      { id: 'ds-a11y', label: '접근성 대응 (WCAG AA)', price: 120 },
      { id: 'ds-a11y-aa+', label: '접근성 강화 (스크린리더 최적화)', price: 200 },
      { id: 'ds-responsive', label: '반응형 (모바일/태블릿/데스크탑)', price: 60 },
      { id: 'ds-rtl', label: 'RTL (아랍어 등) 레이아웃', price: 80 },
      { id: 'ds-illustration', label: '일러스트 / 캐릭터 디자인 (10종)', price: 200 },
      { id: 'ds-motion-spec', label: '모션 가이드라인 문서화', price: 80 },
    ],
  },
  {
    id: 'anim', title: '인터랙션 / 애니메이션', tag: 'INTERACTION', icon: <Wand2 className="h-4 w-4" />, items: [
      { id: 'an-page', label: '페이지 전환 애니메이션', price: 40 },
      { id: 'an-shared', label: 'Shared Element 전환', price: 80 },
      { id: 'an-tap', label: '버튼 탭 피드백 (스케일/리플)', price: 20 },
      { id: 'an-haptic', label: '햅틱 피드백', price: 25 },
      { id: 'an-sound', label: '사운드 이펙트', price: 30 },
      { id: 'an-pull', label: '풀 투 리프레시 (커스텀)', price: 35 },
      { id: 'an-swipe', label: '스와이프 액션 (삭제 / 답장)', price: 50 },
      { id: 'an-parallax', label: '스크롤 패럴랙스', price: 60 },
      { id: 'an-scroll-reveal', label: '스크롤 등장 애니메이션 (Reveal)', price: 50 },
      { id: 'an-hero', label: '히어로 섹션 모션', price: 80 },
      { id: 'an-stagger', label: 'Stagger 리스트 등장', price: 40 },
      { id: 'an-spinner', label: '커스텀 로딩 스피너', price: 25 },
      { id: 'an-skeleton', label: '스켈레톤 UI', price: 40 },
      { id: 'an-progress', label: '프로그레스 바 / 링 애니메이션', price: 35 },
      { id: 'an-tooltip', label: '툴팁 / 팝오버 애니메이션', price: 30 },
      { id: 'an-drag-stack', label: 'Draggable 카드 스택', price: 120 },
      { id: 'an-tinder', label: '스와이프 카드 (Tinder식)', price: 200 },
      { id: 'an-particle', label: '파티클 이펙트', price: 80 },
      { id: 'an-confetti', label: '컨페티 / 축하 애니메이션', price: 30 },
      { id: 'an-modal', label: '모달 / 바텀시트 슬라이드', price: 40 },
      { id: 'an-tab-indicator', label: '탭 인디케이터 슬라이드', price: 30 },
      { id: 'an-count', label: '숫자 카운트업 애니메이션', price: 25 },
      { id: 'an-typing', label: '타이핑 애니메이션', price: 25 },
      { id: 'an-fab', label: 'FAB 확장 (Speed Dial)', price: 40 },
      { id: 'an-toggle', label: '체크박스 / 토글 모션', price: 25 },
      { id: 'an-like', label: '좋아요 하트 파티클', price: 35 },
      { id: 'an-snap', label: '스크롤 스냅 캐러셀', price: 50 },
      { id: 'an-blur', label: '글래스모피즘 / 블러 효과', price: 30 },
      { id: 'an-cursor', label: '커스텀 커서 (웹)', price: 40 },
      { id: 'an-3d-tilt', label: '3D 틸트 / 마우스 추적', price: 60 },
    ],
  },
  {
    id: 'auth', title: '회원 / 인증', tag: 'AUTH', icon: <ShieldCheck className="h-4 w-4" />, items: [
      { id: 'au-signup', label: '이메일 회원가입', price: 30 },
      { id: 'au-login', label: '이메일 로그인', price: 20 },
      { id: 'au-pwreset', label: '비밀번호 찾기 / 재설정', price: 30 },
      { id: 'au-emailverify', label: '이메일 인증 (링크)', price: 20 },
      { id: 'au-remember', label: '자동 로그인', price: 15 },
      { id: 'au-kakao', label: '카카오 소셜 로그인', price: 30 },
      { id: 'au-naver', label: '네이버 소셜 로그인', price: 30 },
      { id: 'au-google', label: '구글 소셜 로그인', price: 25 },
      { id: 'au-apple', label: '애플 소셜 로그인', price: 35 },
      { id: 'au-facebook', label: '페이스북 소셜 로그인', price: 25 },
      { id: 'au-line', label: '라인 소셜 로그인', price: 30 },
      { id: 'au-twitter', label: 'X (트위터) 소셜 로그인', price: 30 },
      { id: 'au-pass', label: '휴대폰 본인인증 (PASS)', price: 120 },
      { id: 'au-2fa', label: '2단계 인증 (TOTP)', price: 80 },
      { id: 'au-bio', label: '생체인증 (Face ID / 지문)', price: 60 },
      { id: 'au-passkey', label: '패스키 (WebAuthn)', price: 150 },
      { id: 'au-magic', label: '매직 링크 로그인', price: 50 },
      { id: 'au-sso', label: 'SSO (SAML / OIDC)', price: 250 },
      { id: 'au-profile', label: '프로필 편집', price: 30 },
      { id: 'au-avatar', label: '프로필 이미지 업로드 / 크롭', price: 40 },
      { id: 'au-nickname', label: '닉네임 중복 체크', price: 20 },
      { id: 'au-withdraw', label: '회원 탈퇴 + 30일 보관', price: 30 },
      { id: 'au-suspend', label: '계정 정지 / 복구 (관리자)', price: 40 },
      { id: 'au-rbac', label: '권한·역할 관리 (RBAC)', price: 120 },
      { id: 'au-team', label: '팀 / 워크스페이스 멤버 초대', price: 150 },
      { id: 'au-invite', label: '초대 코드 / 초대 링크', price: 40 },
      { id: 'au-session', label: '세션 관리 / 강제 로그아웃', price: 60 },
      { id: 'au-device', label: '디바이스 관리 (동시 로그인 제한)', price: 80 },
    ],
  },
  {
    id: 'pay', title: '결제 / 정산', tag: 'PAYMENT', icon: <CreditCard className="h-4 w-4" />, items: [
      { id: 'py-toss', label: '토스페이먼츠 PG 연동', price: 120 },
      { id: 'py-iamport', label: '포트원(아임포트) 연동', price: 100 },
      { id: 'py-kakaopay', label: '카카오페이 직연동', price: 80 },
      { id: 'py-naverpay', label: '네이버페이 직연동', price: 80 },
      { id: 'py-applepay', label: 'Apple Pay 연동', price: 80 },
      { id: 'py-samsungpay', label: '삼성페이 연동', price: 80 },
      { id: 'py-card', label: '신용카드 간편결제 (빌링키)', price: 100 },
      { id: 'py-account', label: '실시간 계좌이체', price: 80 },
      { id: 'py-virtualacc', label: '가상계좌 발급', price: 100 },
      { id: 'py-stripe', label: 'Stripe (해외결제)', price: 200 },
      { id: 'py-paypal', label: 'PayPal 연동', price: 150 },
      { id: 'py-iap-ios', label: 'iOS 인앱결제 (StoreKit)', price: 150 },
      { id: 'py-iap-aos', label: 'Android 인앱결제 (Billing)', price: 150 },
      { id: 'py-subscription', label: '정기결제 / 월 구독 모델', price: 200 },
      { id: 'py-annual', label: '연간 결제 + 할인', price: 40 },
      { id: 'py-trial', label: '무료 체험 기간', price: 40 },
      { id: 'py-refund-form', label: '환불 요청 폼', price: 30 },
      { id: 'py-refund-auto', label: '환불 처리 자동화 (PG 연동)', price: 120 },
      { id: 'py-escrow', label: '에스크로 결제', price: 200 },
      { id: 'py-prepaid', label: '선불 충전금', price: 150 },
      { id: 'py-corp', label: '법인 결제 (세금계산서 자동)', price: 180 },
      { id: 'py-point-earn', label: '포인트 적립 로직', price: 120 },
      { id: 'py-point-use', label: '포인트 사용 / 차감', price: 60 },
      { id: 'py-coupon', label: '쿠폰 / 할인코드 발급·사용', price: 100 },
      { id: 'py-coupon-target', label: '쿠폰 타겟팅 (등급/상품)', price: 80 },
      { id: 'py-tax-bill', label: '세금계산서 자동발행 (팝빌)', price: 120 },
      { id: 'py-cash-receipt', label: '현금영수증 발급', price: 80 },
      { id: 'py-dashboard', label: '매출 대시보드 (일/월/연)', price: 120 },
      { id: 'py-settle', label: '판매자별 정산 / 자동이체', price: 250 },
      { id: 'py-excel', label: '정산 리포트 엑셀 다운', price: 60 },
    ],
  },
  {
    id: 'noti', title: '알림 / 메시징', tag: 'NOTIFICATION', icon: <Bell className="h-4 w-4" />, items: [
      { id: 'no-fcm', label: '푸시 알림 (FCM) - Android 셋업', price: 60 },
      { id: 'no-apns', label: '푸시 알림 (APNs) - iOS 셋업', price: 50 },
      { id: 'no-targeting', label: '푸시 타겟팅 / 예약 발송', price: 80 },
      { id: 'no-badge', label: '앱 뱃지 카운트', price: 30 },
      { id: 'no-rich', label: 'Rich 푸시 (이미지 / 액션)', price: 80 },
      { id: 'no-silent', label: '사일런트 푸시 (백그라운드 동기화)', price: 60 },
      { id: 'no-katalk-alert', label: '카카오 알림톡 API 연동', price: 100 },
      { id: 'no-katalk-friend', label: '카카오 친구톡 연동', price: 80 },
      { id: 'no-sms', label: 'SMS 발송 (NHN / 알리고)', price: 40 },
      { id: 'no-lms', label: 'LMS (장문 메시지) 발송', price: 30 },
      { id: 'no-mms', label: 'MMS (이미지 첨부) 발송', price: 40 },
      { id: 'no-email', label: '이메일 발송 셋업 (Resend / SES)', price: 30 },
      { id: 'no-email-tpl', label: 'HTML 이메일 템플릿 제작', price: 50 },
      { id: 'no-chat-1on1', label: '1:1 실시간 채팅 (Socket.IO)', price: 300 },
      { id: 'no-chat-group', label: '그룹 채팅방', price: 200 },
      { id: 'no-chat-media', label: '채팅 이미지 / 파일 전송', price: 70 },
      { id: 'no-chat-read', label: '채팅 읽음 표시 · 전송 상태', price: 30 },
      { id: 'no-chat-typing', label: '입력 중 표시 (Typing indicator)', price: 25 },
      { id: 'no-chat-search', label: '채팅 검색', price: 50 },
      { id: 'no-chat-emoji', label: '이모지 / 반응 (Reaction)', price: 50 },
      { id: 'no-chat-translate', label: '채팅 자동 번역', price: 100 },
      { id: 'no-notice', label: '공지사항 CRUD', price: 60 },
      { id: 'no-inapp', label: '인앱 배너 / 토스트', price: 60 },
      { id: 'no-pref', label: '알림 수신 설정 페이지', price: 40 },
    ],
  },
  {
    id: 'social', title: '커뮤니티 / SNS', tag: 'COMMUNITY', icon: <MessageSquare className="h-4 w-4" />, items: [
      { id: 'so-board-list', label: '게시판 목록', price: 40 },
      { id: 'so-board-crud', label: '게시글 작성 · 수정 · 삭제', price: 70 },
      { id: 'so-board-cat', label: '카테고리별 게시판', price: 40 },
      { id: 'so-board-md', label: '마크다운 / 리치 에디터', price: 100 },
      { id: 'so-board-image', label: '게시글 이미지 첨부', price: 40 },
      { id: 'so-board-poll', label: '투표 / 폴', price: 80 },
      { id: 'so-comment', label: '댓글 기능', price: 60 },
      { id: 'so-reply', label: '대댓글 (1-depth)', price: 50 },
      { id: 'so-reply-tree', label: '무한 대댓글 트리', price: 100 },
      { id: 'so-mention', label: '@멘션 기능', price: 60 },
      { id: 'so-like', label: '좋아요 (게시글 / 댓글)', price: 30 },
      { id: 'so-bookmark', label: '북마크 / 스크랩', price: 50 },
      { id: 'so-follow', label: '팔로우 / 팔로워', price: 100 },
      { id: 'so-friend', label: '친구 신청 / 수락', price: 120 },
      { id: 'so-hashtag', label: '해시태그 파싱 & 검색', price: 80 },
      { id: 'so-search', label: '통합 검색 (게시글 / 유저)', price: 100 },
      { id: 'so-search-elastic', label: 'ElasticSearch 풀텍스트 검색', price: 250 },
      { id: 'so-report', label: '신고 기능', price: 40 },
      { id: 'so-block', label: '유저 차단 / 블락', price: 40 },
      { id: 'so-filter', label: '금지어 필터링', price: 30 },
      { id: 'so-filter-ai', label: 'AI 비속어 / 혐오발언 탐지', price: 200 },
      { id: 'so-feed-time', label: '피드 (시간순)', price: 60 },
      { id: 'so-feed-follow', label: '피드 (팔로우 기반)', price: 100 },
      { id: 'so-feed-rank', label: '피드 (랭킹 알고리즘)', price: 250 },
      { id: 'so-story', label: '스토리 (24시간 자동삭제)', price: 250 },
      { id: 'so-shorts', label: '쇼츠 / 릴스 (세로 영상 피드)', price: 400 },
      { id: 'so-review', label: '리뷰 작성 (텍스트·사진)', price: 80 },
      { id: 'so-rating', label: '별점 평점', price: 30 },
      { id: 'so-dm', label: 'DM (1:1 다이렉트 메시지)', price: 160 },
      { id: 'so-share', label: '소셜 공유 (카카오 / 라인)', price: 30 },
      { id: 'so-quote', label: '인용 / 공유 (퀘오트)', price: 50 },
    ],
  },
  {
    id: 'media', title: '미디어 / 콘텐츠', tag: 'MEDIA', icon: <ImgIcon className="h-4 w-4" />, items: [
      { id: 'me-upload', label: '이미지 업로드 (S3 / R2)', price: 50 },
      { id: 'me-cdn', label: '이미지 CDN 연결', price: 25 },
      { id: 'me-resize', label: '이미지 리사이징 (Sharp)', price: 40 },
      { id: 'me-crop', label: '이미지 크롭 / 회전', price: 35 },
      { id: 'me-thumb', label: '썸네일 자동 생성', price: 30 },
      { id: 'me-exif', label: 'EXIF 데이터 제거 (프라이버시)', price: 20 },
      { id: 'me-watermark', label: '워터마크 합성', price: 40 },
      { id: 'me-video-up', label: '동영상 업로드', price: 70 },
      { id: 'me-video-compress', label: '동영상 서버 압축', price: 100 },
      { id: 'me-hls', label: 'HLS 스트리밍 (MediaConvert)', price: 250 },
      { id: 'me-drm', label: 'DRM 콘텐츠 보호 (Widevine)', price: 600 },
      { id: 'me-live', label: '라이브 스트리밍 (RTMP + HLS)', price: 600 },
      { id: 'me-webrtc-1on1', label: 'WebRTC 1:1 영상통화', price: 400 },
      { id: 'me-webrtc-group', label: 'WebRTC 다자 영상통화', price: 900 },
      { id: 'me-screenshare', label: '화면 공유', price: 200 },
      { id: 'me-recording', label: '영상 녹화 / 저장', price: 150 },
      { id: 'me-filter', label: '이미지 필터 (감성 필터)', price: 120 },
      { id: 'me-ar', label: 'AR 필터 (얼굴 인식)', price: 600 },
      { id: 'me-audio', label: '음악 / 오디오 플레이어', price: 120 },
      { id: 'me-podcast', label: '팟캐스트 백그라운드 재생', price: 100 },
      { id: 'me-file', label: '파일 업로드 / 다운로드', price: 40 },
      { id: 'me-pdf-view', label: 'PDF 뷰어', price: 80 },
    ],
  },
  {
    id: 'commerce', title: '쇼핑몰 / 커머스', tag: 'COMMERCE', icon: <ShoppingBag className="h-4 w-4" />, items: [
      { id: 'cm-catalog', label: '상품 카탈로그 (목록)', price: 80 },
      { id: 'cm-detail', label: '상품 상세 페이지', price: 100 },
      { id: 'cm-options', label: '상품 옵션 (사이즈 / 색상)', price: 80 },
      { id: 'cm-options-comb', label: '옵션 조합 재고 관리', price: 150 },
      { id: 'cm-cart', label: '장바구니', price: 100 },
      { id: 'cm-cart-shared', label: '장바구니 공유 / 저장', price: 50 },
      { id: 'cm-wishlist', label: '위시리스트', price: 60 },
      { id: 'cm-recent', label: '최근 본 상품', price: 40 },
      { id: 'cm-search', label: '상품 검색', price: 80 },
      { id: 'cm-search-image', label: '이미지 검색 (유사 상품)', price: 300 },
      { id: 'cm-filter', label: '상품 필터 (가격 / 카테고리 / 브랜드)', price: 100 },
      { id: 'cm-sort', label: '정렬 옵션 (인기 / 가격 / 신상)', price: 30 },
      { id: 'cm-stock', label: '재고 관리', price: 100 },
      { id: 'cm-soldout', label: '품절 / 입고 알림 신청', price: 60 },
      { id: 'cm-order', label: '주문하기 / 결제 플로우', price: 200 },
      { id: 'cm-order-history', label: '주문 내역 / 상세', price: 80 },
      { id: 'cm-order-cancel', label: '주문 취소 / 반품 / 교환', price: 150 },
      { id: 'cm-shipping-track', label: '배송 추적 (택배 API)', price: 100 },
      { id: 'cm-shipping-addr', label: '배송 주소 관리', price: 60 },
      { id: 'cm-shipping-time', label: '배송 일시 지정', price: 50 },
      { id: 'cm-admin-product', label: '관리자 상품 등록 / 수정', price: 150 },
      { id: 'cm-admin-stock', label: '관리자 재고 관리', price: 80 },
      { id: 'cm-admin-order', label: '관리자 주문 관리', price: 120 },
      { id: 'cm-multiseller', label: '판매자 센터 (멀티 셀러)', price: 600 },
      { id: 'cm-review', label: '상품 리뷰 + 사진', price: 100 },
      { id: 'cm-qna', label: '상품 Q&A 게시판', price: 80 },
      { id: 'cm-section', label: '베스트 / 신상품 / 기획전', price: 80 },
      { id: 'cm-event', label: '기획전 / 이벤트 페이지 관리', price: 120 },
      { id: 'cm-flash', label: '타임딜 / 플래시 세일', price: 100 },
      { id: 'cm-grade', label: '회원 등급별 혜택', price: 100 },
      { id: 'cm-gift', label: '선물하기', price: 80 },
      { id: 'cm-subscribe-box', label: '구독박스 (정기배송)', price: 200 },
    ],
  },
  {
    id: 'loc', title: '위치 / 지도 / 배달', tag: 'LOCATION', icon: <MapPin className="h-4 w-4" />, items: [
      { id: 'lo-kakao', label: 'Kakao 지도 임베드', price: 50 },
      { id: 'lo-naver', label: 'Naver 지도 임베드', price: 50 },
      { id: 'lo-google', label: 'Google Maps 임베드', price: 50 },
      { id: 'lo-gps', label: 'GPS 현재 위치 조회', price: 40 },
      { id: 'lo-perm', label: '위치 권한 요청 UX', price: 15 },
      { id: 'lo-track', label: '실시간 위치 추적 (배달앱류)', price: 250 },
      { id: 'lo-route', label: '경로 탐색 (Tmap / Google)', price: 180 },
      { id: 'lo-route-opt', label: '배달 경로 최적화 (TSP)', price: 350 },
      { id: 'lo-eta', label: '예상 도착시간 (ETA) 계산', price: 100 },
      { id: 'lo-geofence', label: '지오펜싱 (영역 진입·이탈)', price: 120 },
      { id: 'lo-address', label: '주소 검색 (다음 우편번호)', price: 30 },
      { id: 'lo-reverse', label: '좌표 → 주소 역지오코딩', price: 30 },
      { id: 'lo-cluster', label: '마커 클러스터링', price: 60 },
      { id: 'lo-autocomplete', label: '장소 검색 자동완성', price: 70 },
      { id: 'lo-overlay', label: '지도 커스텀 오버레이', price: 70 },
      { id: 'lo-rider-match', label: '배달기사 매칭 시스템', price: 400 },
      { id: 'lo-pickup', label: '픽업 사진 / 완료 인증', price: 80 },
    ],
  },
  {
    id: 'ai', title: 'AI / 머신러닝', tag: 'AI · ML', icon: <Sparkles className="h-4 w-4" />, items: [
      { id: 'ai-api-basic', label: 'ChatGPT / Claude API 단순 연동', price: 80 },
      { id: 'ai-chatbot', label: 'LLM 챗봇 (컨텍스트 관리)', price: 250 },
      { id: 'ai-rag', label: 'RAG (벡터 DB + 검색)', price: 450 },
      { id: 'ai-agent', label: 'Tool-use 에이전트', price: 600 },
      { id: 'ai-prompt-mgmt', label: '프롬프트 관리 / 버전 관리', price: 150 },
      { id: 'ai-sd', label: 'Stable Diffusion 이미지 생성', price: 120 },
      { id: 'ai-dalle', label: 'DALL·E 이미지 생성 API', price: 60 },
      { id: 'ai-upscale', label: '이미지 업스케일 (Real-ESRGAN)', price: 150 },
      { id: 'ai-removebg', label: '배경 제거 (Remove.bg API)', price: 50 },
      { id: 'ai-ocr-clova', label: 'OCR 간단 (네이버 CLOVA)', price: 80 },
      { id: 'ai-ocr-custom', label: 'OCR 고정밀 (커스텀 학습)', price: 250 },
      { id: 'ai-stt', label: 'STT 음성인식 (Whisper)', price: 80 },
      { id: 'ai-tts', label: 'TTS 음성합성 (ElevenLabs)', price: 100 },
      { id: 'ai-translate', label: '번역 API (DeepL / Papago)', price: 40 },
      { id: 'ai-vision', label: '이미지 분류 (Vision API)', price: 100 },
      { id: 'ai-face', label: '얼굴 인식 / 탐지', price: 250 },
      { id: 'ai-pose', label: '자세 추정 (Pose Estimation)', price: 300 },
      { id: 'ai-reco-rule', label: '추천 시스템 (룰 기반)', price: 120 },
      { id: 'ai-reco-ml', label: '추천 시스템 (ML 모델)', price: 500 },
      { id: 'ai-sentiment', label: '감성 분석', price: 80 },
      { id: 'ai-summary', label: '문서 자동 요약', price: 100 },
    ],
  },
  {
    id: 'sched', title: '예약 / 매칭 / 스케줄', tag: 'SCHEDULE', icon: <CalendarCheck className="h-4 w-4" />, items: [
      { id: 'sc-cal', label: '캘린더 UI (월/주/일)', price: 120 },
      { id: 'sc-booking', label: '예약 생성 / 취소', price: 100 },
      { id: 'sc-slot', label: '예약 시간 슬롯 관리', price: 120 },
      { id: 'sc-noshow', label: '노쇼 방지 (선결제 + 수수료)', price: 80 },
      { id: 'sc-recurring', label: '반복 예약 (주간 / 월간)', price: 100 },
      { id: 'sc-waiting', label: '대기열 / 줄서기 시스템', price: 200 },
      { id: 'sc-match', label: '실시간 매칭 알고리즘', price: 450 },
      { id: 'sc-bid', label: '입찰 / 견적 매칭', price: 300 },
      { id: 'sc-shift', label: '근무 스케줄 관리', price: 160 },
      { id: 'sc-auto-shift', label: '교대 근무 자동 배정', price: 250 },
      { id: 'sc-qr-gen', label: 'QR 코드 생성', price: 20 },
      { id: 'sc-qr-scan', label: 'QR 코드 스캔', price: 50 },
      { id: 'sc-barcode', label: '바코드 스캔', price: 50 },
      { id: 'sc-attendance', label: '출퇴근 기록 (GPS 기반)', price: 120 },
      { id: 'sc-google-cal', label: 'Google Calendar 동기화', price: 100 },
    ],
  },
  {
    id: 'data', title: '데이터 / 분석', tag: 'ANALYTICS', icon: <BarChart3 className="h-4 w-4" />, items: [
      { id: 'da-kpi', label: '통계 대시보드 (기본 KPI)', price: 160 },
      { id: 'da-charts', label: '차트 시각화 (Recharts 5종)', price: 80 },
      { id: 'da-realtime', label: '실시간 대시보드 (WebSocket)', price: 180 },
      { id: 'da-ga', label: 'GA4 연동', price: 30 },
      { id: 'da-amplitude', label: 'Amplitude 연동', price: 40 },
      { id: 'da-mixpanel', label: 'Mixpanel 연동', price: 40 },
      { id: 'da-event', label: '이벤트 로깅 설계', price: 70 },
      { id: 'da-funnel', label: '퍼널 분석', price: 100 },
      { id: 'da-cohort', label: '코호트 분석', price: 120 },
      { id: 'da-segment', label: '유저 세그먼트', price: 120 },
      { id: 'da-ab', label: 'A/B 테스트 인프라', price: 250 },
      { id: 'da-feature-flag', label: '기능 플래그 (Feature flag)', price: 120 },
      { id: 'da-excel', label: '엑셀 다운로드 (xlsx)', price: 60 },
      { id: 'da-pdf', label: 'PDF 리포트 생성', price: 120 },
      { id: 'da-scheduled', label: '이메일 리포트 정기 발송', price: 80 },
      { id: 'da-bigquery', label: 'BigQuery / 데이터 웨어하우스 연동', price: 250 },
    ],
  },
  {
    id: 'gam', title: '게이미피케이션', tag: 'GAMIFICATION', icon: <Trophy className="h-4 w-4" />, items: [
      { id: 'gm-badge', label: '뱃지 / 업적 시스템', price: 150 },
      { id: 'gm-level', label: '레벨 / 경험치', price: 120 },
      { id: 'gm-mission', label: '데일리 미션 / 퀘스트', price: 200 },
      { id: 'gm-attendance', label: '출석 체크 / 보상', price: 80 },
      { id: 'gm-leaderboard', label: '리더보드 / 랭킹', price: 150 },
      { id: 'gm-challenge', label: '챌린지 / 경쟁 모드', price: 250 },
      { id: 'gm-reward', label: '리워드 샵 (포인트 교환)', price: 150 },
      { id: 'gm-streak', label: '연속 출석 스트릭', price: 60 },
      { id: 'gm-roulette', label: '룰렛 / 뽑기', price: 100 },
      { id: 'gm-referral', label: '친구 추천 / 리워드', price: 120 },
      { id: 'gm-collection', label: '컬렉션 / 도감', price: 150 },
    ],
  },
  {
    id: 'sec', title: '보안 / 약관 / 컴플라이언스', tag: 'SECURITY', icon: <Lock className="h-4 w-4" />, items: [
      { id: 'se-privacy', label: '개인정보처리방침 페이지 (템플릿)', price: 10 },
      { id: 'se-terms', label: '이용약관 페이지 (템플릿)', price: 10 },
      { id: 'se-privacy-custom', label: '개인정보처리방침 (맞춤 작성)', price: 60 },
      { id: 'se-terms-custom', label: '이용약관 (맞춤 작성)', price: 60 },
      { id: 'se-consent', label: '개인정보 수집 동의 모달', price: 15 },
      { id: 'se-marketing', label: '마케팅 수신 동의', price: 10 },
      { id: 'se-thirdparty', label: '제3자 제공 동의', price: 10 },
      { id: 'se-cookie', label: '쿠키 동의 배너 (GDPR)', price: 25 },
      { id: 'se-youth', label: '청소년 보호정책', price: 10 },
      { id: 'se-encrypt', label: '데이터 암호화 (DB + 전송)', price: 80 },
      { id: 'se-audit', label: '접속 로그 / 감사 로그', price: 80 },
      { id: 'se-2fa', label: '2FA / TOTP 인증', price: 100 },
      { id: 'se-rate', label: 'IP 차단 / Rate Limit', price: 60 },
      { id: 'se-captcha', label: 'CAPTCHA (Turnstile / reCAPTCHA)', price: 25 },
      { id: 'se-waf', label: 'WAF (Cloudflare / AWS WAF)', price: 80 },
      { id: 'se-ismsp', label: 'ISMS-P 준수 설계', price: 600 },
      { id: 'se-pia', label: '개인정보 영향평가 대응', price: 400 },
      { id: 'se-pen-test', label: '모의해킹 보고 대응', price: 300 },
    ],
  },
  {
    id: 'infra', title: '인프라 / 운영', tag: 'INFRA · DEVOPS', icon: <Server className="h-4 w-4" />, items: [
      { id: 'in-vercel', label: 'Vercel 배포 셋업', price: 20 },
      { id: 'in-supabase', label: 'Supabase 셋업 + 스키마', price: 60 },
      { id: 'in-aws', label: 'AWS 서버 구축 (EC2 / ECS)', price: 300 },
      { id: 'in-gcp', label: 'GCP 서버 구축', price: 300 },
      { id: 'in-azure', label: 'Azure 서버 구축', price: 300 },
      { id: 'in-k8s', label: 'Kubernetes 클러스터 구성', price: 500 },
      { id: 'in-serverless', label: 'Serverless (Lambda / Functions)', price: 200 },
      { id: 'in-db-rdb', label: 'DB 설계 (PostgreSQL / MySQL)', price: 150 },
      { id: 'in-db-nosql', label: 'DB 설계 (MongoDB / DynamoDB)', price: 150 },
      { id: 'in-db-replica', label: 'DB Read Replica / 샤딩', price: 250 },
      { id: 'in-redis', label: 'Redis 캐싱 셋업', price: 80 },
      { id: 'in-queue', label: '메시지 큐 (SQS / Kafka)', price: 200 },
      { id: 'in-cdn', label: 'CloudFront / Cloudflare CDN', price: 40 },
      { id: 'in-s3', label: 'S3 / R2 스토리지 셋업', price: 30 },
      { id: 'in-domain', label: '도메인 연결 + SSL', price: 15 },
      { id: 'in-sentry', label: '모니터링 (Sentry) 셋업', price: 40 },
      { id: 'in-apm', label: 'APM (Datadog / New Relic)', price: 120 },
      { id: 'in-log', label: '로그 수집 (CloudWatch / Logtail)', price: 70 },
      { id: 'in-cicd', label: 'CI/CD (GitHub Actions) 파이프라인', price: 120 },
      { id: 'in-backup', label: '백업 자동화', price: 60 },
      { id: 'in-staging', label: '스테이징 환경 구성', price: 80 },
      { id: 'in-loadtest', label: '부하 테스트 (k6 / JMeter)', price: 150 },
    ],
  },
  {
    id: 'extra', title: '부가 서비스 / 스토어', tag: 'EXTRA', icon: <Package className="h-4 w-4" />, items: [
      { id: 'ex-i18n-setup', label: 'i18n 프레임워크 셋업', price: 60 },
      { id: 'ex-lang-en', label: '영어 번역 적용', price: 80 },
      { id: 'ex-lang-jp', label: '일본어 번역 적용', price: 100 },
      { id: 'ex-lang-cn', label: '중국어 번역 적용', price: 100 },
      { id: 'ex-lang-vi', label: '베트남어 번역 적용', price: 100 },
      { id: 'ex-appstore', label: '앱스토어 등록 대행 (Apple)', price: 70 },
      { id: 'ex-playstore', label: '플레이스토어 등록 대행 (Google)', price: 50 },
      { id: 'ex-onestore', label: '원스토어 등록 대행', price: 60 },
      { id: 'ex-reject', label: '앱 심사 Rejection 대응', price: 50 },
      { id: 'ex-screenshot', label: '스토어 스크린샷 제작 (6장)', price: 50 },
      { id: 'ex-icon', label: '앱 아이콘 디자인', price: 40 },
      { id: 'ex-seo-basic', label: 'SEO 기본 (메타 / OG / sitemap)', price: 40 },
      { id: 'ex-seo-pro', label: 'SEO 고도화 (구조화 데이터 / 속도)', price: 100 },
      { id: 'ex-aso', label: 'ASO (앱 스토어 최적화)', price: 100 },
      { id: 'ex-user-manual', label: '사용자 매뉴얼 작성', price: 80 },
      { id: 'ex-admin-manual', label: '관리자 매뉴얼 작성', price: 60 },
      { id: 'ex-faq', label: 'FAQ 페이지', price: 25 },
      { id: 'ex-cs', label: '고객센터 1:1 문의 채널', price: 70 },
      { id: 'ex-channel-talk', label: '채널톡 / 인터컴 위젯 연동', price: 30 },
      { id: 'ex-maintenance-1m', label: '출시 후 1개월 무상 유지보수', price: 200 },
      { id: 'ex-maintenance-3m', label: '출시 후 3개월 유지보수 계약', price: 550 },
      { id: 'ex-maintenance-6m', label: '출시 후 6개월 유지보수 계약', price: 1000 },
      { id: 'ex-handover', label: '소스 인수인계 / 기술 이전', price: 150 },
    ],
  },
]

// ───── 패키지 프리셋 ─────
type Pkg = { id: string; label: string; sub: string; icon: React.ReactNode; ids: string[] }

const PACKAGES: Pkg[] = [
  {
    id: 'corp', label: '회사 홈페이지', sub: '소개 + 문의', icon: <Home className="h-4 w-4" />, ids: [
      'pf-corp-site', 'pf-landing', 'ds-research', 'ds-ui-key', 'ds-responsive',
      'an-page', 'an-scroll-reveal', 'an-hero',
      'se-privacy', 'se-terms',
      'in-vercel', 'in-domain', 'ex-seo-basic', 'ex-cs',
    ],
  },
  {
    id: 'shop', label: '쇼핑몰', sub: '결제 + 배송 + 리뷰', icon: <ShoppingBag className="h-4 w-4" />, ids: [
      'pf-rn', 'pf-admin', 'pf-tabbar', 'pf-splash',
      'ds-ui-mid', 'ds-system',
      'au-signup', 'au-login', 'au-kakao', 'au-pwreset', 'au-profile',
      'cm-catalog', 'cm-detail', 'cm-options', 'cm-cart', 'cm-wishlist', 'cm-search', 'cm-filter', 'cm-sort', 'cm-stock', 'cm-order', 'cm-order-history', 'cm-order-cancel', 'cm-shipping-track', 'cm-shipping-addr', 'cm-admin-product', 'cm-admin-order', 'cm-review', 'cm-section', 'cm-event',
      'py-toss', 'py-iap-ios', 'py-iap-aos', 'py-coupon', 'py-point-earn', 'py-point-use', 'py-refund-auto', 'py-tax-bill', 'py-cash-receipt', 'py-dashboard',
      'no-fcm', 'no-apns', 'no-katalk-alert', 'no-email',
      'se-privacy', 'se-terms', 'se-consent', 'se-encrypt',
      'in-supabase', 'in-domain', 'in-s3', 'in-cdn', 'in-sentry', 'in-cicd',
      'ex-appstore', 'ex-playstore', 'ex-icon', 'ex-screenshot',
    ],
  },
  {
    id: 'freelance', label: '프리랜서 매칭', sub: '몰앤몰 / 인력 매칭', icon: <Briefcase className="h-4 w-4" />, ids: [
      'pf-rn', 'pf-admin', 'pf-tabbar', 'pf-onboarding',
      'ds-ui-mid', 'ds-system',
      'au-signup', 'au-login', 'au-kakao', 'au-pass', 'au-profile', 'au-avatar', 'au-rbac',
      'sc-cal', 'sc-booking', 'sc-slot', 'sc-noshow', 'sc-match', 'sc-bid', 'sc-shift', 'sc-attendance',
      'no-chat-1on1', 'no-chat-media', 'no-chat-read', 'no-fcm', 'no-apns', 'no-katalk-alert',
      'py-toss', 'py-escrow', 'py-settle', 'py-tax-bill', 'py-cash-receipt', 'py-dashboard',
      'so-review', 'so-rating', 'so-report', 'so-block',
      'lo-kakao', 'lo-gps', 'lo-address', 'lo-autocomplete',
      'da-kpi', 'da-charts',
      'se-privacy', 'se-terms', 'se-consent',
      'in-supabase', 'in-domain', 'in-cdn', 'in-sentry',
      'ex-appstore', 'ex-playstore', 'ex-icon',
    ],
  },
  {
    id: 'community', label: '커뮤니티 / SNS', sub: '게시판 + 피드 + DM', icon: <Users2 className="h-4 w-4" />, ids: [
      'pf-rn', 'pf-admin', 'pf-tabbar', 'pf-splash',
      'ds-ui-mid', 'ds-system', 'ds-darkmode',
      'an-page', 'an-pull', 'an-skeleton', 'an-like', 'an-stagger',
      'au-signup', 'au-login', 'au-kakao', 'au-google', 'au-apple', 'au-profile', 'au-avatar', 'au-nickname',
      'so-board-list', 'so-board-crud', 'so-board-cat', 'so-board-image', 'so-comment', 'so-reply', 'so-mention', 'so-like', 'so-bookmark', 'so-follow', 'so-hashtag', 'so-search', 'so-report', 'so-block', 'so-filter', 'so-feed-time', 'so-feed-follow', 'so-dm', 'so-share',
      'me-upload', 'me-cdn', 'me-resize', 'me-thumb',
      'no-fcm', 'no-apns', 'no-targeting',
      'se-privacy', 'se-terms', 'se-consent',
      'in-supabase', 'in-domain', 'in-s3', 'in-cdn', 'in-sentry',
      'ex-appstore', 'ex-playstore', 'ex-icon',
    ],
  },
  {
    id: 'delivery', label: '배달 / O2O', sub: '주문 + 위치 + 라이더', icon: <UtensilsCrossed className="h-4 w-4" />, ids: [
      'pf-rn', 'pf-admin', 'pf-tabbar',
      'ds-ui-mid', 'ds-system',
      'au-signup', 'au-kakao', 'au-pass', 'au-profile',
      'cm-catalog', 'cm-detail', 'cm-options', 'cm-cart', 'cm-order', 'cm-order-history', 'cm-shipping-addr',
      'lo-kakao', 'lo-gps', 'lo-track', 'lo-route', 'lo-route-opt', 'lo-eta', 'lo-geofence', 'lo-address', 'lo-rider-match', 'lo-pickup',
      'py-toss', 'py-kakaopay', 'py-naverpay', 'py-coupon', 'py-point-earn', 'py-settle',
      'no-fcm', 'no-apns', 'no-katalk-alert', 'no-rich',
      'so-review', 'so-rating',
      'se-privacy', 'se-terms', 'se-consent',
      'in-supabase', 'in-domain', 'in-redis', 'in-sentry', 'in-cicd',
      'ex-appstore', 'ex-playstore', 'ex-icon',
    ],
  },
  {
    id: 'edu', label: '교육 / LMS', sub: '강의 + 진도 + 결제', icon: <BookOpen className="h-4 w-4" />, ids: [
      'pf-rn', 'pf-web', 'pf-admin', 'pf-tabbar',
      'ds-ui-mid', 'ds-system',
      'au-signup', 'au-login', 'au-google', 'au-profile',
      'me-video-up', 'me-hls', 'me-drm', 'me-podcast', 'me-pdf-view',
      'so-comment', 'so-rating', 'so-review',
      'py-toss', 'py-subscription', 'py-coupon', 'py-tax-bill',
      'gm-attendance', 'gm-badge', 'gm-streak',
      'da-kpi', 'da-funnel',
      'no-fcm', 'no-apns', 'no-email',
      'se-privacy', 'se-terms',
      'in-supabase', 'in-cdn', 'in-s3', 'in-domain',
      'ex-appstore', 'ex-playstore', 'ex-icon',
    ],
  },
  {
    id: 'fitness', label: '헬스 / 피트니스', sub: '운동 기록 + 챌린지', icon: <Heart className="h-4 w-4" />, ids: [
      'pf-rn', 'pf-tabbar', 'pf-watch', 'pf-widget-ios',
      'ds-ui-mid', 'ds-system',
      'au-signup', 'au-google', 'au-apple', 'au-profile',
      'lo-gps', 'lo-route',
      'me-upload', 'me-cdn',
      'gm-badge', 'gm-streak', 'gm-attendance', 'gm-mission', 'gm-leaderboard', 'gm-challenge',
      'so-follow', 'so-feed-follow', 'so-like',
      'no-fcm', 'no-apns',
      'se-privacy', 'se-terms',
      'in-supabase', 'in-domain', 'in-sentry',
      'ex-appstore', 'ex-playstore', 'ex-icon',
    ],
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

const MM_RATE = 600 // 만원 / man-month

// 카테고리별 역할 매핑
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

// 비-플랫폼 항목 ID 셋 (네이티브 배수 적용 대상)
const PLATFORM_ITEM_IDS = new Set(CATEGORIES.find(c => c.id === 'platform')!.items.map(i => i.id))

function fmt(manwon: number) {
  if (manwon >= 10000) return `${(manwon / 10000).toFixed(2)}억 ${(manwon % 10000).toLocaleString()}만`
  return `${Math.round(manwon).toLocaleString()}만`
}

// ───────────────────────────── PAGE ─────────────────────────────

export default function EstimatePage() {
  const [selected, setSelected] = useState<Set<string>>(new Set(['pf-rn', 'pf-admin', 'pf-splash', 'pf-tabbar', 'ds-ui-key', 'ds-system', 'au-signup', 'au-login', 'au-kakao', 'au-pwreset', 'au-profile', 'no-fcm', 'no-apns', 'se-privacy', 'se-terms', 'in-vercel', 'in-supabase', 'in-domain']))
  const [open, setOpen] = useState<Set<string>>(new Set(['platform', 'anim']))
  const [design, setDesign] = useState('custom')
  const [timeline, setTimeline] = useState('normal')
  const [contact, setContact] = useState({ company: '', name: '', phone: '', email: '', memo: '' })
  const [sending, setSending] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [activePkg, setActivePkg] = useState<string | null>(null)

  useEffect(() => {
    const h = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  function toggle(id: string) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
    setActivePkg(null)
  }
  function toggleCat(catId: string) {
    setOpen(prev => { const n = new Set(prev); n.has(catId) ? n.delete(catId) : n.add(catId); return n })
  }
  function selectAllInCat(catId: string) {
    const cat = CATEGORIES.find(c => c.id === catId)!
    setSelected(prev => { const n = new Set(prev); cat.items.forEach(i => n.add(i.id)); return n })
    setActivePkg(null)
  }
  function clearCat(catId: string) {
    const cat = CATEGORIES.find(c => c.id === catId)!
    setSelected(prev => { const n = new Set(prev); cat.items.forEach(i => n.delete(i.id)); return n })
    setActivePkg(null)
  }
  function applyPackage(pkg: Pkg) {
    setSelected(new Set(pkg.ids))
    setActivePkg(pkg.id)
    // 해당 패키지가 사용하는 카테고리는 자동으로 펼치기
    const cats = new Set<string>()
    pkg.ids.forEach(id => CATEGORIES.forEach(c => { if (c.items.find(i => i.id === id)) cats.add(c.id) }))
    setOpen(cats)
  }
  function clearAll() {
    setSelected(new Set())
    setActivePkg(null)
  }

  // ── 네이티브 모드 자동 감지 ──
  // iOS+Android 네이티브 양쪽 선택 시 → ×1.6 (앱 항목만)
  // iOS 또는 Android 단독 네이티브 → ×1.1
  // 크로스플랫폼만 → ×1.0
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
    let appSum = 0 // 네이티브 배수 적용 대상 합계 (앱 관련 기능)
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

    // 네이티브 배수: 앱 관련 기능 항목들에 적용
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

    // 역할별 분배
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
    const team = Object.entries(teamMM)
      .filter(([, mm]) => mm >= 0.05)
      .sort(([, a], [, b]) => b - a)
      .map(([role, mm]) => ({ role, mm }))

    const parallel = Math.max(2.5, Math.min(6, team.length * 0.7))
    const calMonths = totalMM / parallel
    const tMult = TIMELINES.find(t => t.id === timeline)?.mult ?? 1
    const calAdjusted = calMonths / (tMult > 1 ? tMult * 0.9 : 1)

    return { baseSum, nativeAdd, designAdd, timeAdd, subtotal, vat, total, totalMM, team, calMonths: calAdjusted, designMult, timeMult, appSum }
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
    <div className="min-h-screen bg-[#050505] text-white">

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-black/60 backdrop-blur-2xl border-b border-white/5' : 'bg-transparent'}`}>
        <div className="mx-auto flex h-[60px] max-w-[1320px] items-center justify-between px-6">
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
      <section className="border-b border-white/5 pt-[110px] pb-10">
        <div className="mx-auto max-w-[1320px] px-6">
          <p className="text-[11px] font-bold tracking-[0.4em] text-[#2979FF]">SELF ESTIMATE</p>
          <h1 className="mt-3 text-[36px] font-black leading-[1.1] tracking-tight md:text-[44px]">
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">상세 항목별 자가견적</span>
          </h1>
          <p className="mt-4 max-w-[640px] text-[14px] leading-relaxed text-white/40">
            17개 카테고리 · 약 {totalItems}개 세부 항목 · 7가지 패키지 프리셋. 네이티브/크로스, 디자인 수준, 일정 보정, 부가세까지 실시간 계산됩니다.
          </p>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="border-b border-white/5 py-10">
        <div className="mx-auto max-w-[1320px] px-6">
          <div className="flex items-baseline justify-between">
            <p className="text-[11px] font-bold tracking-[0.3em] text-[#2979FF]">QUICK START · 패키지 프리셋</p>
            {activePkg && <button onClick={clearAll} className="text-[11px] text-white/30 hover:text-white/60">전체 초기화</button>}
          </div>
          <p className="mt-2 text-[13px] text-white/40">자주 만드는 서비스 유형을 클릭하면 표준 항목이 한 번에 선택됩니다. 이후 좌측에서 자유롭게 추가/제거 하세요.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PACKAGES.map(p => {
              const active = activePkg === p.id
              return (
                <button key={p.id} type="button" onClick={() => applyPackage(p)}
                  className={`group flex items-start gap-3 border p-4 text-left transition-all ${active ? 'border-[#2979FF] bg-[#2979FF]/10' : 'border-white/8 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'}`}>
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center ${active ? 'bg-[#2979FF] text-white' : 'bg-white/[0.05] text-white/50'}`}>{p.icon}</div>
                  <div className="flex-1">
                    <p className="text-[14px] font-bold">{p.label}</p>
                    <p className="mt-0.5 text-[11px] text-white/40">{p.sub}</p>
                    <p className="mt-2 text-[10px] tracking-wider text-[#2979FF]">{p.ids.length}개 항목 자동 선택</p>
                  </div>
                  {active && <Check className="h-4 w-4 shrink-0 text-[#2979FF]" />}
                </button>
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
            <div className="border border-white/8 bg-white/[0.02] p-5">
              <p className="text-[11px] font-bold tracking-[0.3em] text-white/40">PROJECT CONDITION</p>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-[11px] text-white/40 mb-2">개발 방식 (자동 감지)</p>
                  <div className={`flex items-center justify-between border px-4 py-3 ${nativeMode.id === 'both-native' ? 'border-[#2979FF]/40 bg-[#2979FF]/10' : 'border-white/8 bg-white/[0.02]'}`}>
                    <div>
                      <p className="text-[13px] font-bold">{nativeMode.label}</p>
                      <p className="mt-0.5 text-[11px] text-white/40">
                        {nativeMode.id === 'both-native' && 'iOS+Android 네이티브 양쪽 → 앱 기능 항목에 ×1.6 가중'}
                        {nativeMode.id === 'single-native' && '단일 네이티브 → 앱 기능 항목에 ×1.1 가중'}
                        {nativeMode.id === 'cross' && '크로스플랫폼 또는 단일 OS → 가중 없음'}
                      </p>
                    </div>
                    <span className="text-[14px] font-black text-[#82b1ff]">×{nativeMode.mult.toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] text-white/40 mb-2">디자인 수준</p>
                    <div className="flex gap-2">
                      {DESIGNS.map(d => (
                        <button key={d.id} type="button" onClick={() => setDesign(d.id)}
                          className={`flex-1 border px-3 py-2 text-[11px] font-bold transition-all ${design === d.id ? 'border-[#2979FF] bg-[#2979FF]/10 text-white' : 'border-white/8 text-white/40 hover:border-white/20'}`}>
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
                          className={`flex-1 border px-3 py-2 text-[11px] font-bold transition-all ${timeline === t.id ? 'border-[#2979FF] bg-[#2979FF]/10 text-white' : 'border-white/8 text-white/40 hover:border-white/20'}`}>
                          {t.label}
                          <span className="ml-1 text-[10px] text-[#2979FF]">×{t.mult.toFixed(2)}</span>
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

          {/* RIGHT */}
          <aside>
            <div className="sticky top-[80px] space-y-4">
              <div className="border border-[#2979FF]/30 bg-gradient-to-b from-[#2979FF]/10 to-transparent p-6">
                <p className="text-[11px] font-bold tracking-[0.3em] text-[#2979FF]">TOTAL ESTIMATE</p>
                <p className="mt-3 text-[11px] text-white/40">총 금액 (VAT 포함)</p>
                <p className="mt-1 text-[34px] font-black leading-tight">
                  <span className="bg-gradient-to-r from-white to-[#82b1ff] bg-clip-text text-transparent">{fmt(calc.total)}</span>
                  <span className="ml-1 text-[14px] text-white/40">원</span>
                </p>

                <div className="mt-5 space-y-1.5 border-t border-white/10 pt-4 text-[12px]">
                  <div className="flex justify-between text-white/50"><span>항목 합계</span><span className="text-white/80">{calc.baseSum.toLocaleString()}만</span></div>
                  {calc.nativeAdd > 0 && (
                    <div className="flex justify-between text-white/50"><span>네이티브 보정 (×{nativeMode.mult.toFixed(2)})</span><span className="text-white/80">+{Math.round(calc.nativeAdd).toLocaleString()}만</span></div>
                  )}
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
        <div className="mx-auto max-w-[1320px] px-6">
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
