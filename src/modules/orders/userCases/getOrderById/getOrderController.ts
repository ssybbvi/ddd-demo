import { BaseController } from '../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../users/infra/http/models/decodedRequest'
import { GetOrderByIdUseCase } from './getOrderByIdUseCase'
import { GetOrderByIdDto } from './getOrderByIdDto'
import { GetOrderByIdErrors } from './getOrderByIdErrors'
import { OrderDto } from '../../dtos/orderDto'
import { Order } from '../../domain/order'
import { OrderMap } from '../../mappers/orderMap'

export class GetOrderByIdController extends BaseController {
  private useCase: GetOrderByIdUseCase

  constructor(useCase: GetOrderByIdUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    //const { userId } = req.decoded;
    const dto: GetOrderByIdDto = {
      orderId: req.params.orderId,
      //userId: userId
    }

    try {
      const result = await this.useCase.execute(dto)
      let useCaseValue = result.value
      if (result.isLeft()) {
        const error = useCaseValue

        switch (error.constructor) {
          case GetOrderByIdErrors.DoesNotBelongToYou:
            return this.notFound(res, error.errorValue().message)
          case GetOrderByIdErrors.OrderNotFound:
            return this.notFound(res, error.errorValue().message)
          default:
            return this.fail(res, error.errorValue() + '')
        }
      }
      const order = useCaseValue.getValue() as Order
      const orderDto = OrderMap.toDTO(order)
      return this.ok<OrderDto>(res, orderDto)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
