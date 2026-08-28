'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/session'
import { ensureSchema, sql } from '@/lib/db'
import type { ContractSpecialTerm, ContractPaymentStage, ContractRole } from '@/lib/types'

export type ContractInput = {
  id?: number
  client_id: number | null
  kind: string
  payment_type: string
  payment_schedule: ContractPaymentStage[]
  manmonth_rate: number
  roles: ContractRole[]
  tech_stack: string[]
  title: string
  gap_company: string
  gap_address: string
  gap_biz_no: string
  gap_phone: string
  gap_ceo: string
  dev_amount: number
  deposit: string
  deposit_type: string
  payment_terms: string
  penalty_rate: string
  period: string
  warranty: string
  account: string
  contract_date: string | null
  special_terms: ContractSpecialTerm[]
  status: string
}

export async function saveContract(input: ContractInput): Promise<number> {
  await requireAdmin()
  await ensureSchema()
  const st = JSON.stringify(Array.isArray(input.special_terms) ? input.special_terms : [])
  const sched = JSON.stringify(Array.isArray(input.payment_schedule) ? input.payment_schedule : [])
  const roles = JSON.stringify(Array.isArray(input.roles) ? input.roles : [])
  const tech = JSON.stringify(Array.isArray(input.tech_stack) ? input.tech_stack : [])
  const date = input.contract_date && input.contract_date.trim() ? input.contract_date : null

  if (input.id) {
    await sql`
      UPDATE contracts SET
        client_id = ${input.client_id}, title = ${input.title},
        kind = ${input.kind}, payment_type = ${input.payment_type}, payment_schedule = ${sched}::jsonb,
        manmonth_rate = ${input.manmonth_rate}, roles = ${roles}::jsonb, tech_stack = ${tech}::jsonb,
        gap_company = ${input.gap_company}, gap_address = ${input.gap_address}, gap_biz_no = ${input.gap_biz_no},
        gap_phone = ${input.gap_phone}, gap_ceo = ${input.gap_ceo},
        dev_amount = ${input.dev_amount},
        deposit = ${input.deposit}, deposit_type = ${input.deposit_type},
        payment_terms = ${input.payment_terms}, penalty_rate = ${input.penalty_rate},
        period = ${input.period}, warranty = ${input.warranty}, account = ${input.account},
        contract_date = ${date}, special_terms = ${st}::jsonb, status = ${input.status}, updated_at = now()
      WHERE id = ${input.id}
    `
    revalidatePath('/admin/contracts')
    revalidatePath(`/admin/contracts/${input.id}`)
    return input.id
  }

  const rows = (await sql`
    INSERT INTO contracts
      (client_id, kind, payment_type, payment_schedule, manmonth_rate, roles, tech_stack, title, gap_company, gap_address, gap_biz_no, gap_phone, gap_ceo, dev_amount,
       deposit, deposit_type, payment_terms, penalty_rate, period, warranty, account, contract_date, special_terms, status)
    VALUES
      (${input.client_id}, ${input.kind}, ${input.payment_type}, ${sched}::jsonb, ${input.manmonth_rate}, ${roles}::jsonb, ${tech}::jsonb, ${input.title}, ${input.gap_company}, ${input.gap_address}, ${input.gap_biz_no},
       ${input.gap_phone}, ${input.gap_ceo}, ${input.dev_amount},
       ${input.deposit}, ${input.deposit_type}, ${input.payment_terms}, ${input.penalty_rate},
       ${input.period}, ${input.warranty}, ${input.account}, ${date}, ${st}::jsonb, ${input.status})
    RETURNING id
  `) as { id: number }[]
  revalidatePath('/admin/contracts')
  return rows[0].id
}

export async function deleteContract(id: number): Promise<void> {
  await requireAdmin()
  await ensureSchema()
  await sql`DELETE FROM contracts WHERE id = ${id}`
  revalidatePath('/admin/contracts')
}
