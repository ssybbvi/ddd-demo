import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { CouponUser } from '../domain/couponUser'

import { ICouponUserDbModel } from '../dbModels/couponUserDbModel'
import { ICouponUserDto } from '../dtos/couponUserDto'
import { couponIdToDto } from '../infra/decorators/couponDecorators'

export class CouponUserMap implements IMapper<CouponUser> {
  public static async toListDto(couponUserList: CouponUser[]): Promise<ICouponUserDto[]> {
    const dtoList = []
    for (let item of couponUserList) {
      dtoList.push(await this.toDTO(item))
    }
    return dtoList
  }

  //@couponIdToDto()
  public static async toDTO(couponUser: CouponUser): Promise<ICouponUserDto> {
    return {
      couponId: couponUser.couponId,
      userId: couponUser.userId,
      isUse: couponUser.isUse,
      useAt: couponUser.useAt,
    }
  }

  public static toDomain(raw: ICouponUserDbModel): CouponUser {
    const couponUserOrError = CouponUser.create(
      {
        couponId: raw.couponId,
        userId: raw.userId,
        isUse: raw.isUse,
        useAt: raw.useAt,
      },
      new UniqueEntityID(raw._id)
    )

    couponUserOrError.isFailure ? console.log(couponUserOrError.error) : ''
    return couponUserOrError.isSuccess ? couponUserOrError.getValue() : null
  }

  public static toPersistence(couponUser: CouponUser): ICouponUserDbModel {
    return {
      _id: couponUser.id.toString(),
      couponId: couponUser.couponId,
      userId: couponUser.userId,
      isUse: couponUser.isUse,
      useAt: couponUser.useAt,
    }
  }
}
