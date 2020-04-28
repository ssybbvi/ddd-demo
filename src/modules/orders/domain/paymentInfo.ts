import { ValueObject } from "../../../shared/domain/ValueObject";
import { Guard, IGuardArgument } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";

export interface IPaymentInfoProps {
  amount: number
  time?: number
  remark?: string
}


export class PaymentInfo extends ValueObject<IPaymentInfoProps>{
  private constructor(props: IPaymentInfoProps) {
    super(props);
  }

  get amount(): number {
    return this.props.amount
  }

  get time(): number {
    return this.props.time
  }

  get remark(): string {
    return this.props.remark
  }


  public static create(props: IPaymentInfoProps): Result<PaymentInfo> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.amount, argumentName: '支付金额' },
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<PaymentInfo>(guardResult.message)
    }

    const model = new PaymentInfo({
      ...props,
      time: props.time ? props.time : Date.now(),
      remark: props.time ? props.remark : ""
    })

    return Result.ok<PaymentInfo>(model);
  }
}