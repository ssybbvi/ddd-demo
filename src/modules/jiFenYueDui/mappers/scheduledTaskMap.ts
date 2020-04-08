import { ScheduledTask } from '../domain/scheduledTask'
import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { IScheduledTaskDbModels } from '../dbModels/scheduledTaskDbModels'
import { ScheduledTaskType } from '../domain/scheduledTaskType'

export class ScheduledTaskMap implements IMapper<ScheduledTask> {
  // public static toDTO(scheduledTask: ScheduledTask): ScheduledTaskDto {
  //   return {
  //     argument: scheduledTask.argument,
  //     userId: scheduledTask.userId,
  //     type: scheduledTask.type,
  //     executionTime: scheduledTask.executionTime,
  //     createAt: scheduledTask.createAt,
  //     isSuccess: scheduledTask.isSuccess,
  //     result: scheduledTask.result
  //   }
  // }

  public static toDomain(raw: IScheduledTaskDbModels): ScheduledTask {
    if (raw == null) {
      return null
    }

    const scheduledTaskOrError = ScheduledTask.create(
      {
        argument: raw.argument,
        userId: raw.userId,
        type: raw.type as ScheduledTaskType,
        executionTime: raw.executionTime,
        isExecuted: raw.isExecuted,
        createAt: raw.createAt,
        isSuccess: raw.isSuccess,
        result: raw.result,
        relationId: raw.relationId
      },
      new UniqueEntityID(raw._id)
    )

    scheduledTaskOrError.isFailure ? console.log(scheduledTaskOrError.error) : ''
    return scheduledTaskOrError.isSuccess ? scheduledTaskOrError.getValue() : null
  }

  public static toPersistence(scheduledTask: ScheduledTask): IScheduledTaskDbModels {
    return {
      _id: scheduledTask.id.toString(),
      argument: scheduledTask.argument,
      userId: scheduledTask.userId,
      type: scheduledTask.type,
      executionTime: scheduledTask.executionTime,
      isExecuted: scheduledTask.isExecuted,
      createAt: scheduledTask.createAt,
      isSuccess: scheduledTask.isSuccess,
      result: scheduledTask.result,
      relationId: scheduledTask.relationId
    }
  }
}
