import { Team } from '../domain/team'
import { RecommendedUserId } from '../domain/recommendedUserId';
import { RecommendedUser } from '../domain/recommendedUser';

export interface ITeamRepo {
  getById(_id: string): Promise<Team>
  getTeamRecommendedUserList(recommendedUserIdList: RecommendedUserId[]): Promise<RecommendedUser[]>
}
