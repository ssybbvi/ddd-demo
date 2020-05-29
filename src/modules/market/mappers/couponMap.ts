import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Coupon } from '../domain/coupon'
import { CouponDto } from '../dtos/couponDto'
import { ICouponDbModel } from '../dbModels/couponDbModel'

export class CouponMap implements IMapper<Coupon> {
  public static toListDto(couponList: Coupon[]) {
    let couponDtoList = []
    for (let item of couponList) {
      couponDtoList.push(this.toDTO(item))
    }
    return couponDtoList
  }

  public static toDTO(coupon: Coupon): CouponDto {
    return {
      _id: coupon.id.toString(),
      name: coupon.name,
      receiveTotal: coupon.receiveTotal,
      userReceiveLimit: coupon.userReceiveLimit,
      publishTotal: coupon.publishTotal,
    }
  }

  public static toDomain(raw: ICouponDbModel): Coupon {
    const couponOrError = Coupon.create(
      {
        name: raw.name,
        receiveTotal: raw.receiveTotal,
        userReceiveLimit: raw.userReceiveLimit,
        publishTotal: raw.publishTotal,
      },
      new UniqueEntityID(raw._id)
    )

    couponOrError.isFailure ? console.log(couponOrError.error) : ''
    return couponOrError.isSuccess ? couponOrError.getValue() : null
  }

  public static toPersistence(coupon: Coupon): ICouponDbModel {
    return {
      _id: coupon.id.toString(),
      name: coupon.name,
      receiveTotal: coupon.receiveTotal,
      userReceiveLimit: coupon.userReceiveLimit,
      publishTotal: coupon.publishTotal,
    }
  }
}
