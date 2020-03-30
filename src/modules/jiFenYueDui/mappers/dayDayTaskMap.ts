import { DayDayTask } from "../domain/dayDayTask";
import { IMapper } from "../../../shared/infra/Mapper";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { IDayDayTaskDbModels } from "../dbModels/dayDayTaskDbModels";
import { DayDayTaskDto } from "../dtos/dayDayTaskDto";
import { DayDayTaskType } from "../domain/dayDayTaskType";

export class DayDayTaskMap implements IMapper<DayDayTask>{
  public static toDTO(dayDayTask: DayDayTask): DayDayTaskDto {
    return {
      type: dayDayTask.type,
      reward: dayDayTask.reward,
      createAt: dayDayTask.createAt,
      userId: dayDayTask.userId,
      isReward: dayDayTask.isReward
    }
  }

  public static toDomain(raw: IDayDayTaskDbModels): DayDayTask {
    if (raw == null) {
      return null
    }

    const dayDayTaskOrError = DayDayTask.create(
      {
        type: raw.type as DayDayTaskType,
        reward: raw.reward,
        createAt: raw.createAt,
        userId: raw.userId,
        isReward: raw.isReward
      },
      new UniqueEntityID(raw._id)
    )

    dayDayTaskOrError.isFailure ? console.log(dayDayTaskOrError.error) : ''
    return dayDayTaskOrError.isSuccess ? dayDayTaskOrError.getValue() : null
  }

  public static toPersistence(dayDayTask: DayDayTask): IDayDayTaskDbModels {
    return {
      _id: dayDayTask.id.toString(),
      type: dayDayTask.type,
      reward: dayDayTask.reward,
      createAt: dayDayTask.createAt,
      userId: dayDayTask.userId,
      isReward: dayDayTask.isReward
    }
  }
}
