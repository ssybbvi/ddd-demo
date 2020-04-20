import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IOrderRepo } from '../../../repos/orderRepo'

import { CreateOrderErrors } from '../createOrder/createOrderErrors'
import { AutoCancelOrderDto } from './autoCancelOrderDto'

type Response = Either<CreateOrderErrors.OrderItemNotNull

  | AppError.UnexpectedError, Result<void>>

export class AutoCancelOrderUseCase implements UseCase<AutoCancelOrderDto, Promise<Response>> {
  private orderRepo: IOrderRepo

  constructor(orderRepo: IOrderRepo) {
    this.orderRepo = orderRepo
  }

  public async execute(request: AutoCancelOrderDto): Promise<Response> {
    try {
      const list = await this.orderRepo.filter('unpaid')
      for (const item of list) {
        let result = item.autoCancel()
        if (result.isRight()) {
          this.orderRepo.save(item)
        }
      }
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
