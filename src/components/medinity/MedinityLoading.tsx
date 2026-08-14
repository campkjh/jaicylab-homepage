'use client'

import dynamic from 'next/dynamic'
import animationData from './loading.json'

// lottie-web 은 DOM 을 쓰므로 클라이언트에서만 렌더한다.
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

/** 첨부된 로티 로딩 애니메이션을 흰색으로 렌더한다. (버튼 로딩용) */
export function MedinityLoading({ className }: { className?: string }) {
  return (
    <span className={className} style={{ filter: 'brightness(0) invert(1)', display: 'inline-flex' }} aria-hidden>
      <Lottie animationData={animationData} loop autoplay style={{ width: '100%', height: '100%' }} />
    </span>
  )
}
