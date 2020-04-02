import { Either, Result, right, left } from '../../../../shared/core/Result'
import { AppError } from '../../../../shared/core/AppError'
import { UseCase } from '../../../../shared/core/UseCase'
import { IOrderRepo } from '../../repos/orderRepo'
import { IFundAccountRepo } from '../../../funds/repos/iFundAccountRepo'
import { ShippingOrderDto } from './shippingOrderDto'

type Response = Either<
  | AppError.UnexpectedError | Result<any>, Result<void>>

export class ShippingOrderUseCase implements UseCase<ShippingOrderDto, Promise<Response>> {
  private orderRepo: IOrderRepo

  constructor(orderRepo: IOrderRepo) {
    this.orderRepo = orderRepo
  }

  public async execute(request: ShippingOrderDto): Promise<Response> {
    try {
      const { orderId, shippingNumber, shippingType } = request

      const order = await this.orderRepo.getById(orderId)

      order.shipped(shippingNumber, shippingType)

      await this.orderRepo.save(order)

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
