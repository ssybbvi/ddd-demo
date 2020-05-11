import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { ConditionDate } from '../domain/conditionDate'
import { IConditionDateDto } from '../dtos/conditionDateDto'
import { IConditionDateDbModel } from '../dbModels/conditionDateDbModel'



export class ConditionDateMap implements IMapper<ConditionDate> {
  public static toDTO(conditionDate: ConditionDate): IConditionDateDto {
    return {
      type: 'date',
      beginAt: conditionDate.beginAt,
      finishAt: conditionDate.finishAt,
    }
  }


  public static toDomain(raw: IConditionDateDbModel): ConditionDate {
    const conditionDateOrError = ConditionDate.create(
      {
        type: 'date',
        beginAt: raw.beginAt,
        finishAt: raw.finishAt,
      }
    )

    conditionDateOrError.isFailure ? console.log(conditionDateOrError.error) : ''
    return conditionDateOrError.isSuccess ? conditionDateOrError.getValue() : null
  }

  public static toPersistence(conditionDate: ConditionDate): IConditionDateDbModel {
    return {
      type: 'date',
      beginAt: conditionDate.beginAt,
      finishAt: conditionDate.finishAt,
    }
  }
}
