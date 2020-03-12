import { Db, MongoClient, Collection } from 'mongodb'

import { Global } from '../../../../shared/infra/database/mongodb'
import { dispatchEventsCallback } from '../../../../shared/infra/database/mongodb/hooks'

import { MemberId } from '../../domain/memberId'
import { FundAccount } from '../../domain/fundAccount'
import { IFundAccountDbModel } from '../../dbModels/iFundAccountDbModel'
import { IFundAccountRepo } from '../iFundAccountRepo'
import { FundAccountMap } from '../../mappers/fundAccountMap'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'

export class MongoFundAccountRepo implements IFundAccountRepo {
  constructor() {}

  private createCollection(): Collection<IFundAccountDbModel> {
    return Global.instance.mongoDb.collection<IFundAccountDbModel>('fundAccount')
  }

  public async getById(_id: string): Promise<FundAccount> {
    let fundAccount = await this.createCollection().findOne({ _id })
    return FundAccountMap.toDomain(fundAccount)
  }

  public async save(fundAccount: FundAccount): Promise<void> {
    const raw = await FundAccountMap.toPersistence(fundAccount)
    await this.createCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          totalAmount: fundAccount.totalAmounnt
        }
      },
      { upsert: true }
    )

    DomainEvents.dispatchEventsForAggregate(fundAccount.id)
  }

  async exist(_id: string): Promise<boolean> {
    let fundAccount = await this.createCollection().findOne({ _id })
    return !!fundAccount === true
  }
}
