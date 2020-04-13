import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IOrderRepo } from '../../../repos/orderRepo'
import { ShippedOrderDto } from './shippedOrderDto'
import { ShippedOrderErrors } from './shippedOrderErrors'

type Response = Either<
  | AppError.UnexpectedError | ShippedOrderErrors.OrderNotPayment | Result<any>, Result<void>>

export class ShippedOrderUseCase implements UseCase<ShippedOrderDto, Promise<Response>> {
  private orderRepo: IOrderRepo

  constructor(orderRepo: IOrderRepo) {
    this.orderRepo = orderRepo
  }

  public async execute(request: ShippedOrderDto): Promise<Response> {
    try {
      const { orderId, shippedNumber, shippedType } = request

      const order = await this.orderRepo.getById(orderId)

      if (!!order === false) {
        return left(new ShippedOrderErrors.OrderNotFound())
      }

      const result = order.shipped(shippedNumber, shippedType)
      if (result.isLeft()) {
        return result.value.getValue()
      }

      await this.orderRepo.save(order)

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
