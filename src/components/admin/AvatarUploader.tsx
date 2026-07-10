'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { updateAvatar, updatePosition } from '@/app/admin/actions'
import Avatar from './Avatar'
import Icon from './Icon'
import { Button, Input } from './ui'

export default function AvatarUploader({
  name,
  initialUrl,
  initialPosition,
}: {
  name: string
  initialUrl: string | null
  initialPosition: string | null
}) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [url, setUrl] = useState(initialUrl)
  const [uploading, setUploading] = useState(false)
  const [pending, startTransition] = useTransition()

  async function onPick(file: File) {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'avatar')
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const json = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || !json.url) throw new Error(json.error ?? '업로드에 실패했습니다.')

      setUrl(json.url)
      startTransition(async () => {
        await updateAvatar(json.url!)
        router.refresh()
        toast.success('프로필 사진을 바꿨습니다.')
      })
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '업로드에 실패했습니다.')
    } finally {
      setUploading(false)
    }
  }

  function onRemove() {
    setUrl(null)
    startTransition(async () => {
      await updateAvatar(null)
      router.refresh()
      toast.success('프로필 사진을 지웠습니다.')
    })
  }

  const busy = uploading || pending

  return (
    <div className="flex flex-wrap items-center gap-5 rounded-xl border border-line bg-surface p-5">
      <Avatar name={name} url={url} size="lg" />

      <div className="min-w-0">
        <div className="text-sm font-medium text-ink">{name}</div>
        <p className="mt-0.5 mb-3 text-xs text-ink-muted">JPG · PNG · WebP, 8MB 이하</p>

        <div className="flex gap-2">
          <Button type="button" variant="ghost" disabled={busy} onClick={() => fileRef.current?.click()}>
            <Icon name={busy ? 'refresh' : 'download'} className={`size-4 ${busy ? 'animate-spin' : 'rotate-180'}`} />
            사진 올리기
          </Button>
          {url && (
            <Button type="button" variant="danger" disabled={busy} onClick={onRemove}>
              <Icon name="bin" className="size-4" />
              지우기
            </Button>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={e => {
            const f = e.target.files?.[0]
            if (f) void onPick(f)
            e.target.value = ''
          }}
        />
      </div>

      <form action={updatePosition} className="ml-auto flex items-end gap-2">
        <label className="flex flex-col gap-1.5">
          <span className="flex items-center gap-1.5 text-xs font-medium text-ink-soft">
            <Icon name="medal" className="size-3.5" />
            직급
          </span>
          <Input name="position" defaultValue={initialPosition ?? ''} placeholder="예: 대표, 디자인 리드" className="w-[200px]" />
        </label>
        <Button type="submit" variant="ghost">저장</Button>
      </form>
    </div>
  )
}
