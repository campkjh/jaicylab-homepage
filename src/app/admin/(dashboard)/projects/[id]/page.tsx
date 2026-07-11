import { redirect } from 'next/navigation'

// 상세 페이지는 아코디언으로 합쳐졌다. 옛 주소는 목록에서 해당 행을 펼쳐 준다.
export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  redirect(`/admin/projects?open=${(await params).id}`)
}
