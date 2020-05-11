import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { RewardCoupon } from '../domain/rewardCoupon'
import { IRewardCouponDto } from '../dtos/rewardCouponDto'
import { IRewardCouponDbModel } from '../dbModels/rewardCouponDbModel'



export class RewardCouponMap implements IMapper<RewardCoupon> {
  public static toDTO(rewardCoupon: RewardCoupon): IRewardCouponDto {
    return {
      type: 'coupon',
      couponId: rewardCoupon.couponId
    }
  }
  g

  public static toDomain(raw: IRewardCouponDbModel): RewardCoupon {
    const rewardCouponOrError = RewardCoupon.create(
      {
        type: 'coupon',
        couponId: raw.couponId
      }
    )

    rewardCouponOrError.isFailure ? console.log(rewardCouponOrError.error) : ''
    return rewardCouponOrError.isSuccess ? rewardCouponOrError.getValue() : null
  }

  public static toPersistence(rewardCoupon: RewardCoupon): IRewardCouponDbModel {
    return {
      type: 'coupon',
      couponId: rewardCoupon.couponId
    }
  }
}
