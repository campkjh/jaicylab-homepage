// 제이씨랩 — 패키지용 커스텀 아이콘 (Toss 아이콘 톤앤매너)
// 팔레트: #005BE2, #4B82FA, #76A5F9, #D2E1FF, #FFD04F, #FFB520,
//         #6F47D2, #8862E8, #AA88FF, #97E8FF, #DAE0E8, #ADB8C4,
//         #FFC9A8, #FDDDBA, #FF5700, #FFFFFF

type P = { className?: string }
const C = (p: P) => p.className ?? 'h-12 w-12'
const V: React.SVGProps<SVGSVGElement> = { viewBox: '0 0 44 44', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }
const BG = <rect width="44" height="44" fill="white" />

// ───────────── BUSINESS ─────────────

export const IconCorp = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <rect x="6" y="14" width="32" height="24" rx="3" fill="#D2E1FF" />
    <rect x="9" y="8" width="20" height="30" rx="3" fill="#76A5F9" />
    <rect x="12" y="12" width="4" height="4" rx="1" fill="white" />
    <rect x="18" y="12" width="4" height="4" rx="1" fill="white" />
    <rect x="12" y="19" width="4" height="4" rx="1" fill="white" />
    <rect x="18" y="19" width="4" height="4" rx="1" fill="white" />
    <rect x="12" y="26" width="4" height="4" rx="1" fill="white" />
    <rect x="18" y="26" width="4" height="4" rx="1" fill="white" />
    <rect x="30" y="19" width="5" height="3" rx="1" fill="white" />
    <rect x="30" y="25" width="5" height="3" rx="1" fill="white" />
    <rect x="30" y="31" width="5" height="3" rx="1" fill="white" />
    <rect x="17" y="33" width="4" height="5" rx="1" fill="#4B82FA" />
  </svg>
)

export const IconUser = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <circle cx="22" cy="18" r="7" fill="#FDDDBA" />
    <path d="M17 12 Q17 7 22 7 Q27 7 27 12 Q27 14 25 15 L19 15 Q17 14 17 12 Z" fill="#6F47D2" />
    <path d="M8 40 Q8 26 22 26 Q36 26 36 40 Z" fill="#AA88FF" />
    <path d="M14 34 L30 34" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export const IconLaw = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <rect x="20.5" y="8" width="3" height="26" rx="1.5" fill="#ADB8C4" />
    <circle cx="22" cy="8" r="3" fill="#4B82FA" />
    <rect x="13" y="33" width="18" height="3" rx="1.5" fill="#ADB8C4" />
    <path d="M8 15 L18 15 L13 24 Q13 25 13 25 L8 16 Z" fill="#76A5F9" />
    <path d="M26 15 L36 15 L31 24 Q31 25 31 25 L26 16 Z" fill="#76A5F9" />
    <rect x="7" y="13" width="30" height="3" rx="1.5" fill="#4B82FA" />
  </svg>
)

export const IconHospital = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <rect x="6" y="10" width="32" height="28" rx="4" fill="#D2E1FF" />
    <rect x="6" y="10" width="32" height="8" rx="4" fill="#4B82FA" />
    <rect x="19" y="21" width="6" height="14" rx="1.5" fill="#FF5700" />
    <rect x="15" y="25" width="14" height="6" rx="1.5" fill="#FF5700" />
    <rect x="19" y="21" width="6" height="14" rx="1.5" fill="white" opacity="0.15" />
    <circle cx="12" cy="14" r="1.5" fill="white" />
    <circle cx="32" cy="14" r="1.5" fill="white" />
  </svg>
)

export const IconCalendar = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <rect x="6" y="10" width="32" height="28" rx="4" fill="#D2E1FF" />
    <rect x="6" y="10" width="32" height="8" rx="4" fill="#4B82FA" />
    <rect x="12" y="6" width="3" height="8" rx="1.5" fill="#005BE2" />
    <rect x="29" y="6" width="3" height="8" rx="1.5" fill="#005BE2" />
    <circle cx="16" cy="25" r="2" fill="#76A5F9" />
    <circle cx="22" cy="25" r="2" fill="#76A5F9" />
    <circle cx="28" cy="25" r="2" fill="#76A5F9" />
    <circle cx="16" cy="31" r="2" fill="#76A5F9" />
    <rect x="19" y="28" width="6" height="6" rx="1.5" fill="#FF5700" />
  </svg>
)

export const IconHome = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <path d="M22 7 L38 20 L35 22 L22 11 L9 22 L6 20 Z" fill="#FFB520" />
    <path d="M10 20 L22 11 L34 20 L34 38 L10 38 Z" fill="#FFD04F" />
    <rect x="18" y="25" width="8" height="13" rx="1" fill="white" />
    <rect x="14" y="23" width="4" height="4" rx="0.5" fill="#FDDDBA" />
    <rect x="26" y="23" width="4" height="4" rx="0.5" fill="#FDDDBA" />
    <circle cx="24" cy="32" r="0.8" fill="#6F47D2" />
  </svg>
)

export const IconBriefcase = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <rect x="17" y="9" width="10" height="6" rx="1.5" fill="#005BE2" />
    <rect x="6" y="14" width="32" height="22" rx="4" fill="#D2E1FF" />
    <rect x="6" y="14" width="32" height="22" rx="4" fill="#4B82FA" />
    <rect x="6" y="22" width="32" height="3" fill="#005BE2" />
    <rect x="19" y="21" width="6" height="5" rx="1" fill="#FFD04F" />
    <rect x="6" y="14" width="32" height="4" fill="#76A5F9" opacity="0.8" />
  </svg>
)

export const IconCalc = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <rect x="9" y="6" width="26" height="32" rx="4" fill="#8862E8" />
    <rect x="12" y="10" width="20" height="8" rx="1.5" fill="white" />
    <rect x="28" y="12" width="3" height="4" rx="0.5" fill="#6F47D2" />
    <circle cx="15" cy="24" r="2" fill="white" />
    <circle cx="22" cy="24" r="2" fill="white" />
    <circle cx="29" cy="24" r="2" fill="white" />
    <circle cx="15" cy="31" r="2" fill="white" />
    <circle cx="22" cy="31" r="2" fill="white" />
    <rect x="27" y="29" width="4" height="4" rx="1" fill="#FFD04F" />
  </svg>
)

// ───────────── COMMERCE ─────────────

export const IconShop = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <path d="M14 15 Q14 7 22 7 Q30 7 30 15" stroke="#4B82FA" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M8 15 L36 15 Q37 15 37 16 L34 37 Q34 38 33 38 L11 38 Q10 38 10 37 L7 16 Q7 15 8 15 Z" fill="#4B82FA" />
    <path d="M8 15 L36 15 Q37 15 37 16 L35 23 L9 23 L7 16 Q7 15 8 15 Z" fill="#76A5F9" />
    <circle cx="17" cy="19" r="1.3" fill="white" />
    <circle cx="27" cy="19" r="1.3" fill="white" />
  </svg>
)

export const IconShirt = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <path d="M14 11 L22 8 L30 11 L37 17 L33 22 L30 20 L30 37 L14 37 L14 20 L11 22 L7 17 Z" fill="#AA88FF" />
    <path d="M14 11 L22 8 L30 11 L37 17 L33 22 L30 20 L30 26 L14 26 L14 20 L11 22 L7 17 Z" fill="#8862E8" />
    <path d="M19 10 Q22 12 25 10" stroke="#6F47D2" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
)

export const IconGrocery = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <path d="M7 10 L11 10 L13 15 L34 15 Q35 15 35 16 L32 28 Q32 29 31 29 L16 29 L15 32" stroke="#4B82FA" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="14" y="16" width="20" height="12" rx="1.5" fill="#D2E1FF" />
    <rect x="17" y="18" width="4" height="8" rx="1" fill="#FF5700" />
    <rect x="23" y="18" width="4" height="8" rx="1" fill="#FFD04F" />
    <rect x="29" y="18" width="4" height="8" rx="1" fill="#76A5F9" />
    <circle cx="16" cy="36" r="2.5" fill="#4B82FA" />
    <circle cx="30" cy="36" r="2.5" fill="#4B82FA" />
  </svg>
)

export const IconLeaf = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <path d="M36 8 C36 22 26 34 10 36 C10 36 10 20 20 12 C28 6 36 8 36 8 Z" fill="#97E8FF" />
    <path d="M36 8 C36 22 26 34 10 36 C10 36 14 26 22 20 C28 16 36 8 36 8 Z" fill="#4B82FA" opacity="0.6" />
    <path d="M12 36 Q22 24 34 12" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
)

export const IconGem = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <path d="M22 7 L36 18 L22 39 L8 18 Z" fill="#AA88FF" />
    <path d="M22 7 L28 18 L22 39 L16 18 Z" fill="#8862E8" />
    <path d="M8 18 L36 18" stroke="white" strokeWidth="1.8" />
    <path d="M13 13 L31 13" stroke="#6F47D2" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M22 7 L22 18" stroke="white" strokeWidth="1" />
  </svg>
)

export const IconRefresh = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <path d="M22 9 C28.6 9 34 14.4 34 21 L29 21 L33 28 L37 21" stroke="#4B82FA" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 35 C15.4 35 10 29.6 10 23 L15 23 L11 16 L7 23" stroke="#76A5F9" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const IconAuction = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <rect x="5" y="33" width="34" height="4" rx="1.5" fill="#ADB8C4" />
    <rect x="20" y="12" width="4" height="22" rx="1.5" transform="rotate(-32 22 23)" fill="#FFB520" />
    <rect x="23" y="5" width="12" height="7" rx="2" transform="rotate(-32 29 8.5)" fill="#FFD04F" />
    <circle cx="14" cy="28" r="2" fill="#FF5700" />
  </svg>
)

export const IconTrending = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <rect x="8" y="24" width="5" height="12" rx="1.5" fill="#D2E1FF" />
    <rect x="16" y="18" width="5" height="18" rx="1.5" fill="#76A5F9" />
    <rect x="24" y="12" width="5" height="24" rx="1.5" fill="#4B82FA" />
    <path d="M8 24 L16 18 L24 14 L36 8" stroke="#FF5700" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M30 8 L36 8 L36 14" stroke="#FF5700" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// ───────────── FOOD ─────────────

export const IconDelivery = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <rect x="8" y="12" width="14" height="12" rx="2" fill="#FF5700" />
    <path d="M22 16 L32 16 L37 22 L37 28 L22 28 Z" fill="#FFB520" />
    <rect x="28" y="19" width="6" height="4" rx="1" fill="white" />
    <circle cx="13" cy="30" r="5" fill="#005BE2" />
    <circle cx="13" cy="30" r="2" fill="#D2E1FF" />
    <circle cx="32" cy="30" r="5" fill="#005BE2" />
    <circle cx="32" cy="30" r="2" fill="#D2E1FF" />
    <rect x="14" y="26" width="18" height="2.5" fill="#ADB8C4" />
  </svg>
)

export const IconReceipt = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <path d="M11 5 L33 5 L33 41 L29 38 L25 41 L22 38 L19 41 L15 38 L11 41 Z" fill="#FFD04F" />
    <path d="M11 5 L33 5 L33 13 L11 13 Z" fill="#FFB520" />
    <rect x="15" y="8" width="14" height="2" rx="0.5" fill="white" />
    <rect x="15" y="18" width="14" height="2" rx="0.5" fill="white" />
    <rect x="15" y="23" width="12" height="2" rx="0.5" fill="white" />
    <rect x="15" y="28" width="14" height="2" rx="0.5" fill="white" />
    <circle cx="28" cy="33" r="2" fill="#FF5700" />
  </svg>
)

export const IconCoffee = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <path d="M12 17 L32 17 L30 36 Q30 37 29 37 L15 37 Q14 37 14 36 Z" fill="#FDDDBA" />
    <path d="M12 17 L32 17 L31 22 L13 22 Z" fill="#FFC9A8" />
    <path d="M32 21 Q38 21 38 27 Q38 32 32 32" stroke="#FDDDBA" strokeWidth="2.5" fill="none" />
    <path d="M17 8 Q17 11 19 13" stroke="#AA88FF" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <path d="M22 7 Q22 10 24 12" stroke="#AA88FF" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <path d="M27 8 Q27 11 29 13" stroke="#AA88FF" strokeWidth="2.2" strokeLinecap="round" fill="none" />
  </svg>
)

export const IconChef = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <path d="M12 20 Q7 20 7 15 Q7 10 12 10 Q13 6 18 6 Q22 4 26 6 Q31 6 32 10 Q37 10 37 15 Q37 20 32 20 L32 30 L12 30 Z" fill="white" stroke="#DAE0E8" strokeWidth="1.2" />
    <rect x="12" y="28" width="20" height="3" fill="#DAE0E8" />
    <rect x="12" y="31" width="20" height="6" rx="1" fill="#4B82FA" />
    <circle cx="16" cy="34" r="0.8" fill="white" />
    <circle cx="22" cy="34" r="0.8" fill="white" />
    <circle cx="28" cy="34" r="0.8" fill="white" />
  </svg>
)

export const IconSoup = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <path d="M5 22 L39 22 Q39 35 22 37 Q5 35 5 22 Z" fill="#FFD04F" />
    <rect x="5" y="22" width="34" height="3" fill="#FFB520" />
    <circle cx="15" cy="14" r="3" fill="#FF5700" />
    <circle cx="22" cy="10" r="3" fill="#FFC9A8" />
    <circle cx="29" cy="14" r="3" fill="#FF5700" />
    <path d="M13 6 Q15 3 17 6" stroke="#AA88FF" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
)

// ───────────── EDUCATION ─────────────

export const IconBook = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <path d="M5 11 L22 9 L22 36 L5 38 Z" fill="#76A5F9" />
    <path d="M39 11 L22 9 L22 36 L39 38 Z" fill="#4B82FA" />
    <rect x="21" y="9" width="2" height="27" fill="#005BE2" />
    <rect x="9" y="16" width="8" height="1.5" rx="0.5" fill="white" />
    <rect x="9" y="20" width="10" height="1.5" rx="0.5" fill="white" />
    <rect x="9" y="24" width="6" height="1.5" rx="0.5" fill="white" />
    <rect x="25" y="16" width="10" height="1.5" rx="0.5" fill="white" />
    <rect x="25" y="20" width="8" height="1.5" rx="0.5" fill="white" />
    <rect x="25" y="24" width="9" height="1.5" rx="0.5" fill="white" />
  </svg>
)

export const IconBaby = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <circle cx="22" cy="17" r="10" fill="#FDDDBA" />
    <path d="M14 11 Q14 6 22 6 Q30 6 30 11 Q30 14 27 15 L17 15 Q14 14 14 11 Z" fill="#6F47D2" />
    <circle cx="18" cy="18" r="1.3" fill="#2C2C2C" />
    <circle cx="26" cy="18" r="1.3" fill="#2C2C2C" />
    <path d="M19 22 Q22 24 25 22" stroke="#FF5700" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <circle cx="13" cy="22" r="2" fill="#FFC9A8" />
    <circle cx="31" cy="22" r="2" fill="#FFC9A8" />
    <path d="M8 39 Q8 29 22 29 Q36 29 36 39 Z" fill="#AA88FF" />
  </svg>
)

export const IconGrad = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <path d="M4 18 L22 10 L40 18 L22 26 Z" fill="#6F47D2" />
    <path d="M4 18 L22 10 L40 18 L22 22 Z" fill="#8862E8" />
    <path d="M12 22 L12 31 Q22 38 32 31 L32 22" stroke="#AA88FF" strokeWidth="3" fill="none" strokeLinecap="round" />
    <rect x="37" y="18" width="1.8" height="10" fill="#6F47D2" />
    <circle cx="37.9" cy="31" r="2.5" fill="#FFD04F" />
  </svg>
)

export const IconAward = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <path d="M14 6 L20 22 L14 30 L10 22 Z" fill="#FF5700" />
    <path d="M30 6 L34 22 L30 30 L24 22 Z" fill="#FF5700" />
    <circle cx="22" cy="25" r="11" fill="#FFD04F" />
    <circle cx="22" cy="25" r="7" fill="#FFB520" />
    <path d="M19 22 L21 26 L26 20" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// ───────────── HEALTH ─────────────

export const IconFitness = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <rect x="3" y="18" width="4" height="8" rx="1.5" fill="#005BE2" />
    <rect x="7" y="14" width="5" height="16" rx="2" fill="#4B82FA" />
    <rect x="12" y="20" width="20" height="4" rx="1" fill="#76A5F9" />
    <rect x="32" y="14" width="5" height="16" rx="2" fill="#4B82FA" />
    <rect x="37" y="18" width="4" height="8" rx="1.5" fill="#005BE2" />
    <rect x="12" y="20" width="20" height="1.5" fill="white" opacity="0.5" />
  </svg>
)

export const IconMental = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <path d="M22 38 C7 27 7 17 13 13 C17 10 22 13 22 17 C22 13 27 10 31 13 C37 17 37 27 22 38 Z" fill="#AA88FF" />
    <path d="M22 38 C7 27 7 17 13 13 C17 10 22 13 22 17 Z" fill="#8862E8" />
    <path d="M22 17 Q22 13 17 11" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
  </svg>
)

export const IconDiet = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <path d="M18 11 Q20 6 25 8 Q23 11 20 12 Z" fill="#97E8FF" opacity="0.9" />
    <path d="M22 12 C13 12 7 19 7 27 C7 35 13 39 22 39 C31 39 37 35 37 27 C37 19 31 12 22 12 Z" fill="#FF5700" />
    <path d="M22 12 C13 12 7 19 7 27 C7 30 8 33 10 35 C12 32 15 28 22 28 C29 28 32 32 34 35 C36 33 37 30 37 27 C37 19 31 12 22 12 Z" fill="#FFB520" opacity="0.4" />
    <ellipse cx="14" cy="22" rx="2.5" ry="1.8" fill="white" opacity="0.5" />
  </svg>
)

export const IconPet = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <ellipse cx="22" cy="28" rx="9" ry="8" fill="#FDDDBA" />
    <ellipse cx="11" cy="18" rx="3" ry="4.5" fill="#FFC9A8" />
    <ellipse cx="33" cy="18" rx="3" ry="4.5" fill="#FFC9A8" />
    <ellipse cx="17" cy="11" rx="2.5" ry="3.5" fill="#FFC9A8" />
    <ellipse cx="27" cy="11" rx="2.5" ry="3.5" fill="#FFC9A8" />
    <circle cx="22" cy="28" r="2" fill="#FF5700" />
  </svg>
)

// ───────────── COMMUNITY ─────────────

export const IconChat = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <path d="M5 14 Q5 8 11 8 L25 8 Q31 8 31 14 L31 22 Q31 28 25 28 L19 28 L13 34 L13 28 Q5 28 5 22 Z" fill="#D2E1FF" />
    <path d="M14 20 Q22 26 30 18 Q31 18 32 18 Q38 18 38 24 L38 30 Q38 34 34 34 L26 34 L22 38 L22 34 Q14 34 14 30 Z" fill="#4B82FA" />
    <circle cx="12" cy="18" r="1.5" fill="#4B82FA" />
    <circle cx="18" cy="18" r="1.5" fill="#4B82FA" />
    <circle cx="24" cy="26" r="1.2" fill="white" />
    <circle cx="30" cy="26" r="1.2" fill="white" />
  </svg>
)

export const IconDating = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <path d="M17 38 C5 29 5 20 10 16 C14 13 17 16 17 19 C17 16 20 13 24 16 C29 20 29 29 17 38 Z" fill="#FF5700" />
    <path d="M30 26 C22 20 22 14 25 11 C27 9 30 11 30 13 C30 11 33 9 35 11 C38 14 38 20 30 26 Z" fill="#AA88FF" />
  </svg>
)

export const IconParty = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <path d="M9 38 L24 9 L37 33 Z" fill="#FFD04F" />
    <path d="M14 32 L24 9 L32 29 Z" fill="#FFB520" />
    <circle cx="18" cy="22" r="2" fill="#FF5700" />
    <circle cx="28" cy="20" r="2" fill="#4B82FA" />
    <circle cx="22" cy="30" r="1.8" fill="#AA88FF" />
    <circle cx="14" cy="36" r="1.5" fill="#97E8FF" />
    <circle cx="33" cy="32" r="1.5" fill="#6F47D2" />
  </svg>
)

export const IconMapPin = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <path d="M22 5 C13.7 5 7 11.7 7 20 C7 28.5 22 40 22 40 C22 40 37 28.5 37 20 C37 11.7 30.3 5 22 5 Z" fill="#FF5700" />
    <circle cx="22" cy="20" r="6" fill="white" />
    <circle cx="22" cy="20" r="3" fill="#FF5700" />
  </svg>
)

export const IconChurch = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <rect x="20" y="4" width="4" height="14" rx="1" fill="#6F47D2" />
    <rect x="15" y="9" width="14" height="4" rx="1" fill="#6F47D2" />
    <path d="M22 15 L35 23 L35 38 L9 38 L9 23 Z" fill="#AA88FF" />
    <path d="M22 15 L35 23 L30 23 L22 17 L14 23 L9 23 Z" fill="#8862E8" />
    <rect x="18" y="26" width="8" height="12" rx="4" fill="white" />
    <rect x="20" y="28" width="4" height="4" fill="#FFD04F" />
  </svg>
)

// ───────────── PRODUCTIVITY ─────────────

export const IconTodo = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <rect x="6" y="8" width="32" height="28" rx="4" fill="#D2E1FF" />
    <rect x="6" y="8" width="32" height="7" rx="4" fill="#4B82FA" />
    <rect x="10" y="19" width="4" height="4" rx="1" fill="#4B82FA" />
    <rect x="16" y="20" width="14" height="2" rx="0.5" fill="#76A5F9" />
    <rect x="10" y="26" width="4" height="4" rx="1" fill="#4B82FA" />
    <rect x="16" y="27" width="10" height="2" rx="0.5" fill="#76A5F9" />
    <rect x="10" y="33" width="4" height="4" rx="1" fill="white" stroke="#76A5F9" strokeWidth="1" />
    <rect x="16" y="34" width="12" height="2" rx="0.5" fill="#ADB8C4" />
    <path d="M10.8 21 L12 22 L13.3 20" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.8 28 L12 29 L13.3 27" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const IconNote = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <rect x="7" y="7" width="26" height="30" rx="3" fill="#FFD04F" />
    <rect x="10" y="11" width="20" height="22" rx="1" fill="white" />
    <rect x="13" y="16" width="14" height="2" rx="0.5" fill="#FFD04F" />
    <rect x="13" y="21" width="12" height="2" rx="0.5" fill="#FFD04F" />
    <rect x="13" y="26" width="9" height="2" rx="0.5" fill="#FFD04F" />
    <path d="M26 28 L34 20 L37 23 L29 31 Z" fill="#6F47D2" />
    <path d="M34 20 L37 23" stroke="white" strokeWidth="1" />
  </svg>
)

export const IconCrm = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <circle cx="14" cy="14" r="5" fill="#76A5F9" />
    <circle cx="30" cy="14" r="5" fill="#4B82FA" />
    <circle cx="22" cy="25" r="6" fill="#005BE2" />
    <path d="M6 38 Q6 29 14 29 Q19 29 22 31 Q25 29 30 29 Q38 29 38 38" fill="#D2E1FF" />
    <circle cx="22" cy="24" r="2" fill="white" />
  </svg>
)

export const IconKanban = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <rect x="5" y="8" width="10" height="28" rx="2" fill="#D2E1FF" />
    <rect x="17" y="8" width="10" height="20" rx="2" fill="#76A5F9" />
    <rect x="29" y="8" width="10" height="24" rx="2" fill="#4B82FA" />
    <rect x="7" y="12" width="6" height="2.5" rx="0.5" fill="#4B82FA" />
    <rect x="7" y="17" width="6" height="2.5" rx="0.5" fill="#4B82FA" />
    <rect x="19" y="12" width="6" height="2.5" rx="0.5" fill="white" />
    <rect x="31" y="12" width="6" height="2.5" rx="0.5" fill="white" />
    <rect x="31" y="17" width="6" height="2.5" rx="0.5" fill="white" />
  </svg>
)

// ───────────── LIFESTYLE ─────────────

export const IconSpray = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <rect x="13" y="14" width="16" height="24" rx="3" fill="#97E8FF" />
    <rect x="13" y="14" width="16" height="8" rx="3" fill="#4B82FA" />
    <rect x="15" y="10" width="12" height="5" rx="1.5" fill="#76A5F9" />
    <rect x="17" y="5" width="8" height="6" rx="1.5" fill="#005BE2" />
    <rect x="16" y="25" width="10" height="5" rx="1" fill="white" />
    <circle cx="34" cy="9" r="1.5" fill="#97E8FF" />
    <circle cx="37" cy="13" r="1.2" fill="#97E8FF" />
    <circle cx="35" cy="17" r="1" fill="#97E8FF" />
  </svg>
)

export const IconTruck = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <rect x="3" y="14" width="22" height="16" rx="2" fill="#D2E1FF" />
    <path d="M25 18 L33 18 L39 24 L39 30 L25 30 Z" fill="#4B82FA" />
    <rect x="27" y="20" width="6" height="4" fill="#D2E1FF" />
    <circle cx="12" cy="32" r="4" fill="#005BE2" />
    <circle cx="12" cy="32" r="1.5" fill="#D2E1FF" />
    <circle cx="32" cy="32" r="4" fill="#005BE2" />
    <circle cx="32" cy="32" r="1.5" fill="#D2E1FF" />
    <rect x="6" y="18" width="14" height="2" rx="0.5" fill="#76A5F9" />
    <rect x="6" y="22" width="10" height="2" rx="0.5" fill="#76A5F9" />
  </svg>
)

export const IconWrench = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <path d="M31 8 Q38 11 36 19 L25 30 L14 36 L8 30 L19 19 Q17 11 24 8 Z" fill="#ADB8C4" />
    <circle cx="28" cy="12" r="3.5" fill="white" />
    <path d="M12 34 L14 32" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    <rect x="19" y="19" width="3" height="18" rx="1" transform="rotate(45 20.5 28)" fill="#FFD04F" />
  </svg>
)

export const IconPlane = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <path d="M4 22 Q4 20 6 20 L16 22 L30 12 Q34 9 37 11 Q39 13 36 17 L26 30 L22 38 L19 34 L20 28 L12 30 L8 26 L10 24 L16 24 Z" fill="#76A5F9" />
    <path d="M30 12 Q34 9 37 11 Q39 13 36 17 L30 25 Z" fill="#4B82FA" />
    <circle cx="32" cy="16" r="1" fill="white" />
  </svg>
)

export const IconFile = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <path d="M10 6 L26 6 L34 14 L34 36 Q34 38 32 38 L10 38 Q8 38 8 36 L8 8 Q8 6 10 6 Z" fill="#D2E1FF" />
    <path d="M26 6 L34 14 L26 14 Z" fill="#76A5F9" />
    <rect x="13" y="20" width="16" height="2" rx="0.5" fill="#4B82FA" />
    <rect x="13" y="25" width="12" height="2" rx="0.5" fill="#4B82FA" />
    <rect x="13" y="30" width="14" height="2" rx="0.5" fill="#4B82FA" />
    <circle cx="29" cy="32" r="3" fill="#FF5700" />
    <path d="M27.5 32 L29 33.5 L31 31.5" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const IconHeadset = (p: P) => (
  <svg {...V} className={C(p)}>
    {BG}
    <path d="M22 6 C13 6 6 13 6 22 L6 30 Q6 34 10 34 L13 34 L13 21 C13 16 17 12 22 12 C27 12 31 16 31 21 L31 34 L34 34 Q38 34 38 30 L38 22 C38 13 31 6 22 6 Z" fill="#4B82FA" />
    <rect x="4" y="24" width="10" height="12" rx="3" fill="#76A5F9" />
    <rect x="30" y="24" width="10" height="12" rx="3" fill="#76A5F9" />
    <circle cx="9" cy="30" r="1.5" fill="white" />
    <circle cx="35" cy="30" r="1.5" fill="white" />
  </svg>
)
