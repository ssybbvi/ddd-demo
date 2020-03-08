import { FundStatus } from '../../../domain/fundStatus'
import { FundType } from '../../../domain/fundType'

export interface CreateFundDto {
  amount: number
  status: FundStatus
  incomeMemberId: string
  paymentMemberId: string
  descrpiton: string
  type: FundType
  relationId: string
}
