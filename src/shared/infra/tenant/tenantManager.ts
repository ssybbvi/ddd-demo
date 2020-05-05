import { Db } from 'mongodb'
import { MongodbClient } from '../database/mongodb/mongodbClient'
import { ITenantDbModels } from '../../../modules/tenants/dbModels/iTenantDbModels'
import { Global } from '../database/mongodb'

export class TenantManager {
  public tenantMongodbMap = new Map<string, Db>()

  private static _instance: TenantManager
  static get instance(): TenantManager {
    if (!this._instance) {
      this._instance = new TenantManager()
    }
    return this._instance
  }

  private _isInited = false
  async init() {
    if (this._isInited) {
      return
    }
    this._isInited = true

    const tenantList = await Global.instance.mongoDb
      .collection<ITenantDbModels>('tenant')
      .find({ isActive: true })
      .toArray()

    for (const item of tenantList) {
      if (!item.mongodbConnection) {
        await this.tenantMongodbMap.set(item._id, Global.instance.mongoDb)
      } else {
        const { url, dbName } = item.mongodbConnection
        const db = await Global.instance.getMongoDb(url, dbName)
        this.tenantMongodbMap.set(item._id, db)
      }
    }
  }

  public getMongoDbClient(tenantId: string): Db {
    if (this.tenantMongodbMap.has(tenantId)) {
      return this.tenantMongodbMap.get(tenantId)
    } else {
      throw new Error(`TenantManager.getMongoDbClient(tenantId:${tenantId}) is null`)
    }
  }
}
