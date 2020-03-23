import { FundType } from '../../funds/domain/fundType'

export interface IRecommendedUserDbModel {
  _id: string
  inviteRecommendedUserId?: string
  createAt: number
  inviteToken?: string
  distributionRelationList: DistributionRelationDbModel[]
}

interface DistributionRelationDbModel {
  recommendedUserId: string
  distributionRate: number
  fundType: FundType
}
