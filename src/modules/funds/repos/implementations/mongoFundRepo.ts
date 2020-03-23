import { IFundRepo, TodayByRecommendedUserDto } from '../iFundRepo'
import { Fund } from '../../domain/fund'
import { Db, MongoClient, Collection } from 'mongodb'
import { FundMap } from '../../mappers/fundMap'
import { IFundDbModel } from '../../dbModels/iFundDbModel'
import { Global } from '../../../../shared/infra/database/mongodb'
import { FundType } from '../../domain/fundType'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'

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
    let raw = await FundMap.toPersistence(fund)
    await this.createCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          amount: raw.amount,
          status: raw.status,
          incomeUserId: raw.incomeUserId,
          paymentUserId: raw.paymentUserId,
          createAt: raw.createAt,
          descrpiton: raw.descrpiton,
          type: raw.type,
          relationId: raw.relationId
        }
      },
      { upsert: true }
    )

    DomainEvents.dispatchEventsForAggregate(fund)
  }

  async filter(): Promise<Fund[]> {
    let list = await this.createCollection()
      .find({})
      .toArray()
    return list.map(item => FundMap.toDomain(item))
  }

  async getListByRecommendedUserId(recommendedUserId: string): Promise<Fund[]> {
    let list = await this.createCollection()
      .find({
        $or: [
          {
            incomeUserId: recommendedUserId
          },
          {
            paymentUserId: recommendedUserId
          }
        ]
      })
      .toArray()
    return list.map(item => FundMap.toDomain(item))
  }

  async getDistributionList(recommendedUserId: string, type: FundType, createAt: number): Promise<TodayByRecommendedUserDto[]> {
    let list = await Global.instance.mongoDb
      .collection('funds')
      .aggregate([
        {
          $match: {
            incomeUserId: recommendedUserId,
            type,
            createAt: {
              $gt: createAt
            }
          }
        },
        {
          $group: {
            _id: '$paymentUserId',
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
            paymentUserId: '$_id',
            totalAmount: 1
          }
        }
      ])
      .toArray()
    return list
  }
}
