import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { ReceivedOrderUseCase } from './receivedOrderUseCase'
import { ReceivedOrderDto } from './receivedOrderDto'
import { ReceivedOrderErrors } from './receivedErrors'

export class ReceivedOrderController extends BaseController {
  private useCase: ReceivedOrderUseCase

  constructor(useCase: ReceivedOrderUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    //const { shippingNumber, shippingType } = req.body

    const dto: ReceivedOrderDto = {
      orderId: req.body.orderId,
    }

    try {
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
