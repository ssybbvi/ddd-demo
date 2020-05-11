import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { RewardDiscount } from '../domain/rewardDiscount'
import { IRewardDiscountDto } from '../dtos/rewardDiscountDto'
import { IRewardDiscountDbModel } from '../dbModels/rewardDiscountDbModel'



export class RewardDiscountMap implements IMapper<RewardDiscount> {
  public static toDTO(rewardDiscount: RewardDiscount): IRewardDiscountDto {
    return {
      type: 'discount',
      discount: rewardDiscount.discount
    }
  }
  g

  public static toDomain(raw: IRewardDiscountDbModel): RewardDiscount {
    const rewardDiscountOrError = RewardDiscount.create(
      {
        type: 'discount',
        discount: raw.discount
      }
    )

    rewardDiscountOrError.isFailure ? console.log(rewardDiscountOrError.error) : ''
    return rewardDiscountOrError.isSuccess ? rewardDiscountOrError.getValue() : null
  }

  public static toPersistence(rewardDiscount: RewardDiscount): IRewardDiscountDbModel {
    return {
      type: 'discount',
      discount: rewardDiscount.discount
    }
  }
}
