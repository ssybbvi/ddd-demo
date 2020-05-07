import { IAuthorityUserRepo } from '../authorityUserRepo'
import { AuthorityUser } from '../../domain/authorityUser'
import { AuthorityUserMap } from '../../mappers/authorityUserMap'
import { AuthorityUserId } from '../../domain/authorityUserId'
import { AuthorityUserIdMap } from '../../mappers/authorityUserIdMap'
import { IAuthorityUserDbModel } from '../../dbModels/iAuthorityUserDbModel'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { MongodbWithTenantCollection, MongodbWithTenant } from '../../../../shared/infra/database/mongodb/mongodbTenant'

export class AuthorityUserRepo implements IAuthorityUserRepo {
  constructor() { }
  private getCollection(): MongodbWithTenantCollection<IAuthorityUserDbModel> {
    return MongodbWithTenant.instance.Collection<IAuthorityUserDbModel>('authorityUser')
  }

  public async filter(): Promise<AuthorityUser[]> {
    let list = await this.getCollection()
      .find({})
      .toArray()
    return list.map(item => AuthorityUserMap.toDomain(item))
  }

  public async exists(userId: string): Promise<boolean> {
    const authorityUser = await this.getCollection().findOne({ userId: userId })
    const found = !!authorityUser === true
    return found
  }

  public async getAuthorityUserIdByUserId(userId: string): Promise<AuthorityUserId> {
    const authorityUser = await this.getCollection().findOne({ userId: userId })
    const found = !!authorityUser === true
    if (!found) throw new Error('AuthorityUser id not found')
    return AuthorityUserIdMap.toDomain(authorityUser)
  }

  public async getAuthorityUserByUserId(userId: string): Promise<AuthorityUser> {
    const authorityUser = await this.getCollection().findOne({ userId: userId })
    const found = !!authorityUser === true
    if (!found) throw new Error('AuthorityUser id not found')
    return AuthorityUserMap.toDomain(authorityUser)
  }

  public async getAuthorityUserByUserName(username: string): Promise<AuthorityUser> {
    const authorityUser = await this.getCollection().findOne({ username })
    const found = !!authorityUser === true
    if (!found) throw new Error('AuthorityUser not found')
    return AuthorityUserMap.toDomain(authorityUser)
  }

  public async save(authorityUser: AuthorityUser): Promise<void> {
    const raw = await AuthorityUserMap.toPersistence(authorityUser)
    await this.getCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          name: raw.name,
          roleIds: raw.roleIds
        }
      },
      { upsert: true }
    )

    await DomainEvents.dispatchEventsForAggregate(authorityUser)
  }
}
