import { ValueObject } from "../../../shared/domain/ValueObject";
import { Guard, IGuardArgument } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { CancelInfoType } from "./cancelInfoType";

export interface ICancelInfoProps {
  type: CancelInfoType
  time?: number
  remark: string
}


export class CancelInfo extends ValueObject<ICancelInfoProps>{
  private constructor(props: ICancelInfoProps) {
    super(props);
  }

  get type(): CancelInfoType {
    return this.props.type
  }

  get time(): number {
    return this.props.time
  }

  get remark(): string {
    return this.props.remark
  }

  public static createByAutoCancel(remark: string = "") {
    return this.create({
      type: 'auto',
      remark: remark
    })
  }

  public static createByAutoUser(remark: string = "") {
    return this.create({
      type: 'user',
      remark: remark
    })
  }

  public static createByAutoAdmin(remark: string = "") {
    return this.create({
      type: 'admin',
      remark: remark
    })
  }

  public static create(props: ICancelInfoProps): Result<CancelInfo> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.type, argumentName: '取消类型' },
      { argument: props.remark, argumentName: '取消备注' }
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<CancelInfo>(guardResult.message)
    }

    const model = new CancelInfo(
      {
        ...props,
        time: props.time ? props.time : Date.now(),
        remark: props.time ? props.remark : "",
      }
    )

    return Result.ok<CancelInfo>(model);
  }
}