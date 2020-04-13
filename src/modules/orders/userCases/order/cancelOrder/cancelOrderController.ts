import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { CancelOrderUseCase } from './cancelOrderUseCase'
import { CancelOrderDto } from './cancelOrderDto'
import { CancelOrderErrors } from './CancelOrderErrors'



export class CancelOrderController extends BaseController {
  private useCase: CancelOrderUseCase

  constructor(useCase: CancelOrderUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    const dto: CancelOrderDto = { orderId: req.body.orderId }

    try {
      const result = await this.useCase.execute(dto)
      let useCaseValue = result.value
      if (result.isLeft()) {
        const error = useCaseValue

        switch (error.constructor) {
          case CancelOrderErrors.OrderNotFound:
            return this.notFound(res, error.errorValue().message)
          case CancelOrderErrors.StatusNotUnPaid:
            return this.notFound(res, error.errorValue().message)
          default:
            return this.fail(res, error.errorValue() + '')
        }
      }

      return this.ok<void>(res)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
