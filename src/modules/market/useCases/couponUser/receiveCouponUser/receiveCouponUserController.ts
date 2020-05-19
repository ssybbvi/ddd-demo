import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { ReceiveCouponUserUseCase } from './receiveCouponUserUseCase'
import { ReceiveCouponUserDto } from './receiveCouponUserDto'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'

export class ReceiveCouponUserController extends BaseController {
  private useCase: ReceiveCouponUserUseCase

  constructor(useCase: ReceiveCouponUserUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    try {
      const { userId } = req.decoded
      const dto = req.body as ReceiveCouponUserDto
      dto.userId = userId

      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      }
      return this.ok<void>(res)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
