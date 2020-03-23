import { BaseController } from '../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../users/infra/http/models/decodedRequest'
import { GetOrderListUseCase } from './getOrderListUseCase'
import { GetOrderListDto } from './getOrderListDto'
import { OrderDto } from '../../dtos/orderDto'
import { Order } from '../../domain/order'
import { OrderMap } from '../../mappers/orderMap'

export class GetOrderListController extends BaseController {
  private useCase: GetOrderListUseCase

  constructor(useCase: GetOrderListUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded;
    const dto: GetOrderListDto ={
        orderStatus:req.query.orderStatus,
        userId:userId
    }

    try {
      const result = await this.useCase.execute(dto)
      let useCaseValue = result.value
      if (result.isLeft()) {
        const error = useCaseValue

        switch (error.constructor) {
          default:
            return this.fail(res, error.errorValue() + '')
        }
      }
      const orderList=useCaseValue.getValue() as Order[]
      const orderDtoList=orderList.map(item=>OrderMap.toDTO(item))
        return this.ok<OrderDto[]>(res,orderDtoList)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
