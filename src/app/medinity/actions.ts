'use server'

import { Resend } from 'resend'
import { sql, ensureSchema } from '@/lib/db'
import { requireAdmin } from '@/lib/session'
import type { MedinityDevInfo } from '@/lib/types'
import {
  MEDINITY_SECTIONS,
  MEDINITY_CHOICE_INDEX,
  includedChoiceIds,
  totalPageCount,
  priceOfChoice,
  stepperPrice,
  VAT_RATE,
  formatWon,
} from '@/data/medinity'

export type MedinityQuoteInput = {
  /** 요청 제목 (예: 미소치과 홈페이지) */
  title?: string
  memo?: string
  /** 레퍼런스 URL (참고용 링크) */
  referenceUrl?: string
  choiceIds: string[]
  steppers: Record<string, number>
}

export type QuoteLine = { label: string; price: number }

function escapeHtml(v: string) {
  return v.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

/**
 * 선택값으로 견적 줄 목록과 공급가를 계산한다. 가격은 절대 클라이언트를 믿지 않고
 * 서버 카탈로그에서 다시 계산한다. (하위 옵션은 부모가 선택됐을 때만 인정)
 */
function computeLines(choiceIds: string[], steppers: Record<string, number>): { lines: QuoteLine[]; subtotal: number } {
  const picked = new Set(choiceIds)
  const included = includedChoiceIds(picked) // 무료 포함되는 옵션
  const extraPages = Math.max(0, Math.floor(Number(steppers['extra-page'] ?? 0)))
  const totalPages = totalPageCount(picked, extraPages)
  const lines: QuoteLine[] = []

  for (const section of MEDINITY_SECTIONS) {
    // 옵션(single/multi)
    for (const choice of section.choices ?? []) {
      if (picked.has(choice.id)) {
        const inc = included.has(choice.id)
        const base = priceOfChoice(choice, totalPages)
        const note = inc ? ' (기본 포함)' : choice.perPage != null ? ` (${totalPages}페이지 기준)` : ''
        lines.push({ label: `${section.title} · ${choice.name}${note}`, price: inc ? 0 : base })
        for (const child of choice.children ?? []) {
          if (picked.has(child.id)) lines.push({ label: `${choice.name} · ${child.name}`, price: child.price })
        }
      }
    }
    // 네이버 지도를 선택하지 않으면 기본 구글 지도 무료 연동
    if (section.id === 'integration' && !picked.has('int-navermap')) {
      lines.push({ label: '연동 · 구글 지도 연동 (기본 무료)', price: 0 })
    }
    // 스텝퍼(추가 페이지·수정 횟수 등)
    if (section.stepper) {
      const st = section.stepper
      const raw = Number(steppers[st.id] ?? 0)
      const qty = Math.max(st.min, Math.min(st.max, Number.isFinite(raw) ? Math.floor(raw) : 0))
      if (qty > 0) {
        const free = st.freeUnits ? ` (${st.freeUnits}${st.unit}까지 무료)` : ''
        lines.push({ label: `${section.title} · ${qty}${st.unit}${free}`, price: stepperPrice(st, qty) })
      }
    }
  }

  const subtotal = lines.reduce((s, l) => s + l.price, 0)
  return { lines, subtotal }
}

export async function submitMedinityQuote(
  input: MedinityQuoteInput,
): Promise<{ ok: true; id: number } | { ok: false; error: string }> {
  await requireAdmin() // 내부 제작 도구 — 로그인 필수
  await ensureSchema()

  const title = (input.title ?? '').trim()
  const memo = (input.memo ?? '').trim()
  const referenceUrl = (input.referenceUrl ?? '').trim()

  // 유효한 옵션 id 만 남긴다.
  const choiceIds = (input.choiceIds ?? []).filter(id => MEDINITY_CHOICE_INDEX[id])
  const { lines, subtotal } = computeLines(choiceIds, input.steppers ?? {})
  if (lines.length === 0) return { ok: false, error: '견적 항목을 하나 이상 선택해 주세요.' }

  const total = Math.round(subtotal * (1 + VAT_RATE))

  const rows = (await sql`
    INSERT INTO medinity_quotes (title, memo, reference_url, selections, subtotal, total, req_status)
    VALUES (${title || null}, ${memo || null}, ${referenceUrl || null}, ${JSON.stringify(lines)}, ${subtotal}, ${total}, 'inquiry')
    RETURNING id
  `) as { id: number }[]
  const id = rows[0].id

  // 이메일 발송 (키가 없으면 저장만 하고 넘어간다 — 로컬 개발 편의)
  try {
    const apiKey = process.env.RESEND_API_KEY
    if (apiKey) {
      const resend = new Resend(apiKey)
      const from = process.env.RESEND_FROM || 'JAICYLAB <onboarding@resend.dev>'
      const to = 'jaicylab2009@gmail.com'

      const vat = total - subtotal
      const itemsHtml = lines
        .map(l => `<tr><td style="padding:6px 0;color:#334155">${escapeHtml(l.label)}</td><td style="padding:6px 0;text-align:right;font-weight:600;color:#0f172a">${formatWon(l.price)}</td></tr>`)
        .join('')

      const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;max-width:640px;margin:0 auto;padding:24px;background:#f8fafc;color:#0f172a">
        <div style="font-size:11px;font-weight:700;color:#0ea5e9;letter-spacing:.15em">MEDINITY · 홈페이지 제작 견적 요청</div>
        <h1 style="margin:8px 0 20px;font-size:22px;font-weight:800">${title ? escapeHtml(title) : `새 견적 요청 #${id}`}</h1>
        ${referenceUrl ? `<div style="margin-bottom:16px"><a href="${escapeHtml(referenceUrl)}" style="display:inline-block;padding:10px 16px;background:#0ea5e9;color:#fff;border-radius:10px;font-size:13px;font-weight:700;text-decoration:none">🔗 레퍼런스 링크 열기</a></div>` : ''}
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:16px">
          <div style="font-size:11px;color:#0ea5e9;font-weight:700;margin-bottom:8px">선택 항목 (${lines.length})</div>
          <table style="width:100%;border-collapse:collapse;font-size:13px">
            <tbody>${itemsHtml}</tbody>
          </table>
          <div style="border-top:1px solid #e2e8f0;margin-top:12px;padding-top:12px;font-size:13px;color:#334155">
            <div style="display:flex;justify-content:space-between"><span>공급가</span><b>${formatWon(subtotal)}</b></div>
            <div style="display:flex;justify-content:space-between;color:#64748b"><span>부가세(10%)</span><span>${formatWon(vat)}</span></div>
            <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:16px"><span>합계</span><b style="color:#0ea5e9">${formatWon(total)}</b></div>
          </div>
        </div>
        ${memo ? `<div style="margin-top:16px;padding:14px;background:#fff;border:1px solid #e2e8f0;border-radius:12px"><div style="font-size:11px;color:#0ea5e9;font-weight:700;margin-bottom:6px">요청사항</div><div style="font-size:13px;color:#334155;line-height:1.8;white-space:pre-wrap">${escapeHtml(memo)}</div></div>` : ''}
        <div style="margin-top:20px;font-size:11px;color:#94a3b8">jaicylab.com/medinity 견적 페이지에서 전송됨 · 접수번호 #${id}</div>
      </div>`

      const text = [
        `[메디니티 견적 요청] #${id}${title ? ` · ${title}` : ''}`,
        referenceUrl ? `레퍼런스 링크: ${referenceUrl}` : '',
        '',
        '— 선택 항목 —',
        ...lines.map(l => `• ${l.label} — ${formatWon(l.price)}`),
        '',
        `공급가: ${formatWon(subtotal)}`,
        `부가세(10%): ${formatWon(vat)}`,
        `합계: ${formatWon(total)}`,
        memo ? `\n— 요청사항 —\n${memo}` : '',
      ].filter(Boolean).join('\n')

      await resend.emails.send({ from, to, subject: `[메디니티 견적] ${title || `새 요청 #${id}`} · ${formatWon(total)}`, text, html })
    } else {
      console.log('[medinity] RESEND_API_KEY 없음 — 저장만 하고 이메일은 건너뜀', { id })
    }
  } catch (e) {
    // 이메일 실패해도 접수는 저장됐으므로 성공으로 처리한다.
    console.error('[medinity] 이메일 발송 실패', e)
  }

  return { ok: true, id }
}

/**
 * 개발의뢰 정보(제목·계정·카드·사업자)와 단계(req_status)를 접수 건에 실시간 저장한다.
 * 홈 요청관리 그룹포커스에서 입력할 때마다(디바운스) 호출되어 admin 견적함에 그대로 반영된다.
 * 값은 병원 운영 대행을 위해 평문으로 저장한다. (관리자 인증 화면에서만 열람)
 */
export async function saveMedinityDev(
  id: number,
  data: { title?: string | null; dev?: MedinityDevInfo | null; reqStatus?: string | null },
): Promise<{ ok: boolean }> {
  await requireAdmin() // 내부 제작 도구 — 로그인 필수
  if (!Number.isFinite(id)) return { ok: false }
  await ensureSchema()
  const devJson = data.dev && Object.keys(data.dev).length > 0 ? JSON.stringify(data.dev) : null
  await sql`
    UPDATE medinity_quotes
    SET title = ${data.title ?? null},
        dev = ${devJson}::jsonb,
        req_status = ${data.reqStatus ?? null}
    WHERE id = ${id}
  `
  return { ok: true }
}
