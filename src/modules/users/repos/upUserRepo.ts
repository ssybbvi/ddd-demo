import { UpUser } from '../domain/upUser'

export interface IUpUserRepo {
  filter(): Promise<UpUser[]>
  save(user: UpUser): Promise<void>
  getById(_id: string): Promise<UpUser>
}
