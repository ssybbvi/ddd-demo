export interface MemberDTO {
  _id: string
  inviteMemberId?: string
  createAt: number
  inviteToken: string
  distributionRelationList: DistributionRelationDTO[]
}

interface DistributionRelationDTO {
  memberId: string
  distributionRate: number
  fundType: string
}
