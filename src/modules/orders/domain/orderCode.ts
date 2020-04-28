import { ValueObject } from "../../../shared/domain/ValueObject";
import { Guard, IGuardArgument } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";

export interface IOrderCodeProps {
  code?: string
}

export class OrderCode extends ValueObject<IOrderCodeProps>{
  private constructor(props: IOrderCodeProps) {
    super(props);
  }

  get code(): string {
    return this.props.code
  }


  private static createOrderCode(): string {
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
    return code + random
  }

  public static create(props: IOrderCodeProps): Result<OrderCode> {

    const model = new OrderCode({
      ...props,
      code: props.code ? props.code : this.createOrderCode()
    })
    return Result.ok<OrderCode>(model);
  }
}