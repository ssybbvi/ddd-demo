import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IOrderRepo } from '../../../repos/orderRepo'
import { PaymentOrderDto } from './paymentOrderDto'
import { PaymentOrderErrors } from './paymentOrderErrors'
import { IFundAccountRepo } from '../../../../funds/repos/iFundAccountRepo'

type Response = Either<
  PaymentOrderErrors.OrderNotFound |
  PaymentOrderErrors.OrderStatusNotPaid |
  PaymentOrderErrors.UnableToPaid |
  PaymentOrderErrors.DoesNotBelongToYou
  | AppError.UnexpectedError, Result<void>>

export class PaymentOrderUseCase implements UseCase<PaymentOrderDto, Promise<Response>> {
  private orderRepo: IOrderRepo
  private fundAccountRepo: IFundAccountRepo

  constructor(orderRepo: IOrderRepo, fundAccountRepo: IFundAccountRepo) {
    this.orderRepo = orderRepo
    this.fundAccountRepo = fundAccountRepo
  }

  public async execute(request: PaymentOrderDto): Promise<Response> {
    try {
      const { userId, orderId } = request
      const order = await this.orderRepo.getById(orderId)
      if (!!order === false) {
        return left(new PaymentOrderErrors.OrderNotFound())
      }

      if (order.userId !== userId) {
        return left(new PaymentOrderErrors.DoesNotBelongToYou())
      }

      const paymentResult = order.payment()
      if (paymentResult.isLeft()) {
        return left(paymentResult.value)
      }

      const fundAccount = await this.fundAccountRepo.getById(userId)
      if (fundAccount.totalAmounnt < order.price) {
        return left(new PaymentOrderErrors.UnableToPaid())
      }

      await this.orderRepo.save(order)

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
