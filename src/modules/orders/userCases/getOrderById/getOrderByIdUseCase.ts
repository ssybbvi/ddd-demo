import { Either, Result, right, left } from '../../../../shared/core/Result'
import { AppError } from '../../../../shared/core/AppError'
import { UseCase } from '../../../../shared/core/UseCase'
import { Order } from '../../domain/order'
import { IOrderRepo } from '../../repos/orderRepo'
import { GetOrderByIdDto } from './getOrderByIdDto'
import { GetOrderByIdErrors } from './getOrderByIdErrors'

type Response = Either<
  GetOrderByIdErrors.DoesNotBelongToYou |
  GetOrderByIdErrors.OrderNotFound |
  AppError.UnexpectedError | Result<any>, Result<Order>>

export class GetOrderByIdUseCase implements UseCase<GetOrderByIdDto, Promise<Response>> {
  private orderRepo: IOrderRepo

  constructor(orderRepo: IOrderRepo) {
    this.orderRepo = orderRepo
  }

  public async execute(request: GetOrderByIdDto): Promise<Response> {
    try {
      const { orderId } = request

      const order = await this.orderRepo.getById(orderId)

      if (!!order === false) {
        return left(new GetOrderByIdErrors.OrderNotFound())
      }

      // if (order.userId !== userId) {
      //   return left(new GetOrderByIdErrors.DoesNotBelongToYou())
      // }

      return right(Result.ok<Order>(order))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
