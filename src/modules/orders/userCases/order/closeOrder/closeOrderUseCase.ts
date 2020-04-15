import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IOrderRepo } from '../../../repos/orderRepo'

import { CreateOrderErrors } from '../createOrder/createOrderErrors'
import { CloseOrderDto } from './closeOrderDto'

type Response = Either<CreateOrderErrors.OrderItemNotNull

  | AppError.UnexpectedError, Result<void>>

export class CloseOrderUseCase implements UseCase<CloseOrderDto, Promise<Response>> {
  private orderRepo: IOrderRepo

  constructor(orderRepo: IOrderRepo) {
    this.orderRepo = orderRepo
  }

  public async execute(request: CloseOrderDto): Promise<Response> {
    try {
      const { orderId } = request
      const order = await this.orderRepo.getById(orderId)
      let result = order.close()
      if (result.isLeft()) {
        return left(result.value)
      }
      this.orderRepo.save(order)
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
