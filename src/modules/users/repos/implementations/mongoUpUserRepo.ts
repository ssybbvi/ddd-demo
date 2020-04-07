import { IUpUserRepo } from '../upUserRepo'
import { Collection } from 'mongodb'
import { IUpUserDbModels } from '../../dbModels/iUpUserDbModels'
import { Global } from '../../../../shared/infra/database/mongodb'
import { UpUserMap } from '../../mappers/upUserMap'
import { UpUser } from '../../domain/upUser'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { UpUserName } from '../../domain/upUserName'

export class MongoUpUserRepo implements IUpUserRepo {
  constructor() {}

  private createCollection(): Collection<IUpUserDbModels> {
    return Global.instance.mongoDb.collection<IUpUserDbModels>('upUser')
  }

  public async getById(_id: string): Promise<UpUser> {
    let upUser = await this.createCollection().findOne({ _id })
    return UpUserMap.toDomain(upUser)
  }

  public async filter(): Promise<UpUser[]> {
    let list = await this.createCollection()
      .find({})
      .toArray()
    return list.map(item => UpUserMap.toDomain(item))
  }

  async save(upUser: UpUser): Promise<void> {
    const raw = await UpUserMap.toPersistence(upUser)
    await this.createCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          userName: raw.userName,
          password: raw.password,
          salt: raw.salt
        }
      },
      { upsert: true }
    )
    await DomainEvents.dispatchEventsForAggregate(upUser)
  }

  async getUserByUserName(userName: UpUserName | string): Promise<UpUser> {
    const baseUser = await this.createCollection().findOne({
      username: userName instanceof UpUserName ? (<UpUserName>userName).value : userName
    })
    if (!!baseUser === false) throw new Error('User not found.')
    return UpUserMap.toDomain(baseUser)
  }
}
