import { Fund } from '../domain/fund'
import { FundType } from '../domain/fundType'

export interface IFundRepo {
  getById(id: string): Promise<Fund>
  save(fund: Fund): Promise<void>
  filter(): Promise<Fund[]>
  getListByRecommendedUserId(recommendedUserId: string): Promise<Fund[]>
  getDistributionList(recommendedUserId: string, type: FundType, createAt: number): Promise<TodayByRecommendedUserDto[]>
}

export interface TodayByRecommendedUserDto {
  paymentUserId: string
  totalAmount: number
}
