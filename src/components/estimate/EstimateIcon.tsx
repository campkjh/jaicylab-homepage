/* eslint-disable @next/next/no-img-element */

/**
 * 자가견적용 컬러 아이콘. public/estimate-icons/<name>.svg 를 그대로 띄운다.
 * (토스 컬러 아이콘 세트 — 원본 색을 살려야 해서 currentColor 치환 없이 <img> 로 렌더)
 * 파일이 없으면 조용히 숨긴다.
 */
export function EstimateIcon({ name, className = 'h-6 w-6' }: { name: string; className?: string }) {
  return (
    <img
      src={`/estimate-icons/${name}.svg`}
      alt=""
      aria-hidden
      className={`${className} object-contain`}
      onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden' }}
    />
  )
}
