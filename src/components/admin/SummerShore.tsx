'use client'

/*
 * 여름 도트 해변 + 꽃게 펫.
 * 꽃게는 40ms 물리 루프로 돌아다니며: 클릭하면 말대꾸(친화력 증감), 드래그로 옮길 수 있고,
 * 헬리콥터로 타임라인까지 올라갔다 추락하고, 서핑하고, 오늘 날짜 칸에서 썬탠하고,
 * 오늘 식단을 보며 침을 흘리고, 17시가 넘으면 차 옆에서 퇴근 준비를 하고, 비 오면 우산을 쓴다.
 * 장식은 클릭을 막지 않지만 꽃게 본체만 pointer-events 를 받는다.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const SAND = '#f2dfae'
const SAND_DOT = '#e3cb8f'
const SEA_FRONT = '#38b9da'
const SEA_MID = '#5fcbe4'
const SEA_BACK = '#8fe0ef'

const GROUND_Y = 2
const SURF_Y = 30
const CRAB_W = 56
const MAX_CASTLE = 60

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
  | 'dig'
  | 'nap'
  | 'dance'
  | 'admire'
  | 'cooloff'
  | 'blown'
  | 'crisp'
  | 'gone'
  | 'respawn'
  | 'snack'
  | 'build'
  | 'mourn'

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
  rain: ['비 온다...', '우산 챙겼지 {n}?', '꿉꿉해...', '빗소리 좋다~', '등딱지에 빗방울 통통', '이런 날엔 파전에... 아니 아무것도 아니야'],
  drop: ['여기가 어디야?!', '함부로 옮기지 마!', '우와 순간이동?!', '어지러워...', '오? 여기 뷰 좋은데?', '납치는 신고감이야 {n}', '내려줘서 고마워...?'],
  coconut: ['아야!!', '누가 코코넛 던졌어!!', '야자수 밑은 피했어야 했는데...', '별이 보여...', '혹 났잖아!!'],
  hot: ['나도 삶아지는 걸까..?', '어디선가 맛있는 냄새가 나...', '등딱지가 노릇노릇해지는 기분이야', '이러다 대게 아니라 찐게 된다', '바닷물이 미지근해...', '선크림이 버터처럼 녹아', '32도 넘으면 게는 위험하다구', '아지랑이가 보여...'],
  wind: ['바람이 너무 세!!', '집게로 모래를 꽉 잡는 중', '모래가 눈에 들어가!!', '오늘은 낮게 다녀야겠어', '파도가 사나운데?'],
  thunder: ['천둥이다!! 숨어야 해!!', '번개 무서워...', '찌릿찌릿한 예감이 들어...', '피뢰침 없나?!', '하늘이 화났나 봐'],
  zapped: ['짜릿하다...⚡', '머리가 파마머리 됐어...', '충전 100% 완료...?', '번개 맛은 좀 맵네...', '지지직... 재부팅 중...'],
  blownStart: ['으아아 바람이!!', '날아간다아아아~~!!', '집게로 못 버티겠어!!', '누가 좀 잡아줘~~!'],
  blownCrash: ['쿵!! 아야...', '어디까지 날아온 거야...', '바람 반대로 걸을걸...', '착지 실패...'],
  dig: ['여기 숨으면 아무도 몰라', '모래 속은 시원하다~', '잠수 아니고 잠사(모래)야', '나 찾아봐라~'],
  digOut: ['푸하!! 답답했다', '모래 목욕 완료!', '아무도 못 찾았지?'],
  nap: ['잠깐 낮잠... 쿨쿨', '5분만 잘게...', '파도 소리 들으니 졸려...', '자장자장...'],
  napWake: ['누구야!!', '깜짝이야!! 자고 있었잖아!', '5분만 더...', '꿈에서 새우깡 먹고 있었는데!!'],
  dance: ['게다리 춤 타임!!', '옆으로 옆으로~ 옆으로 옆으로~', '흥이 났다 흥이 났어', '{n} 너도 춰봐'],
  admire: ['이 성, 내가 만든 거임', '웅장하다...', '성주는 나야', '파도야 오지 마라...', '점점 커지고 있어', '이 정도면 궁전이지'],
  build: ['영차... 영차...', '한 층만 더 올리자', '집게로 다지고~', '모래성 장인이 나야', '조금만 더 높이!', '이번엔 탑을 세워볼까', '완벽한 성을 만들 거야', '무너지지 마라 제발...'],
  smashLow: ['앗! 내 성...', '이제 막 시작했는데', '뭐야~ 다시 쌓지 뭐', '한 층밖에 안 됐는데...'],
  smashMid: ['내 성이... 왜...', '{n} 너무해...', '몇 층이나 쌓았는데!!', '아니 왜 부수는 거야ㅠㅠ', '반나절 걸린 건데...'],
  smashHigh: ['안돼애애애ㅠㅠㅠ', '내 인생의 역작이...', '몇 시간을 쌓았는데...!!', '{n}... 우리 이제 끝이야', '다신 안 만들 거야 흑흑', '집게가 부들부들 떨려...', '이건 만행이야...'],
  cooloff: ['시원하다~~', '어푸어푸', '역시 게는 물이지', '더위 탈출 성공!'],
  morning: ['좋은 아침~ {n}', '모닝 바닷물 한 모금', '오늘도 화이팅이야', '아침 파도가 제일 맑아'],
  night: ['야근이야 {n}...? 나 졸려', '별이 예쁘다', '이제 그만 자자~', '밤바다는 낭만이지'],
  friday: ['불금이다!!!', '내일 쉬는 날이지?!', '금요일엔 게도 신난다', '주말 계획 있어 {n}?'],
  crisp: ['으아아아 또 맞았어!!', '이번엔 진짜다...', '몸이... 타들어가...', '지지직...!!'],
  respawn: ['쇼쇼속~ 부활!', '푸하!! 다시 태어났다', '땅 파고 올라왔지롱', '재에서 부활한 불사조 게', '나 죽지 않아~', '깜짝 놀랐지 {n}?'],
  menu: ['오늘 메뉴는 {m}(이)래~', '{m}... 맛있겠다', '오늘 {m} 먹는대. 부럽다', '{m} 냄새가 벌써 나는 것 같아', '{m}? 나도 한 입만...'],
  snackTime: ['아 출출하지 않아? 냉장고엔 뭐가 있더라', '{n} 슬슬 간식 타임 아니야?', '10시 반이면 출출할 때지...', '입이 심심한데... 냉장고 좀 봐줘', '커피랑 뭐 하나 먹을까?'],
  fridge: ['냉장고엔 부족한 거 없니 {n}?', '우유 떨어지지 않았어?', '장 볼 거 있으면 메모해둬', '냉장고 정리도 가끔 해줘야 해', '유통기한 지난 거 없나 확인했어?'],
  leo: ['레오는 잘 지내?', '레오한테 안부 전해줘~', '레오랑 산책은 다녀왔어?', '레오 밥은 챙겨줬어?', '오늘 레오 컨디션 어때?', '레오 보고 싶다'],
  snackHappy: ['냠냠! 최고야~', '이거 내가 제일 좋아하는 거야!', '{n} 센스 있네~', '와구와구', '더 없어...?', '역시 {n}뿐이야', '행복하다 게 인생...'],
  snackFull: ['배불러... 그만~', '더는 못 먹어...', '집게에 쥐가 날 것 같아', '소화 좀 시키고...'],
  learn: ['오~ 새로운 단어다!', '{w}... 외웠어!', '{w}, 이거 시험에 나와?', '똑똑해지는 기분이야', '{w}... 어렵네', '집게로 받아 적었어'],
  recall: ['어제 배운 단어 {w}!', '{w}... 이거 맞지?', '{n}가 알려준 {w} 아직 기억해', '오늘의 단어는 {w}!', '{w}... 발음이 어려워', '나 {w} 알아! 똑똑하지?'],
}

/** 클릭 메뉴에서 줄 수 있는 간식 (이모지) */
const SNACKS = ['🍪', '🍤', '🍡', '🥨', '🦐', '🍘']

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

function CrabBody({ eyes, bump }: { eyes: 'open' | 'closed' | 'dizzy' | 'dead'; bump: boolean }) {
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
      {eyes === 'dead' && (
        <>
          {/* x_x */}
          <rect x="12" y="0" width="2" height="2" fill="#222" />
          <rect x="14" y="2" width="2" height="2" fill="#222" />
          <rect x="14" y="0" width="2" height="2" fill="#222" />
          <rect x="12" y="2" width="2" height="2" fill="#222" />
          <rect x="40" y="0" width="2" height="2" fill="#222" />
          <rect x="42" y="2" width="2" height="2" fill="#222" />
          <rect x="42" y="0" width="2" height="2" fill="#222" />
          <rect x="40" y="2" width="2" height="2" fill="#222" />
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

/** 게가 집게로 사선으로 비껴 든 우산. 손잡이가 오른쪽 집게로 내려온다. */
function Umbrella() {
  return (
    <svg
      viewBox="0 0 48 44"
      className="pixelated absolute -top-[30px] left-[6px] h-[44px] w-[48px]"
      style={{ transform: 'rotate(-16deg)' }}
      aria-hidden
    >
      {/* 캐노피 (돔) */}
      <rect x="20" y="0" width="10" height="3" fill="#2563eb" />
      <rect x="14" y="3" width="22" height="3" fill="#60a5fa" />
      <rect x="8" y="6" width="34" height="4" fill="#3b82f6" />
      <rect x="4" y="10" width="42" height="3" fill="#2563eb" />
      {/* 캐노피 골 무늬 */}
      <rect x="14" y="6" width="2" height="4" fill="#93c5fd" />
      <rect x="24" y="3" width="2" height="7" fill="#93c5fd" />
      <rect x="34" y="6" width="2" height="4" fill="#93c5fd" />
      {/* 물결 가장자리 */}
      <rect x="4" y="13" width="6" height="2" fill="#2563eb" />
      <rect x="16" y="13" width="6" height="2" fill="#2563eb" />
      <rect x="28" y="13" width="6" height="2" fill="#2563eb" />
      <rect x="40" y="13" width="6" height="2" fill="#2563eb" />
      {/* 꼭지 */}
      <rect x="24" y="-3" width="2" height="3" fill="#8f5f33" />
      {/* 손잡이대: 중앙에서 오른쪽 아래로 사선, 끝은 J 손잡이 */}
      <rect x="25" y="13" width="3" height="7" fill="#a8713e" />
      <rect x="28" y="20" width="3" height="7" fill="#a8713e" />
      <rect x="31" y="27" width="3" height="7" fill="#a8713e" />
      <rect x="34" y="34" width="3" height="6" fill="#8f5f33" />
      <rect x="31" y="39" width="6" height="3" fill="#8f5f33" />
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

/**
 * 게가 쌓는 모래성. level(1~60)이 올라갈수록 층이 계속 위로 쌓여 무한정 높아진다.
 * 층마다 조금씩 좁아지는 계단식 탑. 클릭하면 부술 수 있다(onSmash).
 */
function Sandcastle({ level, smashing, onSmash }: { level: number; smashing: boolean; onSmash: () => void }) {
  if (level <= 0 && !smashing) return null
  const L = Math.max(1, level)
  const TIER_H = 4 // 층 높이(픽셀)
  const BASE_H = 12 // 바닥 성벽
  const baseW = 34 + Math.min(L, 12) * 3 // 초반엔 넓어지고 이후 폭 고정(가로 화면 보호), 높이만 계속
  const topW = 10
  const H = BASE_H + L * TIER_H + 12 // 맨 위 깃발 공간 포함
  const cx = baseW / 2

  const rects: React.ReactNode[] = []
  // 바닥 성벽 + 좌우 망루
  rects.push(<rect key="base" x={0} y={H - BASE_H} width={baseW} height={BASE_H} fill="#e6cf9a" />)
  rects.push(<rect key="base-hl" x={0} y={H - BASE_H} width={baseW} height={2} fill="#f2dfae" />)
  rects.push(<rect key="lt" x={0} y={H - BASE_H - 4} width={5} height={4} fill="#e6cf9a" />)
  rects.push(<rect key="rt" x={baseW - 5} y={H - BASE_H - 4} width={5} height={4} fill="#e6cf9a" />)
  rects.push(<rect key="door" x={cx - 2} y={H - 8} width={4} height={6} fill="#b8985f" />)

  // 층을 위로 계속 쌓는다 (위로 갈수록 완만히 좁아지는 사다리꼴)
  for (let i = 0; i < L; i++) {
    const t = i / L
    const w = Math.max(topW, baseW - (baseW - topW) * t)
    const y = H - BASE_H - (i + 1) * TIER_H
    rects.push(<rect key={`t${i}`} x={cx - w / 2} y={y} width={w} height={TIER_H} fill={i % 2 ? '#edd8a8' : '#e0c88c'} />)
    // 몇 층마다 톱니 흉벽으로 디테일
    if (i % 6 === 5 && w > 14) {
      rects.push(<rect key={`c${i}l`} x={cx - w / 2} y={y - 2} width={2} height={2} fill="#edd8a8" />)
      rects.push(<rect key={`c${i}r`} x={cx + w / 2 - 2} y={y - 2} width={2} height={2} fill="#edd8a8" />)
    }
  }

  // 꼭대기 깃발 (레벨이 높을수록 금빛)
  const topY = H - BASE_H - L * TIER_H
  rects.push(<rect key="pole" x={cx - 1} y={topY - 10} width={2} height={12} fill="#8f5f33" />)
  rects.push(<rect key="flag" x={cx + 1} y={topY - 10} width={6} height={4} fill={L >= 40 ? '#a855f7' : L >= 20 ? '#f59e0b' : '#ef4444'} />)

  return (
    <svg
      viewBox={`0 0 ${baseW} ${H}`}
      style={{ width: baseW, height: H }}
      className={`pixelated pointer-events-auto cursor-pointer ${smashing ? 'castle-smash' : ''}`}
      onClick={onSmash}
      role="button"
      aria-label="모래성 부수기"
    >
      {rects}
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

/** 차박용 카키 SUV. 지붕에 루프탑 텐트, 뒤에 짐. */
function Car() {
  return (
    <svg viewBox="0 0 80 42" className="pixelated h-[42px] w-[80px]" aria-hidden>
      {/* 루프탑 텐트 (지붕 위) */}
      <rect x="20" y="0" width="36" height="3" fill="#d97706" />
      <rect x="16" y="3" width="44" height="7" fill="#f59e0b" />
      <rect x="16" y="6" width="44" height="2" fill="#b45309" />
      <rect x="22" y="4" width="4" height="3" fill="#fde68a" />
      <rect x="30" y="4" width="4" height="3" fill="#fde68a" />
      {/* 텐트 사다리 */}
      <rect x="58" y="10" width="3" height="12" fill="#78716c" />
      <rect x="58" y="13" width="4" height="1.5" fill="#78716c" />
      <rect x="58" y="17" width="4" height="1.5" fill="#78716c" />
      {/* 루프랙 */}
      <rect x="14" y="10" width="50" height="2" fill="#3f3f46" />
      {/* 상단 캐빈 (각진 SUV 라인) */}
      <rect x="16" y="12" width="46" height="10" fill="#4d7c4d" />
      <rect x="19" y="14" width="12" height="7" fill="#bae6fd" />
      <rect x="34" y="14" width="12" height="7" fill="#bae6fd" />
      <rect x="48" y="14" width="11" height="7" fill="#bae6fd" />
      <rect x="31" y="14" width="3" height="7" fill="#3f5f3f" />
      <rect x="46" y="14" width="2" height="7" fill="#3f5f3f" />
      {/* 차체 (박스형) */}
      <rect x="6" y="22" width="68" height="12" fill="#5b8c5a" />
      <rect x="6" y="22" width="68" height="2" fill="#6ba06a" />
      <rect x="6" y="30" width="68" height="4" fill="#3f5f3f" />
      {/* 사이드 스텝 & 머드가드 */}
      <rect x="6" y="27" width="68" height="2" fill="#3f3f46" />
      {/* 헤드/테일 라이트 */}
      <rect x="70" y="25" width="4" height="3" fill="#fde047" />
      <rect x="6" y="25" width="3" height="3" fill="#ef4444" />
      {/* 스페어 타이어 (뒤) */}
      <rect x="2" y="24" width="5" height="8" fill="#1f2937" />
      {/* 큰 오프로드 바퀴 */}
      <rect x="14" y="32" width="14" height="10" fill="#1f2937" />
      <rect x="52" y="32" width="14" height="10" fill="#1f2937" />
      <rect x="18" y="35" width="6" height="6" fill="#9ca3af" />
      <rect x="56" y="35" width="6" height="6" fill="#9ca3af" />
      <rect x="20" y="37" width="2" height="2" fill="#4b5563" />
      <rect x="58" y="37" width="2" height="2" fill="#4b5563" />
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

/** 줄무늬 썬베드. 썬탠할 때 꽃게가 이 위에 눕는다. */
function SunLounger() {
  return (
    <svg viewBox="0 0 72 30" className="pixelated absolute -bottom-[10px] -left-[10px] h-[30px] w-[72px]" aria-hidden>
      {/* 등받이 (왼쪽으로 기울어짐) */}
      <rect x="2" y="0" width="6" height="6" fill="#38bdf8" />
      <rect x="6" y="4" width="6" height="6" fill="#e0f2fe" />
      <rect x="10" y="8" width="8" height="6" fill="#38bdf8" />
      {/* 시트 */}
      <rect x="16" y="12" width="14" height="6" fill="#e0f2fe" />
      <rect x="30" y="12" width="14" height="6" fill="#38bdf8" />
      <rect x="44" y="12" width="14" height="6" fill="#e0f2fe" />
      <rect x="58" y="12" width="10" height="6" fill="#38bdf8" />
      {/* 프레임·다리 */}
      <rect x="14" y="18" width="56" height="3" fill="#b8834e" />
      <rect x="18" y="21" width="4" height="9" fill="#8f5f33" />
      <rect x="60" y="21" width="4" height="9" fill="#8f5f33" />
    </svg>
  )
}

/** 하늘에서 떨어지는 픽셀 번개 */
function LightningBolt() {
  return (
    <svg viewBox="0 0 28 130" className="pixelated h-[260px] w-[56px]" aria-hidden>
      <g fill="#fde047">
        <rect x="12" y="0" width="8" height="22" />
        <rect x="8" y="22" width="8" height="22" />
        <rect x="12" y="44" width="8" height="22" />
        <rect x="7" y="66" width="8" height="22" />
        <rect x="11" y="88" width="8" height="22" />
        <rect x="8" y="110" width="8" height="20" />
      </g>
      <g fill="#fffbeb">
        <rect x="14" y="4" width="3" height="16" />
        <rect x="10" y="26" width="3" height="16" />
        <rect x="14" y="48" width="3" height="16" />
        <rect x="9" y="70" width="3" height="16" />
        <rect x="13" y="92" width="3" height="16" />
      </g>
    </svg>
  )
}

function ZzzFloat() {
  return (
    <div className="absolute -top-[20px] left-[40px] text-[11px] font-bold text-ink-soft" aria-hidden>
      <span className="zzz-float inline-block">z</span>
      <span className="zzz-float inline-block text-[13px]" style={{ animationDelay: '0.5s' }}>Z</span>
      <span className="zzz-float inline-block text-[15px]" style={{ animationDelay: '1s' }}>Z</span>
    </div>
  )
}

/** 32도 넘는 날 꽃게 위로 피어오르는 김 */
function HeatSteam() {
  return (
    <div className="absolute -top-[18px] left-[14px] flex gap-4" aria-hidden>
      <span className="heat-steam text-[11px] text-orange-400/80">〜</span>
      <span className="heat-steam text-[11px] text-orange-400/80" style={{ animationDelay: '0.8s' }}>〜</span>
    </div>
  )
}

/** 강풍: 화면을 가로질러 날아가는 모래 먼지 */
function WindDust() {
  return (
    <>
      {[18, 42, 66, 96, 130].map((b, i) => (
        <span
          key={b}
          className="wind-dust absolute h-[3px] w-[7px] rounded-full bg-[#d9c49a]"
          style={{ bottom: b, animationDelay: `${i * 0.35}s`, animationDuration: `${1.4 + i * 0.25}s` }}
          aria-hidden
        />
      ))}
    </>
  )
}

/** 비: 비스듬히 떨어지는 빗방울 파티클 + 하늘 틴트 + 모래에 튀는 물방울 */
function RainFX({ heavy }: { heavy: boolean }) {
  // 위치·타이밍은 인덱스에서 결정적으로 뽑는다 (렌더마다 흔들리지 않게)
  const drops = Array.from({ length: heavy ? 46 : 30 }, (_, i) => i)
  return (
    <div className="pointer-events-none fixed inset-0 z-[4] overflow-hidden" aria-hidden>
      {drops.map(i => (
        <span
          key={i}
          className="rain-drop"
          style={{
            left: `${(i * 37 + 11) % 104 - 2}%`,
            animationDelay: `${((i * 7) % 12) * 0.11}s`,
            animationDuration: `${(heavy ? 0.55 : 0.8) + (i % 5) * 0.12}s`,
            opacity: i % 3 === 0 ? 0.35 : 0.6,
            height: i % 4 === 0 ? 18 : 13,
          }}
        />
      ))}
      <div className={`absolute inset-0 ${heavy ? 'bg-slate-600/[0.13]' : 'bg-slate-500/[0.06]'}`} />
      <div className="absolute inset-x-0 bottom-[30px] flex justify-around">
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
          <span key={i} className="rain-splash" style={{ animationDelay: `${i * 0.17}s` }} />
        ))}
      </div>
    </div>
  )
}

/** 번개에 타서 바사삭 흩어지는 재 가루 */
function AshPoof() {
  const bits = [
    { x: -14, y: 0, d: 0 },
    { x: 14, y: 2, d: 0.05 },
    { x: -8, y: -8, d: 0.1 },
    { x: 8, y: -6, d: 0.02 },
    { x: 0, y: -12, d: 0.12 },
    { x: -18, y: -4, d: 0.08 },
    { x: 18, y: -2, d: 0.06 },
    { x: -4, y: 6, d: 0.14 },
    { x: 6, y: 4, d: 0.03 },
  ]
  return (
    <div className="pointer-events-none absolute bottom-[4px] left-[10px]" aria-hidden>
      {bits.map((b, i) => (
        <span
          key={i}
          className="ash-bit absolute block"
          style={{
            // CSS 변수로 흩어질 방향 전달
            ['--ax' as string]: `${b.x}px`,
            ['--ay' as string]: `${b.y - 14}px`,
            width: i % 2 ? 4 : 3,
            height: i % 2 ? 4 : 3,
            background: i % 3 === 0 ? '#4b5563' : '#1f2937',
            animationDelay: `${b.d}s`,
          }}
        />
      ))}
    </div>
  )
}

/** 리스폰: 땅에서 솟을 때 튀는 모래 흙 */
function DirtBurst() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-[8px] flex gap-1.5" aria-hidden>
      {[0, 1, 2, 3, 4].map(i => (
        <span
          key={i}
          className="dirt-bit block h-[4px] w-[4px] bg-[#d9c49a]"
          style={{ ['--dx' as string]: `${(i - 2) * 9}px`, animationDelay: `${i * 0.04}s` }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────── 본체

export default function SummerShore({ admin }: { admin: string }) {
  const shoreRef = useRef<HTMLDivElement>(null)
  const crabRef = useRef<HTMLDivElement>(null)
  const palmRef = useRef<HTMLDivElement>(null)
  const sandcastleAnchorRef = useRef<HTMLDivElement>(null)

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
    // 감전이 유효한 시각(그 전에 또 맞으면 바사삭). respawn 시 새 x.
    zappedUntil: 0,
    respawnX: 60,
  })

  // 화면에 반영해야 하는 것만 state
  const [mode, setMode] = useState<Mode>('walk')
  const [bubble, setBubble] = useState<{ text: string; key: number } | null>(null)
  const [bump, setBump] = useState(false)
  const [dizzy, setDizzy] = useState(false)
  const [moving, setMoving] = useState(true)
  const [facing, setFacing] = useState<1 | -1>(1)
  const [wx, setWx] = useState({ raining: false, thunder: false, windy: false, hot: false })
  const [evening, setEvening] = useState(false)
  const [coconutDrop, setCoconutDrop] = useState<{ left: number } | null>(null)
  const [flash, setFlash] = useState<'love' | 'anger' | null>(null)
  const [fishJump, setFishJump] = useState<{ left: number; key: number } | null>(null)
  const [zapped, setZapped] = useState(false)
  const [bolt, setBolt] = useState<{ x: number; key: number } | null>(null)
  /** 바사삭: 재로 흩어짐(ash) / 리스폰 시 흙 튀김(dirt) */
  const [ash, setAsh] = useState<{ x: number; key: number } | null>(null)
  const [dirt, setDirt] = useState<{ x: number; key: number } | null>(null)
  /** 클릭 액션 메뉴 위치(뷰포트 기준) / 단어 가르치기 입력창 / 먹는 간식 스프라이트 */
  const [menuAt, setMenuAt] = useState<{ x: number; y: number } | null>(null)
  const [wordOpen, setWordOpen] = useState(false)
  const [wordDraft, setWordDraft] = useState('')
  const [treat, setTreat] = useState<{ kind: number; key: number } | null>(null)
  const snackTimes = useRef<number[]>([])
  /** 게가 쌓는 모래성 레벨(0~12, localStorage 유지) + 부서지는 중 플래그 */
  const [castleLevel, setCastleLevel] = useState(0)
  const [castleSmashing, setCastleSmashing] = useState(false)
  const castleRef = useRef(0)
  castleRef.current = castleLevel
  const castleSmashRef = useRef(false)
  castleSmashRef.current = castleSmashing

  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pokeTimes = useRef<number[]>([])
  const affinity = useRef(50)
  const dragInfo = useRef<{ startX: number; startY: number; moved: boolean; pointerId: number } | null>(null)
  /** 물리 루프가 재생성 없이 최신 날씨를 읽도록 ref 로도 든다 (재생성되면 진행 중인 타이머가 끊긴다) */
  const wxRef = useRef(wx)
  useEffect(() => {
    wxRef.current = wx
  }, [wx])

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

  // ── 모래성 레벨 (localStorage 유지)
  useEffect(() => {
    const saved = Number(localStorage.getItem('jl.crab.castle'))
    if (Number.isFinite(saved) && saved > 0) setCastleLevel(Math.min(MAX_CASTLE, saved))
  }, [])

  // ── 모래성 부수기 (내가 클릭)
  const smashCastle = useCallback(() => {
    const lv = castleRef.current
    if (lv <= 0 || castleSmashing) return
    setCastleSmashing(true)
    setTimeout(() => {
      setCastleLevel(0)
      try {
        localStorage.setItem('jl.crab.castle', '0')
      } catch {
        /* 저장 실패해도 계속 (setCastleSmashing(false) 는 반드시 실행) */
      }
      setCastleSmashing(false)
    }, 650)
    // 게가 부서진 성 쪽을 보며 상실감 (쌓은 만큼 슬픔이 크다, 1~60 스케일)
    const high = lv >= 20
    const mid = lv >= 6
    const p = phys.current
    p.lastActivity = Date.now()
    if (['walk', 'goto', 'admire', 'dance', 'snack', 'build'].includes(p.mode)) {
      p.mode = 'mourn'
      setMode('mourn')
      p.modeUntil = Date.now() + (high ? 8000 : mid ? 5000 : 3500)
    }
    say(high ? LINES.smashHigh : mid ? LINES.smashMid : LINES.smashLow, high ? 5500 : 3200)
    bumpAffinity(high ? -5 : mid ? -2 : -1)
  }, [castleSmashing, say, bumpAffinity])

  // ── 오늘 달력 칸에 있는 식단 메뉴 이름 하나 읽기 (스케줄 페이지에서만)
  const readTodayMenu = useCallback((): string | null => {
    const d = new Date()
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const chips = document.querySelectorAll<HTMLElement>(`[data-meal="${iso}"][data-meal-title]`)
    if (!chips.length) return null
    return chips[Math.floor(Math.random() * chips.length)].getAttribute('data-meal-title')
  }, [])

  // ── 배운 단어들 (localStorage)
  const learnWord = useCallback(
    (word: string) => {
      const clean = word.trim().slice(0, 24)
      if (!clean) return
      const key = `jl.crab.words.${admin}`
      let list: string[] = []
      try {
        const parsed = JSON.parse(localStorage.getItem(key) || '[]')
        if (Array.isArray(parsed)) list = parsed.filter(w => typeof w === 'string')
      } catch {
        list = []
      }
      list = [clean, ...list.filter(w => w !== clean)].slice(0, 40)
      localStorage.setItem(key, JSON.stringify(list))
    },
    [admin],
  )
  const recallWord = useCallback((): string | null => {
    try {
      const parsed = JSON.parse(localStorage.getItem(`jl.crab.words.${admin}`) || '[]')
      const list = Array.isArray(parsed) ? parsed.filter(w => typeof w === 'string') : []
      return list.length ? list[Math.floor(Math.random() * list.length)] : null
    } catch {
      return null
    }
  }, [admin])

  // ── 상황 대사 (오늘 메뉴 / 냉장고 / 레오 / 배운 단어 복습)
  const sayContextual = useCallback(
    (kind: 'menu' | 'fridge' | 'leo' | 'recall') => {
      if (kind === 'menu') {
        const m = readTodayMenu()
        if (!m) {
          say(LINES.idle)
          return
        }
        say(LINES.menu.map(s => s.replaceAll('{m}', m)))
        return
      }
      if (kind === 'recall') {
        const w = recallWord()
        if (!w) {
          say(LINES.idle)
          return
        }
        say(LINES.recall.map(s => s.replaceAll('{w}', w)))
        return
      }
      say(kind === 'fridge' ? LINES.fridge : LINES.leo)
    },
    [say, readTodayMenu, recallWord],
  )

  // ── 날씨 (서울, open-meteo). 비/뇌우/강풍/폭염을 모두 본다. 실패하면 맑음으로 둔다.
  useEffect(() => {
    let alive = true
    const check = async () => {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=37.57&longitude=126.98&current=temperature_2m,precipitation,weather_code,wind_speed_10m',
        )
        const json = (await res.json()) as {
          current?: { temperature_2m?: number; precipitation?: number; weather_code?: number; wind_speed_10m?: number }
        }
        const c = json.current
        if (!alive || !c) return
        const code = c.weather_code ?? 0
        const thunder = [95, 96, 99].includes(code)
        const wet = thunder || (c.precipitation ?? 0) > 0 || [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)
        setWx({
          raining: wet,
          thunder,
          windy: (c.wind_speed_10m ?? 0) >= 25, // km/h
          hot: (c.temperature_2m ?? 0) >= 32,
        })
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

  // ── 뇌우: 번개가 내려친다. 45% 확률로 꽃게를 조준하고, 걷는 중이면 감전된다.
  useEffect(() => {
    if (!wx.thunder) return
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>
    const strike = () => {
      if (cancelled) return
      const W = shoreRef.current?.getBoundingClientRect().width ?? 800
      const aimCrab = Math.random() < 0.45
      const p = phys.current
      const x = aimCrab ? p.x + CRAB_W / 2 - 28 : 30 + Math.random() * Math.max(60, W - 90)
      setBolt({ x, key: Date.now() })
      setTimeout(() => setBolt(null), 380)

      const hittable = !['crisp', 'gone', 'respawn', 'drag', 'surf', 'heliUp', 'heliDrop'].includes(p.mode)
      if (aimCrab && hittable) {
        setTimeout(() => {
          const q = phys.current
          if (Date.now() < q.zappedUntil) {
            // 이미 감전 상태인데 또 맞았다 → 까맣게 타서 바사삭!
            q.mode = 'crisp'
            setMode('crisp')
            q.modeUntil = Date.now() + 800
            setZapped(false)
            setDizzy(false)
            say(LINES.crisp, 1200)
          } else {
            // 첫 감전. 이후 14초 동안은 "취약" 상태 — 그 안에 또 조준되면 바사삭.
            setZapped(true)
            setDizzy(true)
            q.mode = 'stun'
            setMode('stun')
            q.modeUntil = Date.now() + 2600
            q.zappedUntil = Date.now() + 14_000
            say(LINES.zapped)
            setTimeout(() => setZapped(false), 2600)
          }
        }, 200)
      }
      // 뇌우 중엔 번개가 촘촘히 친다 (다음 조준 낙뢰가 취약창 안에 들도록)
      timer = setTimeout(strike, 5000 + Math.random() * 6000)
    }
    timer = setTimeout(strike, 2500)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wx.thunder])

  // ── 17시 체크 (1분마다)
  useEffect(() => {
    const check = () => setEvening(new Date().getHours() >= 17)
    check()
    const id = setInterval(check, 60_000)
    return () => clearInterval(id)
  }, [])

  // ── 오전 10시 반쯤: "출출하지 않아?" (하루 한 번)
  useEffect(() => {
    const check = () => {
      const d = new Date()
      const stamp = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      if (d.getHours() === 10 && d.getMinutes() >= 25 && d.getMinutes() <= 45) {
        if (localStorage.getItem('jl.crab.snacktime') !== stamp) {
          localStorage.setItem('jl.crab.snacktime', stamp)
          say(LINES.snackTime)
        }
      }
    }
    check()
    const id = setInterval(check, 60_000)
    return () => clearInterval(id)
  }, [say])

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
      if (now - p.lastActivity < 8_000) return
      const hour = new Date().getHours()

      // 날씨·시간대에 맞는 혼잣말 풀
      const idlePool = () => {
        const w = wxRef.current
        const pool = [...LINES.idle]
        if (w.hot) pool.push(...LINES.hot, ...LINES.hot) // 폭염 대사는 가중치 2배
        if (w.thunder) pool.push(...LINES.thunder)
        else if (w.raining) pool.push(...LINES.rain)
        if (w.windy) pool.push(...LINES.wind)
        if (hour >= 6 && hour < 11) pool.push(...LINES.morning)
        if (hour >= 22 || hour < 2) pool.push(...LINES.night)
        if (new Date().getDay() === 5) pool.push(...LINES.friday)
        return pool
      }

      type Act = { w: number; run: () => void }
      // 혼잣말을 좀 더 자주 (가중치 6)
      const acts: Act[] = [{ w: 6, run: () => say(idlePool()) }]

      // 제자리 소동작들
      acts.push({
        w: 1.2,
        run: () => {
          setModeBoth('dig')
          p.modeUntil = now + 8000
          say(LINES.dig)
        },
      })
      acts.push({
        w: 1.2,
        run: () => {
          setModeBoth('nap')
          p.modeUntil = now + 9000
          say(LINES.nap)
        },
      })
      acts.push({
        w: 1,
        run: () => {
          setModeBoth('dance')
          p.modeUntil = now + 6000
          say(LINES.dance)
        },
      })

      // 모래성 짓기(계속 쌓기) / 다 지었으면 감상. 모래성 앵커로 이동.
      const castle = sandcastleAnchorRef.current
      if (castle && castle.offsetParent !== null) {
        const full = castleRef.current >= MAX_CASTLE
        acts.push({
          w: full ? 1.2 : 4, // 아직 안 찼으면 자주 쌓으러 간다
          run: () => {
            const r = castle.getBoundingClientRect()
            p.target = { x: r.left - shoreLeft() - CRAB_W + 14, y: GROUND_Y }
            p.afterGoto = full ? 'admire' : 'build'
            setModeBoth('goto')
          },
        })
      }

      // 더운 날엔 바다에 몸 담그기
      acts.push({
        w: wxRef.current.hot ? 3 : 0.4,
        run: () => {
          setModeBoth('cooloff')
          p.y = SURF_Y - 12
          p.modeUntil = now + 7000
          say(LINES.cooloff)
        },
      })

      // 상황 대사: 오늘 메뉴 / 냉장고 / 레오 안부
      acts.push({ w: 1.4, run: () => sayContextual('menu') })
      acts.push({ w: 1, run: () => sayContextual('fridge') })
      acts.push({ w: 1, run: () => sayContextual('leo') })
      // 배운 단어 복습
      acts.push({ w: 1.2, run: () => sayContextual('recall') })

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

    // 콘솔 장난감 겸 검증용: window.__crab.do('surf') 처럼 바로 시켜볼 수 있다.
    const forceActivity = (
      kind:
        | 'surf' | 'heli' | 'suntan' | 'drool' | 'car' | 'coconut' | 'dig' | 'nap'
        | 'dance' | 'admire' | 'cooloff' | 'blown' | 'zap' | 'crisp' | 'menu' | 'fridge' | 'leo' | 'build',
    ) => {
      const p = phys.current
      p.lastActivity = 0
      setDizzy(false)
      if (kind === 'menu' || kind === 'fridge' || kind === 'leo') {
        sayContextual(kind)
        return 'ok'
      }
      if (kind === 'build') {
        setModeBoth('build')
        p.modeUntil = Date.now() + 1500
        say(LINES.build)
        return 'ok'
      }
      if (kind === 'crisp') {
        p.mode = 'crisp'
        setMode('crisp')
        p.modeUntil = Date.now() + 800
        setZapped(false)
        setDizzy(false)
        say(LINES.crisp, 1200)
        return 'ok'
      }
      if (kind === 'dig' || kind === 'nap' || kind === 'dance' || kind === 'admire' || kind === 'cooloff') {
        setModeBoth(kind)
        if (kind === 'cooloff') p.y = SURF_Y - 12
        p.modeUntil = Date.now() + (kind === 'dance' ? 6000 : 8000)
        say(LINES[kind])
        return 'ok'
      }
      if (kind === 'blown') {
        setModeBoth('blown')
        p.vy = 0
        say(LINES.blownStart)
        return 'ok'
      }
      if (kind === 'zap') {
        setBolt({ x: p.x + CRAB_W / 2 - 28, key: Date.now() })
        setTimeout(() => setBolt(null), 380)
        setTimeout(() => {
          // 이미 취약 상태면 바사삭, 아니면 첫 감전
          if (Date.now() < p.zappedUntil) {
            p.mode = 'crisp'
            setMode('crisp')
            p.modeUntil = Date.now() + 800
            setZapped(false)
            setDizzy(false)
            say(LINES.crisp, 1200)
          } else {
            setZapped(true)
            setDizzy(true)
            setModeBoth('stun')
            p.modeUntil = Date.now() + 2600
            p.zappedUntil = Date.now() + 14_000
            say(LINES.zapped)
            setTimeout(() => setZapped(false), 2600)
          }
        }, 200)
        return 'ok'
      }
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
    // 콘솔 API. 언마운트/재마운트 시 stale 인스턴스가 남지 않도록 소유권을 확인하고 정리한다.
    const crabApi = {
      do: forceActivity,
      rain: (v: boolean) => setWx(w => ({ ...w, raining: v })),
      weather: (patch: Partial<{ raining: boolean; thunder: boolean; windy: boolean; hot: boolean }>) =>
        setWx(w => ({ ...w, ...patch })),
      affinity: () => affinity.current,
      state: () => ({ ...phys.current }),
    }
    ;(window as unknown as { __crab?: typeof crabApi }).__crab = crabApi

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

          // 강풍: 가끔 바람에 날려간다
          if (wxRef.current.windy && Math.random() < 1 / 260) {
            setModeBoth('blown')
            p.vy = 0
            say(LINES.blownStart)
            break
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
            } else if (p.afterGoto === 'admire') {
              setModeBoth('admire')
              p.dir = 1
              p.modeUntil = now + 6000
              say(LINES.admire)
            } else if (p.afterGoto === 'build') {
              setModeBoth('build')
              p.dir = 1
              p.modeUntil = now + 4500
              say(LINES.build)
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

        case 'dig': {
          // 모래 속에 반쯤 파묻힌다 (렌더에서 아랫부분 클리핑)
          p.y = GROUND_Y
          if (now > p.modeUntil) {
            setModeBoth('walk')
            say(LINES.digOut)
          }
          break
        }

        case 'nap': {
          p.y = GROUND_Y
          if (now > p.modeUntil) setModeBoth('walk')
          break
        }

        case 'dance': {
          // 게다리 춤: 좌우로 총총 + 폴짝폴짝
          p.x += Math.floor(now / 200) % 2 === 0 ? 2 : -2
          p.dir = Math.floor(now / 400) % 2 === 0 ? 1 : -1
          p.y = GROUND_Y + (Math.floor(now / 160) % 2 === 0 ? 0 : 4)
          if (now > p.modeUntil) {
            p.y = GROUND_Y
            setModeBoth('walk')
          }
          break
        }

        case 'admire': {
          p.y = GROUND_Y
          if (now > p.modeUntil) setModeBoth('walk')
          break
        }

        case 'build': {
          // 집게로 모래를 다지듯 위아래로 통통
          p.y = GROUND_Y + (Math.floor(now / 200) % 2 === 0 ? 0 : 3)
          if (now > p.modeUntil) {
            p.y = GROUND_Y
            // 한 층 더! (부수는 중이 아닐 때만)
            if (!castleSmashRef.current) {
              const next = Math.min(MAX_CASTLE, castleRef.current + 1)
              castleRef.current = next
              setCastleLevel(next)
              try {
                localStorage.setItem('jl.crab.castle', String(next))
              } catch {
                /* 저장 실패는 무시 */
              }
            }
            setModeBoth('walk')
          }
          break
        }

        case 'mourn': {
          // 부서진 성 앞에서 축 처져 흐느낀다
          p.y = GROUND_Y
          if (now > p.modeUntil) setModeBoth('walk')
          break
        }

        case 'cooloff': {
          // 파도에 몸을 반쯤 담그고 둥실둥실
          p.y = SURF_Y - 12 + (Math.floor(now / 300) % 2 === 0 ? 0 : 2)
          if (now > p.modeUntil) {
            p.vy = 0
            setModeBoth('fall')
          }
          break
        }

        case 'blown': {
          // 바람에 쓸려간다. 우산을 들고 있으면 메리포핀스처럼 떠오른다.
          p.dir = 1
          p.x += 7
          if (wxRef.current.raining) p.y = Math.min(150, p.y + 2.4)
          else p.y = GROUND_Y + (Math.floor(now / 120) % 2 === 0 ? 0 : 5)
          if (p.x >= W - CRAB_W) {
            p.x = W - CRAB_W
            if (p.y > GROUND_Y + 8) {
              p.vy = 0
              setModeBoth('fall')
            } else {
              p.y = GROUND_Y
              setDizzy(true)
              setModeBoth('stun')
              p.modeUntil = now + 2000
              say(LINES.blownCrash)
            }
          }
          break
        }

        case 'crisp': {
          // 까맣게 탄 채 잠깐 굳어 있다 → 재로 흩어진다
          p.y = GROUND_Y
          if (now > p.modeUntil) {
            setAsh({ x: p.x, key: now })
            setModeBoth('gone')
            p.modeUntil = now + 1500
          }
          break
        }

        case 'gone': {
          // 사라진 상태. 잠시 뒤 엉뚱한 곳 땅에서 솟아오른다.
          if (now > p.modeUntil) {
            p.respawnX = 40 + Math.random() * Math.max(80, W - CRAB_W - 80)
            p.x = p.respawnX
            p.y = -26
            p.dir = 1
            setDirt({ x: p.respawnX, key: now })
            setModeBoth('respawn')
            say(LINES.respawn)
          }
          break
        }

        case 'respawn': {
          // 땅에서 쇼쇼속 솟아오른다
          p.x = p.respawnX
          if (p.y >= GROUND_Y) {
            p.y = GROUND_Y
            p.zappedUntil = 0 // 새 몸이니 취약창 리셋
            setModeBoth('walk')
          } else {
            p.y += 3
          }
          break
        }

        case 'snack': {
          // 간식 냠냠. 제자리에서 먹는다.
          p.y = GROUND_Y + (Math.floor(now / 160) % 2 === 0 ? 0 : 2)
          if (now > p.modeUntil) {
            p.y = GROUND_Y
            setModeBoth('walk')
          }
          break
        }

        case 'drag':
          break
      }

      // DOM 반영 (gone 은 렌더에서 숨긴다)
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
      // 내가 마지막 소유자일 때만 콘솔 API 를 걷어낸다 (다음 인스턴스 것을 지우지 않게)
      const w = window as unknown as { __crab?: typeof crabApi }
      if (w.__crab === crabApi) delete w.__crab
    }
    // 마운트에 한 번만. 날씨는 wxRef 로 읽어서 루프·타이머가 끊기지 않는다.
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

  const onPointerUp = (e?: React.PointerEvent) => {
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

    // 자는 게를 건드리면 깜짝 놀라 깬다
    if (p.mode === 'nap') {
      setModeBoth('walk')
      say(LINES.napWake, 2600)
      return
    }

    // 클릭 = 액션 메뉴(간식/단어/콕찌르기)
    if (e) setMenuAt({ x: e.clientX, y: e.clientY })
  }

  // ── 콕 찌르기 (메뉴에서)
  const pokeCrab = () => {
    setMenuAt(null)
    const now = Date.now()
    pokeTimes.current = [...pokeTimes.current.filter(t => now - t < 4000), now]
    const rapid = pokeTimes.current.length

    if (rapid >= 3) {
      bumpAffinity(-1)
      say(LINES.pokeAnnoyed, 2600)
      if (rapid >= 6 && phys.current.mode === 'walk') {
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

  // ── 간식 주기 (메뉴에서)
  const feedSnack = () => {
    setMenuAt(null)
    const now = Date.now()
    snackTimes.current = [...snackTimes.current.filter(t => now - t < 9000), now]
    const p = phys.current
    setTreat({ kind: Math.floor(Math.random() * SNACKS.length), key: now })
    setTimeout(() => setTreat(t => (t && t.key === now ? null : t)), 2600)
    if (['walk', 'goto', 'admire', 'dance', 'snack'].includes(p.mode)) {
      p.mode = 'snack'
      setMode('snack')
      p.modeUntil = now + 2600
    }
    if (snackTimes.current.length >= 4) {
      say(LINES.snackFull, 2600)
    } else {
      bumpAffinity(+2)
      say(LINES.snackHappy, 2600)
    }
  }

  // ── 단어 가르치기 제출
  const submitWord = () => {
    const clean = wordDraft.trim()
    setWordOpen(false)
    setWordDraft('')
    if (!clean) return
    learnWord(clean)
    bumpAffinity(+1)
    say(LINES.learn.map(s => s.replaceAll('{w}', clean.slice(0, 12))), 3000)
  }

  // 메뉴 바깥 클릭하면 닫는다
  useEffect(() => {
    if (!menuAt) return
    const onDown = (ev: MouseEvent) => {
      if (!(ev.target as HTMLElement).closest('[data-crab-menu], [data-crab]')) setMenuAt(null)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [menuAt])

  const showUmbrella = wx.raining && mode !== 'heliUp' && mode !== 'heliDrop' && mode !== 'surf' && mode !== 'cooloff' && mode !== 'dig'
  const eyes = dizzy ? 'dizzy' : mode === 'suntan' || mode === 'nap' || mode === 'mourn' || bump ? 'closed' : 'open'
  /** 모래 파기·물놀이 땐 아랫도리를 가려 파묻힌 느낌을 낸다 */
  const halfClip = mode === 'dig' || mode === 'cooloff' ? { clipPath: 'inset(0 0 42% 0)' } : undefined

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
      {/* 모래성: 게가 점점 쌓고, 클릭하면 부술 수 있다. 앵커 div 는 항상 존재(게 목표점) */}
      <div ref={sandcastleAnchorRef} className="absolute bottom-[8px] left-[55%] hidden md:block">
        <Sandcastle level={castleLevel} smashing={castleSmashing} onSmash={smashCastle} />
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

      {/* 비 (뇌우면 더 굵고 어둡게) */}
      {wx.raining && <RainFX heavy={wx.thunder} />}

      {/* 번개: 하늘 섬광 + 내려꽂히는 볼트 */}
      {bolt && (
        <>
          <div key={`f${bolt.key}`} className="sky-flash pointer-events-none fixed inset-0 z-[6] bg-white" />
          <div key={bolt.key} className="absolute bottom-[40px] z-[7]" style={{ left: bolt.x }}>
            <LightningBolt />
          </div>
        </>
      )}

      {/* 강풍: 날아가는 모래 먼지 */}
      {wx.windy && <WindDust />}

      {/* 바사삭: 재 흩어짐 / 리스폰 흙 튀김 */}
      {ash && (
        <div key={`ash${ash.key}`} className="absolute bottom-[4px]" style={{ left: ash.x }}>
          <AshPoof />
        </div>
      )}
      {dirt && (
        <div key={`dirt${dirt.key}`} className="absolute bottom-[2px]" style={{ left: dirt.x }}>
          <DirtBurst />
        </div>
      )}

      {/* ── 꽃게 본체 (여기만 클릭/드래그 가능) */}
      <div
        ref={crabRef}
        data-crab
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={e => onPointerUp(e)}
        onPointerCancel={() => onPointerUp()}
        className={`absolute z-[8] touch-none ${mode === 'drag' ? 'cursor-grabbing' : 'cursor-grab'} ${mode === 'gone' ? 'pointer-events-none opacity-0' : 'pointer-events-auto'}`}
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
        {mode === 'suntan' && <SunLounger />}
        {(mode === 'heliUp' || mode === 'heliDrop') && <Helicopter spinning={mode === 'heliUp'} />}
        {showUmbrella && <Umbrella />}
        {mode === 'suntan' && <Sunglasses />}
        {mode === 'drool' && <Drool />}
        {mode === 'nap' && <ZzzFloat />}
        {wx.hot && !wx.raining && mode !== 'cooloff' && mode !== 'dig' && <HeatSteam />}
        {dizzy && (
          <div className="dizzy-star absolute -top-[12px] left-[6px] flex gap-6 text-[10px]">
            <span>✦</span>
            <span>✦</span>
          </div>
        )}
        {/* 먹는 간식 */}
        {treat && mode === 'snack' && (
          <div key={treat.key} className="treat-nom absolute top-[16px] left-[40px] text-[14px]">
            {SNACKS[treat.kind]}
          </div>
        )}
        {/* 모래성 짓는 중 땀 */}
        {mode === 'build' && (
          <div className="heat-steam absolute -top-[6px] left-[38px] text-[11px]">💦</div>
        )}
        {/* 성 부서져 슬픔: 눈물 뚝뚝 */}
        {mode === 'mourn' && (
          <>
            <span className="tear-drop absolute top-[12px] left-[13px] block h-[5px] w-[3px] rounded-full bg-sky-300" />
            <span className="tear-drop absolute top-[12px] left-[40px] block h-[5px] w-[3px] rounded-full bg-sky-300" style={{ animationDelay: '0.4s' }} />
          </>
        )}

        <div
          className={`${moving || mode === 'dance' || mode === 'snack' ? 'crab-bob' : ''} ${zapped ? 'zap-flicker' : ''} ${mode === 'crisp' ? 'crab-charred' : ''} ${mode === 'blown' && !wx.raining ? 'blown-spin' : ''} ${mode === 'respawn' ? 'crab-rise' : ''}`}
          style={{ transform: facing === -1 ? 'scaleX(-1)' : undefined, ...halfClip }}
        >
          <CrabBody eyes={mode === 'crisp' ? 'dead' : zapped ? 'dizzy' : eyes} bump={bump} />
        </div>

        {mode === 'surf' && <Surfboard />}
      </div>

      {/* 클릭 액션 메뉴 (포탈) */}
      {menuAt &&
        createPortal(
          <div
            data-crab-menu
            className="animate-fade-up fixed z-[80] flex -translate-x-1/2 flex-col gap-0.5 rounded-xl border border-line bg-surface p-1 shadow-[0_8px_24px_-8px_rgba(15,15,15,0.35)]"
            style={{
              // 화면 밖으로 잘리지 않게 클램프. 위 공간이 부족하면 클릭점 아래로 편다.
              left: Math.min(Math.max(menuAt.x, 80), window.innerWidth - 80),
              top: menuAt.y - 8 > 130 ? menuAt.y - 8 : menuAt.y + 20,
              transform: `translateX(-50%) ${menuAt.y - 8 > 130 ? 'translateY(-100%)' : ''}`,
            }}
          >
            <button onClick={feedSnack} className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-left text-xs font-medium text-ink transition hover:bg-hover">
              🍪 간식 주기
            </button>
            <button onClick={() => { setMenuAt(null); setWordOpen(true) }} className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-left text-xs font-medium text-ink transition hover:bg-hover">
              📖 단어 가르치기
            </button>
            <button onClick={pokeCrab} className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-left text-xs font-medium text-ink transition hover:bg-hover">
              👆 콕 찌르기
            </button>
          </div>,
          document.body,
        )}

      {/* 단어 가르치기 입력 (포탈) */}
      {wordOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/20 p-4"
            onMouseDown={e => e.target === e.currentTarget && setWordOpen(false)}
          >
            <div className="animate-fade-up w-full max-w-[300px] rounded-2xl border border-line bg-surface p-4 shadow-[0_16px_40px_-12px_rgba(15,15,15,0.3)]">
              <div className="mb-1 text-sm font-semibold text-ink">🦀 단어 가르치기</div>
              <p className="mb-3 text-xs text-ink-muted">꽃게에게 외우게 할 단어를 알려주세요. 가끔 복습하며 말해요.</p>
              <input
                autoFocus
                value={wordDraft}
                onChange={e => setWordDraft(e.target.value)}
                placeholder="예: 파이팅, 사랑해, 오마카세…"
                maxLength={24}
                onKeyDown={e => {
                  if (e.key === 'Enter') submitWord()
                  if (e.key === 'Escape') {
                    setWordOpen(false)
                    setWordDraft('')
                  }
                }}
                className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-brand"
              />
              <div className="mt-3 flex justify-end gap-2">
                <button
                  onClick={() => { setWordOpen(false); setWordDraft('') }}
                  className="rounded-lg px-3 py-1.5 text-xs text-ink-muted transition hover:bg-hover"
                >
                  취소
                </button>
                <button
                  onClick={submitWord}
                  className="rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-white transition hover:bg-black"
                >
                  가르치기
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}
