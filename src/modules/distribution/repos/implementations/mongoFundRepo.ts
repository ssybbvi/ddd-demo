import { IFundRepo, TodayByMemberDto } from '../iFundRepo'
import { Fund } from '../../domain/fund'
import { Db, MongoClient, Collection } from 'mongodb'
import { FundMap } from '../../mappers/fundMap'
import { IFundDbModel } from '../../dbModels/iFundDbModel'
import { Global } from '../../../../shared/infra/database/mongodb'
import { MemberId } from '../../domain/memberId'
import { FundType } from '../../domain/fundType'

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

  async getListByMemberId(memberId: MemberId): Promise<Fund[]> {
    let list = await this.createCollection()
      .find({ incomeMemberId: memberId.id.toString() })
      .toArray()
    return list.map(item => FundMap.toDomain(item))
  }

  async getDistributionList(memberId: MemberId, type: FundType, createAt: number): Promise<TodayByMemberDto[]> {
    let list = await Global.instance.mongoDb
      .collection('funds')
      .aggregate([
        {
          $match: {
            incomeMemberId: memberId.id.toString(),
            type,
            createAt: {
              $gt: createAt
            }
          }
        },
        {
          $group: {
            _id: '$paymentMemberId',
            totalAmount: {
              $sum: '$amount'
            }
          }
        },
        {
          $sort: {
            totalAmount: -1
          }
        },
        {
          $project: {
            paymentMemberId: '$_id',
            totalAmount: 1
          }
        }
      ])
      .toArray()
    return list
  }
}
