import { ITenantRepo } from '../iTenantRepo'
import { Tenant } from '../../domain/tenant'
import { Db, MongoClient, Collection } from 'mongodb'
import { TenantMap } from '../../mappers/tenantMap'
import { ITenantDbModels } from '../../dbModels/iTenantDbModels'
import { Global } from '../../../../shared/infra/database/mongodb'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'

export class MongoTenantRepo implements ITenantRepo {
  constructor() { }

  private createCollection(): Collection<ITenantDbModels> {
    return Global.instance.mongoDb.collection<ITenantDbModels>('tenant')
  }

  async existsSameName(name: string): Promise<boolean> {
    let isExistsSameName = await this.createCollection().findOne({ name: name })
    return !!isExistsSameName
  }

  async getById(tenantId: string): Promise<Tenant> {
    let tenant = await this.createCollection().findOne({ _id: tenantId })
    return TenantMap.toDomain(tenant)
  }

  async save(tenant: Tenant): Promise<void> {
    let tenantModel = await TenantMap.toPersistence(tenant)
    await this.createCollection().insertOne(tenantModel)

    await this.createCollection().updateOne(
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
    let list = await this.createCollection().find({}).toArray()
    return list.map((item) => TenantMap.toDomain(item))
  }

}
