import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Activity } from '../domain/activity'
import { ActivityDto } from '../dtos/activityDto'
import { IActivityDbModel } from '../dbModels/activityDbModel'
import { StrategyMap } from './strategyMap'

export class ActivityMap implements IMapper<Activity> {
  public static toListDto(activityList: Activity[]) {
    let activityDtoList = []
    for (let item of activityList) {
      activityDtoList.push(this.toDTO(item))
    }
    return activityDtoList
  }

  public static toDTO(activity: Activity): ActivityDto {
    return {
      _id: activity.id.toString(),
      isEnable: activity.isEnable,
      strategy: StrategyMap.toDTO(activity.strategy),
    }
  }

  public static toDomain(raw: IActivityDbModel): Activity {
    const activityOrError = Activity.create(
      {
        isEnable: raw.isEnable,
        strategy: StrategyMap.toDomain(raw.strategy),
      },
      new UniqueEntityID(raw._id)
    )

    activityOrError.isFailure ? console.log(activityOrError.error) : ''
    return activityOrError.isSuccess ? activityOrError.getValue() : null
  }

  public static toPersistence(activity: Activity): IActivityDbModel {
    return {
      _id: activity.id.toString(),
      isEnable: activity.isEnable,
      strategy: StrategyMap.toPersistence(activity.strategy),
    }
  }
}
