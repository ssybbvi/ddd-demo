import { RecommendedUser } from '../domain/recommendedUser'
import { RecommendedUserId } from '../domain/recommendedUserId'

export interface IRecommendedUserRepo {
  existsById(_id: string): Promise<boolean>
  getById(_id: string): Promise<RecommendedUser>
  existsByInviteToken(inviteToken: string): Promise<boolean>
  getByInviteToken(inviteToken: string): Promise<RecommendedUser>
  save(recommendedUser: RecommendedUser): Promise<void>
  getTermRecommendedUserList(recommendedUserIdList: RecommendedUserId[]): Promise<RecommendedUser[]>
  getUserByInviteRecommendedUserId(userId: string): Promise<RecommendedUser[]>
}
