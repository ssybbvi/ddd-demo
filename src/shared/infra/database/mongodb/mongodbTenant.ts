import { FilterQuery, Cursor, UpdateQuery, UpdateWriteOpResult, MongoCallback, UpdateOneOptions, Collection, Db } from 'mongodb'
import { ITenantIdDbModel } from '../dbModel/tenantIdDbModel'
import { clsNameSpace } from '../../cls'
import { ITenantDbModels } from '../../../../modules/tenants/dbModels/iTenantDbModels'
import { Global } from '.'

export interface MongodbWithTenantCollection<TSchema extends ITenantIdDbModel> {
  find(query?: FilterQuery<TSchema>): Cursor<TSchema>;
  findOne(query?: FilterQuery<TSchema>): Promise<TSchema>
  updateOne(
    filter: FilterQuery<TSchema>,
    update: UpdateQuery<TSchema> | Partial<TSchema>,
    options?: UpdateOneOptions,
  ): Promise<UpdateWriteOpResult>
}

export class MongodbWithTenant {
  private tenantMongodbMap = new Map<string, Db>()

  private static _instance: MongodbWithTenant
  static get instance(): MongodbWithTenant {
    if (!this._instance) {
      this._instance = new MongodbWithTenant()
    }
    return this._instance
  }

  private _isInited = false
  public async init() {
    if (this._isInited) {
      return
    }

    this._isInited = true
    await this.initTenant()
  }

  private async initTenant() {
    const tenantList = await Global.instance.mongoDb
      .collection<ITenantDbModels>('tenant')
      .find({ isActive: true })
      .toArray()

    for (const item of tenantList) {
      if (!item.mongodbConnection) {
        this.tenantMongodbMap.set(item._id, Global.instance.mongoDb)
      } else {
        const { url, dbName } = item.mongodbConnection
        const db = await Global.instance.getMongoDb(url, dbName)
        this.tenantMongodbMap.set(item._id, db)
      }
    }
  }

  private getTenantDb(tenantId: string) {
    const tenantDb = this.tenantMongodbMap.get(tenantId)
    if (!tenantDb) {
      throw new Error(`tenantdb is null ${tenantId}`)
    }
    return tenantDb
  }

  public Collection<TSchema extends ITenantIdDbModel>(collectionName: string): MongodbWithTenantCollection<TSchema> {
    const tenantId = clsNameSpace.get('tenantId')
    const db = this.getTenantDb(tenantId)
    const collection = db.collection<TSchema>(collectionName)
    return {
      find: (query?: FilterQuery<TSchema>): Cursor<TSchema> => {
        query.tenantId = tenantId
        return collection.find(query)
      },
      findOne: async (query?: FilterQuery<TSchema>): Promise<TSchema> => {
        query.tenantId = tenantId
        return collection.findOne(query)
      },
      updateOne: async (
        filter: FilterQuery<TSchema>,
        update: UpdateQuery<TSchema> | Partial<TSchema>,
        options?: UpdateOneOptions,
      ): Promise<UpdateWriteOpResult> => {
        filter.tenantId = tenantId
        update["$set"].tenantId = tenantId
        return collection.updateOne(filter, update, options)
      }
    }
  }
}

