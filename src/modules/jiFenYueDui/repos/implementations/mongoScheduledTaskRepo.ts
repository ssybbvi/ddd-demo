import { Collection } from 'mongodb'
import { IScheduledTaskDbModels } from '../../dbModels/scheduledTaskDbModels'
import { Global } from '../../../../shared/infra/database/mongodb'
import { ScheduledTask } from '../../domain/scheduledTask'
import { ScheduledTaskMap } from '../../mappers/scheduledTaskMap'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { IScheduledTaskRepo } from '../scheduledTaskRepo'
import { MongodbWithTenantCollection, MongodbWithTenant } from '../../../../shared/infra/database/mongodb/mongodbTenant'

export class MongoScheduledTaskRepo implements IScheduledTaskRepo {
  constructor() { }

  private getCollection(): MongodbWithTenantCollection<IScheduledTaskDbModels> {
    return MongodbWithTenant.instance.Collection<IScheduledTaskDbModels>('scheduledTask')
  }

  public async getById(_id: string): Promise<ScheduledTask> {
    let scheduledTask = await this.getCollection().findOne({ _id })
    return ScheduledTaskMap.toDomain(scheduledTask)
  }

  public async save(scheduledTask: ScheduledTask): Promise<void> {
    const raw = await ScheduledTaskMap.toPersistence(scheduledTask)
    await this.getCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          userId: raw.userId,
          argument: raw.argument,
          type: raw.type,
          executionTime: raw.executionTime,
          isExecuted: raw.isExecuted,
          createAt: raw.createAt,
          isSuccess: raw.isSuccess,
          result: raw.result,
          relationId: raw.relationId
        }
      },
      { upsert: true }
    )

    await DomainEvents.dispatchEventsForAggregate(scheduledTask)
  }

  public async exist(_id: string): Promise<boolean> {
    let scheduledTask = await this.getCollection().findOne({ _id })
    return !!scheduledTask === true
  }

  public async filter(userId: string): Promise<ScheduledTask[]> {
    let query: any = {
      userId
    }

    let scheduledTaskList = await this.getCollection()
      .find(query)
      .toArray()
    return scheduledTaskList.map(item => ScheduledTaskMap.toDomain(item))
  }

  public async filterByExecutable(): Promise<ScheduledTask[]> {
    let query: any = {
      executionTime: { $lt: Date.now() },
      isExecuted: false
    }

    let scheduledTaskList = await this.getCollection()
      .find(query)
      .toArray()
    return scheduledTaskList.map(item => ScheduledTaskMap.toDomain(item))
  }
}
