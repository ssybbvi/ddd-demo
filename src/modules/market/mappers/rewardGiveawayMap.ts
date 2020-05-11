import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { RewardGiveaway } from '../domain/rewardGiveaway'
import { IRewardGiveawayDto } from '../dtos/rewardGiveawayDto'
import { IRewardGiveawayDbModel } from '../dbModels/rewardGiveawayDbModel'



export class RewardGiveawayMap implements IMapper<RewardGiveaway> {
  public static toDTO(rewardGiveaway: RewardGiveaway): IRewardGiveawayDto {
    return {
      type: 'giveaway',
      commodityId: rewardGiveaway.commodityId
    }
  }
  g

  public static toDomain(raw: IRewardGiveawayDbModel): RewardGiveaway {
    const rewardGiveawayOrError = RewardGiveaway.create(
      {
        type: 'giveaway',
        commodityId: raw.commodityId
      }
    )

    rewardGiveawayOrError.isFailure ? console.log(rewardGiveawayOrError.error) : ''
    return rewardGiveawayOrError.isSuccess ? rewardGiveawayOrError.getValue() : null
  }

  public static toPersistence(rewardGiveaway: RewardGiveaway): IRewardGiveawayDbModel {
    return {
      type: 'giveaway',
      commodityId: rewardGiveaway.commodityId
    }
  }
}
