import { ValueObject } from '../../../shared/domain/ValueObject'

export interface IAmountInfoProps {
  amount: number
  reward: number
  paymentAmount: number

}

export class AmountInfo extends ValueObject<IAmountInfoProps> { }

