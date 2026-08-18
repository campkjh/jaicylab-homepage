import { MEDINITY_SECTIONS } from '@/data/medinity'
import MedinityQuoteBuilder from '@/components/medinity/MedinityQuoteBuilder'
import { currentAdmin, isRestrictedAdmin } from '@/lib/session'

export const dynamic = 'force-dynamic'

export default async function MedinityPage() {
  // 제한 계정(메디니티)은 홈페이지 미리보기 버튼을 숨긴다. (라우트는 별도로 차단됨)
  const canPreview = !isRestrictedAdmin(await currentAdmin())
  return <MedinityQuoteBuilder sections={MEDINITY_SECTIONS} canPreview={canPreview} />
}
