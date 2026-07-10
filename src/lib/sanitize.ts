/**
 * 리치 에디터가 보내는 HTML을 서버에서 화이트리스트 방식으로 정리한다.
 * 관리자 2명만 쓰는 화면이지만, 저장된 HTML을 dangerouslySetInnerHTML 로 다시 그리므로
 * 브라우저를 거치지 않고 API를 직접 때리는 경우까지 막아야 한다.
 */

const ALLOWED_TAGS = new Set(['p', 'div', 'br', 'b', 'strong', 'i', 'em', 'u', 's', 'span', 'ul', 'ol', 'li', 'a', 'img', 'h2', 'h3', 'blockquote', 'code'])

// style 은 색/배경색/굵기만, a 는 http(s) 만, img 는 우리 blob 호스트만 허용한다.
const COLOR_RE = /^(#[0-9a-f]{3,8}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|[a-z]+)$/i
const ALLOWED_IMG_HOST = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i

function cleanStyle(style: string): string {
  const out: string[] = []
  for (const decl of style.split(';')) {
    const [rawProp, ...rest] = decl.split(':')
    if (!rawProp || !rest.length) continue
    const prop = rawProp.trim().toLowerCase()
    const value = rest.join(':').trim()
    if (prop === 'color' || prop === 'background-color') {
      if (COLOR_RE.test(value)) out.push(`${prop}: ${value}`)
    } else if (prop === 'font-weight' && /^(bold|[1-9]00)$/i.test(value)) {
      out.push(`font-weight: ${value}`)
    } else if (prop === 'text-decoration' && /^(underline|line-through)$/i.test(value)) {
      out.push(`text-decoration: ${value}`)
    }
  }
  return out.join('; ')
}

/** 태그/속성 화이트리스트 밖은 전부 버린다. 허용 태그가 아니면 태그만 벗기고 내용은 남긴다. */
export function sanitizeHtml(input: string): string {
  if (!input) return ''

  // <script>, <style>, <iframe> 등은 내용까지 통째로 제거
  let html = input.replace(/<(script|style|iframe|object|embed|noscript)\b[\s\S]*?<\/\1>/gi, '')
  html = html.replace(/<!--[\s\S]*?-->/g, '')

  html = html.replace(/<\s*(\/?)\s*([a-z0-9]+)((?:\s+[^<>]*)?)\s*(\/?)>/gi, (_m, slash: string, rawTag: string, rawAttrs: string, selfClose: string) => {
    const tag = rawTag.toLowerCase()
    if (!ALLOWED_TAGS.has(tag)) return ''
    if (slash) return `</${tag}>`

    const attrs: string[] = []
    const attrRe = /([a-z-]+)\s*=\s*("([^"]*)"|'([^']*)')/gi
    let m: RegExpExecArray | null
    while ((m = attrRe.exec(rawAttrs))) {
      const name = m[1].toLowerCase()
      const value = m[3] ?? m[4] ?? ''

      if (name === 'style') {
        const s = cleanStyle(value)
        if (s) attrs.push(`style="${s}"`)
      } else if (name === 'href' && tag === 'a') {
        if (/^https?:\/\//i.test(value)) attrs.push(`href="${value.replace(/"/g, '')}" target="_blank" rel="noreferrer noopener"`)
      } else if (name === 'src' && tag === 'img') {
        if (ALLOWED_IMG_HOST.test(value)) attrs.push(`src="${value.replace(/"/g, '')}"`)
      } else if (name === 'alt' && tag === 'img') {
        attrs.push(`alt="${value.replace(/"/g, '')}"`)
      }
    }

    // src 가 걸러진 img 는 껍데기만 남으므로 통째로 버린다
    if (tag === 'img' && !attrs.some(a => a.startsWith('src='))) return ''

    const close = selfClose || tag === 'br' || tag === 'img' ? ' /' : ''
    return `<${tag}${attrs.length ? ' ' + attrs.join(' ') : ''}${close}>`
  })

  return html.trim()
}

/** 목록 미리보기에 쓸 평문. */
export function htmlToText(html: string | null): string {
  if (!html) return ''
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
