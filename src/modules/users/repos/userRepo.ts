import { User } from '../domain/user'

export interface IUserRepo {
  filter(): Promise<User[]>
  getUserByInviteToken(inviteToken: string): Promise<User>
  save(user: User): Promise<void>
  getById(_id: string): Promise<User>
  getUserByInviteRecommendedUserId(userId: string): Promise<User[]>
}
