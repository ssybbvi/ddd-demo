import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { GetOrderByIdUseCase } from './getOrderByIdUseCase'
import { GetOrderByIdDto } from './getOrderByIdDto'
import { GetOrderByIdErrors } from './getOrderByIdErrors'
import { OrderDto } from '../../../dtos/orderDto'
import { Order } from '../../../domain/order'
import { OrderMap } from '../../../mappers/orderMap'

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

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      }
      const order = result.value.getValue() as Order
      const orderDto = await OrderMap.toDTO(order)
      return this.ok<OrderDto>(res, orderDto)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
