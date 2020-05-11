import { ValueObject } from '../../../shared/domain/ValueObject'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'
import { Result } from '../../../shared/core/Result'

export interface IRewardDiscountProps {
  type: 'discount'
  discount: number
}

export class RewardDiscount extends ValueObject<IRewardDiscountProps> {
  private constructor(props: IRewardDiscountProps) {
    super(props)
  }

  get type(): string {
    return this.props.type
  }

  get discount(): number {
    return this.props.discount
  }


  public static create(props: IRewardDiscountProps): Result<RewardDiscount> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.discount, argumentName: 'discount' },
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<RewardDiscount>(guardResult.message)
    }

    const model = new RewardDiscount({
      ...props,
    })

    return Result.ok<RewardDiscount>(model)
  }
}
