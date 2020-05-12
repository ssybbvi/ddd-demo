import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { ReceiveCouponUseCase } from './receiveCouponUseCase'
import { ReceiveCouponDto } from './receiveCouponDto'

export class ReceiveCouponController extends BaseController {
  private useCase: ReceiveCouponUseCase

  constructor(useCase: ReceiveCouponUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    try {
      const dto = req.body as ReceiveCouponDto

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


