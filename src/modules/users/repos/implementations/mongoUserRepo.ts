import { IUserRepo } from '../userRepo'
import { User } from '../../domain/user'
import { IUserDbModels } from '../../dbModels/iUserDbModels'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { UserMap } from '../../mappers/userMap'
import { MongodbWithTenantCollection, MongodbWithTenant } from '../../../../shared/infra/database/mongodb/mongodbTenant'

export class MongoUserRepo implements IUserRepo {
  constructor() { }

  private getCollection(): MongodbWithTenantCollection<IUserDbModels> {
    return MongodbWithTenant.instance.Collection<IUserDbModels>('user')
  }

  public async getById(_id: string): Promise<User> {
    let user = await this.getCollection().findOne({ _id })
    return UserMap.toDomain(user)
  }

  public async filter(): Promise<User[]> {
    let list = await this.getCollection()
      .find({})
      .toArray()
    return list.map(item => UserMap.toDomain(item))
  }

  public async getUserByInviteToken(inviteToken: string): Promise<User> {
    const baseUser = await this.getCollection().findOne({
      inviteToken: inviteToken
    })
    return UserMap.toDomain(baseUser)
  }

  async save(user: User): Promise<void> {
    const raw = await UserMap.toPersistence(user)
    await this.getCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          accessToken: raw.accessToken,
          refreshToken: raw.refreshToken,
          isDeleted: raw.isDeleted,
          lastLogin: raw.lastLogin,
          inviteRecommendedUserId: raw.inviteRecommendedUserId,
          inviteToken: raw.inviteToken
        }
      },
      { upsert: true }
    )
    await DomainEvents.dispatchEventsForAggregate(user)
  }

  public async getUserByInviteRecommendedUserId(userId: string): Promise<User[]> {
    let userList = await this.getCollection()
      .find({
        inviteRecommendedUserId: userId
      })
      .toArray()
    return userList.map(item => UserMap.toDomain(item))
  }
}
