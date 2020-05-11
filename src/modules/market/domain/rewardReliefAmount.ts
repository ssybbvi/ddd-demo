import { ValueObject } from '../../../shared/domain/ValueObject'
import { Result } from '../../../shared/core/Result'
import { Guard, IGuardArgument } from '../../../shared/core/Guard'

export interface IRewardReliefAmountProps {
  type: 'reliefAmount'
  reliefAmount: number
}

export class RewardReliefAmount extends ValueObject<IRewardReliefAmountProps> {
  private constructor(props: IRewardReliefAmountProps) {
    super(props)
  }

  get type(): string {
    return this.props.type
  }

  get reliefAmount(): number {
    return this.props.reliefAmount
  }


  public static create(props: IRewardReliefAmountProps): Result<RewardReliefAmount> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.reliefAmount, argumentName: 'reliefAmount' },
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<RewardReliefAmount>(guardResult.message)
    }

    const model = new RewardReliefAmount({
      ...props,
    })

    return Result.ok<RewardReliefAmount>(model)
  }
}

