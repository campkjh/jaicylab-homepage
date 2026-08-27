'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'

export type MobileMenuItem = {
  label: string
  href?: string
  onClick?: () => void
  /** 현재 페이지(활성) 표시 */
  active?: boolean
}

/**
 * 모바일 전용 햄버거 메뉴 + 우측 슬라이드 드로어.
 * 데스크톱(md+)에서는 버튼이 숨겨지고, 기존 인라인 nav 가 노출된다.
 * href 항목은 로케일 인식 Link, onClick 항목(같은 페이지 스크롤 등)은 button 으로 렌더한다.
 */
export function MobileMenu({
  theme = 'light',
  items,
  cta,
}: {
  theme?: 'light' | 'dark'
  items: MobileMenuItem[]
  cta?: MobileMenuItem
}) {
  const [open, setOpen] = useState(false)

  // 열려 있는 동안 배경 스크롤 잠금
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  // ESC 로 닫기
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const dark = theme === 'dark'
  const iconColor = dark ? 'text-white' : 'text-[#2B313D]'
  const panelBg = dark ? 'bg-[#0b0b0b] text-white' : 'bg-white text-[#2B313D]'
  const itemBase = dark ? 'text-white/85 hover:bg-white/[0.06]' : 'text-[#51535C] hover:bg-[#F2F3F5]'
  const itemActive = dark ? 'bg-white/[0.10] text-white' : 'bg-[#F2F3F5] text-[#2B313D]'

  const fire = (it: MobileMenuItem) => { setOpen(false); it.onClick?.() }

  return (
    <>
      {/* 햄버거 — 모바일 전용 */}
      <button
        type="button"
        aria-label="메뉴 열기"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={`grid h-9 w-9 place-items-center rounded-xl transition-colors active:scale-95 md:hidden ${
          dark ? 'bg-white/[0.08] hover:bg-white/[0.14]' : 'bg-[#F2F3F5] hover:bg-[#E3E6EB]'
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={iconColor}>
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* 오버레이 + 드로어 */}
      {open && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
            onClick={() => setOpen(false)}
          />
          <div
            className={`absolute right-0 top-0 flex h-full w-[80%] max-w-[320px] flex-col ${panelBg} shadow-[-8px_0_40px_rgba(0,0,0,0.28)] animate-[drawerInRight_0.28s_ease-out]`}
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
          >
            <div className="flex h-[60px] shrink-0 items-center justify-between px-5">
              <span className="text-[12px] font-bold tracking-widest opacity-50">MENU</span>
              <button
                type="button"
                aria-label="메뉴 닫기"
                onClick={() => setOpen(false)}
                className={`grid h-8 w-8 place-items-center rounded-lg ${dark ? 'hover:bg-white/10' : 'hover:bg-[#F2F3F5]'}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={iconColor}>
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-1 px-4 pt-2">
              {items.map((it, i) =>
                it.href ? (
                  <Link
                    key={i}
                    href={it.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-xl px-4 py-3 text-[16px] font-semibold transition-colors ${it.active ? itemActive : itemBase}`}
                  >
                    {it.label}
                  </Link>
                ) : (
                  <button
                    key={i}
                    type="button"
                    onClick={() => fire(it)}
                    className={`rounded-xl px-4 py-3 text-left text-[16px] font-semibold transition-colors ${it.active ? itemActive : itemBase}`}
                  >
                    {it.label}
                  </button>
                )
              )}
            </nav>

            {cta && (
              <div className="mt-auto p-4" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
                {cta.href ? (
                  <Link
                    href={cta.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-xl px-5 py-3.5 text-center text-[15px] font-bold transition-transform active:scale-[0.98] ${dark ? 'bg-white text-black' : 'bg-[#2B313D] text-white'}`}
                  >
                    {cta.label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => fire(cta)}
                    className={`block w-full rounded-xl px-5 py-3.5 text-center text-[15px] font-bold transition-transform active:scale-[0.98] ${dark ? 'bg-white text-black' : 'bg-[#2B313D] text-white'}`}
                  >
                    {cta.label}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
