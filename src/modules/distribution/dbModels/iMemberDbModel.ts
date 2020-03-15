import { FundType } from '../../funds/domain/fundType'

export interface IMemberDbModel {
  _id: string
  inviteMemberId?: string
  createAt: number
  inviteToken?: string
  distributionRelationList: DistributionRelationDbModel[]
}

interface DistributionRelationDbModel {
  memberId: string
  distributionRate: number
  fundType: FundType
}
