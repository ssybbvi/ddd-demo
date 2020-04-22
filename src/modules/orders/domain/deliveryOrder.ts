import { Entity } from "../../../shared/domain/Entity";
import { OrderAddress } from "./orderAddress";
import { Result } from "../../../shared/core/Result";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Guard } from "../../../shared/core/Guard";

export interface IDeliveryOrderProps {
  orderId: string
  address: OrderAddress
  beginAt?: number
  code?: string
  finishAt?: number
  deliveryType?: string

}


export class DeliveryOrder extends Entity<IDeliveryOrderProps> {

  get deliveryOrderId(): string {
    return this._id.toString()
  }

  get orderId(): string {
    return this.props.orderId
  }

  get address(): OrderAddress {
    return this.props.address
  }

  get beginAt(): number {
    return this.props.beginAt
  }

  get code(): string {
    return this.props.code
  }

  get finishAt(): number {
    return this.props.finishAt
  }

  get deliveryType(): string {
    return this.props.deliveryType
  }

  public static create(props: IDeliveryOrderProps, id?: UniqueEntityID): Result<DeliveryOrder> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.orderId, argumentName: 'orderId' },
      { argument: props.address, argumentName: 'address' },
    ]);

    if (!nullGuard.succeeded) {
      return Result.fail<DeliveryOrder>(nullGuard.message);
    }

    const isNew = !!id === false;

    const defaultProps: IDeliveryOrderProps = {
      ...props,
    }

    const model = new DeliveryOrder(defaultProps, id);

    if (isNew) {

    }

    return Result.ok<DeliveryOrder>(model);

  }
}

