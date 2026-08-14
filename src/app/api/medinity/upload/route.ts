import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

// 공개 /medinity 견적 페이지에서 레퍼런스 PDF 를 올린다. (PDF 만, 20MB 이하)
const MAX_BYTES = 20 * 1024 * 1024

export async function POST(req: Request) {
  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 })
  if (file.type !== 'application/pdf') return NextResponse.json({ error: 'PDF 파일만 올릴 수 있습니다.' }, { status: 400 })
  if (file.size > MAX_BYTES) return NextResponse.json({ error: '20MB 이하만 올릴 수 있습니다.' }, { status: 400 })

  const { url } = await put(`medinity/${crypto.randomUUID()}.pdf`, file, {
    access: 'public',
    contentType: 'application/pdf',
  })
  return NextResponse.json({ url })
}
