import { IAuthorityUserRepo } from '../authorityUserRepo'
import { AuthorityUser } from '../../domain/authorityUser'
import { AuthorityUserMap } from '../../mappers/authorityUserMap'
import { AuthorityUserDetails } from '../../domain/authorityUserDetails'
import { AuthorityUserId } from '../../domain/authorityUserId'
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID'
import { AuthorityUserIdMap } from '../../mappers/authorityUserIdMap'
import { Global } from '../../../../shared/infra/database/mongodb'
import { IAuthorityUserDbModel } from '../../dbModels/iAuthorityUserDbModel'
import { Collection } from 'mongodb'
import { IUserDbModels } from '../../../users/dbModels/iUserDbModels'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'

export class AuthorityUserRepo implements IAuthorityUserRepo {
  constructor() {}
  private createCollection(): Collection<IAuthorityUserDbModel> {
    return Global.instance.mongoDb.collection<IAuthorityUserDbModel>('authorityUser')
  }

  public async filter(): Promise<AuthorityUser[]> {
    let list = await this.createCollection()
      .find({})
      .toArray()
    return list.map(item => AuthorityUserMap.toDomain(item))
  }

  public async exists(userId: string): Promise<boolean> {
    const authorityUser = await this.createCollection().findOne({ userId: userId })
    const found = !!authorityUser === true
    return found
  }

  public async getAuthorityUserIdByUserId(userId: string): Promise<AuthorityUserId> {
    const authorityUser = await this.createCollection().findOne({ userId: userId })
    const found = !!authorityUser === true
    if (!found) throw new Error('AuthorityUser id not found')
    return AuthorityUserIdMap.toDomain(authorityUser)
  }

  public async getAuthorityUserByUserId(userId: string): Promise<AuthorityUser> {
    const authorityUser = await this.createCollection().findOne({ userId: userId })
    const found = !!authorityUser === true
    if (!found) throw new Error('AuthorityUser id not found')
    return AuthorityUserMap.toDomain(authorityUser)
  }

  public async getAuthorityUserByUserName(username: string): Promise<AuthorityUser> {
    const authorityUser = await this.createCollection().findOne({ username })
    const found = !!authorityUser === true
    if (!found) throw new Error('AuthorityUser not found')
    return AuthorityUserMap.toDomain(authorityUser)
  }

  public async save(authorityUser: AuthorityUser): Promise<void> {
    const raw = await AuthorityUserMap.toPersistence(authorityUser)
    await this.createCollection().updateOne(
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
