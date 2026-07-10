'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { heartbeat, goOffline } from '@/app/admin/actions'
import type { PresenceUser } from '@/lib/types'

const HEARTBEAT_MS = 4000
/** 타이핑 표시는 마지막 입력 후 이 시간이 지나면 꺼진다. */
const TYPING_IDLE_MS = 4000

type Ctx = {
  users: PresenceUser[]
  /** 지금 편집 중인 일정 id 를 알린다. 편집을 멈추면 null. */
  setTypingOn: (eventId: number | null) => void
  /** 해당 일정을 나 말고 누가 입력 중인지. */
  whoIsTyping: (eventId: number) => PresenceUser | null
}

const PresenceContext = createContext<Ctx>({ users: [], setTypingOn: () => {}, whoIsTyping: () => null })

export const usePresence = () => useContext(PresenceContext)

export default function PresenceProvider({ me, children }: { me: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const [users, setUsers] = useState<PresenceUser[]>([])

  const typingOn = useRef<number | null>(null)
  const typingUntil = useRef(0)
  const pathRef = useRef(pathname)
  pathRef.current = pathname

  const setTypingOn = useCallback((eventId: number | null) => {
    typingOn.current = eventId
    typingUntil.current = eventId === null ? 0 : Date.now() + TYPING_IDLE_MS
  }, [])

  useEffect(() => {
    let alive = true

    const tick = async () => {
      if (typingOn.current !== null && Date.now() > typingUntil.current) typingOn.current = null
      try {
        const next = await heartbeat(pathRef.current, typingOn.current)
        if (alive) setUsers(next)
      } catch {
        // 세션 만료 등은 다음 네비게이션에서 미들웨어가 처리한다.
      }
    }

    void tick()
    const id = setInterval(() => void tick(), HEARTBEAT_MS)

    // 탭을 닫으면 바로 오프라인 처리
    const bye = () => void goOffline()
    window.addEventListener('pagehide', bye)

    return () => {
      alive = false
      clearInterval(id)
      window.removeEventListener('pagehide', bye)
    }
  }, [])

  const whoIsTyping = useCallback(
    (eventId: number) => users.find(u => u.name !== me && u.typing && u.typing_on === eventId) ?? null,
    [users, me],
  )

  return <PresenceContext.Provider value={{ users, setTypingOn, whoIsTyping }}>{children}</PresenceContext.Provider>
}
