import { ValueObject } from '../../../shared/domain/ValueObject'
import { Result } from '../../../shared/core/Result'
import { Guard } from '../../../shared/core/Guard'

export interface IFundAmountProps {
  fundAmount: number
}

export class FundAmount extends ValueObject<IFundAmountProps> {
  private constructor(prop: IFundAmountProps) {
    super(prop)
  }

  get value(): number {
    return this.props.fundAmount
  }

  public static create(props: IFundAmountProps): Result<FundAmount> {
    const fundAmountOrNull = Guard.againstNullOrUndefined(props.fundAmount, '租户名称')
    if (!fundAmountOrNull.succeeded) {
      return Result.fail<FundAmount>(fundAmountOrNull.message)
    }

    const fundAmountGreaterThan = Guard.greaterThan(1, props.fundAmount)
    if (!fundAmountGreaterThan.succeeded) {
      return Result.fail<FundAmount>(fundAmountGreaterThan.message)
    }

    return Result.ok<FundAmount>(new FundAmount(props))
  }
}
