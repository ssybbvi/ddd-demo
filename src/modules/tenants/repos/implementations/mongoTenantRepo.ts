import { ITenantRepo } from '../iTenantRepo'
import { TenantName, ITenantNameProps } from '../../domain/tenantName'
import { Tenant } from '../../domain/tenant'
import { Db, MongoClient, Collection } from 'mongodb'
import { TenantMap } from '../../mappers/tenantMap'
import { ITenantDbModels } from '../../dbModels/iTenantDbModels'
import { Global } from '../../../../shared/infra/database/mongodb'

export class MongoTenantRepo implements ITenantRepo {
  private tableNname: string = 'tenant'
  constructor() {}

  async existsSameName(name: string): Promise<boolean> {
    let isExistsSameName = await Global.instance.mongoDb
      .collection<ITenantDbModels>(this.tableNname)
      .findOne({ name: name })
    return !!isExistsSameName
  }

  async getTenantByTenantId(tenantId: string): Promise<Tenant> {
    let tenant = await Global.instance.mongoDb.collection<ITenantDbModels>(this.tableNname).findOne({ _id: tenantId })
    if (!!tenant === false) {
      throw new Error('租户不存在')
    }
    return TenantMap.toDomain(tenant)
  }

  async create(tenant: Tenant): Promise<void> {
    let tenantModel = await TenantMap.toPersistence(tenant)
    await await Global.instance.mongoDb.collection<ITenantDbModels>(this.tableNname).insertOne(tenantModel)
  }

  async getAll(): Promise<Tenant[]> {
    let list = await await Global.instance.mongoDb
      .collection<ITenantDbModels>(this.tableNname)
      .find({})
      .toArray()
    return list.map(item => TenantMap.toDomain(item))
  }

  async updateName(_id: string, name: string): Promise<void> {
    await await Global.instance.mongoDb
      .collection<ITenantDbModels>(this.tableNname)
      .updateOne({ _id }, { $set: { name } })
  }
}
