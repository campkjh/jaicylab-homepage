import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'
import './admin.css'

export const metadata: Metadata = {
  title: 'JAICYLAB 관리자',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: '#f9f0d9',
  width: 'device-width',
  initialScale: 1,
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Toaster theme="light" position="bottom-center" />
      </body>
    </html>
  )
}
