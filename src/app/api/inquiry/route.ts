import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Vercel env: RESEND_API_KEY 필수
// 선택: RESEND_FROM (ex: "제이씨랩 견적 <noreply@resend.dev>")

type InquiryBody = {
  name: string
  phone: string
  email: string
  summary?: {
    subtotal?: number
    vat?: number
    total?: number
    totalMM?: number
    calMonths?: number
    selectedCount?: number
    activePkg?: string | null
    activeTier?: string | null
    nativeMode?: string
    design?: string
    timeline?: string
  }
}

function escapeHtml(v: string) {
  return v.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as InquiryBody
    const { name, phone, email, summary } = body

    if (!name || !phone) {
      return NextResponse.json({ error: '이름과 연락처는 필수입니다.' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    const to = 'jaicylab2009@gmail.com'
    const from = process.env.RESEND_FROM || 'JAICYLAB <onboarding@resend.dev>'

    // Resend 키가 없으면 로그만 남기고 성공 응답 (로컬 개발 편의)
    if (!apiKey) {
      console.log('[inquiry] RESEND_API_KEY not set. Logging instead.')
      console.log({ name, phone, email, summary })
      return NextResponse.json({ ok: true, skipped: true })
    }

    const resend = new Resend(apiKey)

    const lines: string[] = []
    lines.push(`이름: ${escapeHtml(name)}`)
    lines.push(`연락처: ${escapeHtml(phone)}`)
    if (email) lines.push(`이메일: ${escapeHtml(email)}`)
    lines.push('')

    if (summary) {
      lines.push('— 선택된 견적 —')
      if (summary.activePkg) lines.push(`패키지: ${summary.activePkg}${summary.activeTier ? ` (${summary.activeTier})` : ''}`)
      if (typeof summary.selectedCount === 'number') lines.push(`선택 항목 수: ${summary.selectedCount}`)
      if (summary.design) lines.push(`디자인: ${summary.design}`)
      if (summary.timeline) lines.push(`일정: ${summary.timeline}`)
      if (summary.nativeMode) lines.push(`개발 방식: ${summary.nativeMode}`)
      if (typeof summary.subtotal === 'number') lines.push(`공급가: ${summary.subtotal.toLocaleString()}만원`)
      if (typeof summary.vat === 'number')      lines.push(`부가세: ${summary.vat.toLocaleString()}만원`)
      if (typeof summary.total === 'number')    lines.push(`합계(VAT 포함): ${summary.total.toLocaleString()}만원`)
      if (typeof summary.totalMM === 'number')  lines.push(`총 맨먼스: ${summary.totalMM.toFixed(1)} MM`)
      if (typeof summary.calMonths === 'number') lines.push(`예상 기간: ${summary.calMonths.toFixed(1)} 개월`)
    }

    const text = lines.join('\n')
    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;max-width:640px;margin:0 auto;padding:24px;background:#0A0A0A;color:#fff;">
        <div style="font-size:11px;font-weight:700;color:#82B1FF;letter-spacing:0.15em">NEW INQUIRY · 견적 할인 신청</div>
        <h1 style="margin:8px 0 24px;font-size:22px;font-weight:700">${escapeHtml(name)}님 견적 문의</h1>
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <tbody>
            <tr><td style="padding:6px 0;color:#9AA3B2;width:110px">이름</td><td style="padding:6px 0;font-weight:600">${escapeHtml(name)}</td></tr>
            <tr><td style="padding:6px 0;color:#9AA3B2">연락처</td><td style="padding:6px 0;font-weight:600">${escapeHtml(phone)}</td></tr>
            ${email ? `<tr><td style="padding:6px 0;color:#9AA3B2">이메일</td><td style="padding:6px 0;font-weight:600">${escapeHtml(email)}</td></tr>` : ''}
          </tbody>
        </table>
        ${summary ? `
          <div style="margin-top:20px;padding:16px;background:#141414;border:1px solid #222;border-radius:10px">
            <div style="font-size:11px;color:#82B1FF;font-weight:700;margin-bottom:8px">견적 요약</div>
            <div style="font-size:13px;color:#CDD3DD;line-height:1.9">
              ${summary.activePkg ? `<div>패키지: <b style="color:#fff">${escapeHtml(summary.activePkg)}${summary.activeTier ? ` (${escapeHtml(summary.activeTier)})` : ''}</b></div>` : ''}
              ${typeof summary.selectedCount === 'number' ? `<div>선택 항목: <b style="color:#fff">${summary.selectedCount}개</b></div>` : ''}
              ${summary.design ? `<div>디자인: <b style="color:#fff">${escapeHtml(summary.design)}</b></div>` : ''}
              ${summary.timeline ? `<div>일정: <b style="color:#fff">${escapeHtml(summary.timeline)}</b></div>` : ''}
              ${summary.nativeMode ? `<div>개발 방식: <b style="color:#fff">${escapeHtml(summary.nativeMode)}</b></div>` : ''}
              ${typeof summary.subtotal === 'number' ? `<div style="margin-top:8px">공급가: <b style="color:#fff">${summary.subtotal.toLocaleString()}만원</b></div>` : ''}
              ${typeof summary.vat === 'number' ? `<div>부가세: <b style="color:#fff">${summary.vat.toLocaleString()}만원</b></div>` : ''}
              ${typeof summary.total === 'number' ? `<div style="margin-top:4px;font-size:16px">합계: <b style="color:#82B1FF">${summary.total.toLocaleString()}만원</b> <span style="color:#666;font-size:11px">(VAT 포함)</span></div>` : ''}
              ${typeof summary.totalMM === 'number' ? `<div style="margin-top:8px">맨먼스: <b style="color:#fff">${summary.totalMM.toFixed(1)} MM</b></div>` : ''}
              ${typeof summary.calMonths === 'number' ? `<div>예상 기간: <b style="color:#fff">${summary.calMonths.toFixed(1)}개월</b></div>` : ''}
            </div>
          </div>
        ` : ''}
        <div style="margin-top:24px;font-size:11px;color:#555">
          jaicylab.com 자가견적 페이지에서 전송됨 · ${new Date().toLocaleString('ko-KR')}
        </div>
      </div>
    `

    const replyTo = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined
    const { error } = await resend.emails.send({
      from,
      to,
      subject: `[견적 할인 신청] ${name}님 · ${summary?.total ? `${summary.total.toLocaleString()}만원` : ''}`,
      text,
      html,
      replyTo,
    })

    if (error) {
      console.error('[inquiry] resend error', error)
      return NextResponse.json({ error: '전송에 실패했어요. 잠시 후 다시 시도해 주세요.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[inquiry] error', e)
    return NextResponse.json({ error: '전송에 실패했어요.' }, { status: 500 })
  }
}
