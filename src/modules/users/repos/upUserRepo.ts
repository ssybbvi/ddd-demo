import { UpUser } from '../domain/upUser'
import { UpUserName } from '../domain/upUserName'

export interface IUpUserRepo {
  filter(): Promise<UpUser[]>
  save(user: UpUser): Promise<void>
  getById(_id: string): Promise<UpUser>
  getUserByUserName(userName: UpUserName | string): Promise<UpUser>
}
