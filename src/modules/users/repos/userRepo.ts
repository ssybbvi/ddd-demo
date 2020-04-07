import { User } from '../domain/user'
import { UpUserName } from '../domain/upUserName'

export interface IUserRepo {
  filter(): Promise<User[]>
  getUserByUserId(userId: string): Promise<User>
  save(user: User): Promise<void>
  getById(_id: string): Promise<User>
  getUserByInviteRecommendedUserId(userId: string): Promise<User[]>
}
