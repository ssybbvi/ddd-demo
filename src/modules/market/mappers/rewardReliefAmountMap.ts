import { IMapper } from '../../../shared/infra/Mapper'
import { RewardReliefAmount } from '../domain/rewardReliefAmount'
import { IRewardReliefAmountDto } from '../dtos/rewardReliefAmountDto'
import { IRewardReliefAmountDbModel } from '../dbModels/rewardReliefAmountDbModel'



export class RewardReliefAmountMap implements IMapper<RewardReliefAmount> {
  public static toDTO(rewardReliefAmount: RewardReliefAmount): IRewardReliefAmountDto {
    return {
      type: 'reliefAmount',
      reliefAmount: rewardReliefAmount.reliefAmount
    }
  }
  g

  public static toDomain(raw: IRewardReliefAmountDbModel): RewardReliefAmount {
    const rewardReliefAmountOrError = RewardReliefAmount.create(
      {
        type: 'reliefAmount',
        reliefAmount: raw.reliefAmount
      }
    )

    rewardReliefAmountOrError.isFailure ? console.log(rewardReliefAmountOrError.error) : ''
    return rewardReliefAmountOrError.isSuccess ? rewardReliefAmountOrError.getValue() : null
  }

  public static toPersistence(rewardReliefAmount: RewardReliefAmount): IRewardReliefAmountDbModel {
    return {
      type: 'reliefAmount',
      reliefAmount: rewardReliefAmount.reliefAmount
    }
  }
}
