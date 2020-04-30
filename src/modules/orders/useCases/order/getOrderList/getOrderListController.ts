import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { GetOrderListUseCase } from './getOrderListUseCase'
import { GetOrderListDto } from './getOrderListDto'
import { OrderDto } from '../../../dtos/orderDto'
import { Order } from '../../../domain/order'
import { OrderMap } from '../../../mappers/orderMap'

export class GetOrderListController extends BaseController {
  private useCase: GetOrderListUseCase

  constructor(useCase: GetOrderListUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const decoded = req.decoded;
    const dto: GetOrderListDto = {
      userId: decoded ? decoded.userId : null
    }

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          default:
            return this.fail(res, error.errorValue())
        }
      }
      const orderList = result.value.getValue() as Order[]
      const orderDtoList = await OrderMap.toListDto(orderList)
      return this.ok<OrderDto[]>(res, orderDtoList)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
