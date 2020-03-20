import { ValueObject } from "../../../shared/domain/ValueObject"
import { Result } from "../../../shared/core/Result"
import { Guard } from "../../../shared/core/Guard"

export interface ICommodityNameProps {
    name: string
  }

  export class CommodityName   extends ValueObject<ICommodityNameProps>  {

    private constructor (props: ICommodityNameProps) {
        super(props);
      };

  get value(): string {
    return this.props.name;
  }

    public static create(props: ICommodityNameProps): Result<CommodityName> {
        const nameOrNull = Guard.againstNullOrUndefined(props.name, '商品名称')
        if (!nameOrNull.succeeded) {
          return Result.fail<CommodityName>(nameOrNull.message)
        }
    
        const nameGreaterThan = Guard.againstAtLeast(2, props.name)
        if (!nameGreaterThan.succeeded) {
          return Result.fail<CommodityName>(nameGreaterThan.message)
        }

      return Result.ok<CommodityName>(new CommodityName(props))
    }
  }
  