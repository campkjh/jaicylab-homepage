import { NextResponse } from 'next/server'

type Body = {
  items?: string[]      // 선택된 기능 라벨 목록
  packageName?: string
  tier?: string
  subtotal?: number
  totalMM?: number
  calMonths?: number
  nativeMode?: string
  design?: string
  timeline?: string
}

async function generateWithClaude(b: Body): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null
  try {
    const prompt = `너는 한국어 비즈니스 메일 작성을 도와주는 어시스턴트야. 아래 정보를 바탕으로 앱 개발 회사에 보낼 견적 요청 메시지를 자연스럽게 작성해줘. 딱딱하지 않되 정중한 톤으로, 8~12문장 이내.

서비스 유형: ${b.packageName ?? '미지정'} (${b.tier ?? '표준'})
선택 기능 수: ${b.items?.length ?? 0}개
주요 기능: ${(b.items ?? []).slice(0, 15).join(', ')}
개발 방식: ${b.nativeMode ?? ''}
디자인 수준: ${b.design ?? ''}
일정: ${b.timeline ?? ''}
예상 공급가: ${b.subtotal ? `${b.subtotal.toLocaleString()}만원` : ''}
예상 기간: ${b.calMonths ? `${b.calMonths.toFixed(1)}개월` : ''}

요청사항을 자연스럽게 정리해줘. 목록 대신 문장 위주로.`

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 700,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!res.ok) return null
    const data = await res.json() as { content?: { type: string; text: string }[] }
    const text = data.content?.find(c => c.type === 'text')?.text?.trim()
    return text || null
  } catch (e) {
    console.error('[ai-draft] anthropic error', e)
    return null
  }
}

function template(b: Body): string {
  const items = b.items ?? []
  const head: string[] = []
  head.push('안녕하세요, 제이씨랩 팀께')
  head.push('')
  if (b.packageName) head.push(`현재 "${b.packageName}"${b.tier ? ` (${b.tier})` : ''} 방향으로 앱 기획을 검토하고 있습니다.`)
  else head.push('앱 기획을 구체화 중이며 견적과 일정 협의를 부탁드립니다.')
  head.push('')

  if (items.length) {
    head.push(`다음과 같은 기능을 우선 고려하고 있습니다(${items.length}개):`)
    items.slice(0, 12).forEach(i => head.push(`- ${i}`))
    if (items.length > 12) head.push(`- …외 ${items.length - 12}개`)
    head.push('')
  }

  const cond: string[] = []
  if (b.nativeMode) cond.push(`개발 방식: ${b.nativeMode}`)
  if (b.design)     cond.push(`디자인 수준: ${b.design}`)
  if (b.timeline)   cond.push(`일정: ${b.timeline}`)
  if (cond.length) {
    head.push(cond.join(' · '))
    head.push('')
  }

  if (typeof b.subtotal === 'number' || typeof b.calMonths === 'number') {
    const parts: string[] = []
    if (typeof b.subtotal === 'number') parts.push(`공급가 ${b.subtotal.toLocaleString()}만원`)
    if (typeof b.calMonths === 'number') parts.push(`약 ${b.calMonths.toFixed(1)}개월`)
    head.push(`규모는 대략 ${parts.join(' / ')} 수준으로 예상하고 있습니다.`)
    head.push('')
  }

  head.push('기능 상세와 일정에 대한 협의가 가능한지, 적용 가능한 할인 혜택을 포함한 견적을 받아보고 싶습니다.')
  head.push('편하신 시간에 회신 부탁드립니다. 감사합니다.')
  return head.join('\n')
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body
    const aiText = await generateWithClaude(body)
    const text = aiText ?? template(body)
    return NextResponse.json({ text, ai: !!aiText })
  } catch (e) {
    console.error('[ai-draft] error', e)
    return NextResponse.json({ error: '생성에 실패했어요.' }, { status: 500 })
  }
}
