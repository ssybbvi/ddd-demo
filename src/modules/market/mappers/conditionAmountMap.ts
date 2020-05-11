import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { ConditionAmount } from '../domain/conditionAmount'
import { IConditionAmountDto } from '../dtos/conditionAmountDto'
import { IConditionAmountDbModel } from '../dbModels/conditionAmountDbModel'


export class ConditionAmountMap implements IMapper<ConditionAmount> {
  public static toDTO(conditionAmount: ConditionAmount): IConditionAmountDto {
    return {
      type: conditionAmount.type,
      amount: conditionAmount.amount
    }
  }

  public static toDomain(raw: IConditionAmountDbModel): ConditionAmount {
    const conditionAmountOrError = ConditionAmount.create(
      {
        type: 'amount',
        amount: raw.amount
      }
    )

    conditionAmountOrError.isFailure ? console.log(conditionAmountOrError.error) : ''
    return conditionAmountOrError.isSuccess ? conditionAmountOrError.getValue() : null
  }

  public static toPersistence(conditionAmount: ConditionAmount): IConditionAmountDbModel {
    return {
      type: conditionAmount.type,
      amount: conditionAmount.amount
    }
  }
}
