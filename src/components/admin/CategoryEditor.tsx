'use client'

import { useState } from 'react'
import Icon from './Icon'
import { EVENT_COLOR, type EventCategory, type EventColor } from '@/lib/types'
import { createCategory, deleteCategory, updateCategory } from '@/app/admin/actions'
import { Button, Input } from './ui'

const COLORS = Object.keys(EVENT_COLOR) as EventColor[]

function ColorDots({ value, onChange }: { value: EventColor; onChange: (c: EventColor) => void }) {
  return (
    <div className="flex shrink-0 gap-1.5">
      {COLORS.map(c => (
        <button
          key={c}
          type="button"
          aria-label={EVENT_COLOR[c].label}
          aria-pressed={value === c}
          onClick={() => onChange(c)}
          className={`size-5 rounded-full transition ${EVENT_COLOR[c].dot} ${
            value === c ? 'ring-2 ring-ink ring-offset-2' : 'opacity-60 hover:opacity-100'
          }`}
        />
      ))}
    </div>
  )
}

function CategoryRow({ category, usage }: { category: EventCategory; usage: number }) {
  const [color, setColor] = useState<EventColor>(category.color)

  return (
    <li className="group flex items-center gap-3 px-4 py-2.5">
      <form action={updateCategory} className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-2">
        <input type="hidden" name="id" value={category.id} />
        <input type="hidden" name="color" value={color} />
        <span className={`size-2.5 shrink-0 rounded-full ${EVENT_COLOR[color].dot}`} />
        <Input name="name" defaultValue={category.name} className="min-w-[140px] max-w-[220px] flex-1" />
        <ColorDots value={color} onChange={setColor} />
        <Button type="submit" variant="ghost" className="shrink-0">저장</Button>
      </form>

      <span className="w-14 shrink-0 text-right text-xs text-ink-muted">{usage}건</span>

      <form action={deleteCategory} className="flex shrink-0">
        <input type="hidden" name="id" value={category.id} />
        <button
          type="submit"
          aria-label={`${category.name} 삭제`}
          className="text-ink-muted opacity-0 transition group-hover:opacity-100 hover:text-red-600"
        >
          <Icon name="bin" className="size-4" />
        </button>
      </form>
    </li>
  )
}

function NewCategoryForm() {
  const [color, setColor] = useState<EventColor>('blue')

  return (
    <form action={createCategory} className="flex flex-wrap items-center gap-3 border-t border-line px-4 py-3">
      <input type="hidden" name="color" value={color} />
      <span className={`size-2.5 shrink-0 rounded-full ${EVENT_COLOR[color].dot}`} />
      <Input name="name" required placeholder="새 카테고리 이름" className="min-w-[140px] max-w-[220px] flex-1" />
      <ColorDots value={color} onChange={setColor} />
      <Button type="submit" className="shrink-0">
        <Icon name="plus" className="size-4" />
        추가
      </Button>
    </form>
  )
}

export default function CategoryEditor({
  categories,
  usage,
}: {
  categories: EventCategory[]
  usage: Record<number, number>
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <ul className="divide-y divide-line">
        {categories.map(c => (
          <CategoryRow key={c.id} category={c} usage={usage[c.id] ?? 0} />
        ))}
      </ul>
      <NewCategoryForm />
    </div>
  )
}
