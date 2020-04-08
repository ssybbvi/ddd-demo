import { Collection } from 'mongodb'
import { IScheduledTaskDbModels } from '../../dbModels/scheduledTaskDbModels'
import { Global } from '../../../../shared/infra/database/mongodb'
import { ScheduledTask } from '../../domain/scheduledTask'
import { ScheduledTaskMap } from '../../mappers/scheduledTaskMap'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { IScheduledTaskRepo } from '../scheduledTaskRepo'

export class MongoScheduledTaskRepo implements IScheduledTaskRepo {
  constructor() {}

  private createCollection(): Collection<IScheduledTaskDbModels> {
    return Global.instance.mongoDb.collection<IScheduledTaskDbModels>('scheduledTask')
  }

  public async getById(_id: string): Promise<ScheduledTask> {
    let scheduledTask = await this.createCollection().findOne({ _id })
    return ScheduledTaskMap.toDomain(scheduledTask)
  }

  public async save(scheduledTask: ScheduledTask): Promise<void> {
    const raw = await ScheduledTaskMap.toPersistence(scheduledTask)
    await this.createCollection().updateOne(
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
          result: raw.result
        }
      },
      { upsert: true }
    )

    await DomainEvents.dispatchEventsForAggregate(scheduledTask)
  }

  public async exist(_id: string): Promise<boolean> {
    let scheduledTask = await this.createCollection().findOne({ _id })
    return !!scheduledTask === true
  }

  public async filter(userId: string): Promise<ScheduledTask[]> {
    let query: any = {
      userId
    }

    let scheduledTaskList = await this.createCollection()
      .find(query)
      .toArray()
    return scheduledTaskList.map(item => ScheduledTaskMap.toDomain(item))
  }

  public async filterByExecutable(): Promise<ScheduledTask[]> {
    let query: any = {
      executionTime: { $lt: Date.now() }
    }

    let scheduledTaskList = await this.createCollection()
      .find(query)
      .toArray()
    return scheduledTaskList.map(item => ScheduledTaskMap.toDomain(item))
  }
}
