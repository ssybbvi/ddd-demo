import { MongodbWithTenant, MongodbWithTenantCollection } from '../../../../shared/infra/database/mongodb/mongodbTenant'
import { IStrategyRepo } from '../strategyRepo'
import { IStrategyDbModel } from '../../dbModels/strategyDbModel'
import { Strategy } from '../../domain/strategy'
import { StrategyMap } from '../../mappers/strategyMap'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'

export class MongodbStrategyRepo implements IStrategyRepo {
  constructor() {}

  private getCollection(): MongodbWithTenantCollection<IStrategyDbModel> {
    return MongodbWithTenant.instance.Collection<IStrategyDbModel>('strategy')
  }

  public async getById(_id: string): Promise<Strategy> {
    let strategy = await this.getCollection().findOne({ _id })
    return StrategyMap.toDomain(strategy)
  }

  public async save(strategy: Strategy): Promise<void> {
    const raw = await StrategyMap.toPersistence(strategy)
    await this.getCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          name: raw.name,
          condition: raw.condition,
          reward: raw.reward,
          description: raw.description,
        },
      },
      { upsert: true }
    )
    await DomainEvents.dispatchEventsForAggregate(strategy)
  }

  public async filter(): Promise<Strategy[]> {
    const list = await this.getCollection().find().toArray()
    return list.map((item) => StrategyMap.toDomain(item))
  }
}
