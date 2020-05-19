import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { GetCouponUserListUseCase } from './getCouponUserListUseCase'
import { GetCouponUserListDto } from './getCouponUserListDto'
import { CouponUserMap } from '../../../mappers/couponUserMap'
import { ICouponUserDto } from '../../../dtos/couponUserDto'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'

export class GetCouponUserListController extends BaseController {
  private useCase: GetCouponUserListUseCase

  constructor(useCase: GetCouponUserListUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    try {
      const { userId } = req.decoded
      const dto = req.body as GetCouponUserListDto
      dto.userId = userId

      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      }

      const couponUserList = result.value.getValue()
      const couponUserDtoList = await CouponUserMap.toListDto(couponUserList)
      return this.ok<ICouponUserDto[]>(res, couponUserDtoList)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
