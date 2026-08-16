import type { CSSProperties } from 'react'
import { type ClinicSiteConfig, mapEmbedUrl } from '@/data/medinity-site'

/**
 * 치과 홈페이지 템플릿 (A안).
 * ClinicSiteConfig 하나로 전체 사이트를 찍어낸다. 병원별 값은 config 에서만 바뀐다.
 * 자체 완결형(외부 JS 없음) — 브랜드 색은 --brand CSS 변수로 주입.
 */
export function ClinicSite({ config }: { config: ClinicSiteConfig }) {
  const { name, tagline, address, ceo, phone, bizNumber, features, about, departments, hours } = config
  const style = { ['--brand' as string]: config.brandColor } as CSSProperties
  const nav = [
    { href: '#about', label: '병원소개' },
    { href: '#care', label: '진료안내' },
    { href: '#hours', label: '진료시간' },
    { href: '#location', label: '오시는길' },
  ]

  return (
    <div style={style} className="min-h-screen scroll-smooth bg-white text-slate-800 [scroll-behavior:smooth]">
      {/* 헤더 */}
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="#top" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
            <span className="grid size-8 place-items-center rounded-xl text-white" style={{ background: 'var(--brand)' }}>🦷</span>
            {name}
          </a>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
            {nav.map(n => (
              <a key={n.href} href={n.href} className="transition hover:text-slate-900">{n.label}</a>
            ))}
          </nav>
          <a
            href={features.naverReserve ? '#location' : '#location'}
            className="rounded-full px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
            style={{ background: 'var(--brand)' }}
          >
            {features.naverReserve ? '온라인 예약' : '진료 예약'}
          </a>
        </div>
      </header>

      {/* 히어로 */}
      <section id="top" className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-[0.14]"
          style={{ background: 'radial-gradient(60% 80% at 80% 0%, var(--brand) 0%, transparent 60%)' }}
        />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-2 md:py-28">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
              <span style={{ color: 'var(--brand)' }}>●</span> 정직한 진료, 편안한 치과
            </span>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-5xl">
              {name}
            </h1>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-slate-600">{tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#location" className="rounded-full px-6 py-3 text-sm font-bold text-white shadow-md transition hover:opacity-90" style={{ background: 'var(--brand)' }}>
                진료 예약하기
              </a>
              {phone && (
                <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="rounded-full border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                  📞 {phone}
                </a>
              )}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] w-full rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 shadow-inner" />
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-white p-4 shadow-xl md:block">
              <div className="text-2xl font-black" style={{ color: 'var(--brand)' }}>안심</div>
              <div className="text-xs font-semibold text-slate-500">과잉진료 없는 정직한 상담</div>
            </div>
          </div>
        </div>
      </section>

      {/* 병원소개 */}
      <section id="about" className="border-t border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <SectionTitle kicker="ABOUT" title="병원 소개" />
          <p className="mt-6 max-w-3xl text-lg leading-loose text-slate-600">{about}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { t: '체계적인 감염관리', d: '멸균·소독 프로토콜을 철저히 준수합니다.' },
              { t: '충분한 1:1 상담', d: '치료 전 과정을 이해하기 쉽게 설명드립니다.' },
              { t: '첨단 진단 장비', d: '정밀 진단으로 필요한 치료만 제안합니다.' },
            ].map(c => (
              <div key={c.t} className="rounded-2xl border border-slate-100 bg-white p-6">
                <div className="text-base font-bold text-slate-900">{c.t}</div>
                <div className="mt-2 text-sm leading-relaxed text-slate-500">{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 진료안내 */}
      <section id="care" className="mx-auto max-w-6xl px-5 py-20">
        <SectionTitle kicker="CARE" title="진료 안내" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map(d => (
            <div key={d.name} className="group rounded-2xl border border-slate-100 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="grid size-12 place-items-center rounded-2xl text-2xl" style={{ background: 'color-mix(in srgb, var(--brand) 12%, white)' }}>
                {d.emoji}
              </div>
              <div className="mt-4 text-lg font-bold text-slate-900">{d.name}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 진료시간 */}
      <section id="hours" className="border-t border-slate-100 bg-slate-50/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2">
          <div>
            <SectionTitle kicker="HOURS" title="진료 시간" />
            <ul className="mt-8 divide-y divide-slate-200">
              {hours.map(h => (
                <li key={h.day} className="flex items-center justify-between py-3.5">
                  <span className="font-semibold text-slate-700">{h.day}</span>
                  <span className="font-bold text-slate-900">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-center rounded-3xl p-8 text-white" style={{ background: 'var(--brand)' }}>
            <div className="text-sm font-bold opacity-80">예약 문의</div>
            <div className="mt-2 text-3xl font-black">{phone || '전화 예약'}</div>
            <p className="mt-3 text-sm leading-relaxed opacity-90">
              {features.naverReserve
                ? '네이버 예약 또는 전화로 편하게 예약하실 수 있습니다.'
                : '전화로 편하게 예약하실 수 있습니다.'}
            </p>
            {features.kakao && <div className="mt-4 inline-flex w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-bold">카카오톡 상담 가능</div>}
          </div>
        </div>
      </section>

      {/* 오시는길 */}
      <section id="location" className="mx-auto max-w-6xl px-5 py-20">
        <SectionTitle kicker="LOCATION" title="오시는 길" />
        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-100">
          <iframe
            title="지도"
            src={mapEmbedUrl(address)}
            className="h-[380px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 bg-white px-6 py-4 text-sm">
            <span className="font-bold text-slate-900">{name}</span>
            {address && <span className="text-slate-600">{address}</span>}
            {phone && <span className="font-semibold" style={{ color: 'var(--brand)' }}>{phone}</span>}
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-slate-100 bg-slate-900 text-slate-300">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="text-lg font-extrabold text-white">{name}</div>
          <div className="mt-3 space-y-1 text-sm text-slate-400">
            {ceo && <div>대표원장 {ceo}</div>}
            {address && <div>{address}</div>}
            {bizNumber && <div>사업자등록번호 {bizNumber}</div>}
            {phone && <div>대표전화 {phone}</div>}
          </div>
          <div className="mt-8 border-t border-white/10 pt-6 text-xs text-slate-500">
            © {name}. All rights reserved. · Made with MEDINITY
          </div>
        </div>
      </footer>
    </div>
  )
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div>
      <div className="text-xs font-black tracking-[0.2em]" style={{ color: 'var(--brand)' }}>{kicker}</div>
      <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">{title}</h2>
    </div>
  )
}
