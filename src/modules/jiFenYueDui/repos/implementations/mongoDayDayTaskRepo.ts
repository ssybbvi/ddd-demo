import { IDayDayTaskRepo } from "../dayDayRepo"
import { Collection } from "mongodb"
import { IDayDayTaskDbModels } from "../../dbModels/dayDayTaskDbModels"
import { Global } from "../../../../shared/infra/database/mongodb"
import { DayDayTask } from "../../domain/dayDayTask"
import { DayDayTaskMap } from "../../mappers/dayDayTaskMap"
import { DomainEvents } from "../../../../shared/domain/events/DomainEvents"
import { MongodbWithTenantCollection, MongodbWithTenant } from "../../../../shared/infra/database/mongodb/mongodbTenant"

export class MongoDayDayTaskRepo implements IDayDayTaskRepo {
  constructor() { }


  private getCollection(): MongodbWithTenantCollection<IDayDayTaskDbModels> {
    return MongodbWithTenant.instance.Collection<IDayDayTaskDbModels>('dayDayTask')
  }

  public async getById(_id: string): Promise<DayDayTask> {
    let dayDayTask = await this.getCollection().findOne({ _id })
    return DayDayTaskMap.toDomain(dayDayTask)
  }

  public async save(dayDayTask: DayDayTask): Promise<void> {
    const raw = await DayDayTaskMap.toPersistence(dayDayTask)
    await this.getCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          type: raw.type,
          reward: raw.reward,
          createAt: raw.createAt,
          userId: raw.userId,
          isReward: raw.isReward,
          isOneTime: raw.isOneTime
        }
      },
      { upsert: true }
    )

    await DomainEvents.dispatchEventsForAggregate(dayDayTask)
  }

  public async exist(_id: string): Promise<boolean> {
    let dayDayTask = await this.getCollection().findOne({ _id })
    return !!dayDayTask === true
  }

  public async filter(userId: string): Promise<DayDayTask[]> {
    let query: any = {
      userId,
      $or: [
        {
          createAt: {
            $gt: new Date().setHours(0, 0, 0, 0)
          }
        }, {
          isOneTime: true
        }
      ]

    }

    let dayDayTaskList = await this.getCollection()
      .find(query)
      .toArray()
    return dayDayTaskList.map(item => DayDayTaskMap.toDomain(item))
  }

  async  getByUserIdWithType(userId: string, type: string): Promise<DayDayTask> {
    let query: any = {
      userId,
      type,
      $or: [
        {
          createAt: {
            $gt: new Date().setHours(0, 0, 0, 0)
          }
        }, {
          isOneTime: true
        }
      ]
    }

    let dayDayTask = await this.getCollection()
      .findOne(query)
    return DayDayTaskMap.toDomain(dayDayTask)
  }
}
