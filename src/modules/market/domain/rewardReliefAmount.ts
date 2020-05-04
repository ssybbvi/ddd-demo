import { ValueObject } from '../../../shared/domain/ValueObject'

export interface IRewardReliefAmountProps {
  type: 'reliefAmount'
  reliefAmount: number
}

export class RewardReliefAmount extends ValueObject<IRewardReliefAmountProps> {}
