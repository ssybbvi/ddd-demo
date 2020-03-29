import { IUserRepo } from '../userRepo'
import { User } from '../../domain/user'
import { Db, MongoClient, Collection } from 'mongodb'

import { IUserDbModels } from '../../dbModels/iUserDbModels'
import { Global } from '../../../../shared/infra/database/mongodb'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { UpUserName } from '../../domain/upUserName'
import { UserMap } from '../../mappers/userMap'

export class MongoUserRepo implements IUserRepo {
  constructor() {}

  private createCollection(): Collection<IUserDbModels> {
    return Global.instance.mongoDb.collection<IUserDbModels>('user')
  }

  public async getById(_id: string): Promise<User> {
    let user = await this.createCollection().findOne({ _id })
    return UserMap.toDomain(user)
  }

  public async filter(): Promise<User[]> {
    let list = await this.createCollection()
      .find({})
      .toArray()
    return list.map(item => UserMap.toDomain(item))
  }

  async getUserByUserName(userName: UpUserName | string): Promise<User> {
    const baseUser = await this.createCollection().findOne({
      username: userName instanceof UpUserName ? (<UpUserName>userName).value : userName
    })
    if (!!baseUser === false) throw new Error('User not found.')
    return UserMap.toDomain(baseUser)
  }

  async getUserByUserId(userId: string): Promise<User> {
    const baseUser = await this.createCollection().findOne({
      _id: userId
    })
    if (!!baseUser === false) throw new Error('User not found.')
    return UserMap.toDomain(baseUser)
  }

  async save(user: User): Promise<void> {
    const raw = await UserMap.toPersistence(user)
    await this.createCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          accessToken: raw.accessToken,
          refreshToken: raw.refreshToken,
          isDeleted: raw.isDeleted,
          lastLogin: raw.lastLogin,
          inviteRecommendedUserId: raw.inviteRecommendedUserId,
          inviteToken: raw.inviteRecommendedUserId
        }
      },
      { upsert: true }
    )
    await DomainEvents.dispatchEventsForAggregate(user)
  }
}
