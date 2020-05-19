import { CommonRedisClient } from '../../../../shared/infra/database/redis/commonRedisClient'
import { left } from '../../../../shared/core/Result'
import { Coupon } from '../../domain/coupon'
import { CouponMap } from '../../mappers/couponMap'
import { CouponDto } from '../../dtos/couponDto'
import { GetCouponListUseCase } from '../../useCases/coupon/getCouponList/getCouponListUseCase'

export class CouponDtoCache {
  private useCase: GetCouponListUseCase
  private commonRedisClient: CommonRedisClient
  constructor(useCase: GetCouponListUseCase, commonRedisClient: CommonRedisClient) {
    this.useCase = useCase
    this.commonRedisClient = commonRedisClient
  }

  private format(userId: string) {
    return `dto.${this.constructor.name}.${userId}`
  }

  public async load() {
    const couponListUseCase = await this.useCase.execute({})
    const couponListUseCaseResult = couponListUseCase.value
    if (couponListUseCase.isLeft()) {
      return left(couponListUseCase)
    }
    const couponList = couponListUseCaseResult.getValue()
    couponList.forEach((item) => {
      this.set(item)
    })
  }

  public async set(coupon: Coupon) {
    let dto = await CouponMap.toDTO(coupon)
    this.commonRedisClient.set(this.format(dto._id), JSON.stringify(dto))
  }

  public async getValue(userId: string): Promise<CouponDto | null> {
    const value = await this.commonRedisClient.getOne<string>(this.format(userId))
    return JSON.parse(value)
  }
}
