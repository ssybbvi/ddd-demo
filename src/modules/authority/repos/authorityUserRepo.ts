import { AuthorityUser } from '../domain/authorityUser'
import { AuthorityUserDetails } from '../domain/authorityUserDetails'
import { AuthorityUserId } from '../domain/authorityUserId'

export interface IAuthorityUserRepo {
  exists(userId: string): Promise<boolean>
  getAuthorityUserByUserId(userId: string): Promise<AuthorityUser>
  getAuthorityUserIdByUserId(userId: string): Promise<AuthorityUserId>
  getAuthorityUserByUserName(username: string): Promise<AuthorityUser>
  save(authorityUser: AuthorityUser): Promise<void>
  filter(): Promise<AuthorityUser[]>
}
