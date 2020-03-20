import { ValueObject } from "../../../shared/domain/ValueObject"
import { Result } from "../../../shared/core/Result"
import { Guard } from "../../../shared/core/Guard"

export interface ICommodityPriceProps {
    price: number
  }

  export class CommodityPrice   extends ValueObject<ICommodityPriceProps>  {

    private constructor (props: ICommodityPriceProps) {
      super(props);
    };

    get value(): number {
      return this.props.price;
    }

    public static create(props: ICommodityPriceProps): Result<CommodityPrice> {
        const priceOrNull = Guard.againstNullOrUndefined(props.price, '商品金额')
        if (!priceOrNull.succeeded) {
          return Result.fail<CommodityPrice>(priceOrNull.message)
        }
    
        const priceGreaterThan = Guard.greaterThan(0, props.price)
        if (!priceGreaterThan.succeeded) {
          return Result.fail<CommodityPrice>(priceGreaterThan.message)
        }

      return Result.ok<CommodityPrice>(new CommodityPrice(props))
    }
  }
  