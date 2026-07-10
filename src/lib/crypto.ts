import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'node:crypto'

// 카드번호·CVC·계정 비밀번호처럼 유출되면 되돌릴 수 없는 값만 이걸 통과시킨다.
// 저장 포맷: v1.<iv>.<authTag>.<ciphertext> (각 파트 base64url)

const PREFIX = 'v1'

function key(): Buffer {
  const raw = process.env.ENCRYPTION_KEY
  if (!raw) throw new Error('ENCRYPTION_KEY 환경변수가 없습니다. .env.local에 설정해 주세요.')
  return createHash('sha256').update(raw).digest()
}

export function encrypt(plain: string): string {
  if (!plain) return ''
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key(), iv)
  const ct = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return [PREFIX, iv.toString('base64url'), tag.toString('base64url'), ct.toString('base64url')].join('.')
}

export function decrypt(stored: string | null): string {
  if (!stored) return ''
  const parts = stored.split('.')
  if (parts.length !== 4 || parts[0] !== PREFIX) return stored // 암호화 이전에 들어온 평문
  const [, iv, tag, ct] = parts
  try {
    const decipher = createDecipheriv('aes-256-gcm', key(), Buffer.from(iv, 'base64url'))
    decipher.setAuthTag(Buffer.from(tag, 'base64url'))
    return Buffer.concat([decipher.update(Buffer.from(ct, 'base64url')), decipher.final()]).toString('utf8')
  } catch {
    return ''
  }
}

export function last4(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '')
  return digits.slice(-4)
}

export function maskCard(cardNumber: string): string {
  const d = cardNumber.replace(/\D/g, '')
  if (d.length < 4) return '••••'
  return `•••• •••• •••• ${d.slice(-4)}`
}
