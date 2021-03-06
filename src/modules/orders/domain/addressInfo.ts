import { ValueObject } from '../../../shared/domain/ValueObject'
import { Guard, IGuardArgument } from '../../../shared/core/Guard'
import { Result } from '../../../shared/core/Result'

export interface AddressInfoProps {
  userName: string
  provinceName: string
  cityName: string
  countyName: string
  detailAddressInfo: string
  nationalCode: string
  telNumber: string
}

export class AddressInfo extends ValueObject<AddressInfoProps> {
  private constructor(props: AddressInfoProps) {
    super(props)
  }

  get userName(): string {
    return this.props.userName
  }

  get provinceName(): string {
    return this.props.provinceName
  }

  get cityName(): string {
    return this.props.cityName
  }

  get countyName(): string {
    return this.props.countyName
  }

  get detailAddressInfo(): string {
    return this.props.detailAddressInfo
  }

  get nationalCode(): string {
    return this.props.nationalCode
  }

  get telNumber(): string {
    return this.props.telNumber
  }

  public static create(props: AddressInfoProps): Result<AddressInfo> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.userName, argumentName: '收件人' },
      { argument: props.provinceName, argumentName: '省份' },
      { argument: props.cityName, argumentName: '城市' },
      { argument: props.countyName, argumentName: '区域' },
      { argument: props.detailAddressInfo, argumentName: '详细地址' },
      { argument: props.nationalCode, argumentName: '国家编码' },
      { argument: props.telNumber, argumentName: '电话号码' },
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<AddressInfo>(guardResult.message)
    }

    return Result.ok<AddressInfo>(new AddressInfo(props))
  }
}
