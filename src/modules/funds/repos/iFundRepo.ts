import { Fund } from '../domain/fund'
import { FundType } from '../domain/fundType'

export interface IFundRepo {
  getById(id: string): Promise<Fund>
  save(fund: Fund): Promise<void>
  filter(): Promise<Fund[]>
  getListByMemberId(memberId: string): Promise<Fund[]>
  getDistributionList(memberId: string, type: FundType, createAt: number): Promise<TodayByMemberDto[]>
}

export interface TodayByMemberDto {
  paymentMemberId: string
  totalAmount: number
}
