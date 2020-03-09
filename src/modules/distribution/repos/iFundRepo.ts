import { Fund } from '../domain/fund'
import { MemberId } from '../domain/memberId'
import { FundType } from '../domain/fundType'

export interface IFundRepo {
  getById(id: string): Promise<Fund>
  save(fund: Fund): Promise<void>
  filter(): Promise<Fund[]>
  getTodayByMemberList(incomeMemberId: MemberId, memberList: MemberId[], type: FundType): Promise<TodayByMemberDto[]>
}

export interface TodayByMemberDto {
  paymentMemberId: string
  totalAmount: number
}
