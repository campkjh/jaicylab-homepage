// 제이씨랩 — 패키지용 커스텀 아이콘 (토스식 라운드 스퀴클 스타일)
// 각 아이콘은 44x44 viewBox에 자체 배경(rx=10)을 포함한 완결된 디자인

type P = { className?: string }
const W = (p: P) => p.className ?? 'h-12 w-12'

// ───────────── BUSINESS ─────────────

export const IconCorp = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#DBEAFE" />
    <rect x="9" y="10" width="26" height="28" rx="3" fill="#3B82F6" />
    <rect x="9" y="10" width="26" height="6" fill="#60A5FA" />
    <rect x="13" y="20" width="3.5" height="3.5" rx="0.5" fill="white" />
    <rect x="20.25" y="20" width="3.5" height="3.5" rx="0.5" fill="white" />
    <rect x="27.5" y="20" width="3.5" height="3.5" rx="0.5" fill="white" />
    <rect x="13" y="26" width="3.5" height="3.5" rx="0.5" fill="white" />
    <rect x="20.25" y="26" width="3.5" height="3.5" rx="0.5" fill="white" />
    <rect x="27.5" y="26" width="3.5" height="3.5" rx="0.5" fill="white" />
    <rect x="19" y="32" width="6" height="6" fill="#1E40AF" />
  </svg>
)

export const IconUser = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#FCE7F3" />
    <circle cx="22" cy="17" r="6.5" fill="#EC4899" />
    <path d="M10 38 Q10 26 22 26 Q34 26 34 38 Z" fill="#F472B6" />
    <circle cx="22" cy="17" r="6.5" fill="#EC4899" />
  </svg>
)

export const IconLaw = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#F1F5F9" />
    <rect x="21" y="10" width="2" height="24" rx="1" fill="#475569" />
    <circle cx="22" cy="8" r="2.5" fill="#475569" />
    <rect x="14" y="32" width="16" height="2.5" rx="1" fill="#475569" />
    <path d="M10 17 L18 17 L14 25 Z" fill="#94A3B8" />
    <path d="M26 17 L34 17 L30 25 Z" fill="#94A3B8" />
    <rect x="10" y="15" width="24" height="2" rx="0.5" fill="#475569" />
  </svg>
)

export const IconHospital = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#FEE2E2" />
    <rect x="7" y="13" width="30" height="24" rx="3" fill="#EF4444" />
    <rect x="7" y="13" width="30" height="6" fill="#F87171" />
    <rect x="19" y="21" width="6" height="12" rx="1" fill="white" />
    <rect x="16" y="24" width="12" height="6" rx="1" fill="white" />
  </svg>
)

export const IconCalendar = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#E0E7FF" />
    <rect x="8" y="11" width="28" height="26" rx="3" fill="#6366F1" />
    <rect x="8" y="11" width="28" height="7" fill="#4F46E5" />
    <rect x="13" y="7" width="2.5" height="7" rx="1" fill="#312E81" />
    <rect x="28.5" y="7" width="2.5" height="7" rx="1" fill="#312E81" />
    <path d="M16 26 L20 30 L29 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
)

export const IconHome = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#FEF3C7" />
    <path d="M22 7 L37 20 L37 37 L7 37 L7 20 Z" fill="#F59E0B" />
    <path d="M22 7 L37 20 L32 20 L22 12 L12 20 L7 20 Z" fill="#FBBF24" />
    <rect x="18" y="25" width="8" height="12" fill="#FEF3C7" />
    <circle cx="20" cy="31" r="0.8" fill="#F59E0B" />
  </svg>
)

export const IconBriefcase = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#E0F2FE" />
    <rect x="17" y="9" width="10" height="6" rx="1.5" fill="#0284C7" />
    <rect x="6" y="14" width="32" height="22" rx="3" fill="#0EA5E9" />
    <rect x="6" y="22" width="32" height="3" fill="#0369A1" />
    <rect x="19" y="20" width="6" height="5" rx="1" fill="#FACC15" />
  </svg>
)

export const IconCalc = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#EDE9FE" />
    <rect x="10" y="7" width="24" height="30" rx="3" fill="#8B5CF6" />
    <rect x="13" y="11" width="18" height="7" rx="1.5" fill="#F3F4F6" />
    <circle cx="16" cy="24" r="1.8" fill="white" />
    <circle cx="22" cy="24" r="1.8" fill="white" />
    <circle cx="28" cy="24" r="1.8" fill="white" />
    <circle cx="16" cy="30" r="1.8" fill="white" />
    <circle cx="22" cy="30" r="1.8" fill="white" />
    <rect x="26.5" y="28.2" width="3.6" height="3.6" rx="0.8" fill="#FBBF24" />
  </svg>
)

// ───────────── COMMERCE ─────────────

export const IconShop = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#FFE4E6" />
    <path d="M14.5 14.5 Q14.5 8 22 8 Q29.5 8 29.5 14.5" stroke="#F43F5E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M10 16 L34 16 L31.5 38 L12.5 38 Z" fill="#F43F5E" />
    <circle cx="17" cy="22" r="1.5" fill="white" />
    <circle cx="27" cy="22" r="1.5" fill="white" />
  </svg>
)

export const IconShirt = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#FCE7F3" />
    <path d="M14 12 L22 8 L30 12 L38 18 L33 23 L30 21 L30 37 L14 37 L14 21 L11 23 L6 18 Z" fill="#DB2777" />
    <path d="M18 10.5 Q22 13.5 26 10.5" stroke="#831843" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
)

export const IconGrocery = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#FEE2E2" />
    <path d="M8 11 L11 11 L13 16 L33 16 L30 28 L15 28 L14 24" stroke="#DC2626" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="16" cy="33" r="2.5" fill="#DC2626" />
    <circle cx="29" cy="33" r="2.5" fill="#DC2626" />
    <rect x="17" y="18" width="14" height="8" rx="1" fill="#FCA5A5" />
  </svg>
)

export const IconLeaf = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#D1FAE5" />
    <path d="M34 8 C34 20 27 32 12 34 C12 34 10 22 18 14 C24 8 34 8 34 8 Z" fill="#10B981" />
    <path d="M14 34 Q22 22 32 10" stroke="#047857" strokeWidth="1.8" fill="none" strokeLinecap="round" />
  </svg>
)

export const IconGem = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#EDE9FE" />
    <path d="M22 8 L34 18 L22 38 L10 18 Z" fill="#8B5CF6" />
    <path d="M22 8 L28 18 L22 38 L16 18 Z" fill="#A78BFA" />
    <path d="M10 18 L34 18" stroke="white" strokeWidth="1.5" />
    <path d="M14 14 L30 14" stroke="#6D28D9" strokeWidth="1.5" />
  </svg>
)

export const IconRefresh = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#CCFBF1" />
    <path d="M22 10 C28.6 10 34 15.4 34 22 L29 22 L33 28 L37 22" stroke="#14B8A6" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 34 C15.4 34 10 28.6 10 22 L15 22 L11 16 L7 22" stroke="#14B8A6" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const IconAuction = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#FEF3C7" />
    <rect x="6" y="32" width="32" height="4" rx="1.5" fill="#CA8A04" />
    <rect x="22" y="10" width="5" height="22" rx="1.5" transform="rotate(-30 24.5 21)" fill="#EAB308" />
    <rect x="24" y="6" width="12" height="7" rx="1.5" transform="rotate(-30 30 9.5)" fill="#F59E0B" />
    <circle cx="18" cy="26" r="2" fill="#FDE047" />
  </svg>
)

export const IconTrending = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#D1FAE5" />
    <path d="M8 30 L18 20 L24 26 L36 12" stroke="#059669" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M28 12 L36 12 L36 20" stroke="#059669" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="18" cy="20" r="2" fill="#10B981" />
    <circle cx="24" cy="26" r="2" fill="#10B981" />
  </svg>
)

// ───────────── FOOD ─────────────

export const IconDelivery = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#FED7AA" />
    <rect x="9" y="10" width="16" height="12" rx="2" fill="#EA580C" />
    <path d="M25 14 L33 14 L37 22 L37 28 L25 28 Z" fill="#F97316" />
    <circle cx="13" cy="32" r="4" fill="#7C2D12" />
    <circle cx="13" cy="32" r="1.5" fill="#FED7AA" />
    <circle cx="31" cy="32" r="4" fill="#7C2D12" />
    <circle cx="31" cy="32" r="1.5" fill="#FED7AA" />
    <rect x="28" y="18" width="6" height="4" fill="#FED7AA" />
  </svg>
)

export const IconReceipt = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#FEF3C7" />
    <path d="M11 6 L33 6 L33 40 L29 37 L25 40 L22 37 L19 40 L15 37 L11 40 Z" fill="#F59E0B" />
    <rect x="15" y="12" width="14" height="2" rx="1" fill="white" />
    <rect x="15" y="17" width="14" height="2" rx="1" fill="white" />
    <rect x="15" y="22" width="10" height="2" rx="1" fill="white" />
    <rect x="15" y="28" width="14" height="2.5" rx="1" fill="white" />
  </svg>
)

export const IconCoffee = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#FEF3C7" />
    <path d="M12 18 L32 18 L30 36 L14 36 Z" fill="#92400E" />
    <path d="M32 22 Q38 22 38 28 Q38 32 32 32" stroke="#92400E" strokeWidth="2.5" fill="none" />
    <path d="M18 10 Q18 14 16 16" stroke="#D4A574" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M23 10 Q23 14 21 16" stroke="#D4A574" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M28 10 Q28 14 26 16" stroke="#D4A574" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
)

export const IconChef = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#F3E8FF" />
    <path d="M12 20 Q8 20 8 16 Q8 11 13 11 Q14 8 18 8 Q22 6 26 8 Q30 8 31 11 Q36 11 36 16 Q36 20 32 20 L32 28 L12 28 Z" fill="#9333EA" />
    <rect x="12" y="28" width="20" height="3" fill="#6B21A8" />
    <rect x="12" y="31" width="20" height="4" fill="#A855F7" />
  </svg>
)

export const IconSoup = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#FEE2E2" />
    <path d="M6 22 L38 22 Q38 34 22 36 Q6 34 6 22 Z" fill="#DC2626" />
    <rect x="6" y="22" width="32" height="3" fill="#EF4444" />
    <circle cx="16" cy="16" r="2.5" fill="#FCA5A5" />
    <circle cx="22" cy="12" r="2.5" fill="#FCA5A5" />
    <circle cx="28" cy="16" r="2.5" fill="#FCA5A5" />
  </svg>
)

// ───────────── EDUCATION ─────────────

export const IconBook = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#DBEAFE" />
    <path d="M6 12 L22 10 L22 34 L6 36 Z" fill="#2563EB" />
    <path d="M38 12 L22 10 L22 34 L38 36 Z" fill="#3B82F6" />
    <rect x="21" y="10" width="2" height="26" fill="#1E40AF" />
    <rect x="10" y="16" width="8" height="1.5" rx="0.5" fill="white" />
    <rect x="10" y="20" width="10" height="1.5" rx="0.5" fill="white" />
    <rect x="10" y="24" width="6" height="1.5" rx="0.5" fill="white" />
    <rect x="24" y="16" width="10" height="1.5" rx="0.5" fill="white" />
    <rect x="24" y="20" width="8" height="1.5" rx="0.5" fill="white" />
  </svg>
)

export const IconBaby = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#FCE7F3" />
    <circle cx="22" cy="18" r="9" fill="#FBBF24" />
    <circle cx="18.5" cy="17" r="1.2" fill="#451A03" />
    <circle cx="25.5" cy="17" r="1.2" fill="#451A03" />
    <path d="M18 21 Q22 24 26 21" stroke="#451A03" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <circle cx="13" cy="13" r="2.5" fill="#FDE68A" />
    <circle cx="31" cy="13" r="2.5" fill="#FDE68A" />
    <path d="M10 38 Q10 29 22 29 Q34 29 34 38 Z" fill="#EC4899" />
  </svg>
)

export const IconGrad = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#E0E7FF" />
    <path d="M4 18 L22 10 L40 18 L22 26 Z" fill="#4F46E5" />
    <path d="M12 22 L12 31 Q22 37 32 31 L32 22" stroke="#6366F1" strokeWidth="3" fill="none" strokeLinecap="round" />
    <rect x="37" y="18" width="1.8" height="10" fill="#4F46E5" />
    <circle cx="37.9" cy="30" r="2" fill="#4F46E5" />
  </svg>
)

export const IconAward = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#FEF3C7" />
    <circle cx="22" cy="19" r="11" fill="#F59E0B" />
    <circle cx="22" cy="19" r="7" fill="#FBBF24" />
    <path d="M15 27 L11 38 L16 35 L18 40 L22 30" fill="#DC2626" />
    <path d="M29 27 L33 38 L28 35 L26 40 L22 30" fill="#DC2626" />
  </svg>
)

// ───────────── HEALTH ─────────────

export const IconFitness = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#D1FAE5" />
    <rect x="4" y="18" width="4" height="10" rx="1.5" fill="#065F46" />
    <rect x="8" y="14" width="5" height="18" rx="2" fill="#059669" />
    <rect x="13" y="20" width="18" height="6" rx="1" fill="#10B981" />
    <rect x="31" y="14" width="5" height="18" rx="2" fill="#059669" />
    <rect x="36" y="18" width="4" height="10" rx="1.5" fill="#065F46" />
  </svg>
)

export const IconMental = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#F3E8FF" />
    <path d="M22 38 C8 27 8 18 14 14 C18 11 22 14 22 17 C22 14 26 11 30 14 C36 18 36 27 22 38 Z" fill="#A855F7" />
    <path d="M22 38 C8 27 8 18 14 14 C18 11 22 14 22 17 Z" fill="#C084FC" />
  </svg>
)

export const IconDiet = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#FEE2E2" />
    <path d="M22 12 C14 12 8 18 8 26 C8 34 14 38 22 38 C30 38 36 34 36 26 C36 18 30 12 22 12 Z" fill="#EF4444" />
    <path d="M20 9 Q22 5 26 7 Q24 11 20 12 Z" fill="#16A34A" />
    <circle cx="16" cy="22" r="2" fill="#FCA5A5" />
  </svg>
)

export const IconPet = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#FED7AA" />
    <ellipse cx="22" cy="28" rx="8" ry="7" fill="#C2410C" />
    <ellipse cx="12" cy="18" rx="3" ry="4" fill="#EA580C" />
    <ellipse cx="32" cy="18" rx="3" ry="4" fill="#EA580C" />
    <ellipse cx="17" cy="12" rx="2.5" ry="3.5" fill="#EA580C" />
    <ellipse cx="27" cy="12" rx="2.5" ry="3.5" fill="#EA580C" />
  </svg>
)

// ───────────── COMMUNITY ─────────────

export const IconChat = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#FCE7F3" />
    <path d="M6 14 Q6 8 12 8 L26 8 Q32 8 32 14 L32 22 Q32 28 26 28 L18 28 L12 34 L12 28 Q6 28 6 22 Z" fill="#EC4899" />
    <path d="M16 20 Q22 24 28 18 Q32 14 38 16 L38 30 Q38 34 34 34 L26 34 L22 38 L22 34 Q18 34 16 30 Z" fill="#F472B6" />
  </svg>
)

export const IconDating = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#FFE4E6" />
    <path d="M18 38 C7 30 7 22 11 18 C14 15 17 18 17 20 C17 18 20 15 23 18 C27 22 27 30 18 38 Z" fill="#F43F5E" />
    <path d="M30 26 C22 20 22 14 25 11 C27 9 30 11 30 13 C30 11 33 9 35 11 C38 14 38 20 30 26 Z" fill="#FB7185" />
  </svg>
)

export const IconParty = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#FEF3C7" />
    <path d="M10 38 L24 10 L36 32 Z" fill="#F59E0B" />
    <circle cx="18" cy="20" r="1.8" fill="#EC4899" />
    <circle cx="28" cy="18" r="1.8" fill="#22C55E" />
    <circle cx="22" cy="28" r="1.8" fill="#3B82F6" />
    <circle cx="14" cy="34" r="1.5" fill="#EC4899" />
    <circle cx="32" cy="30" r="1.5" fill="#A855F7" />
  </svg>
)

export const IconMapPin = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#D1FAE5" />
    <path d="M22 6 C14.3 6 8 12.3 8 20 C8 28 22 40 22 40 C22 40 36 28 36 20 C36 12.3 29.7 6 22 6 Z" fill="#10B981" />
    <circle cx="22" cy="19" r="5" fill="white" />
    <circle cx="22" cy="19" r="2.5" fill="#047857" />
  </svg>
)

export const IconChurch = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#E0E7FF" />
    <rect x="20.5" y="6" width="3" height="12" fill="#4F46E5" />
    <rect x="16" y="10" width="12" height="3" fill="#4F46E5" />
    <path d="M22 14 L34 22 L34 38 L10 38 L10 22 Z" fill="#6366F1" />
    <rect x="18" y="28" width="8" height="10" rx="4" fill="#E0E7FF" />
  </svg>
)

// ───────────── PRODUCTIVITY ─────────────

export const IconTodo = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#DBEAFE" />
    <rect x="8" y="10" width="28" height="26" rx="3" fill="white" />
    <rect x="11" y="14" width="3" height="3" rx="0.5" fill="#3B82F6" />
    <rect x="16" y="14" width="14" height="3" rx="0.5" fill="#93C5FD" />
    <rect x="11" y="21" width="3" height="3" rx="0.5" fill="#3B82F6" />
    <rect x="16" y="21" width="10" height="3" rx="0.5" fill="#93C5FD" />
    <rect x="11" y="28" width="3" height="3" rx="0.5" fill="#E5E7EB" />
    <rect x="16" y="28" width="12" height="3" rx="0.5" fill="#E5E7EB" />
    <path d="M11.5 15 L12.5 16 L13.5 14.5" stroke="white" strokeWidth="0.9" fill="none" />
    <path d="M11.5 22 L12.5 23 L13.5 21.5" stroke="white" strokeWidth="0.9" fill="none" />
  </svg>
)

export const IconNote = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#FEF3C7" />
    <rect x="8" y="8" width="28" height="30" rx="3" fill="#F59E0B" />
    <rect x="11" y="12" width="22" height="22" rx="1" fill="white" />
    <rect x="14" y="17" width="14" height="2" rx="0.5" fill="#FBBF24" />
    <rect x="14" y="22" width="12" height="2" rx="0.5" fill="#FBBF24" />
    <rect x="14" y="27" width="10" height="2" rx="0.5" fill="#FBBF24" />
    <path d="M28 30 L34 24 L37 27 L31 33 Z" fill="#EC4899" />
  </svg>
)

export const IconCrm = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#CCFBF1" />
    <circle cx="15" cy="15" r="5" fill="#14B8A6" />
    <circle cx="29" cy="15" r="5" fill="#0D9488" />
    <circle cx="22" cy="26" r="5.5" fill="#14B8A6" />
    <path d="M7 36 Q7 28 15 28 Q20 28 22 30 Q24 28 29 28 Q37 28 37 36" fill="#5EEAD4" />
  </svg>
)

export const IconKanban = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#E0E7FF" />
    <rect x="7" y="10" width="9" height="24" rx="2" fill="#6366F1" />
    <rect x="17.5" y="10" width="9" height="16" rx="2" fill="#818CF8" />
    <rect x="28" y="10" width="9" height="20" rx="2" fill="#4F46E5" />
    <rect x="9" y="14" width="5" height="2" rx="0.5" fill="white" />
    <rect x="9" y="18" width="5" height="2" rx="0.5" fill="white" />
    <rect x="19.5" y="14" width="5" height="2" rx="0.5" fill="white" />
    <rect x="30" y="14" width="5" height="2" rx="0.5" fill="white" />
  </svg>
)

// ───────────── LIFESTYLE ─────────────

export const IconSpray = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#CCFBF1" />
    <rect x="14" y="14" width="14" height="22" rx="2" fill="#14B8A6" />
    <rect x="16" y="10" width="10" height="5" rx="1.5" fill="#0D9488" />
    <rect x="18" y="6" width="6" height="4" rx="1" fill="#0F766E" />
    <rect x="16" y="20" width="10" height="6" rx="1" fill="white" />
    <circle cx="32" cy="10" r="1.5" fill="#5EEAD4" />
    <circle cx="35" cy="14" r="1.2" fill="#5EEAD4" />
    <circle cx="34" cy="18" r="1" fill="#5EEAD4" />
  </svg>
)

export const IconTruck = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#DBEAFE" />
    <rect x="4" y="14" width="22" height="16" rx="2" fill="#2563EB" />
    <path d="M26 18 L34 18 L38 24 L38 30 L26 30 Z" fill="#3B82F6" />
    <rect x="28" y="20" width="6" height="4" fill="#DBEAFE" />
    <circle cx="12" cy="33" r="3.5" fill="#1E40AF" />
    <circle cx="12" cy="33" r="1.2" fill="#DBEAFE" />
    <circle cx="32" cy="33" r="3.5" fill="#1E40AF" />
    <circle cx="32" cy="33" r="1.2" fill="#DBEAFE" />
  </svg>
)

export const IconWrench = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#FEE2E2" />
    <path d="M30 10 Q38 12 36 20 L24 32 L12 36 L8 32 L20 20 Q18 12 26 10 Z" fill="#DC2626" />
    <circle cx="28" cy="14" r="3.5" fill="#FEE2E2" />
    <path d="M11 31 L13 33" stroke="#FEE2E2" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export const IconPlane = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#CCFBF1" />
    <path d="M6 26 L16 20 L32 24 L38 16 Q42 14 40 20 L36 28 L22 32 L14 34 L12 32 L18 28 L14 28 L10 30 Z" fill="#0D9488" />
    <circle cx="32" cy="22" r="1" fill="white" />
  </svg>
)

// ───────────── PRODUCTIVITY / MISC ─────────────

export const IconFile = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#E0E7FF" />
    <path d="M12 8 L26 8 L34 16 L34 36 Q34 38 32 38 L12 38 Q10 38 10 36 L10 10 Q10 8 12 8 Z" fill="#4F46E5" />
    <path d="M26 8 L26 16 L34 16 Z" fill="#6366F1" />
    <rect x="14" y="22" width="16" height="1.8" rx="0.5" fill="white" />
    <rect x="14" y="26" width="12" height="1.8" rx="0.5" fill="white" />
    <rect x="14" y="30" width="14" height="1.8" rx="0.5" fill="white" />
  </svg>
)

export const IconHeadset = (p: P) => (
  <svg viewBox="0 0 44 44" className={W(p)} xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="12" fill="#DBEAFE" />
    <path d="M22 8 C14 8 8 14 8 22 L8 30 Q8 34 12 34 L14 34 L14 22 C14 18 18 14 22 14 C26 14 30 18 30 22 L30 34 L32 34 Q36 34 36 30 L36 22 C36 14 30 8 22 8 Z" fill="#3B82F6" />
    <rect x="6" y="24" width="8" height="12" rx="2" fill="#60A5FA" />
    <rect x="30" y="24" width="8" height="12" rx="2" fill="#60A5FA" />
  </svg>
)
