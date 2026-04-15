import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Toaster } from 'sonner'
import Script from 'next/script'
import { routing } from '@/i18n/routing'
import '../globals.css'

const SITE_URL = 'https://jaicylab.com'

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  const siteName = t('siteName')
  const description = t('description')
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: siteName, template: `%s | ${t('brand')}` },
    description,
    keywords: t('keywords').split(','),
    authors: [{ name: 'JAICYLAB' }],
    creator: 'JAICYLAB',
    publisher: 'JAICYLAB',
    applicationName: t('brand'),
    category: 'technology',
    formatDetection: { email: false, address: false, telephone: false },
    alternates: {
      canonical: locale === 'ko' ? SITE_URL : `${SITE_URL}/${locale}`,
      languages: {
        'ko-KR': SITE_URL,
        'en-US': `${SITE_URL}/en`,
        'ja-JP': `${SITE_URL}/ja`,
        'zh-CN': `${SITE_URL}/zh`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'ko' ? 'ko_KR' : locale === 'ja' ? 'ja_JP' : locale === 'zh' ? 'zh_CN' : 'en_US',
      url: locale === 'ko' ? SITE_URL : `${SITE_URL}/${locale}`,
      siteName,
      title: siteName,
      description,
      images: [{ url: '/logo.svg', width: 680, height: 151, alt: 'JAICYLAB' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description,
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
      icon: [{ url: '/logo.svg', type: 'image/svg+xml' }],
      shortcut: '/logo.svg',
      apple: '/logo.svg',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'meta' })
  const ORG_JSONLD = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: t('brand'),
    alternateName: 'JAICYLAB',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    description: t('description'),
    email: 'jaicylab2009@gmail.com',
    telephone: '+82-10-9433-5674',
    sameAs: ['https://github.com/campkjh/jaicylab-homepage'],
  }
  const WEBSITE_JSONLD = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: t('siteName'),
    url: SITE_URL,
    inLanguage: locale,
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
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
