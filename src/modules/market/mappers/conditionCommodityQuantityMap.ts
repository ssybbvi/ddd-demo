import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { ConditionCommodityQuantity } from '../domain/conditionCommodityQuantity'
import { IConditionCommodityQuantityDto } from '../dtos/conditionCommodityQuantityDto'
import { IConditionCommodityQuantityDbModel } from '../dbModels/conditionCommodityQuantityDbModel'

export class ConditionCommodityQuantityMap implements IMapper<ConditionCommodityQuantity> {
  public static toDTO(conditionCommodityQuantity: ConditionCommodityQuantity): IConditionCommodityQuantityDto {
    return {
      type: 'commodityQuantity',
      quantity: conditionCommodityQuantity.quantity,
    }
  }

  public static toDomain(raw: IConditionCommodityQuantityDbModel): ConditionCommodityQuantity {
    const conditionCommodityQuantityOrError = ConditionCommodityQuantity.create({
      type: 'commodityQuantity',
      quantity: raw.quantity,
    })

    conditionCommodityQuantityOrError.isFailure ? console.log(conditionCommodityQuantityOrError.error) : ''
    return conditionCommodityQuantityOrError.isSuccess ? conditionCommodityQuantityOrError.getValue() : null
  }

  public static toPersistence(
    conditionCommodityQuantity: ConditionCommodityQuantity
  ): IConditionCommodityQuantityDbModel {
    return {
      type: 'commodityQuantity',
      quantity: conditionCommodityQuantity.quantity,
    }
  }
}
