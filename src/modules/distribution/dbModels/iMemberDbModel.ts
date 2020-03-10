import { FundType } from '../domain/fundType'

export interface IMemberDbModel {
  _id: string
  inviteMemberId?: string
  createAt: number
  inviteToken: string
  amount: number
  distributionRelationList: DistributionRelationDbModel[]
}

interface DistributionRelationDbModel {
  memberId: string
  distributionRate: number
  fundType: FundType
}
