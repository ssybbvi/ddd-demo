import { ValueObject } from "../../../shared/domain/ValueObject"
import { Result } from "../../../shared/core/Result"
import { Guard } from "../../../shared/core/Guard"

export interface ICommodityAmountProps {
  amount: number
}

export class CommodityAmount extends ValueObject<ICommodityAmountProps>  {

  private constructor(props: ICommodityAmountProps) {
    super(props);
  };

  get value(): number {
    return this.props.amount;
  }

  public static create(props: ICommodityAmountProps): Result<CommodityAmount> {
    const amountOrNull = Guard.againstNullOrUndefined(props.amount, '商品金额')
    if (!amountOrNull.succeeded) {
      return Result.fail<CommodityAmount>(amountOrNull.message)
    }

    const amountGreaterThan = Guard.greaterThan(0, props.amount)
    if (!amountGreaterThan.succeeded) {
      return Result.fail<CommodityAmount>(amountGreaterThan.message)
    }

    return Result.ok<CommodityAmount>(new CommodityAmount(props))
  }
}
