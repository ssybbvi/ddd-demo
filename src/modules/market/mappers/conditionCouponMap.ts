import { IMapper } from '../../../shared/infra/Mapper'
import { ConditionCoupon } from '../domain/conditionCoupon'
import { IConditionCouponDbModel } from '../dbModels/conditionCouponDbModel'
import { IConditionCouponDto } from '../dtos/conditionCouponDto'



export class ConditionCouponMap implements IMapper<ConditionCoupon> {
  public static toDTO(conditionCoupon: ConditionCoupon): IConditionCouponDto {
    return {
      type: 'coupon',
      couponId: conditionCoupon.couponId
    }
  }

  public static toDomain(raw: IConditionCouponDbModel): ConditionCoupon {
    const conditionCouponOrError = ConditionCoupon.create(
      {
        type: 'coupon',
        couponId: raw.couponId
      }
    )

    conditionCouponOrError.isFailure ? console.log(conditionCouponOrError.error) : ''
    return conditionCouponOrError.isSuccess ? conditionCouponOrError.getValue() : null
  }

  public static toPersistence(conditionCoupon: ConditionCoupon): IConditionCouponDbModel {
    return {
      type: 'coupon',
      couponId: conditionCoupon.couponId
    }
  }
}
