'use client'

/*
 * 여름 도트 해변 장식. 화면 아래에 깔리는 순수 장식이라 포인터를 막지 않는다.
 * 게가 야자수 아래를 지나가면 코코넛이 떨어져 머리에 혹이 난다.
 */

import { useEffect, useRef, useState } from 'react'

const SAND = '#f2dfae'
const SAND_DOT = '#e3cb8f'
const SEA_FRONT = '#38b9da'
const SEA_BACK = '#8fe0ef'

/** 계단식 픽셀 파도 한 줄. 타일 48px 로 무한 반복된다. */
function WaveStrip({ fill, opacity = 1 }: { fill: string; opacity?: number }) {
  return (
    <svg className="pixelated block h-[14px] w-full" preserveAspectRatio="none" aria-hidden>
      <defs>
        <pattern id={`wave-${fill.slice(1)}`} width="48" height="14" patternUnits="userSpaceOnUse">
          <path d="M0 14 V8 H12 V4 H24 V8 H36 V11 H48 V14 Z" fill={fill} opacity={opacity} />
        </pattern>
      </defs>
      <rect width="100%" height="14" fill={`url(#wave-${fill.slice(1)})`} />
    </svg>
  )
}

/** 혹이 나면 머리 위에 벌겋게 부어오른 혹 + 어질어질 별이 붙는다. */
function Crab({ bump }: { bump: boolean }) {
  return (
    <svg viewBox="0 -12 56 42" className="pixelated h-[40px] w-[56px]" aria-hidden>
      {bump && (
        <g>
          {/* 혹 */}
          <rect x="24" y="-6" width="8" height="4" fill="#f08a7d" />
          <rect x="26" y="-9" width="4" height="3" fill="#f08a7d" />
          <rect x="26" y="-8" width="2" height="2" fill="#ffffff" />
          {/* 어질어질 별 */}
          <g className="dizzy-star" fill="#ffd23e">
            <rect x="12" y="-11" width="3" height="3" />
            <rect x="42" y="-8" width="3" height="3" />
          </g>
        </g>
      )}
      {/* 눈 */}
      <rect x="12" y="0" width="4" height="4" fill="#fff" />
      <rect x="40" y="0" width="4" height="4" fill="#fff" />
      {bump ? (
        <>
          {/* 맞아서 감은 눈 */}
          <rect x="12" y="2" width="4" height="2" fill="#222" />
          <rect x="40" y="2" width="4" height="2" fill="#222" />
        </>
      ) : (
        <>
          <rect x="14" y="1" width="2" height="2" fill="#222" />
          <rect x="42" y="1" width="2" height="2" fill="#222" />
        </>
      )}
      <rect x="12" y="4" width="4" height="4" fill="#b23c33" />
      <rect x="40" y="4" width="4" height="4" fill="#b23c33" />
      {/* 집게 */}
      <rect x="0" y="10" width="8" height="10" fill="#b23c33" />
      <rect x="48" y="10" width="8" height="10" fill="#b23c33" />
      <rect x="2" y="12" width="4" height="2" fill="#8e2d26" />
      <rect x="50" y="12" width="4" height="2" fill="#8e2d26" />
      {/* 몸통 */}
      <rect x="8" y="8" width="40" height="12" fill="#e2554a" />
      <rect x="8" y="20" width="40" height="4" fill="#b23c33" />
      <rect x="24" y="13" width="3" height="3" fill="#8e2d26" />
      <rect x="30" y="13" width="3" height="3" fill="#8e2d26" />
      {/* 다리 */}
      <rect x="10" y="24" width="4" height="6" fill="#b23c33" />
      <rect x="20" y="24" width="4" height="6" fill="#b23c33" />
      <rect x="32" y="24" width="4" height="6" fill="#b23c33" />
      <rect x="42" y="24" width="4" height="6" fill="#b23c33" />
    </svg>
  )
}

/** 휘어진 줄기에 축 늘어진 잎, 코코넛이 달린 야자수 */
function Palm() {
  return (
    <svg viewBox="0 0 92 84" className="pixelated h-[84px] w-[92px]" aria-hidden>
      {/* 줄기: 오른쪽으로 살짝 휘어 올라간다 */}
      <rect x="36" y="72" width="12" height="12" fill="#a8713e" />
      <rect x="38" y="60" width="11" height="12" fill="#b07a45" />
      <rect x="41" y="48" width="10" height="12" fill="#b07a45" />
      <rect x="45" y="37" width="10" height="11" fill="#b8834e" />
      <rect x="49" y="27" width="9" height="10" fill="#b8834e" />
      {/* 줄기 마디 */}
      <rect x="38" y="66" width="11" height="3" fill="#8f5f33" />
      <rect x="41" y="54" width="10" height="3" fill="#8f5f33" />
      <rect x="45" y="43" width="10" height="3" fill="#8f5f33" />
      <rect x="49" y="32" width="9" height="3" fill="#8f5f33" />

      {/* 잎: 꼭대기에서 사방으로 처지는 프론드 */}
      <g className="palm-sway">
        {/* 왼쪽으로 축 처지는 잎 */}
        <rect x="34" y="22" width="20" height="6" fill="#2fae63" />
        <rect x="20" y="26" width="16" height="6" fill="#2fae63" />
        <rect x="8" y="32" width="14" height="6" fill="#1f8f4e" />
        <rect x="2" y="38" width="8" height="5" fill="#1f8f4e" />
        {/* 왼쪽 위 잎 */}
        <rect x="34" y="14" width="18" height="6" fill="#1f8f4e" />
        <rect x="22" y="10" width="14" height="6" fill="#2fae63" />
        <rect x="14" y="14" width="8" height="5" fill="#1f8f4e" />
        {/* 가운데 위 잎 */}
        <rect x="48" y="6" width="12" height="7" fill="#2fae63" />
        <rect x="44" y="2" width="8" height="6" fill="#1f8f4e" />
        {/* 오른쪽 위 잎 */}
        <rect x="58" y="12" width="16" height="6" fill="#2fae63" />
        <rect x="72" y="16" width="10" height="5" fill="#1f8f4e" />
        {/* 오른쪽으로 축 처지는 잎 */}
        <rect x="58" y="22" width="18" height="6" fill="#1f8f4e" />
        <rect x="74" y="28" width="12" height="6" fill="#2fae63" />
        <rect x="84" y="34" width="7" height="5" fill="#1f8f4e" />
      </g>

      {/* 코코넛 (하나는 게 머리 위로 떨어질 예정) */}
      <rect x="46" y="24" width="7" height="7" fill="#6f4726" />
      <rect x="56" y="26" width="7" height="7" fill="#7a4f2a" />
      <rect x="47" y="25" width="2" height="2" fill="#8f6a42" />
      <rect x="57" y="27" width="2" height="2" fill="#8f6a42" />
    </svg>
  )
}

function Coconut() {
  return (
    <svg viewBox="0 0 8 8" className="pixelated h-[8px] w-[8px]" aria-hidden>
      <rect width="8" height="8" fill="#6f4726" />
      <rect x="1" y="1" width="2" height="2" fill="#8f6a42" />
      <rect x="5" y="5" width="2" height="2" fill="#583a20" />
    </svg>
  )
}

function Starfish() {
  return (
    <svg viewBox="0 0 15 15" className="pixelated star-twinkle h-[15px] w-[15px]" aria-hidden>
      <rect x="6" y="0" width="3" height="15" fill="#f4a340" />
      <rect x="0" y="6" width="15" height="3" fill="#f4a340" />
      <rect x="3" y="3" width="3" height="3" fill="#e08a2c" />
      <rect x="9" y="3" width="3" height="3" fill="#e08a2c" />
      <rect x="3" y="9" width="3" height="3" fill="#e08a2c" />
      <rect x="9" y="9" width="3" height="3" fill="#e08a2c" />
    </svg>
  )
}

function Sun() {
  return (
    <svg viewBox="0 0 28 28" className="pixelated h-[28px] w-[28px]" aria-hidden>
      <g className="sun-rays" fill="#ffb42a">
        <rect x="13" y="0" width="2" height="4" />
        <rect x="13" y="24" width="2" height="4" />
        <rect x="0" y="13" width="4" height="2" />
        <rect x="24" y="13" width="4" height="2" />
        <rect x="4" y="4" width="3" height="3" />
        <rect x="21" y="4" width="3" height="3" />
      </g>
      <rect x="8" y="8" width="12" height="12" fill="#ffd23e" />
      <rect x="6" y="10" width="2" height="8" fill="#ffd23e" />
      <rect x="20" y="10" width="2" height="8" fill="#ffd23e" />
      <rect x="10" y="6" width="8" height="2" fill="#ffd23e" />
      <rect x="10" y="20" width="8" height="2" fill="#ffd23e" />
    </svg>
  )
}

export default function SummerShore() {
  const trackRef = useRef<HTMLDivElement>(null)
  const palmRef = useRef<HTMLDivElement>(null)
  /** 한 번 지나갈 때 한 대만 맞도록, 멀어지면 다시 장전한다 */
  const armed = useRef(true)
  const busy = useRef(false)
  const [falling, setFalling] = useState<{ left: number } | null>(null)
  const [bump, setBump] = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    // 게가 코코넛 낙하 지점에 왔는지 주기적으로 본다.
    const watcher = setInterval(() => {
      const track = trackRef.current
      const palm = palmRef.current
      if (!track || !palm || busy.current) return
      // 야자수가 숨는 좁은 화면에선 개그도 쉰다.
      if (palm.offsetParent === null) return

      const crabCenter = track.getBoundingClientRect().left + 28
      const palmRect = palm.getBoundingClientRect()
      const coconutX = palmRect.left + 46 // 야자수 svg 의 코코넛 위치

      if (!armed.current) {
        if (Math.abs(crabCenter - coconutX) > 160) armed.current = true
        return
      }
      if (Math.abs(crabCenter - coconutX) < 9) {
        armed.current = false
        busy.current = true
        setFalling({ left: coconutX - 4 })

        // 코코넛이 0.35초 떨어진 뒤 명중 → 혹 + 잠깐 기절
        timers.push(
          setTimeout(() => {
            setBump(true)
            if (trackRef.current) trackRef.current.style.animationPlayState = 'paused'
          }, 350),
          setTimeout(() => setFalling(null), 1800),
          setTimeout(() => {
            if (trackRef.current) trackRef.current.style.animationPlayState = 'running'
          }, 1700),
          setTimeout(() => {
            setBump(false)
            busy.current = false
          }, 8000),
        )
      }
    }, 120)

    return () => {
      clearInterval(watcher)
      timers.forEach(clearTimeout)
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed right-0 bottom-0 left-0 z-[5] select-none lg:left-[228px]">
      {/* 수평선 위 태양 (파도 뒤로 반쯤 잠긴다) */}
      <div className="absolute right-[170px] bottom-[30px]">
        <Sun />
      </div>

      {/* 파도 두 겹: 서로 다른 속도의 계단식 이동 */}
      <div className="absolute inset-x-0 bottom-[30px] overflow-hidden">
        <div className="wave-back w-[calc(100%+96px)]">
          <WaveStrip fill={SEA_BACK} opacity={0.9} />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-[24px] overflow-hidden">
        <div className="wave-front w-[calc(100%+96px)]">
          <WaveStrip fill={SEA_FRONT} />
        </div>
      </div>

      {/* 모래사장 (점점이 모래알) */}
      <div
        className="h-[26px] w-full"
        style={{
          backgroundColor: SAND,
          backgroundImage: `radial-gradient(${SAND_DOT} 1.5px, transparent 1.5px)`,
          backgroundSize: '14px 9px',
        }}
      />

      {/* 야자수와 불가사리 */}
      <div ref={palmRef} className="absolute right-8 bottom-[18px] hidden sm:block">
        <Palm />
      </div>
      <div className="absolute bottom-[6px] left-[16%]">
        <Starfish />
      </div>

      {/* 떨어지는 코코넛 */}
      {falling && (
        <div className="coconut-fall absolute bottom-[64px]" style={{ left: falling.left }}>
          <Coconut />
        </div>
      )}

      {/* 총총 걸어가는 게 */}
      <div ref={trackRef} className="crab-track absolute bottom-[2px]">
        <div className="crab-bob">
          <Crab bump={bump} />
        </div>
      </div>
    </div>
  )
}
