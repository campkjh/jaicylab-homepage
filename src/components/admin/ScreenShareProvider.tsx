'use client'

import { useEffect, useRef } from 'react'
import { toJpeg } from 'html-to-image'

/** 10초마다 한 장 캡처한다. */
const CAPTURE_MS = 10_000
/** 긴 변이 이 크기를 넘지 않게 줄여 올린다(용량·부하 절약). */
const MAX_EDGE = 1280

/**
 * 어드민 화면 자동 기록. 트리거 없이, 화면을 열어 둔 동안 어드민 페이지가 제 모습을
 * 10초마다 그려서 저장한다. (브라우저 화면 공유가 아니라 이 페이지의 DOM 을 그리는 방식이라
 *  클릭·공유 표시가 없다. 대신 어드민 화면 안쪽만 담기고 다른 탭·다른 앱은 담기지 않는다.)
 * active=false 면(=캡처 대상 아님) 아무것도 하지 않는다.
 */
export default function ScreenShareProvider({
  active,
  children,
}: {
  active: boolean
  children: React.ReactNode
}) {
  const busy = useRef(false)

  useEffect(() => {
    if (!active) return
    let alive = true

    const capture = async () => {
      // 탭이 숨겨져 있으면(다른 탭/최소화) 굳이 찍지 않는다
      if (!alive || busy.current || document.hidden) return
      busy.current = true
      try {
        const scale = Math.min(1, MAX_EDGE / Math.max(window.innerWidth, 1))
        // 장식 레이어·외부 이미지·영상은 빼고(느리고 CORS 로 막힘), 폰트 임베드도 끈다(시스템 폰트로 그림)
        const skip = (node: HTMLElement): boolean => {
          if (node.getAttribute?.('data-no-capture') === '1') return false
          if (node.tagName === 'VIDEO' || node.tagName === 'IFRAME' || node.tagName === 'CANVAS') return false
          if (node.tagName === 'IMG') {
            const src = (node as HTMLImageElement).currentSrc || (node as HTMLImageElement).src
            if (src && !src.startsWith('data:') && !src.startsWith(location.origin)) return false
          }
          return true
        }
        const render = toJpeg(document.body, {
          quality: 0.55,
          pixelRatio: scale,
          backgroundColor: '#f7ead0',
          skipFonts: true,
          cacheBust: false,
          filter: node => !(node instanceof HTMLElement) || skip(node),
        })
        // 한 장이 오래 걸리면 포기한다(다음 주기에 다시) — 절대 멈춰 있지 않게
        const dataUrl = await Promise.race([
          render,
          new Promise<string>((_, rej) => setTimeout(() => rej(new Error('capture timeout')), 8000)),
        ])
        const blob = await (await fetch(dataUrl)).blob()
        if (!alive) return
        const fd = new FormData()
        fd.append('file', new File([blob], 'frame.jpg', { type: 'image/jpeg' }))
        await fetch('/api/admin/screen', { method: 'POST', body: fd })
      } catch {
        // 한 번 실패(타임아웃·CORS 등)는 다음 주기에 다시 시도된다
      } finally {
        busy.current = false
      }
    }

    // 첫 장은 페이지가 자리잡은 뒤에
    const first = setTimeout(() => void capture(), 2500)
    const timer = setInterval(() => void capture(), CAPTURE_MS)
    return () => {
      alive = false
      clearTimeout(first)
      clearInterval(timer)
    }
  }, [active])

  return <>{children}</>
}
