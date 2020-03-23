import { Permission } from '../domain/permission'

export interface IPermissionRepo {
  filter(): Promise<Permission[]>
  findByName(name: string): Promise<Permission[]>
  save(authorityUser: Permission): Promise<void>
  deleteById(_id: string): Promise<void>
  getById(_id): Promise<Permission>
}
