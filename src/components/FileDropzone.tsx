'use client'

import { useState, useRef, type DragEvent, type ChangeEvent } from 'react'
import { Upload, X, File as FileIcon, Image as ImageIcon, FileText, FileArchive } from 'lucide-react'

type Theme = 'dark' | 'light'

type Props = {
  files: File[]
  onChange: (files: File[]) => void
  theme?: Theme
  maxFiles?: number
  maxSizeMB?: number
  accept?: string
}

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`
}

function iconFor(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'heic'].includes(ext)) return <ImageIcon className="h-4 w-4" />
  if (['pdf', 'doc', 'docx', 'hwp', 'txt', 'md'].includes(ext)) return <FileText className="h-4 w-4" />
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return <FileArchive className="h-4 w-4" />
  return <FileIcon className="h-4 w-4" />
}

export function FileDropzone({
  files, onChange,
  theme = 'dark',
  maxFiles = 5,
  maxSizeMB = 20,
  accept,
}: Props) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function validate(list: FileList | File[]) {
    const arr = Array.from(list)
    const all = [...files, ...arr]
    if (all.length > maxFiles) {
      setError(`최대 ${maxFiles}개까지 첨부할 수 있습니다.`)
      return null
    }
    const oversized = arr.find(f => f.size > maxSizeMB * 1024 * 1024)
    if (oversized) {
      setError(`파일 하나당 ${maxSizeMB}MB를 넘을 수 없습니다. (${oversized.name})`)
      return null
    }
    setError('')
    return all
  }

  function handleFiles(list: FileList | File[] | null) {
    if (!list) return
    const next = validate(list)
    if (next) onChange(next)
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault(); e.stopPropagation()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }
  function onDragOver(e: DragEvent<HTMLDivElement>) { e.preventDefault(); e.stopPropagation(); setDragging(true) }
  function onDragLeave(e: DragEvent<HTMLDivElement>) { e.preventDefault(); e.stopPropagation(); setDragging(false) }
  function onInput(e: ChangeEvent<HTMLInputElement>) {
    handleFiles(e.target.files)
    if (inputRef.current) inputRef.current.value = ''
  }
  function remove(i: number) { onChange(files.filter((_, k) => k !== i)) }

  const isDark = theme === 'dark'
  const zoneBase = isDark
    ? 'border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]'
    : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
  const zoneActive = isDark
    ? 'border-[#2979FF]/60 bg-[#2979FF]/10'
    : 'border-[#2979FF] bg-[#2979FF]/5'
  const textMain  = isDark ? 'text-white/70' : 'text-slate-700'
  const textMuted = isDark ? 'text-white/40' : 'text-slate-500'
  const itemBg   = isDark ? 'bg-white/[0.04] border-white/8' : 'bg-white border-slate-200'
  const itemText = isDark ? 'text-white/80' : 'text-slate-800'
  const itemSub  = isDark ? 'text-white/40' : 'text-slate-400'
  const iconWrap = isDark ? 'bg-white/10 text-white/70' : 'bg-slate-100 text-slate-600'

  return (
    <div>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
        className={`cursor-pointer select-none rounded-xl border-2 border-dashed px-4 py-8 text-center transition-all ${dragging ? zoneActive : zoneBase}`}
      >
        <div className="mx-auto flex max-w-xs flex-col items-center gap-2">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
            <Upload className={`h-4 w-4 ${dragging ? 'text-[#2979FF]' : textMain}`} />
          </div>
          <p className={`text-[13px] font-semibold ${textMain}`}>
            {dragging ? '여기에 놓으세요' : '드래그 앤 드롭 또는 클릭해서 첨부'}
          </p>
          <p className={`text-[11px] ${textMuted}`}>
            참고 기획서 · 레퍼런스 스크린샷 등 · 최대 {maxFiles}개 · 개당 {maxSizeMB}MB
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          onChange={onInput}
          className="hidden"
        />
      </div>

      {error && (
        <p className="mt-2 text-[12px] text-red-400">{error}</p>
      )}

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((f, i) => (
            <li
              key={i}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2 transition-all ${itemBg}`}
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${iconWrap}`}>
                {iconFor(f.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className={`truncate text-[13px] font-medium ${itemText}`}>{f.name}</p>
                <p className={`text-[11px] ${itemSub}`}>{fmtSize(f.size)}</p>
              </div>
              <button
                type="button"
                aria-label="삭제"
                onClick={e => { e.stopPropagation(); remove(i) }}
                className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${isDark ? 'text-white/50 hover:bg-white/10 hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
