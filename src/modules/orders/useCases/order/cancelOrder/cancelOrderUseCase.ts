import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IOrderRepo } from '../../../repos/orderRepo'

import { CancelOrderDto } from './cancelOrderDto'
import { AlreadyCanceledError } from '../../../domain/order'
import { NotFoundError } from '../../../../../shared/core/NotFoundError'

type Response = Either<
  AlreadyCanceledError |
  Result<any> |
  AppError.UnexpectedError, Result<void>>

export class CancelOrderUseCase implements UseCase<CancelOrderDto, Promise<Response>> {
  private orderRepo: IOrderRepo

  constructor(orderRepo: IOrderRepo) {
    this.orderRepo = orderRepo
  }

  public async execute(request: CancelOrderDto): Promise<Response> {
    try {
      const { orderId } = request
      const order = await this.orderRepo.getById(orderId)
      if (!order) {
        return left(new NotFoundError())
      }
      let result = order.cancel()
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
