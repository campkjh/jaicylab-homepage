import { redirect } from 'next/navigation'

// 식단은 스케줄 달력으로 합쳐졌다. 옛 주소로 들어오면 스케줄로 보낸다.
export default function MealsPage() {
  redirect('/admin/schedule')
}
