'use client'

/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from 'react'
import Icon from './Icon'
import { toast } from 'sonner'
import { MEAL_SLOT, type MealEntry, type MealSlot } from '@/lib/types'
import { createMeal, deleteMeal, updateMeal } from '@/app/admin/actions'
import { Button, Field, Input, Textarea } from './ui'

const SLOT_ORDER: MealSlot[] = ['breakfast', 'lunch', 'dinner', 'snack']

/** 스케줄 달력 안에서 쓰는 식단 폼. 저장·삭제 후 다시 그릴 날짜들을 onDone 으로 돌려준다. */
export default function MealForm({
  meal,
  date,
  onDone,
}: {
  meal: MealEntry | null
  date: string
  onDone: (dates?: string[]) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [slot, setSlot] = useState<MealSlot>(meal?.slot ?? 'lunch')
  const [imageUrl, setImageUrl] = useState(meal?.image_url ?? '')
  const [uploading, setUploading] = useState(false)

  async function upload(file: File) {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'event')
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const json = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || !json.url) throw new Error(json.error ?? '업로드에 실패했습니다.')
      setImageUrl(json.url)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '업로드에 실패했습니다.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">{meal ? '식단 수정' : '식단 추가'}</h3>
        <button onClick={() => onDone()} aria-label="닫기" className="text-ink-muted transition hover:text-ink">
          <Icon name="x" className="size-4" />
        </button>
      </div>

      <form
        action={async fd => {
          await (meal ? updateMeal(fd) : createMeal(fd))
          onDone([String(fd.get('meal_date') ?? ''), meal?.meal_date ?? ''])
        }}
        className="flex flex-col gap-3"
      >
        {meal && <input type="hidden" name="id" value={meal.id} />}
        <input type="hidden" name="slot" value={slot} />
        <input type="hidden" name="image_url" value={imageUrl} />

        <Field label="때">
          <div className="flex gap-1.5">
            {SLOT_ORDER.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setSlot(s)}
                className={`flex-1 rounded-lg border py-1.5 text-xs transition ${
                  slot === s ? 'border-brand bg-brand-soft font-medium text-emerald-700' : 'border-line text-ink-soft hover:bg-hover'
                }`}
              >
                {MEAL_SLOT[s].label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="메뉴">
          <Input name="title" autoFocus required defaultValue={meal?.title ?? ''} placeholder="예: 닭가슴살 샐러드" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="날짜">
            <Input name="meal_date" type="date" required defaultValue={meal?.meal_date ?? date} />
          </Field>
          <Field label="칼로리 (kcal)">
            <Input name="kcal" type="number" min={0} defaultValue={meal?.kcal ?? ''} placeholder="선택" />
          </Field>
        </div>

        <Field label="사진">
          {imageUrl ? (
            <div className="relative">
              <img src={imageUrl} alt="" className="h-40 w-full rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => setImageUrl('')}
                aria-label="사진 지우기"
                className="absolute top-2 right-2 rounded-md bg-black/50 p-1.5 text-white transition hover:bg-black/70"
              >
                <Icon name="bin" className="size-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex h-24 w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-line text-xs text-ink-muted transition hover:bg-hover"
            >
              <Icon name={uploading ? 'refresh' : 'picture'} className={`size-5 ${uploading ? 'animate-spin' : ''}`} />
              사진 올리기
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={e => {
              const f = e.target.files?.[0]
              if (f) void upload(f)
              e.target.value = ''
            }}
          />
        </Field>

        <Field label="메모">
          <Textarea name="memo" rows={2} defaultValue={meal?.memo ?? ''} placeholder="재료, 느낌 등" />
        </Field>

        <div className="mt-1 flex items-center gap-2">
          <Button type="submit" disabled={uploading}>{meal ? '저장' : '추가'}</Button>
          {meal && (
            <button
              type="submit"
              formAction={async fd => {
                await deleteMeal(fd)
                onDone([meal.meal_date])
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 px-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <Icon name="bin" className="size-4" />
              삭제
            </button>
          )}
        </div>
      </form>
    </>
  )
}
