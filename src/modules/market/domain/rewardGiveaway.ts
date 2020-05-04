import { ValueObject } from '../../../shared/domain/ValueObject'

export interface IRewardGiveawayProps {
  type: 'giveaway'
  commodityId: string
}
export class RewardGiveaway extends ValueObject<IRewardGiveawayProps> {}
