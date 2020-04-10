import { OrderStatus } from './orderStatus'
import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result, Either, left, right } from '../../../shared/core/Result'

import { OrderAddress } from './orderAddress'
import { OrderItem } from './orderItem'
import { OrderCanceled } from './events/orderCanceled'
import { OrderReceived } from './events/orderReceived'
import { OrderPaymented } from './events/orderPaymented'
import { OrderShipped } from './events/orderShipped'
import { OrderCreated } from './events/orderCreated'
import { CancelOrderErrors } from '../userCases/cancelOrder/CancelOrderErrors'
import { ShippedOrderErrors } from '../userCases/shippedOrder/shippedOrderErrors'
import { ReceivedOrderErrors } from '../userCases/receivedOrder/receivedErrors'
import { PaymentOrderErrors } from '../userCases/paymentOrder/paymentOrderErrors'
import { CloseOrderErrors } from '../userCases/closeOrder/closeOrderErrors'
import { OrderClosed } from './events/orderClosed'

export type PaymentOrderResult = Either<
  PaymentOrderErrors.OrderStatusNotPaid | PaymentOrderErrors.PaymentTimeExpired | Result<any>,
  Result<void>
>
export type CloselOrderResult = Either<CloseOrderErrors.StatusError | Result<any>, Result<void>>

export type CancelOrderResult = Either<CancelOrderErrors.StatusNotUnPaid | Result<any>, Result<void>>

export type ShippedOrderResult = Either<ShippedOrderErrors.OrderNotPayment | Result<any>, Result<void>>

export type ReceivedOrderResult = Either<ReceivedOrderErrors.OrderNotShipping | Result<any>, Result<void>>

export interface OrderProps {
  userId: string
  createAt?: number
  status: OrderStatus
  price?: number
  remark?: string
  code?: string

  orderAddress: OrderAddress

  paymentTime?: number
  cancelTime?: number

  customerServiceCancelTime?: number
  customerServiceRemark?: string

  shippingTime?: number
  shippingNumber?: string
  shippingType?: string

  finishTime?: number

  closeTime?: number

  items: OrderItem[]
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

  get status(): OrderStatus {
    return this.props.status
  }

  get price(): number {
    return this.props.price
  }

  get remark(): string {
    return this.props.remark
  }

  get code(): string {
    return this.props.code
  }

  get address(): OrderAddress {
    return this.props.orderAddress
  }

  get paymentTime(): number {
    return this.props.paymentTime
  }

  get cancelTime(): number {
    return this.props.cancelTime
  }

  get customerServiceCancelTime(): number {
    return this.props.customerServiceCancelTime
  }

  get customerServiceRemark(): string {
    return this.props.customerServiceRemark
  }

  get shippingTime(): number {
    return this.props.shippingTime
  }

  get shippingNumber(): string {
    return this.props.shippingNumber
  }

  get shippingType(): string {
    return this.props.shippingType
  }

  get finishTime(): number {
    return this.props.finishTime
  }

  get closeTime(): number {
    return this.props.closeTime
  }

  get orderItems(): OrderItem[] {
    return this.props.items
  }

  public cancel(): CancelOrderResult {
    if (!this.isUnPaid()) {
      return left(new CancelOrderErrors.StatusNotUnPaid())
    }
    if (this.isAtPaymentTime()) {
      return left(new PaymentOrderErrors.PaymentTimeExpired())
    }
    this.props.cancelTime = Date.now()
    this.props.status = 'cancel'
    this.addDomainEvent(new OrderCanceled(this))

    return right(Result.ok<void>())
  }

  public close(): CloselOrderResult {
    if (!['shipping', 'shipped', 'received'].includes(this.props.status)) {
      return left(new CloseOrderErrors.StatusError())
    }
    this.props.status = 'close'
    this.props.closeTime = Date.now()
    this.addDomainEvent(new OrderClosed(this))

    return right(Result.ok<void>())
  }

  public payment(): PaymentOrderResult {
    if (!this.isUnPaid()) {
      return left(new PaymentOrderErrors.OrderStatusNotPaid())
    }

    if (!this.isAtPaymentTime()) {
      return left(new PaymentOrderErrors.PaymentTimeExpired())
    }

    this.props.paymentTime = Date.now()
    this.props.status = 'shipping'
    this.addDomainEvent(new OrderPaymented(this))
    return right(Result.ok<void>())
  }

  public shipped(shippingNumber: string, shippingType: string): ShippedOrderResult {
    if (!this.isShipping()) {
      return left(new ShippedOrderErrors.OrderNotPayment())
    }

    this.props.shippingTime = Date.now()
    this.props.status = 'shipped'
    this.props.shippingNumber = shippingNumber
    this.props.shippingType = shippingType
    this.addDomainEvent(new OrderShipped(this))
    return right(Result.ok<void>())
  }

  public received(): ReceivedOrderResult {
    if (!this.isShipped()) {
      return left(new ReceivedOrderErrors.OrderNotShipping())
    }
    this.props.finishTime = Date.now()
    this.props.status = 'received'
    this.addDomainEvent(new OrderReceived(this))
    return right(Result.ok<void>())
  }

  public isAtPaymentTime(): boolean {
    return this.props.createAt + 1000 * 60 * 15 > Date.now()
  }

  public isAllowCancel(): boolean {
    return !this.isAtPaymentTime() && this.isUnPaid()
  }

  public isShipping(): boolean {
    return this.props.status === 'shipping'
  }

  public isUnPaid(): boolean {
    return this.props.status === 'unpaid'
  }

  public isShipped(): boolean {
    return this.props.status === 'shipped'
  }

  private calculationOrderItemPriceTotal(): void {
    this.props.price = this.orderItems.reduce((acc, item) => (acc += item.price), 0)
  }

  private createOrderCode(): void {
    const padZero = num => (num < 10 ? '0' + num : '' + num)

    const now = new Date()
    let code: string = now.getFullYear() + ''
    code += padZero(now.getMonth() + 1)
    code += padZero(now.getDate())
    code += padZero(now.getHours())
    code += padZero(now.getMinutes())
    code += padZero(now.getSeconds())

    let randomLength = 6
    let random = Math.floor(Math.random() * Math.pow(10, randomLength)) + ''
    random.padStart(randomLength, '0')
    this.props.code = code + random
  }

  public static create(props: OrderProps, id?: UniqueEntityID): Result<Order> {
    const isNew = !!id === false
    const order = new Order(
      {
        ...props,
        createAt: props.createAt ? props.createAt : Date.now(),
        code: props.code ? props.code : ''
      },
      id
    )

    order.calculationOrderItemPriceTotal()
    order.createOrderCode()

    if (isNew) {
      order.addDomainEvent(new OrderCreated(order))
    }

    return Result.ok<Order>(order)
  }
}
