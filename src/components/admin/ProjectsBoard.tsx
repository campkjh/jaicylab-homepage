'use client'

import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import ProgressInput from './ProgressInput'
import { SaveHint } from './ClientsBoard'
import { Button, Field, Input, ProgressBar, Select, StatusBadge, Textarea } from './ui'
import { STATUS_LABEL, type Project, type ProjectNote, type ProjectTask, type ProjectStatus } from '@/lib/types'
import { addNote, addTask, createProject, deleteNote, deleteProject, deleteTask, toggleTask, updateProject } from '@/app/admin/actions'

export type ProjectWithRelations = Project & {
  client_name: string | null
  tasks: ProjectTask[]
  notes: ProjectNote[]
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** 입력을 멈추면 폼 전체를 자동 저장한다. */
function useFormAutosave(action: (fd: FormData) => Promise<void>) {
  const ref = useRef<HTMLFormElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [state, setState] = useState<'idle' | 'saving' | 'saved'>('idle')

  const onInput = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      if (!ref.current) return
      setState('saving')
      await action(new FormData(ref.current))
      setState('saved')
    }, 800)
  }

  return { ref, onInput, state }
}

function ProjectRow({
  project,
  clients,
  open,
  onToggle,
  rootRef,
}: {
  project: ProjectWithRelations
  clients: { id: number; name: string }[]
  open: boolean
  onToggle: () => void
  rootRef?: React.Ref<HTMLLIElement>
}) {
  const info = useFormAutosave(updateProject)
  const openTasks = project.tasks.filter(t => !t.done).length

  return (
    <li ref={rootRef} className="overflow-hidden rounded-xl border border-line bg-surface">
      {/* 헤더: 누르면 펴고 접는다 */}
      <button onClick={onToggle} className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-hover">
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate text-sm font-medium text-ink">{project.name}</span>
            <StatusBadge status={project.status} />
            {openTasks > 0 && <span className="shrink-0 text-xs text-ink-muted">할 일 {openTasks}</span>}
          </span>
          <span className="mt-0.5 block truncate text-xs text-ink-muted">{project.client_name ?? '클라이언트 미지정'}</span>
        </span>
        <span className="hidden w-[150px] shrink-0 items-center gap-2 md:flex">
          <ProgressBar value={project.progress} />
          <span className="w-8 shrink-0 text-right text-xs tabular-nums text-ink-muted">{project.progress}%</span>
        </span>
        <span className="hidden w-[90px] shrink-0 text-right text-xs tabular-nums text-ink-muted sm:block">
          {project.due_date ? `마감 ${project.due_date.slice(5).replace('-', '/')}` : '—'}
        </span>
        <Icon name="arrowRight" className={`size-4 shrink-0 text-ink-muted transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>

      {open && (
        <div className="animate-fade-up flex flex-col gap-7 border-t border-line bg-canvas/30 p-4 sm:p-5">
          {/* 기본 정보 — 자동 저장 */}
          <form ref={info.ref} onInput={info.onInput} className="flex flex-col gap-3">
            <input type="hidden" name="id" value={project.id} />
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-ink-soft">프로젝트 정보</h3>
              <SaveHint state={info.state} />
            </div>

            <Input
              name="name"
              defaultValue={project.name}
              className="!border-transparent !bg-transparent !px-1 -ml-1 text-[20px] font-semibold tracking-tight hover:!border-line focus:!border-brand"
            />

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Field label="클라이언트">
                <Select name="client_id" defaultValue={project.client_id ?? ''}>
                  <option value="">미지정</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Select>
              </Field>
              <Field label="상태">
                <Select name="status" defaultValue={project.status}>
                  {Object.entries(STATUS_LABEL).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </Select>
              </Field>
              <Field label="시작일">
                <Input name="start_date" type="date" defaultValue={project.start_date ?? ''} />
              </Field>
              <Field label="마감일">
                <Input name="due_date" type="date" defaultValue={project.due_date ?? ''} />
              </Field>
            </div>

            <Field label="진척도">
              <ProgressInput defaultValue={project.progress} />
            </Field>

            <Field label="설명">
              <Textarea name="description" rows={2} defaultValue={project.description ?? ''} placeholder="프로젝트 개요, 범위, 참고 링크 등" />
            </Field>

            <span className="text-xs text-ink-muted">최근 수정 {formatDateTime(project.updated_at)}</span>
          </form>

          <div className="grid gap-7 lg:grid-cols-2">
            {/* 할 일 */}
            <section>
              <h3 className="mb-2 text-[13px] font-semibold text-ink-soft">
                할 일 <span className="font-normal text-ink-muted">{openTasks}</span>
              </h3>

              <form action={addTask} className="mb-2 flex flex-wrap gap-2">
                <input type="hidden" name="project_id" value={project.id} />
                <Input name="title" placeholder="할 일을 적고 엔터" className="min-w-[160px] flex-1" />
                <Input name="due_date" type="date" className="w-[140px] shrink-0" />
                <Button type="submit" variant="ghost" className="shrink-0">추가</Button>
              </form>

              {project.tasks.length === 0 ? (
                <p className="py-4 text-center text-xs text-ink-muted">할 일이 없습니다.</p>
              ) : (
                <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
                  {project.tasks.map(t => (
                    <li key={t.id} className="group flex items-center gap-3 px-4 py-2.5">
                      <form action={toggleTask} className="flex shrink-0">
                        <input type="hidden" name="id" value={t.id} />
                        <input type="hidden" name="project_id" value={project.id} />
                        <button type="submit" aria-label={t.done ? '완료 취소' : '완료 처리'} className="transition">
                          {t.done ? (
                            <Icon name="checkCircle" className="size-[18px] text-brand" />
                          ) : (
                            <Icon name="checkCircleLine" className="size-[18px] text-ink-muted hover:text-brand" />
                          )}
                        </button>
                      </form>
                      <span className={`min-w-0 flex-1 truncate text-sm ${t.done ? 'text-ink-muted line-through' : 'text-ink'}`}>
                        {t.title}
                      </span>
                      {t.due_date && <span className="shrink-0 text-xs tabular-nums text-ink-muted">{t.due_date}</span>}
                      <form action={deleteTask} className="flex shrink-0">
                        <input type="hidden" name="id" value={t.id} />
                        <input type="hidden" name="project_id" value={project.id} />
                        <button type="submit" aria-label="삭제" className="text-ink-muted opacity-0 transition group-hover:opacity-100 hover:text-red-600">
                          <Icon name="bin" className="size-4" />
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* 메모 */}
            <section>
              <h3 className="mb-2 text-[13px] font-semibold text-ink-soft">
                메모 <span className="font-normal text-ink-muted">{project.notes.length}</span>
              </h3>

              <form action={addNote} className="mb-2">
                <input type="hidden" name="project_id" value={project.id} />
                <Textarea name="body" rows={2} placeholder="진행 상황, 회의 내용, 결정 사항" />
                <Button type="submit" variant="ghost" className="mt-2">기록하기</Button>
              </form>

              {project.notes.length === 0 ? (
                <p className="py-4 text-center text-xs text-ink-muted">기록된 메모가 없습니다.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {project.notes.map(n => (
                    <li key={n.id} className="group rounded-xl border border-line bg-surface p-3.5">
                      <div className="mb-1 flex items-center justify-between">
                        <time className="text-xs text-ink-muted">{formatDateTime(n.created_at)}</time>
                        <form action={deleteNote}>
                          <input type="hidden" name="id" value={n.id} />
                          <input type="hidden" name="project_id" value={project.id} />
                          <button type="submit" aria-label="삭제" className="text-ink-muted opacity-0 transition group-hover:opacity-100 hover:text-red-600">
                            <Icon name="bin" className="size-3.5" />
                          </button>
                        </form>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-ink">{n.body}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <form action={deleteProject} className="border-t border-line pt-4">
            <input type="hidden" name="id" value={project.id} />
            <button
              type="submit"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-red-200 px-2.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
            >
              <Icon name="bin" className="size-3.5" />
              프로젝트 삭제
            </button>
            <span className="ml-2 text-xs text-ink-muted">할 일과 메모도 함께 삭제됩니다.</span>
          </form>
        </div>
      )}
    </li>
  )
}

export default function ProjectsBoard({
  projects,
  clients,
  defaultOpenId,
}: {
  projects: ProjectWithRelations[]
  clients: { id: number; name: string }[]
  defaultOpenId: number | null
}) {
  const [openId, setOpenId] = useState<number | null>(defaultOpenId)
  const [creating, setCreating] = useState(false)
  const openRef = useRef<HTMLLIElement | null>(null)

  // 달력 등에서 ?open= 으로 들어오면 해당 행이 보이도록 스크롤한다.
  useEffect(() => {
    if (defaultOpenId != null) openRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }, [defaultOpenId])

  return (
    <>
      <header className="mb-6 flex flex-col items-start justify-between gap-3 sm:mb-7 sm:flex-row sm:items-start sm:gap-4">
        <div>
          <h1 className="text-[22px] leading-tight font-semibold tracking-tight text-ink sm:text-[26px]">프로젝트</h1>
          <p className="mt-1 text-sm text-ink-muted">행을 누르면 그 자리에서 펼쳐집니다. 수정하면 자동 저장됩니다.</p>
        </div>
        <button
          onClick={() => setCreating(v => !v)}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-ink px-3 text-sm font-medium text-white transition hover:bg-black"
        >
          <Icon name={creating ? 'x' : 'plus'} className="size-4" />
          새 프로젝트
        </button>
      </header>

      {creating && (
        <form
          action={async fd => {
            await createProject(fd)
            setCreating(false)
          }}
          className="animate-fade-up mb-4 flex flex-wrap items-end gap-2 rounded-xl border border-dashed border-line bg-canvas/50 p-3.5"
        >
          <Field label="프로젝트 이름 *" className="min-w-[220px] flex-1">
            <Input name="name" autoFocus placeholder="예: 펫마일 앱 리뉴얼" />
          </Field>
          <Field label="클라이언트" className="w-[160px]">
            <Select name="client_id" defaultValue="">
              <option value="">미지정</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="마감일" className="w-[150px]">
            <Input name="due_date" type="date" />
          </Field>
          <Button type="submit">추가</Button>
        </form>
      )}

      {projects.length === 0 && !creating ? (
        <div className="rounded-xl border border-dashed border-line py-12 text-center text-sm text-ink-muted">
          아직 프로젝트가 없습니다. 오른쪽 위에서 첫 프로젝트를 만들어 보세요.
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {projects.map(p => (
            <ProjectRow
              key={p.id}
              project={p}
              clients={clients}
              open={openId === p.id}
              onToggle={() => setOpenId(openId === p.id ? null : p.id)}
              rootRef={openId === p.id ? openRef : undefined}
            />
          ))}
        </ul>
      )}
    </>
  )
}
