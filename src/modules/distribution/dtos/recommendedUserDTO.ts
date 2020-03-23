export interface RecommendedUserDTO {
  _id: string
  inviteRecommendedUserId?: string
  createAt: number
  inviteToken: string
  distributionRelationList: DistributionRelationDTO[]
}

interface DistributionRelationDTO {
  recommendedUserId: string
  distributionRate: number
  fundType: string
}
