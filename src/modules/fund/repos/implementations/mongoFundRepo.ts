import { IFundRepo } from '../iFundRepo'
import { Fund } from '../../domain/fund'
import { Db, MongoClient, Collection } from 'mongodb'
import { FundMap } from '../../mappers/fundMap'
import { IFundDbModel } from '../../dbModels/iFundDbModel'
import { Global } from '../../../../shared/infra/database/mongodb'

export class MongoFundRepo implements IFundRepo {
  constructor() {}

  private createCollection(): Collection<IFundDbModel> {
    return Global.instance.mongoDb.collection<IFundDbModel>('funds')
  }

  async getById(_id: string): Promise<Fund> {
    let Fund = await this.createCollection().findOne({ _id })
    if (!!Fund === false) {
      throw new Error('不存在')
    }
    return FundMap.toDomain(Fund)
  }

  async save(fund: Fund): Promise<void> {
    let FundModel = await FundMap.toPersistence(fund)
    await this.createCollection().insertOne(FundModel)
  }

  async filter(): Promise<Fund[]> {
    let list = await this.createCollection()
      .find({})
      .toArray()
    return list.map(item => FundMap.toDomain(item))
  }
}
