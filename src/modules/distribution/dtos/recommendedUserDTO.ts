export interface RecommendedUserDTO {
  _id: string
  distributionRelationList: DistributionRelationDTO[]
}

interface DistributionRelationDTO {
  recommendedUserId: string
  distributionRate: number
  fundType: string
}
