import { TermDTO } from '../../../dtos/termDTO'

export interface GetDistributionRecommendedUserDtoResult {
  primaryDistributionTerms: TermDTO[]
  secondaryDistributionTerms: TermDTO[]
  primaryDistributionByTodayTerms: TermDTO[]
  secondaryDistributionByTodayTerms: TermDTO[]
}
