import { Either, Result, right, left } from '../../../../shared/core/Result'
import { AppError } from '../../../../shared/core/AppError'
import { UseCase } from '../../../../shared/core/UseCase'
import { Order } from '../../domain/order'
import { IOrderRepo } from '../../repos/orderRepo'
import { OrderStatus } from '../../domain/orderStatus'
import { PaymentOrderDto } from './paymentOrderDto'
import { PaymentOrderErrors } from './paymentOrderErrors'
import { IFundAccountRepo } from '../../../funds/repos/iFundAccountRepo'

type Response = Either< 
PaymentOrderErrors.OrderNotFound|
PaymentOrderErrors.OrderStatusNotPaid|
PaymentOrderErrors.UnableToPaid |
PaymentOrderErrors.DoesNotBelongToYou
| AppError.UnexpectedError | Result<any>, Result<void>>

export class PaymentOrderUseCase implements UseCase<PaymentOrderDto, Promise<Response>> {
  private orderRepo: IOrderRepo
  private fundAccountRepo:IFundAccountRepo

  constructor(orderRepo: IOrderRepo ,fundAccountRepo:IFundAccountRepo) {
    this.orderRepo = orderRepo
    this.fundAccountRepo=fundAccountRepo
  }

  public async execute(request: PaymentOrderDto): Promise<Response> {
    try {
      const { memberId,orderId  } = request

      const order=await this.orderRepo.getById(orderId)

      if(!!order===false){
        return left(new PaymentOrderErrors.OrderNotFound())
      }

      let lastPaymentTime=Date.now()-1000* 60 *15
      if(order.createAt<lastPaymentTime){
        return left(new PaymentOrderErrors.OrderNotFound())
      }

      if(order.memberId!==memberId){
        return left(new PaymentOrderErrors.DoesNotBelongToYou())
      }

      if(order.status!=="unpaid"){
          return left(new PaymentOrderErrors.OrderStatusNotPaid())
      }
     
      const fundAccount=await  this.fundAccountRepo.getById(memberId)
      if(fundAccount.totalAmounnt<order.price){
        return left(new PaymentOrderErrors.OrderStatusNotPaid())
      }

      order.payment()
      await this.orderRepo.save(order)

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}