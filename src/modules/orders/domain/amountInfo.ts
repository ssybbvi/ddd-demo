import { ValueObject } from '../../../shared/domain/ValueObject'
import { Result } from '../../../shared/core/Result'

export interface IAmountInfoProps {
  amount: number
  reward: number
}

export class AmountInfo extends ValueObject<IAmountInfoProps> {
  private constructor(props: IAmountInfoProps) {
    super(props)
  }

  get amount(): number {
    return this.props.amount
  }

  get reward(): number {
    return this.props.reward
  }

  get paymentAmount(): number {
    return Math.min(this.props.amount - this.props.reward, 0)
  }

  public static create(props: IAmountInfoProps): Result<AmountInfo> {
    const defaultProps: IAmountInfoProps = {
      ...props,
    }

    const model = new AmountInfo(defaultProps)
    return Result.ok<AmountInfo>(model)
  }
}
