import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { ShippedOrderUseCase } from './shippedOrderUseCase'
import { ShippedOrderDto } from './shippedOrderDto'
import { ShippedOrderErrors } from './shippedOrderErrors'

export class ShippedOrderController extends BaseController {
  private useCase: ShippedOrderUseCase

  constructor(useCase: ShippedOrderUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    const { shippedNumber, shippedType } = req.body

    const dto: ShippedOrderDto = {
      orderId: req.body.orderId,
      shippedNumber,
      shippedType,
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
