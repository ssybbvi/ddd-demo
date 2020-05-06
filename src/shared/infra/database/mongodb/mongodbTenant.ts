import { FilterQuery, Cursor } from 'mongodb'
import cls from 'continuation-local-storage'
import { TenantManager } from '../../tenant/tenantManager'
import { ITenantIdDbModel } from '../tenantIdDbModel'
const clsNameSpace = cls.createNamespace('xxx')

export class MongodbWithTenant {
  private collectionName: string
  constructor(collectionName: string) {
    this.collectionName = collectionName
  }
  private getDb() {
    const tenantId = clsNameSpace.get('tenantId')
    const db = TenantManager.instance.getMongoDbClient(tenantId)
    return db
  }

  public find<T extends ITenantIdDbModel>(query?: FilterQuery<T>): Cursor<T> {
    const db = this.getDb()
    const collection = db.collection<T>(this.collectionName)
    query.tenantId = clsNameSpace.get('tenantId')
    return collection.find(query)
  }
}
