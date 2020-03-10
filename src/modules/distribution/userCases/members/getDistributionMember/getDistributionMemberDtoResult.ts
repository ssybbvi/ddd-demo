import { TermDTO } from '../../../dtos/termDTO'

export interface GetDistributionMemberDtoResult {
  primaryDistributionTerms: TermDTO[]
  secondaryDistributionTerms: TermDTO[]
  primaryDistributionByTodayTerms: TermDTO[]
  secondaryDistributionByTodayTerms: TermDTO[]
}
