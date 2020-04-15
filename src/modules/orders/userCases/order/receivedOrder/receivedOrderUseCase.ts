import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IOrderRepo } from '../../../repos/orderRepo'
import { ReceivedOrderDto } from './receivedOrderDto'
import { ReceivedOrderErrors } from './receivedErrors'

type Response = Either<
  | AppError.UnexpectedError | ReceivedOrderErrors.OrderNotShipping, Result<void>>

export class ReceivedOrderUseCase implements UseCase<ReceivedOrderDto, Promise<Response>> {
  private orderRepo: IOrderRepo

  constructor(orderRepo: IOrderRepo) {
    this.orderRepo = orderRepo
  }

  public async execute(request: ReceivedOrderDto): Promise<Response> {
    try {
      const { orderId } = request

      const order = await this.orderRepo.getById(orderId)

      if (!!order === false) {
        return left(new ReceivedOrderErrors.OrderNotFound())
      }

      const result = order.received()
      if (result.isLeft()) {
        return left(result.value)
      }

      await this.orderRepo.save(order)

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
