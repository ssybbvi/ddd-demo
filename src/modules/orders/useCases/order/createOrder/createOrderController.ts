import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { CreateOrderUseCase } from './createOrderUseCase'
import { CreateOrderDto } from './createOrderDto'
import { CreateOrderErrors } from './createOrderErrors'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { Order } from '../../../domain/order'
import { OrderMap } from '../../../mappers/orderMap'
import { OrderDto } from '../../../dtos/orderDto'
import { DotBuyRepeatOnceCommodityError } from '../../../domain/orderUser'
import { NotFoundError } from '../../../../../shared/core/NotFoundError'

export class CreateOrderController extends BaseController {
  private useCase: CreateOrderUseCase

  constructor(useCase: CreateOrderUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded
    const dto: CreateOrderDto = req.body as CreateOrderDto
    dto.userId = userId

    try {
      const result = await this.useCase.execute(dto)
      const value = result.value
      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      }

      const order = value.getValue() as Order
      const orderDto = await OrderMap.toDTO(order)
      return this.ok<OrderDto>(res, orderDto)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
