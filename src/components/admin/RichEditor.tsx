'use client'

import { useEffect, useRef, useState } from 'react'
import { Bold, List } from 'lucide-react'
import { toast } from 'sonner'
import Icon from './Icon'

const COLORS = ['#37352f', '#12b76a', '#2563eb', '#dc2626', '#d97706', '#7c3aed', '#9b9a97']

async function uploadImage(file: File): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('folder', 'event')
  const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
  const json = (await res.json()) as { url?: string; error?: string }
  if (!res.ok || !json.url) throw new Error(json.error ?? '업로드에 실패했습니다.')
  return json.url
}

function ToolbarButton({
  onClick,
  title,
  children,
}: {
  onClick: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      // mousedown 을 막아야 에디터의 선택 영역이 유지된다.
      onMouseDown={e => e.preventDefault()}
      onClick={onClick}
      className="flex size-7 items-center justify-center rounded-md text-ink-soft transition hover:bg-hover hover:text-ink"
    >
      {children}
    </button>
  )
}

export default function RichEditor({
  initialHtml,
  onChange,
  remoteHtml,
  placeholder = '내용을 입력하세요. 이미지도 붙여넣을 수 있습니다.',
  seamless = false,
}: {
  initialHtml: string
  onChange: (html: string) => void
  /** 다른 사람이 저장한 최신 본문. 내가 편집 중이 아닐 때만 반영한다. */
  remoteHtml?: string | null
  placeholder?: string
  /** 노션처럼 테두리 없이 본문에 녹여 쓸 때 */
  seamless?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const focusedRef = useRef(false)
  const [uploading, setUploading] = useState(false)
  const [showColors, setShowColors] = useState(false)

  // 최초 1회만 주입한다. 이후 React 가 innerHTML 을 건드리면 커서가 튄다.
  useEffect(() => {
    if (ref.current && !ref.current.innerHTML) ref.current.innerHTML = initialHtml
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 상대가 저장한 내용은 내가 입력 중이 아닐 때만 덮어쓴다.
  useEffect(() => {
    const el = ref.current
    if (!el || remoteHtml == null || focusedRef.current) return
    if (el.innerHTML !== remoteHtml) el.innerHTML = remoteHtml
  }, [remoteHtml])

  function emit() {
    if (ref.current) onChange(ref.current.innerHTML)
  }

  function exec(command: string, value?: string) {
    ref.current?.focus()
    // 기본값은 <font color> 를 뱉는데 sanitize 화이트리스트에 없어 색이 날아간다.
    // styleWithCSS 를 켜면 <span style="color:…"> 로 나온다.
    if (command === 'foreColor') document.execCommand('styleWithCSS', false, 'true')
    document.execCommand(command, false, value)
    if (command === 'foreColor') document.execCommand('styleWithCSS', false, 'false')
    emit()
  }

  async function insertFiles(files: FileList | File[]) {
    const images = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (!images.length) return
    setUploading(true)
    try {
      for (const file of images) {
        const url = await uploadImage(file)
        ref.current?.focus()
        document.execCommand('insertImage', false, url)
      }
      emit()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '업로드에 실패했습니다.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={seamless ? '' : 'rounded-lg border border-line bg-surface focus-within:border-brand'}>
      <div className={`relative flex items-center gap-0.5 px-1.5 py-1 ${seamless ? 'rounded-lg bg-canvas' : 'border-b border-line'}`}>
        <ToolbarButton title="굵게" onClick={() => exec('bold')}><Bold className="size-4" /></ToolbarButton>
        <ToolbarButton title="기울임" onClick={() => exec('italic')}><Icon name="italic" className="size-4" /></ToolbarButton>
        <ToolbarButton title="밑줄" onClick={() => exec('underline')}><Icon name="underline" className="size-4" /></ToolbarButton>
        <ToolbarButton title="취소선" onClick={() => exec('strikeThrough')}><Icon name="strike" className="size-4" /></ToolbarButton>

        <span className="mx-1 h-4 w-px bg-line" />

        <ToolbarButton title="글자 색" onClick={() => setShowColors(v => !v)}><Icon name="fillColor" className="size-4" /></ToolbarButton>
        {showColors && (
          <div className="absolute top-9 left-24 z-10 flex gap-1.5 rounded-lg border border-line bg-surface p-2 shadow-[0_4px_16px_-4px_rgba(15,15,15,0.2)]">
            {COLORS.map(c => (
              <button
                key={c}
                type="button"
                aria-label={`색상 ${c}`}
                onMouseDown={e => e.preventDefault()}
                onClick={() => {
                  exec('foreColor', c)
                  setShowColors(false)
                }}
                className="size-5 rounded-full ring-1 ring-line"
                style={{ background: c }}
              />
            ))}
          </div>
        )}

        <ToolbarButton title="목록" onClick={() => exec('insertUnorderedList')}><List className="size-4" /></ToolbarButton>

        <span className="mx-1 h-4 w-px bg-line" />

        <ToolbarButton title="이미지 올리기" onClick={() => fileRef.current?.click()}>
          <Icon name={uploading ? 'refresh' : 'picture'} className={`size-4 ${uploading ? 'animate-spin' : ''}`} />
        </ToolbarButton>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={e => {
            if (e.target.files?.length) void insertFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={emit}
        onFocus={() => (focusedRef.current = true)}
        onBlur={() => {
          focusedRef.current = false
          emit()
        }}
        onPaste={e => {
          const files = e.clipboardData.files
          if (files.length) {
            e.preventDefault()
            void insertFiles(files)
          }
        }}
        onDrop={e => {
          if (e.dataTransfer.files.length) {
            e.preventDefault()
            void insertFiles(e.dataTransfer.files)
          }
        }}
        className={`rich-body text-sm leading-relaxed text-ink outline-none ${seamless ? 'min-h-[180px] px-1 py-3' : 'min-h-[140px] px-3 py-2.5'}`}
      />
    </div>
  )
}
