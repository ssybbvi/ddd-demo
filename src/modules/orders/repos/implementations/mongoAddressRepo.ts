import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { AddressUserMap } from '../../mappers/addressUserMap'
import { AddressUser } from '../../domain/addressUser'
import { IAddressUserRepo } from '../addressUserRepo'
import { MongodbWithTenantCollection, MongodbWithTenant } from '../../../../shared/infra/database/mongodb/mongodbTenant'
import { IAddressUserDbModel } from '../../dbModels/addressUresDbModel'

export class MongoAddressUserRepo implements IAddressUserRepo {
  constructor() {}

  private getCollection(): MongodbWithTenantCollection<IAddressUserDbModel> {
    return MongodbWithTenant.instance.Collection<IAddressUserDbModel>('addressUser')
  }

  public async getById(_id: string): Promise<AddressUser> {
    let addressUser = await this.getCollection().findOne({ _id })
    return AddressUserMap.toDomain(addressUser)
  }

  public async save(addressUser: AddressUser): Promise<void> {
    const raw = await AddressUserMap.toPersistence(addressUser)
    await this.getCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          userId: raw.userId,
          isDefault: raw.isDefault,
          addressInfo: raw.addressInfo,
        },
      },
      { upsert: true }
    )

    await DomainEvents.dispatchEventsForAggregate(addressUser)
  }

  public async exist(_id: string): Promise<boolean> {
    let addressUser = await this.getCollection().findOne({ _id })
    return !!addressUser === true
  }

  public async filter(userId: string): Promise<AddressUser[]> {
    const list = await this.getCollection().find({ userId }).toArray()
    return list.map((item) => AddressUserMap.toDomain(item))
  }
}
