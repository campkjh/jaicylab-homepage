import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'
import Script from 'next/script'
import './globals.css'

const SITE_URL = 'https://jaicylab.com'
const SITE_NAME = '제이씨랩 — JAICYLAB'
const DESCRIPTION = '아이디어를 앱으로 구현하는 제이씨랩. iOS · Android · React Native · Flutter · Next.js 기반 앱 개발부터 AI 통합까지, 기획·디자인·개발·운영을 한 팀이 책임지는 앱 개발 스튜디오.'

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: '%s | 제이씨랩',
  },
  description: DESCRIPTION,
  keywords: [
    '제이씨랩', 'JAICYLAB', '앱 개발', '앱 제작', '앱개발 회사', '앱 개발 스튜디오',
    'iOS 개발', '안드로이드 개발', 'React Native', 'Flutter', 'Next.js',
    '모바일 앱 외주', '앱 개발 견적', 'MVP 개발', '앱 개발 대행',
    '크로스플랫폼', '반응형 웹', 'AI 통합', '수원 앱개발', '서울 앱개발',
    '쇼핑몰 앱 개발', '배달앱 개발', '프리랜서 매칭 앱', '커뮤니티 앱',
    'Apple Developer 등록', 'App Store Connect',
  ],
  authors: [{ name: 'JAICYLAB' }],
  creator: 'JAICYLAB',
  publisher: 'JAICYLAB',
  applicationName: '제이씨랩',
  category: 'technology',
  formatDetection: { email: false, address: false, telephone: false },

  alternates: {
    canonical: SITE_URL,
    languages: { 'ko-KR': SITE_URL },
  },

  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DESCRIPTION,
    images: [
      {
        url: '/logo.svg',
        width: 680,
        height: 151,
        alt: 'JAICYLAB',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: DESCRIPTION,
    images: ['/logo.svg'],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },

  verification: {
    // 아래 값은 구글 서치콘솔·네이버 서치어드바이저 등록 후 발급받아 교체하세요
    // google: 'YOUR_GOOGLE_VERIFICATION_CODE',
    // other: { 'naver-site-verification': 'YOUR_NAVER_VERIFICATION_CODE' },
  },
}

const ORG_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '제이씨랩',
  alternateName: 'JAICYLAB',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  description: DESCRIPTION,
  email: 'jaicylab2009@gmail.com',
  telephone: '+82-10-9433-5674',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '서부로 2066 제2공학관 27505',
    addressLocality: '수원시 장안구',
    addressRegion: '경기도',
    addressCountry: 'KR',
  },
  sameAs: [
    'https://github.com/campkjh/jaicylab-homepage',
  ],
}

const WEBSITE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: 'ko-KR',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Toaster theme="dark" position="top-center" />
        <Script id="ld-org" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify(ORG_JSONLD)}
        </Script>
        <Script id="ld-website" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify(WEBSITE_JSONLD)}
        </Script>
      </body>
    </html>
  )
}
