import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { Order } from '../../../domain/order'
import { IOrderRepo } from '../../../repos/orderRepo'
import { GetOrderListDto } from './getOrderListDto'

type Response = Either<
  | AppError.UnexpectedError, Result<Order[]>>

export class GetOrderListUseCase implements UseCase<GetOrderListDto, Promise<Response>> {
  private orderRepo: IOrderRepo

  constructor(orderRepo: IOrderRepo) {
    this.orderRepo = orderRepo
  }

  public async execute(request: GetOrderListDto): Promise<Response> {
    try {
      const {
        userId
      } = request

      const list = await this.orderRepo.filter(userId)
      return right(Result.ok<Order[]>(list))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
