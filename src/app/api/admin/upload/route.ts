import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { currentAdmin } from '@/lib/session'

const MAX_BYTES = 8 * 1024 * 1024
const ALLOWED = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'])

export async function POST(req: Request) {
  // 미들웨어는 /api 를 타지 않으므로 여기서 직접 막는다.
  const admin = await currentAdmin()
  if (!admin) return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 })

  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 })

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: '이미지 파일만 올릴 수 있습니다.' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: '8MB 이하만 올릴 수 있습니다.' }, { status: 400 })
  }

  const folder = form.get('folder') === 'avatar' ? 'avatar' : 'event'
  const ext = file.name.includes('.') ? file.name.split('.').pop()!.toLowerCase().slice(0, 5) : 'png'

  const { url } = await put(`${folder}/${crypto.randomUUID()}.${ext}`, file, {
    access: 'public',
    contentType: file.type,
  })

  return NextResponse.json({ url })
}
