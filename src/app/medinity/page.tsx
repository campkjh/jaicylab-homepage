import { MEDINITY_SECTIONS } from '@/data/medinity'
import MedinityQuoteBuilder from '@/components/medinity/MedinityQuoteBuilder'

export const dynamic = 'force-dynamic'

export default function MedinityPage() {
  return <MedinityQuoteBuilder sections={MEDINITY_SECTIONS} />
}
