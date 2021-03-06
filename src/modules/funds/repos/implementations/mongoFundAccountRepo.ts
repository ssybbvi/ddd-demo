

import { FundAccount } from '../../domain/fundAccount'
import { IFundAccountDbModel } from '../../dbModels/iFundAccountDbModel'
import { IFundAccountRepo } from '../iFundAccountRepo'
import { FundAccountMap } from '../../mappers/fundAccountMap'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { MongodbWithTenantCollection, MongodbWithTenant } from '../../../../shared/infra/database/mongodb/mongodbTenant'

export class MongoFundAccountRepo implements IFundAccountRepo {
  constructor() { }

  private getCollection(): MongodbWithTenantCollection<IFundAccountDbModel> {
    return MongodbWithTenant.instance.Collection<IFundAccountDbModel>('fundAccount')
  }

  public async getById(_id: string): Promise<FundAccount> {
    let fundAccount = await this.getCollection().findOne({ _id })
    return FundAccountMap.toDomain(fundAccount)
  }

  public async save(fundAccount: FundAccount): Promise<void> {
    const raw = await FundAccountMap.toPersistence(fundAccount)
    await this.getCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          totalAmount: fundAccount.totalAmounnt
        }
      },
      { upsert: true }
    )

    await DomainEvents.dispatchEventsForAggregate(fundAccount)
  }

  async exist(_id: string): Promise<boolean> {
    let fundAccount = await this.getCollection().findOne({ _id })
    return !!fundAccount === true
  }
}
