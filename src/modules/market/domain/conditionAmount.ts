import { ValueObject } from '../../../shared/domain/ValueObject'

export interface IConditionAmountProps {
  amount: number
}

export class ConditionAmount extends ValueObject<IConditionAmountProps> {}
