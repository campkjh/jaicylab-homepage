'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { useState, useRef, useEffect } from 'react'
import { Globe, Check } from 'lucide-react'

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const locale = useLocale()
  const t = useTranslations('language')
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const change = (next: string) => {
    setOpen(false)
    router.replace(pathname, { locale: next as (typeof routing.locales)[number] })
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[12px] font-medium text-white/60 transition-all hover:border-white/20 hover:text-white"
        aria-label={t('label')}
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="uppercase">{locale}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[140px] overflow-hidden rounded-md border border-white/10 bg-black/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          {routing.locales.map((l) => (
            <button
              key={l}
              onClick={() => change(l)}
              className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-[12px] transition-colors hover:bg-white/5 ${
                l === locale ? 'text-white' : 'text-white/50'
              }`}
            >
              {t(l)}
              {l === locale && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
