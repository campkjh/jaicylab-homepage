// Edge(middleware)와 Node(server action) 양쪽에서 같이 쓰이므로 Web Crypto만 사용한다.

export const SESSION_COOKIE = 'jl_admin'

// 브라우저가 쿠키 max-age 를 400일로 잘라내므로(Chrome), 그 상한을 쓰고
// 접속할 때마다 미들웨어가 쿠키를 다시 발급해 실질적으로 만료되지 않게 한다.
export const MAX_AGE_SEC = 60 * 60 * 24 * 400

const encoder = new TextEncoder()

function toB64Url(bytes: Uint8Array): string {
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromB64Url(s: string): Uint8Array<ArrayBuffer> {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'))
  const out = new Uint8Array(new ArrayBuffer(bin.length))
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

async function hmacKey(): Promise<CryptoKey> {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) throw new Error('ADMIN_SESSION_SECRET 환경변수가 없습니다.')
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify',
  ])
}

/** 세션 자체에는 만료가 없다. 끊으려면 ADMIN_SESSION_SECRET 을 교체한다. */
export async function createSession(name: string): Promise<{ value: string; maxAge: number }> {
  const payload = toB64Url(encoder.encode(JSON.stringify({ name })))
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(), encoder.encode(payload))
  return { value: `${payload}.${toB64Url(new Uint8Array(sig))}`, maxAge: MAX_AGE_SEC }
}

/** 유효하면 관리자 이름을, 아니면 null을 돌려준다. */
export async function verifySession(token: string | undefined): Promise<string | null> {
  if (!token) return null
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return null
  try {
    const ok = await crypto.subtle.verify('HMAC', await hmacKey(), fromB64Url(sig), encoder.encode(payload))
    if (!ok) return null
    const { name } = JSON.parse(new TextDecoder().decode(fromB64Url(payload))) as { name?: string }
    return typeof name === 'string' && name ? name : null
  } catch {
    return null
  }
}

/** ADMIN_USERS="채은:비번,정훈:비번" — 비밀번호가 곧 사용자 식별자다. */
function adminUsers(): { name: string; password: string }[] {
  return (process.env.ADMIN_USERS ?? '')
    .split(',')
    .map(pair => pair.trim())
    .filter(Boolean)
    .map(pair => {
      const i = pair.indexOf(':')
      return { name: pair.slice(0, i).trim(), password: pair.slice(i + 1).trim() }
    })
    .filter(u => u.name && u.password)
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  let diff = a.length ^ b.length
  for (let i = 0; i < a.length && i < b.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}

/**
 * 입력한 비밀번호에 해당하는 관리자 이름을 돌려준다. 없으면 null.
 * 타이밍 공격을 피하려고 HMAC으로 비교하고, 일치해도 끝까지 순회한다.
 */
export async function authenticate(input: string): Promise<string | null> {
  const users = adminUsers()
  if (!users.length) return null

  const k = await hmacKey()
  const inputMac = new Uint8Array(await crypto.subtle.sign('HMAC', k, encoder.encode(input)))

  let matched: string | null = null
  for (const u of users) {
    const mac = new Uint8Array(await crypto.subtle.sign('HMAC', k, encoder.encode(u.password)))
    if (timingSafeEqual(inputMac, mac)) matched = u.name
  }
  return matched
}

/** 태그로 고를 수 있는 관리자 이름 목록. */
export function adminNames(): string[] {
  return adminUsers().map(u => u.name)
}
