'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Sharer = { name: string; last_at: string; live: boolean }
type Frame = { id: number; taken_at: string }

const fmtTime = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
})

/** 대표 전용 원격 화면 보기. 지금 공유 중인 사람의 최신 프레임을 띄우고, 하루치 기록을 넘겨 본다. */
export default function RemoteScreen() {
  const [sharing, setSharing] = useState<Sharer[]>([])
  const [picked, setPicked] = useState<string | null>(null)
  const [frames, setFrames] = useState<Frame[]>([])
  const [live, setLive] = useState(false)
  const [idx, setIdx] = useState(0) // 0 = 가장 최신
  const [following, setFollowing] = useState(true)

  // 공유 중인 사람 목록 (5초마다)
  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        const r = await fetch('/api/admin/screen?sharing=1', { cache: 'no-store' })
        if (!r.ok) return
        const { sharing } = (await r.json()) as { sharing: Sharer[] }
        if (!alive) return
        setSharing(sharing)
        setPicked(p => p ?? sharing[0]?.name ?? null)
      } catch {}
    }
    void load()
    const t = setInterval(load, 5000)
    return () => { alive = false; clearInterval(t) }
  }, [])

  // 선택한 사람의 프레임 목록 (3초마다)
  const loadFrames = useCallback(async (name: string) => {
    try {
      const r = await fetch(`/api/admin/screen?list=${encodeURIComponent(name)}`, { cache: 'no-store' })
      if (!r.ok) return
      const data = (await r.json()) as { frames: Frame[]; live: boolean }
      setFrames(data.frames)
      setLive(data.live)
    } catch {}
  }, [])

  useEffect(() => {
    if (!picked) return
    setIdx(0)
    setFollowing(true)
    void loadFrames(picked)
    const t = setInterval(() => void loadFrames(picked), 3000)
    return () => clearInterval(t)
  }, [picked, loadFrames])

  // 실시간 추적 중이면 늘 최신 프레임을 가리킨다
  useEffect(() => { if (following) setIdx(0) }, [frames, following])

  const current = frames[Math.min(idx, Math.max(0, frames.length - 1))]

  if (sharing.length === 0 && frames.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-surface p-6 text-center">
        <p className="text-sm text-ink-muted">최근 하루 안에 공유된 화면이 없어요.</p>
        <p className="mt-1 text-xs text-ink-muted">정훈·채은공듀가 어드민 화면을 열면 10초 안에 여기에 자동으로 나타납니다.</p>
      </div>
    )
  }

  return (
    <div>
      {/* 공유 중인 사람 탭 */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {sharing.map(s => (
          <button
            key={s.name}
            type="button"
            onClick={() => setPicked(s.name)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              picked === s.name ? 'bg-ink text-white' : 'bg-hover text-ink-soft hover:bg-line'
            }`}
          >
            {s.live ? (
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-1.5 animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-red-500" />
              </span>
            ) : (
              <span className="size-1.5 rounded-full bg-ink-muted/40" />
            )}
            {s.name}
          </button>
        ))}
      </div>

      {/* 화면 */}
      <div className="overflow-hidden rounded-xl border border-line bg-black">
        {current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`/api/admin/screen?id=${current.id}`} alt="원격 화면" className="block w-full" />
        ) : (
          <div className="flex h-60 items-center justify-center text-sm text-white/60">불러오는 중…</div>
        )}
      </div>

      {/* 상태줄 + 지난 기록 넘기기 */}
      <div className="mt-2 flex items-center gap-2 text-xs text-ink-muted">
        {live && idx === 0 ? (
          <span className="flex items-center gap-1 font-medium text-red-600">
            <span className="size-1.5 rounded-full bg-red-500" /> LIVE
          </span>
        ) : (
          <span>기록 보기</span>
        )}
        {current && <span className="tabular-nums">{fmtTime.format(new Date(current.taken_at))}</span>}
        <span className="ml-auto">{frames.length > 0 ? `${idx + 1} / ${frames.length}` : '0'}</span>
      </div>

      {frames.length > 1 && (
        <input
          type="range"
          min={0}
          max={frames.length - 1}
          value={idx}
          onChange={e => { setIdx(Number(e.target.value)); setFollowing(Number(e.target.value) === 0) }}
          className="mt-1.5 w-full accent-ink"
        />
      )}
      {!following && (
        <button
          type="button"
          onClick={() => { setFollowing(true); setIdx(0) }}
          className="mt-2 rounded-lg bg-hover px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:bg-line"
        >
          최신으로
        </button>
      )}
    </div>
  )
}
