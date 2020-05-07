import { ITenantRepo } from '../iTenantRepo'
import { Tenant } from '../../domain/tenant'
import { Db, MongoClient, Collection } from 'mongodb'
import { TenantMap } from '../../mappers/tenantMap'
import { ITenantDbModels } from '../../dbModels/iTenantDbModels'
import { Global } from '../../../../shared/infra/database/mongodb'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'

export class MongoTenantRepo implements ITenantRepo {
  constructor() { }

  private getCollection(): Collection<ITenantDbModels> {
    return Global.instance.mongoDb.collection<ITenantDbModels>('tenant')
  }

  async existsSameName(name: string): Promise<boolean> {
    let isExistsSameName = await this.getCollection().findOne({ name: name })
    return !!isExistsSameName
  }

  async getById(tenantId: string): Promise<Tenant> {
    let tenant = await this.getCollection().findOne({ _id: tenantId })
    return TenantMap.toDomain(tenant)
  }

  async save(tenant: Tenant): Promise<void> {
    let tenantModel = await TenantMap.toPersistence(tenant)
    await this.getCollection().insertOne(tenantModel)

    await this.getCollection().updateOne(
      { _id: tenantModel._id },
      {
        $set: {
          name: tenantModel.name,
          mongodbConnection: tenantModel.mongodbConnection,
          isActive: tenantModel.isActive,
        },
      },
      { upsert: true }
    )

    await DomainEvents.dispatchEventsForAggregate(tenant)
  }

  async filter(): Promise<Tenant[]> {
    let list = await this.getCollection().find({}).toArray()
    return list.map((item) => TenantMap.toDomain(item))
  }

}
