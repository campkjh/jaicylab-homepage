/* eslint-disable @next/next/no-img-element */
const CLIENTS = [
  '/clients/client1.svg',
  '/clients/client2.svg',
  '/clients/client3.svg',
  '/clients/client4.svg',
  '/clients/client5.svg',
]

export function ClientMarquee() {
  const list = [...CLIENTS, ...CLIENTS]
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#050505] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#050505] to-transparent" />

      <div
        className="flex w-max items-center gap-12 px-5"
        style={{ animation: 'clientMarquee 35s linear infinite' }}
      >
        {list.map((src, i) => (
          <div key={i} className="flex shrink-0 items-center justify-center" style={{ height: 48 }}>
            <img
              src={src}
              alt="Client"
              style={{ height: 36 }}
              className="opacity-50 transition-opacity duration-300 hover:opacity-90"
              draggable={false}
            />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes clientMarquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
