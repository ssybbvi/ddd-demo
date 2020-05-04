import { ConditionType } from './conditionType'
import { ValueObject } from '../../../shared/domain/ValueObject'

export interface IConditionDateProps {
  type: 'data'
  beginAt: number
  finishAt: number
}

export class ConditionDate extends ValueObject<IConditionDateProps> {}
