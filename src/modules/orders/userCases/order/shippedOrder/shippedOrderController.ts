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
      shippedType
    }

    try {
      const result = await this.useCase.execute(dto)
      let useCaseValue = result.value
      if (result.isLeft()) {
        const error = useCaseValue

        switch (error.constructor) {
          case ShippedOrderErrors.OrderNotPayment:
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
