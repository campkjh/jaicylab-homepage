/* 여름 도트 해변 장식. 화면 아래에 깔리는 순수 장식이라 포인터를 막지 않는다. */

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

function Crab() {
  return (
    <svg viewBox="0 0 56 30" className="pixelated h-[30px] w-[56px]" aria-hidden>
      {/* 눈 */}
      <rect x="12" y="0" width="4" height="4" fill="#fff" />
      <rect x="40" y="0" width="4" height="4" fill="#fff" />
      <rect x="14" y="1" width="2" height="2" fill="#222" />
      <rect x="42" y="1" width="2" height="2" fill="#222" />
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

function Palm() {
  return (
    <svg viewBox="0 0 72 64" className="pixelated h-[64px] w-[72px]" aria-hidden>
      {/* 줄기 */}
      <rect x="32" y="24" width="8" height="40" fill="#b07a45" />
      <rect x="32" y="32" width="8" height="4" fill="#8f5f33" />
      <rect x="32" y="44" width="8" height="4" fill="#8f5f33" />
      <rect x="32" y="56" width="8" height="4" fill="#8f5f33" />
      {/* 잎 */}
      <g className="palm-sway">
        <rect x="8" y="16" width="24" height="8" fill="#2fae63" />
        <rect x="40" y="16" width="24" height="8" fill="#2fae63" />
        <rect x="16" y="8" width="16" height="8" fill="#1f8f4e" />
        <rect x="40" y="8" width="16" height="8" fill="#1f8f4e" />
        <rect x="28" y="2" width="16" height="8" fill="#2fae63" />
        <rect x="4" y="20" width="8" height="4" fill="#1f8f4e" />
        <rect x="60" y="20" width="8" height="4" fill="#1f8f4e" />
      </g>
      {/* 코코넛 */}
      <rect x="26" y="22" width="6" height="6" fill="#7a4f2a" />
      <rect x="40" y="22" width="6" height="6" fill="#7a4f2a" />
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
  return (
    <div aria-hidden className="pointer-events-none fixed right-0 bottom-0 left-0 z-[5] select-none lg:left-[228px]">
      {/* 수평선 위 태양 (파도 뒤로 반쯤 잠긴다) */}
      <div className="absolute right-[150px] bottom-[30px]">
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
      <div className="absolute right-8 bottom-[20px] hidden sm:block">
        <Palm />
      </div>
      <div className="absolute bottom-[6px] left-[16%]">
        <Starfish />
      </div>

      {/* 총총 걸어가는 게 */}
      <div className="crab-track absolute bottom-[2px]">
        <div className="crab-bob">
          <Crab />
        </div>
      </div>
    </div>
  )
}
