'use client'

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Icon from './Icon'
import { toast } from 'sonner'
import { MEAL_SLOT, type MealEntry, type MealSlot } from '@/lib/types'
import { createMeal, deleteMeal, updateMeal } from '@/app/admin/actions'
import { Button, Field, Input, Textarea } from './ui'

export type MealDayCell = {
  date: string
  day: number
  inMonth: boolean
  isToday: boolean
  holiday: string | null
  isSunday: boolean
  isSaturday: boolean
  meals: MealEntry[]
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']
const SLOT_ORDER: MealSlot[] = ['breakfast', 'lunch', 'dinner', 'snack']

function dayNumberClass(cell: MealDayCell): string {
  if (cell.isToday) return 'bg-brand font-semibold text-white'
  const red = Boolean(cell.holiday) || cell.isSunday
  const tone = red ? 'text-red-600' : cell.isSaturday ? 'text-blue-600' : 'text-ink-soft'
  return cell.inMonth ? tone : `${tone} opacity-40`
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])
  if (!mounted) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-6"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="animate-fade-up max-h-[88dvh] w-full max-w-[460px] overflow-y-auto rounded-2xl border border-line bg-surface p-5 shadow-[0_12px_40px_-12px_rgba(15,15,15,0.25)]">
        {children}
      </div>
    </div>,
    document.body,
  )
}

function MealChip({ meal, onClick }: { meal: MealEntry; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-1 rounded px-1.5 py-0.5 text-left text-[11px] transition hover:brightness-95 ${MEAL_SLOT[meal.slot].chip}`}
    >
      {meal.image_url && <img src={meal.image_url} alt="" className="size-3.5 shrink-0 rounded-sm object-cover" />}
      <span className="min-w-0 flex-1 truncate">{meal.title}</span>
      {meal.kcal && <span className="shrink-0 tabular-nums opacity-70">{meal.kcal}</span>}
    </button>
  )
}

function MealForm({ meal, date, onDone }: { meal: MealEntry | null; date: string; onDone: () => void }) {
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
        <button onClick={onDone} aria-label="닫기" className="text-ink-muted transition hover:text-ink">
          <Icon name="x" className="size-4" />
        </button>
      </div>

      <form
        action={async fd => {
          await (meal ? updateMeal(fd) : createMeal(fd))
          onDone()
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
                onDone()
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

export default function MealCalendar({
  title,
  cells,
  prevYm,
  nextYm,
  todayIso,
  totalKcal,
}: {
  title: string
  cells: MealDayCell[]
  prevYm: string
  nextYm: string
  todayIso: string
  totalKcal: number
}) {
  const [dialog, setDialog] = useState<{ meal: MealEntry | null; date: string } | null>(null)
  const close = () => setDialog(null)
  const thisYm = todayIso.slice(0, 7)

  return (
    <>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-[26px] leading-tight font-semibold tracking-tight text-ink">{title}</h1>
          <div className="flex items-center gap-0.5">
            <Link href={`/admin/meals?ym=${prevYm}`} aria-label="이전 달" className="flex size-7 items-center justify-center rounded-md text-ink-muted transition hover:bg-hover hover:text-ink">
              <Icon name="arrowLeft" className="size-4" />
            </Link>
            <Link href={`/admin/meals?ym=${nextYm}`} aria-label="다음 달" className="flex size-7 items-center justify-center rounded-md text-ink-muted transition hover:bg-hover hover:text-ink">
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
          <Link href={`/admin/meals?ym=${thisYm}`} className="rounded-md border border-line px-2 py-1 text-xs text-ink-soft transition hover:bg-hover">
            오늘
          </Link>
          {totalKcal > 0 && <span className="text-xs text-ink-muted">이번 달 {totalKcal.toLocaleString()} kcal</span>}
        </div>

        <Button onClick={() => setDialog({ meal: null, date: todayIso })}>
          <Icon name="plus" className="size-4" />
          식단 추가
        </Button>
      </header>

      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {SLOT_ORDER.map(s => (
          <span key={s} className="flex items-center gap-1.5 text-xs text-ink-soft">
            <span className={`size-2 rounded-full ${MEAL_SLOT[s].dot}`} />
            {MEAL_SLOT[s].label}
          </span>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="grid grid-cols-7 border-b border-line">
          {WEEKDAYS.map((w, i) => (
            <div key={w} className={`px-3 py-2 text-[11px] font-medium ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-ink-soft'}`}>
              {w}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {cells.map(cell => (
            <div
              key={cell.date}
              className={`group relative min-h-[118px] border-r border-b border-line p-1.5 last:border-r-0 ${cell.inMonth ? '' : 'bg-canvas/60'}`}
            >
              <div className="mb-1 flex items-center gap-1 px-1">
                <span className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] tabular-nums ${dayNumberClass(cell)}`}>
                  {cell.day}
                </span>
                {cell.holiday && cell.inMonth && <span className="min-w-0 truncate text-[10px] text-red-500">{cell.holiday}</span>}
                <span className="flex-1" />
                <button
                  onClick={() => setDialog({ meal: null, date: cell.date })}
                  aria-label={`${cell.date} 식단 추가`}
                  className="text-ink-muted opacity-0 transition group-hover:opacity-100 hover:text-ink"
                >
                  <Icon name="plus" className="size-3.5" />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                {cell.meals.map(m => (
                  <MealChip key={m.id} meal={m} onClick={() => setDialog({ meal: m, date: cell.date })} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-ink-muted">칩을 누르면 수정할 수 있습니다. 사진은 8MB 이하 이미지만 올라갑니다.</p>

      {dialog && (
        <Modal onClose={close}>
          <MealForm key={dialog.meal?.id ?? dialog.date} meal={dialog.meal} date={dialog.date} onDone={close} />
        </Modal>
      )}
    </>
  )
}
