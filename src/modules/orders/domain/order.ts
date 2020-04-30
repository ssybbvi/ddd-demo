import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result, Either, left, right } from '../../../shared/core/Result'

import { OrderCanceled } from './events/orderCanceled'
import { OrderReceived } from './events/orderReceived'
import { OrderPaymented } from './events/orderPaymented'
import { OrderShipped } from './events/orderShipped'
import { OrderCreated } from './events/orderCreated'
import { DeliveryInfo } from './deliveryInfo'
import { CancelInfo } from './cancelInfo'
import { PaymentInfo } from './paymentInfo'
import { UseCaseError } from '../../../shared/core/UseCaseError'
import { OrderCode } from './orderCode'
import { CommodityItems } from './commodityItems'
import { AppError } from '../../../shared/core/AppError'




export class ExpectPaidError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: `订单未支付`
    } as UseCaseError)
  }
}

export class ExpectNotPaidError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: `订单已支付`
    } as UseCaseError)
  }
}

export class UnableToPaidError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: `积分不足无法支付`
    } as UseCaseError)
  }
}

export class ExpectPaymentTimeExpiredError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: `支付时间未过期`
    } as UseCaseError)
  }
}

export class ExpectPaymentTimeNotExpiredError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: `支付时间已过期`
    } as UseCaseError)
  }
}


export class DoesNotBelongToYouError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: `该订单不属于你`
    } as UseCaseError)
  }
}

export class AlreadyCanceledError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: `订单已经取消`
    } as UseCaseError)
  }
}


export interface OrderProps {
  userId: string
  createAt?: number
  totalAmount?: number
  remark?: string
  code?: OrderCode

  cancelInfo?: CancelInfo
  paymentInfo?: PaymentInfo
  deliveryInfo: DeliveryInfo
  commodityItems: CommodityItems
}

export class Order extends AggregateRoot<OrderProps> {
  private constructor(props: OrderProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get userId(): string {
    return this.props.userId
  }

  get createAt(): number {
    return this.props.createAt
  }

  get totalAmount(): number {
    return this.props.totalAmount
  }

  get remark(): string {
    return this.props.remark
  }

  get code(): OrderCode {
    return this.props.code
  }

  get cancelInfo(): CancelInfo {
    return this.props.cancelInfo
  }

  get paymentInfo(): PaymentInfo {
    return this.props.paymentInfo
  }

  get deliveryInfo(): DeliveryInfo {
    return this.props.deliveryInfo
  }

  get commodityItems(): CommodityItems {
    return this.props.commodityItems
  }

  public autoCancel() {
    if (this.paymentInfo) {
      return left(new ExpectNotPaidError())
    }
    if (this.isAtPaymentTime()) {
      return left(new ExpectPaymentTimeExpiredError())
    }

    const cancelInfoResult = CancelInfo.createByAutoCancel()
    if (cancelInfoResult.isFailure) {
      return left(cancelInfoResult)
    }
    this.props.cancelInfo = cancelInfoResult.getValue()
    this.addDomainEvent(new OrderCanceled(this))
    return right(Result.ok<void>())
  }

  public cancel(): Either<AlreadyCanceledError | Result<any>, Result<void>> {
    if (this.cancelInfo) {
      return left(new AlreadyCanceledError())
    }

    const cancelInfoResult = CancelInfo.createByAutoUser()
    if (cancelInfoResult.isFailure) {
      return left(cancelInfoResult)
    }
    this.props.cancelInfo = cancelInfoResult.getValue()
    this.addDomainEvent(new OrderCanceled(this))

    return right(Result.ok<void>())
  }

  public close() {
    if (this.cancelInfo) {
      return left(new AlreadyCanceledError())
    }

    const cancelInfoResult = CancelInfo.createByAutoAdmin()
    if (cancelInfoResult.isFailure) {
      return left(cancelInfoResult)
    }
    this.props.cancelInfo = cancelInfoResult.getValue()
    this.addDomainEvent(new OrderCanceled(this))
    return right(Result.ok<void>())
  }

  public payment(userId: string, accountAmount: number) {
    if (this.paymentInfo) {
      return left(new ExpectNotPaidError())
    }

    if (!this.isAtPaymentTime()) {
      return left(new ExpectPaymentTimeNotExpiredError())
    }

    if (this.props.userId !== userId) {
      return left(new DoesNotBelongToYouError())
    }

    if (accountAmount < this.props.totalAmount) {
      return left(new UnableToPaidError())
    }

    const paymentInfoResult = PaymentInfo.create({ amount: this.props.totalAmount })
    if (paymentInfoResult.isFailure) {
      return left(paymentInfoResult)
    }
    this.props.paymentInfo = paymentInfoResult.getValue()
    this.addDomainEvent(new OrderPaymented(this))
    return right(Result.ok<void>())
  }

  public shipped(shippingNumber: string, shippingType: string) {
    if (!this.paymentInfo) {
      return left(new ExpectPaidError())
    }

    const shippedResult = this.deliveryInfo.shipped(shippingNumber, shippingType)
    if (shippedResult.isLeft()) {
      return left(shippedResult)
    }
    this.addDomainEvent(new OrderShipped(this))
    return right(Result.ok<void>())
  }

  public received() {
    const shippedResult = this.deliveryInfo.received()
    if (shippedResult.isLeft()) {
      return left(shippedResult)
    }
    this.addDomainEvent(new OrderReceived(this))
    return right(Result.ok<void>())
  }

  public isAtPaymentTime(): boolean {
    return this.props.createAt + 1000 * 60 * 15 > Date.now()
  }


  private calculationCommodityItemAmountTotal(): void {
    this.props.totalAmount = this.commodityItems.getItems().reduce((acc, item) => (acc += item.amount), 0)
  }

  public static create(props: OrderProps, id?: UniqueEntityID): Result<Order> {

    const isNew = !!id === false
    const order = new Order(
      {
        ...props,
        createAt: props.createAt ? props.createAt : Date.now(),
        code: props.code ? props.code : OrderCode.create({}).getValue()
      },
      id
    )

    order.calculationCommodityItemAmountTotal()

    if (isNew) {
      order.addDomainEvent(new OrderCreated(order))
    }

    return Result.ok<Order>(order)
  }
}
