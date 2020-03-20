import { BaseController } from '../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { CreateOrderUseCase } from './createOrderUseCase'
import { CreateOrderDto } from './createOrderDto'
import { CreateOrderErrors } from './createOrderErrors'
import { DecodedExpressRequest } from '../../../users/infra/http/models/decodedRequest'
import { Order } from '../../domain/order'
import { OrderMap } from '../../mappers/orderMap'
import { OrderDto } from '../../dtos/orderDto'



export class CreateOrderController extends BaseController {
  private useCase: CreateOrderUseCase

  constructor(useCase: CreateOrderUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded;
    const dto: CreateOrderDto = req.body as CreateOrderDto
    dto.memberId=userId

    try {
      const result = await this.useCase.execute(dto)
      let useCaseValue = result.value
      if (result.isLeft()) {
        const error = useCaseValue

        switch (error.constructor) {
          case CreateOrderErrors.CommodityNotFound:
            return this.notFound(res, error.errorValue().message)
          case CreateOrderErrors.OrderItemNotNull:
              return this.notFound(res, error.errorValue().message)
          default:
            return this.fail(res, error.errorValue() + '')
        }
      }

      const order=  useCaseValue.getValue() as Order
      const orderDto= OrderMap.toDTO(order)
      return this.ok<OrderDto>(res,orderDto)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
