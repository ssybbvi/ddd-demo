import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { GetCouponListUseCase } from './getCouponListUseCase'
import { GetCouponListDto } from './getCouponListDto'
import { CouponDto } from '../../../dtos/couponDto'
import { Coupon } from '../../../domain/coupon'
import { CouponMap } from '../../../mappers/couponMap'

export class GetCouponListController extends BaseController {
  private useCase: GetCouponListUseCase

  constructor(useCase: GetCouponListUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    try {
      const dto = req.body as GetCouponListDto

      const result = await this.useCase.execute(dto)
      const resultValue = result.value
      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      }

      const couponList = resultValue.getValue() as Coupon[]
      const couponDtoList = await CouponMap.toListDto(couponList)
      return this.ok(res, couponDtoList)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
