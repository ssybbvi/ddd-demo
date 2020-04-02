import { BaseController } from '../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { ShippingOrderUseCase } from './shippingOrderUseCase'
import { ShippingOrderDto } from './shippingOrderDto'
import { ShippingOrderErrors } from './shippingOrderErrors'

export class ShippingOrderController extends BaseController {
  private useCase: ShippingOrderUseCase

  constructor(useCase: ShippingOrderUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {

    const { shippingNumber, shippingType } = req.body

    const dto: ShippingOrderDto = {
      orderId: req.body.orderId,
      shippingNumber,
      shippingType
    }

    try {
      const result = await this.useCase.execute(dto)
      let useCaseValue = result.value
      if (result.isLeft()) {
        const error = useCaseValue

        switch (error.constructor) {
          case ShippingOrderErrors.OrderNotPayment:
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
