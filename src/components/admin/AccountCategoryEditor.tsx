'use client'

import Icon from './Icon'
import { type AccountCategory } from '@/lib/types'
import {
  createAccountCategory,
  deleteAccountCategory,
  moveAccountCategory,
  updateAccountCategory,
} from '@/app/admin/actions'
import { Button, Input } from './ui'

function CategoryRow({ category, usage, first, last }: { category: AccountCategory; usage: number; first: boolean; last: boolean }) {
  return (
    <li className="group flex items-center gap-2 px-4 py-2.5">
      <div className="flex shrink-0 flex-col">
        <form action={moveAccountCategory}>
          <input type="hidden" name="id" value={category.id} />
          <input type="hidden" name="dir" value="up" />
          <button
            type="submit"
            disabled={first}
            aria-label="위로"
            className="flex size-4 items-center justify-center text-ink-muted transition hover:text-ink disabled:opacity-20"
          >
            <Icon name="arrowRight" className="size-3 -rotate-90" />
          </button>
        </form>
        <form action={moveAccountCategory}>
          <input type="hidden" name="id" value={category.id} />
          <input type="hidden" name="dir" value="down" />
          <button
            type="submit"
            disabled={last}
            aria-label="아래로"
            className="flex size-4 items-center justify-center text-ink-muted transition hover:text-ink disabled:opacity-20"
          >
            <Icon name="arrowRight" className="size-3 rotate-90" />
          </button>
        </form>
      </div>

      <form action={updateAccountCategory} className="flex min-w-0 flex-1 items-center gap-3">
        <input type="hidden" name="id" value={category.id} />
        <Input name="label" defaultValue={category.label} className="min-w-[140px] max-w-[240px] flex-1" />
        <Button type="submit" variant="ghost" className="shrink-0">저장</Button>
      </form>

      <span className="w-14 shrink-0 text-right text-xs text-ink-muted">{usage}개</span>

      <form action={deleteAccountCategory} className="flex shrink-0">
        <input type="hidden" name="id" value={category.id} />
        <button
          type="submit"
          aria-label={`${category.label} 삭제`}
          className="text-ink-muted opacity-0 transition group-hover:opacity-100 hover:text-red-600"
        >
          <Icon name="bin" className="size-4" />
        </button>
      </form>
    </li>
  )
}

function NewCategoryForm() {
  return (
    <form action={createAccountCategory} className="flex flex-wrap items-center gap-3 border-t border-line px-4 py-3">
      <Input name="label" required placeholder="새 계정 종류 이름 (예: 카카오계정)" className="min-w-[160px] max-w-[280px] flex-1" />
      <Button type="submit" className="shrink-0">
        <Icon name="plus" className="size-4" />
        추가
      </Button>
    </form>
  )
}

export default function AccountCategoryEditor({
  categories,
  usage,
}: {
  categories: AccountCategory[]
  usage: Record<string, number>
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <ul className="divide-y divide-line">
        {categories.map((c, i) => (
          <CategoryRow
            key={c.id}
            category={c}
            usage={usage[c.key] ?? 0}
            first={i === 0}
            last={i === categories.length - 1}
          />
        ))}
      </ul>
      <NewCategoryForm />
    </div>
  )
}
