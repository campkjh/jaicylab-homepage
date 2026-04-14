/* eslint-disable @next/next/no-img-element */
const TECHS: { name: string; file: string; h?: number }[] = [
  { name: 'Swift',      file: '/tech/swift.svg',      h: 28 },
  { name: 'Kotlin',     file: '/tech/kotlin.svg',     h: 28 },
  { name: 'React',      file: '/tech/react.svg',      h: 36 },
  { name: 'Next.js',    file: '/tech/nextjs.svg',     h: 22 },
  { name: 'Vue.js',     file: '/tech/vue.svg',        h: 30 },
  { name: 'Flutter',    file: '/tech/flutter.svg',    h: 26 },
  { name: 'Ionic',      file: '/tech/ionic.svg',      h: 24 },
  { name: 'Capacitor',  file: '/tech/capacitor.svg',  h: 24 },
  { name: 'Spring',     file: '/tech/spring.svg',     h: 26 },
  { name: 'GitHub',     file: '/tech/github.svg',     h: 24 },
]

export function TechMarquee() {
  const list = [...TECHS, ...TECHS]
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white py-10 shadow-[0_8px_32px_rgba(15,23,42,0.04)]">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />

      <div
        className="flex w-max items-center gap-10 px-5"
        style={{ animation: 'techMarquee 40s linear infinite' }}
      >
        {list.map((t, i) => (
          <div key={`${t.name}-${i}`} className="flex shrink-0 items-center justify-center" style={{ height: 48, minWidth: 128 }}>
            <img
              src={t.file}
              alt={t.name}
              style={{ height: t.h ?? 28 }}
              className="opacity-80 transition-all duration-300 hover:opacity-100 hover:scale-110"
              draggable={false}
            />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes techMarquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
