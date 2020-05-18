import { IMapper } from '../../../shared/infra/Mapper'
import { ConditionCommodityStrategyTag } from '../domain/conditionCommodityStrategyTag'
import { IConditionCommodityStrategyTagDto } from '../dtos/conditionCommodityStrategyTagDto'
import { IConditionCommodityStrategyTagDbModel } from '../dbModels/conditionCommodityStrategyTagDbModel'

export class ConditionCommodityStrategyTagMap implements IMapper<ConditionCommodityStrategyTag> {
  public static toDTO(conditionCommodityStrategyTag: ConditionCommodityStrategyTag): IConditionCommodityStrategyTagDto {
    return {
      type: 'commodityStrategyTag',
      tag: conditionCommodityStrategyTag.tag,
    }
  }

  public static toDomain(raw: IConditionCommodityStrategyTagDbModel): ConditionCommodityStrategyTag {
    const conditionCommodityStrategyTagOrError = ConditionCommodityStrategyTag.create({
      type: 'commodityStrategyTag',
      tag: raw.tag,
    })

    conditionCommodityStrategyTagOrError.isFailure ? console.log(conditionCommodityStrategyTagOrError.error) : ''
    return conditionCommodityStrategyTagOrError.isSuccess ? conditionCommodityStrategyTagOrError.getValue() : null
  }

  public static toPersistence(
    conditionCommodityStrategyTag: ConditionCommodityStrategyTag
  ): IConditionCommodityStrategyTagDbModel {
    return {
      type: 'commodityStrategyTag',
      tag: conditionCommodityStrategyTag.tag,
    }
  }
}
