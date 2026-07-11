'use client'

/*
 * 여름 도트 해변 + 꽃게 펫.
 * 꽃게는 40ms 물리 루프로 돌아다니며: 클릭하면 말대꾸(친화력 증감), 드래그로 옮길 수 있고,
 * 헬리콥터로 타임라인까지 올라갔다 추락하고, 서핑하고, 오늘 날짜 칸에서 썬탠하고,
 * 오늘 식단을 보며 침을 흘리고, 17시가 넘으면 차 옆에서 퇴근 준비를 하고, 비 오면 우산을 쓴다.
 * 장식은 클릭을 막지 않지만 꽃게 본체만 pointer-events 를 받는다.
 */

import { useCallback, useEffect, useRef, useState } from 'react'

const SAND = '#f2dfae'
const SAND_DOT = '#e3cb8f'
const SEA_FRONT = '#38b9da'
const SEA_MID = '#5fcbe4'
const SEA_BACK = '#8fe0ef'

const GROUND_Y = 2
const SURF_Y = 30
const CRAB_W = 56

type Mode =
  | 'walk'
  | 'goto'
  | 'climb'
  | 'suntan'
  | 'drool'
  | 'surf'
  | 'heliUp'
  | 'heliDrop'
  | 'fall'
  | 'stun'
  | 'car'
  | 'drag'
  | 'placed'

// ─────────────────────────── 대사

const LINES = {
  poke: ['왜 건들여 {n}', '응? 왜', '왜 불러 {n}', '집게 조심해라?', '옆구리 간지럽다니까', '왜요 왜요 왜요', '나 바빠 보이지 않아?', '헉 깜짝이야', '{n} 손 차갑다', '노크 먼저 해줄래?'],
  pokeAnnoyed: ['아 하지마', '그만 눌러!!', '야!! {n}!!', '진짜 화낸다?', '꼬집는다? 진짜 꼬집는다?', '으아아 어지러워', '한 번만 더 누르면 문다', '{n} 너 이름 기억해놨다', '스트레스 받으면 옆으로만 걷는다고!', '아아아 그만~~', '갑질 신고할 거야', '집게 나간다???'],
  pokeLow: ['...', '흥.', '너랑 말 안 해 {n}', '저리 가...', '건들지 마라 진짜', '(못 들은 척)', '오늘은 대화하고 싶지 않아'],
  pokeHigh: ['헤헤 {n} 왔구나', '오늘도 와줬네~', '심심했는데 잘 왔어', '{n} 최고야', '이따 모래성 같이 만들래?', '너 오면 기분 좋아', '집게 하이파이브!'],
  pet: ['기분 좋다~', '오~ 부드러운 손길', '우리 좀 친해진 듯?', '한 번 더 쓰다듬어도 돼', '헤헤헤', '등딱지 광나지?'],
  idle: ['덥다 더워...', '바다는 언제 봐도 좋네', '야자수 밑은 위험해...', '코코넛은 무서워', '오늘 할 일 다 끝냈어?', '{n} 일해라~', '짠내 나는 하루', '옆으로 걷는 게 제일 빨라', '모래알 세는 중... 하나, 둘...', '갈매기한테 새우깡 뺏겼어', '이 바다 관리자가 나야', '점심 뭐 먹었어?', '파도 소리 ASMR 최고', '일광욕하기 좋은 날이네'],
  suntan: ['썬탠 중... 방해 금지', '선크림 발랐으니까 괜찮아', '오늘 날짜 자리가 명당이야', '등딱지 태우는 중~', '치이익... 익는 소리 아니지?'],
  drool: ['오늘 메뉴 맛있겠구나...', '한 입만... 안 될까?', '군침이 싹 도네', '이거 내 몫도 있는 거지?', '냄새만 맡을게...'],
  surf: ['파도 좋다!!', '서핑은 옆으로 타는 거야', '우와아아~~', '발리까지 간다~', '이게 바로 꽃게 파도타기'],
  heli: ['타임라인 점검하러 출동!', '날 수 있을 것 같아!', '위에서 보면 다 보인다구', '두두두두두두'],
  heliCrash: ['아야야...', '다신 안 탄다...', '착륙은 원래 어려운 거야', '헬기 면허 따야겠다...', '별이 보여...'],
  car: ['슬슬 퇴근 준비...', '차 시동 걸어놨어', '6시 되면 바로 출발이야', '{n} 퇴근 안 해?', '트렁크에 모래 좀 싣고...', '내일 또 보자~', '퇴근길 막히기 전에 가야지'],
  rain: ['비 온다...', '우산 챙겼지 {n}?', '꿉꿉해...', '빗소리 좋다~', '등딱지에 빗방울 통통'],
  drop: ['여기가 어디야?!', '함부로 옮기지 마!', '우와 순간이동?!', '어지러워...', '오? 여기 뷰 좋은데?', '납치는 신고감이야 {n}', '내려줘서 고마워...?'],
  coconut: ['아야!!', '누가 코코넛 던졌어!!', '야자수 밑은 피했어야 했는데...', '별이 보여...', '혹 났잖아!!'],
}

// ─────────────────────────── 픽셀 파츠

function WaveStrip({ id, fill, opacity = 1 }: { id: string; fill: string; opacity?: number }) {
  return (
    <svg className="pixelated block h-[14px] w-full" preserveAspectRatio="none" aria-hidden>
      <defs>
        <pattern id={id} width="48" height="14" patternUnits="userSpaceOnUse">
          <path d="M0 14 V8 H12 V4 H24 V8 H36 V11 H48 V14 Z" fill={fill} opacity={opacity} />
        </pattern>
      </defs>
      <rect width="100%" height="14" fill={`url(#${id})`} />
    </svg>
  )
}

/** 파도 거품: 흰 점선이 계단식으로 흐른다 */
function FoamStrip() {
  return (
    <svg className="pixelated block h-[4px] w-full" preserveAspectRatio="none" aria-hidden>
      <defs>
        <pattern id="foam" width="24" height="4" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="6" height="3" fill="#ffffff" opacity="0.85" />
          <rect x="12" y="1" width="4" height="3" fill="#ffffff" opacity="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="4" fill="url(#foam)" />
    </svg>
  )
}

function CrabBody({ eyes, bump }: { eyes: 'open' | 'closed' | 'dizzy'; bump: boolean }) {
  return (
    <svg viewBox="0 -12 56 42" className="pixelated h-[40px] w-[56px]" aria-hidden>
      {bump && (
        <g>
          <rect x="24" y="-6" width="8" height="4" fill="#f08a7d" />
          <rect x="26" y="-9" width="4" height="3" fill="#f08a7d" />
          <rect x="26" y="-8" width="2" height="2" fill="#ffffff" />
        </g>
      )}
      {/* 눈 */}
      <rect x="12" y="0" width="4" height="4" fill="#fff" />
      <rect x="40" y="0" width="4" height="4" fill="#fff" />
      {eyes === 'open' && (
        <>
          <rect x="14" y="1" width="2" height="2" fill="#222" />
          <rect x="42" y="1" width="2" height="2" fill="#222" />
        </>
      )}
      {eyes === 'closed' && (
        <>
          <rect x="12" y="2" width="4" height="2" fill="#222" />
          <rect x="40" y="2" width="4" height="2" fill="#222" />
        </>
      )}
      {eyes === 'dizzy' && (
        <>
          <rect x="12" y="0" width="2" height="2" fill="#222" />
          <rect x="14" y="2" width="2" height="2" fill="#222" />
          <rect x="40" y="0" width="2" height="2" fill="#222" />
          <rect x="42" y="2" width="2" height="2" fill="#222" />
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

function Sunglasses() {
  return (
    <svg viewBox="0 0 56 8" className="pixelated absolute top-[10px] left-0 h-[8px] w-[56px]" aria-hidden>
      <rect x="10" y="0" width="8" height="6" fill="#1c1c1c" />
      <rect x="38" y="0" width="8" height="6" fill="#1c1c1c" />
      <rect x="18" y="2" width="20" height="2" fill="#1c1c1c" />
    </svg>
  )
}

function Helicopter({ spinning }: { spinning: boolean }) {
  return (
    <svg viewBox="0 0 40 14" className="pixelated absolute -top-[14px] left-[8px] h-[14px] w-[40px]" aria-hidden>
      <g className={spinning ? 'heli-spin' : ''} style={{ transformOrigin: '20px 2px' }}>
        <rect x="2" y="0" width="36" height="3" fill="#4b5563" />
      </g>
      <rect x="18" y="3" width="4" height="6" fill="#6b7280" />
      <rect x="14" y="9" width="12" height="4" fill="#f59e0b" />
    </svg>
  )
}

function Umbrella() {
  return (
    <svg viewBox="0 0 36 30" className="pixelated absolute -top-[26px] left-[12px] h-[30px] w-[36px]" aria-hidden>
      <rect x="4" y="6" width="28" height="4" fill="#3b82f6" />
      <rect x="8" y="2" width="20" height="4" fill="#60a5fa" />
      <rect x="12" y="0" width="12" height="2" fill="#3b82f6" />
      <rect x="4" y="10" width="6" height="2" fill="#2563eb" />
      <rect x="15" y="10" width="6" height="2" fill="#2563eb" />
      <rect x="26" y="10" width="6" height="2" fill="#2563eb" />
      <rect x="17" y="10" width="3" height="18" fill="#8f5f33" />
    </svg>
  )
}

function Surfboard() {
  return (
    <svg viewBox="0 0 72 10" className="pixelated absolute -bottom-[8px] -left-[8px] h-[10px] w-[72px]" aria-hidden>
      <rect x="4" y="2" width="64" height="6" fill="#fbbf24" />
      <rect x="0" y="4" width="4" height="4" fill="#fbbf24" />
      <rect x="68" y="4" width="4" height="2" fill="#fbbf24" />
      <rect x="30" y="2" width="4" height="6" fill="#ef4444" />
    </svg>
  )
}

function Drool() {
  return (
    <svg viewBox="0 0 6 12" className="pixelated drool-drip absolute top-[26px] left-[34px] h-[12px] w-[6px]" aria-hidden>
      <rect x="0" y="0" width="4" height="6" fill="#7dd3fc" />
      <rect x="1" y="6" width="3" height="4" fill="#bae6fd" />
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

function Palm() {
  return (
    <svg viewBox="0 0 92 84" className="pixelated h-[84px] w-[92px]" aria-hidden>
      <rect x="36" y="72" width="12" height="12" fill="#a8713e" />
      <rect x="38" y="60" width="11" height="12" fill="#b07a45" />
      <rect x="41" y="48" width="10" height="12" fill="#b07a45" />
      <rect x="45" y="37" width="10" height="11" fill="#b8834e" />
      <rect x="49" y="27" width="9" height="10" fill="#b8834e" />
      <rect x="38" y="66" width="11" height="3" fill="#8f5f33" />
      <rect x="41" y="54" width="10" height="3" fill="#8f5f33" />
      <rect x="45" y="43" width="10" height="3" fill="#8f5f33" />
      <rect x="49" y="32" width="9" height="3" fill="#8f5f33" />
      <g className="palm-sway">
        <rect x="34" y="22" width="20" height="6" fill="#2fae63" />
        <rect x="20" y="26" width="16" height="6" fill="#2fae63" />
        <rect x="8" y="32" width="14" height="6" fill="#1f8f4e" />
        <rect x="2" y="38" width="8" height="5" fill="#1f8f4e" />
        <rect x="34" y="14" width="18" height="6" fill="#1f8f4e" />
        <rect x="22" y="10" width="14" height="6" fill="#2fae63" />
        <rect x="14" y="14" width="8" height="5" fill="#1f8f4e" />
        <rect x="48" y="6" width="12" height="7" fill="#2fae63" />
        <rect x="44" y="2" width="8" height="6" fill="#1f8f4e" />
        <rect x="58" y="12" width="16" height="6" fill="#2fae63" />
        <rect x="72" y="16" width="10" height="5" fill="#1f8f4e" />
        <rect x="58" y="22" width="18" height="6" fill="#1f8f4e" />
        <rect x="74" y="28" width="12" height="6" fill="#2fae63" />
        <rect x="84" y="34" width="7" height="5" fill="#1f8f4e" />
      </g>
      <rect x="46" y="24" width="7" height="7" fill="#6f4726" />
      <rect x="56" y="26" width="7" height="7" fill="#7a4f2a" />
      <rect x="47" y="25" width="2" height="2" fill="#8f6a42" />
      <rect x="57" y="27" width="2" height="2" fill="#8f6a42" />
    </svg>
  )
}

function Starfish({ tone = '#f4a340', dark = '#e08a2c' }: { tone?: string; dark?: string }) {
  return (
    <svg viewBox="0 0 15 15" className="pixelated star-twinkle h-[15px] w-[15px]" aria-hidden>
      <rect x="6" y="0" width="3" height="15" fill={tone} />
      <rect x="0" y="6" width="15" height="3" fill={tone} />
      <rect x="3" y="3" width="3" height="3" fill={dark} />
      <rect x="9" y="3" width="3" height="3" fill={dark} />
      <rect x="3" y="9" width="3" height="3" fill={dark} />
      <rect x="9" y="9" width="3" height="3" fill={dark} />
    </svg>
  )
}

function Shell() {
  return (
    <svg viewBox="0 0 12 10" className="pixelated h-[10px] w-[12px]" aria-hidden>
      <rect x="2" y="2" width="8" height="4" fill="#f9a8d4" />
      <rect x="0" y="4" width="12" height="2" fill="#f472b6" />
      <rect x="4" y="0" width="4" height="2" fill="#fbcfe8" />
      <rect x="4" y="6" width="4" height="4" fill="#f472b6" />
    </svg>
  )
}

function Sandcastle() {
  return (
    <svg viewBox="0 0 36 26" className="pixelated h-[26px] w-[36px]" aria-hidden>
      <rect x="4" y="12" width="28" height="14" fill="#e6cf9a" />
      <rect x="10" y="4" width="16" height="10" fill="#edd8a8" />
      <rect x="10" y="2" width="3" height="3" fill="#edd8a8" />
      <rect x="16" y="2" width="3" height="3" fill="#edd8a8" />
      <rect x="22" y="2" width="3" height="3" fill="#edd8a8" />
      <rect x="16" y="8" width="4" height="6" fill="#b8985f" />
      <rect x="4" y="10" width="4" height="3" fill="#e6cf9a" />
      <rect x="28" y="10" width="4" height="3" fill="#e6cf9a" />
      <rect x="17" y="-2" width="2" height="5" fill="#8f5f33" />
      <rect x="19" y="-2" width="4" height="3" fill="#ef4444" />
    </svg>
  )
}

function BeachBall() {
  return (
    <svg viewBox="0 0 14 14" className="pixelated h-[14px] w-[14px]" aria-hidden>
      <rect x="4" y="0" width="6" height="14" fill="#ef4444" />
      <rect x="0" y="4" width="14" height="6" fill="#fbbf24" />
      <rect x="4" y="4" width="6" height="6" fill="#ffffff" />
    </svg>
  )
}

function Parasol() {
  return (
    <svg viewBox="0 0 40 36" className="pixelated h-[36px] w-[40px]" aria-hidden>
      <rect x="4" y="8" width="32" height="4" fill="#f97316" />
      <rect x="8" y="4" width="24" height="4" fill="#fdba74" />
      <rect x="14" y="0" width="12" height="4" fill="#f97316" />
      <rect x="19" y="12" width="3" height="24" fill="#8f5f33" />
    </svg>
  )
}

function Seagull() {
  return (
    <svg viewBox="0 0 20 8" className="pixelated h-[8px] w-[20px]" aria-hidden>
      <g className="gull-flap" style={{ transformOrigin: '10px 4px' }}>
        <rect x="0" y="2" width="8" height="2" fill="#64748b" />
        <rect x="12" y="2" width="8" height="2" fill="#64748b" />
      </g>
      <rect x="8" y="3" width="4" height="3" fill="#94a3b8" />
      <rect x="12" y="3" width="2" height="2" fill="#f59e0b" />
    </svg>
  )
}

function Fish() {
  return (
    <svg viewBox="0 0 16 10" className="pixelated h-[10px] w-[16px]" aria-hidden>
      <rect x="2" y="2" width="10" height="6" fill="#60a5fa" />
      <rect x="12" y="0" width="4" height="4" fill="#3b82f6" />
      <rect x="12" y="6" width="4" height="4" fill="#3b82f6" />
      <rect x="4" y="4" width="2" height="2" fill="#1d4ed8" />
    </svg>
  )
}

function Car() {
  return (
    <svg viewBox="0 0 64 30" className="pixelated h-[30px] w-[64px]" aria-hidden>
      <rect x="12" y="2" width="30" height="10" fill="#93c5fd" />
      <rect x="14" y="4" width="10" height="6" fill="#dbeafe" />
      <rect x="28" y="4" width="10" height="6" fill="#dbeafe" />
      <rect x="4" y="10" width="56" height="12" fill="#3b82f6" />
      <rect x="4" y="10" width="56" height="3" fill="#60a5fa" />
      <rect x="54" y="14" width="6" height="3" fill="#fde047" />
      <rect x="4" y="14" width="4" height="3" fill="#ef4444" />
      <rect x="12" y="20" width="10" height="10" fill="#1f2937" />
      <rect x="42" y="20" width="10" height="10" fill="#1f2937" />
      <rect x="15" y="23" width="4" height="4" fill="#9ca3af" />
      <rect x="45" y="23" width="4" height="4" fill="#9ca3af" />
      {/* 지붕에 실은 짐 */}
      <rect x="18" y="-4" width="16" height="6" fill="#b45309" />
      <rect x="22" y="-4" width="2" height="6" fill="#7c2d12" />
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

// ─────────────────────────── 본체

export default function SummerShore({ admin }: { admin: string }) {
  const shoreRef = useRef<HTMLDivElement>(null)
  const crabRef = useRef<HTMLDivElement>(null)
  const palmRef = useRef<HTMLDivElement>(null)

  // 물리 상태는 ref 로 들고 매 틱 DOM 에 직접 쓴다. (리렌더 최소화)
  const phys = useRef({
    x: 60,
    y: GROUND_Y,
    dir: 1,
    vy: 0,
    mode: 'walk' as Mode,
    modeUntil: 0,
    target: { x: 0, y: 0 },
    afterGoto: 'walk' as Mode,
    // 접속 직후엔 잠시 얌전히 걷는다
    lastActivity: Date.now() - 8000,
    coconutArmed: true,
    coconutBusy: false,
  })

  // 화면에 반영해야 하는 것만 state
  const [mode, setMode] = useState<Mode>('walk')
  const [bubble, setBubble] = useState<{ text: string; key: number } | null>(null)
  const [bump, setBump] = useState(false)
  const [dizzy, setDizzy] = useState(false)
  const [moving, setMoving] = useState(true)
  const [facing, setFacing] = useState<1 | -1>(1)
  const [raining, setRaining] = useState(false)
  const [evening, setEvening] = useState(false)
  const [coconutDrop, setCoconutDrop] = useState<{ left: number } | null>(null)
  const [flash, setFlash] = useState<'love' | 'anger' | null>(null)
  const [fishJump, setFishJump] = useState<{ left: number; key: number } | null>(null)

  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pokeTimes = useRef<number[]>([])
  const affinity = useRef(50)
  const dragInfo = useRef<{ startX: number; startY: number; moved: boolean; pointerId: number } | null>(null)
  /** 물리 루프가 재생성 없이 최신 날씨를 읽도록 ref 로도 든다 (재생성되면 진행 중인 타이머가 끊긴다) */
  const rainRef = useRef(false)
  useEffect(() => {
    rainRef.current = raining
  }, [raining])

  const setModeBoth = useCallback((m: Mode) => {
    phys.current.mode = m
    setMode(m)
  }, [])

  const say = useCallback(
    (pool: string[], holdMs = 3200) => {
      const text = pool[Math.floor(Math.random() * pool.length)].replaceAll('{n}', admin)
      setBubble({ text, key: Date.now() })
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current)
      bubbleTimer.current = setTimeout(() => setBubble(null), holdMs)
    },
    [admin],
  )

  // ── 친화력 (localStorage, 0~100, 처음엔 50)
  useEffect(() => {
    const raw = localStorage.getItem(`jl.crab.affinity.${admin}`)
    if (raw === null) return
    const saved = Number(raw)
    if (Number.isFinite(saved) && saved >= 0 && saved <= 100) affinity.current = saved
  }, [admin])

  const bumpAffinity = useCallback(
    (delta: number) => {
      affinity.current = Math.min(100, Math.max(0, affinity.current + delta))
      localStorage.setItem(`jl.crab.affinity.${admin}`, String(affinity.current))
      setFlash(delta > 0 ? 'love' : 'anger')
      setTimeout(() => setFlash(null), 900)
    },
    [admin],
  )

  // ── 날씨 (서울, open-meteo). 실패하면 맑음으로 둔다.
  useEffect(() => {
    let alive = true
    const check = async () => {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=37.57&longitude=126.98&current=precipitation,weather_code',
        )
        const json = (await res.json()) as { current?: { precipitation?: number; weather_code?: number } }
        const c = json.current
        if (!alive || !c) return
        const wet = (c.precipitation ?? 0) > 0 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(c.weather_code ?? 0)
        setRaining(wet)
      } catch {
        /* 오프라인이면 맑음 */
      }
    }
    void check()
    const id = setInterval(check, 30 * 60_000)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [])

  // ── 17시 체크 (1분마다)
  useEffect(() => {
    const check = () => setEvening(new Date().getHours() >= 17)
    check()
    const id = setInterval(check, 60_000)
    return () => clearInterval(id)
  }, [])

  // ── 물고기 점프 (가끔)
  useEffect(() => {
    const id = setInterval(() => {
      const w = shoreRef.current?.getBoundingClientRect().width ?? 800
      if (Math.random() < 0.5) setFishJump({ left: 60 + Math.random() * (w - 160), key: Date.now() })
    }, 14_000)
    return () => clearInterval(id)
  }, [])

  // ── 물리 루프
  useEffect(() => {
    const WALK_SPEED = 1.0
    const timers: ReturnType<typeof setTimeout>[] = []
    const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms))

    const shoreW = () => shoreRef.current?.getBoundingClientRect().width ?? 800
    const shoreLeft = () => shoreRef.current?.getBoundingClientRect().left ?? 0

    /** 오늘 날짜 캘린더 칸 (스케줄 페이지에서만 있다) */
    const todayCell = () => document.querySelector<HTMLElement>('[data-today="1"]')
    const todayIso = () => {
      const d = new Date()
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    }
    const todayMealChip = () => document.querySelector<HTMLElement>(`[data-meal="${todayIso()}"]`)
    /** 좁은 화면에선 패널이 display:none 으로 숨는다. 안 보이면 없다고 친다. */
    const timelinePanel = () => {
      const el = document.querySelector<HTMLElement>('[data-timeline-panel]')
      return el && el.offsetParent !== null ? el : null
    }

    /** rect 위에 올라서는 목표 좌표 (shore 기준 x, bottom 기준 y) */
    const perchOn = (rect: DOMRect, offsetY = 6) => ({
      x: rect.left - shoreLeft() + rect.width / 2 - CRAB_W / 2,
      y: Math.max(GROUND_Y, window.innerHeight - rect.bottom + offsetY),
    })

    const startActivity = () => {
      const p = phys.current
      const now = Date.now()
      if (now - p.lastActivity < 18_000) return
      const hour = new Date().getHours()

      type Act = { w: number; run: () => void }
      const acts: Act[] = [{ w: 3, run: () => say(rainRef.current ? LINES.rain : LINES.idle) }]

      acts.push({
        w: 2,
        run: () => {
          setModeBoth('surf')
          p.y = SURF_Y
          p.dir = 1
          p.modeUntil = now + 9000
          say(LINES.surf)
        },
      })

      const panel = timelinePanel()
      if (panel) {
        acts.push({
          w: 1.6,
          run: () => {
            const r = panel.getBoundingClientRect()
            p.target = { x: r.left - shoreLeft() + 40, y: window.innerHeight - r.top - 140 }
            setModeBoth('heliUp')
            say(LINES.heli)
          },
        })
      }

      const cell = todayCell()
      if (cell) {
        acts.push({
          w: 2,
          run: () => {
            p.target = perchOn(cell.getBoundingClientRect())
            p.afterGoto = 'suntan'
            setModeBoth('goto')
          },
        })
      }

      const meal = todayMealChip()
      if (meal) {
        acts.push({
          w: 2,
          run: () => {
            p.target = perchOn(meal.getBoundingClientRect(), -30)
            p.afterGoto = 'drool'
            setModeBoth('goto')
          },
        })
      }

      if (hour >= 17) {
        acts.push({
          w: 4,
          run: () => {
            p.target = { x: 40, y: GROUND_Y }
            p.afterGoto = 'car'
            setModeBoth('goto')
          },
        })
      }

      const total = acts.reduce((s, a) => s + a.w, 0)
      let roll = Math.random() * total
      for (const a of acts) {
        roll -= a.w
        if (roll <= 0) {
          p.lastActivity = now
          a.run()
          return
        }
      }
    }

    // 콘솔 장난감 겸 검증용: window.__crab.surf() 처럼 바로 시켜볼 수 있다.
    const forceActivity = (kind: 'surf' | 'heli' | 'suntan' | 'drool' | 'car' | 'coconut') => {
      const p = phys.current
      p.lastActivity = 0
      setDizzy(false)
      if (kind === 'surf') {
        setModeBoth('surf')
        p.y = SURF_Y
        p.modeUntil = Date.now() + 9000
        say(LINES.surf)
      } else if (kind === 'heli') {
        const panel = timelinePanel()
        if (!panel) return '타임라인 패널이 안 보여요'
        const r = panel.getBoundingClientRect()
        p.target = { x: r.left - shoreLeft() + 40, y: window.innerHeight - r.top - 140 }
        setModeBoth('heliUp')
        say(LINES.heli)
      } else if (kind === 'suntan') {
        const cell = todayCell()
        if (!cell) return '오늘 날짜 칸이 안 보여요 (스케줄 페이지에서만)'
        p.target = perchOn(cell.getBoundingClientRect())
        p.afterGoto = 'suntan'
        setModeBoth('goto')
      } else if (kind === 'drool') {
        const meal = todayMealChip()
        if (!meal) return '오늘 식단이 없어요'
        p.target = perchOn(meal.getBoundingClientRect(), -30)
        p.afterGoto = 'drool'
        setModeBoth('goto')
      } else if (kind === 'car') {
        p.target = { x: 40, y: GROUND_Y }
        p.afterGoto = 'car'
        setModeBoth('goto')
      } else if (kind === 'coconut') {
        const palm = palmRef.current
        if (!palm) return '야자수가 안 보여요'
        p.x = palm.getBoundingClientRect().left - shoreLeft() + 46 - CRAB_W / 2 - 40
        p.dir = 1
        p.coconutArmed = true
        p.coconutBusy = false
        setModeBoth('walk')
      }
      return 'ok'
    }
    Object.assign(window as object, {
      __crab: {
        do: forceActivity,
        rain: (v: boolean) => setRaining(v),
        affinity: () => affinity.current,
        state: () => ({ ...phys.current }),
      },
    })

    const tick = setInterval(() => {
      const p = phys.current
      const W = shoreW()
      const now = Date.now()

      switch (p.mode) {
        case 'walk': {
          p.x += p.dir * WALK_SPEED
          if (p.x < 0) {
            p.x = 0
            p.dir = 1
          }
          if (p.x > W - CRAB_W) {
            p.x = W - CRAB_W
            p.dir = -1
          }
          p.y = GROUND_Y

          // 야자수 코코넛 개그
          const palm = palmRef.current
          if (palm && !p.coconutBusy && palm.offsetParent !== null) {
            const coconutX = palm.getBoundingClientRect().left - shoreLeft() + 46
            const crabCenter = p.x + CRAB_W / 2
            if (!p.coconutArmed) {
              if (Math.abs(crabCenter - coconutX) > 160) p.coconutArmed = true
            } else if (Math.abs(crabCenter - coconutX) < 9) {
              p.coconutArmed = false
              p.coconutBusy = true
              setCoconutDrop({ left: coconutX - 4 })
              later(() => {
                setBump(true)
                setDizzy(true)
                setModeBoth('stun')
                p.modeUntil = Date.now() + 1800
                say(LINES.coconut)
              }, 350)
              later(() => setCoconutDrop(null), 1800)
              later(() => setBump(false), 9000)
              later(() => {
                p.coconutBusy = false
              }, 12_000)
            }
          }

          // 랜덤 활동
          if (Math.random() < 1 / 220) startActivity()
          break
        }

        case 'goto': {
          const dx = p.target.x - p.x
          p.dir = dx >= 0 ? 1 : -1
          if (Math.abs(dx) <= 2) {
            if (p.afterGoto === 'suntan' || p.afterGoto === 'drool') {
              setModeBoth('climb')
            } else if (p.afterGoto === 'car') {
              setModeBoth('car')
              p.modeUntil = now + 14_000
              say(LINES.car)
            } else {
              setModeBoth('walk')
            }
          } else {
            p.x += p.dir * WALK_SPEED * 2.6
          }
          p.y = GROUND_Y
          break
        }

        case 'climb': {
          if (p.y >= p.target.y) {
            p.y = p.target.y
            setModeBoth(p.afterGoto)
            p.modeUntil = now + (p.afterGoto === 'suntan' ? 11_000 : 8000)
            say(p.afterGoto === 'suntan' ? LINES.suntan : LINES.drool)
          } else {
            p.y += 4
          }
          break
        }

        case 'suntan':
        case 'drool': {
          if (now > p.modeUntil) {
            setModeBoth('fall')
            p.vy = 0
          }
          break
        }

        case 'surf': {
          p.x += p.dir * 3
          if (p.x < 20) {
            p.x = 20
            p.dir = 1
          }
          if (p.x > W - CRAB_W - 20) {
            p.x = W - CRAB_W - 20
            p.dir = -1
          }
          p.y = SURF_Y + (Math.floor(now / 240) % 2 === 0 ? 0 : 2)
          if (now > p.modeUntil) {
            p.vy = 0
            setModeBoth('fall')
          }
          break
        }

        case 'heliUp': {
          const dy = p.target.y - p.y
          const dx = p.target.x - p.x
          p.y += Math.sign(dy) * Math.min(3.4, Math.abs(dy))
          p.x += Math.sign(dx) * Math.min(2.2, Math.abs(dx))
          p.dir = dx >= 0 ? 1 : -1
          if (Math.abs(dy) < 3 && Math.abs(dx) < 6) {
            // 프로펠러 고장! 추락
            setModeBoth('heliDrop')
            p.vy = 0
          }
          break
        }

        case 'heliDrop': {
          p.vy += 0.5
          p.y -= p.vy
          if (p.y <= GROUND_Y) {
            p.y = GROUND_Y
            p.vy = 0
            setModeBoth('stun')
            setDizzy(true)
            p.modeUntil = now + 2200
            say(LINES.heliCrash)
          }
          break
        }

        case 'fall': {
          p.vy += 0.5
          p.y -= p.vy
          if (p.y <= GROUND_Y) {
            p.y = GROUND_Y
            p.vy = 0
            setModeBoth('walk')
          }
          break
        }

        case 'stun': {
          if (now > p.modeUntil) {
            setDizzy(false)
            setModeBoth('walk')
          }
          break
        }

        case 'car': {
          // 차 옆에서 왔다갔다 짐 싣는 시늉
          const base = 46
          p.x = base + (Math.floor(now / 700) % 2 === 0 ? 0 : 26)
          p.dir = Math.floor(now / 700) % 2 === 0 ? -1 : 1
          if (now > p.modeUntil) setModeBoth('walk')
          break
        }

        case 'placed': {
          if (now > p.modeUntil) {
            setModeBoth('fall')
            p.vy = 0
          }
          break
        }

        case 'drag':
          break
      }

      // DOM 반영
      const el = crabRef.current
      if (el) {
        el.style.left = `${p.x}px`
        el.style.bottom = `${p.y}px`
      }
      setFacing(p.dir >= 0 ? 1 : -1)
      setMoving(p.mode === 'walk' || p.mode === 'goto' || p.mode === 'surf' || p.mode === 'car')
    }, 40)

    return () => {
      clearInterval(tick)
      timers.forEach(clearTimeout)
    }
    // 마운트에 한 번만. 날씨는 rainRef 로 읽어서 루프·타이머가 끊기지 않는다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── 클릭(괴롭히기/쓰다듬기) + 드래그
  const onPointerDown = (e: React.PointerEvent) => {
    dragInfo.current = { startX: e.clientX, startY: e.clientY, moved: false, pointerId: e.pointerId }
    try {
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    } catch {
      /* 합성 이벤트 등 캡처 불가 환경 */
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragInfo.current
    if (!d) return
    if (!d.moved && Math.hypot(e.clientX - d.startX, e.clientY - d.startY) < 6) return
    d.moved = true
    const p = phys.current
    if (p.mode !== 'drag') setModeBoth('drag')
    const shoreRect = shoreRef.current?.getBoundingClientRect()
    if (!shoreRect) return
    p.x = e.clientX - shoreRect.left - CRAB_W / 2
    p.y = Math.max(GROUND_Y, window.innerHeight - e.clientY - 20)
    const el = crabRef.current
    if (el) {
      el.style.left = `${p.x}px`
      el.style.bottom = `${p.y}px`
    }
  }

  const onPointerUp = () => {
    const d = dragInfo.current
    dragInfo.current = null
    if (!d) return
    const p = phys.current

    if (d.moved) {
      // 내려놓은 자리에 잠시 머문다
      setModeBoth('placed')
      p.modeUntil = Date.now() + 12_000
      say(LINES.drop)
      return
    }

    // 클릭 = 찌르기/쓰다듬기
    const now = Date.now()
    pokeTimes.current = [...pokeTimes.current.filter(t => now - t < 4000), now]
    const rapid = pokeTimes.current.length

    if (rapid >= 3) {
      bumpAffinity(-1)
      say(LINES.pokeAnnoyed, 2600)
      if (rapid >= 6 && phys.current.mode === 'walk') {
        // 너무 괴롭히면 잠깐 기절
        setDizzy(true)
        setModeBoth('stun')
        phys.current.modeUntil = now + 1500
      }
      return
    }

    if (Math.random() < 0.3) {
      bumpAffinity(+1)
      say(LINES.pet, 2800)
      return
    }

    const a = affinity.current
    if (a <= 25) say(LINES.pokeLow, 2800)
    else if (a >= 75) say(LINES.pokeHigh, 2800)
    else say(LINES.poke, 2800)
  }

  const showUmbrella = raining && mode !== 'heliUp' && mode !== 'heliDrop' && mode !== 'surf'
  const eyes = dizzy ? 'dizzy' : mode === 'suntan' || bump ? 'closed' : 'open'

  return (
    <div ref={shoreRef} aria-hidden className="pointer-events-none fixed right-0 bottom-0 left-0 z-[5] select-none lg:left-[228px]">
      {/* 하늘: 갈매기 두 마리 */}
      <div className="gull-drift absolute bottom-[120px]" style={{ animationDuration: '38s' }}>
        <Seagull />
      </div>
      <div className="gull-drift absolute bottom-[150px]" style={{ animationDuration: '55s', animationDelay: '-20s' }}>
        <Seagull />
      </div>

      {/* 수평선 위 태양 */}
      <div className="absolute right-[190px] bottom-[32px]">
        <Sun />
      </div>

      {/* 물고기 점프 */}
      {fishJump && (
        <div key={fishJump.key} className="fish-arc absolute bottom-[36px]" style={{ left: fishJump.left }}>
          <Fish />
        </div>
      )}

      {/* 바다 반짝임 */}
      <div className="absolute right-0 bottom-[42px] left-0 flex justify-around">
        {[0, 1, 2, 3, 4, 5].map(i => (
          <span key={i} className="sea-sparkle h-[3px] w-[3px] bg-white" style={{ animationDelay: `${i * 0.7}s` }} />
        ))}
      </div>

      {/* 파도 세 겹 + 거품 */}
      <div className="absolute inset-x-0 bottom-[36px] overflow-hidden">
        <div className="wave-far w-[calc(100%+96px)]">
          <WaveStrip id="wave-c" fill={SEA_BACK} opacity={0.8} />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-[30px] overflow-hidden">
        <div className="wave-back w-[calc(100%+96px)]">
          <WaveStrip id="wave-b" fill={SEA_MID} opacity={0.95} />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-[24px] overflow-hidden">
        <div className="wave-front w-[calc(100%+96px)]">
          <WaveStrip id="wave-a" fill={SEA_FRONT} />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-[24px] overflow-hidden">
        <div className="foam-move w-[calc(100%+48px)]">
          <FoamStrip />
        </div>
      </div>

      {/* 모래사장 */}
      <div
        className="h-[26px] w-full"
        style={{
          backgroundColor: SAND,
          backgroundImage: `radial-gradient(${SAND_DOT} 1.5px, transparent 1.5px)`,
          backgroundSize: '14px 9px',
        }}
      />

      {/* 모래 위 소품들 */}
      <div ref={palmRef} className="absolute right-8 bottom-[18px] hidden sm:block">
        <Palm />
      </div>
      <div className="absolute bottom-[6px] left-[16%]">
        <Starfish />
      </div>
      <div className="absolute bottom-[4px] left-[38%]">
        <Starfish tone="#c084fc" dark="#a855f7" />
      </div>
      <div className="absolute bottom-[8px] left-[27%]">
        <Shell />
      </div>
      <div className="absolute bottom-[10px] left-[55%] hidden md:block">
        <Sandcastle />
      </div>
      <div className="absolute bottom-[8px] left-[70%] hidden md:block">
        <Parasol />
      </div>
      <div className="absolute bottom-[6px] left-[75%] hidden md:block">
        <BeachBall />
      </div>

      {/* 17시 이후: 퇴근 차량 대기 */}
      {evening && (
        <div className="absolute bottom-[8px] left-[8px]">
          <Car />
        </div>
      )}

      {/* 떨어지는 코코넛 */}
      {coconutDrop && (
        <div className="coconut-fall absolute bottom-[64px]" style={{ left: coconutDrop.left }}>
          <Coconut />
        </div>
      )}

      {/* 비 */}
      {raining && <div className="pixel-rain pointer-events-none fixed inset-0" />}

      {/* ── 꽃게 본체 (여기만 클릭/드래그 가능) */}
      <div
        ref={crabRef}
        data-crab
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`pointer-events-auto absolute z-[8] touch-none ${mode === 'drag' ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ left: 60, bottom: GROUND_Y, width: CRAB_W }}
      >
        {/* 말풍선 */}
        {bubble && (
          <div
            key={bubble.key}
            className="animate-fade-up absolute bottom-[calc(100%+14px)] left-1/2 z-10 w-max max-w-[190px] -translate-x-1/2 rounded-md border-2 border-ink bg-white px-2 py-1 text-center text-[11px] leading-snug font-medium text-ink shadow-[2px_2px_0_rgba(61,53,39,0.35)]"
          >
            {bubble.text}
            <span className="absolute -bottom-[7px] left-1/2 -ml-[4px] block size-[8px] rotate-45 border-r-2 border-b-2 border-ink bg-white" />
          </div>
        )}

        {/* 친화력 변화 표시 */}
        {flash && (
          <div className="heart-pop absolute -top-[16px] right-0 text-[12px]">
            {flash === 'love' ? '❤️' : '💢'}
          </div>
        )}

        {/* 액세서리 */}
        {(mode === 'heliUp' || mode === 'heliDrop') && <Helicopter spinning={mode === 'heliUp'} />}
        {showUmbrella && <Umbrella />}
        {mode === 'suntan' && <Sunglasses />}
        {mode === 'drool' && <Drool />}
        {dizzy && (
          <div className="dizzy-star absolute -top-[12px] left-[6px] flex gap-6 text-[10px]">
            <span>✦</span>
            <span>✦</span>
          </div>
        )}

        <div className={moving ? 'crab-bob' : ''} style={{ transform: facing === -1 ? 'scaleX(-1)' : undefined }}>
          <CrabBody eyes={eyes} bump={bump} />
        </div>

        {mode === 'surf' && <Surfboard />}
      </div>
    </div>
  )
}
