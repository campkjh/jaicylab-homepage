'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

/** 10초마다 한 장 캡처한다. */
const CAPTURE_MS = 10_000
/** 긴 변이 이 크기를 넘지 않게 줄여 올린다(용량 절약). */
const MAX_EDGE = 1280

type Ctx = {
  sharing: boolean
  starting: boolean
  start: () => void
  stop: () => void
}

const ScreenShareContext = createContext<Ctx>({ sharing: false, starting: false, start: () => {}, stop: () => {} })
export const useScreenShare = () => useContext(ScreenShareContext)

export default function ScreenShareProvider({ children }: { children: React.ReactNode }) {
  const [sharing, setSharing] = useState(false)
  const [starting, setStarting] = useState(false)
  const streamRef = useRef<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    if (videoRef.current) {
      videoRef.current.srcObject = null
      videoRef.current = null
    }
    setSharing(false)
    setStarting(false)
  }, [])

  const captureOnce = useCallback(async () => {
    const video = videoRef.current
    if (!video || video.videoWidth === 0) return
    const scale = Math.min(1, MAX_EDGE / Math.max(video.videoWidth, video.videoHeight))
    const w = Math.round(video.videoWidth * scale)
    const h = Math.round(video.videoHeight * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    canvas.getContext('2d')?.drawImage(video, 0, 0, w, h)
    const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', 0.6))
    if (!blob) return
    const fd = new FormData()
    fd.append('file', new File([blob], 'frame.jpg', { type: 'image/jpeg' }))
    try {
      await fetch('/api/admin/screen', { method: 'POST', body: fd })
    } catch {
      // 업로드 한 번 실패는 다음 주기에 다시 시도된다
    }
  }, [])

  const start = useCallback(async () => {
    if (sharing || starting) return
    setStarting(true)
    try {
      // 브라우저가 공유할 화면을 고르게 하고(동의), 공유 중엔 브라우저가 표시줄을 띄운다.
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 1 }, audio: false })
      streamRef.current = stream
      const video = document.createElement('video')
      video.srcObject = stream
      video.muted = true
      await video.play().catch(() => {})
      videoRef.current = video
      // 브라우저 '공유 중지'를 누르면 트랙이 끝난다 → 깔끔히 정리
      stream.getVideoTracks()[0]?.addEventListener('ended', cleanup)
      setSharing(true)
      setStarting(false)
      void captureOnce()
      timerRef.current = setInterval(() => void captureOnce(), CAPTURE_MS)
    } catch {
      // 사용자가 공유 선택을 취소한 경우 등
      cleanup()
    }
  }, [sharing, starting, captureOnce, cleanup])

  const stop = useCallback(() => cleanup(), [cleanup])

  useEffect(() => () => cleanup(), [cleanup])

  return (
    <ScreenShareContext.Provider value={{ sharing, starting, start, stop }}>
      {children}
      {sharing && (
        <button
          type="button"
          onClick={stop}
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-ink/90 px-3.5 py-2 text-xs font-medium text-white shadow-lg backdrop-blur transition hover:bg-black"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-2 animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-red-500" />
          </span>
          화면 공유 중 · 중지
        </button>
      )}
    </ScreenShareContext.Provider>
  )
}
