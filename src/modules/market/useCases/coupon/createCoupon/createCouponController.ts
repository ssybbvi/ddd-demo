import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { CreateCouponUseCase } from './createCouponUseCase'
import { ICreateCouponDto } from './createCouponDto'

export class CreateCouponController extends BaseController {
  private useCase: CreateCouponUseCase

  constructor(useCase: CreateCouponUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    try {
      const dto = req.body as ICreateCouponDto

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
