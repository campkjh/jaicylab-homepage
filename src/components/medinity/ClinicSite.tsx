import type { CSSProperties } from 'react'
import { type ClinicSiteConfig, mapEmbedUrl } from '@/data/medinity-site'

/**
 * 치과 홈페이지 템플릿 (A안) — 연세볼트치과 톤.
 * 네이비·미니멀, 풀블리드 히어로, 진료 섹션(키커·제목·부제·태그칩·사진),
 * 진료시간·대표번호·오시는길, 하단 고정 상담바(전화/네이버예약/카카오톡).
 * ClinicSiteConfig 하나로 전체를 찍어낸다. 브랜드 색은 --brand CSS 변수로 주입.
 */
export function ClinicSite({ config }: { config: ClinicSiteConfig }) {
  const { name, nameEn, slogan, address, ceo, phone, bizNumber, features, about, departments, hours, hoursNote } = config
  const style = { ['--brand' as string]: config.brandColor } as CSSProperties
  const tel = phone.replace(/[^0-9+]/g, '')

  return (
    <div style={style} className="min-h-screen bg-white pb-24 text-slate-800 [scroll-behavior:smooth]">
      {/* 헤더 */}
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl text-[15px] font-black text-white" style={{ background: 'var(--brand)' }}>⚡</span>
            <span className="leading-none">
              <span className="block text-[17px] font-extrabold tracking-tight text-slate-900">{name}</span>
              <span className="mt-0.5 block text-[9px] font-bold tracking-[0.22em] text-slate-400">{nameEn}</span>
            </span>
          </a>
          <a href={tel ? `tel:${tel}` : '#location'} className="flex items-center gap-1.5 text-sm font-bold" style={{ color: 'var(--brand)' }}>
            <span aria-hidden>📞</span> 상담예약하기
          </a>
        </div>
      </header>

      {/* 히어로 — 풀블리드 오버레이 */}
      <section id="top" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-100 via-slate-50 to-white" />
        <div className="absolute inset-0 -z-10 opacity-70" style={{ background: 'radial-gradient(90% 60% at 50% -10%, color-mix(in srgb, var(--brand) 16%, transparent) 0%, transparent 60%)' }} />
        <div className="mx-auto flex min-h-[78vh] max-w-6xl flex-col items-center justify-center px-5 py-24 text-center">
          <div className="text-sm font-bold" style={{ color: 'var(--brand)' }}>{name}</div>
          <h1 className="mt-4 whitespace-pre-line text-4xl font-black leading-[1.2] tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            {slogan}
          </h1>
          <a
            href={features.naverReserve ? '#location' : tel ? `tel:${tel}` : '#location'}
            className="mt-10 inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold text-white shadow-lg transition hover:opacity-90"
            style={{ background: 'var(--brand)' }}
          >
            상담예약하기 <span aria-hidden>📅</span>
          </a>
        </div>
      </section>

      {/* 병원 소개 */}
      <section id="about" className="mx-auto max-w-6xl px-5 py-24">
        <Kicker>ABOUT</Kicker>
        <h2 className="mt-3 text-3xl font-black leading-snug tracking-tight text-slate-900 md:text-4xl">
          믿을 수 있는 진료를<br />안내합니다.
        </h2>
        <p className="mt-7 max-w-3xl text-lg leading-loose text-slate-500 md:text-xl">{about}</p>
        <div className="mt-12 aspect-[16/7] w-full rounded-[28px] bg-gradient-to-br from-slate-100 to-slate-200" />
      </section>

      {/* 진료 안내 — 섹션 스택 */}
      <section id="care" className="bg-slate-50/70 py-8">
        {departments.map((d, i) => (
          <div key={d.name} className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2">
            <div className={`aspect-[4/3] w-full rounded-[28px] bg-gradient-to-br from-slate-100 to-slate-200 ${i % 2 ? 'md:order-2' : ''}`} />
            <div className={i % 2 ? 'md:order-1' : ''}>
              <Kicker>{d.kicker}</Kicker>
              <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">{d.name}</h3>
              <p className="mt-4 text-lg font-semibold text-slate-500">{d.subtitle}</p>
              <p className="mt-4 max-w-md leading-loose text-slate-500">{d.desc}</p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {d.tags.map(t => (
                  <span key={t} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600">{t}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 진료시간 · 대표번호 */}
      <section id="hours" className="mx-auto max-w-6xl px-5 py-24">
        <div className="grid gap-14 md:grid-cols-[1fr_1.2fr]">
          <div>
            <Kicker>CONTACT</Kicker>
            <div className="mt-3 text-sm font-bold text-slate-400">대표번호</div>
            <div className="mt-1 text-4xl font-black tracking-tight md:text-5xl" style={{ color: 'var(--brand)' }}>
              {phone || '전화 예약'}
            </div>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {tel && <a href={`tel:${tel}`} className="rounded-full px-5 py-2.5 text-sm font-bold text-white" style={{ background: 'var(--brand)' }}>전화 상담</a>}
              {features.naverReserve && <a href="#location" className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600">네이버 예약</a>}
              {features.kakao && <a href="#location" className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600">카카오톡 상담</a>}
            </div>
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight text-slate-900">진료시간</div>
            <ul className="mt-6 divide-y divide-slate-200">
              {hours.map(h => (
                <li key={h.day} className="flex items-center justify-between py-4">
                  <span className="font-bold text-slate-700">{h.day}</span>
                  <span className="text-lg font-bold text-slate-900">{h.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-slate-400">{hoursNote}</p>
          </div>
        </div>
      </section>

      {/* 오시는 길 */}
      <section id="location" className="bg-slate-50/70">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <Kicker>LOCATION</Kicker>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">오시는 길</h2>
          <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-200">
            <iframe title="지도" src={mapEmbedUrl(address)} className="h-[400px] w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          {address && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="mr-2 text-lg font-bold text-slate-900">{address}</div>
              <a href={`https://map.naver.com/v5/search/${encodeURIComponent(address)}`} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600">네이버지도 길찾기</a>
              <a href={`https://map.kakao.com/?q=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600">카카오맵 길찾기</a>
            </div>
          )}
        </div>
      </section>

      {/* 푸터 */}
      <footer className="text-white" style={{ background: 'var(--brand)' }}>
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div className="text-xl font-extrabold">{name}</div>
          <div className="mt-4 space-y-1 text-sm text-white/70">
            {ceo && <div>대표원장 {ceo}</div>}
            {address && <div>{address}</div>}
            {bizNumber && <div>사업자등록번호 {bizNumber}</div>}
            {phone && <div>대표전화 {phone}</div>}
          </div>
          <div className="mt-10 border-t border-white/15 pt-6 text-xs text-white/50">
            © {name}. All rights reserved. · Made with MEDINITY
          </div>
        </div>
      </footer>

      {/* 하단 고정 상담바 */}
      <nav className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3">
        <div className="mx-auto flex max-w-md items-center overflow-hidden rounded-full text-white shadow-2xl" style={{ background: 'var(--brand)' }}>
          <a href={tel ? `tel:${tel}` : '#location'} className="flex flex-1 flex-col items-center gap-0.5 py-3 text-[13px] font-bold transition hover:bg-white/10">
            <span aria-hidden className="text-base">📞</span> 전화 상담
          </a>
          {features.naverReserve && (
            <a href="#location" className="flex flex-1 flex-col items-center gap-0.5 border-l border-white/15 py-3 text-[13px] font-bold transition hover:bg-white/10">
              <span aria-hidden className="text-base">📅</span> 네이버예약
            </a>
          )}
          {features.kakao && (
            <a href="#location" className="flex flex-1 flex-col items-center gap-0.5 border-l border-white/15 py-3 text-[13px] font-bold transition hover:bg-white/10">
              <span aria-hidden className="text-base">💬</span> 카카오톡 상담
            </a>
          )}
        </div>
      </nav>
    </div>
  )
}

function Kicker({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-black tracking-[0.22em]" style={{ color: 'var(--brand)' }}>{children}</div>
}
