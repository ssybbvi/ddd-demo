import { IUpUserRepo } from '../upUserRepo'
import { IUpUserDbModels } from '../../dbModels/iUpUserDbModels'
import { UpUserMap } from '../../mappers/upUserMap'
import { UpUser } from '../../domain/upUser'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { UpUserName } from '../../domain/upUserName'
import { MongodbWithTenantCollection, MongodbWithTenant } from '../../../../shared/infra/database/mongodb/mongodbTenant'

export class MongoUpUserRepo implements IUpUserRepo {
  constructor() { }

  private getCollection(): MongodbWithTenantCollection<IUpUserDbModels> {
    return MongodbWithTenant.instance.Collection<IUpUserDbModels>('upUser')
  }

  public async getById(_id: string): Promise<UpUser> {
    let upUser = await this.getCollection().findOne({ _id })
    return UpUserMap.toDomain(upUser)
  }

  public async filter(): Promise<UpUser[]> {
    let list = await this.getCollection()
      .find({})
      .toArray()
    return list.map(item => UpUserMap.toDomain(item))
  }

  async save(upUser: UpUser): Promise<void> {
    const raw = await UpUserMap.toPersistence(upUser)
    await this.getCollection().updateOne(
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
    const _userName = userName instanceof UpUserName ? (<UpUserName>userName).value : userName
    const baseUser = await this.getCollection().findOne({
      userName: _userName
    })
    return UpUserMap.toDomain(baseUser)
  }
}
