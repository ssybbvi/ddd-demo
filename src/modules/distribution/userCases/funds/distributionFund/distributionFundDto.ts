import { FundType } from '../../../domain/fundType'

export interface DistributionFundDto {
  memberId: string
  amount: number
  fundType: FundType
  relationId: string
  distributionRelationList: DistributionRelationDto[]
}

export interface DistributionRelationDto {
  memberId: string
  distributionRate: number
  fundType: FundType
}
