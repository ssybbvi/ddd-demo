export interface MemberDTO {
  _id: string
  inviteMemberId?: string
  createAt: number
  inviteToken: string
  amount: number
  distributionRelationList: DistributionRelationDTO[]
}

interface DistributionRelationDTO {
  memberId: string
  distributionRate: number
  fundType: string
}
