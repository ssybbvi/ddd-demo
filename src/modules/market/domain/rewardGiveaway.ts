import { ValueObject } from '../../../shared/domain/ValueObject'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'
import { Result } from '../../../shared/core/Result'

export interface IRewardGiveawayProps {
  type: 'giveaway'
  commodityId: string
}
export class RewardGiveaway extends ValueObject<IRewardGiveawayProps> {
  private constructor(props: IRewardGiveawayProps) {
    super(props)
  }

  get type(): string {
    return this.props.type
  }

  get commodityId(): string {
    return this.props.commodityId
  }


  public static create(props: IRewardGiveawayProps): Result<RewardGiveaway> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.commodityId, argumentName: 'commodityId' },
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<RewardGiveaway>(guardResult.message)
    }

    const model = new RewardGiveaway({
      ...props,
    })

    return Result.ok<RewardGiveaway>(model)
  }
}

