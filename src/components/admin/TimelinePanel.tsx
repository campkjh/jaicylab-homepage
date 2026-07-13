'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { createPortal } from 'react-dom'
import { EVENT_COLOR, type Timeline, type TimelineStatusDef } from '@/lib/types'
import {
  createTimeline,
  deleteTimeline,
  listArchivedTimelines,
  renameTimeline,
  setTimelineAssignee,
  setTimelineStatus,
  toggleTimeline,
} from '@/app/admin/actions'
import Icon from './Icon'

/** 담당자 태그 칩 색. 서버(createTimeline)와 같은 순서로 돌아간다. */
const TAG_COLORS = ['purple', 'blue', 'green', 'amber', 'red'] as const

function tagColor(admins: string[], name: string | null): (typeof TAG_COLORS)[number] | 'gray' {
  const i = name ? admins.indexOf(name) : -1
  return i === -1 ? 'gray' : TAG_COLORS[i % TAG_COLORS.length]
}

/** 담당자·상태 칩을 고르는 리스트. 추가 폼과 항목 수정 툴팁이 같이 쓴다. */
function TagPicker({
  admins,
  statuses,
  assignee,
  status,
  onAssignee,
  onStatus,
}: {
  admins: string[]
  statuses: TimelineStatusDef[]
  assignee: string | null
  status: string | null
  onAssignee: (name: string | null) => void
  onStatus: (key: string | null) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <div className="mb-1 text-[10px] font-medium text-ink-muted">담당자</div>
        <div className="flex flex-wrap gap-1.5">
          {admins.map(name => {
            const on = assignee === name
            const color = tagColor(admins, name)
            return (
              <button
                key={name}
                onClick={() => onAssignee(on ? null : name)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                  on ? EVENT_COLOR[color].chip : 'border border-line bg-surface text-ink-muted hover:bg-hover'
                }`}
              >
                {name}
              </button>
            )
          })}
        </div>
      </div>
      <div>
        <div className="mb-1 text-[10px] font-medium text-ink-muted">상태</div>
        {statuses.length === 0 ? (
          <p className="text-[11px] text-ink-muted">설정에서 상태 태그를 추가하세요.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {statuses.map(s => {
              const on = status === s.key
              return (
                <button
                  key={s.key}
                  onClick={() => onStatus(on ? null : s.key)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                    on ? EVENT_COLOR[s.color].chip : 'border border-line bg-surface text-ink-muted hover:bg-hover'
                  }`}
                >
                  {s.label}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

/** 완료된 항목을 완료 날짜별로 보여주는 지난 기록. 펼칠 때 서버에서 불러온다. */
function ArchiveSection() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Timeline[] | null>(null)
  const [pending, startTransition] = useTransition()

  const toggle = () => {
    const next = !open
    setOpen(next)
    // 완료/취소가 실시간으로 반영되도록 펼칠 때마다 새로 불러온다.
    if (next) startTransition(async () => setItems(await listArchivedTimelines()))
  }

  return (
    <div className="mt-2 border-t border-line pt-2">
      <button
        onClick={toggle}
        className="flex w-full items-center gap-1 rounded-md px-1 py-1 text-[11px] text-ink-muted transition hover:bg-hover hover:text-ink"
      >
        <Icon name="arrowRight" className={`size-3 transition-transform ${open ? 'rotate-90' : ''}`} />
        지난 기록
        {items && <span className="text-ink-muted">{items.length}</span>}
      </button>

      {open && (
        <ul className="mt-1 flex max-h-[200px] flex-col gap-0.5 overflow-y-auto">
          {pending && items === null && <li className="px-1 py-2 text-[11px] text-ink-muted">불러오는 중…</li>}
          {items?.length === 0 && <li className="px-1 py-2 text-[11px] text-ink-muted">아직 완료한 기록이 없습니다.</li>}
          {items?.map(t => (
            <li key={t.id} className="flex items-center gap-1.5 rounded px-1 py-1 text-[11px] text-ink-soft">
              <span className="shrink-0 tabular-nums text-ink-muted">{t.done_at?.slice(5).replace('-', '/')}</span>
              <span className="min-w-0 flex-1 truncate">{t.title}</span>
              {t.assignee && <span className="shrink-0 text-ink-muted">{t.assignee}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/**
 * 스케줄 우측 패널. + 를 누르고 할 일을 적은 뒤 태그를 골라 붙인다.
 * 제목을 누르면 바로 고쳐 쓸 수 있고, 항목의 태그를 누르면 툴팁이 떠서 담당자·상태를 바꿀 수 있다.
 * 완료 태그가 붙은 항목은 다음 날 지난 기록으로 넘어간다.
 */
export default function TimelinePanel({
  timelines,
  admins,
  statuses,
  onChanged,
}: {
  timelines: Timeline[]
  admins: string[]
  statuses: TimelineStatusDef[]
  onChanged: (list: Timeline[]) => void
}) {
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [assignee, setAssignee] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [tagsOpen, setTagsOpen] = useState(false)
  /** 제목 인라인 수정 중인 항목 id 와 입력값 */
  const [editingTitle, setEditingTitle] = useState<{ id: number; value: string } | null>(null)
  /** 태그 수정 툴팁: 열린 항목 id 와 붙일 위치(뷰포트 기준) */
  const [editing, setEditing] = useState<{ id: number; top: number; left: number; width: number; flip: boolean } | null>(null)
  const [pending, startTransition] = useTransition()
  const listRef = useRef<HTMLUListElement>(null)

  // 툴팁 바깥을 누르면 닫는다. 스크롤하면 위치가 어긋나므로 같이 닫는다.
  useEffect(() => {
    if (!editing) return
    const onDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-tag-popover], [data-tag-trigger]')) setEditing(null)
    }
    const onScroll = (e: Event) => {
      if ((e.target as HTMLElement).closest?.('[data-tag-popover]')) return
      setEditing(null)
    }
    document.addEventListener('mousedown', onDown)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [editing])

  /** 스크롤 영역에 잘리지 않도록 body 로 포털해서 li 아래(공간 없으면 위)에 띄운다. */
  const openTagEditor = (id: number, trigger: HTMLElement) => {
    if (editing?.id === id) {
      setEditing(null)
      return
    }
    const li = trigger.closest('li')
    const r = (li ?? trigger).getBoundingClientRect()
    const flip = r.bottom + 190 > window.innerHeight
    setEditing({ id, top: flip ? r.top : r.bottom, left: r.left, width: r.width, flip })
  }

  const submit = () => {
    if (!title.trim()) return
    startTransition(async () => {
      const list = await createTimeline(title, assignee, status)
      setTitle('')
      setStatus(null)
      setTagsOpen(false)
      setAdding(false)
      onChanged(list)
    })
  }

  const saveTitle = () => {
    const e = editingTitle
    setEditingTitle(null)
    if (!e) return
    const t = timelines.find(x => x.id === e.id)
    if (!t || !e.value.trim() || e.value.trim() === t.title) return
    startTransition(async () => onChanged(await renameTimeline(e.id, e.value)))
  }

  return (
    <div className="flex min-h-0 flex-col">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[13px] font-semibold text-ink">타임라인</h2>
        <button
          onClick={() => setAdding(v => !v)}
          aria-label="할 일 추가"
          className={`flex size-6 items-center justify-center rounded-md transition hover:bg-hover ${adding ? 'bg-hover text-ink' : 'text-ink-muted hover:text-ink'}`}
        >
          <Icon name="plus" className="size-4" />
        </button>
      </div>

      {adding && (
        <div className="animate-fade-up mb-3 flex flex-col gap-2.5 rounded-xl border border-line bg-surface p-3">
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="어떤 일을 하나요?"
            className="w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-brand"
          />
          {/* 태그 선택: 누르면 리스트가 펼쳐지고, 고른 태그가 버튼에 표시된다 */}
          <button
            onClick={() => setTagsOpen(v => !v)}
            className={`flex flex-wrap items-center gap-1.5 rounded-lg border px-2 py-1.5 text-left text-xs transition hover:bg-hover ${tagsOpen ? 'border-brand' : 'border-line'}`}
          >
            {assignee || status ? (
              <>
                {assignee && (
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${EVENT_COLOR[tagColor(admins, assignee)].chip}`}>
                    {assignee}
                  </span>
                )}
                {status && (() => {
                  const s = statuses.find(x => x.key === status)
                  return s ? (
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${EVENT_COLOR[s.color].chip}`}>
                      {s.label}
                    </span>
                  ) : null
                })()}
              </>
            ) : (
              <span className="text-ink-muted">태그 선택</span>
            )}
            <Icon name="arrowRight" className={`ml-auto size-3 shrink-0 text-ink-muted transition-transform ${tagsOpen ? 'rotate-90' : ''}`} />
          </button>

          {tagsOpen && (
            <div className="animate-fade-up rounded-lg border border-line bg-canvas/50 p-2.5">
              <TagPicker admins={admins} statuses={statuses} assignee={assignee} status={status} onAssignee={setAssignee} onStatus={setStatus} />
            </div>
          )}

          <button
            onClick={submit}
            disabled={pending || !title.trim()}
            className="inline-flex h-8 items-center justify-center rounded-lg bg-ink text-xs font-medium text-white transition hover:bg-black disabled:opacity-50"
          >
            추가
          </button>
        </div>
      )}

      {timelines.length === 0 && !adding && (
        <p className="rounded-xl border border-dashed border-line px-3 py-6 text-center text-xs leading-relaxed text-ink-muted">
          + 를 누르고 할 일을 적은 뒤
          <br />
          담당자·상태 태그를 붙이세요.
        </p>
      )}

      <ul ref={listRef} className="flex min-h-0 flex-col gap-1 overflow-y-auto">
        {timelines.map(t => (
          <li
            key={t.id}
            className={`group relative rounded-lg border border-line bg-surface px-2.5 py-2 transition hover:border-ink-muted/40 ${t.status_is_done ? 'opacity-55' : ''}`}
          >
            <div className="flex items-start gap-1.5">
              {editingTitle?.id === t.id ? (
                <input
                  autoFocus
                  value={editingTitle.value}
                  onChange={e => setEditingTitle({ id: t.id, value: e.target.value })}
                  onKeyDown={e => {
                    if (e.key === 'Enter') saveTitle()
                    if (e.key === 'Escape') setEditingTitle(null)
                  }}
                  onBlur={saveTitle}
                  className="min-w-0 flex-1 rounded border border-brand bg-surface px-1.5 py-0.5 text-xs font-medium text-ink outline-none"
                />
              ) : (
                <button
                  onClick={() => setEditingTitle({ id: t.id, value: t.title })}
                  title="제목 수정"
                  className={`min-w-0 flex-1 text-left text-xs font-medium break-keep text-ink transition hover:text-brand ${t.status_is_done ? 'line-through' : ''}`}
                >
                  {t.title}
                </button>
              )}
              <button
                onClick={() => startTransition(async () => onChanged(await toggleTimeline(t.id)))}
                aria-label={t.status_is_done ? '완료 취소' : '완료 처리'}
                className="shrink-0 text-ink-muted opacity-0 transition group-hover:opacity-100 hover:text-brand"
              >
                <Icon name={t.status_is_done ? 'checkCircle' : 'checkCircleLine'} className="size-3.5" />
              </button>
              <button
                onClick={() => startTransition(async () => onChanged(await deleteTimeline(t.id)))}
                aria-label="삭제"
                className="shrink-0 text-ink-muted opacity-0 transition group-hover:opacity-100 hover:text-red-600"
              >
                <Icon name="bin" className="size-3.5" />
              </button>
            </div>

            {/* 태그 줄: 누르면 수정 툴팁이 뜬다. 이름(담당자)이 항상 왼쪽 */}
            <button
              data-tag-trigger
              onClick={e => openTagEditor(t.id, e.currentTarget)}
              title="태그 수정"
              className="mt-1.5 flex flex-wrap items-center gap-1"
            >
              {t.assignee && (
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${EVENT_COLOR[t.color]?.chip ?? EVENT_COLOR.gray.chip}`}>
                  {t.assignee}
                </span>
              )}
              {t.status_label && (
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${EVENT_COLOR[t.status_color ?? 'gray'].chip}`}>
                  {t.status_label}
                </span>
              )}
              {!t.assignee && !t.status_label && (
                <span className="rounded-full border border-dashed border-line px-2 py-0.5 text-[11px] text-ink-muted opacity-0 transition group-hover:opacity-100">
                  + 태그
                </span>
              )}
              {t.status_is_done && t.done_at && (
                <span className="text-[10px] text-ink-muted">내일 기록으로 이동</span>
              )}
            </button>

          </li>
        ))}
      </ul>

      <ArchiveSection />

      {/* 태그 수정 툴팁: 패널 스크롤 영역에 잘리지 않도록 body 로 포털 */}
      {editing &&
        (() => {
          const t = timelines.find(x => x.id === editing.id)
          if (!t) return null
          return createPortal(
            <div
              data-tag-popover
              style={{
                position: 'fixed',
                top: editing.top,
                left: editing.left,
                width: editing.width,
                zIndex: 70,
                transform: editing.flip ? 'translateY(calc(-100% - 4px))' : 'translateY(4px)',
              }}
              className="animate-fade-up rounded-xl border border-line bg-surface p-2.5 shadow-[0_8px_24px_-8px_rgba(15,15,15,0.35)]"
            >
              <TagPicker
                admins={admins}
                statuses={statuses}
                assignee={t.assignee}
                status={t.status}
                onAssignee={name => startTransition(async () => onChanged(await setTimelineAssignee(t.id, name)))}
                onStatus={key => startTransition(async () => onChanged(await setTimelineStatus(t.id, key)))}
              />
            </div>,
            document.body,
          )
        })()}
    </div>
  )
}
