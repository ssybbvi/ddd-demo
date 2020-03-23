import { Role } from '../domain/role'

export interface IRoleRepo {
  filter(): Promise<Role[]>
  findByName(name: string): Promise<Role[]>
  save(role: Role): Promise<void>
  deleteById(_id: string): Promise<void>
  getById(_id: string): Promise<Role>
}
