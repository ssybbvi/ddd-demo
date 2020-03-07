import { User } from '../domain/user'
import { UserName } from '../domain/userName'

export interface IUserRepo {
  filter(): Promise<User[]>
  getUserByUserId(userId: string): Promise<User>
  getUserByUserName(userName: UserName | string): Promise<User>
  save(user: User): Promise<void>
  getById(_id: string): Promise<User>
  getUserByWxOpenId(wxOpenId: string): Promise<User>
  existsWxOpenId(wxOpenId: string): Promise<boolean>
}
