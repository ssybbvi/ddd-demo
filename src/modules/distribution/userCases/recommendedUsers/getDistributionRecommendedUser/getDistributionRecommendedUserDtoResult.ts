import { TeamDTO } from '../../../dtos/teamDTO'
import { Team } from '../../../domain/team';

export interface GetDistributionRecommendedUserResult {
  primaryDistributionTeams: Team[]
  secondaryDistributionTeams: Team[]
  primaryDistributionByTodayTeams: Team[]
  secondaryDistributionByTodayTeams: Team[]
}


export interface GetDistributionRecommendedUserDtoResult {
  primaryDistributionTeams: TeamDTO[]
  secondaryDistributionTeams: TeamDTO[]
  primaryDistributionByTodayTeams: TeamDTO[]
  secondaryDistributionByTodayTeams: TeamDTO[]
}
